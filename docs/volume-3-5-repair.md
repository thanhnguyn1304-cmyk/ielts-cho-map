# VOL 3 and VOL 5 repair — 13 October 2026

## Published coverage

Each volume now contains Tests 1–10 for both Listening and Reading: 40 complete
skill tests, 1,600 scored answers. The old VOL 5 draft repeated Test 1's question
layout across different tests; it was discarded. VOL 3 Reading Test 4 was recovered
from the new original-exam source.

Question papers are displayed as zoomable source images beside an interactive
answer sheet. This preserves tables, diagrams, passage layout and question wording.
These scanned pages do not support selecting words for vocabulary notes. Existing
text-based books keep their existing interface.

## Recovered and corrected answers

| Test | Questions | Repair |
| --- | --- | --- |
| VOL 5 Reading Test 4 | 25, 26 | **records; nutrition**. Both rows were absent from the supplied explanation key. Q25 follows paragraph G; Q26 required restoring a missing line from another copy of the passage. |
| VOL 5 Listening Test 3 | 17 | **mobile phone**, replacing the supplied key's “reception”. The transcript says reception for the mobile phone may be unreliable; the question asks what cannot be used. |
| VOL 3 Listening Test 5 | 33 | **light and dark**. The source has two blanks under one question number. |
| VOL 3 Listening Test 5 | 35 | **heart and stomach**, in either order. The supplied key listed only stomach; the transcript confirms both. |
| VOL 3 Reading Test 9 | 6, 8, 14, 21, 22 | **competition; FALSE; E; C; D**, corrected against the questions and passage rather than copied from the erroneous workbook entries. Q4 accepts income/incomes. |

Common key spelling errors were corrected (responsible, coursework, lonely, arid,
combustion, bankruptcy, poison, storing, PlayStation and resonance). TRUE/FALSE and
YES/NO abbreviations were expanded only in their corresponding statement groups;
letter F was preserved in matching questions. OCR-confused Roman numerals and
letter I were checked against the key images. Multi-answer questions use distinct
checkbox selections and accept either order without awarding duplicate credit.

The missing VOL 5 Reading Test 4 line was cross-checked against
[another copy of the passage](https://helik.net/reading/680088ca0ba59c64e43086bd/answers).
Only the omitted fragment is included as a clearly identified repair beside the
original scan. Derived-answer explanations are available after revealing answers.

## Source layout repairs

- VOL 3 Reading Test 9: moved the misplaced Q27–31 page to Passage 3.
- VOL 3 Reading Test 5: split two pages at passage boundaries, retaining all content.
- VOL 3 Reading Test 6: clarified the incorrect “boxes 1–5” instruction for Q11–13.
- VOL 5 Listening Test 4: clarified that the final source page's blanks 1–10 are Q31–40.
- VOL 3 Listening Tests 1–4 use the provided **full-test recording**, shared across
  parts without restarting. These sources are not separate part recordings; learners
  can seek within the complete audio. Other listening tests use individual part files.

## Reproducibility and checks

- `tools/volume-rebuild.json` contains the curated keys, multi-answer groups, page
  boundaries and correction explanations.
- `tools/volume-source-manifest.json` records each question PDF's path and SHA-256.
- `python tools/rebuild_volumes.py` regenerates the data and WebP page images from
  the local source PDFs (PyMuPDF/Pillow required).
- `python tools/validate.py` passes across all registered books, including checks
  for all questions 1–40, answer coverage, multi-answer uniqueness, page images and
  audio-file existence.
- `node --check app.js` passes. Browser inspection confirmed the new passage viewer,
  recovered-text note, editable answers, navigation and full-audio duration.
- These checks establish structure and the listed repairs; they are not an
  independent re-solution of every question in the supplied books.

No VOL 3 or VOL 5 test is withheld for a missing answer key in this release.
