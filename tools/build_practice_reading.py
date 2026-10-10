"""Build data/practice-reading.js from the 'FULL PASSAGE 1/2/3' PDFs.

Each row of the table of contents (MỤC LỤC ĐỀ) is one practice Reading test made of
Passage 1 + Passage 2 + Passage 3. Passage text, answer keys and the Vietnamese explanations
are extracted from the PDFs; question layouts are described in SETS below.

usage: python tools/build_practice_reading.py <dir with fp1.pdf fp2.pdf fp3.pdf>
"""
import sys, os, re, json, html
import pymupdf

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOOTER = "The real IELTS - Điểm thi IELTS chính thức duy nhất tại Hoàng Mai"


def page_lines(page):
    """Text lines rebuilt from glyph positions: the PDF omits many space characters (esp. after
    Vietnamese letters), so a gap of ~a space width between glyphs becomes a space."""
    out = []
    for b in page.get_text("rawdict")["blocks"]:
        for l in b.get("lines", []):
            s, last = "", None
            for sp in l["spans"]:
                for c in sp["chars"]:
                    if last is not None and c["c"] != " " and not s.endswith(" ") and c["bbox"][0] - last > sp["size"] * 0.15:
                        s += " "
                    s += c["c"]
                    last = c["bbox"][2]
            if s.strip() and s.strip() != FOOTER:
                out.append((b["number"], s.strip()))
    return out


def find_unit(doc, title_key):
    starts = [i for i in range(len(doc)) if doc[i].get_text().lstrip().startswith("READING PASSAGE")] + [len(doc)]
    for a, b in zip(starts, starts[1:]):
        if title_key.lower() in doc[a].get_text()[:400].lower():
            return a, b
    raise SystemExit("not found: " + title_key)


def passage_html(doc, a, b, title, sub=None):
    paras = []
    for p in range(a, b):
        txt = doc[p].get_text()
        if re.match(r"\s*Questions\s+\d", txt):
            break
        blocks = {}
        for bn, line in page_lines(doc[p]):
            blocks.setdefault(bn, []).append(line)
        for bn in sorted(blocks):
            t = " ".join(blocks[bn])
            t = re.sub(r"\s+", " ", t).strip()
            if (t.startswith("READING PASSAGE") or t.startswith("You should spend") or t.startswith("Passage ")
                    or t.lower() == title.lower() or (sub and t in sub)):
                continue
            if paras and (t[:1].islower() or not re.search(r"[.!?’”'\")]$", paras[-1])):
                paras[-1] += " " + t
            else:
                paras.append(t)
    out = [f"<h3>{html.escape(title)}</h3>"]
    if sub:
        out.append(f'<p class="sub"><i>{html.escape(sub)}</i></p>')
    for t in paras:
        t = html.escape(t, quote=False)
        m = re.match(r"^([A-H])\.? (?=[A-Z‘'“])", t)
        if m:
            t = f"<b>{m.group(1)}</b> " + t[m.end():]
        out.append(f"<p>{t}</p>")
    return "\n".join(out)


def key_and_explain(doc, a, b):
    lines, started = [], False
    for p in range(a, b):
        for _, line in page_lines(doc[p]):
            if line == "ANSWER KEY":
                started = True
                continue
            if started:
                lines.append(line)
    text = "\n".join(lines)
    key_part, _, exp_part = text.partition("DETAILED EXPLANATIONS")
    answers = {}
    for m in re.finditer(r"^(\d+)\.\s*(.+)$", key_part, re.M):
        v = m.group(2).strip()
        lm = re.match(r"^([A-I])\.\s", v)  # "A. The work is mentally demanding" -> "A"
        answers[int(m.group(1))] = lm.group(1) if lm else v
    explain = {}
    for m in re.finditer(r"Question (\d+):.*?\n(.*?)(?=\nQuestion \d+:|\Z)", exp_part, re.S):
        body = m.group(2).replace("\n", " ")
        f = {}
        for k, lab in (("quote", "Relevant Text:"), ("vi", "Dịch:"), ("why", "Explanation:"), ("kw", "Keyword:")):
            mm = re.search(re.escape(lab) + r"\s*(.*?)(?=\s(?:Relevant Text:|Dịch:|Explanation:|Keyword:)|$)", body)
            if mm:
                f[k] = re.sub(r"\s+", " ", mm.group(1)).strip().rstrip("*")
        explain[int(m.group(1))] = f
    return answers, explain


