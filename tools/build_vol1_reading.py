import os, sys, json, urllib.request, re, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from validate import check_test, group_qs, LETTERS, norm

def load_keys():
    env_path = ROOT / "tools/.env"
    gemini_key, openrouter_key = None, None
    for line in env_path.read_text("utf-8").splitlines():
        if line.startswith("GEMINI_API_KEYS="):
            gemini_key = line.split("=", 1)[1].split(",")[0].strip()
        elif line.startswith("OPENROUTER_API_KEYS="):
            openrouter_key = line.split("=", 1)[1].split(",")[0].strip()
    return gemini_key, openrouter_key

GEMINI_KEY, OPENROUTER_KEY = load_keys()

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

def call_llm(prompt):
    # Try Gemini 3.5 Flash first
    if GEMINI_KEY:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={GEMINI_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        for attempt in range(2):
            try:
                req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=45) as resp:
                    data = json.loads(resp.read().decode())
                    text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    if text.startswith("```"):
                        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
                    return json.loads(text)
            except Exception as e:
                print(f"    Gemini attempt {attempt+1} error: {e}", flush=True)
                time.sleep(2)

    # Fallback to OpenRouter (DeepSeek Chat)
    if OPENROUTER_KEY:
        url = "https://openrouter.ai/api/v1/chat/completions"
        payload = {
            "model": "deepseek/deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }
        for attempt in range(3):
            try:
                req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {OPENROUTER_KEY}"
                })
                with urllib.request.urlopen(req, timeout=60) as resp:
                    data = json.loads(resp.read().decode())
                    text = data["choices"][0]["message"]["content"].strip()
                    if text.startswith("```"):
                        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
                    return json.loads(text)
            except Exception as e:
                print(f"    OpenRouter attempt {attempt+1} error: {e}", flush=True)
                time.sleep(3)

    raise RuntimeError("All LLM providers failed")

def build_passage(test_n, pidx, pages, lo, hi, answers):
    cache_file = ROOT / f"work/converted_v1/t{test_n}_p{pidx}.json"
    if cache_file.exists():
        try:
            cached = json.loads(cache_file.read_text("utf-8"))
            # Quick validate question numbers
            qs = []
            for g in cached.get("groups", []):
                qs += group_qs(g)
            if sorted(qs) == list(range(lo, hi + 1)):
                return cached
        except Exception:
            pass

    # Read OCR texts
    pages_text = []
    for sidx, sp in enumerate(pages, 1):
        ocr_file = ROOT / f"work/vol-reading-ocr/201-{test_n}-{pidx}-{sidx}.json"
        if not ocr_file.exists():
            raise RuntimeError(f"Missing OCR file {ocr_file}")
        d = json.load(open(ocr_file, encoding="utf-8"))
        pages_text.append(f"--- PAGE {sidx} ---\n" + de_columnize(d["lines"]))
    full_ocr = "\n\n".join(pages_text)

    prompt = f"""You are an IELTS test data specialist formatting Reading Passage {pidx} of Test {test_n} (Questions {lo} to {hi}).
Raw OCR lines from the passage and question pages:

{full_ocr}

Known Verified Answers for Questions {lo} to {hi}:
{json.dumps({str(q): answers[str(q)] for q in range(lo, hi + 1)}, indent=2)}

Task:
Produce a clean, valid JSON object with EXACTLY this structure:
{{
  "title": "Passage Title",
  "text": "<h3>Passage Title</h3>\\n<p class=\\"sub\\"><i>Subtitle if any</i></p>\\n<p>Paragraph 1...</p>...",
  "groups": [
    // Array of group objects covering questions {lo} to {hi}
  ]
}}

Group Types:
1. "html":
   {{ "type": "html", "instr": "Questions ...<br>...", "html": "... [[{lo}]] ..." }}
2. "choice" (TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN):
   {{ "type": "choice", "instr": "Questions ...<br>...", "choices": ["TRUE", "FALSE", "NOT GIVEN"], "items": [{{ "q": {lo}, "text": "statement" }}] }}
3. "mcq" (single option):
   {{ "type": "mcq", "instr": "Questions ...<br>...", "items": [{{ "q": {lo}, "text": "question", "options": ["Option A", "Option B", "Option C", "Option D"] }}] }}
4. "match" (matching features/headings/information):
   {{ "type": "match", "instr": "Questions ...<br>...", "letters": "ABCDEFG", "items": [{{ "q": {lo}, "text": "target text" }}] }}
   (Include "boxTitle" and "box": [["A", "desc"], ...] if options are listed in a box)
5. "multi" (choose TWO or THREE letters):
   {{ "type": "multi", "qs": [{lo}, {lo+1}], "instr": "Questions ...<br>Choose TWO letters...", "text": "Which TWO...", "options": ["Option A", "Option B", "Option C", "Option D", "Option E"] }}

Requirements:
- "text" MUST contain the complete, unabridged passage text wrapped in <p> tags. Fix any OCR typos.
- If paragraphs are labeled A, B, C, start each with <b>A</b>, <b>B</b>, etc.
- In "groups", EVERY question number from {lo} to {hi} MUST appear EXACTLY ONCE.
- Check that blanks [[n]] match the answer key and grammar.
- Return PURE JSON only.
"""
    for attempt in range(3):
        res = call_llm(prompt)
        # Validate questions
        qs = []
        for g in res.get("groups", []):
            qs += group_qs(g)
        if sorted(qs) == list(range(lo, hi + 1)):
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            cache_file.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
            return res
        else:
            print(f"    Validation attempt {attempt+1} question mismatch: expected {lo}-{hi}, got {sorted(qs)}", flush=True)
            time.sleep(1)

    raise RuntimeError(f"Failed to generate valid questions for Test {test_n} Passage {pidx}")

def main():
    data_file = ROOT / "data/v1.js"
    from validate import load_books
    books = load_books(["data/v1.js"])
    book = books[0]

    for t in book["tests"]:
        if "reading" not in t: continue
        tn = t["n"]
        print(f"\nProcessing VOL 1 Test {tn} Reading...")
        reading = t["reading"]
        answers = reading["answers"]
        new_passages = []

        ranges = [[1, 13], [14, 26], [27, 40]]
        for pidx, p in enumerate(reading["passages"], 1):
            lo, hi = ranges[pidx - 1]
            print(f"  Passage {pidx} (Q{lo}-Q{hi})...", flush=True)
            res = build_passage(tn, pidx, p.get("sourcePages", []), lo, hi, answers)
            new_passages.append({
                "title": res["title"],
                "text": res["text"],
                "groups": res["groups"]
            })
            print(f"    Done: '{res['title']}' ({len(res['text'])} chars, {len(res['groups'])} groups)")
        reading["passages"] = new_passages

    # Test complete book validation before saving
    from validate import check_test
    print("\nValidating all tests in VOL 1...")
    for t in book["tests"]:
        for skill in (["listening", "reading"] if "listening" in t and "reading" in t else ["listening"] if "listening" in t else ["reading"]):
            errs, warns = check_test(book, t, skill)
            if errs:
                raise RuntimeError(f"Validation failed on Test {t['n']} {skill}: {errs}")
    print("ALL TESTS PASSED VALIDATION!")

    # Write updated v1.js
    new_js = "// VOL 1 - Converted to normal text format\nIELTS.addBook(" + json.dumps(book, ensure_ascii=False, indent=2) + ");\n"
    data_file.write_text(new_js, "utf-8")
    print(f"\nSUCCESS! Updated {data_file}")

if __name__ == "__main__":
    main()
