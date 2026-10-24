"""Apply reviewed repairs to the last registration of each affected test.

Sources and unresolved issues are recorded in docs/content-audit.md. This does
not infer answers from similarity: every edit below has been reviewed.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main():
    registrations = []
    tests = {}
    files = re.findall(r'"(data/[^"\s]+\.js)"', (ROOT / 'index.html').read_text(encoding='utf8'))
    # Registration order matters: supplement files replace earlier readings.
    for filename in files:
        path = ROOT / filename
        text = path.read_text(encoding='utf8')
        for m in re.finditer(r'IELTS\.(addBook|addReading)\(', text):
            start = text.find('{', m.end())
            try:
                obj, size = json.JSONDecoder().raw_decode(text[start:])
            except ValueError:
                continue
            reg = [path, text, start, start + size, obj, json.dumps(obj, ensure_ascii=False)]
            registrations.append(reg)
            if m[1] == 'addBook':
                for t in obj['tests']:
                    for skill in ('reading', 'listening'):
                        if skill in t:
                            tests[obj['id'], t['n'], skill] = t[skill]
            else:
                bid, tn = map(int, re.findall(r'\d+', text[m.end():start]))
                tests[bid, tn, 'reading'] = obj

    def reading(b, t):
        return tests[b, t, 'reading']

    fixes = {
        (204, 6): {27: 'NOT GIVEN'},
        (207, 11): {32: 'YES'},
        (205, 10): {2: 'NOT GIVEN'},
        (205, 4): {9: 'FALSE'},
        (202, 2): {26: 'administrative systems', 32: 'NO', 33: 'NOT GIVEN'},
        (201, 8): {20: 'TRUE', 21: 'NOT GIVEN', 22: 'FALSE', 25: 'B'},
        (202, 1): {28: 'D', 33: 'F'},
        (203, 3): {9: 'cake|neem cake', 12: 'neem seeds|seeds'},
    }
    for (b, t), answers in fixes.items():
        reading(b, t)['answers'].update({str(q): a for q, a in answers.items()})

    # Source VOL 1 Test 1, printed page 18: OCR shifted the option labels.
    mozart = reading(201, 1)['passages'][2]['groups'][2]
    mozart['box'] = list(map(list, zip('ABCDEFGHIJ', ['popular', 'artistic', 'completed', 'eight', 'tuition', 'encouragement', 'inherited', 'four', 'practice', 'two'])))
    reading(201, 1)['answers'].update({'37': 'E', '38': 'D', '39': 'A', '40': 'G'})

    for b, t, p, gi in [(201,1,3,3),(201,4,3,2),(202,2,3,1),(202,4,1,2),(202,7,3,3),(202,8,3,2)]:
        g = reading(b,t)['passages'][p-1]['groups'][gi-1]
        if g['type'] == 'html':
            continue
        items = g.pop('items')
        if g['type'] == 'mcq':
            assert all(it['options'] == items[0]['options'] for it in items)
            g['letters'] = 'ABCDEFGHIJ'
            g['box'] = list(map(list, zip(g['letters'], items[0]['options'])))
        g['type'] = 'html'
        g['html'] = ''.join('<p>' + it['text'] + '</p>' for it in items if it['text'].strip())

    # Either order is explicitly possible in the original two paired blanks.
    for b, t in [(201, 8), (203, 3)]:
        reading(b, t)['answers'].update({'16': 'cow manure|straw', '17': 'straw|cow manure'})
        reading(b, t)['passages'][1]['answerPairs'] = [[16,17]]

    mi = reading(204, 4)['passages'][0]
    mi['text'] = mi['text'].replace('<b>Bodily-kinesthetic intelligence:</b> Involves understanding how to communicate', '<b>Interpersonal intelligence:</b> Involves understanding how to communicate')
    mi['text'] = mi['text'].replace('<p><b>Interpersonal intelligence:</b>', '<p><b>Bodily-kinesthetic intelligence:</b> This intelligence uses precise and whole-body movement. It can be developed by working with construction materials, dancing, playing sports, and joining active games.</p>\n<p><b>Interpersonal intelligence:</b>')
    mi['text'] = mi['text'].replace('<p><b>Applying Multiple Intelligence theory to the classroom</b></p>', '<p><b>Naturalist intelligence:</b> This intelligence involves understanding living things and their surroundings. It can be developed through exploring outdoors, making collections of objects, examining them, and sorting them into groups.</p>\n<p><b>Applying Multiple Intelligence theory to the classroom</b></p>')
    mi.pop('dataMismatchWarning', None)
    reading(204,4)['answers'].update({'5':'discussion|discussions','9':'(our) emotions'})
    reading(204,4)['answers']['8'] = 'construction materials'

    for tn, parts in {1:[3,4],3:[1,2,3],4:[1,2,3,4]}.items():
        for pn in parts:
            tests[18,tn,'listening']['parts'][pn-1]['audio'] = f'recovered-t{tn}-p{pn}.mp3'

    # Same Stone Point recording, confirmed against the supplied VOL 9 transcript.
    stone = tests[206,2,'listening']
    reference = tests[209,8,'listening']
    stone['answers'].update({str(q):reference['answers'][str(q)] for q in range(21,31)})
    stone['parts'][2]['script'] = re.sub(r'<span class="ts"[^>]*>.*?</span>', '', reference['parts'][2]['script'])
    # Elmsden Station reopened; Visitors' Centre offers bicycle hire.
    tests[204,4,'listening']['answers']['17'] = 'A'
    tests[206,6,'listening']['answers']['16'] = 'C'
    tests[204,5,'listening']['answers'].update({'21':'C','22':'D'})
    tests[205,7,'listening']['answers']['9'] = '3|three'

    # VOL 4 original PDF pp.27–28; Q22's duplicated stem is a source typo.
    # The recording explicitly asks how the department first contacted Willows.
    willows = tests[204,4,'listening']['parts'][2]
    willows['groups'] = [
        dict(type='mcq', instr='Questions 21–26<br>Choose the correct letter, <b>A, B or C</b>.', items=[
            dict(q=21,text='What field is Willows currently focused on?',options=['Specialising in one product','Making a variety of products','Adding a lot of retail outlets']),
            dict(q=22,text='How did the department first find out about Willows?',options=['The professor contacted the company.','An article was read in a newspaper.','A student worked there part-time during the vacations.']),
            dict(q=23,text='How did the student feel about the software?',options=["It is not easy to predict.",'It is slow for drawing designs.','It had a good interface.']),
            dict(q=24,text='How did the students find out about the effects of the software on the company?',options=['They went to the IT department.','They talked with the manager.','They inspected the accounts.']),
            dict(q=25,text='The reason why the students have a face-to-face interview alone is that',options=['they could prepare for exams.','there will be less disturbance.','it is less realistic.']),
            dict(q=26,text='How did the two students perform in the exam?',options=['Very disappointing','Significantly good','Above the average'])]),
        dict(type='multi',instr='Questions 27–28<br>Choose <b>TWO</b> letters, <b>A–E</b>.',qs=[27,28],text='In which TWO ways will the new system affect the company?',options=['Gain more profit','Employ more new staff','Increase sales','Reduce production time','Cut labour costs']),
        dict(type='multi',instr='Questions 29–30<br>Choose <b>TWO</b> letters, <b>A–E</b>.',qs=[29,30],text='Which TWO effects will the new system have on new clients?',options=['Getting more involved in the design','Obtaining more contacts','Linking at home to do online work','Wasting less time','Decreasing labour costs'])]
    tests[204,4,'listening']['answers'].update(dict(zip(map(str,range(21,31)),['A','B','A','C','B','C','B','E','A','D'])))
    willows.pop('dataMismatchWarning',None)

    # Reuse recordings only after comparing the questions and the spoken content.
    for target, source in [((202,8,2),(205,7,2)), ((202,8,3),(209,7,3)),
                           ((207,5,3),(204,5,3)), ((207,6,1),(205,7,1)),
                           ((208,2,2),(205,2,2))]:
        b,t,p = target
        sb,st,sp = source
        sec = tests[b,t,'listening']['parts'][p-1]
        src = tests[sb,st,'listening']['parts'][sp-1]
        sec['audio'] = f'../v{sb-200}/' + src['audio']
        if src.get('audioStart') is not None:
            sec['audioStart'] = src['audioStart']
        if src.get('script'):
            sec['script'] = src['script']
        sec.pop('dataMismatchWarning', None)

    wildlife = tests[202,8,'listening']['parts'][0]
    wildlife['audio'] = 'recovered-t8-p1.mp3'
    wildlife.pop('dataMismatchWarning', None)
    wildlife['groups'][0]['html'] = wildlife['groups'][0]['html'].replace('[[3]]@.', 'mj@[[3]]').replace('<td>[[6]]</td>', '<td>£[[6]]</td>')
    tests[202,8,'listening']['answers'].update({'1':'(a) radio program| (a) radio programme','3':'hennings.co.uk','5':'joint (membership)','6':'49|forty-nine','7':'(the) Union Bank','8':'15th October|15 October|October 15|October 15th'})

    # Source key used slash notation for alternative valid single-word answers.
    tests[202,1,'listening']['answers']['14'] = 'family|families'
    tests[202,9,'listening']['answers'].update({'5':'color|colour','8':'cheque|check'})
    tests[204,2,'listening']['answers']['35'] = 'electricity|energy'
    tests[204,5,'listening']['answers']['36'] = 'defences|defenses'
    # The original instruction conflicts with the recorded phrase "feed the animals";
    # the one-word answer "feed" fits the existing sentence and the word limit.
    tests[202,1,'listening']['answers']['15'] = 'feed'
    tests[202,4,'listening']['answers']['1'] = 'pool'
    eyesaver = tests[202,2,'listening']['parts'][1]
    eyesaver['groups'][0]['instr'] = eyesaver['groups'][0]['instr'].replace('ONE WORD AND/OR A NUMBER', 'NO MORE THAN FOUR WORDS AND/OR A NUMBER')
    night_shift = tests[202,7,'listening']['parts'][3]
    night_shift['groups'][0]['instr'] = night_shift['groups'][0]['instr'].replace('ONE WORD AND/OR A NUMBER', 'NO MORE THAN TWO WORDS AND/OR A NUMBER')

    for b,t,p,title in [(202,4,1,'Apartments in Arillas'), (202,6,1,'Medical consultation — Anu Bhatt'), (204,6,4,'The Lontar Palm')]:
        section = tests[b,t,'listening']['parts'][p-1]
        section['audio'] = f'recovered-t{t}-p{p}.mp3'
        section['title'] = title
        section.pop('dataMismatchWarning', None)

    for b,t,parts in [(207,5,[1,2,4]),(207,6,[2,3,4]),(207,7,[1,2,3,4]),(208,1,[1,2,3,4]),(208,2,[1,3,4]),(208,4,[1,2,3,4])]:
        for p in parts:
            tests[b,t,'listening']['parts'][p-1]['audio'] = f'recovered-t{t}-p{p}.mp3'

    patient = reading(202, 1)['passages'][2]
    recent = json.loads((ROOT / 'tools/recent-content-repairs.json').read_text(encoding='utf8'))
    source = next(x for x in recent if x['test'] == 4 and x['part'] == 3 and 'groups' in x)
    patient['groups'][0]['items'][0]['text'] = source['groups'][0]['items'][0]['text']
    g = patient['groups'][1]
    if g['type'] == 'match':
        g['type'] = 'html'
        items = g.pop('items')
        g['html'] = '<h4>Over-the-counter medicines</h4>' + ''.join('<p>' + x['text'] + '</p>' for x in items[:3])
        g['html'] += '<h4>Prescription-only medicines</h4>' + ''.join('<p>' + x['text'] + '</p>' for x in items[3:])

    g = reading(201, 3)['passages'][2]['groups'][1]
    g['letters'] = 'ABCDEFGHI'
    if '<div class="box">' in g['html']:
        body, box = g['html'].split('<div class="box">')
        g['box'] = [list(x) for x in re.findall(r'<p><b>([A-I])</b> (.*?)</p>', box)]
        g['html'] = body.rstrip()

    # Restore locally supplied original text, not a paraphrase of online text.
    robot = reading(208, 4)['passages'][1]
    restored = json.loads((ROOT / 'tools/original-content-excerpts.json').read_text(encoding='utf8'))
    robot['text'] = robot['text'].split('<p><b>F</b>')[0] + restored['v8-t4-p2-FG']['html']

    changed = {}
    for path, text, start, end, obj, before in registrations:
        if json.dumps(obj, ensure_ascii=False) != before:
            indent_match = re.search(r'\n( +)"', text[start:end])
            indent = len(indent_match[1]) if indent_match else 2
            changed.setdefault(path, [text, []])[1].append((start, end, json.dumps(obj, ensure_ascii=False, indent=indent)))
    for path, (text, replacements) in changed.items():
        for start, end, replacement in sorted(replacements, reverse=True):
            text = text[:start] + replacement + text[end:]
        path.write_text(text, encoding='utf8')
        print(path.relative_to(ROOT))


if __name__ == '__main__':
    main()
