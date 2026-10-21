from pathlib import Path
import json,re,subprocess,time
import numpy as np,torch,imageio_ffmpeg
from transformers import WhisperProcessor,WhisperForConditionalGeneration
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/audio-markers';OUT.mkdir(exist_ok=True)
torch.set_num_threads(3)
p=WhisperProcessor.from_pretrained('openai/whisper-tiny',local_files_only=True)
m=WhisperForConditionalGeneration.from_pretrained('openai/whisper-tiny',local_files_only=True).eval()
ff=imageio_ffmpeg.get_ffmpeg_exe()
books=json.loads((ROOT/'work/current-books.json').read_text(encoding='utf-8-sig'))
for book in books:
 for test in book['tests']:
  parts=test.get('listening',{}).get('parts',[])
  files=[x.get('audio') for x in parts]
  for file in set(files):
   if not file or files.count(file)<2:continue
   key=f"{book['id']}-{test['n']}";dest=OUT/(key+'.json')
   if dest.exists():continue
   audio=ROOT/book['audioDir']/file
   r=subprocess.run([ff,'-hide_banner','-i',str(audio),'-af','silencedetect=noise=-32dB:d=7','-f','null','-'],capture_output=True,text=True)
   ends=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',r.stderr)]
   candidates=[]
   for end in ends:
    start=max(0,end-0.8)
    raw=subprocess.check_output([ff,'-v','error','-ss',str(start),'-t','16','-i',str(audio),'-f','f32le','-ac','1','-ar','16000','pipe:1'])
    if len(raw)<16000:continue
    x=p(np.frombuffer(raw,dtype=np.float32),sampling_rate=16000,return_tensors='pt')
    with torch.inference_mode():ids=m.generate(x.input_features,language='english',task='transcribe',max_new_tokens=110)
    text=p.batch_decode(ids,skip_special_tokens=True,clean_up_tokenization_spaces=False)[0].strip()
    candidates.append({'start':round(start,3),'text':text})
   dest.write_text(json.dumps({'book':book['id'],'test':test['n'],'file':str(audio.relative_to(ROOT)),'candidates':candidates},indent=2),encoding='utf-8')
   markers=[x for x in candidates if re.search(r'(section|part)\s*(two|three|four|2|3|4)\b',x['text'],re.I)]
   print(key,markers,flush=True)
