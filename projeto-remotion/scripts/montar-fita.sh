#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# NEW HAIR — MONTAR A FITA a partir da gravação crua do celular.
#
# POR QUE ISTO EXISTE
#   Até aqui a fita chegava no Remotion já cortada (CapCut) e o template só
#   queimava overlay por cima. Quando o que chega é o take cru — a pessoa lê,
#   para, erra, repete, e no fim fala "não, tá errado" — falta esse passo.
#   Este script é o passo: recebe SÓ os trechos aprovados, escolhidos à mão
#   olhando a transcrição, e cola um no outro na ordem dada.
#
# O QUE ELE FAZ
#   1. corta nos pontos pedidos e cola (corte seco, do jeito do padrão)
#   2. gira/reescala pro 1080x1920 30fps que o Remotion espera
#      (o iPhone grava 3840x2160 60fps HEVC com rotação 90 no metadado; o
#       ffmpeg roda sozinho, então 2160x3840 ÷ 2 = 1080x1920, sem crop)
#   3. empareja o volume da voz (loudnorm) — o take cru sai a ~-31 LUFS e as
#      peças aprovadas estão em ~-15
#
# O QUE ELE NÃO FAZ
#   não mexe em palavra, não acelera, não põe música, não põe legenda.
#   Legenda, gancho e selo são do template Remotion, depois.
#
# COMO SE ESCOLHE OS TRECHOS (ordem importa, é aqui que a peça nasce)
#   a) transcreva o take com timestamp por palavra;
#   b) desconfie de todo buraco: o whisper costuma esticar UMA palavra por
#      cima de 2s de fala que ele não transcreveu — e é justamente aí que
#      mora a repetição. Meça a energia do áudio no buraco e passe o modelo
#      grande só naquele pedaço antes de decidir;
#   c) fique com a ÚLTIMA leitura inteira de cada frase;
#   d) corte em silêncio de verdade (abaixo de ~-48 dB), nunca no meio da
#      sílaba;
#   e) depois de montar, transcreva a PEÇA e leia: se o texto corrido não
#      fecha, o corte está errado.
#
# Uso:
#   bash scripts/montar-fita.sh <fonte.MOV> <saida.mp4> "ini,fim" "ini,fim" ...
#
# As quatro peças de 15/09/2026 (gravação de celular, 4 takes) saíram assim:
#   atencaosaque  IMG_9789.MOV  0.54,6.36 14.74,18.70 26.14,28.38 30.30,33.70 \
#                               48.28,53.38 55.98,60.14 63.12,68.84 77.18,83.28
#   aprendejunto  IMG_9788.MOV  26.14,33.08 38.24,41.58 43.06,46.64 55.50,60.02 \
#                               64.92,69.90 80.58,86.38 93.10,95.61
#   tresnumeros   IMG_9787.MOV  0.10,5.74 10.54,17.86 40.66,47.72 81.04,87.52 \
#                               95.10,99.22 111.54,118.20
#   acolhimento   IMG_9786.MOV  0.20,5.64 31.30,36.45 40.16,44.44 53.54,56.98 \
#                               58.92,65.58 84.38,91.84 96.80,101.94 117.78,124.40
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

FONTE="${1:?uso: montar-fita.sh <fonte> <saida> ini,fim ...}"; shift
SAIDA="${1:?uso: montar-fita.sh <fonte> <saida> ini,fim ...}"; shift
[ $# -ge 1 ] || { echo "sem trechos"; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

i=0
: > "$TMP/lista.txt"
for par in "$@"; do
  INI="${par%%,*}"; FIM="${par##*,}"
  DUR=$(python3 -c "print(round($FIM - $INI, 3))")
  # fade de 30 ms nas pontas do áudio: sem isso o ponto de cola estala
  ffmpeg -y -v error -ss "$INI" -to "$FIM" -i "$FONTE" \
    -vf "scale=1080:1920:flags=lanczos,fps=30,setsar=1,format=yuv420p" \
    -af "afade=t=in:st=0:d=0.03,afade=t=out:st=$(python3 -c "print(round($DUR-0.03,3))"):d=0.03,aresample=48000" \
    -c:v libx264 -crf 22 -preset slow -c:a aac -b:a 192k -ac 2 \
    "$TMP/p$i.mp4"
  echo "file '$TMP/p$i.mp4'" >> "$TMP/lista.txt"
  printf "  trecho %d  %8.2f -> %8.2f  (%5.2fs)\n" "$i" "$INI" "$FIM" "$DUR"
  i=$((i+1))
done

ffmpeg -y -v error -f concat -safe 0 -i "$TMP/lista.txt" -c copy "$TMP/colado.mp4"

# voz emparelhada com as peças já aprovadas (~-16 LUFS), vídeo intocado
ffmpeg -y -v error -i "$TMP/colado.mp4" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart "$SAIDA"

echo "pronto: $SAIDA  ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAIDA")s)"
