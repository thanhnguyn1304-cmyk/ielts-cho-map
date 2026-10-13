"""Import additional complete VOL tests from reviewed keys and original PDF pages.
Run at repository root. Existing tests stay in their original data files; this
emits a supplemental registration file. PDF sources are local, manifest is tracked.
"""
from pathlib import Path
import json,hashlib
import pymupdf
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent

def main():
 config=json.loads((ROOT/'tools/remaining-volumes.json').read_text('utf-8'))
 manifest=[]; books={}; registrations=[]
 for ident,c in config.items():
  v,skill,n=ident.split('-');v=int(v);n=int(n)
  src=ROOT/c['source'];doc=pymupdf.open(src)
  assert len(c['answers'])==40 and all(c['answers']),ident
  data={'answers':{str(i+1):a for i,a in enumerate(c['answers'])},'parts' if skill=='L' else 'passages':[]}
  if c.get('explain'):data['explain']=c['explain']
  for part,pages in enumerate(c['pages'],1):
   lo,hi=((part-1)*10+1,part*10) if skill=='L' else c.get('ranges',[[1,13],[14,26],[27,40]])[part-1]
   sec={'title':c.get('titles',[f'Test {n} · {"Part" if skill=="L" else "Passage"} {i}' for i in range(1,5)])[part-1],'groups':[],'sourcePages':[]}
   for spec in pages:
    p,top,bottom=(spec,0,1) if isinstance(spec,int) else spec
    pg=doc[p-1];dest=Path(f'assets/papers/v{v}/{skill.lower()}{n}-p{p}-{round(top*100)}-{round(bottom*100)}.webp')
    (ROOT/dest).parent.mkdir(parents=True,exist_ok=True)
    if not (ROOT/dest).exists():
     pix=pg.get_pixmap(dpi=160,clip=pymupdf.Rect(0,pg.rect.height*top,pg.rect.width,pg.rect.height*bottom),alpha=False)
     Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(ROOT/dest,'WEBP',quality=86,method=6)
    sec['sourcePages'].append({'src':dest.as_posix(),'alt':f'VOL {v}, Test {n}, {"Listening" if skill=="L" else "Reading"}, source page {p}'})
   if str(part) in c.get('notes',{}):sec['sourceNote']='<aside class="source-note">'+c['notes'][str(part)]+'</aside>'
   multis=[m for m in c.get('multi',[]) if lo<=m[0]<=hi];q=lo
   while q<=hi:
    m=next((m for m in multis if m[0]==q),None)
    if m:
     sec['groups'].append({'type':'multi','qs':list(range(m[0],m[1]+1)),'instr':f'Choose {m[1]-m[0]+1} letters. Refer to the options in the question paper.','text':'Answers may be selected in any order.','options':['Option '+ch for ch in 'ABCDEFGHIJKLM'[:m[2]]]});q=m[1]+1
    else:
     end=min([m[0]-1 for m in multis if m[0]>q]+[hi]);sec['groups'].append({'type':'html','instr':'Enter your answers below. Follow the word limit and instructions in the question paper.','html':'<div class="paper-answer-grid">'+''.join(f'<label><span>{j}</span> [[{j}]]</label>' for j in range(q,end+1))+'</div>'});q=end+1
   if skill=='L':sec['audio']=c.get('audio',[f't{n}-p{i}.mp3' for i in range(1,5)])[part-1]
   else:sec['text']=''
   data['parts' if skill=='L' else 'passages'].append(sec)
  if v==1:
   b=books.setdefault(v,{'id':201,'title':'VOL 1','audioDir':'assets/audio/v1/','tests':[]})
   t=next((t for t in b['tests'] if t['n']==n),None)
   if t is None:t={'n':n};b['tests'].append(t)
   t['listening' if skill=='L' else 'reading']=data
  else:
   assert skill=='R';registrations.append(f'IELTS.addReading({200+v}, {n}, '+json.dumps(data,ensure_ascii=False,indent=2)+');')
  manifest.append({'volume':v,'skill':skill,'test':n,'file':c['source'],'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'pages':c['pages'],'keySource':c['keySource']})
  print(ident,flush=True)
 for b in books.values():registrations.insert(0,'IELTS.addBook('+json.dumps(b,ensure_ascii=False,indent=2)+');')
 (ROOT/'data/vol-supplement.js').write_text('// Source papers and reviewed keys: docs/remaining-volumes.md\n'+'\n'.join(registrations)+'\n','utf-8')
 (ROOT/'tools/remaining-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf-8')
if __name__=='__main__':main()
