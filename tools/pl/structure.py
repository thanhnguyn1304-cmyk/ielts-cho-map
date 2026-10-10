"""Stage 2: page Markdown -> site data, using the LLM chain (pl/llm.py).

  map   : one call on a short outline of every page -> where each test / part / passage /
          answer key / transcript is.
  units : one call per Listening part or Reading passage -> question groups + answers
          (answers must come from the book's answer key), rejected by the validator rules
          and retried on the next model if wrong.
  scripts: one call per Listening part -> transcript HTML with <b data-q="n"> evidence.
Every finished piece is cached in work/<book>/units/, so a stopped run resumes.
"""
import json, os, re

GROUP_SCHEMA = {
    "type": "object",
    "properties": {
        "type": {"type": "string", "enum": ["html", "mcq", "choice", "match", "multi"]},
        "instr": {"type": "string"},
        "heading": {"type": "string"},
        "html": {"type": "string"},
        "letters": {"type": "string"},
        "boxTitle": {"type": "string"},
        "box": {"type": "array", "items": {"type": "object", "properties": {"key": {"type": "string"}, "text": {"type": "string"}}, "required": ["key", "text"]}},
        "choices": {"type": "array", "items": {"type": "string"}},
        "items": {"type": "array", "items": {"type": "object", "properties": {
            "q": {"type": "integer"}, "text": {"type": "string"}, "options": {"type": "array", "items": {"type": "string"}}}, "required": ["q", "text"]}},
        "qs": {"type": "array", "items": {"type": "integer"}},
        "text": {"type": "string"},
        "options": {"type": "array", "items": {"type": "string"}},
        "image_page": {"type": "integer"},
    },
    "required": ["type", "instr"],
}
UNIT_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "passage_html": {"type": "string"},
        "groups": {"type": "array", "items": GROUP_SCHEMA},
        "answers": {"type": "array", "items": {"type": "object", "properties": {"q": {"type": "integer"}, "answer": {"type": "string"}}, "required": ["q", "answer"]}},
    },
    "required": ["title", "groups", "answers"],
}
MAP_SCHEMA = {
    "type": "object",
    "properties": {"tests": {"type": "array", "items": {"type": "object", "properties": {
        "n": {"type": "integer"},
        "listening_parts": {"type": "array", "items": {"type": "object", "properties": {"part": {"type": "integer"}, "pages": {"type": "array", "items": {"type": "integer"}}}, "required": ["part", "pages"]}},
        "reading_passages": {"type": "array", "items": {"type": "object", "properties": {"passage": {"type": "integer"}, "pages": {"type": "array", "items": {"type": "integer"}}}, "required": ["passage", "pages"]}},
        "answer_key_pages": {"type": "array", "items": {"type": "integer"}},
        "transcript_pages": {"type": "array", "items": {"type": "integer"}},
    }, "required": ["n"]}}},
    "required": ["tests"],
}

FORMAT_GUIDE = r"""
Output JSON for ONE section of an IELTS test, in this website's format.
- "title": the section topic (e.g. "Cookery Classes", or the reading passage title).
- "passage_html" (Reading only): the full passage as HTML: <h3>title</h3>, optional <p class="sub"><i>subtitle</i></p>,
  then one <p> per paragraph; paragraph letters as <p><b>A</b> text…</p>. Copy the text exactly; do not summarise.
- "groups": the question groups in order. Group types:
  * "html": notes / table / form / flow-chart / summary completion. Put the content in "html" and write each answer
    blank as [[n]] (n = question number). Tables: <table class="grid"><tr><th>…</th></tr>…</table>. Flow-charts:
    <div class="flow"><div>step</div>…</div>. If the blanks are filled with letters from a word box, also give
    "letters" (e.g. "ABCDEFGH") and "box" [{key:"A",text:"word"},…].
  * "mcq": single-answer multiple choice. "items": [{q, text, options:[option text without the letter]}].
  * "choice": TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN. "choices":["TRUE","FALSE","NOT GIVEN"], "items":[{q,text}].
  * "match": matching/headings/map labelling. "items":[{q,text}], and "box":[{key,text}] for the list of options
    (headings i–x, people A–E…). For map/plan/diagram labelling with only letters on a picture, give "letters":"ABCDEFGHI"
    instead of "box", and "image_page": the PDF page number of the picture.
  * "multi": "Choose TWO letters" questions. "qs":[n, n+1], "text": the question, "options":[option texts].
  "instr": the instruction text (e.g. "Questions 1–10<br>Complete the notes below.<br>Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.").
  Any group with a picture (map, diagram, plan) gets "image_page".
- "answers": one entry per question number: the answer from the ANSWER KEY pages, never your own guess.
  Letters for mcq/match/multi ("B"); exact words for gaps; alternatives separated by "|" ("colour|color");
  optional words in brackets ("weekend(s)"). TRUE/FALSE/NOT GIVEN answers in capitals.
Every question number in the range must appear exactly once in the groups and once in "answers".
"""


