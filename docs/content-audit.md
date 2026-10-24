# Test content audit — 25 October 2026

This batch checks test usability and repairs verified content errors. It is not a certification that every answer in the library has been independently verified against its original recording or publication.

## Coverage and validation

- Inventory: 118 listening tests, 132 reading tests, 868 sections, 10,000 questions.
- Structural validation passes: question numbering, answer presence, answer-choice compatibility, source images, assigned audio paths, and unresolved blank markers.
- 2,805 JSDOM form visits pass: every section and question-group route exposes the expected question numbers and answer controls. This is a DOM test, not visual browser or real playback certification.
- Grading regression passes: VOL 1 Test 8 Reading questions 14–19 have a six-question denominator; swapping answers 16/17 works, repeating the same answer earns only one mark, retries preserve first scores, and group attempts do not overwrite passage progress.
- Mission selection and score analytics checks pass. 9,775 questions have unambiguous question-type mappings; 225 legacy mixed/scanned questions remain unclassified.
- All 392 distinct referenced audio files have readable duration headers and section start offsets within their duration. Recovered recordings were checked by source-question comparison and/or speech samples, not a complete human transcription of every recording.
- Recent Reading regeneration: 15 tests, each with 40 answers and 40 explanation entries.

## Completed repairs

### Reading

- Restored original question sets in Recent Reading T3 P2/P3, T4 P2/P3 and T5 P2 from the supplied FULL PASSAGE question pages. Previous imported questions did not reliably match their passages.
- Recent T5 P1: replaced the wrongly paired whale passage / invented replacement text with the supplied original giraffe passage and questions from VOL 9 T3 P1. Q13 is `signals`.
- Restored missing memory-summary distractors in Recent T8 P3, and separated paragraph labels in T5 P2 and T8 P2.
- Restored VOL 8 T4 P2 robot paragraphs F/G from the supplied DOCX. Previous rewritten text lost evidence needed by the questions. The original excerpt is tracked in `tools/original-content-excerpts.json` so repair does not depend on an ignored work file.
- Corrected the Mozart summary option labels and keys in VOL 1 T1 P3 using printed page 18. Converted six malformed summary groups to real fill-in dropdowns, and repaired additional patient-safety and summary dropdown forms.
- Corrected reviewed keys in VOL 1 T8 (water filters), VOL 2 T1 (patient safety), VOL 2 T2, VOL 3 T3 (pesticides), VOL 4 T6, VOL 5 T4 (pencils), VOL 5 T10 (prosopagnosia), and VOL 7 T11 (London). Exact changes are reproducible in `tools/apply_content_repairs.py`.
- Water-filter questions 16/17 accept manure/straw in either order while preventing a duplicate answer from scoring twice.
- VOL 4 T4 P1: restored the missing Bodily-kinesthetic and Naturalist descriptions from a complete online copy, in concise paraphrase because the supplied scan omitted those lines. Corrected the mislabeled Interpersonal heading and Q8 from `other people` to the supplied source key `construction materials`.

### Listening

- Added 34 recovered MP3 files: Cambridge 18 (9), VOL 2 (3), VOL 4 (1), VOL 7 (10), VOL 8 (11). Also reused verified matching recordings already present in the repository. All 33 previously missing audio sections now have a recording.
- VOL 4 T4 P3: the original PDF pp.27–28 and existing recording are about **Willows**. The app had unrelated single-sex-school questions. Restored the original question groups and keys. Q22's duplicated stem is defective in the source PDF; its wording was explicitly corrected to ask how the department found out about Willows, based on the recording and its existing options. This is an editorial repair, not a verbatim original stem.
- Corrected Stone Point keys in VOL 6 T2 P3 against the matching supplied VOL 9 T8 recording/transcript; Elmsden keys in VOL 4 T4 and VOL 6 T6; the music survey in VOL 4 T5; and the guest-bedroom answer in VOL 5 T7.
- VOL 2 T8 P1 now has the matching Wildlife Society recording, the correct `mj@` email prefix, and currency prefix. The old recording was an eye consultation.
- Restored matching office-move and Samuel Prout audio in VOL 2 T8, plus verified reused audio in VOL 7 T5/T6 and VOL 8 T2.
- Rejected an online VOL 8 T2 Part 3 recording because it was about health visitors, not the Performance Arts questions. Only matching Parts 1 and 4 were extracted from that source.

### Practice behavior

Sections with a content warning, missing audio, or missing keys are excluded from automatic practice. Manually opened flagged sections retain a visible warning. Other healthy parts of the same test remain eligible. Cache version is bumped to 68 for this push.

## Remaining review notes

All previously identified passage/audio mismatches and missing-audio sections now have a documented repair. Recent Reading T1 P1 Q6 accepts both the source key form `move` and passage form `moving`.

