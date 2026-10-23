import os, sys, json, base64, urllib.request, re, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from validate import check_test

def get_gemini_key():
    env_path = ROOT / "tools/.env"
    for line in env_path.read_text("utf-8").splitlines():
        if line.startswith("GEMINI_API_KEYS="):
            return line.split("=", 1)[1].split(",")[0].strip()
    raise RuntimeError("GEMINI_API_KEYS not found in tools/.env")

API_KEY = get_gemini_key()
MODEL = "gemini-3.8-flash"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

def call_gemini_vision(pages, prompt):
    parts = []
    for p in pages:
        data = (ROOT / p).read_bytes()
        b64 = base64.b64encode(data).decode("utf-8")
        parts.append({"inline_data": {"mime_type": "image/webp", "data": b64}})
    parts.append({"text": prompt})
    
    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    
    req = urllib.request.Request(API_URL, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                res = json.loads(resp.read().decode())
                return json.loads(res["candidates"][0]["content"]["parts"][0]["text"])
        except Exception as e:
            print(f"  [Attempt {attempt+1}] Gemini API error: {e}", flush=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("Failed after 5 attempts")

def convert_passage(book_id, test_n, passage_idx, passage_data, answers):
    pages = [sp["src"] for sp in passage_data.get("sourcePages", [])]
    lo = [1, 14, 27][passage_idx - 1]
    hi = [13, 26, 40][passage_idx - 1]
    passage_answers = {str(q): answers[str(q)] for q in range(lo, hi + 1) if str(q) in answers}
    
    prompt = f"""These images are Reading Passage {passage_idx} and Questions {lo}-{hi} of an IELTS Academic Reading test.
Please transcribe the full passage text and questions into pure JSON adhering to the website schema:

{{
  "title": "Passage Title",
  "text": "<h3>Passage Title</h3>\\n<p>Paragraph 1...</p>\\n<p>Paragraph 2...</p>",
  "groups": [
    // Array of group objects covering questions {lo} to {hi}.
    // Question types:
    // 1. Sentence/note/summary/table gap fill:
    //    {{ "type": "html", "instr": "Questions ...<br>...", "html": "... [[{lo}]] ..." }}
    // 2. TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN:
    //    {{ "type": "choice", "instr": "Questions ...<br>...", "choices": ["TRUE", "FALSE", "NOT GIVEN"], "items": [{{ "q": {lo}, "text": "statement" }}] }}
    //    (or ["YES", "NO", "NOT GIVEN"])
    // 3. Multiple Choice (single answer):
    //    {{ "type": "mcq", "instr": "Questions ...<br>...", "items": [{{ "q": {lo}, "text": "question", "options": ["A text", "B text", "C text", "D text"] }}] }}
    // 4. Matching headings / statements / people:
    //    {{ "type": "match", "instr": "Questions ...<br>...", "letters": "ABCDEF...", "items": [{{ "q": {lo}, "text": "target text" }}] }}
    //    If there is a box of options/names (e.g. researchers or headings), include "boxTitle": "...", "box": [["A", "..."], ["B", "..."]]
    // 5. Multi-select (choose TWO/THREE letters):
    //    {{ "type": "multi", "qs": [{lo}, {lo+1}], "instr": "Questions ...<br>Choose TWO letters...", "text": "Which TWO of the following...", "options": ["Option A text", "Option B text", "Option C text", "Option D text", "Option E text"] }}
  ]
}}

The verified answer key for questions {lo}-{hi} is:
{json.dumps(passage_answers, indent=2)}

CRITICAL REQUIREMENTS:
1. "text" must contain the 100% complete passage text. Do NOT truncate, do NOT summarize. Wrap every paragraph in <p>...</p>. If paragraphs are labeled A, B, C, ..., prefix each with <b>A</b>, <b>B</b>, etc.
2. In "groups", EVERY question number from {lo} to {hi} MUST appear EXACTLY ONCE across the groups.
3. For gap fills using "html", use [[n]] for question n. Verify the blank [[n]] fits grammatically and matches the answer in the answer key.
4. For "choice", use the exact string (e.g. "TRUE", "FALSE", "NOT GIVEN").
5. Return JSON only. No markdown formatting ticks.
"""
    return call_gemini_vision(pages, prompt)

if __name__ == "__main__":
    from validate import load_books
    books = load_books(["data/v1.js"])
    v1 = books[0]
    t1 = v1["tests"][0]
    p1 = t1["reading"]["passages"][0]
    ans = t1["reading"]["answers"]
    res = convert_passage(201, 1, 1, p1, ans)
    out_file = ROOT / "work/test1_p1_converted.json"
    out_file.parent.mkdir(exist_ok=True)
    out_file.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Done! Title:", res.get("title"))
    print("Text length:", len(res.get("text", "")))
    print("Groups count:", len(res.get("groups", [])))
