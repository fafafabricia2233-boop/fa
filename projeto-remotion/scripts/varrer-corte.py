import array, math, subprocess, sys
# regioes de fala dentro de um corte pronto, com vao curto: gagueira aparece
# como regiao curta encostada na seguinte
from faster_whisper import WhisperModel
arq=sys.argv[1]; VAO=float(sys.argv[2]) if len(sys.argv)>2 else 0.12
raw=subprocess.run(["ffmpeg","-nostdin","-v","error","-i",arq,"-ac","1","-ar","16000",
    "-f","s16le","-"],capture_output=True).stdout
x=array.array("h"); x.frombytes(raw); w=160
env=[math.sqrt(sum(v*v for v in x[i*w:(i+1)*w])/w) for i in range(len(x)//w)]
piso=max(env)*0.06
regs=[]; i=0; lim=int(VAO/0.01)
while i<len(env):
    if env[i]>piso:
        j=i; ult=i
        while j<len(env) and (j-ult)<=lim:
            if env[j]>piso: ult=j
            j+=1
        if ult-i>=8: regs.append((i*0.01,ult*0.01))
        i=j
    else: i+=1
m=WhisperModel("medium",device="cpu",compute_type="int8",cpu_threads=4)
print(f"--- {arq}: {len(regs)} regioes (vao {VAO}) ---")
import tempfile,os
d=tempfile.mkdtemp()
for a,b in regs:
    o=os.path.join(d,"r.wav")
    subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-ss",str(a),"-t",str(b-a),
        "-i",arq,"-ac","1","-ar","16000",o],check=True)
    segs,_=m.transcribe(o,language="pt",condition_on_previous_text=False,vad_filter=False,beam_size=5)
    t=" ".join(s.text.strip() for s in segs)
    print(f"  {a:6.2f} -> {b:6.2f} ({b-a:5.2f}s)  {t}")
