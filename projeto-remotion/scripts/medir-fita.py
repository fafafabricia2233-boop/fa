# -*- coding: utf-8 -*-
"""
NEW HAIR - MEDIDOR DE FITA (padrao §10.1)

Roda ANTES de legendar qualquer video. Devolve os 4 numeros que o template pede
e que NUNCA se herda da peca anterior:

  1. codec da fonte      -> se for HEVC, o Remotion nao le e precisa converter
  2. END CARD            -> segundo em que a logo final entra (tudo do overlay sai antes)
  3. SPLIT SCREEN        -> se o quadro tem dois planos (B-roll em cima, rosto embaixo)
  4. CORTES              -> viradas de plano, que sao lugar de graca pro titulo sair

Uso:
    python medir-fita.py "caminho/do/video.mp4"

Requisito: ffmpeg e ffprobe no PATH.

POR QUE ASSIM E NAO COM showinfo/metadata=print:
  - o `file=` do lavfi quebra em caminho com `C:` no Windows
  - `-v error` silencia o showinfo e o detector devolve ZERO em qualquer video,
    ou seja, um detector que NUNCA acusa (silencio parece aprovacao)
  Aqui os frames vem pelo stdout em raw cinza, entao nao ha nada pra silenciar.
"""

import json
import subprocess
import sys

W, H, FPS = 64, 36, 20
N = W * H


def probe(path):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,r_frame_rate",
        "-of", "json", path,
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        sys.exit("ffprobe falhou: %s" % p.stderr.strip())
    return json.loads(p.stdout)


def ler_frames(path):
    cmd = [
        "ffmpeg", "-v", "error", "-i", path,
        "-vf", "fps=%d,scale=%d:%d" % (FPS, W, H),
        "-pix_fmt", "gray", "-f", "rawvideo", "-",
    ]
    p = subprocess.run(cmd, capture_output=True)
    if not p.stdout:
        sys.exit("ffmpeg nao devolveu frame nenhum: %s" % p.stderr.decode("utf-8", "ignore")[:400])
    d = p.stdout
    return [d[i * N:(i + 1) * N] for i in range(len(d) // N)]


def media(b):
    return sum(b) / float(len(b))


def mediana(v):
    s = sorted(v)
    return s[len(s) // 2]


def pearson(a, b):
    n = len(a)
    ma, mb = sum(a) / n, sum(b) / n
    num = sum((a[i] - ma) * (b[i] - mb) for i in range(n))
    da = sum((x - ma) ** 2 for x in a) ** 0.5
    db = sum((x - mb) ** 2 for x in b) ** 0.5
    return num / (da * db) if da and db else 0.0


def main():
    if len(sys.argv) < 2:
        sys.exit("uso: python medir-fita.py <video.mp4>")
    path = sys.argv[1]

    info = probe(path)
    dur = float(info["format"]["duration"])
    vs = [s for s in info["streams"] if s.get("codec_type") == "video"][0]
    codec = vs["codec_name"]
    tem_audio = any(s.get("codec_type") == "audio" for s in info["streams"])

    print("=" * 66)
    print("FONTE: %s" % path)
    print("  codec %s · %sx%s · %s fps · %.3fs · audio: %s"
          % (codec, vs["width"], vs["height"], vs.get("r_frame_rate", "?"), dur,
             "sim" if tem_audio else "NAO"))
    if codec.lower() in ("hevc", "h265"):
        print("  🔴 HEVC: o Remotion NAO le. Converta antes de tudo:")
        print('     ffmpeg -y -i "%s" -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k saida_h264.mp4' % path)
    print("=" * 66)

    fr = ler_frames(path)
    t = [i / float(FPS) for i in range(len(fr))]
    brilho = [media(f) for f in fr]
    med = mediana(brilho)
    print("frames amostrados: %d a %d fps · brilho mediano %.1f" % (len(fr), FPS, med))

    # ---------- 1. END CARD ----------
    # o menor instante a partir do qual o brilho NUNCA MAIS volta a subir.
    piso = med * 0.40
    volta = med * 0.60
    end_card = None
    for i in range(len(brilho)):
        if brilho[i] < piso and max(brilho[i:]) < volta:
            end_card = t[i]
            break
    print("\n[1] END CARD")
    if end_card is None:
        print("    NAO TEM. O brilho nunca cai de vez (min %.1f, max %.1f)."
              % (min(brilho), max(brilho)))
        print("    -> endCard: null      (overlay vai ate o fim da fita)")
    else:
        i = int(end_card * FPS)
        antes = brilho[max(0, i - 1)]
        print("    ACHADO em %.2fs: brilho cai de %.1f pra %.1f e nunca mais sobe."
              % (end_card, antes, brilho[i]))
        print("    -> endCard: %.2f      (o template tira tudo em %.2f)" % (end_card, end_card - 0.05))

    # ---------- 2. SPLIT SCREEN ----------
    meia = (H // 2) * W
    topo = [media(f[:meia]) for f in fr]
    base = [media(f[meia:]) for f in fr]
    dif = sum(abs(topo[i] - base[i]) for i in range(len(fr))) / len(fr)
    cor = pearson(topo, base)
    split = dif > 15 and cor < 0.5
    print("\n[2] SPLIT SCREEN")
    print("    diferenca media topo x base: %.1f ponto(s) · correlacao %.2f" % (dif, cor))
    if split:
        print("    PROVAVEL SPLIT: os dois metades diferem muito e variam SEPARADAS.")
        print("    -> splitScreen: true   (scrim de cima mais pesado, titulo dentro da faixa de B-roll)")
    else:
        print("    Nao e split: as duas metades variam JUNTAS conforme o plano.")
        print("    -> splitScreen: false")

    # ---------- 3. CORTES ----------
    print("\n[3] CORTES / VIRADAS DE PLANO")
    saltos = []
    for i in range(1, len(fr)):
        a, b = fr[i - 1], fr[i]
        d = sum(abs(a[j] - b[j]) for j in range(0, N, 3)) / (N / 3.0)
        if d > 25:
            saltos.append((t[i], d, brilho[i - 1], brilho[i]))
    if not saltos:
        print("    nenhuma virada forte (limiar 25). Plano continuo.")
    else:
        for (ts, d, b0, b1) in saltos[:12]:
            print("    %6.2fs  variacao %.0f  (brilho %.0f -> %.0f)" % (ts, d, b0, b1))
        if len(saltos) > 12:
            print("    ... e mais %d" % (len(saltos) - 12))
        print("    -> se um corte cair perto do fim do gancho, faca o titulo sair EM CIMA dele:")
        print("       a virada de plano entrega a tela limpa de graca.")

    print("\n" + "=" * 66)
    print("COLE NO CONFIG DO TEMPLATE:")
    print("  endCard: %s," % ("null" if end_card is None else "%.2f" % end_card))
    print("  splitScreen: %s," % ("true" if split else "false"))
    print("=" * 66)


if __name__ == "__main__":
    main()
