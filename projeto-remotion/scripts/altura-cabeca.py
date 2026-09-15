# -*- coding: utf-8 -*-
"""
NEW HAIR - MEDIDOR DE ALTURA DA CABECA

Roda ANTES de escolher o tituloTop de uma peca de camera (pessoa falando, sem
B-roll). Devolve, em pixel do quadro 1080x1920, onde comeca o cabelo durante a
janela do gancho.

POR QUE ISTO EXISTE
  Ordem da dona (15/09/2026): "o gancho nao pode ficar bem em cima da minha
  cara" e "coloque o gancho bem acima da cabeca, nao coloque muito no topo".
  Ou seja: o titulo nao mora no meio do quadro (isso era das pecas de B-roll
  cirurgico) nem colado no topo. Ele fica pendurado logo acima do cabelo — e
  "logo acima do cabelo" e um numero que muda de fita pra fita.

COMO O NUMERO VIRA tituloTop
  tituloTop = cabeca + 20 - altura_do_bloco
  altura do bloco de titulo: ~285px com 4 linhas de gancho, ~333px com 5
  (a conta ja inclui o fio dourado e o "Leia a legenda").
  O +20 e de proposito: o pe do bloco encosta 20px no alto do cabelo, entao o
  gancho fica APOIADO na cabeca em vez de flutuar. Quem encosta e so a linha
  "Leia a legenda", a mais leve do bloco — o texto do gancho passa longe.
  Depois de colar o numero, CONFIRA num still: e a unica prova.

POR QUE O MENOR VALOR E NAO A MEDIA
  a pessoa mexe a cabeca enquanto fala. O titulo tem que passar longe do ponto
  mais alto que ela chega em TODA a janela do gancho, senao encosta no cabelo
  em um frame no meio da fala.

Uso:
    python scripts/altura-cabeca.py <video.mp4> <segundos_do_gancho> [...]

Requisito: ffmpeg no PATH.
"""
import subprocess
import sys

LARG, ALT = 216, 384          # 1/5 do quadro: 5px de resolucao, barato de ler
ESCURO = 95                   # o cabelo e muito escuro; a parede passa de 200
COL_A, COL_B = 36, 180        # so o miolo do quadro (ignora borda e moveis)


def mede(video, ate, passo=0.25):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", video, "-t", str(ate),
         "-vf", "fps=%g,scale=%d:%d" % (1.0 / passo, LARG, ALT),
         "-pix_fmt", "gray", "-f", "rawvideo", "-"],
        capture_output=True).stdout
    if not raw:
        sys.exit("ffmpeg nao devolveu frame nenhum de %s" % video)
    n = LARG * ALT
    topo = ALT
    for k in range(len(raw) // n):
        f = raw[k * n:(k + 1) * n]
        for y in range(ALT):
            if min(f[y * LARG + COL_A: y * LARG + COL_B]) < ESCURO:
                topo = min(topo, y)
                break
    return topo * (1920 // ALT)


def main():
    if len(sys.argv) < 3 or len(sys.argv) % 2 == 0:
        sys.exit("uso: altura-cabeca.py <video.mp4> <segundos_do_gancho> [...]")
    for video, ate in zip(sys.argv[1::2], sys.argv[2::2]):
        cabeca = mede(video, float(ate))
        print("%-34s cabeca comeca em y=%d px" % (video.split("/")[-1], cabeca))
        for linhas, bloco in ((4, 285), (5, 333)):
            print("      gancho de %d linhas -> tituloTop: %d" % (linhas, cabeca + 20 - bloco))


if __name__ == "__main__":
    main()
