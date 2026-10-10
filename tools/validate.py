"""Check the site's test data for the mistakes that break a test.

Checks per Listening/Reading test:
  - questions 1..40 each appear exactly once across the groups
  - every question has an answer
  - letter answers (mcq / match / choose-TWO / summary-with-word-list) are one of the offered letters
  - TRUE/FALSE/NOT GIVEN and YES/NO/NOT GIVEN answers are one of the choices
  - choose-TWO pairs have two different answers
  - images referenced by groups exist on disk; listening audio files exist
  - transcripts (when present) mark evidence for every question (<... data-q="n">)

usage: python tools/validate.py                 # everything listed in index.html
       python tools/validate.py data/c13.js     # one file (plus anything it depends on)
       python tools/validate.py --json work/x/book.json   # a pipeline output before it becomes data/*.js
exit code 1 if any error was found.
"""
import sys as _sys
_sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # Windows pipes default to cp1252
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LETTERS = "ABCDEFGHIJ"


def load_books(files):
    out = subprocess.run(["node", os.path.join(ROOT, "tools", "dump_data.js"), *files], capture_output=True, text=True, encoding="utf-8", cwd=ROOT)
    if out.returncode:
        raise SystemExit(out.stderr)
    return json.loads(out.stdout)


def norm(s):
    return re.sub(r"\s+", "", re.sub(r"[.,;:!?\"£$€]", "", str(s).lower()))


def group_qs(g):
    if g["type"] == "html":
        return [int(x) for x in re.findall(r"\[\[(\d+)\]\]", g["html"])]
    if g["type"] == "multi":
        return list(g["qs"])
    return [it["q"] for it in g["items"]]


def check_test(book, test, skill, root=ROOT):
    errs, warns = [], []
    data = test[skill]
    secs = data["parts"] if skill == "listening" else data["passages"]
    answers = {int(k): v for k, v in data.get("answers", {}).items()}
    seen = []
    for si, sec in enumerate(secs):
        for g in sec["groups"]:
            qs = group_qs(g)
            seen += qs
            first = lambda q: str(answers.get(q, "")).split("|")[0].strip()
            if g["type"] == "mcq":
                for it in g["items"]:
                    ok = LETTERS[:len(it["options"])]
                    if first(it["q"]).upper() not in ok:
                        errs.append(f"Q{it['q']}: answer '{first(it['q'])}' not among {ok}")
            elif g["type"] == "choice":
                for it in g["items"]:
                    if norm(first(it["q"])) not in [norm(c) for c in g["choices"]]:
                        errs.append(f"Q{it['q']}: answer '{first(it['q'])}' not in {g['choices']}")
            elif g["type"] == "multi":
                ok = LETTERS[:len(g["options"])]
                vals = [first(q).upper() for q in g["qs"]]
                for q, v in zip(g["qs"], vals):
                    if v not in ok:
                        errs.append(f"Q{q}: answer '{v}' not among {ok}")
                if len(set(vals)) != len(vals):
                    errs.append(f"Q{g['qs']}: choose-TWO answers repeat ({vals})")
            elif g["type"] == "match" and not g.get("box") and not g.get("letters"):
                errs.append(f"Q{qs[0]}-{qs[-1]}: matching group has no options (box) or letters")
            elif g["type"] == "match" or (g["type"] == "html" and g.get("letters")):
                ok = [norm(k) for k, _ in g["box"]] if g.get("box") else [norm(x) for x in g["letters"]]
                for q in qs:
                    if norm(first(q)) not in ok:
                        errs.append(f"Q{q}: answer '{first(q)}' not among the letters offered")
            if g.get("image") and not os.path.exists(os.path.join(root, g["image"])):
                errs.append(f"image missing: {g['image']}")
        if skill == "listening":
            a = sec.get("audio")
            if a and not os.path.exists(os.path.join(root, book.get("audioDir", ""), a)):
                errs.append(f"Part {si + 1}: audio file missing ({a})")
    dup = sorted({q for q in seen if seen.count(q) > 1})
    if dup:
        errs.append(f"questions appear twice: {dup}")
    expect = list(range(1, 41))
    missing = [q for q in expect if q not in seen]
    if missing:
        errs.append(f"questions missing from the layout: {missing}")
    no_ans = [q for q in seen if q not in answers]
    if no_ans:
        errs.append(f"questions without an answer: {no_ans}")
    if skill == "listening" and any(s.get("script") for s in secs):
        marked = set()
        for s in secs:
            for m in re.findall(r'data-q="([\d ]+)"', s.get("script") or ""):
                marked |= {int(x) for x in m.split()}
        miss = [q for q in expect if q not in marked]
        if miss:
            warns.append(f"transcript has no highlighted evidence for: {miss}")
    return errs, warns


def run(books, root=ROOT, quiet=False):
    n_err = 0
    for b in books:
        for t in b["tests"]:
            for skill in ("listening", "reading"):
                if not t.get(skill):
                    continue
                errs, warns = check_test(b, t, skill, root)
                name = f"{b.get('title', b['id'])} · Test {t['n']} · {skill}"
                if errs or warns or not quiet:
                    print(("✗ " if errs else "✓ ") + name)
                for e in errs:
                    print("    ERROR  " + e)
                for w in warns:
                    print("    note   " + w)
                n_err += len(errs)
    print(f"\n{'All good.' if not n_err else str(n_err) + ' error(s).'}")
    return n_err


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["--json"]:
        books = [json.load(open(args[1], encoding="utf-8"))]
    else:
        files = args
        if files:  # transcripts files need their book file loaded first
            files = [f.replace("-scripts", "") for f in files if "-scripts" in f] + files
        books = load_books(files)
    sys.exit(1 if run(books, quiet="--quiet" in args) else 0)
