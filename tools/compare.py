"""Compare a pipeline output (work/<id>/book.json) with an existing, hand-checked data file.

usage: python tools/compare.py work/917/book.json data/c17.js [--test 1]
Prints, per test and skill: answers that differ, question types that differ, and transcript coverage.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from validate import load_books, group_qs, norm


def kinds(sec_list):
    out = {}
    for s in sec_list:
        for g in s["groups"]:
            for q in group_qs(g):
                out[q] = g["type"]
    return out


def main():
    new = json.load(open(sys.argv[1], encoding="utf-8"))
    ref = load_books([sys.argv[2]] + ([sys.argv[2].replace(".js", "-scripts.js")] if os.path.exists(sys.argv[2].replace(".js", "-scripts.js")) else []))[0]
    only = int(sys.argv[sys.argv.index("--test") + 1]) if "--test" in sys.argv else None
    total = same = 0
    for t in new["tests"]:
        if only and t["n"] != only:
            continue
        rt = next((x for x in ref["tests"] if x["n"] == t["n"]), None)
        for skill in ("listening", "reading"):
            if not t.get(skill) or not rt or not rt.get(skill):
                continue
            key = "parts" if skill == "listening" else "passages"
            a, b = t[skill]["answers"], rt[skill]["answers"]
            ka, kb = kinds(t[skill][key]), kinds(rt[skill][key])
            print(f"== Test {t['n']} {skill}")
            for q in range(1, 41):
                x, y = str(a.get(str(q), a.get(q, ""))), str(b.get(str(q), b.get(q, "")))
                total += 1
                ok = norm(x.split("|")[0]) in [norm(v) for v in re.sub(r"\(([^)]*)\)", r"\1", y).split("|")] + [norm(y.split("|")[0])]
                same += ok
                flag = "" if ok else "   <-- differs"
                if not ok or ka.get(q) != kb.get(q):
                    print(f"  Q{q:>2}: new={x!r:<28} ref={y!r:<28} type {ka.get(q)}/{kb.get(q)}{flag}")
            if skill == "listening":
                cov = lambda secs: sorted({int(n) for s in secs for m in re.findall(r'data-q="([\d ]+)"', s.get("script") or "") for n in m.split()})
                print(f"  transcript evidence: new {len(cov(t[skill][key]))}/40, ref {len(cov(rt[skill][key]))}/40")
    print(f"\nanswers matching: {same}/{total}")


if __name__ == "__main__":
    main()
