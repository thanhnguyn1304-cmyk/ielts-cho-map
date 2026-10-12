"""Build data/practice-reading.js from the 'FULL PASSAGE 1/2/3' PDFs.

Each row of the table of contents (MỤC LỤC ĐỀ) is one practice Reading test made of
Passage 1 + Passage 2 + Passage 3. Passage text, answer keys and the Vietnamese explanations
are extracted from the PDFs; question layouts are described in SETS below.

usage: python tools/build_practice_reading.py [dir with fp1/2/3 PDFs]
"""
import sys, os, re, json, html
import pymupdf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pl.extract import page_lines as _page_lines

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else ROOT
FOOTER = r"^The real IELTS - Điểm thi IELTS chính thức duy nhất tại Hoàng Mai$"


def open_fp(n):
    for cand in (f"fp{n}.pdf", f"{n}. FULL PASSAGE {n}. FULL PASSAGE {n}. FULL PASSAGE {n}"):
        p = os.path.join(SRC, cand)
        if os.path.exists(p):
            return pymupdf.open(p)
    raise SystemExit(f"Cannot find FULL PASSAGE {n} PDF in {SRC}")


def page_lines(page):
    # only the footer is dropped here: bare numbers can be real words of a passage line
    return _page_lines(page, drop=[FOOTER])


def find_unit(doc, title_key):
    starts = [i for i in range(len(doc)) if doc[i].get_text().lstrip().startswith("READING PASSAGE")] + [len(doc)]
    for a, b in zip(starts, starts[1:]):
        if title_key.lower() in doc[a].get_text()[:450].lower():
            return a, b
    raise SystemExit("not found: " + title_key)


