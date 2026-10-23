import json, re, sys

V1_PATH = 'data/v1.js'
with open(V1_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'IELTS\.addBook\((\{.*?\})\);?\s*$', text, re.DOTALL)
if not m:
    print("Could not find addBook block in data/v1.js")
    sys.exit(1)

data = json.loads(m.group(1))

tests_to_update = [1, 2, 3, 4, 5, 6, 7, 9, 10]
for t in data['tests']:
    n = t['n']
    if n in tests_to_update:
        conv_file = f'work/converted_v1_listening/t{n}.json'
        with open(conv_file, 'r', encoding='utf-8') as cf:
            cdata = json.load(cf)
        
        if 'listening' not in t:
            t['listening'] = {}
        
        t['listening']['parts'] = cdata['parts']
        # remove sourcePages
        if 'sourcePages' in t['listening']:
            del t['listening']['sourcePages']
        # ensure each part has no sourcePages
        for p in t['listening']['parts']:
            if 'sourcePages' in p:
                del p['sourcePages']
        
        print(f"Updated Test {n} listening with {len(cdata['parts'])} parts.")

# Format as JavaScript
new_js = "IELTS.addBook(" + json.dumps(data, ensure_ascii=False, indent=1) + ");\n"
with open(V1_PATH, 'w', encoding='utf-8') as f:
    f.write(new_js)

print("Successfully written updated data/v1.js")