def outline(pages):
    return "\n".join(f"[page {p}] ({tool}) " + re.sub(r"\s+", " ", text)[:280] for p, (tool, text) in sorted(pages.items()))


def pages_text(pages, nums):
    return "\n\n".join(f"===== PAGE {p} =====\n{pages[p][1]}" for p in nums if p in pages)


def to_site_group(g):
    g = {k: v for k, v in g.items() if v not in (None, "", [])}
    if "box" in g:
        g["box"] = [[b["key"], b["text"]] for b in g["box"]]
    if g.get("type") == "match" and not g.get("box") and not g.get("letters"):
        # "which paragraph, A-F" / "researcher A, B or C": no option list, letters come from the instructions
        i = re.sub(r"<[^>]+>", " ", g.get("instr", ""))
        m = re.search(r"\b([A-Z])\s*[-\u2013\u2014]\s*([A-Z])\b", i)
        if m and m.group(1) < m.group(2):
            g["letters"] = "".join(chr(c) for c in range(ord(m.group(1)), ord(m.group(2)) + 1))
        else:
            m = re.search(r"\b((?:[A-Z],\s*)+[A-Z]\s+or\s+[A-Z])\b", i)
            if m:
                g["letters"] = "".join(re.findall(r"[A-Z]", m.group(1)))
    return g


def unit_check(expected_qs):
    """Validator rules applied to one unit before accepting it."""
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from validate import group_qs, norm, LETTERS

    def check(u):
        probs = []
        try:
            groups = [to_site_group(g) for g in u.get("groups", [])]
            ans = {a["q"]: a["answer"] for a in u.get("answers", [])}
            seen = [q for g in groups for q in group_qs(g)]
        except Exception as e:
            return [f"malformed ({e})"]
        if sorted(seen) != sorted(set(seen)):
            probs.append("question numbers repeat")
        if expected_qs and sorted(set(seen)) != list(expected_qs):
            probs.append(f"questions {sorted(set(seen))[:3]}… do not match expected {expected_qs[0]}–{expected_qs[-1]}")
        missing = [q for q in seen if q not in ans or not str(ans[q]).strip()]
        if missing:
            probs.append(f"no answer for {missing}")
        for g in groups:
            if g["type"] == "mcq":
                for it in g.get("items", []):
                    if str(ans.get(it["q"], "")).upper()[:1] not in LETTERS[:len(it.get("options", []))]:
                        probs.append(f"Q{it['q']} answer not an option letter")
            if g["type"] == "choice":
                for it in g.get("items", []):
                    if norm(ans.get(it["q"], "")) not in [norm(c) for c in g.get("choices", [])]:
                        probs.append(f"Q{it['q']} answer not in choices")
        return probs
    return check


