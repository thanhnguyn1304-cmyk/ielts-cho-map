import fitz, glob, os, re, sys, json

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = "assets/recent-writing"
os.makedirs(OUT_DIR, exist_ok=True)

pdf_files = [
    ('fake_recent_ielts_writing/Writing_Task_1_1.8-8.8.pdf', '1.8 - 8.8'),
    ('fake_recent_ielts_writing/Writing_Task_1_9.8-16.8.pdf', '9.8 - 16.8'),
    ('fake_recent_ielts_writing/Writing_Task_1_17.8-24.8.pdf', '17.8 - 24.8'),
    ('fake_recent_ielts_writing/Writing_Task_1_24.8-30.8.pdf', '24.8 - 30.8')
]

def clean_text(s):
    if not s:
        return ""
    return s.replace('\u200b', '').replace('\xa0', ' ').replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')

def classify_task1(prompt, sample_intro, full_sample):
    p = prompt.lower()
    s = sample_intro.lower()
    full = full_sample.lower()
    combined = p + " " + s + " " + full

    # Specific manual overrides for accuracy based on the diagrams:
    if 'uk workers spent traveling' in p or 'transportation in 2009' in p:
        return 'Mixed / Multiple Charts'
    if 'doctors practicing in australia' in p:
        return 'Table'
    if 'trends in population in southern pacific ocean' in p:
        return 'Line Graph'
    if 'percentage of the worlds forest' in p or "world's forests and timber production" in combined:
        return 'Pie Chart'
    if 'internet users who shopped online' in p:
        return 'Bar Chart'
    if 'qualifications of staff in an advertising company' in p:
        return 'Pie Chart'
    if 'adults spend doing different activities in a country in 1958 and 2008' in p or 'adults waste during their working day' in combined:
        return 'Pie Chart'
    if 'energy consumption from five different sources' in combined:
        return 'Pie Chart'
    if 'rate of employed men and women' in combined or 'lines illustrate the reletionship' in p:
        return 'Line Graph'
    if 'mangement posiotions held by women' in p or 'sectors in which women' in combined:
        return 'Table'
    if 'percentage of people in a city in the uk using the internet' in p:
        return 'Bar Chart'
    if 'fire escape plan' in p or 'student accommodation' in p:
        return 'Process / Diagram'

    # Process / Diagram
    if any(k in combined for k in [
        'drinking water is made', 'production of olive oil', 'modern landfill',
        'home smokery', 'structure of solar panel', 'solar panel and its use',
        'position of a volcano', 'volcanic eruption'
    ]):
        return 'Process / Diagram'

    # Map / Plan
    if any(k in combined for k in [
        'the maps', 'the map', 'plans below show', 'plan below shows', 'the two plans',
        'shalton village', 'bridgetown', 'brindell', 'walton museum', 'riverside park',
        'public building', 'ground floor of a library', 'theatre in 2010', 'tv centre',
        'coal mining site', 'museum’s plant', "museum's plant", 'small museum and its surroundings'
    ]):
        return 'Map'

    # Pie Chart
    if 'pie chart' in combined or 'pie charts' in combined:
        return 'Pie Chart'

    # Table
    if 'table below' in p or 'table shows' in p or 'the given table' in combined or 'the table illustrates' in combined:
        return 'Table'

    # Line Graph
    if any(k in combined for k in [
        'line graph', 'lines', 'graph line', 'price in euros of 800 grams',
        'price of bananas', 'car manufacturers', 'absent for a day or more'
    ]):
        return 'Line Graph'

    # Bar Chart
    if any(k in combined for k in [
        'bar chart', 'retirement age', 'self-employed', 'high school',
        'film production', 'sports', 'household expenditure',
        'visitors to a museum', 'tourism-related', 'men and women aged 60-64'
    ]):
        return 'Bar Chart'

    if 'bar' in combined:
        return 'Bar Chart'
    if 'line' in combined:
        return 'Line Graph'

    return 'Bar Chart'

def format_prompt_html(prompt_text):
    # Split into prompt premise and standard instructions
    prompt_text = clean_text(prompt_text)
    # Check if there's "Summarise the information..." or similar
    match = re.search(r'(Summarise the information.*|Summarize the information.*)', prompt_text, re.IGNORECASE)
    if match:
        premise = prompt_text[:match.start()].strip()
        instr = match.group(0).strip()
        return f"<p><b><i>{premise}</i></b></p><p><b><i>{instr}</i></b></p>"
    else:
        return f"<p><b><i>{prompt_text}</i></b></p>"

