#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# NEW HAIR — PRANCHA DE QUADROS
#
# Faz a mesma folha de contato da referência aprovada (quadros-Stephanie.jpg):
# 16 quadros em 4 colunas, cada um com o segundo em que foi tirado.
#
# Serve pra CONFERIR COMPOSIÇÃO, que é pra isso que o manual (§10) diz que a
# prancha serve. Tempo e som se conferem nos MP4, não aqui.
#
# Uso:  bash scripts/prancha.sh out/NH_peca_final.mp4 out/prancha-peca.jpg
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

VIDEO="${1:?uso: prancha.sh <video.mp4> <saida.jpg>}"
SAIDA="${2:?uso: prancha.sh <video.mp4> <saida.jpg>}"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FONTE="$AQUI/public/fonts/Montserrat-Bold.ttf"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

N=16; COLS=4; W=260; H=462; TOPO=34

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")

for i in $(seq 0 $((N-1))); do
  T=$(python3 -c "print(round(($DUR-0.15)*$i/($N-1)+0.05,3))")
  ffmpeg -y -v error -ss "$T" -i "$VIDEO" -frames:v 1 \
    -vf "scale=${W}:${H},pad=${W}:$((H+TOPO)):0:${TOPO}:color=0x16222c,\
drawtext=fontfile='${FONTE}':text='$(printf '%.2f' "$T")s':x=8:y=8:fontsize=17:fontcolor=0xF7F3EA" \
    "$TMP/$(printf '%02d' "$i").jpg"
done

ffmpeg -y -v error -pattern_type glob -i "$TMP/*.jpg" \
  -filter_complex "tile=${COLS}x$((N/COLS)):padding=2:color=0x16222c" \
  -frames:v 1 -q:v 3 "$SAIDA"

echo "prancha: $SAIDA  (fita de ${DUR}s)"
