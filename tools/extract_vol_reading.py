"""Extract selectable English text and geometry from the curated VOL reading scans."""
import json,sys
from pathlib import Path
from rapidocr import RapidOCR
sys.path.insert(0,str(Path(__file__).parent))
from validate import load_books
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/vol-reading-ocr';OUT.mkdir(parents=True,exist_ok=True)
engine=RapidOCR(params={'Rec.lang_type':'en','EngineConfig.onnxruntime.intra_op_num_threads':3,'EngineConfig.onnxruntime.inter_op_num_threads':1})
for b in load_books([]):
 if not 201<=b['id']<=205:continue
 for t in b['tests']:
  for i,s in enumerate(t.get('reading',{}).get('passages',[]),1):
   for j,page in enumerate(s.get('sourcePages',[]),1):
    dest=OUT/f"{b['id']}-{t['n']}-{i}-{j}.json"
    if dest.exists():continue
    r=engine(str(ROOT/page['src']))
    lines=[{'box':box.tolist(),'text':txt,'confidence':float(score)} for box,txt,score in zip(r.boxes,r.txts,r.scores)] if r.txts else []
    dest.write_text(json.dumps({'source':page['src'],'lines':lines},ensure_ascii=False,indent=2),encoding='utf-8')
    print(dest.stem,len(lines),flush=True)
