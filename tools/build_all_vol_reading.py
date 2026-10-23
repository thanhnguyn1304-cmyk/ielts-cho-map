import os, sys, json, urllib.request, re, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from validate import check_test, group_qs, LETTERS, norm, load_books

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
    # Primary: DeepSeek via OpenRouter (fast, high quality)
    if OPENROUTER_KEY:
        url = "https://openrouter.ai/api/v1/chat/completions"
        payload = {
            "model": "deepseek/deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }
        for attempt in range(5):
            try:
                req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {OPENROUTER_KEY}"
                })
                with urllib.request.urlopen(req, timeout=90) as resp:
                    data = json.loads(resp.read().decode())
                    text = data["choices"][0]["message"]["content"].strip()
                    if text.startswith("```"):
                        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
                    return json.loads(text)
            except Exception as e:
                wait_sec = 4 * (attempt + 1)
                print(f"    [OpenRouter attempt {attempt+1}] error: {e} - retrying in {wait_sec}s...", flush=True)
                time.sleep(wait_sec)

    # Secondary: Gemini 3.5 Flash
    if GEMINI_KEY:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={GEMINI_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }
        for attempt in range(5):
            try:
                req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=60) as resp:
                    data = json.loads(resp.read().decode())
                    text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    if text.startswith("```"):
                        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
                    return json.loads(text)
            except Exception as e:
                wait_sec = 4 * (attempt + 1)
                print(f"    [Gemini attempt {attempt+1}] error: {e} - retrying in {wait_sec}s...", flush=True)
                time.sleep(wait_sec)

    raise RuntimeError("All LLM calls failed")

def clean_and_fix_group(g, answers):
    # Fix match group missing letters or box
    if g.get("type") == "match":
        if not g.get("letters") and not g.get("box"):
            m = re.search(r"([A-K])\s*[-–]\s*([A-K])", g.get("instr", ""))
            if m:
                start, end = ord(m.group(1)), ord(m.group(2))
                g["letters"] = "".join(chr(c) for c in range(start, end + 1))
            else:
                # Check max letter in answers for these questions
                qs = group_qs(g)
                letters_in_ans = [answers.get(str(q), "").upper() for q in qs if answers.get(str(q), "") in LETTERS]
                max_letter = max(letters_in_ans) if letters_in_ans else "G"
                g["letters"] = LETTERS[:ord(max_letter) - ord('A') + 1]

    # Fix choice group: YES/NO vs TRUE/FALSE
    if g.get("type") == "choice":
        qs = group_qs(g)
        ans_values = [answers.get(str(q), "").upper() for q in qs]
        if any(v in ["YES", "NO"] for v in ans_values):
            g["choices"] = ["YES", "NO", "NOT GIVEN"]
        elif any(v in ["TRUE", "FALSE"] for v in ans_values):
            g["choices"] = ["TRUE", "FALSE", "NOT GIVEN"]