def format_sample_html(raw_sample):
    raw_sample = clean_text(raw_sample)
    lines = raw_sample.splitlines()
    clean_lines = []
    word_count_note = ""
    for line in lines:
        line = line.strip()
        if not line:
            clean_lines.append("")
            continue
        if re.match(r'^IELTS Mega Test Bank', line, re.IGNORECASE):
            continue
        if re.match(r'^Sample:\s*$', line, re.IGNORECASE):
            continue
        if re.match(r'^\d+\s*words\s*$', line, re.IGNORECASE):
            word_count_note = line
            continue
        clean_lines.append(line)

    # Reassemble paragraphs
    paras = []
    cur_para = []
    for line in clean_lines:
        if not line:
            if cur_para:
                paras.append(" ".join(cur_para))
                cur_para = []
        else:
            cur_para.append(line)
    if cur_para:
        paras.append(" ".join(cur_para))

    refined_paras = []
    for p in paras:
        p = p.strip()
        if not p:
            continue
        # Split on paragraph markers if accidentally merged without blank line in PDF
        sub_paras = re.split(r'(?<=\.)\s+(?=(?:Overall|In terms of|Regarding|Looking first|Turning to|A closer look|Concerning|In detail|In contrast|In conclusion)\b)', p)
        refined_paras.extend([sp.strip() for sp in sub_paras if sp.strip()])

    html_parts = []
    for p in refined_paras:
        p = p.strip()
        if p.startswith("Sample:"):
            p = p[len("Sample:"):].strip()
        if p:
            html_parts.append(f"<p>{p}</p>")
    if word_count_note:
        html_parts.append(f"<p class=\"muted\"><small><b>Độ dài:</b> ~{word_count_note}</small></p>")
    return "\n".join(html_parts)

tests = []
global_test_num = 1

for fpath, batch in pdf_files:
    doc = fitz.open(fpath)
    i = 0
    while i < len(doc):
        txt = doc[i].get_text()
        if 'FOCUS' in txt.upper() and 'TEST' in txt.upper():
            lines = [clean_text(l.strip()) for l in txt.splitlines() if l.strip()]
            tline = [l for l in lines if 'TEST' in l.upper()][0]
            m_sub = re.search(r'TEST\s*(\d+)', tline, re.IGNORECASE)
            sub_num = int(m_sub.group(1)) if m_sub else global_test_num

            # extract prompt text
            prompt_lines = []
            capturing = False
            for l in lines:
                if '20 minutes' in l.lower():
                    capturing = True
                    continue
                if capturing:
                    if 'at least 150 words' in l.lower() or 'mega test bank' in l.lower():
                        break
                    prompt_lines.append(l)
            prompt_raw = " ".join(prompt_lines).strip()

            # locate sample page (can be i+1 or i+2)
            j = i + 1
            sample_raw = ""
            while j < len(doc):
                c = clean_text(doc[j].get_text().strip())
                if c:
                    sample_raw = c
                    break
                j += 1

            sample_intro = ""
            for sl in sample_raw.splitlines():
                sl = sl.strip()
                if sl and not sl.startswith("Sample:") and not sl.startswith("IELTS Mega"):
                    sample_intro = sl
                    break

            # extract image from prompt page
            img_rel_path = f"assets/recent-writing/rw-t{global_test_num}.png"
            img_full_path = os.path.join(OUT_DIR, f"rw-t{global_test_num}.png")

            imgs = doc[i].get_images()
            if imgs:
                xref = imgs[0][0]
                base_img = doc.extract_image(xref)
                with open(img_full_path, "wb") as f_img:
                    f_img.write(base_img["image"])
            else:
                print(f"WARNING: No image on page {i+1} of {fpath}")

            category = classify_task1(prompt_raw, sample_intro, sample_raw)
            prompt_html = format_prompt_html(prompt_raw)
            sample_html = format_sample_html(sample_raw)

            # Brief title for the test
            brief_title = sample_intro if sample_intro else prompt_raw[:80]
            # Clean brief title
            brief_title = re.sub(r'^(The (bar |pie |line )?chart(s)? |The graph(s)? |The (two |three )?map(s)? |The diagram(s)? |The table )', '', brief_title, flags=re.IGNORECASE)
            brief_title = re.sub(r'^(compare(s)?|show(s)?|illustrate(s)?|give(s)? information about|depict(s)?|render(s)?)\s+', '', brief_title, flags=re.IGNORECASE)
            brief_title = brief_title.strip()
            if len(brief_title) > 90:
                brief_title = brief_title[:87].rsplit(' ', 1)[0] + '…'
            if brief_title:
                brief_title = brief_title[0].upper() + brief_title[1:]

            tests.append({
                "n": global_test_num,
                "title": f"Test {global_test_num} ({batch})",
                "batch": batch,
                "batchTest": sub_num,
                "brief": brief_title,
                "writing": [
                    {
                        "task": 1,
                        "type": category,
                        "date": batch,
                        "minutes": 20,
                        "words": 150,
                        "prompt": prompt_html,
                        "image": img_rel_path,
                        "sample": sample_html
                    }
                ]
            })

            global_test_num += 1
            i = j
        i += 1

