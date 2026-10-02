"""Build a Listening transcript (IELTS.addScripts) from a PDF that has a real text layer.

usage: python tools/build_scripts.py <pdf> <book> <test> <first_page> <last_page> <marks.json>
marks.json: {"1": "phrase to highlight for Q1", "15 16": "phrase for Q15/16", ...}
Each phrase is wrapped in <b data-q="..."> at its first occurrence (searching parts in order).
Prints the JS to stdout; reports phrases it could not find on stderr.
"""
import sys, re, json, html
import pymupdf

pdf, book, test, a, b, marks_path = sys.argv[1:7]
doc = pymupdf.open(pdf)
marks = json.load(open(marks_path, encoding="utf-8"))

SKIP = re.compile(r"^(\d{1,3}|Audioscripts|Test \d|TEST \d|Izone\.edu\.vn|(Q\d+(/Q?\d+)?\s*)+|Example)$")
parts, cur = [], None
for pno in range(int(a) - 1, int(b)):
    for blk in doc[pno].get_text("blocks"):
        raw = blk[4].strip()
        if not raw or SKIP.match(raw):
            continue
        if re.match(r"^PART \d$", raw):
            cur = []
            parts.append(cur)
            continue
        if cur is None:
            continue
        m = re.match(r"^([a-z][a-z .']*):\t\s*(.*)$", raw, re.S)
        speaker, text = (m.group(1).upper(), m.group(2)) if m else (None, raw)
        text = re.sub(r"\s*\n\s*", " ", text).strip()
        text = re.sub(r"\s+(Q\d+(/Q?\d+)?)$", "", text)
        # page-break continuation of the previous paragraph
        if cur and not speaker and text[:1].islower() and not re.search(r"[.?!…:”’]$", cur[-1][1]):
            cur[-1][1] += " " + text
            continue
        cur.append([speaker, text])

out_parts = []
for p in parts:
    paras = []
    for sp, t in p:
        t = html.escape(t, quote=False)
        paras.append((f'<b class="sp">{sp}:</b> ' if sp else "") + t)
    out_parts.append(paras)

missing = []
for q, phrase in marks.items():
    ph = html.escape(phrase, quote=False)
    done = False
    for paras in out_parts:
        for i, s in enumerate(paras):
            j = s.find(ph)
            if j >= 0 and "data-q" not in s[max(0, j - 40):j]:
                paras[i] = s[:j] + f'<b data-q="{q}">' + ph + "</b>" + s[j + len(ph):]
                done = True
                break
        if done:
            break
    if not done:
        missing.append(f"Q{q}: {phrase}")

js = f"\nIELTS.addScripts({book}, {test}, [\n" + ",\n\n".join(
    "`" + "\n".join(f"<p>{s}</p>" for s in paras).replace("`", "'") + "`" for paras in out_parts
) + "\n]);\n"
sys.stdout.reconfigure(encoding="utf-8")
print(js)
if missing:
    sys.stderr.reconfigure(encoding="utf-8")
    print("MISSING:\n" + "\n".join(missing), file=sys.stderr)
print(f"parts={len(out_parts)}", file=sys.stderr)
