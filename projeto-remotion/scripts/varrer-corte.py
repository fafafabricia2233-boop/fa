#!/usr/bin/env python3
"""VARRE O CORTE PRONTO atrás de falso começo e gagueira.

ORDEM PERMANENTE DA DONA (15/09/2026): *"lembre que a última fala geralmente é a
fala definitiva, ajuste no vídeo, não pode ter fala repetida e gaguejando"* e,
logo depois: **"sempre refaça essa varredura nos próximos vídeos."**

POR QUE EXISTE. Na NH_medico v1 foi entregue "O paciente… O paciente escolheu o
seu trabalho…". Dentro de UMA região de fala da fita havia um falso começo de
0,82 s e, 250 ms depois, a tomada definitiva; o corte entrou no primeiro ataque.

E por que os passos que já existiam não pegaram:
  · TRANSCREVER o corte não pega — o modelo funde as duas tentativas e devolve a
    frase uma vez só. É o mesmo defeito documentado desde a NH_saque, e ele vale
    também para o corte já feito, não só para a fita bruta.
  · VARRER A FITA não pega — com vão de 0,18 s as duas tentativas viram uma
    região só, porque o falso começo é curto e a pausa entre eles também.

O que pega é varrer o CORTE, com vão curto, e transcrever cada região sozinha.

DOIS VÃOS, e nenhum substitui o outro:
  0,12  acha o falso começo (foi o que faltou na NH_medico v1)
  0,07  pica a frase inteira e serve pra confirmar que o resto é respiro

COMO SE LÊ. Gagueira é a região seguinte REPETIR a abertura da anterior
("o paciente" → "O paciente escolheu…"). Região que CONTINUA a frase
("…pode dominar", "…paciente não é um número") é respiro de vírgula, e fica.
O script marca sozinho os dois casos; a decisão continua sendo de quem edita.

Uso:  python3 scripts/varrer-corte.py <corte.wav|corte.mp4> [...] [--vao 0.12]
      python3 scripts/varrer-corte.py public/newhair/falado13/*.wav

Sai com código 1 se suspeitar de falso começo em algum arquivo — serve de
portão no QA antes de renderizar.
"""
import array, math, os, subprocess, sys, tempfile, unicodedata

def normaliza(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return [p for p in "".join(c if c.isalnum() else " " for c in t).split() if p]

def regioes(arq, vao):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", arq,
                          "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw); w = 160
    env = [math.sqrt(sum(v * v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]
    if not env: return []
    piso = max(env) * 0.06
    fora = []; i = 0; lim = int(vao / 0.01)
    while i < len(env):
        if env[i] > piso:
            j = i; ult = i
            while j < len(env) and (j - ult) <= lim:
                if env[j] > piso: ult = j
                j += 1
            if ult - i >= 8: fora.append((i * 0.01, ult * 0.01))
            i = j
        else:
            i += 1
    return fora

def main():
    args = sys.argv[1:]
    vao = 0.12
    if "--vao" in args:
        k = args.index("--vao"); vao = float(args[k+1]); args = args[:k] + args[k+2:]
    if not args: sys.exit(__doc__)

    from faster_whisper import WhisperModel
    modelo = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4)
    tmp = tempfile.mkdtemp()
    suspeitos = []

    for arq in args:
        regs = regioes(arq, vao)
        print(f"\n--- {arq}: {len(regs)} região(ões), vão {vao:.2f} s ---")
        textos = []
        for a, b in regs:
            o = os.path.join(tmp, "r.wav")
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(a),
                            "-t", str(b - a), "-i", arq, "-ac", "1", "-ar", "16000", o],
                           check=True)
            segs, _ = modelo.transcribe(o, language="pt", condition_on_previous_text=False,
                                        vad_filter=False, beam_size=5)
            textos.append(" ".join(s.text.strip() for s in segs))
            print(f"  {a:6.2f} → {b:6.2f} ({b-a:5.2f}s)  {textos[-1]}")

        # falso começo: a região seguinte REPETE a abertura da anterior
        for k in range(len(regs) - 1):
            a, b = normaliza(textos[k]), normaliza(textos[k+1])
            if not a or not b: continue
            n = min(len(a), len(b), 3)
            if n >= 1 and a[:n] == b[:n]:
                suspeitos.append((arq, regs[k], regs[k+1], textos[k], textos[k+1]))
                print(f"  ⚠ FALSO COMEÇO: a região {regs[k][0]:.2f} repete a abertura "
                      f"da de {regs[k+1][0]:.2f} — o corte deve entrar em "
                      f"{regs[k+1][0]:.2f} s ou depois.")

    if suspeitos:
        print(f"\n{len(suspeitos)} suspeita(s) de fala repetida. Refazer o corte "
              f"antes de renderizar.")
        return 1
    print("\nNenhuma abertura repetida. As quebras que sobraram são respiro — "
          "conferir se a região seguinte CONTINUA a frase.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
