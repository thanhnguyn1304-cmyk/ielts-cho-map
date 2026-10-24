"""Content inventory and review candidates; flags are not proof of a wrong answer.

Run from the repository root. Uses the same registrations as the player. Writes
work/content-audit.json so every flagged test can be reviewed against its source.
"""
import collections
import hashlib
import html
import json
import re
from pathlib import Path
from validate import load_books, group_qs, check_test

ROOT = Path(__file__).resolve().parent.parent


def plain(value):
    return html.unescape(re.sub(r'<[^>]*>', ' ', value or ''))


def normalized(value):
    return ' '.join(re.findall(r'[a-z0-9]+', plain(str(value)).lower()))


def alternatives(value):
    out = []
    for alt in str(value).split('|'):
        pending = [alt]
        while any(re.search(r'\([^)]*\)', s) for s in pending):
            expanded = []
            for s in pending:
                m = re.search(r'\(([^)]*)\)', s)
                expanded.extend([s.replace(m[0], m[1]), s.replace(m[0], '')] if m else [s])
            pending = expanded
        out.extend(normalized(s) for s in pending if normalized(s))
    return out


def audit():
    books = load_books([])
    flags, inventory = [], []
    questions = collections.defaultdict(list)
    totals = collections.Counter()
    for b in books:
        for t in b['tests']:
            for skill in ['listening', 'reading']:
                if skill not in t:
                    continue
                data = t[skill]
                secs = data['parts' if skill == 'listening' else 'passages']
                ident = f"{b['id']}:{t['n']}:{skill}"
                errors, warnings = check_test(b, t, skill)
                totals[skill + '_tests'] += 1
                totals['questions'] += sum(len(group_qs(g)) for s in secs for g in s['groups'])
                for detail in errors:
                    flags.append(dict(id=ident, kind='structure', detail=detail))
                for i, sec in enumerate(secs, 1):
                    sid = f'{ident}:{i}'
                    text = normalized(sec.get('text' if skill == 'reading' else 'script', ''))
                    qs = [q for g in sec['groups'] for q in group_qs(g)]
                    inventory.append(dict(id=sid, title=sec.get('title'), questions=qs,
                                          words=len(text.split()), audio=sec.get('audio'),
                                          sourcePages=len(sec.get('sourcePages', []))))
                    def flag(kind, detail):
                        flags.append(dict(id=sid, kind=kind, detail=detail))
                    if sec.get('dataMismatchWarning'):
                        flag('existing_mismatch', sec['dataMismatchWarning'])
                    if skill == 'listening':
                        if not sec.get('audio'):
                            flag('missing_audio', sec.get('title'))
                        if not text:
                            flag('missing_transcript', sec.get('title'))
                    elif len(text.split()) < 250 and not sec.get('sourcePages'):
                        flag('short_passage', len(text.split()))
                    labels = re.findall(r'<b>\s*([A-Z])\s*</b>', sec.get('text', ''))
                    for gi, g in enumerate(sec['groups'], 1):
                        gqs = group_qs(g)
                        instr = plain(g.get('instr', ''))
                        m = re.search(r'Questions?\s+(\d+)\s*[–—-]\s*(\d+)', instr, re.I)
                        if m and gqs and (min(gqs), max(gqs)) != tuple(map(int, m.groups())):
                            flag('instruction_range', dict(group=gi, printed=m[0], actual=gqs))
                        if g.get('type') == 'match' and re.search(r'which (paragraph|section)', instr, re.I):
                            for q in gqs:
                                ans = str(data.get('answers', {}).get(str(q), ''))
                                if labels and any(a.strip() not in labels for a in ans.split('|')):
                                    flag('paragraph_label', dict(q=q, answer=ans, labels=labels))
                        for q in gqs:
                            answer = data.get('answers', {}).get(str(q))
                            if answer is None or not str(answer).strip():
                                flag('blank_key', q)
                            if g['type'] == 'html' and not g.get('letters') and text:
                                if not any(re.search(r'\b' + re.escape(a) + r'\b', text) for a in alternatives(answer)):
                                    flag('word_answer_not_in_text', dict(q=q, answer=answer, group=gi))
                            # Compare identical questions and option lists across the library.
                            item = next((it for it in g.get('items', []) if it['q'] == q), None)
                            if item:
                                sig = normalized(item['text']) + json.dumps(item.get('options', g.get('box', [])), ensure_ascii=False)
                                if len(normalized(item['text'])) > 30:
                                    questions[sig].append(dict(id=sid, q=q, answer=answer, text=item['text'], title=sec.get('title')))
                    if skill == 'listening' and text:
                        marked = {int(n) for group in re.findall(r'data-q="([\d ]+)"', sec.get('script', '')) for n in group.split()}
                        if set(qs) - marked:
                            flag('unmarked_transcript', sorted(set(qs) - marked))
            for task in t.get('writing', []):
                if not task.get('prompt') or (task.get('image') and not (ROOT / task['image']).exists()):
                    flags.append(dict(id=f"{b['id']}:{t['n']}:writing", kind='writing_material', detail=task))
    for group in questions.values():
        if len(group) > 1 and len({normalized(x['answer']) for x in group}) > 1:
            flags.append(dict(id=group[0]['id'], kind='conflicting_duplicate_key', detail=group))
    result = dict(totals=dict(totals), inventory=inventory, flags=flags)
    dest = ROOT / 'work/content-audit.json'
    dest.parent.mkdir(exist_ok=True)
    dest.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(result['totals']))
    print(json.dumps(dict(collections.Counter(f['kind'] for f in flags)), indent=2))
    print(dest)


if __name__ == '__main__':
    audit()
