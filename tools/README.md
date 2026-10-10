# Adding a book: PDF → website (free-first pipeline)

```bash
python tools/pipeline.py "Cambridge 18/Cambridge 18.pdf" --id 18 --title "Cambridge IELTS 18" --audio-dir "Cambridge 18/Audio"
python tools/validate.py
```

Then add `"data/cambridge-ielts-18.js"` to the list in `index.html` and publish
(`powershell -File tools/publish.ps1 "Add Cambridge 18"`).

Useful flags:
- `--tests 1`: only do Test 1 (handy to try a book or stay inside today's free quota)
- `--pages 1-60`: only part of the PDF
- `--no-scripts`: skip the Listening transcripts
- `--extract-only`: just turn the PDF into Markdown (`work/<id>/pages/`) with no AI calls

## What happens

| Stage | Tools, tried in order (edit `tools/pipeline.toml` to change) | Cost |
|---|---|---|
| 1. Extract | PDF text layer → Docling → Marker → RapidOCR. Near-blank scanned pages (covers, pictures) are skipped after a quick OCR probe. | free, local |
| 2. Structure | Gemini keys → OpenRouter free models → Claude (only if `ANTHROPIC_API_KEY` is set) | free (Claude is paid) |
| 3. Validate | questions 1–40, answers present and valid, images/audio exist, transcript evidence | free |

- One AI call maps the whole book (where each test, part, answer key and transcript is), then one call per
  Listening part / Reading passage, and one per transcript part.
- Answers come from the book's **answer key pages**, and every AI answer is checked by the validator
  rules before it is accepted. A wrong or garbled answer moves on to the next model.
- Rate limit / out of quota → next key → next model → next provider. If **everything** is out,
  progress is saved and `work/<id>/pending.json` is written: **run the same command again later**
  (free quotas reset daily) and it continues where it stopped.
- Transcripts and Reading passages must be **found in the book's pages** (`grounding_min` in
  `pipeline.toml`): text the model made up, or a part copied from another section, is rejected.
  If a section's page is missing from the PDF, its transcript is left empty instead of invented.
- After `max_rejections` failed answers, a piece is skipped and listed in `work/<id>/review.json`, along with
  word answers that are not on the answer-key page (scanned key tables often lose cells in OCR).
  **Read review.json before publishing.**
- `work/<id>/log.txt` shows which tool, model and key handled each piece.

## Keys

Put keys in `tools/.env` (copy `tools/.env.example`). Several keys per provider, comma-separated:
```
GEMINI_API_KEYS=key1,key2
OPENROUTER_API_KEYS=sk-or-v1-a,sk-or-v1-b
ANTHROPIC_API_KEY=
```
`tools/.env` is gitignored, so **never** paste keys anywhere else. The repo is public.

> Free tiers: Google (and some OpenRouter providers) may use what you send to improve their models.
> The books are copyrighted. If that matters for a book, use `--extract-only` plus a rule-based builder
> like `tools/build_practice_reading.py`, which sends nothing anywhere.

## Fixed-format PDFs (no AI at all)
Sets that always look the same (e.g. the Real Tests "FULL PASSAGE" PDFs) use a rule-based builder:
`python tools/build_practice_reading.py <folder with fp1.pdf fp2.pdf fp3.pdf>`.

## Always review before publishing
Open the new test locally, do a part, and look at the results page. The validator catches
missing or invalid answers, but not a wrong-but-valid one: letter answers (A–G) can't be checked
against a scrambled key table, so `tools/compare.py` against a known-good copy is the best test when you have one.

## SAT
`--kind sat` uses Marker first (math → LaTeX, figures as images). For now use `--extract-only`;
the SAT data writer is added once the SAT site's data format is plugged in.