TFNG = ("Do the following statements agree with the information given in Reading Passage {p}?<br>"
        "<b>TRUE</b> if the statement agrees with the information<br><b>FALSE</b> if the statement contradicts the information<br>"
        "<b>NOT GIVEN</b> if there is no information on this")
YNNG = ("Do the following statements agree with the claims of the writer in Reading Passage {p}?<br>"
        "<b>YES</b> if the statement agrees with the claims of the writer<br><b>NO</b> if the statement contradicts the claims of the writer<br>"
        "<b>NOT GIVEN</b> if it is impossible to say what the writer thinks about this")


def tf(rng, p, items):
    return {"instr": f"Questions {rng}<br>" + TFNG.format(p=p), "type": "choice", "choices": ["TRUE", "FALSE", "NOT GIVEN"],
            "items": [{"q": q, "text": t} for q, t in items]}


def yn(rng, p, items):
    return {"instr": f"Questions {rng}<br>" + YNNG.format(p=p), "type": "choice", "choices": ["YES", "NO", "NOT GIVEN"],
            "items": [{"q": q, "text": t} for q, t in items]}


def mcq(rng, items):
    return {"instr": f"Questions {rng}<br>Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.", "type": "mcq",
            "items": [{"q": q, "text": t, "options": o} for q, t, o in items]}


def headings(rng, n_par, box, first_q, label="Paragraph"):
    letters = "ABCDEFGH"[:n_par]
    return {"instr": f"Questions {rng}<br>Choose the correct heading for each {label.lower()} from the list of headings below.",
            "type": "match", "boxTitle": "List of Headings", "box": box,
            "items": [{"q": first_q + i, "text": f"{label} {L}"} for i, L in enumerate(letters)]}


