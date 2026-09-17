#!/usr/bin/env python3
"""
QUEBRAR LEGENDA — acha a quebra de linha mais EQUILIBRADA para um texto.

Por que existe: o que o olho lê como legenda "alinhadinha" não é a quebra em
unidade de sentido — é a variação de largura entre as linhas. Medida a
referência que a dona mandou em 17/09/2026, as linhas dela têm 618, 566, 567 e
596 px num quadro de 1080: variação de 9%. Pra chegar nisso ela quebra em cima
de palavra pequena de propósito ("...deodorant but", "...each other to").

A legenda da FS_couro_cachos v6 tinha 661, 420, 806 e 255 px — variação de 48%.
Cada linha era uma unidade de sentido perfeita e o bloco parecia bagunçado.

Os números da peça pronta NÃO transferem pra um texto novo: a quebra depende do
texto. O que transfere é esta conta. Rode-a a cada peça.

Uso:
  python3 scripts/quebrar-legenda.py "O texto da peça inteiro." [--corpo 54]
                                     [--caixa 840] [--linhas 3,4,5]
                                     [--fonte <arquivo>]

Sai com a melhor quebra de cada contagem de linhas, a variação de cada uma, e
avisa quando a linha mais larga estoura a caixa.
"""
import argparse, itertools, re, sys
from fontTools.ttLib import TTFont

PADRAO_FONTE = "public/marcas/fabricia/fontes/Fabricia-Light.woff2"


def medidor(caminho):
    f = TTFont(caminho)
    upm = f["head"].unitsPerEm
    hm = f["hmtx"]
    cmap = f.getBestCmap()
    espaco = cmap.get(32)

    def largura(texto, px):
        total = 0
        for ch in texto:
            g = cmap.get(ord(ch))
            if g is None:
                print(f"  AVISO: a fonte nao tem o caractere {ch!r}", file=sys.stderr)
                g = espaco
            total += hm[g][0]
        return total / upm * px

    return largura


def fim_de_frase(palavra):
    return bool(re.search(r"[.!?…]$", palavra))


def melhor_quebra(palavras, n, px, caixa, largura, respeitar_frase):
    """Menor variacao de largura entre as n linhas."""
    melhor = None
    for corte in itertools.combinations(range(1, len(palavras)), n - 1):
        idx = (0,) + corte + (len(palavras),)
        linhas = [" ".join(palavras[idx[i]:idx[i + 1]]) for i in range(n)]

        # uma frase nao pode COMECAR no meio de uma linha: se uma palavra
        # termina em ponto, ela tem que ser a ultima da linha.
        if respeitar_frase:
            ruim = False
            for li in linhas:
                ps = li.split()
                if any(fim_de_frase(p) for p in ps[:-1]):
                    ruim = True
                    break
            if ruim:
                continue

        ws = [largura(li, px) for li in linhas]
        if max(ws) > caixa:
            continue
        # vidva: ultima linha com uma palavra curta so
        ultima = linhas[-1].split()
        pena = 40 if len(ultima) == 1 and len(ultima[0]) <= 6 else 0
        nota = (max(ws) - min(ws)) + pena
        if melhor is None or nota < melhor[0]:
            melhor = (nota, linhas, ws)
    return melhor


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("texto")
    ap.add_argument("--corpo", type=float, default=54.0)
    ap.add_argument("--caixa", type=float, default=840.0,
                    help="largura util em px (1080 - margem esq - margem dir)")
    ap.add_argument("--linhas", default="3,4,5,6")
    ap.add_argument("--fonte", default=PADRAO_FONTE)
    ap.add_argument("--solta-frase", action="store_true",
                    help="permite uma frase comecar no meio da linha")
    a = ap.parse_args()

    largura = medidor(a.fonte)
    palavras = a.texto.split()
    print(f"fonte: {a.fonte}")
    print(f"corpo {a.corpo:g} px · caixa {a.caixa:g} px · {len(palavras)} palavras\n")

    for n in [int(x) for x in a.linhas.split(",")]:
        if n > len(palavras):
            continue
        r = melhor_quebra(palavras, n, a.corpo, a.caixa, largura, not a.solta_frase)
        if not r:
            print(f"{n} linhas: nao cabe na caixa a {a.corpo:g} px\n")
            continue
        _, linhas, ws = r
        var = (max(ws) - min(ws)) / max(ws) * 100
        marca = "  <<< mais equilibrada" if var <= 25 else ""
        print(f"{n} linhas · variacao {max(ws)-min(ws):.0f} px ({var:.0f}%) · "
              f"mais larga {max(ws):.0f} px{marca}")
        for li, w in zip(linhas, ws):
            print(f"      {w:6.1f}  {li}")
        print()

    print("Referencia medida (17/09/2026): variacao de 9%. Abaixo de ~25% ja le")
    print("como bloco; acima de ~40% le como bagunca.")


if __name__ == "__main__":
    main()
