"""Build VOL 3/5 from curated keys and faithful source-page images.

Run from the repository root. Requires PyMuPDF and Pillow; source PDFs remain
local and are not committed. The manifest records exact page provenance.
"""
from pathlib import Path
import json, re, hashlib
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / 'tools/volume-rebuild.json'

def source(v, skill, n):
    root = ROOT / f'VOL {v}- ORIGINAL EXAMS' / ('Listening' if skill == 'L' else 'Reading')
    if v == 3 and skill == 'R':
        return next(p for p in root.glob('*.pdf') if re.search(r'test\s*'+str(n)+r'\b',p.stem,re.I))
    folder = next(p for p in root.iterdir() if p.is_dir() and re.fullmatch(r'test\s*'+str(n),p.name,re.I))
    return next(p for p in folder.glob('*.pdf') if p.stem.lower().startswith('test'))

def main():
    config=json.loads(CONFIG.read_text('utf-8'))
    manifest=[]
    for v in [3,5]:
        book={'id':200+v,'title':f'VOL {v}','audioDir':f'assets/audio/v{v}/','tests':[]}
        for n in range(1,11):
            test={'n':n}
            for skill in ['L','R']:
                cfg=config[f'{v}-{skill}-{n}']
                pdf=source(v,skill,n)
                doc=pymupdf.open(pdf)
                answers={str(i+1):a for i,a in enumerate(cfg['answers'])}
                assert len(answers)==40 and all(answers.values()), (v,skill,n)
                data={'answers':answers,'parts' if skill=='L' else 'passages':[]}
                if cfg.get('explain'): data['explain']=cfg['explain']
                for part,pages in enumerate(cfg['pages'],1):
                    lo,hi=((part-1)*10+1,part*10) if skill=='L' else [(1,13),(14,26),(27,40)][part-1]
                    sec={'title':cfg.get('titles',[])[part-1] if cfg.get('titles') else f'Test {n} · {"Part" if skill=="L" else "Passage"} {part}', 'groups':[], 'sourcePages':[]}
                    for spec in pages:
                        page,top,bottom = (spec,0,1) if isinstance(spec,int) else spec
                        pg=doc[page-1]
                        clip=pymupdf.Rect(0,pg.rect.height*top,pg.rect.width,pg.rect.height*bottom)
                        dest=Path(f'assets/papers/v{v}/{skill.lower()}{n}-p{page}-{round(top*100)}-{round(bottom*100)}.webp')
                        (ROOT/dest).parent.mkdir(parents=True,exist_ok=True)
                        if not (ROOT/dest).exists():
                            pix=pg.get_pixmap(dpi=160,clip=clip,alpha=False)
                            Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(ROOT/dest,'WEBP',quality=86,method=6)
                        sec['sourcePages'].append({'src':dest.as_posix(),'alt':f'VOL {v}, Test {n}, {"Listening" if skill=="L" else "Reading"}, source page {page}'})
                    if str(part) in cfg.get('supplements',{}): sec['sourceNote']=cfg['supplements'][str(part)]
                    multis=[m for m in cfg.get('multi',[]) if lo<=m[0]<=hi]
                    q=lo
                    while q<=hi:
                        m=next((m for m in multis if m[0]==q),None)
                        if m:
                            qs=list(range(m[0],m[1]+1))
                            sec['groups'].append({'type':'multi','qs':qs,'instr':f'Choose {len(qs)} letters. Refer to the options in the question paper.','text':'Answers may be selected in either order.','options':['Option '+c for c in 'ABCDEFGHIJKLM'[:m[2]]]})
                            q=m[1]+1
                        else:
                            end=min([m[0]-1 for m in multis if m[0]>q]+[hi])
                            sec['groups'].append({'type':'html','instr':'Enter your answers below. Follow the word limit and instructions in the question paper.','html':'<div class="paper-answer-grid">'+''.join(f'<label><span>{j}</span> [[{j}]]</label>' for j in range(q,end+1))+'</div>'})
                            q=end+1
                    if skill=='L':
                        sec['audio']=f't{n}.mp3' if v==3 and n<=4 else f't{n}-p{part}.mp3'
                        if v==3 and n<=4:
                            sec['sourceNote']='<aside class="source-note">Audio contains the complete test. Playback continues when you change parts; use the seek bar to move within the recording.</aside>'+sec.get('sourceNote','')
                    else: sec['text']=''
                    data['parts' if skill=='L' else 'passages'].append(sec)
                test['listening' if skill=='L' else 'reading']=data
                manifest.append({'volume':v,'test':n,'skill':skill,'file':pdf.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pages':cfg['pages'],'keySource':cfg['keySource']})
            book['tests'].append(test)
            print(f'VOL {v} Test {n}',flush=True)
        (ROOT/f'data/v{v}.js').write_text('// Rebuilt from original source papers; see docs/volume-3-5-repair.md.\nIELTS.addBook('+json.dumps(book,ensure_ascii=False,indent=2)+');\n','utf-8')
    (ROOT/'tools/volume-source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf-8')

if __name__=='__main__': main()