SETS = [
    # ---------------- Practice test 1 ----------------
    [
        dict(pdf=1, key="origins of cinema", title="The origins of cinema",
             sub="The 19th-century inventions which led to the birth of the movies",
             groups=[
                 {"instr": "Questions 1–4<br>Label the diagram below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html", "image": "assets/practice/zoetrope.jpg",
                  "html": '<h4 class="center">The Zoetrope</h4><p>[[1]], which is turned by a [[2]]</p>'
                          "<p>series of pictures on a [[3]] strip</p><p>[[4]] through which ‘moving’ images were viewed</p>"},
                 {"instr": "Questions 5–8<br>Complete the table below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<table class="grid"><tr><th>Year</th><th>Invention</th><th>Description</th></tr>'
                          "<tr><td>1861</td><td>Kinematoscope</td><td>displayed 3D images on [[5]]</td></tr>"
                          "<tr><td>1870</td><td>Phasmatrope</td><td>showed an audience images that seemed to [[6]]</td></tr>"
                          "<tr><td>1877</td><td>Praxinoscope</td><td>an improved version of the [[7]]</td></tr>"
                          "<tr><td>1879</td><td>Zoopraxiscope</td><td>projected pictures from a [[8]]</td></tr>"
                          "<tr><td>1890</td><td>Kinetograph</td><td>a motion-picture camera moving a film through its sprocket system</td></tr></table>"},
                 tf("9–13", 1, [
                     (9, "The advantage of Etienne-Jules Marey's invention was the speed with which it could record images."),
                     (10, "William Dickson's system of powering a movie camera with a motor was used for a great many years."),
                     (11, "Several movies made for the cylinder Kinetoscope are still in existence today."),
                     (12, "The Lumière brothers' invention was used to make and show movies."),
                     (13, "None of the audience at the Salon Indien in December 1895 had ever seen a motion picture before.")]),
             ]),
        dict(pdf=2, key="king croc", title="King Croc",
             sub="Crocodiles have existed for more than 200 million years, yet they are obviously not primitive. Karrens P finds out the secret of how they survive as the king reptile.",
             groups=[
                 headings("14–20", 7, [["i", "The effect of water scarcity on crocodile behaviour"], ["ii", "What recent crocodile data has revealed"],
                                       ["iii", "How active crocodile control body temperature"], ["iv", "Crocodile features and their revolution"],
                                       ["v", "Look for a suitable prey"], ["vi", "The opportunity for a unique project"],
                                       ["vii", "Internal organ of crocodile"], ["viii", "An aid to underwater movement"],
                                       ["ix", "Events in the history of crocodile"], ["x", "Matching food to habitat"]], 14),
                 {"instr": "Questions 21–26<br>Complete the summary below.<br>Write <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Aestivation</h4><p>A six-year study of Australian freshwater crocodiles was conducted by Kennetts and Christian. '
                          "During [[21]] of the year, crocodiles move away from creeks, live underground and spend up to [[22]] there, "
                          "and reduction in [[23]] was not observed. Other crocodiles in the Mackline site have access to [[24]] all the time. "
                          "After coming back to creeks there were no signs of [[25]]. This prolonged endurance did not influence [[26]] "
                          "and body state of crocodiles.</p>"},
             ]),
        dict(pdf=3, key="headphones", title="Some Views on the Use of Headphones",
             sub="Whether wearing headphones at work, or in other areas of everyday life, is a good thing or a bad thing has generated a lot of research and opinion.",
             groups=[
                 yn("27–31", 3, [
                     (27, "Young people are easily persuaded by surveys that listening to music is beneficial."),
                     (28, "Different studies share the same conclusions about the desirability of working in silence."),
                     (29, "Some doctors recommend wearing headphones to lower blood pressure."),
                     (30, "Nathaniel Baldwin was a respected government researcher."),
                     (31, "The effect of the invention of headphones is comparable to the effect of the invention of writing.")]),
                 mcq("32–36", [
                     (32, "What does the writer suggest about a service economy?",
                      ["The work is mentally demanding", "It provides employment for younger workers", "It is a small part of a country's economy", "Workers have to live in urban centres"]),
                     (33, "When the writer mentions the historical evidence for early music he is",
                      ["emphasizing the diversity of musical forms", "expressing his frustration with the limited archaeological evidence uncovered",
                       "lending support to the view that music has been important in human history", "creating a geographical map of the evolution of music"]),
                     (34, "What does the writer say about the social effects of listening to music through headphones?",
                      ["It has caused a reduction in the number of people who listen to music", "It has increased people's participation in music events",
                       "It has reduced the global variation of music styles", "It has changed the traditional role of music in society"]),
                     (35, "What does the writer say about personal independence?",
                      ["Americans are unique in their desire for personal independence", "Personal independence is something that can be purchased",
                       "Striving for personal independence is a recent phenomenon", "Personal independence destroys social connections"]),
                     (36, "Why does the writer quote Jonah Lehrer in the last paragraph?",
                      ["to support the writer’s own view", "to draw attention to an authoritative book about music",
                       "to raise awareness of people’s loss of listening skills", "to illustrate how music brings people closer to each other"])]),
                 {"instr": "Questions 37–40<br>Complete the summary using the list of words, <b>A–I</b>, below.", "type": "html",
                  "letters": "ABCDEFGHI",
                  "box": [["A", "courtesy"], ["B", "relationship"], ["C", "difficulty"], ["D", "countryside"], ["E", "suburbs"],
                          ["F", "language"], ["G", "barriers"], ["H", "obstacles"], ["I", "disapproval"]],
                  "html": '<h4 class="center">Headphones and City Living</h4><p>Dr Michael Bull believes that listening to music through headphones has changed the [[37]] '
                          "the wearers of headphones have with public spaces. Living in the centre of cities is becoming popular, as people become less keen on living in the [[38]]. "
                          "In densely populated city centres, headphones form [[39]] that isolate people from fellow citizens and from their environment. "
                          "Wearers of headphones are treated with [[40]] that other people do not receive. This is because if we see someone wearing headphones, "
                          "we believe they must be occupied in some way and should not be interrupted.</p>"},
             ]),
    ],
    # ---------------- Practice test 2 ----------------
    [
        dict(pdf=1, key="whale goes to court", title="The Whale Goes to Court", sub=None,
             groups=[
                 tf("1–7", 1, [
                     (1, "An inspection fee on fish oil was introduced in New York in 1818."),
                     (2, "Samuel Judd argued that the inspection fee should exclude whale oil."),
                     (3, "Judd had been in trouble with city officials before the inspection fee disagreement."),
                     (4, "Many New Yorkers were interested in the court case at the time."),
                     (5, "Traditionally, non-human creatures had been classified in one of three groups."),
                     (6, "Generally speaking, ordinary people thought fish were the lowest form of life."),
                     (7, "Whales were excluded from the Linnaean system in 1818.")]),
                 {"instr": "Questions 8–13<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the text for each answer.",
                  "type": "html",
                  "html": "<h4 class=\"center\">The Trial of December 1818</h4><p><b>The Personalities</b></p><ul>"
                          "<li>Samuel Mitchill worked as a congressman and [[8]].</li><li>The defense wanted Mitchill to present the biology of the case.</li>"
                          "<li>William Sampson called [[9]] as witnesses to appeal to the common sense of the jury.</li></ul>"
                          "<p><b>The Arguments</b></p><ul><li>Sampson’s case was based on the consequences for humans if Judd won.</li>"
                          "<li>Mitchill admitted that scientists had [[10]] about classification.</li>"
                          "<li>New Yorkers disliked Mitchill because his ideas came from [[11]].</li></ul>"
                          "<p><b>Conclusions</b></p><ul><li>In the end, it was [[12]], not Mitchill’s testimony, which helped Judd win.</li>"
                          "<li>Whale oil made a good [[13]] because it was clean.</li></ul>"},
             ]),
        dict(pdf=2, key="eight-hour", title="The Myth of the Eight-hour Sleep", sub=None,
             groups=[
                 headings("14–18", 5, [["i", "Historical reasons why interrupted sleep became uncommon"], ["ii", "Brain structures involved in sleep patterns"],
                                       ["iii", "Potential health issues related to sleep"], ["iv", "Famous cases in literature of sleep"],
                                       ["v", "An analysis of old documents to discover deep patterns"],
                                       ["vi", "Biological and environmental factors preventing people from falling asleep again"],
                                       ["vii", "Scientific evidence that divided sleep is a natural phenomenon"]], 14, label="Section"),
                 {"instr": "Questions 19–23<br>Look at the following statements and the list of researchers below.<br>Match each statement with the correct researcher, <b>A–E</b>.<br><b>NB</b> You may use any letter more than once.",
                  "type": "match", "boxTitle": "List of Academics",
                  "box": [["A", "Thomas Wehr"], ["B", "Roger Ekirch"], ["C", "Craig Koslofsky"], ["D", "Gregg Jacobs"], ["E", "Russell Foster"]],
                  "items": [{"q": 19, "text": "In certain historical periods, the threat of criminal danger led to segmented sleep."},
                            {"q": 20, "text": "Physicians should learn more about treating people with sleeping difficulties."},
                            {"q": 21, "text": "Historically, when people experienced interrupted sleep, they used the waking period at night for different activities."},
                            {"q": 22, "text": "Technological changes in Europe made people more likely to sleep throughout the night."},
                            {"q": 23, "text": "The belief that humans should have a long continuous sleep can be psychologically harmful."}]},
                 {"instr": "Questions 24–26<br>Complete the summary below.<br>Write <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Historical patterns of interrupted sleep</h4><p>Historical evidence seems to show that humans had common sleep patterns which were quite unlike '
                          "today's eight hours of unbroken sleep each night. People habitually went to bed early, soon after [[24]], slept for a while, then woke up for a few hours of activity "
                          "or perhaps to consider, for example, the meaning of [[25]]. There was little else to do at home in the dark, since what little means of lighting they had, such as using "
                          "candles, was costly. In 16th-century Europe, people tended to stay at home at night because they feared the [[26]] in large cities. Once urban street lighting improved, "
                          "night life in cities became popular, and recreational spots, like coffee houses, came to be considered fashionable. Consequently, sleeping patterns also began to change.</p>"},
             ]),
        dict(pdf=3, key="robert louis", title="Robert Louis Stevenson",
             sub="The writer of some of the best-known stories in the English language, including Treasure Island and The Strange Case of Dr. Jekyll and Mr. Hyde.",
             groups=[
                 mcq("27–31", [
                     (27, "In the opinion of the writer, the biographers Balfour and Crouch",
                      ["understated the role played by Stevenson's family", "misunderstood Stevenson's religious beliefs",
                       "overestimated other writers' influence on Stevenson", "elevated Stevenson above his true status as a writer"]),
                     (28, "What point does the writer make about Stevenson in the second paragraph?",
                      ["The public judged him more fairly than the critics.", "Recent criticism of him has been justified.",
                       "Critics argued that his style covered up his faults.", "The ethical nature of his stories was often criticized."]),
                     (29, "According to the writer, the adventure story",
                      ["is more appropriate for books than films.", "can be used by writers to tell moral stories.",
                       "is more fashionable today than in the past.", "has been used by other writers but not Stevenson."]),
                     (30, "What point does the writer make about Stevenson and Scotland?",
                      ["His ideas contrasted with those of many Scots.", "He demonstrated great sympathy for Scotland's problems.",
                       "He was not considered a true Scot as he was not born there.", "His unflattering stories about Scotland angered many Scots."]),
                     (31, "According to the writer, Stevenson's own lifestyle",
                      ["was envied by his friends.", "was responsible for his early death.", "attracted more attention than his books.", "did not prepare him for living in Samoa."])]),
                 yn("32–35", 3, [
                     (32, "Although Oscar Wilde admired Stevenson's work, he believed Stevenson could have written something better."),
                     (33, "Stevenson encouraged Oscar Wilde to start writing."),
                     (34, "Galsworthy had greater respect for Hardy than Stevenson."),
                     (35, "More research is needed regarding Stevenson's influence on Chesterton.")]),
                 {"instr": "Questions 36–40<br>Complete the summary using the list of words, <b>A–I</b>, below.", "type": "html",
                  "letters": "ABCDEFGHI",
                  "box": [["A", "natural ability"], ["B", "critical acclaim"], ["C", "humour"], ["D", "romance"], ["E", "colorful language"],
                          ["F", "technical control"], ["G", "story telling"], ["H", "depth"], ["I", "human nature"]],
                  "html": '<h4 class="center">Robert Louis Stevenson and Sir Walter Scott</h4><p>Opinions differ as to whether Robert Louis Stevenson or Sir Walter Scott should be considered '
                          "Scotland's best writer. Scott had greater [[36]] but Stevenson had more [[37]] and the same distinction can be made between the two composers Shostakovich and Prokofiev. "
                          "It is true that Scott's books showed more [[38]] when it came to tragedy though in an old-fashioned way while Stevenson's books are still popular because of his [[39]]. "
                          "And Stevenson's understanding of [[40]] has resulted in the widespread use of an expression from one of his books.</p>"},
             ]),
    ],
]