def passage_html(doc, a, b, title, sub=None):
    paras = []
    for p in range(a, b):
        txt = doc[p].get_text()
        if re.match(r"\s*Questions?\s+\d", txt):
            break
        blocks = {}
        for bn, line in page_lines(doc[p]):
            blocks.setdefault(bn, []).append(line)
        for bn in sorted(blocks):
            t = " ".join(blocks[bn])
            t = re.sub(r"\s+", " ", t).strip()
            if (t.startswith("READING PASSAGE") or t.startswith("You should spend") or t.startswith("Passage ")
                    or t.startswith("Read the text and answer")
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
        m = re.match(r"^([A-K])\.? (?=[A-Z‘'“\"])", t)
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
    for m in re.finditer(r"^(\d+)(?:[–-](\d+))?\.\s*(.+)$", key_part, re.M):
        q1 = int(m.group(1))
        q2 = int(m.group(2)) if m.group(2) else q1
        v = m.group(3).strip()
        if q2 > q1:
            parts = [x.strip() for x in re.split(r"[,/]", v) if x.strip()]
            for qi, qn in enumerate(range(q1, q2 + 1)):
                answers[qn] = parts[qi] if qi < len(parts) else parts[-1]
        else:
            lm = re.match(r"^([A-J])\.\s", v)  # "A. The work is mentally demanding" -> "A"
            answers[q1] = lm.group(1) if lm else re.sub(r"\s*/\s*", "|", v)
    explain = {}
    for m in re.finditer(r"Questions?\s+(\d+)(?:[–-](\d+))?:.*?\n(.*?)(?=\nQuestions?\s+\d+|\Z)", exp_part, re.S):
        q1 = int(m.group(1))
        q2 = int(m.group(2)) if m.group(2) else q1
        body = m.group(3).replace("\n", " ")
        f = {}
        for k, lab in (("quote", "Relevant Text:"), ("vi", "Dịch:"), ("why", "Explanation:"), ("kw", "Keyword:")):
            mm = re.search(re.escape(lab) + r"\s*(.*?)(?=\s(?:Relevant Text:|Dịch:|Explanation:|Keyword:)|$)", body)
            if mm:
                f[k] = re.sub(r"\s+", " ", mm.group(1)).strip().rstrip("*")
        for qn in range(q1, q2 + 1):
            explain[qn] = f
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
    letters = "ABCDEFGHIJK"[:n_par]
    return {"instr": f"Questions {rng}<br>Choose the correct heading for each {label.lower()} from the list of headings below.",
            "type": "match", "boxTitle": "List of Headings", "box": box,
            "items": [{"q": first_q + i, "text": f"{label} {L}"} for i, L in enumerate(letters)]}


def par_match(rng, p, letters, items, nb=False, label="paragraph"):
    L = f"{letters[0]}–{letters[-1]}"
    instr = (f"Questions {rng}<br>Reading Passage {p} has {len(letters)} {label}s, <b>{L}</b>.<br>"
             f"Which {label} contains the following information?<br>Write the correct letter, <b>{L}</b>.")
    if nb:
        instr += "<br><b>NB</b> You may use any letter more than once."
    return {"instr": instr, "type": "match", "letters": letters,
            "items": [{"q": q, "text": t} for q, t in items]}


def box_match(rng, instr_extra, box_title, box, items, nb=False):
    L = f"{box[0][0]}–{box[-1][0]}"
    instr = f"Questions {rng}<br>{instr_extra}<br>Write the correct letter, <b>{L}</b>."
    if nb:
        instr += "<br><b>NB</b> You may use any letter more than once."
    return {"instr": instr, "type": "match", "boxTitle": box_title, "box": box,
            "items": [{"q": q, "text": t} for q, t in items]}


def multi2(q1, q2, text, options):
    return {"instr": f"Questions {q1}–{q2}<br>Choose <b>TWO</b> letters, <b>A–E</b>.",
            "type": "multi", "qs": [q1, q2], "text": text, "options": options}


GIRAFFES_HTML = """<h3>New Understanding of Giraffes in the Wild</h3>
<p>Despite being a favorite in zoos, until recently almost nobody studied giraffes in the wild. All that is changing fast, as a growing number of researchers seek to understand the biology and complex behavior of this graceful giant in its native habitat. Scientist Megan Strauss notes that while people have admired giraffes in captivity for centuries, field studies are now revealing how much we still have to learn about their lives on the African savanna.</p>
<p>The urgency for such research has never been greater: in the past 15 years, the population has fallen some 40 percent due to habitat loss, fragmentation, and poaching. Female giraffes can live 20 years or more in the wild, spending much of their lives in flexible social herds with other females and their offspring. Although calves are vulnerable to lions, hyenas, and leopards, mothers will fight valiantly to keep their young alive — kicking forward and backward with their powerful legs to drive predators away.</p>
<p>Male giraffes, meanwhile, establish a strict social hierarchy related to their necks and horns. Young males often spar gently by leaning against one another. But should a dominant older bull come into view, the younger males instantly try to make themselves look small and innocent by lowering their heads. Serious clashes have been witnessed between adults when each bull repeatedly ‘necks’ the other, swinging its muscular neck and armored skull like a medieval club to win mating rights.</p>
<p>Every part of the giraffe’s body is adapted to its unique lifestyle. The coat has dark patches separated by light hair, which serves as camouflage among the dappled light and shade of woodland trees, while also helping regulate body temperature. At the top of the animal, the giraffe’s mouth, prehensile lips, and 45-centimeter tongue are used to grasp thorny acacia branches and strip leaves almost as humans would grab with their hands. Interestingly, calves are born with proportionally shorter necks than adults; biologists believe the neck grows mostly after birth because giraffe mothers would have a difficult time giving birth to young with longer necks.</p>
<p>Towering up to six meters tall also creates extraordinary physiological challenges for blood circulation and the nervous system. To pump blood two meters up to the brain requires blood pressure twice that of humans, yet when the giraffe lowers its head to drink, blood rushes downward. The outside of a giraffe’s veins are extremely thick, to prevent blood leaking into surrounding tissue under such high pressure. Contrary to a long-standing myth, however, a giraffe does not have an unusually large heart for its body size; instead, its heart has exceptionally thick muscular walls. Finally, because signals from the nerves travel at about the same speed in giraffes as in rats or other mammals, those impulses must cover a much greater distance to reach the brain, meaning a giraffe must rely on keen vision and vigilance to compensate for slightly slower reaction times in its extremities.</p>"""


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
    # ---------------- Practice test 3 ----------------
    [
        dict(pdf=1, key="fishbourne", title="Fishbourne Roman Palace", sub=None,
             groups=[
                 tf("1–6", 1, [
                     (1, "Fishbourne Palace was the first structure to be built on its site."),
                     (2, "Fishbourne Palace was renovated more than once."),
                     (3, "Fishbourne Palace was large in comparison with other Roman palaces in Britain."),
                     (4, "Research is continuing in the area closer to the Fishbourne Palace."),
                     (5, "Researchers agree on the identity of the person for whom Fishbourne Palace was constructed."),
                     (6, "Fishbourne Palace was burnt down by localallus.")]),
                 {"instr": "Questions 7–13<br>Complete the notes below.<br>Choose <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Fishbourne Palace</h4>'
                          "<p><b>Construction</b></p><ul>"
                          "<li>The first buildings on the site contained food for the [[7]]</li>"
                          "<li>The palace building surrounded [[8]]</li>"
                          "<li>In the 2nd and 3rd centuries colour was added to the [[9]] of the palace.</li></ul>"
                          "<p><b>Discovery</b></p><ul>"
                          "<li>The first part of the palace to be found was part of a [[10]]</li></ul>"
                          "<p><b>Possible inhabitants</b></p><ul>"
                          "<li>Cogidubnus – he is named in several writings</li>"
                          "<li>Sallustius Lucullus – he may have lived there until approximately [[11]] AD</li>"
                          "<li>Verica – a British king</li>"
                          "<li>Catuarus – his [[12]] was found there</li></ul>"
                          "<p><b>Present Day</b></p><ul>"
                          "<li>A [[13]] has been built on the site to help protect it.</li></ul>"},
             ]),
        dict(pdf=2, key="facial expressions", title="The purpose of facial expressions",
             sub="Do the ways we use our faces have set functions that were developed at an early stage of human history?",
             groups=[
                 par_match("14–18", 2, "ABCDEFG", [
                     (14, "a summary of how the study of facial expressions has progressed"),
                     (15, "a reason why an earlier theory about facial expressions was rejected"),
                     (16, "a reference to a possible link between facial expressions and the survival of the species"),
                     (17, "an example of how a single facial expression can have different causes"),
                     (18, "an explanation of how a study of facial expressions was carried out")], nb=True),
                 box_match("19–23", "Look at the following statements (Questions 19–23) and the list of researchers below.<br>Match each statement with the correct researcher, <b>A–E</b>.",
                           "List of Researchers",
                           [["A", "Paul Ekman"], ["B", "Alan Fridlund"], ["C", "James Russell"], ["D", "Linda Camras"], ["E", "Joseph Campos"]],
                           [(19, "People's facial expressions are shaped by their social environment."),
                            (20, "Certain facial expressions are common to people from all backgrounds."),
                            (21, "Infants' facial expressions do not always reflect their emotional state."),
                            (22, "Facial expressions have a purpose related to human interaction."),
                            (23, "A mother's facial expression can influence a baby's behaviour.")]),
                 {"instr": "Questions 24–26<br>Complete the sentences below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>24. According to Alan Fridlund, a [[24]] may be used to show either happiness or politeness.</p>"
                          "<p>25. Fridlund views facial expressions as part of a [[25]] between people.</p>"
                          "<p>26. Researchers in the Behavioral Ecology View consider facial expressions to be [[26]] for social negotiation.</p>"},
             ]),
        dict(pdf=3, key="tuatara", title="The Tuatara—Past and Future", sub=None,
             groups=[
                 mcq("27–31", [
                     (27, "What does the writer say about the tuatara in the first paragraph?",
                      ["They are closely related to modern lizards.", "They were once found only in the northern hemisphere.",
                       "They are the only surviving members of an ancient group of reptiles.", "They have changed significantly over the past 220 million years."]),
                     (28, "Why did tuatara disappear from the main islands of New Zealand?",
                      ["Climatic changes made the mainland too cold.", "Mammals introduced by humans preyed on them.",
                       "Their main food source died out.", "Volcanic activity destroyed their burrows."]),
                     (29, "What was discovered about tuatara on Brothers Island in the 1990s?",
                      ["They were growing faster than tuatara on other islands.", "They belonged to a distinct species of tuatara.",
                       "They had developed immunity to rat predation.", "They were laying eggs twice a year."]),
                     (30, "Why is temperature-dependent sex determination a problem for tuatara?",
                      ["Cooler temperatures prevent eggs from hatching.", "Females only mate during warmer summers.",
                       "Male tuatara do not survive well in warm burrows.", "Rising temperatures could result in too many males being born."]),
                     (31, "What have researchers suggested doing if island habitats become too warm for tuatara?",
                      ["building artificial shade over nesting sites", "incubating all tuatara eggs in laboratories",
                       "introducing heat-tolerant plants to the islands", "moving tuatara to cooler southern locations"])]),
                 yn("32–35", 3, [
                     (32, "The Stephen's Island wren was driven to extinction by a single predator."),
                     (33, "Eradicating pests from offshore islands has helped tuatara populations recover."),
                     (34, "Tuatara at the Karori Wildlife Sanctuary have bred more rapidly than expected."),
                     (35, "Conservationists agree that relocating species outside their historic range is always safe.")]),
                 {"instr": "Questions 36–40<br>Complete the summary using the list of words, <b>A–H</b>, below.",
                  "type": "html", "letters": "ABCDEFGH",
                  "box": [["A", "natural evolution"], ["B", "imagination"], ["C", "indigenous plants"], ["D", "trout"],
                          ["E", "pollution"], ["F", "possibility"], ["G", "native fish"], ["H", "extinction"]],
                  "html": '<h4 class="center">Assisted colonisation of tuatara</h4>'
                          "<p>Conservationists are considering moving tuatara to cooler areas, a strategy that requires bold [[36]] as the climate warms. "
                          "However, introducing a species to a new habitat carries risks: in the past, the introduction of [[37]] into New Zealand rivers "
                          "had a devastating impact on [[38]]. Nevertheless, scientists argue that assisted colonisation is a realistic [[39]] "
                          "when the alternative for the tuatara is [[40]].</p>"},
             ]),
    ],
    # ---------------- Practice test 4 ----------------
    [
        dict(pdf=1, key="bar code", title="The history of the bar code", sub=None,
             groups=[
                 {"instr": "Questions 1–5<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Early bar code systems</h4>'
                          "<p><b>First bar code</b></p><ul>"
                          "<li>invented by Bernard Silver and Norman Woodland</li>"
                          "<li>the first design was a series of [[1]] drawn on the beach</li>"
                          "<li>system used [[2]] to read the code, which sometimes caused the paper to burn</li>"
                          "<li>the inventors sold their patent to Philco</li></ul>"
                          "<p><b>KarTrak system</b></p><ul>"
                          "<li>developed by David Collins</li>"
                          "<li>used red and blue stripes attached to the side of [[3]]</li>"
                          "<li>the system was abandoned because of [[4]] problems and lack of maintenance</li></ul>"
                          "<p><b>1960s developments</b></p><ul>"
                          "<li>Collins’s company Computer Identics used [[5]] instead of bulbs to read bar codes</li></ul>"},
                 {"instr": "Questions 6–9<br>Complete the table below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Developing the Universal Product Code (UPC)</h4>'
                          '<table class="grid"><tr><th>Stage</th><th>Details</th></tr>'
                          "<tr><td>Grocery industry requirements</td><td>The code had to be small, printable in any [[6]], and readable from any direction.</td></tr>"
                          "<tr><td>RCA’s design</td><td>Used a [[7]] pattern, which often smudged during printing.</td></tr>"
                          "<tr><td>IBM’s design</td><td>Created by George Laurer; used vertical stripes that divided the code into [[8]] halves.</td></tr>"
                          "<tr><td>First product scanned (1974)</td><td>A packet of chewing [[9]] in a supermarket in Ohio.</td></tr></table>"},
                 tf("10–13", 1, [
                     (10, "Supermarkets immediately installed bar code scanners across the US in 1974."),
                     (11, "Consumers were initially suspicious of the introduction of bar code scanning."),
                     (12, "Bar codes allowed supermarkets to stock a wider range of products."),
                     (13, "Laurer received a large financial bonus from IBM for inventing the UPC.")]),
             ]),
        dict(pdf=2, key="attine ants", title="The Fascinating World of Attine Ants", sub=None,
             groups=[
                 par_match("14–19", 2, "ABCDEFGH", [
                     (14, "a comparison between the agricultural methods of attine ants and those of humans"),
                     (15, "an explanation of how leaf-cutter ants prepare plant material for their fungus gardens"),
                     (16, "a reference to the evolutionary origins of fungus-growing ants"),
                     (17, "a description of how ants prevent harmful microorganisms from destroying their crop"),
                     (18, "an account of how a new ant colony establishes its fungus garden"),
                     (19, "a contrast between the diets of different groups of attine ants")], label="section"),
                 box_match("20–24", "Look at the following statements (Questions 20–24) and the list of ant groups below.<br>Match each statement with the correct group of ants, <b>A, B or C</b>.",
                           "List of Ant Groups",
                           [["A", "leaf-cutter ants"], ["B", "lower attine ants"], ["C", "both leaf-cutter and lower attine ants"]],
                           [(20, "They collect dead plant matter and insect droppings to feed their fungus."),
                            (21, "They cut fresh leaves and flowers to cultivate their fungus."),
                            (22, "They rely on their fungus garden to nourish their developing young."),
                            (23, "They live in colonies that can contain millions of individuals."),
                            (24, "They have distinct worker castes of different sizes for specific tasks.")], nb=True),
                 mcq("25–26", [
                     (25, "What did Cameron Currie discover about the whitish crust on the bodies of attine ants?",
                      ["It is a waste product from the fungus garden.", "It consists of bacteria that produce antibiotics against a parasite.",
                       "It helps the ants recognise members of their own colony.", "It protects the ants from drying out in underground tunnels."]),
                     (26, "According to the writer, why is the relationship between attine ants and their fungus remarkable?",
                      ["The ants can survive without the fungus during winter.", "The fungus is able to grow in complete darkness.",
                       "The ants have domesticated only a single species of plant.", "It is a complex mutual dependency that has lasted millions of years."])]),
             ]),
        dict(pdf=3, key="patient safety", title="Improving Patient Safety", sub=None,
             groups=[
                 box_match("27–32", "Look at the following statements (Questions 27–32) and the list of people or organisations below.<br>Match each statement with the correct person or organisation, <b>A–D</b>.",
                           "List of People or Organisations",
                           [["A", "Thea Swayne"], ["B", "Child Accident Prevention Trust"], ["C", "Richard Mawle"], ["D", "Karel van der Waarde"]],
                           [(27, "Packaging design in the pharmaceutical industry often neglects the needs of patients."),
                            (28, "Information leaflets inside medicine packets are frequently too complex for patients to use."),
                            (29, "Child-resistant containers can still fail if adults do not close them properly."),
                            (30, "Strong corporate branding on medicine boxes can cause dangerous confusion."),
                            (31, "Regulatory rules on medicine labelling do not always result in safer packaging."),
                            (32, "Designers should observe how real people interact with medical packaging.")], nb=True),
                 {"instr": "Questions 33–37<br>Complete the summary using the list of words, <b>A–G</b>, below.",
                  "type": "html", "letters": "ABCDEFG",
                  "box": [["A", "consumers"], ["B", "marketing teams"], ["C", "pharmaceutical industry"],
                          ["D", "external designers"], ["E", "in-house designers"], ["F", "design engineers"], ["G", "pharmacist"]],
                  "html": '<h4 class="center">Designing safer medical packaging</h4>'
                          "<p>In the pharmaceutical sector, decisions about packaging appearance are often driven by [[33]] who want to promote brand identity. "
                          "However, experts suggest bringing in [[34]] with fresh perspectives to rethink how medicines are presented. "
                          "Testing prototypes directly with [[35]] can reveal unexpected difficulties in reading labels or opening containers. "
                          "Meanwhile, [[36]] working within drug companies and specialist [[37]] can collaborate to ensure that safety features are practical to manufacture.</p>"},
                 mcq("38–40", [
                     (38, "Why is 'look-alike' medicine packaging a particular problem in pharmacies?",
                      ["It takes up more shelf space than standard boxes.", "Staff working under pressure may pick up the wrong strength or drug.",
                       "It increases the cost of dispensing prescriptions.", "Patients refuse to accept brands they do not recognise."]),
                     (39, "What point does the writer make about over-the-counter medicines?",
                      ["They are safer than prescription-only drugs.", "Buyers often select them quickly without reading the details on the pack.",
                       "They are always stored behind the pharmacy counter.", "Their packaging is strictly uniform across different brands."]),
                     (40, "What is the writer's main conclusion about improving patient safety?",
                      ["Thoughtful design of packaging and information is essential to reduce medication errors.",
                       "Stricter punishments are needed for pharmacists who make dispensing mistakes.",
                       "Patients should only take medicines under the direct supervision of a doctor.",
                       "All medicines should be sold in plain white boxes with identical lettering."])]),
             ]),
    ],
    # ---------------- Practice test 5 ----------------
    [
        dict(pdf=1, key="giraffes in the wild", title="New Understanding of Giraffes in the Wild", sub=None,
             text=GIRAFFES_HTML,
             groups=[
                 tf("1–7", 1, [
                     (1, "The amount of research into giraffes in the wild has increased lately."),
                     (2, "Megan Strauss disapproves of keeping giraffes in zoos."),
                     (3, "The giraffe population has nearly doubled in the last 15 years."),
                     (4, "Female giraffes generally live longer than males."),
                     (5, "Mother giraffes use their legs to protect their calves."),
                     (6, "Young male giraffes hold their necks higher when a stronger male appears."),
                     (7, "Adult male giraffes have been seen fighting each other.")]),
                 {"instr": "Questions 8–13<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Parts of the Giraffe’s Body</h4>'
                          "<p><b>Coat</b></p><ul><li>pattern of dark patches and light hair provides [[8]]</li></ul>"
                          "<p><b>Mouth, lips and tongue</b></p><ul><li>used like human [[9]] to grab branches and pull off leaves</li></ul>"
                          "<p><b>Neck</b></p><ul><li>grows mainly after [[10]] so that it is easier for the mother</li></ul>"
                          "<p><b>Circulatory system</b></p><ul><li>thick [[11]] keep blood from spilling into surrounding tissue</li>"
                          "<li>the giraffe’s [[12]] is of normal size relative to its body</li></ul>"
                          "<p><b>Nervous system</b></p><ul><li>nerve [[13]] need to go farther to reach the brain</li></ul>"},
             ]),
        dict(pdf=2, key="antarctic research", title="Antarctic Research", sub=None,
             groups=[
                 par_match("14–17", 2, "ABCDEF", [
                     (14, "how a vessel was rescued from thick ice"),
                     (15, "the main goals of the Tangaroa's voyage to the Ross Sea"),
                     (16, "why the Ross Sea is considered a unique marine environment"),
                     (17, "the methods used to sample creatures at different depths")]),
                 {"instr": "Questions 18–23<br>Complete the sentences below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>18. Photographs of the sea floor showed large numbers of [[18]] and brittle stars.</p>"
                          "<p>19. Scientists are studying how changes in sea ice affect top [[19]] as well as smaller organisms.</p>"
                          "<p>20. Huge [[20]] in the Ross Sea can scour the seabed and create shelter for marine life.</p>"
                          "<p>21. Researchers discovered giant sponges made of [[21]] growing on the ocean floor.</p>"
                          "<p>22. The Antarctic toothfish has antifreeze proteins in its blood and sharp [[22]] for catching prey.</p>"
                          "<p>23. One unusual plunderfish species has a fleshy barbel hanging from its [[23]].</p>"},
                 box_match("24–26", "Look at the following people (Questions 24–26) and the list of statements below.<br>Match each person with the correct statement, <b>A–G</b>.",
                           "List of Statements",
                           [["A", "designed the deep-sea cameras used on the voyage"],
                            ["B", "filmed the expedition under difficult freezing conditions"],
                            ["C", "discovered a new species of Antarctic whale"],
                            ["D", "repaired the ship's engine during a storm"],
                            ["E", "mapped the volcanic vents on the Ross Sea floor"],
                            ["F", "led the scientific programme aboard the Tangaroa"],
                            ["G", "studied the population and breeding of Antarctic toothfish"]],
                           [(24, "Mary Livingston"),
                            (25, "Stu Hanchet"),
                            (26, "Max Quinn")]),
             ]),
        dict(pdf=3, key="star performers", title="Star Performers", sub=None,
             groups=[
                 par_match("27–32", 3, "ABCDEF", [
                     (27, "disagreement with the view that employing talented people enables companies to achieve top performance"),
                     (28, "a description of what individuals have to do on a regular basis to improve their performance"),
                     (29, "the evidence that exceptional talent exists in all areas of life"),
                     (30, "how different ways of evaluating achievement at work can cause different reactions in employees"),
                     (31, "the belief that the time when an assessment is carried out affects its accuracy"),
                     (32, "the extent to which different talented individuals have contributed to their particular area of achievement")], nb=True),
                 {"instr": "Questions 33–35<br>Answer the questions below.<br>Choose <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>33. How many Western classical composers are identified as exceptionally talented? [[33]]</p>"
                          "<p>34. Which composer initially received little recognition for his work? [[34]]</p>"
                          "<p>35. Who can help improve the performance of people practising daily? [[35]]</p>"},
                 tf("36–40", 3, [
                     (36, "Companies usually hire people on the basis of their character."),
                     (37, "There are some areas of sport that have a greater proportion of talent than others."),
                     (38, "Measures of intelligence accurately predict performance at work."),
                     (39, "There are cases in which talented sportspeople have been overlooked."),
                     (40, "Newly formed organisations have the most highly motivated staff.")]),
             ]),
    ],
    # ---------------- Practice test 6 ----------------
    [
        dict(pdf=1, key="humans and food", title="A Brief History of Humans and Food", sub=None,
             groups=[
                 tf("1–5", 1, [
                     (1, "As the population of the world has grown, the number of different foods people eat has increased."),
                     (2, "Prehistoric humans had a more varied diet than most people living in cities today."),
                     (3, "The development of agriculture led to an immediate improvement in human health."),
                     (4, "Early farmers worked fewer hours than hunter-gatherers."),
                     (5, "In the 19th century, food adulteration was common in industrialised cities.")]),
                 {"instr": "Questions 6–13<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Key Developments in Food History</h4>'
                          "<p><b>Prehistoric Era</b></p><ul>"
                          "<li>Using [[6]] to cook food made it easier to digest and provided more energy for the brain.</li></ul>"
                          "<p><b>Agricultural Revolution</b></p><ul>"
                          "<li>Farming allowed people to store [[7]] for times of shortage.</li>"
                          "<li>Skeletons of early farmers show signs of [[8]] and dental decay due to reliance on a single crop.</li></ul>"
                          "<p><b>Global Exchange (post-1492)</b></p><ul>"
                          "<li>New World crops such as potatoes and [[9]] transformed diets in Europe and Asia.</li></ul>"
                          "<p><b>Industrial Era</b></p><ul>"
                          "<li>Nicolas Appert invented [[10]] to preserve food for French soldiers.</li>"
                          "<li>Railways and [[11]] allowed perishable meat and dairy to be transported over long distances.</li></ul>"
                          "<p><b>20th Century to Present</b></p><ul>"
                          "<li>The Green Revolution used chemical [[12]] and high-yield crop varieties to boost production.</li>"
                          "<li>Today, the global food system faces challenges related to [[13]] and environmental sustainability.</li></ul>"},
             ]),
        dict(pdf=2, key="roller coaster", title="Roller Coaster: The Great Fairground Attraction", sub=None,
             groups=[
                 {"instr": "Questions 14–16<br>Label the diagram below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html", "image": "assets/practice/roller-coaster.png",
                  "html": '<h4 class="center">How a Roller Coaster Train is Pulled Up the Lift Hill</h4>'
                          "<p>14. Coaster cars grip onto a moving [[14]] loop under the track.</p>"
                          "<p>15. Loop winds around a [[15]] at the top and bottom of the hill.</p>"
                          "<p>16. Bottom mechanism is turned by a [[16]].</p>"},
                 {"instr": "Questions 17–21<br>Complete the summary below.<br>Write <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">History of roller coasters</h4>'
                          "<p>Modern roller coasters are descended from 16th-century Russian slides with a surface of [[17]]. "
                          "People climbed to the top, and travelled down in sleds. In France, because of the higher temperatures, "
                          "the wooden surface on the slides was [[18]], and [[19]] were attached to the cars to ease the descent. "
                          "The first US roller coaster was used for transporting [[20]] down a mountainside in carts. "
                          "Initially, these were pulled by mules but in time power was produced by [[21]].</p>"},
                 tf("22–26", 2, [
                     (22, "The earliest modifications to the basic slide were made in France."),
                     (23, "Roller coasters continued to increase in popularity throughout the 1920s and 1930s."),
                     (24, "New roller coaster technology was introduced in the 1970s in response to public demand."),
                     (25, "Roller coasters were less popular for most of the 1980s than in the 1970s and 1990s."),
                     (26, "The design of roller-coaster rides became more varied in the 1990s.")]),
             ]),
        dict(pdf=3, key="australian landscapes", title="200 Years of Australian Landscapes at the Royal Academy in London",
             sub="This exhibition promises to chart the evolution of a nation through its art, but not everyone agrees with the reasons behind the choice of artwork.",
             groups=[
                 yn("27–31", 3, [
                     (27, "As expected, the artworks chosen for the exhibition reflect a narrow interpretation of landscape."),
                     (28, "The Academy rejected Australian suggestions for the subject of the exhibition."),
                     (29, "The colonial relationship meant that early Australian landscape painting followed the traditions of English landscape painting."),
                     (30, "The exhibition reflects the fact that Australian art developed its own particular qualities."),
                     (31, "Contemporary Australian artists have generally rejected British landscape traditions.")]),
                 mcq("32–36", [
                     (32, "What is the writer’s main point in the second paragraph?",
                      ["Australian landscape painting derives from the British tradition.", "Australian landscape painting is more highly regarded than British art.",
                       "Britain is still imposing its principles on Australian art.", "British art cannot be compared to Australian art."]),
                     (33, "What does Joanna Mendelssohn find surprising?",
                      ["Modern Australian landscape painting has great variety.", "The guidelines for the choice of work were very traditional.",
                       "Landscape painting remains a popular subject for British artists.", "The British find the Australian landscape unsuitable as a subject."]),
                     (34, "Shaun Gladwell’s work is included in the exhibition because",
                      ["it adopts a subjective approach to depicting the landscape.", "skateboarding is an inspiration to many Australian artists.",
                       "storms are a significant feature of the Australian landscape.", "Bondi is an iconic Australian location."]),
                     (35, "What was the reason for Soriano including Aboriginal art in the exhibition?",
                      ["It is not well known in London art circles.", "Aboriginal landscape painting influenced Australian settlers.",
                       "It is part of the Australian art tradition and not independent of it.", "Modern Aboriginal painting deals with changes to the landscape."]),
                     (36, "By referring to China, Mendelssohn is making the point that",
                      ["having an exhibition in London is not as important as it used to be.", "young artists in Britain are not interested in Australian art.",
                       "art from Shanghai is more important than Australian art.", "New York is still a preferred destination for young artists."])]),
                 box_match("37–40", "Complete each sentence with the correct ending, <b>A–F</b>, below.",
                           "List of Endings",
                           [["A", "reflects the mood created by the natural environment."],
                            ["B", "demonstrates that the dominant art form in Australia is landscape painting."],
                            ["C", "demonstrates an understanding of the historical importance of the land."],
                            ["D", "showcases a very small number of artists."],
                            ["E", "demonstrates a strong European flavour."],
                            ["F", "shows an acceptance of the unique qualities of Australian art."]],
                           [(37, "In spite of its conservatism, the Royal Academy exhibition"),
                            (38, "Australian art of the early to mid-1800s"),
                            (39, "The modern work by Gladwell chosen for the exhibition"),
                            (40, "Including Aboriginal art in the exhibition")]),
             ]),
    ],
    # ---------------- Practice test 7 ----------------
    [
        dict(pdf=1, key="origin of paper", title="The Origin of Paper", sub=None,
             groups=[
                 tf("1–7", 1, [
                     (1, "The word 'paper' comes from the name of a plant that grew in Egypt."),
                     (2, "Papyrus was cheaper to produce than parchment."),
                     (3, "Before paper was invented, Chinese people wrote on bamboo and silk."),
                     (4, "Cai Lun was the very first person in China to make paper from plant fibres."),
                     (5, "The Chinese kept the method of papermaking secret for several centuries."),
                     (6, "Paper money was first used during the Tang Dynasty."),
                     (7, "European papermakers initially used wood pulp to make paper.")]),
                 {"instr": "Questions 8–13<br>Complete the table below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">The Spread and Evolution of Papermaking</h4>'
                          '<table class="grid"><tr><th>Period / Region</th><th>Materials / Innovations</th></tr>'
                          "<tr><td>105 AD (Han China)</td><td>Cai Lun used tree bark, hemp, rags, and fishing [[8]] to make paper.</td></tr>"
                          "<tr><td>6th–7th centuries</td><td>In China, paper began to be used for [[9]] as well as writing and wrapping.</td></tr>"
                          "<tr><td>8th century (Samarkand &amp; Baghdad)</td><td>Arab papermakers used [[10]] fibres and introduced water-powered mills.</td></tr>"
                          "<tr><td>12th–13th centuries (Europe)</td><td>Italy introduced [[11]] to identify the maker of the paper.</td></tr>"
                          "<tr><td>1799 (France)</td><td>Louis-Nicolas Robert invented a machine to make paper in a continuous [[12]].</td></tr>"
                          "<tr><td>Mid-19th century</td><td>Rags were replaced by [[13]] as the main raw material for paper.</td></tr></table>"},
             ]),
        dict(pdf=2, key="coins", title="Coins – the first form of money", sub=None,
             groups=[
                 headings("14–20", 7, [["i", "Training coin makers"], ["ii", "A form of regional promotion"],
                                       ["iii", "More gold than silver in Greece"], ["iv", "Calculating what a coin was worth"],
                                       ["v", "A simpler, more efficient way of trading"], ["vi", "Putting a face to historical names"],
                                       ["vii", "An uncertain future"], ["viii", "Careless workmanship caused breakages"],
                                       ["ix", "Unchanging coins signalled trustworthiness"], ["x", "Reading the writing on coins"],
                                       ["xi", "Significant records of past societies"]], 14),
                 multi2(21, 22, "Which TWO of these comments about ancient coins are made by the writer of the text?", [
                     "There is no record of the names of the coin makers.",
                     "Coins were not popular as payment for traded objects.",
                     "Coins with the same design often looked quite different.",
                     "Greek coins were more beautiful in design than Roman coins.",
                     "At times, too many coins were produced in Greece."]),
                 {"instr": "Questions 23–26<br>Complete the summary below.<br>Write <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Greek traders and coins</h4>'
                          "<p>The ancient Greek [[23]] was made up of many city-states which were spread over a large area. "
                          "Many Greeks were seafarers who travelled the seas trading. Before coins, they had to do this through [[24]]. "
                          "This meant that, whenever they set out, they had to carry a lot of goods, which could get damaged on the voyages. "
                          "The Greeks liked coins; they were made of metal, and the weather and sea had little effect on them. "
                          "The Greeks had a plentiful supply of [[25]] which they mined themselves, but were able to avoid the problem of [[26]] "
                          "which the Spanish encountered much later, after they allowed too much gold from the New World to enter their economy.</p>"},
             ]),
        dict(pdf=3, key="fruit book", title="The Fruit Book",
             sub="It’s not every scientist who writes books for people who can’t read. And how many scientists want their books to look as dog-eared as possible?",
             groups=[
                 par_match("27–32", 3, "ABCDEFGHI", [
                     (27, "A description of Shanley’s initial data collection"),
                     (28, "Why a government official also contributes to the book"),
                     (29, "Reasons why the community asked Shanley to conduct the research"),
                     (30, "Reference to the starting point of her research"),
                     (31, "Two factors that alter food consumption patterns"),
                     (32, "Why the book is successful")], nb=True),
                 {"instr": "Questions 33–40<br>Complete the summary below.<br>Use <b>NO MORE THAN THREE WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p><b>Forest fire has caused local villagers to consume less:</b></p>"
                          "<ul><li>[[33]]</li><li>[[34]]</li><li>Game</li></ul>"
                          "<p>There is the least amount of game hunted under [[35]]. Yield is also [[36]]. Thus, it is more reasonable to keep [[37]].</p>"
                          "<p>All the trees can also be used for [[38]] besides selling them to loggers. But this is often ignored, "
                          "because most researchers usually focus on the [[39]] of the trees.</p>"
                          "<p><b>The purpose of the book:</b> To give information about [[40]]</p>"},
             ]),
    ],
    # ---------------- Practice test 8 ----------------
    [
        dict(pdf=1, key="who are you", title="Sorry – Who Are You?", sub=None,
             groups=[
                 tf("1–7", 1, [
                     (1, "Prosopagnosia only affects people who have suffered a brain injury."),
                     (2, "People with prosopagnosia are unable to see facial features clearly."),
                     (3, "Heather Sellers realised as a young child that she had a medical condition."),
                     (4, "People with face blindness often use a person's voice or hairstyle to identify them."),
                     (5, "In the past, scientists believed that prosopagnosia was extremely rare."),
                     (6, "Ken Nakayama's online test showed that about two percent of the population has developmental prosopagnosia."),
                     (7, "There is currently an effective medical treatment that cures prosopagnosia.")]),
                 {"instr": "Questions 8–13<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Understanding Prosopagnosia</h4>'
                          "<p><b>Social impact</b></p><ul>"
                          "<li>Sufferers are often mistaken for being rude or [[8]] when they fail to greet acquaintances.</li>"
                          "<li>Many experience high levels of [[9]] in social or workplace situations.</li>"
                          "<li>Following the plot of [[10]] is difficult when characters wear similar clothes.</li></ul>"
                          "<p><b>Scientific research</b></p><ul>"
                          "<li>Brain scans link face recognition to a region called the fusiform [[11]] area.</li>"
                          "<li>Studies of [[12]] suggest that developmental prosopagnosia can be inherited.</li>"
                          "<li>Researchers have also identified 'super-recognisers' who are employed by the [[13]] to spot suspects on CCTV.</li></ul>"},
             ]),
        dict(pdf=2, key="power of smell", title="The Power of Smell", sub=None,
             groups=[
                 par_match("14–19", 2, "ABCDEFG", [
                     (14, "a finding that humans can distinguish between two extremely similar substances"),
                     (15, "a categorisation of species according to their sensitivity to smell"),
                     (16, "an instance where smell negatively affected people's ability to make choices"),
                     (17, "a study that proved humans could perceive a tiny quantity of a substance"),
                     (18, "an observation that studies of the sense of smell have been undervalued"),
                     (19, "an example of using smell to prompt people to buy something")]),
                 box_match("20–23", "Look at the following statements (Questions 20–23) and the list of people below.<br>Match each statement with the correct person, <b>A–F</b>.",
                           "List of People",
                           [["A", "Liliane Mujica-parodi"], ["B", "Pierre Paul Broca"], ["C", "Charles Greer"],
                            ["D", "Hendrick Schifferstein and colleagues"], ["E", "Rob Holland"], ["F", "William Overman and colleagues"]],
                           [(20, "A faint smell could motivate people to do household chores"),
                            (21, "Humans are better equipped to interpret smell than other species are"),
                            (22, "Smell is associated with feelings, rather than the logical part of the brain"),
                            (23, "Humans do not require a sophisticated ability to smell")]),
                 {"instr": "Questions 24–26<br>Complete the sentences below.<br>Write <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>24. The [[24]] is a part of the brain that deals with feeling and smell.</p>"
                          "<p>25. [[25]] smells create especially powerful associations with memories.</p>"
                          "<p>26. Of all the senses, smell has the capacity to prompt memories of [[26]].</p>"},
             ]),
        dict(pdf=3, key="memory champions", title="Memory Champions … or just good at tricks", sub=None,
             groups=[
                 par_match("27–32", 3, "ABCDEFG", [
                     (27, "a description of how a contestant remembers complex sequences"),
                     (28, "an example of how one person’s memory was improved over time"),
                     (29, "a description of a memorizing competition"),
                     (30, "a commonly held belief about memory that many experts say is unproven"),
                     (31, "a reference to the first recorded use of memorizing through location"),
                     (32, "a reference to an unusual condition which results in improved memory")]),
                 {"instr": "Questions 33–36<br>Complete the summary below.<br>Write <b>NO MORE THAN THREE WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>Using visual imagery and spatial navigation to remember numbers are investigated and explained. "
                          "A [[33]], an action, and a thing are assigned to consecutive cards in the pack. "
                          "Combining these images allows Cooke to memorise [[34]] at a time. The mind pictures are then positioned on a [[35]]. "
                          "The pack of cards is remembered by going for a [[36]], while the pictures are converted back into cards.</p>"},
                 box_match("37–40", "Complete each sentence with the correct ending, <b>A–F</b>.",
                           "List of Endings",
                           [["A", "relied solely on innate photographic memory."],
                            ["B", "activated brain areas associated with visual and spatial memory."],
                            ["C", "became widespread in ancient Greece for memorizing speeches and texts."],
                            ["D", "the result of techniques and extensive practice."],
                            ["E", "retaining a wide variety of tasks."],
                            ["F", "unable to remember sequences of playing cards."]],
                           [(37, "Valentine, Wilding and Maguire’s experiment shows that the memory contestants"),
                            (38, "After Simonides discovered the loci method in 477 BC, it"),
                            (39, "Ericsson finds out that natural memorisers are better than strategic memorisers at"),
                            (40, "According to K. Anders Ericsson, Shereshevski’s skills were")]),
             ]),
    ],
    # ---------------- Practice test 9 ----------------
    [
        dict(pdf=1, key="impact of the potato", title="The Impact of the Potato", sub=None,
             groups=[
                 tf("1–5", 1, [
                     (1, "It was easy for Spanish conquistadors to grow potatoes in Europe."),
                     (2, "In Europe, people initially thought that eating potatoes could cause disease."),
                     (3, "Frederick the Great forced Prussian peasants to plant potatoes."),
                     (4, "Antoine-Augustin Parmentier discovered that potatoes were poisonous when green."),
                     (5, "Before the potato arrived in Europe, famines were rare in France.")]),
                 {"instr": "Questions 6–13<br>Complete the sentences below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>6. In the Andes, native people preserved potatoes by freezing and [[6]] them.</p>"
                          "<p>7. Parmentier promoted the potato in France by serving it at dinners and having soldiers guard his [[7]] during the day.</p>"
                          "<p>8. Compared to grain crops, potatoes produced more [[8]] per acre of land.</p>"
                          "<p>9. In Ireland, potatoes and [[9]] provided a nutritionally complete diet for the rural poor.</p>"
                          "<p>10. Economists argue that the potato contributed to the growth of [[10]] in 18th- and 19th-century Europe.</p>"
                          "<p>11. Because Irish farmers grew only the 'Lumper' variety, the crop was vulnerable to a fungal [[11]] in 1845.</p>"
                          "<p>12. As a result of the Great Famine, over a million people died and another million left Ireland by [[12]].</p>"
                          "<p>13. The Irish famine demonstrated the danger of relying on a genetic [[13]] in agriculture.</p>"},
             ]),
        dict(pdf=2, key="leaf-cutting ants and fungus", title="Leaf-Cutting Ants and Fungus", sub=None,
             groups=[
                 box_match("14–19", "Use the information in the passage to match the options <b>A–C</b> with activities or features of ants below.",
                           "List of Ants",
                           [["A", "Leaf-cutting ants"], ["B", "Lower attines"], ["C", "Both leaf-cutting ants and lower attine ants"]],
                           [(14, "can use toxic leaves to feed fungus"),
                            (15, "build small nests and live with different foreign fungus"),
                            (16, "use dead vegetation to feed fungus"),
                            (17, "raise a single fungus which does not live with other varieties of foreign organisms"),
                            (18, "normally keep a highly dangerous parasite under control"),
                            (19, "use special strategies to fight against Escovopsis")], nb=True),
                 par_match("20–24", 2, "ABCDEFGH", [
                     (20, "Dangerous outcome of Escovopsis."),
                     (21, "Risk of growing single fungus."),
                     (22, "Comparison of features of two different nests for feeding gardens."),
                     (23, "Discovery of significant achievements made by ants earlier than humans."),
                     (24, "Advantage of growing a new breed of fungus in the ant farm.")]),
                 mcq("25–26", [
                     (25, "How does the author think of Currie’s opinion on the saying “ants keep their gardens free of parasites”?",
                      ["His viewpoint was verified later.", "His earlier study has sufficient evidence immediately.",
                       "There are no details mentioned in the article.", "His opinion was proved to be wrong later on."]),
                     (26, "What did scientists find on the skin of ants under a microscope?",
                      ["Some white cloud mold embedded in their skin.", "That wax is all over their skin.",
                       "A substance which is useful to humans.", "A substance which suppresses growth of fungus."])]),
             ]),
        dict(pdf=3, key="rights for apes", title="Rights for Apes",
             sub="Humans have rights, other animals don’t – no matter how human-like they are. Kate Douglas investigates the controversial campaign to get that changed.",
             groups=[
                 {"instr": "Questions 27–31<br>Complete the summary using the list of words, <b>A–J</b>, below.",
                  "type": "html", "letters": "ABCDEFGHJ",
                  "box": [["A", "experience"], ["B", "well-being"], ["C", "knowledge"], ["D", "regulations"],
                          ["E", "charities"], ["F", "research"], ["G", "dolphins"], ["H", "needs"], ["J", "species"]],
                  "html": "<p>Some people believe that the campaign to grant human rights to the great apes does not go far enough. "
                          "They want it to include other [[27]] that are judged to demonstrate understanding. One country introduced [[28]] "
                          "which went some way to protecting the apes. As a result, anyone who is interested in using apes for [[29]] "
                          "must first obtain the official go-ahead from the state. They will have to prove that any advances gained do not come at the expense of the animal’s [[30]]. "
                          "So researchers can now only work on projects that may lead to the acquisition of further [[31]] about the way apes function and interact.</p>"},
                 mcq("32–36", [
                     (32, "Why does Stumpe refer to ‘layman’s terms’?",
                      ["to show that many people hold extreme views about animals.", "to suggest that campaigners are reluctant to criticise the law.",
                       "to suggest that such inflated terminology is unnecessary.", "to argue that most people are not interested in protecting animals."]),
                     (33, "According to Singer, what is the root of the problem?",
                      ["Levels of intelligence and awareness differ between species.", "People disagree on how intelligent animals like apes are.",
                       "Moral principles are not easy for everyone to understand.", "Human beings want to see themselves as separate from animals."]),
                     (34, "If Francione’s current idea was implemented,",
                      ["sentient animals could not be kept in cages.", "any form of large-scale agriculture would cease to exist.",
                       "great apes would be granted all the same rights as humans.", "people could no longer offer shelter to an animal."]),
                     (35, "What is the writer’s attitude to Francione’s theory?",
                      ["She is suspicious of the reasoning behind it.", "She is doubtful of its chances of being generally accepted.",
                       "She is reassured by the impartial way it is expressed.", "She is pleased by its logical development."]),
                     (36, "How does de Waal change the perspective of the animal rights discussion?",
                      ["He recommends focusing on the way people look after animals.", "He would give rights only to those animals with a moral sense.",
                       "He says that society should learn to be responsible for all of humanity.", "He thinks that conservation of endangered species should come first."])]),
                 yn("37–40", 3, [
                     (37, "Particularly valuable animals in captivity are more likely to be protected by law."),
                     (38, "de Waal highlights the need to give human rights to higher order animals."),
                     (39, "If GAP beliefs were implemented in the wild, the survival rate of the larger apes would increase."),
                     (40, "If people in Western countries, for example, learned to consider apes’ needs, fewer apes would be captured for sale.")]),
             ]),
    ],
    # ---------------- Practice test 10 ----------------
    [
        dict(pdf=1, key="history of the pencil", title="The History of the Pencil", sub=None,
             groups=[
                 {"instr": "Questions 1–6<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Early History of the Pencil</h4>'
                          "<p><b>Discovery of graphite (1564)</b></p><ul>"
                          "<li>A storm uprooted [[1]] in Borrowdale, England, revealing a deposit of dark mineral.</li>"
                          "<li>Locals first used the substance to mark their [[2]].</li>"
                          "<li>Chemists mistakenly believed the mineral was a form of [[3]].</li></ul>"
                          "<p><b>Early pencil making</b></p><ul>"
                          "<li>Graphite sticks were initially wrapped in [[4]] or sheepskin to keep hands clean.</li>"
                          "<li>In Italy, Simonio and Lyndiana Bernacotti placed graphite inside hollowed-out [[5]] wood.</li>"
                          "<li>The English Crown guarded the Borrowdale mine because graphite was used to line moulds for [[6]].</li></ul>"},
                 tf("7–13", 1, [
                     (7, "During the Napoleonic Wars, France was unable to import graphite from Britain."),
                     (8, "Nicolas-Jacques Conté mixed graphite powder with clay and water to make pencil leads."),
                     (9, "Varying the proportion of clay in Conté's process changed the colour of the wood casing."),
                     (10, "Henry David Thoreau helped his father improve the quality of American pencils."),
                     (11, "Hymen Lipman became wealthy from his patent for attaching an eraser to a pencil."),
                     (12, "Pencils were painted yellow in the late 19th century to show their graphite came from China."),
                     (13, "Most modern pencils still contain a small percentage of lead.")]),
             ]),
        dict(pdf=2, key="why don't we sleep", title="Why Don't We Sleep?", sub=None,
             groups=[
                 {"instr": "Questions 14–17<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Insomnia in the USA</h4>'
                          "<p>Last year the high number of [[14]] doctors gave their patients highlights the fact that insomnia is a serious issue in the USA. "
                          "It is evidently responsible for a number of serious traffic [[15]] and has a considerable effect on company [[16]]. "
                          "A lack of sleep can also have a harmful effect on different relationships, although there are no statistics on this. "
                          "Unfortunately, there is insufficient official funding given to research into sleep problems, and the [[17]] given at medical school is also insufficient to deal with insomnia.</p>"},
                 par_match("18–23", 2, "ABCDEFGHI", [
                     (18, "a mention of different cultural approaches to dealing with insomnia"),
                     (19, "indications that sleep has a positive effect on health"),
                     (20, "the effects of different kinds of sleep on mental performance"),
                     (21, "reasons why various species of animal sleep in different ways"),
                     (22, "the suggestion that sleep allows us to get rid of insignificant information"),
                     (23, "a description of how the brain responds when a person stops breathing")]),
                 box_match("24–26", "Look at the following statements and the list of people below.<br>Match each statement with the correct person, <b>A–E</b>.",
                           "List of People",
                           [["A", "Giulio Tononi"], ["B", "William Dement"], ["C", "Clete Kushida"], ["D", "Charles Czeisler"], ["E", "John Winkelman"]],
                           [(24, "Research tells us that we sleep because our body requires rest."),
                            (25, "People suffering from insomnia fall into two easily recognisable categories."),
                            (26, "Therapy does not always enable people to achieve good quality sleep.")]),
             ]),
        dict(pdf=3, key="mark strizic", title="Mark Strizic: A Career of an Australian Photographer", sub=None,
             groups=[
                 box_match("27–32", "Look at the following statements and the list of people below.<br>Match each statement with the correct person, <b>A–F</b>.",
                           "List of People",
                           [["A", "David Saunders"], ["B", "Andrew Grimwade"], ["C", "Leonard French"],
                            ["D", "Strizic’s father"], ["E", "Stanislav Ostoja-Kotkowski"], ["F", "Geoffrey Dutton"]],
                           [(27, "Strizic worked with him to produce a book about Melbourne."),
                            (28, "He edited the art book Involvement."),
                            (29, "He designed the cover of Melbourne: A Portrait."),
                            (30, "His book on Zagreb inspired Strizic’s Melbourne: A Portrait."),
                            (31, "He collaborated with Strizic to combine photochromes with infrared photography."),
                            (32, "He wrote the text for Involvement, which was considered pretentious.")], nb=True),
                 yn("33–37", 3, [
                     (33, "2000 Weeks and its accompanying photo-roman were successful with the public."),
                     (34, "Strizic’s portraits in Involvement were exhibited at the National Gallery of Victoria in 1968."),
                     (35, "Strizic was one of the first to document the interactive artwork Sculptron."),
                     (36, "Strizic’s photographic murals were produced with the help of advanced digital technology."),
                     (37, "Strizic is best remembered solely as a nostalgic photographer of Melbourne.")]),
                 box_match("38–40", "Look at the following statements and the list of dates below.<br>Match each statement with the correct date, <b>A, B, C or D</b>.",
                           "List of Dates",
                           [["A", "1961"], ["B", "1968"], ["C", "1970"], ["D", "1988"]],
                           [(38, "Melbourne: A Portrait received the Book of the Year award."),
                            (39, "Strizic collaborated with Robin Boyd on Living in Australia."),
                            (40, "Strizic returned to his early negatives of Melbourne streets for an exhibition.")], nb=True),
             ]),
    ],
    # ---------------- Practice test 11 ----------------
    [
        dict(pdf=1, key="history of tea", title="The History of Tea", sub=None,
             groups=[
                 {"instr": "Questions 1–8<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">The History of Tea</h4>'
                          "<p><b>Origins in China</b></p><ul>"
                          "<li>According to legend, Emperor Shen Nung discovered tea when leaves blew into his pot of boiling [[1]].</li>"
                          "<li>Tea was originally consumed as a [[2]] before becoming a popular everyday drink.</li>"
                          "<li>During the Tang Dynasty, Lu Yu wrote a famous [[3]] about cultivating and preparing tea.</li>"
                          "<li>Tea leaves were steamed and compressed into [[4]] for transport and trade.</li></ul>"
                          "<p><b>Arrival in Japan and Europe</b></p><ul>"
                          "<li>Buddhist [[5]] brought tea seeds from China to Japan.</li>"
                          "<li>Portuguese priests and [[6]] were the first Europeans to write about and trade tea.</li>"
                          "<li>In Britain, tea became fashionable at court after King Charles II married a Portuguese [[7]].</li>"
                          "<li>High government [[8]] on tea in 18th-century Britain led to widespread smuggling and adulteration.</li></ul>"},
                 tf("9–13", 1, [
                     (9, "Tea smuggling in 18th-century Britain ended after William Pitt the Younger reduced the tax on tea."),
                     (10, "The British East India Company sent Robert Fortune to China to buy tea factories."),
                     (11, "Tea plants grew naturally in the Assam region of India before the British arrived."),
                     (12, "Anna, the Duchess of Bedford, introduced the custom of afternoon tea in the 19th century."),
                     (13, "Thomas Sullivan originally intended his silk tea bags to be left in the pot when brewing.")]),
             ]),
        dict(pdf=2, key="new zealand's health service", title="New Technology in New Zealand's Health Service", sub=None,
             groups=[
                 par_match("14–18", 2, "ABCDE", [
                     (14, "reference to a medical practice that became less common but is now being used more frequently in one country"),
                     (15, "reference to a health management scheme in New Zealand that was more advanced than those used in other nations"),
                     (16, "the claim that some of the information systems being tested in the health sector are only on a small scale"),
                     (17, "reference to the fact that most people in New Zealand will experience an urgent medical situation at some point"),
                     (18, "mention of a dramatic event that led to improved use of health information technology in one part of New Zealand")], nb=True),
                 box_match("19–22", "Look at the following statements and the list of people below.<br>Match each statement with the correct person, <b>A–E</b>.",
                           "List of People",
                           [["A", "Ian McCrae"], ["B", "Nigel Millar"], ["C", "Richard Medlicott"], ["D", "Kate Reid"], ["E", "Scott Arrol"]],
                           [(19, "Money should be invested in technology that attempts to stop people becoming sick, rather than caring for them once they are sick."),
                            (20, "There are good reasons why healthcare does not make more use of technology to manage patient information."),
                            (21, "Health professionals need to communicate and work together, even if they have different interests."),
                            (22, "New technologies will enable healthcare professionals to concentrate on the most important aspects of their work.")], nb=True),
                 {"instr": "Questions 23–26<br>Complete the summary below.<br>Write <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Other Health Technologies</h4>'
                          "<p>Apart from IT, New Zealand scientists have made good progress with other types of medical technology. "
                          "Dr Chiong has designed a camera so that doctors can look into a patient's [[23]]. "
                          "Clever MedKit provides everyday medical supplies for use in [[24]] and ensures stocks are always up-to-date. "
                          "Meanwhile, the cost of repairing a [[25]] is likely to be reduced thanks to Dr Adam Doudney, whose idea was developed by researchers at Rhondium. "
                          "Another breakthrough is that changes in the [[26]] of wounds can now be recorded more accurately because of the new Silhouette system. "
                          "Lastly, a new type of sensor developed by the Auckland Bioengineering Institute can assist fitness and recovery.</p>"},
             ]),
        dict(pdf=3, key="verbal and non-verbal", title="A Closer Examination of a Study on Verbal and Non-Verbal Messages",
             sub="A study of non-verbal communication carried out in 1967 continues to be widely quoted today. David Lapakko looks at limitations in the original study.",
             groups=[
                 {"instr": "Questions 27–30<br>Complete the summary using the list of words and phrases, <b>A–H</b>, below.",
                  "type": "html", "letters": "ABCDEFGH",
                  "box": [["A", "facial expressions"], ["B", "purposes"], ["C", "printed words"], ["D", "effects"],
                          ["E", "word meanings"], ["F", "gender differences"], ["G", "feelings"], ["H", "characteristics"]],
                  "html": '<h4 class="center">Albert Mehrabian’s study</h4>'
                          "<p>Albert Mehrabian and his colleagues carried out an influential study comparing the [[27]] of verbal and non-verbal communication. "
                          "This involved two experiments. In both experiments, subjects had to identify the [[28]] being communicated by other people. "
                          "The two main areas focused on in the first experiment were voice tones and [[29]] while the second focused mainly on voice tones and [[30]].</p>"},
                 yn("31–35", 3, [
                     (31, "One limitation of the study was that there were too few subjects involved."),
                     (32, "The fact that the subjects in the study came from a similar background was an advantage."),
                     (33, "The two experiments should have been carried out in a different order."),
                     (34, "The researchers' choice of a neutral word was helpful in the context of the study."),
                     (35, "The study would have been more valid if it had included a range of languages.")]),
                 mcq("36–40", [
                     (36, "What does the writer say about the ‘numerical precision’ of Mehrabian’s study?",
                      ["It makes the claims more attractive.", "It is the strongest point of the study.",
                       "It will appeal to superstitious people.", "It allows comparison between languages."]),
                     (37, "What does the writer say about the popularity of the 7-38-55 formula?",
                      ["It is unlikely to maintain its present status.", "It is leading to an undervaluing of language.",
                       "It may help understanding of non-verbal messages.", "It proves that body language is always more important."]),
                     (38, "What point is Bradley making about language learning?",
                      ["Language could be learned more efficiently than it is.", "More research is needed into attitudes to communication.",
                       "More time should be spent looking at tone and body language.", "Language must be important since we make an effort to acquire it."]),
                     (39, "What does Mehrabian himself say about his findings?",
                      ["They are relevant to only one area of communication.", "It is only in maths that 100% of communication is verbal.",
                       "Feelings are more difficult to communicate than numerical facts.", "Non-verbal communication is the main part of the message."]),
                     (40, "What is the writer’s purpose in the paragraph beginning ‘To be fair …’?",
                      ["to justify the strong points of Mehrabian’s study", "to outline other research on non-verbal behaviour",
                       "to present varying interpretations of Mehrabian’s study", "to show that textbooks tend to ignore non-verbal behaviour"])]),
             ]),
    ],
    # ---------------- Practice test 12 ----------------
    [
        dict(pdf=1, key="sunlight soap", title="The Sunlight Soap Story", sub=None,
             groups=[
                 tf("1–5", 1, [
                     (1, "William Lever was the first person to sell soap wrapped in individual packets."),
                     (2, "Sunlight Soap was cheaper to produce than traditional soaps."),
                     (3, "Sunlight Soap could be used for washing both clothes and people."),
                     (4, "Workers in Port Sunlight had to pay the full market rent for their cottages."),
                     (5, "Lever required all his employees to join a trade union.")]),
                 {"instr": "Questions 6–13<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">William Lever and Sunlight Soap</h4>'
                          "<p><b>Port Sunlight</b></p><ul>"
                          "<li>Lever shared company [[6]] with his employees.</li>"
                          "<li>He built a model [[7]] next to the soap factory for his workforce.</li>"
                          "<li>The company organised regular [[8]] and social events for staff.</li></ul>"
                          "<p><b>Marketing and Expansion</b></p><ul>"
                          "<li>Sunlight Soap stood out in shops because of its bright [[9]].</li>"
                          "<li>Lever Brothers opened its London [[10]] in a prominent building near the River Thames.</li>"
                          "<li>Customers could collect [[11]] from soap cartons and exchange them for gifts.</li>"
                          "<li>Later products included Lifebuoy soap and Vim, a cleaner for [[12]] and household surfaces.</li>"
                          "<li>The company also produced soap [[13]] such as Lux to make laundry easier.</li></ul>"},
             ]),
        dict(pdf=2, key="intelligent behaviour in birds", title="Intelligent Behaviour in Birds",
             sub="Many people are aware of the intelligence of chimpanzees and other mammals. However, birds also demonstrate intelligent behaviour.",
             groups=[
                 headings("14–20", 7, [["i", "The theory linking capacity for tool use in birds and survival"],
                                       ["ii", "The influence of humans on tool use"],
                                       ["iii", "The theory linking cognitive ability and living in a society"],
                                       ["iv", "Reviewing long-held beliefs"],
                                       ["v", "Intelligence helps birds to remember"],
                                       ["vi", "How some birds trick each other"],
                                       ["vii", "Physiological evidence of birds' intelligence"],
                                       ["viii", "Several examples of birds who use tools"],
                                       ["ix", "One species' multiple tool-using techniques"]], 14),
                 box_match("21–26", "Look at the following characteristics and the list of birds below.<br>Match each characteristic with the correct bird, <b>A, B, or C</b>.",
                           "List of Birds",
                           [["A", "white-winged choughs"], ["B", "black kites"], ["C", "New Caledonian crows"]],
                           [(21, "keeping tools that they like to use"),
                            (22, "drawing out their prey by frightening it"),
                            (23, "the use of tools to remove the outer covering from food"),
                            (24, "using food to attract their prey"),
                            (25, "the use of unfamiliar materials to make tools"),
                            (26, "engaging in certain activities for the benefit of observers")], nb=True),
             ]),
        dict(pdf=3, key="elephant communication", title="Elephant Communication", sub=None,
             q_remap={27: (28, None), 28: (29, None), 29: (30, None), 30: (31, None),
                      31: (32, "trunks|trunks and feet"), 32: (32, "feet|trunks and feet")},
             groups=[
                 {"instr": "Questions 27–30<br>Label the diagram below.<br>Choose <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Elephant anatomy related to seismic communication</h4>'
                          "<ul><li>[[27]] bones in inner ear</li>"
                          "<li>an [[28]] body</li>"
                          "<li>toe and fatty [[29]]</li>"
                          "<li>big sized brain skull with many [[30]]</li></ul>"},
                 {"instr": "Questions 31–38<br>Complete the summary below.<br>Choose <b>NO MORE THAN THREE WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>How the elephants sense these sound vibrations is still unknown, but O’Connell-Rodwell, a postdoctoral researcher at Stanford University, "
                          "proposes that elephants are “listening” with their [[31]] and [[32]] by two kinds of nerve endings that respond to vibrations with both [[33]] "
                          "frequency and slightly higher frequencies. O’Connell-Rodwell’s work is the combination of geophysics, neurophysiology and [[34]]. "
                          "It was known that seismic communication existed extensively within small animals, but O’Connell-Rodwell was the first person to indicate that "
                          "a large land animal would send and receive [[35]] too. Also, she noticed the freezing behavior by putting a male planthopper on a stem and "
                          "playing back a female call, which might prove the existence of other communicative approaches besides [[36]]. "
                          "Scientists have determined that an elephant’s ability to communicate over long distances is essential, especially when elephant herds are finding a [[37]], "
                          "or are warning of predators. Finally, the results of the 2002 study showed that elephants could detect warning calls through the [[38]].</p>"},
                 mcq("39–40", [
                     (39, "According to the passage, it is determined that an elephant needs to communicate over long distances for its survival",
                      ["when a threatening predator appears.", "when young elephants meet humans.",
                       "when older members of the herd want to flee from the group.", "when a male elephant is in estrus."]),
                     (40, "What is the author’s attitude toward the experiment by using three different recordings in the last paragraph?",
                      ["The outcome is definitely out of the original expectation.", "The data cannot be very clearly obtained.",
                       "The result can be somewhat undecided or inaccurate.", "The result can be unfamiliar to the public."])]),
             ]),
    ],
    # ---------------- Practice test 13 ----------------
    [
        dict(pdf=1, key="spinning jenny", title="James Hargreaves and the Spinning Jenny", sub=None,
             groups=[
                 {"instr": "Questions 1–4<br>Answer the questions below.<br>Choose <b>NO MORE THAN THREE WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>1. What activity was combined with textile production in 18th-century Lancashire cottages? [[1]]</p>"
                          "<p>2. Which family members usually spun raw cotton into thread before the Spinning Jenny? [[2]]</p>"
                          "<p>3. Who was alleged to have invented a multi-spindle spinning machine before James Hargreaves? [[3]]</p>"
                          "<p>4. What material was mainly used to construct the frame of the early Spinning Jenny? [[4]]</p>"},
                 tf("5–8", 1, [
                     (5, "Hargreaves named the Spinning Jenny after his youngest daughter."),
                     (6, "Local hand spinners broke into Hargreaves's workshop and destroyed several of his machines."),
                     (7, "Hargreaves became extremely wealthy from licensing his patent on the Spinning Jenny."),
                     (8, "By the time Hargreaves died, thousands of Spinning Jennies were in use across Britain.")]),
                 {"instr": "Questions 9–13<br>Label the diagram below.<br>Choose <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.",
                  "type": "html", "image": "assets/practice/spinning-jenny.png",
                  "html": '<h4 class="center">How the Spinning Jenny Worked</h4>'
                          "<p>9. A loop of [[9]] connected the driving mechanism to the horizontal cylinder.</p>"
                          "<p>10. The operator turned a large [[10]] on the right side of the frame.</p>"
                          "<p>11. Raw cotton rovings were drawn out and twisted onto a row of [[11]].</p>"
                          "<p>12. Two wooden [[12]] clamped together to hold and draw the threads.</p>"
                          "<p>13. A [[13]] guided the spun yarn onto the bobbins as the carriage returned.</p>"},
             ]),
        dict(pdf=2, key="black-footed ferret", title="The Return of the Black-Footed Ferret",
             sub="The rise, fall, and rise of one of North America's rarest mammals",
             groups=[
                 par_match("14–19", 2, "ABCDEFG", [
                     (14, "The discovery of a surviving wild population of black-footed ferrets"),
                     (15, "The relationship between ferret decline and the loss of another species"),
                     (16, "A comparison between the black-footed ferret and two related species"),
                     (17, "The capture of all remaining wild ferrets to prevent extinction"),
                     (18, "Current threats that still prevent full recovery of the species"),
                     (19, "The approximate original geographical range of the black-footed ferret")], label="section"),
                 {"instr": "Questions 20–23<br>Complete the summary below.<br>Choose <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>The black-footed ferret almost became extinct mainly because its primary food source, the [[20]], was systematically destroyed. "
                          "In the 20th century, programmes that involved [[21]], together with habitat loss and disease, eliminated around 95% of these animals. "
                          "Ferrets also depend on their prey's [[22]] for shelter and raising their young. After the Meeteetse population was discovered in 1981, "
                          "disease outbreaks reduced it to just [[23]] individuals, all of which were taken into captivity.</p>"},
                 mcq("24–26", [
                     (24, "What is said about captive breeding of black-footed ferrets?",
                      ["It was immediately successful without any difficulties.", "Ferrets bred easily in small cages with frequent handling.",
                       "It required special conditions and careful management.", "The programme failed to produce any offspring."]),
                     (25, "According to the passage, what is a major ongoing challenge for wild ferret populations?",
                      ["Lack of suitable reintroduction sites", "The disease plague, which is hard to vaccinate against in the wild",
                       "Competition with domestic ferrets", "Overpopulation of prairie dogs"]),
                     (26, "What do conservationists believe is necessary for the long-term survival of the species?",
                      ["Killing more prairie dogs to reduce competition", "Relocating all ferrets to zoos",
                       "Changing how people perceive prairie dogs", "Introducing Siberian polecats to North America"])]),
             ]),
        dict(pdf=3, key="musical expert", title="What Makes a Musical Expert?",
             sub="How does someone become expert in music? And is it really possible to have a ‘talent’ for music?",
             groups=[
                 mcq("27–30", [
                     (27, "In the first paragraph, the writer suggests that a musician who is talented is someone",
                      ["who is aware of being set apart from other people.", "whose brain structure is unlike that of other people.",
                       "who can perform extremely well in early childhood.", "whose essential skills are more varied than those of ordinary people."]),
                     (28, "According to the writer, what is unclear about the findings of Gottfried Schlaug?",
                      ["which part of the brain is linked to a particular musical skill.", "which type of musical skill leads to the greatest change in the brain.",
                       "whether a feature of the brain is a cause or an effect of a musical skill.", "whether the acquisition of a musical skill is easier for some people than others."]),
                     (29, "According to the writer, what has been established by studies of violin players?",
                      ["Changes may occur in the brain following violin practice.", "Left-handed violinists have a different brain structure from other people.",
                       "A violinist’s hand size is not due to practice but to genetic factors.", "Violinists are born with brains that have a particular structure."]),
                     (30, "According to the writer, findings on the amount of practice done by expert musicians suggest that",
                      ["talent may have little to do with expertise.", "practice may actually prevent the development of talent.",
                       "talent may not be recognised by teachers.", "expertise may be related to quality of instruction."])]),
                 yn("31–36", 3, [
                     (31, "Anders Ericsson's work with cognitive psychology has influenced other researchers."),
                     (32, "Different areas of expertise seem to have one specific thing in common."),
                     (33, "In order to be useful, practice must be carried out regularly every day."),
                     (34, "Anyone who practices for long enough can reach the level of a world-class expert."),
                     (35, "Occasionally, someone can become an expert at global level with fewer than 10,000 hours' practice."),
                     (36, "Existing knowledge of learning and cognitive skills supports the importance of practice.")]),
                 {"instr": "Questions 37–40<br>Complete the summary using the list of words, <b>A–J</b>, below.",
                  "type": "html", "letters": "ABCDEFGHIJ",
                  "box": [["A", "popular"], ["B", "artistic"], ["C", "completed"], ["D", "eight"], ["E", "tuition"],
                          ["F", "encouragement"], ["G", "inherited"], ["H", "four"], ["I", "practice"], ["J", "two"]],
                  "html": '<h4 class="center">Mozart</h4>'
                          "<p>The case of Mozart could be quoted as evidence against the 10,000-hour-practice theory. "
                          "However, the writer points out that the young Mozart received a lot of [[37]] from his father, "
                          "and that the symphony he wrote at the age of [[38]] was not [[39]] and may be of only academic interest. "
                          "The case therefore supports the view that expertise is not solely the result of [[40]] characteristics.</p>"},
             ]),
    ],
    # ---------------- Practice test 14 ----------------
    [
        dict(pdf=1, key="olive oil", title="The Early History of Olive Oil", sub=None,
             groups=[
                 tf("1–6", 1, [
                     (1, "Wild olive trees were first domesticated in the western Mediterranean."),
                     (2, "The Minoans of Crete owed much of their wealth to the trade in olive oil."),
                     (3, "Ancient olive presses used heavy stones to crush the olives before pressing."),
                     (4, "In ancient Greece, cutting down an olive tree was a serious crime."),
                     (5, "Olive oil was used only for cooking in the Roman Empire."),
                     (6, "Monte Testaccio in Rome is a hill made entirely of broken olive-oil amphorae.")]),
                 {"instr": "Questions 7–13<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Production and Uses of Ancient Olive Oil</h4>'
                          "<p><b>Extraction process</b></p><ul>"
                          "<li>Olives were crushed into a paste and placed in woven [[7]].</li>"
                          "<li>A wooden lever weighted with stones pressed out the liquid, and oil was separated from [[8]] by skimming.</li></ul>"
                          "<p><b>Non-food uses</b></p><ul>"
                          "<li>Burned in terracotta [[9]] to provide light in homes and temples.</li>"
                          "<li>Used by Greek [[10]] to clean their skin before and after competing.</li>"
                          "<li>Mixed with herbs and flowers to make [[11]] and medicines.</li></ul>"
                          "<p><b>Trade and regulation</b></p><ul>"
                          "<li>Winners at the Panathenaic Games received amphorae of sacred oil as a [[12]].</li>"
                          "<li>Roman amphorae were stamped with the name of the [[13]] and weight to prevent fraud.</li></ul>"},
             ]),
        dict(pdf=2, key="bird migration", title="Bird Migration", sub=None,
             groups=[
                 headings("14–20", 7, [["i", "The best moment to migrate"],
                                       ["ii", "The unexplained rejection of closer feeding ground"],
                                       ["iii", "The influence of weather on the migration route"],
                                       ["iv", "Physical characteristics that allow birds to migrate"],
                                       ["v", "The main reason why birds migrate"],
                                       ["vi", "The best wintering grounds for birds"],
                                       ["vii", "Research findings on how birds migrate"],
                                       ["viii", "Successful migration despite the problem of wind"],
                                       ["ix", "The contrast between long-distance migration and short-distance migration"],
                                       ["x", "Mysterious migration despite lack of teaching"]], 14),
                 multi2(21, 22, "Which TWO of the following statements are true about bird migration?", [
                     "Birds often fly further than they need to.",
                     "Birds traveling in family groups are safe.",
                     "Birds flying at night need less water.",
                     "Birds have much sharper eyesight than humans.",
                     "Only shorebirds are resistant to strong winds."]),
                 {"instr": "Questions 23–26<br>Complete the sentences.<br>Choose <b>NO MORE THAN ONE WORD OR A NUMBER</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>23. It is a great mystery that young birds like cuckoos can find their wintering grounds without [[23]] assistance.</p>"
                          "<p>24. Evidence shows birds can tell [[24]] like a compass by observing the sun and the stars.</p>"
                          "<p>25. One advantage for birds flying at night is that they can avoid contact with [[25]].</p>"
                          "<p>26. Laboratory tests show that birds can detect weather without [[26]] signs.</p>"},
             ]),
        dict(pdf=3, key="jean piaget", title="Jean Piaget 1896–1980",
             sub="Seymour Papert looks at the work of pioneering Swiss philosopher and psychologist.",
             groups=[
                 mcq("27–31", [
                     (27, "In the second paragraph the writer mentions the example of modern anthropology to illustrate",
                      ["the universality of Piaget’s insights into the workings of the mind.",
                       "the similarity between children’s thought processing in different cultures.",
                       "how Piaget’s work represents a crucial turning-point in our approach to education.",
                       "how Piaget’s work has aided our understanding of man’s evolution from primitive origins."]),
                     (28, "According to the writer, what point is illustrated by the dialogue about the wind?",
                      ["The factual accuracy of what children say is of minor significance.",
                       "Children want to learn about scientific principles.",
                       "Children’s reasoning processes can be amusing to adults.",
                       "Children often pretend that they know the answers to questions."]),
                     (29, "Piaget believed in the importance of",
                      ["preventing children from making false assumptions.",
                       "giving children honest feedback on their hypotheses.",
                       "showing children how to formulate their own ideas about the world.",
                       "maintaining children’s confidence in their ability to interpret the world."]),
                     (30, "What does the writer suggest in the seventh paragraph?",
                      ["Children’s sense of their surroundings changes as they get older.",
                       "Children are able to grasp certain complex ideas as well as adults are.",
                       "Even apparently irrational ideas can be worthy of interest.",
                       "Sometimes the simplest explanations are the best."]),
                     (31, "The writer’s main purpose is to",
                      ["outline Piaget’s contribution to a range of scientific fields.",
                       "summarise how education has benefited from Piaget’s finding.",
                       "discuss Piaget’s role in the development of 20th-century psychology.",
                       "express doubts about a number of Piaget’s theories."])]),
                 {"instr": "Questions 32–36<br>Complete the summary using the list of words, <b>A–I</b>, below.",
                  "type": "html", "letters": "ABCDEFGHI",
                  "box": [["A", "correct"], ["B", "theories"], ["C", "brain"], ["D", "simple"], ["E", "teachers"],
                          ["F", "psychology"], ["G", "logical"], ["H", "thought"], ["I", "philosophers"]],
                  "html": "<p>Piaget maintained that children’s mental processes were far more [[32]] than they might appear. "
                          "He encouraged the view that a child was not a ‘blank slate’ waiting to be filled with information, "
                          "but rather a systematic builder of knowledge who regularly tries out his or her own [[33]] about the world. "
                          "Piaget’s impact on the area of [[34]] could well outlast that of more celebrated pioneers of this discipline. "
                          "Despite doubts cast over his ideas by the current view associating knowledge exclusively with the [[35]], "
                          "the effects of his work are still strong today. His principles are still widely used in the professional development of [[36]].</p>"},
                 yn("37–40", 3, [
                     (37, "Piaget’s early work in Paris involved innovative research techniques."),
                     (38, "Piaget gave clear guidelines as to how adults should give information to children."),
                     (39, "Piaget made a significant contribution to the field of epistemology."),
                     (40, "We still have much to learn about the nature of knowledge.")]),
             ]),
    ],
    # ---------------- Practice test 15 ----------------
    [
        dict(pdf=1, key="dolls through the ages", title="Dolls Through the Ages", sub=None,
             groups=[
                 {"instr": "Questions 1–6<br>Complete the notes below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">History of Dolls</h4>'
                          "<p><b>Ancient World</b></p><ul>"
                          "<li>Egyptian paddle dolls had strings of [[1]] to represent hair and were placed in tombs.</li>"
                          "<li>Greek and Roman girls dedicated their clay or [[2]] dolls to goddesses before getting married.</li></ul>"
                          "<p><b>Europe (15th–19th centuries)</b></p><ul>"
                          "<li>German 'pennywoods' were carved from wood by [[3]] families.</li>"
                          "<li>In France, 'Pandora' dolls were sent to courts and dressmakers to display the latest [[4]].</li>"
                          "<li>19th-century 'bisque' dolls had heads made of unglazed [[5]] that looked like real skin.</li></ul>"
                          "<p><b>20th Century</b></p><ul>"
                          "<li>After World War II, durable [[6]] replaced composition and porcelain in mass-produced dolls.</li></ul>"},
                 tf("7–13", 1, [
                     (7, "Ancient Egyptian paddle dolls were made solely as children's playthings."),
                     (8, "In the 18th century, wax dolls were popular among wealthy European families."),
                     (9, "Thomas Edison's talking doll was a huge commercial success."),
                     (10, "Kewpie dolls were based on illustrations that first appeared in a magazine."),
                     (11, "Ruth Handler got the idea for the Barbie doll from a German doll called Bild Lilli."),
                     (12, "When Barbie was first shown at the American Toy Fair in 1959, toy buyers immediately ordered large quantities."),
                     (13, "Today, antique bisque dolls are collected mainly by children.")]),
             ]),
        dict(pdf=2, key="how to be happy", title="How to be Happy",
             sub="Some recent developments in the science of happiness",
             groups=[
                 par_match("14–17", 2, "ABCDEF", [
                     (14, "A reference to a fact that two scientists use the same technique to promote their own happiness"),
                     (15, "The suggestion that scientific opinion about an aspect of brain function has changed over a given time period"),
                     (16, "An estimate of how numerous some brain components are"),
                     (17, "The reason why some educational courses were set up")], nb=True),
                 box_match("18–21", "Look at the following statements and the list of people below.<br>Match each statement with the correct person, <b>A–F</b>.",
                           "List of Findings",
                           [["A", "Tony Fernando"], ["B", "Richard Davidson"], ["C", "Rick Hanson"],
                            ["D", "Judi Clements"], ["E", "Carsten Grimm"], ["F", "Nathan Consedine"]],
                           [(18, "It's better to look for a variety of ways to increase happiness than focus on just one."),
                            (19, "Focusing on personal achievements rather than negative experiences will make people happier."),
                            (20, "Happy people might have a reason not to display one favourable characteristic."),
                            (21, "A range of groups are becoming more interested in learning techniques to improve happiness.")]),
                 {"instr": "Questions 22–26<br>Complete the summary below.<br>Choose <b>ONE WORD ONLY</b> from the passage for each answer.",
                  "type": "html",
                  "html": '<h4 class="center">Auckland University’s Centre for Brain Research</h4>'
                          "<p>Associate Professor Johanna Montgomery says that current research into brain activity and behaviour only relates to [[22]] "
                          "so Hanson's theories have not been proved correct. While scans do show that positive stimuli result in more [[23]] reaching parts of the brain, "
                          "this isn't proof that the brain is getting stronger.</p>"
                          "<p>But Montgomery is making progress. In laboratory experiments, scientists use [[24]] to initiate brain activity, because it's similar to natural processes. "
                          "One finding is that hormones can be compared to the [[25]] because both can change human behaviour. "
                          "But scientists understand some stimuli, such as [[26]], better than they understand more positive stimuli.</p>"},
             ]),
        dict(pdf=3, key="science and filmmaking", title="Science and Filmmaking",
             sub="Academics are now working more with filmmakers who are impressed by the results of their research in computer generated imagery (CGI).",
             groups=[
                 tf("27–31", 3, [
                     (27, "The Oscar awarded in 2004 was the first one ever given for an achievement in CGI."),
                     (28, "CGI is most effective for altering an actor’s appearance in wide shots rather than close-ups."),
                     (29, "Marschner’s team was the first group to identify that human skin is translucent."),
                     (30, "The mathematical principles behind subsurface scattering were originally developed for filmmaking."),
                     (31, "All major visual effects companies started using the new subsurface scattering technique before the research was officially published.")]),
                 {"instr": "Questions 32–36<br>Complete the summary below.<br>Choose <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>After winning the Oscar, the researchers wanted to improve how light [[32]] is shown. "
                          "They studied how the physical composition of skin and cloth affects this. To do this, they employed [[33]], "
                          "a method from medical science. This technique uses [[34]] to create composite images from various angles, "
                          "revealing minute details. The data from this process was used to create a detailed [[35]] of material structures. "
                          "The team then created [[36]] to simulate the interaction of light with these tiny structures.</p>"},
                 {"instr": "Questions 37–40<br>Answer the questions below.<br>Choose <b>NO MORE THAN TWO WORDS</b> from the passage for each answer.",
                  "type": "html",
                  "html": "<p>37. What did early CGI systems incorrectly assume about human skin? [[37]]</p>"
                          "<p>38. What scientific field provided the original mathematical concepts for simulating skin translucency? [[38]]</p>"
                          "<p>39. What specific visual problem did the researchers address after winning the Oscar to achieve realism in close-ups? [[39]]</p>"
                          "<p>40. Which two types of reflection did the researchers’ later work focus on replicating? [[40]]</p>"},
             ]),
    ],
]

