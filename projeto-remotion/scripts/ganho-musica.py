#!/usr/bin/env python3
"""Calcula o ganho da música pra ela ficar N dB ABAIXO da voz daquela peça.

Por que não é número fixo: o §05 registra ganho 0,1, mas esse número nunca foi
conferido contra arquivo (a entrada de música em padroes-audio.json estava
marcada AUSENTE — só a lista de ataques por hash tinha chegado). Medido em
14/09/2026 nas duas peças faladas, 0,1 põe a música a 1,0 e 2,6 dB da voz, ou
seja, no mesmo tamanho dela: não é fundo, é duelo.

O que é constante não é o ganho e sim a FOLGA. O nível da voz muda de peça pra
peça (ela é equilibrada corte a corte antes de concatenar, e a normalização só
acontece no fim, no mix inteiro), então o ganho tem que ser calculado por peça.

Mede só onde há sinal — pausa entre frases não pode puxar a média da voz pra
baixo e fazer a música subir junto.

Uso: ganho-musica.py <voz.wav> <musica> <inicio_s> <dur_s> [--abaixo 15]
"""
import array, math, subprocess, sys

def rms_com_sinal(args, ganho=1.0):
    raw = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error"] + args + ["-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
        capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw)
    w = 1600  # 100 ms
    blocos = [math.sqrt(sum(v * v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x) // w)]
    vivos = [b for b in blocos if b > 60]        # descarta silêncio
    if not vivos:
        sys.exit("ERRO: stem sem sinal audível")
    return 20 * math.log10(math.sqrt(sum(b*b for b in vivos) / len(vivos)) * ganho / 32768)

voz, musica, inicio, dur = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
abaixo = float(sys.argv[sys.argv.index("--abaixo") + 1]) if "--abaixo" in sys.argv else 15.0

nv = rms_com_sinal(["-i", voz])
nm = rms_com_sinal(["-ss", inicio, "-t", dur, "-i", musica])
ganho = 10 ** ((nv - abaixo - nm) / 20)
print(f"{ganho:.4f}")
print(f"voz {nv:.1f} dBFS | musica crua {nm:.1f} dBFS | alvo {nv-abaixo:.1f} dBFS "
      f"({abaixo:.0f} dB abaixo da voz)", file=sys.stderr)