def build_unit(chain, pages, nums, key_pages, skill, label, expected, cache, images_for, min_grounded=None):
    if os.path.exists(cache):
        return json.load(open(cache, encoding="utf-8"))
    prompt = (FORMAT_GUIDE + f"\nThis is the {skill.upper()} section '{label}'. Questions expected: "
              f"{expected[0]}–{expected[-1]}.\n\n--- SECTION PAGES ---\n{pages_text(pages, nums)}"
              f"\n\n--- ANSWER KEY PAGES ---\n{pages_text(pages, key_pages)}")
    imgs = images_for(nums)
    rules, source = unit_check(expected), "\n".join(pages.get(p, ("", ""))[1] for p in nums)

    def check(u):
        probs = rules(u)
        # reading: the passage must be copied from the pages, not written from memory
        if min_grounded and u.get("passage_html"):
            share = grounded(u["passage_html"], source)
            if share < min_grounded:
                probs.append(f"only {share:.0%} of the passage is found in the book pages (need {min_grounded:.0%})")
        return probs
    obj, via = chain.ask_json(prompt, images=imgs, schema=UNIT_SCHEMA, check=check, label=label)
    obj["_via"] = via
    json.dump(obj, open(cache, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return obj


SCRIPT_GUIDE = """Turn this IELTS Listening transcript into HTML for a website.
- One <p> per speaker turn or paragraph. Speaker names as <b class="sp">NAME:</b> at the start of the turn.
- Copy the words exactly.
- Wrap the words that give each answer in <b data-q="N">…</b> (N = question number). If one phrase answers two
  questions (choose-TWO), use data-q="N M". Every question listed below must be marked once.
- The pages may contain several parts: output ONLY the part named below (from its "PART n" heading to the next part).
Return JSON: {"html": "<p>…</p>…"}"""


class NotGrounded(Exception):
    """The source pages do not contain the text this piece needs (e.g. a missing page)."""


def _words(s):
    return re.findall(r"[a-z0-9']+", re.sub(r"<[^>]+>", " ", s).lower())


def _grams(ws, n=4):
    return {tuple(ws[i:i + n]) for i in range(len(ws) - n + 1)}


def grounded(out_html, source):
    """Share of the output's 4-word sequences that also occur in the source text (0..1).
    Low values mean the model wrote text that is not on the pages (invented or misread)."""
    g = _grams(_words(out_html))
    return len(g & _grams(_words(source))) / max(1, len(g))


def section_text(text, n):
    """Text of 'SECTION n' / 'PART n' in transcript pages: '' if that heading is absent while
    other headings exist (the page is missing), None when the pages have no headings at all."""
    heads = [(m.start(), int(m.group(1))) for m in re.finditer(r"(?im)^[#\s]*(?:section|part)\s*(\d)\b", text)]
    if not heads:
        return None
    for i, (pos, k) in enumerate(heads):
        if k == n:
            return text[pos:heads[i + 1][0] if i + 1 < len(heads) else len(text)]
    return ""


def build_script(chain, pages, nums, answers, part_label, expected, cache, part_no=None, min_grounded=0.75):
    if os.path.exists(cache):
        return json.load(open(cache, encoding="utf-8"))["html"]
    ans = "\n".join(f"Q{q}: {answers.get(q, '?')}" for q in expected)
    source = "\n".join(pages.get(p, ("", ""))[1] for p in nums)
    own = section_text(source, part_no) if part_no else None
    if own == "":
        # the book's pages have other sections but not this one: nothing to copy, so any
        # output would be invented. Fail before spending an API call.
        raise NotGrounded(f"{part_label}: no 'SECTION {part_no}' heading in the transcript pages (page missing?)")

    def check(o):
        html = o.get("html", "")
        marked = set()
        for m in re.findall(r'data-q="([\d ]+)"', html):
            marked |= {int(x) for x in m.split()}
        miss = [q for q in expected if q not in marked]
        probs = [f"evidence not marked for {miss}"] if len(miss) > len(expected) // 3 else []
        # the text must come from this part's own pages (catches invented or misplaced parts)
        share = grounded(html, own if own else source)
        if share < min_grounded:
            probs.append(f"only {share:.0%} of the text is found in the book pages (need {min_grounded:.0%})")
        return probs

    obj, via = chain.ask_json(f"{SCRIPT_GUIDE}\n\nQuestions and answers:\n{ans}\n\n--- TRANSCRIPT PAGES ({part_label}) ---\n{pages_text(pages, nums)}",
                              schema={"type": "object", "properties": {"html": {"type": "string"}}, "required": ["html"]},
                              check=check, label=f"script {part_label}")
    json.dump({"html": obj["html"], "_via": via}, open(cache, "w", encoding="utf-8"), ensure_ascii=False)
    return obj["html"]