def build_passage(bid, test_n, pidx, pages, lo, hi, answers):
    cache_file = ROOT / f"work/converted_vols/{bid}_t{test_n}_p{pidx}.json"
    if cache_file.exists():
        try:
            cached = json.loads(cache_file.read_text("utf-8"))
            qs = []
            for g in cached.get("groups", []):
                clean_and_fix_group(g, answers)
                qs += group_qs(g)
            if sorted(qs) == list(range(lo, hi + 1)):
                cache_file.write_text(json.dumps(cached, ensure_ascii=False, indent=2), encoding="utf-8")
                return cached
        except Exception:
            pass

    pages_text = []
    for sidx, sp in enumerate(pages, 1):
        ocr_file = ROOT / f"work/vol-reading-ocr/{bid}-{test_n}-{pidx}-{sidx}.json"
        if not ocr_file.exists():
            raise RuntimeError(f"Missing OCR file {ocr_file}")
        d = json.load(open(ocr_file, encoding="utf-8"))
        pages_text.append(f"--- PAGE {sidx} ---\n" + de_columnize(d["lines"]))
    full_ocr = "\n\n".join(pages_text)

    prompt = f"""You are an IELTS test data specialist formatting Reading Passage {pidx} of Test {test_n} in Book {bid} (Questions {lo} to {hi}).
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
        qs = []
        for g in res.get("groups", []):
            clean_and_fix_group(g, answers)
            qs += group_qs(g)
        if sorted(qs) == list(range(lo, hi + 1)):
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            cache_file.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
            return res
        else:
            time.sleep(1)

    raise RuntimeError(f"Failed to generate valid questions for Book {bid} Test {test_n} Passage {pidx}")

def process_book_passages(book_id):
    books = load_books([])
    b = next(x for x in books if x["id"] == book_id)
    tasks = []
    ranges = [[1, 13], [14, 26], [27, 40]]
    for t in b["tests"]:
        if "reading" not in t: continue
        tn = t["n"]
        reading = t["reading"]
        answers = reading["answers"]
        for pidx, p in enumerate(reading.get("passages", []), 1):
            lo, hi = ranges[pidx - 1]
            tasks.append((book_id, tn, pidx, p.get("sourcePages", []), lo, hi, answers))

    print(f"\nProcessing Book {book_id} ({len(tasks)} passages)...")
    results = {}
    with ThreadPoolExecutor(max_workers=3) as pool:
        future_map = {pool.submit(build_passage, *task): task for task in tasks}
        for fut in as_completed(future_map):
            task = future_map[fut]
            bid, tn, pidx = task[0], task[1], task[2]
            try:
                res = fut.result()
                results[(tn, pidx)] = res
                print(f"  [Book {bid}] T{tn} P{pidx}: '{res.get('title')}' ({len(res.get('text', ''))} chars, {len(res.get('groups', []))} groups)")
            except Exception as e:
                print(f"  [Book {bid}] ERROR on T{tn} P{pidx}: {e}")
                raise

    return results

def main():
    books_to_process = [202, 203, 204, 205]
    all_results = {}
    for bid in books_to_process:
        all_results[bid] = process_book_passages(bid)

    print("\n--- Applying Converted Passages to Data Files ---")
    
    # 1. Update data/v3.js and data/v5.js
    for bid in [203, 205]:
        v_num = bid - 200
        path = ROOT / f"data/v{v_num}.js"
        # Load from dump_data
        b = next(x for x in load_books([]) if x["id"] == bid)
        for t in b["tests"]:
            if "reading" not in t: continue
            tn = t["n"]
            new_passages = []
            for pidx in range(1, 4):
                res = all_results[bid][(tn, pidx)]
                new_passages.append({
                    "title": res["title"],
                    "text": res["text"],
                    "groups": res["groups"]
                })
            t["reading"]["passages"] = new_passages
        
        # Test validation for this book
        for t in b["tests"]:
            for s in (["listening", "reading"] if "listening" in t and "reading" in t else ["listening"] if "listening" in t else ["reading"]):
                errs, warns = check_test(b, t, s)
                if errs:
                    raise RuntimeError(f"Validation failed on VOL {v_num} Test {t['n']} {s}: {errs}")

        new_js = f"// VOL {v_num} - Converted to normal text format\nIELTS.addBook(" + json.dumps(b, ensure_ascii=False, indent=2) + ");\n"
        path.write_text(new_js, encoding="utf-8")
        print(f"Saved {path}")

    # 2. Update data/vol-supplement.js (for books 202 and 204)
    supp_path = ROOT / "data/vol-supplement.js"
    supp_content = supp_path.read_text("utf-8")
    
    # Parse existing calls from dump_data
    all_books = load_books([])
    calls = []
    for bid in [204, 202]:
        b = next(x for x in all_books if x["id"] == bid)
        for t in b["tests"]:
            if "reading" not in t: continue
            tn = t["n"]
            new_passages = []
            for pidx in range(1, 4):
                res = all_results[bid][(tn, pidx)]
                new_passages.append({
                    "title": res["title"],
                    "text": res["text"],
                    "groups": res["groups"]
                })
            r_data = {
                "answers": t["reading"]["answers"],
                "passages": new_passages
            }
            if "explain" in t["reading"]:
                r_data["explain"] = t["reading"]["explain"]
            calls.append(f"IELTS.addReading({bid}, {tn}, " + json.dumps(r_data, ensure_ascii=False, indent=2) + ");")

    supp_new = "// Supplemental Reading tests for VOL 4 and VOL 2 - Converted to normal text format\n" + "\n\n".join(calls) + "\n"
    supp_path.write_text(supp_new, encoding="utf-8")
    print(f"Saved {supp_path}")

    print("\nRunning final validation on all books...")
    final_books = load_books([])
    for b in final_books:
        if b["id"] in [202, 203, 204, 205]:
            for t in b["tests"]:
                for s in (["listening", "reading"] if "listening" in t and "reading" in t else ["listening"] if "listening" in t else ["reading"]):
                    errs, warns = check_test(b, t, s)
                    if errs:
                        raise RuntimeError(f"Validation failed on Book {b['id']} Test {t['n']} {s}: {errs}")
    print("\nALL VOLUMES (VOL 1, 2, 3, 4, 5) SUCCESSFULLY CONVERTED AND VALIDATED!")

if __name__ == "__main__":
    main()