# extra accepted spellings of the same answer
ALT = {(1, 21): "dry season|dry seasons", (1, 22): "four months|4 months"}

docs = {n: pymupdf.open(os.path.join(SRC, f"fp{n}.pdf")) for n in (1, 2, 3)}
tests = []
problems = []
for ti, rows in enumerate(SETS, start=1):
    passages, answers, explain = [], {}, {}
    for spec in rows:
        d = docs[spec["pdf"]]
        a, b = find_unit(d, spec["key"])
        text = passage_html(d, a, b, spec["title"], spec["sub"])
        ans, exp = key_and_explain(d, a, b)
        qs = set()
        for g in spec["groups"]:
            if g["type"] == "html":
                qs |= {int(x) for x in re.findall(r"\[\[(\d+)\]\]", g["html"])}
            else:
                qs |= {it["q"] for it in g["items"]}
        for q in sorted(qs):
            if q not in ans:
                problems.append(f"T{ti} {spec['title']} Q{q}: no answer")
            if q not in exp:
                problems.append(f"T{ti} {spec['title']} Q{q}: no explanation")
        answers.update({q: ALT.get((ti, q), ans[q]) for q in qs if q in ans})
        explain.update({q: exp[q] for q in qs if q in exp})
        passages.append({"title": spec["title"], "text": text, "groups": spec["groups"]})
    tests.append({"n": ti, "reading": {"passages": passages, "answers": answers, "explain": explain}})

book = {"id": 101, "title": "Đề luyện Reading", "tests": tests}
js = ("/* Practice Reading tests built from the 'FULL PASSAGE' PDFs by tools/build_practice_reading.py.\n"
      "   Each test = one row of the MỤC LỤC ĐỀ table (Passage 1 + 2 + 3). Do not edit by hand; re-run the builder. */\n"
      "IELTS.addBook(" + json.dumps(book, ensure_ascii=False, indent=1) + ");\n")
open(os.path.join(ROOT, "data", "practice-reading.js"), "w", encoding="utf-8", newline="\n").write(js)
print("tests:", len(tests), "| problems:", problems or "none")
for t in tests:
    print(f"T{t['n']}: {len(t['reading']['answers'])} answers, {len(t['reading']['explain'])} explanations")
