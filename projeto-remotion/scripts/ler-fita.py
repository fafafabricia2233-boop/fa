#!/usr/bin/env python3
"""Lê o bruto de verdade: regiões de fala x transcrição, e reanálise do suspeito.

Junta num passo só a disciplina que três peças seguidas ensinaram (§02):

  1. VARRER  — acha as regiões com energia acima do piso. Já apareceu região
               inteira que o ASR ignorou (NH_saque: o gancho bom).
  2. COMPARAR — cruza com a cobertura do JSON. Região sem texto = fala perdida.
  3. SEPARAR  — quando o texto de UM segmento cobre MAIS DE UMA região, o modelo
               costurou tentativas diferentes numa frase só e a repetição sumiu
               (NH_antecipa: "sem interromper" dito duas vezes). Aqui cada região
               é transcrita SOZINHA, que é quando a repetição aparece.
  4. DUAS PASSADAS — com e sem `initial_prompt`. O vocabulário do assunto faz o
               modelo COMPLETAR a frase esperada em janelas curtas; só quando as
               duas passadas concordam a leitura vale.

O VÃO importa: regiões são unidas quando a pausa entre elas é menor que --vao
(padrão 0,30 s). Fala corrida devolve UMA região só — é sinal de baixar o vão,
não de que a fita é uma frase só. 0,18 costuma separar frase de frase.

Uso: python3 scripts/ler-fita.py <audio.wav> [--voc "palavra, ..."] [--vao 0.18]
"""
import array, json, math, subprocess, sys, tempfile, os

audio = sys.argv[1]
VOC = None
if "--voc" in sys.argv:
    VOC = sys.argv[sys.argv.index("--voc") + 1]
VAO = float(sys.argv[sys.argv.index("--vao") + 1]) if "--vao" in sys.argv else 0.30

PASSO = 0.01

def pcm(args):
    return subprocess.run(["ffmpeg", "-nostdin", "-v", "error"] + args +
                          ["-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                          capture_output=True).stdout

x = array.array("h"); x.frombytes(pcm(["-i", audio]))
w = int(16000 * PASSO)
env = [math.sqrt(sum(v*v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]
piso = max(env) * 0.05

# regiões: fala contínua, unindo vãos de até VAO, mínimo 0,15 s
regioes, i = [], 0
while i < len(env):
    if env[i] > piso:
        j, ultimo = i, i
        limite = int(VAO / PASSO)
        while j < len(env) and (j - ultimo) <= limite:
            if env[j] > piso: ultimo = j
            j += 1
        if (ultimo - i) >= 15: regioes.append((i * PASSO, ultimo * PASSO))
        i = j
    else:
        i += 1

t = json.load(open(os.path.splitext(audio)[0] + ".transcricao.json"))
segs = t["segmentos"]

print(f"{len(regioes)} regiões de fala (vão {VAO:.2f}s), {len(segs)} segmentos no JSON")
if len(regioes) <= 1:
    print("  ^ uma região só: fala corrida. Baixe --vao (tente 0.18) antes de concluir.")
print()

from faster_whisper import WhisperModel
modelo = WhisperModel("medium", device="cpu", compute_type="int8")

def ouvir(ini, dur, prompt):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        tmp = f.name
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(ini),
                    "-t", str(dur), "-i", audio, "-ac", "1", "-ar", "48000", tmp], check=True)
    s, _ = modelo.transcribe(tmp, language="pt", condition_on_previous_text=False,
                             initial_prompt=prompt)
    txt = " ".join(seg.text.strip() for seg in s)
    os.unlink(tmp)
    return txt

for a, b in regioes:
    dentro = [s for s in segs if s["inicio"] < b and s["fim"] > a]
    marca = ""
    if not dentro:
        marca = "  *** SEM TEXTO NO JSON — fala perdida ***"
    else:
        # o segmento cobre mais de uma região? então há tentativas costuradas
        for s in dentro:
            n = sum(1 for r in regioes if s["inicio"] < r[1] and s["fim"] > r[0])
            if n > 1:
                marca = f"  *** o segmento do JSON cobre {n} regiões — costurado ***"
                break
    print(f"região {a:6.2f} → {b:6.2f} ({b-a:5.2f}s){marca}")
    p1 = ouvir(a - 0.05, (b - a) + 0.15, None)
    print(f"   sozinha, sem voc : {p1}")
    if VOC:
        p2 = ouvir(a - 0.05, (b - a) + 0.15, VOC)
        print(f"   sozinha, com voc : {p2}")
        if p1.strip().lower() != p2.strip().lower():
            print("   ^^^ as duas passadas DIVERGEM: conferir na mídia antes de usar")
    print()