# extra accepted spellings of the same answer
ALT = {(1, 21): "dry season|dry seasons", (1, 22): "four months|4 months"}

docs = {n: open_fp(n) for n in (1, 2, 3)}
tests = []
problems = []
for ti, rows in enumerate(SETS, start=1):
    passages, answers, explain = [], {}, {}
    for spec in rows:
        d = docs[spec["pdf"]]
        a, b = find_unit(d, spec["key"])
        text = spec.get("text") or passage_html(d, a, b, spec["title"], spec["sub"])
        ans, exp = key_and_explain(d, a, b)
        if "q_remap" in spec:
            rm = spec["q_remap"]
            new_ans, new_exp = dict(ans), dict(exp)
            for new_q, (old_q, override_ans) in rm.items():
                if old_q in ans:
                    new_ans[new_q] = override_ans if override_ans is not None else ans[old_q]
                if old_q in exp:
                    new_exp[new_q] = exp[old_q]
            ans, exp = new_ans, new_exp
        qs = set()
        for g in spec["groups"]:
            if g["type"] == "html":
                qs |= {int(x) for x in re.findall(r"\[\[(\d+)\]\]", g["html"])}
            elif g["type"] == "multi":
                qs |= set(g["qs"])
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

book = {"id": 101, "title": "IELTS Real Tests · Reading", "tests": tests}
js = ("/* Practice Reading tests built from the 'FULL PASSAGE' PDFs by tools/build_practice_reading.py.\n"
      "   Each test = one row of the MỤC LỤC ĐỀ table (Passage 1 + 2 + 3). Do not edit by hand; re-run the builder. */\n"
      "IELTS.addBook(" + json.dumps(book, ensure_ascii=False, indent=1) + ");\n")
open(os.path.join(ROOT, "data", "practice-reading.js"), "w", encoding="utf-8", newline="\n").write(js)
print("tests:", len(tests), "| problems:", problems or "none")
for t in tests:
    print(f"T{t['n']}: {len(t['reading']['answers'])} answers, {len(t['reading']['explain'])} explanations")