print(f"Extracted {len(tests)} Task 1 tests from fake_recent_ielts_writing.")

# Now parse the 10 Task 2 tests from VOL 5- ORIGINAL EXAMS/Writing/task 2
t2_files = sorted(glob.glob("VOL 5- ORIGINAL EXAMS/Writing/task 2/*.pdf"))
t2_types = {
    "task 2.1 BUILDING.pdf": ("Opinion / Agree or Disagree", "Preserving historic vs modern buildings"),
    "task 2.2 ANIMAL.pdf": ("Problem & Solution", "Decline in animal and plant species"),
    "task 2.3 MUSIC.pdf": ("Opinion / Agree or Disagree", "Music as a way to reduce stress"),
    "task 2.4 SPORTS.pdf": ("Discussion (Both Views)", "Athletes as positive or negative role models"),
    "task 2.5 COMMON PHENOMENON.pdf": ("Advantages & Disadvantages", "Peer pressure among young people"),
    "task 2.6 CELEBRITIES.pdf": ("Opinion / Agree or Disagree", "Media coverage of celebrities' private lives"),
    "task 2.7 MEDIA.pdf": ("Opinion / Agree or Disagree", "Films and games replacing books in schools"),
    "task 2.8 FRIENDSHIP.pdf": ("Opinion / Agree or Disagree", "Online friendships vs face-to-face friendships"),
    "task 2.9 EDUCATION.pdf": ("Opinion / Agree or Disagree", "Free basic education to reduce poverty"),
    "task 2.10 TRAVEL.pdf": ("Discussion (Both Views)", "Impact of low-cost airline travel")
}

for t2_path in t2_files:
    fname = os.path.basename(t2_path)
    if fname not in t2_types:
        continue
    category, topic_brief = t2_types[fname]
    doc = fitz.open(t2_path)
    full_text = clean_text(doc[0].get_text())

    # Split prompt and model answer
    parts = re.split(r'MODEL\s*ANSWER', full_text, flags=re.IGNORECASE)
    prompt_part = parts[0]
    model_part = parts[1] if len(parts) > 1 else ""

    # Clean prompt
    prompt_lines = [l.strip() for l in prompt_part.splitlines() if l.strip()]
    cleaned_prompt_lines = []
    for l in prompt_lines:
        if re.search(r'Group:\s*original\s*exams', l, re.IGNORECASE) or 'phone:' in l.lower():
            continue
        cleaned_prompt_lines.append(l)

    prompt_html = "<p><b><i>" + "<br>".join(cleaned_prompt_lines) + "</i></b></p><p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>"
    sample_html = format_sample_html(model_part)

    tests.append({
        "n": global_test_num,
        "title": f"Test {global_test_num} (Task 2 - {topic_brief})",
        "batch": "VOL 5 Task 2",
        "batchTest": global_test_num - 57,
        "brief": topic_brief,
        "writing": [
            {
                "task": 2,
                "type": category,
                "date": "Task 2 Real Exam",
                "minutes": 40,
                "words": 250,
                "prompt": prompt_html,
                "sample": sample_html
            }
        ]
    })
    global_test_num += 1

print(f"Total tests (Task 1 + Task 2): {len(tests)}")

# Write to data/recent-writing.js
js_content = f"""/* Recent IELTS Writing tests generated from fake_recent_ielts_writing and real exam topics.
   Categorized by Task 1 and Task 2, and by specific question types. */
IELTS.addBook({{
  id: 102,
  title: "Recent Writing Tests",
  tests: {json.dumps(tests, ensure_ascii=False, indent=2)}
}});
"""

with open("data/recent-writing.js", "w", encoding="utf-8") as f_out:
    f_out.write(js_content)

print("Saved data/recent-writing.js successfully!")