There are 274 sections without an optional transcript, two transcript-evidence warnings, and 14 word-evidence candidates. These are not confirmed wrong answers; they include dates, numbers, spellings, and word forms that may be stated differently in speech. Cambridge 13 T3's supplied transcript is incomplete. Missing optional transcripts are distinguished from missing test audio.

## Sources and provenance

Local sources: supplied volume PDFs/DOCX, FULL PASSAGE 1/2/3 PDFs (all 45 Recent Reading question sections compared), and matching supplied recordings/transcripts. Original questions are retained; unsupported replacements are not invented.

Recovered audio sources:

- Cambridge 18: [Canberra audio catalogue](https://canberraenglish.edu.vn/tong-hop-file-nghe-ielts-listening-cambridge/), `18-sectionN-partN.mp3`. The page's T4 P3/P4 labels are swapped; the actual audio topics were checked.
- VOL 2 T8 P1: [Wildlife Conservation Society](https://www.ieltsxpress.com/wildlife-conservation-society-ielts-listening/).
- VOL 7 T5 P1/P2: [Mockarena test](https://mockarena.uz/test/25a8a9c0-22e8-4d55-9710-b808b81b6087/listening/1); P4: [Ethics in Engineering](https://www.tutorlistening.com/blog/ethics-in-engineering-ielts-listening).
- VOL 7 T6 P2: [Hollies](https://mockarena.uz/test/1313b029-60be-49b7-94b8-b423a38696d5/listening/2); P3: [Picture books](https://www.tutorlistening.com/blog/what-reason-do-teachers-give-for-using-each-of-the-following-picture-books); P4: [Geography 331](https://www.tutorlistening.com/blog/geography-331-field-trip-d-thi-ielts-listening-actual-test).
- VOL 7 T7 P1: [Places to visit with children](https://www.tutorlistening.com/blog/places-to-visit-with-children-ielts-listening); P4: [EnglishUps test 78](https://englishups.com/ielts-listening-test-78/), extracted from second 1087 through the end (Sciarrino lecture).
- VOL 7 T7 P2/P3: [MKL050](https://murodkamilov.uz/listening/mkl050/), cut from its continuous recording at the School Fair and Environmental Science sections.
- VOL 8 T1 P1: [International student travel](https://mockarena.uz/test/019e1add-72f7-73d6-962c-a1fa5de6cc34/listening/1); P3: [Just-in-time supply](https://www.tutorlistening.com/blog/the-just-in-time-supply-system-jit-de-thi-ielts-listening-actual-test).
- VOL 8 T1 P2: [Bibliostack](https://www.tutorlistening.com/blog/biblio-stack-de-thi-ielts-listening-actual-test-kem-dap-an-transcript); P4: [Dyscalculia](https://www.tutorlistening.com/blog/dyscalculia-de-thi-ielts-listening-actual-test-kem-dap-an-transcript).
- VOL 8 T2 P1/P4: [EnglishUps test 62](https://englishups.com/listening-test-62/), cuts 0–409.5 and 1261.9–1677.8 seconds. P3: [Performance Arts](https://www.tutorlistening.com/blog/feedback-on-second-year-of-performance-arts-course-de-thi-ielts-listening).
- VOL 8 T4 all parts: [Mockarena test](https://mockarena.uz/test/019ec0bc-e336-7010-8c15-c3dd6c7aad2f/listening/1), corresponding parts 1–4.
- VOL 2 T4 P1: [MKL014](https://murodkamilov.uz/listening/mkl014/); VOL 2 T6 P1: [MKL016](https://murodkamilov.uz/listening/mkl016/).
- VOL 4 T6 P4: [EnglishUps test 79](https://englishups.com/ielts-listening-79/), extracted from the Lontar Palm section.
- VOL 4 T4 P1 intelligence descriptions and key: [complete source PDF](https://hldt.skh.vn/media/dshninhbinhninhbinhtvc3tranhungdaobnb2510021419.pdf). The restored descriptions are concise paraphrases because the supplied scan omitted those lines; they are not presented as verbatim text.

Additional cross-checks: [Willows answer key](https://ieltstrainingonline.com/ielts-listening-practice-test-35/), [pesticide village](https://mini-ielts.com/1447/view-solution/reading/the-pesticide-free-village), [memory options](https://tuhoc.dolenglish.vn/memory-champions-or-just-good-at-tricks-de). Local source text and recording evidence take precedence over unverified answer lists.

## Reproduce checks

```text
python tools/apply_content_repairs.py
python tools/build_practice_reading.py
python tools/audit_test_content.py
python tools/validate.py
node tools/check-mission-selection.cjs
node tools/check-score-analytics.cjs
npm install --prefix work/content-check jsdom --no-audit --no-fund
node tools/check-test-forms.cjs
```

Recent Reading regeneration needs the original FULL PASSAGE files. The audit writes its complete inventory and review candidates to `work/content-audit.json`; the committed snapshot is `docs/content-audit-status.json`.
