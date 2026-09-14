#!/usr/bin/env python3
"""Confere pontos de corte no ENVELOPE do áudio, não no JSON do transcritor.

Existe por causa de um erro real (NH_velocidade, 14/09/2026): o ASR marcava
"agilidade" começando em 1,30 s, o corte foi em 1,22 achando que sobrava folga,
e a palavra entrou mastigada — porque o modelo ancora na SÍLABA TÔNICA e a vogal
átona que abre a palavra tinha começado em 1,13.

Pra cada tempo candidato mostra o perfil de energia em volta e aponta o VALE mais
próximo, que é onde o corte deve morar. Fala emendada pode não ter vale nenhum:
aí o script diz isso, e a decisão é incluir a palavra anterior inteira ou trocar
de take — nunca cortar no meio da vogal.

Uso: bordas.py <audio> <tempo> [tempo ...] [--janela 0.5]
"""
import array, math, subprocess, sys

audio = sys.argv[1]
janela = 0.5
args = sys.argv[2:]
if "--janela" in args:
    i = args.index("--janela"); janela = float(args[i+1]); args = args[:i] + args[i+2:]
tempos = [float(a) for a in args]

PASSO = 0.01

def envelope(ini, dur):
    raw = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-ss", str(max(0, ini)), "-t", str(dur),
         "-i", audio, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
        capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw)
    w = int(16000 * PASSO)
    return [math.sqrt(sum(v*v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]

for t in tempos:
    ini = t - janela
    e = envelope(ini, janela * 2)
    if not e:
        print(f"\n{t:.3f} s — sem áudio aqui"); continue
    mx = max(e) or 1
    # vale = mínimo local mais próximo de t, entre trechos com fala dos dois lados
    i_alvo = int(janela / PASSO)
    piso = mx * 0.18
    candidatos = [i for i in range(2, len(e)-2)
                  if e[i] <= e[i-1] and e[i] <= e[i+1] and e[i] < piso]
    print(f"\n=== candidato {t:.3f} s " + "=" * 40)
    for i, v in enumerate(e):
        tt = ini + i * PASSO
        marca = ""
        if abs(tt - t) < PASSO / 2: marca += "  <<< o corte pedido"
        if candidatos and i == min(candidatos, key=lambda c: abs(c - i_alvo)): marca += "  <<< VALE"
        print(f"  {tt:7.3f}  {'#' * int(36 * v / mx):36s}{marca}")
    if candidatos:
        melhor = ini + min(candidatos, key=lambda c: abs(c - i_alvo)) * PASSO
        print(f"  -> vale mais proximo: {melhor:.3f} s  (pedido {t:.3f}, diferenca {abs(melhor-t)*1000:.0f} ms)")
    else:
        print("  -> SEM VALE nesta janela: fala emendada. Nao cortar aqui no meio —")
        print("     incluir a palavra anterior inteira ou procurar outro ponto.")
