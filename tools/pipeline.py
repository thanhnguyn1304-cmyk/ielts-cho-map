"""PDF -> website test data, making the most of free tools.

  python tools/pipeline.py "path/to/book.pdf" --kind ielts --id 18 --title "Cambridge IELTS 18" \
        [--audio-dir "Cambridge 18/Audio"] [--pages 1-140] [--no-scripts]

Stages (see tools/README.md):
  1. extract  : text layer -> Docling -> Marker -> RapidOCR (local, free)       work/<id>/pages/
  2. structure: Gemini keys -> OpenRouter keys -> Claude (if a key is set)      work/<id>/units/
  3. validate : the same checks as tools/validate.py, then write data/<slug>.js
If every provider is out of quota, progress is saved and work/<id>/pending.json is written;
just run the same command again later (e.g. tomorrow) and it resumes.
"""
import sys as _sys
_sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # Windows pipes default to cp1252
import argparse, json, os, re, shutil, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pl import ROOT, load_env, load_config, Log
from pl.extract import extract, page_image
from pl.llm import Chain, AllExhausted, NeedsReview
from pl.structure import (MAP_SCHEMA, outline, build_unit, build_script, to_site_group, NotGrounded)
import validate


def natural(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def unverified(ans, keytext, label):
    """Word answers that do not appear in the answer-key text. Usually the OCR dropped a table
    cell and the model filled the gap itself, so a person should check these questions."""
    key = re.sub(r"[^a-z0-9]", "", keytext.lower())
    out = []
    for a in ans:
        alts = [re.sub(r"\(.*?\)|[^a-z0-9]", "", x.lower()) for x in str(a["answer"]).split("|")]
        if any(len(x) > 1 for x in alts) and not any(x and x in key for x in alts):
            out.append(f"{label} Q{a['q']}: answer '{a['answer']}' not found on the answer-key page (check it)")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("--kind", choices=["ielts", "sat"], default="ielts")
    ap.add_argument("--id", type=int, required=True, help="book id on the site, e.g. 18 (practice sets use 100+)")
    ap.add_argument("--title", required=True)
    ap.add_argument("--audio-dir", help="folder with the listening audio, relative to the site root")
    ap.add_argument("--pages", help="only these PDF pages, e.g. 1-60")
    ap.add_argument("--no-scripts", action="store_true", help="skip listening transcripts")
    ap.add_argument("--extract-only", action="store_true")
    ap.add_argument("--tests", help="only these test numbers, e.g. 1 or 1,2")
    a = ap.parse_args()

    if a.kind == "sat":
        raise SystemExit("SAT: extraction works (use --extract-only); the SAT data writer is added when the SAT site's format is known.")

    work = os.path.join(ROOT, "work", str(a.id))
    log = Log(os.path.join(work, "log.txt"))
    cfg, env = load_config(), load_env()
    first, last = (map(int, a.pages.split("-")) if a.pages else (1, None))
    log(f"=== run: {a.pdf} kind={a.kind} id={a.id}")

    # ---------- 1. extract
    pages = extract(a.pdf, work, a.kind, cfg, log, first, last)
    by_tool = {}
    for p, (tool, _) in pages.items():
        by_tool[tool] = by_tool.get(tool, 0) + 1
    log(f"extract done: {len(pages)} pages {by_tool}")
    if a.extract_only:
        return

    chain = Chain(cfg, env, log)
    units_dir = os.path.join(work, "units"); os.makedirs(units_dir, exist_ok=True)
    try:
        # ---------- 2a. map the book
        map_path = os.path.join(work, "map.json")
        if os.path.exists(map_path):
            bmap = json.load(open(map_path, encoding="utf-8"))
        else:
            bmap, via = chain.ask_json(
                "Below is a one-line preview of every page of an IELTS practice book (Listening parts 1–4, Reading passages 1–3 "
                "per test, answer keys, audioscripts). Return where each test's sections are. Use page numbers as given. "
                "Listening parts usually start with 'PART n'/'SECTION n'; reading with 'READING PASSAGE n'. "
                "Include only sections whose questions are in the book. answer_key_pages = pages holding that test's answers; "
                "transcript_pages = that test's audioscript pages.\n\n" + outline(pages),
                schema=MAP_SCHEMA, label="map")
            json.dump(bmap, open(map_path, "w", encoding="utf-8"), indent=1)
        # models often give a section's pages as [first, last]: sections are contiguous, so fill the gaps
        span = lambda ps: list(range(min(ps), max(ps) + 1)) if ps else []
        for t in bmap["tests"]:
            for sec in t.get("listening_parts", []) + t.get("reading_passages", []):
                sec["pages"] = span(sec["pages"])
            for k in ("answer_key_pages", "transcript_pages"):
                t[k] = span(t.get(k, []))
        log("map: " + ", ".join(f"T{t['n']}: L{len(t.get('listening_parts', []))} R{len(t.get('reading_passages', []))}" for t in bmap["tests"]))

        imgdir = os.path.join(work, "images")
        def images_for(nums):  # only send page pictures for pages without good text (scans)
            return [page_image(a.pdf, p) for p in nums if pages.get(p, ("none",))[0] in ("none", "rapidocr")][:4]

        # ---------- 2b. units
        tests, review = [], []
        audio = sorted(os.listdir(os.path.join(ROOT, a.audio_dir)), key=natural) if a.audio_dir else []
        audio = [f for f in audio if re.search(r"\.(mp3|m4a|wav|ogg)$", f, re.I)]
        ai = 0
        only = {int(x) for x in a.tests.split(",")} if a.tests else None
        for t in bmap["tests"]:
            if only and t["n"] not in only:
                ai += len(t.get("listening_parts", []))   # keep audio numbering aligned
                continue
            test = {"n": t["n"]}
            keyp = t.get("answer_key_pages", [])
            keytext = "\n".join(pages.get(p, ("", ""))[1] for p in keyp)
            if t.get("listening_parts"):
                parts, answers = [], {}
                for i, lp in enumerate(sorted(t["listening_parts"], key=lambda x: x["part"])):
                    exp = list(range(i * 10 + 1, i * 10 + 11))
                    try:
                        u = build_unit(chain, pages, lp["pages"], keyp, "listening", f"Test {t['n']} Listening Part {lp['part']}", exp,
                                       os.path.join(units_dir, f"t{t['n']}-L{lp['part']}.json"), images_for)
                    except NeedsReview as e:
                        review.append(str(e)); log(f"NEEDS REVIEW: {e} (part skipped)")
                        ai += 1
                        continue
                    part = {"title": u["title"], "groups": [to_site_group(g) for g in u["groups"]]}
                    if ai < len(audio):
                        part["audio"] = audio[ai]; ai += 1
                    answers.update({x["q"]: x["answer"] for x in u["answers"]})
                    review += unverified(u["answers"], keytext, f"Test {t['n']}")
                    parts.append(part)
                if not a.no_scripts and t.get("transcript_pages"):
                    for i, part in enumerate(parts):
                        exp = list(range(i * 10 + 1, i * 10 + 11))
                        try:
                            part["script"] = build_script(chain, pages, t["transcript_pages"], answers, f"Test {t['n']} PART {i + 1}", exp,
                                                          os.path.join(units_dir, f"t{t['n']}-S{i + 1}.json"), part_no=i + 1,
                                                          min_grounded=cfg["llm"].get("grounding_min", 0.75))
                        except (NeedsReview, NotGrounded) as e:
                            review.append(str(e)); log(f"NEEDS REVIEW: {e} (transcript left empty)")
                test["listening"] = {"parts": parts, "answers": answers}
            if t.get("reading_passages"):
                passages, answers, start = [], {}, 1
                for rp in sorted(t["reading_passages"], key=lambda x: x["passage"]):
                    span = {1: (1, 13), 2: (14, 26), 3: (27, 40)}.get(rp["passage"], (start, start + 13))
                    exp = list(range(span[0], span[1] + 1))
                    try:
                        u = build_unit(chain, pages, rp["pages"], keyp, "reading", f"Test {t['n']} Reading Passage {rp['passage']}", exp,
                                       os.path.join(units_dir, f"t{t['n']}-R{rp['passage']}.json"), images_for,
                                       min_grounded=cfg["llm"].get("grounding_min", 0.75))
                    except NeedsReview as e:
                        review.append(str(e)); log(f"NEEDS REVIEW: {e} (passage skipped)")
                        continue
                    passages.append({"title": u["title"], "text": u.get("passage_html", ""), "groups": [to_site_group(g) for g in u["groups"]]})
                    answers.update({x["q"]: x["answer"] for x in u["answers"]})
                    review += unverified(u["answers"], keytext, f"Test {t['n']}")
                test["reading"] = {"passages": passages, "answers": answers}
            tests.append(test)
    except AllExhausted as e:
        json.dump({"reason": str(e), "hint": "rerun the same command later; finished pieces are kept"},
                  open(os.path.join(work, "pending.json"), "w"), indent=1)
        log(f"STOPPED: {e}. Progress saved; rerun later to resume.")
        sys.exit(2)

    # ---------- images referenced by groups (map/diagram pages) -> assets/<id>/
    adir = os.path.join(ROOT, "assets", f"b{a.id}"); os.makedirs(adir, exist_ok=True)
    for t in tests:
        for skill in ("listening", "reading"):
            for sec in (t.get(skill) or {}).get("parts" if skill == "listening" else "passages", []):
                for g in sec["groups"]:
                    pg = g.pop("image_page", None)
                    if not pg:
                        continue
                    found = sorted([f for f in os.listdir(imgdir) if f.startswith(f"p{pg:03d}-")],
                                   key=lambda f: -os.path.getsize(os.path.join(imgdir, f)))
                    name = f"t{t['n']}-p{pg}.png"
                    if found:
                        shutil.copy(os.path.join(imgdir, found[0]), os.path.join(adir, name))
                    else:
                        open(os.path.join(adir, name), "wb").write(page_image(a.pdf, pg))
                    g["image"] = f"assets/b{a.id}/{name}"

    # ---------- 3. validate + write
    book = {"id": a.id, "title": a.title, "tests": tests}
    if a.audio_dir:
        book["audioDir"] = a.audio_dir.rstrip("/\\").replace("\\", "/") + "/"
    out_json = os.path.join(work, "book.json")
    json.dump(book, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(review, open(os.path.join(work, "review.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in review:
        log(f"needs review: {r}")
    n_err = validate.run([book])
    slug = re.sub(r"[^a-z0-9]+", "-", a.title.lower()).strip("-")
    out_js = os.path.join(ROOT, "data", f"{slug}.js")
    open(out_js, "w", encoding="utf-8", newline="\n").write(
        f"/* {a.title}: generated by tools/pipeline.py from {os.path.basename(a.pdf)}. Review before publishing. */\n"
        f"IELTS.addBook({json.dumps(book, ensure_ascii=False, indent=1)});\n")
    log(f"wrote {out_js} ({'OK' if not n_err else str(n_err) + ' validation error(s) — fix before adding to index.html'})")
    log("Add it to the list in index.html to show it on the site.")


if __name__ == "__main__":
    main()
