import json, re, sys, os

V5_PATH = 'data/v5.js'
with open(V5_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'IELTS\.addBook\((\{.*?\})\);?\s*$', text, re.DOTALL)
if not m:
    print("Could not find addBook block in data/v5.js")
    sys.exit(1)

data = json.loads(m.group(1))

tests_to_update = list(range(1, 11))
for t in data['tests']:
    n = t['n']
    if n in tests_to_update:
        conv_file = f'work/converted_v5_listening/t{n}.json'
        if not os.path.exists(conv_file):
            print(f"Test {n}: file {conv_file} not found yet!")
            continue
        with open(conv_file, 'r', encoding='utf-8') as cf:
            cdata = json.load(cf)
        
        if 'listening' not in t:
            t['listening'] = {}
        
        t['listening']['parts'] = cdata['parts']
        # remove sourcePages
        if 'sourcePages' in t['listening']:
            del t['listening']['sourcePages']
        for p in t['listening']['parts']:
            if 'sourcePages' in p:
                del p['sourcePages']
        
        print(f"Updated Test {n} listening with {len(cdata['parts'])} parts.")

new_js = "IELTS.addBook(" + json.dumps(data, ensure_ascii=False, indent=1) + ");\n"
with open(V5_PATH, 'w', encoding='utf-8') as f:
    f.write(new_js)

print("Successfully written updated data/v5.js")
