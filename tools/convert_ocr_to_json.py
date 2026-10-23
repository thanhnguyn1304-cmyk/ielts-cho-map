import os, sys, json, urllib.request, re, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def get_gemini_key():
    env_path = ROOT / "tools/.env"
    for line in env_path.read_text("utf-8").splitlines():
        if line.startswith("GEMINI_API_KEYS="):
            return line.split("=", 1)[1].split(",")[0].strip()
    raise RuntimeError("GEMINI_API_KEYS not found in tools/.env")

API_KEY = get_gemini_key()
MODEL = "gemini-3.8-flash"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

def de_columnize(lines):
    if not lines: return ""
    xs = [min(p[0] for p in l['box']) for l in lines]
    x_maxs = [max(p[0] for p in l['box']) for l in lines]
    page_min_x = min(xs)
    page_max_x = max(x_maxs)
    page_width = page_max_x - page_min_x
    mid_x = (page_min_x + page_max_x) / 2
    
    left_lines = [l for l in lines if max(p[0] for p in l['box']) < mid_x + 60 and min(p[0] for p in l['box']) < mid_x - 40]
    right_lines = [l for l in lines if min(p[0] for p in l['box']) > mid_x - 60 and max(p[0] for p in l['box']) > mid_x + 40]
    
    if len(left_lines) >= 8 and len(right_lines) >= 8:
        y_col_min = min(min(p[1] for p in l['box']) for l in left_lines + right_lines)
        y_col_max = max(max(p[1] for p in l['box']) for l in left_lines + right_lines)
        
        pre, col1, col2, post = [], [], [], []
        for l in lines:
            ymin = min(p[1] for p in l['box'])
            ymax = max(p[1] for p in l['box'])
            xmin = min(p[0] for p in l['box'])
            xmax = max(p[0] for p in l['box'])
            w = xmax - xmin
            
            if w > page_width * 0.65 or ymax < y_col_min:
                if ymin < (y_col_min + y_col_max) / 2:
                    pre.append((ymin, l['text']))
                else:
                    post.append((ymin, l['text']))
            elif (xmin + xmax) / 2 < mid_x:
                col1.append((ymin, l['text']))
            else:
                col2.append((ymin, l['text']))
        pre.sort()
        col1.sort()
        col2.sort()
        post.sort()
        ordered = [t for _, t in pre] + [""] + [t for _, t in col1] + [""] + [t for _, t in col2] + [""] + [t for _, t in post]
        return "\n".join(ordered)
    else:
        lines_sorted = sorted(lines, key=lambda l: min(p[1] for p in l['box']))
        return "\n".join(l['text'] for l in lines_sorted)

def convert_ocr_to_json(raw_text, lo, hi, answers):
    prompt = f"""You are a professional IELTS test data formatter.
Below is the raw OCR text extracted from an IELTS Academic Reading Passage and its Questions {lo} to {hi}.

Your job is to structure this text into a clean JSON object for the interactive web testing application.

Website Schema:
{{
  "title": "Passage Title",
  "text": "<h3>Passage Title</h3>\\n<p class=\\"sub\\"><i>Subtitle if any</i></p>\\n<p>Paragraph 1...</p>\\n<p>Paragraph 2...</p>",
  "groups": [
    // Array of question group objects covering questions {lo} to {hi}.
  ]
}}

Question Group Schemas:
1. Sentence/note/summary/table gap fill:
   {{
     "type": "html",
     "instr": "Questions 1-7<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
     "html": "<h4 class=\\"center\\">Chinese silk</h4>...<p>emperor wore [[1]] silk indoors</p>..."
   }}
   (Use [[n]] for the input box for question n)

2. Statement True/False/Not Given or Yes/No/Not Given:
   {{
     "type": "choice",
     "instr": "Questions 8-13<br>Do the following statements agree with the information given in Reading Passage 1?<br>In boxes 8-13 on your answer sheet, write<br><b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br><b>NOT GIVEN</b> if there is no information on this",
     "choices": ["TRUE", "FALSE", "NOT GIVEN"],
     "items": [
       {{ "q": 8, "text": "Only the nobility had to pay taxes in the form of silk." }},
       ...
     ]
   }}

3. Multiple Choice (single answer A, B, C, or D):
   {{
     "type": "mcq",
     "instr": "Questions ...<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.",
     "items": [
       {{ "q": 14, "text": "...", "options": ["Option A text", "Option B text", "Option C text", "Option D text"] }}
     ]
   }}

4. Matching headings, features, or information:
   {{
     "type": "match",
     "instr": "Questions ...<br>Choose the correct letter, <b>A-G</b>...",
     "letters": "ABCDEFG",
     "items": [
       {{ "q": 14, "text": "target statement or description" }}
     ]
   }}
   (If there is a box of options/researchers/headings, include "boxTitle": "...", "box": [["A", "..."], ["B", "..."]])

5. Multi-select (e.g. Choose TWO letters):
   {{
     "type": "multi",
     "qs": [20, 21],
     "instr": "Questions 20-21<br>Choose <b>TWO</b> letters, <b>A-E</b>.",
     "text": "Which TWO ...",
     "options": ["A text", "B text", "C text", "D text", "E text"]
   }}

CRITICAL REQUIREMENTS:
- The answer key for questions {lo}-{hi} is:
{json.dumps(answers, indent=2)}
- In "text", reconstruct the full, unabridged reading passage text. Do NOT truncate. Fix any minor OCR misspellings so it is clean, polished English.
- If paragraphs in the passage are labeled with letters (A, B, C...), start each paragraph with <b>A</b>, <b>B</b>, etc.
- In "groups", EVERY question number from {lo} to {hi} MUST appear EXACTLY ONCE.
- Check that the answers in the answer key fit grammatically into the [[n]] gaps or correspond to the questions.
- Return PURE JSON only. No markdown ticks, no preamble.

Raw OCR Text:
{raw_text}
"""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    req = urllib.request.Request(API_URL, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                res = json.loads(resp.read().decode())
                return json.loads(res["candidates"][0]["content"]["parts"][0]["text"])
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}", flush=True)
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("Failed after 5 attempts")

if __name__ == "__main__":
    pages_text = []
    for i in range(1, 5):
        f = ROOT / f"work/vol-reading-ocr/201-1-1-{i}.json"
        d = json.load(open(f, encoding="utf-8"))
        pages_text.append(f"--- PAGE {i} ---\n" + de_columnize(d["lines"]))
    full_raw = "\n\n".join(pages_text)
    
    answers = {
        "1": "white", "2": "paper", "3": "taxes", "4": "gold", "5": "foreign",
        "6": "mummy", "7": "caves", "8": "TRUE", "9": "NOT GIVEN", "10": "FALSE",
        "11": "FALSE", "12": "TRUE", "13": "FALSE"
    }
    
    res = convert_ocr_to_json(full_raw, 1, 13, answers)
    out_path = ROOT / "work/sample_t1_p1_from_ocr.json"
    out_path.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
    print("SUCCESS! Output written to", out_path)
    print("Title:", res.get("title"))
    print("Passage text length:", len(res.get("text", "")))
    print("Groups count:", len(res.get("groups", [])))
    for g in res.get("groups", []):
        print("  Group type:", g.get("type"), "instr:", g.get("instr")[:50])
