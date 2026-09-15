#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# NEW HAIR — FECHAR PEÇA DE CÂMERA (marca d'água + trilha até o fim)
#
# ORDEM PERMANENTE DA DONA (25/08/2026):
#   "Adicione essa marca de água no final, quero em todos os vídeos que eu te
#    pedir pra fazer a partir desse, a música deve acompanhar até o final do
#    vídeo."
#
# POR QUE ESTE E NÃO O fechar-peca.sh
#   O fechar-peca.sh continua a trilha pegando os PRIMEIROS segundos da própria
#   peça e emendando com crossfade. Isso funciona quando a peça vem do CapCut
#   com música por baixo desde o primeiro quadro: o que volta embaixo da marca
#   é música. Nas peças de câmera não é — os primeiros segundos são a VOZ dela
#   dizendo o gancho, e o fechar-peca.sh repetiria a fala embaixo da logo.
#
#   Aqui a trilha não é "reaproveitada": é a MESMA lofi do Remotion, tocada a
#   partir do segundo em que a peça acabou. Ou seja, a faixa não reinicia nem
#   repete — ela simplesmente continua, que é o que a ordem pede.
#
# O que faz:
#   1. emenda a marca d'água ao fim da peça (normalizada pra 30 fps)
#   2. continua a lofi por baixo da marca, do ponto exato onde a peça parou
#   3. mistura o sting da própria marca por cima
#   4. fade de 1s no fim
#
# Uso:
#   bash scripts/fechar-peca-camera.sh out/NewHairX.mp4 out/NewHairX_marca.mp4
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

PECA="${1:?uso: fechar-peca-camera.sh <peca.mp4> <saida.mp4>}"
SAIDA="${2:?uso: fechar-peca-camera.sh <peca.mp4> <saida.mp4>}"

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MARCA_SRC="$AQUI/public/newhair/marca_dagua.mov"
MARCA_30="$AQUI/public/newhair/marca_dagua_30fps.mp4"
# a MESMA trilha e o MESMO volume da composição Remotion. Se mudar lá, muda aqui.
TRILHA="$AQUI/public/new sfx/lofi 2.MP3"
VOL_TRILHA=0.08

[ -f "$MARCA_SRC" ] || { echo "marca d'agua nao encontrada em $MARCA_SRC"; exit 1; }
[ -f "$TRILHA" ]    || { echo "trilha nao encontrada em $TRILHA"; exit 1; }

if [ ! -f "$MARCA_30" ]; then
  echo "normalizando a marca d'agua para 30 fps..."
  ffmpeg -y -v error -i "$MARCA_SRC" -r 30 -vsync cfr \
    -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 192k "$MARCA_30"
fi

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

D_PECA=$(dur "$PECA")
D_MARCA=$(dur "$MARCA_30")
TOTAL=$(python3 -c "print(round($D_PECA + $D_MARCA, 3))")
INICIO_FADE=$(python3 -c "print(round($TOTAL - 1.0, 3))")
ATRASO=$(python3 -c "print(int($D_PECA * 1000))")

echo "peca ${D_PECA}s + marca ${D_MARCA}s = ${TOTAL}s"

ffmpeg -y -v error \
  -i "$PECA" -i "$MARCA_30" -ss "$D_PECA" -t "$D_MARCA" -i "$TRILHA" \
  -filter_complex "
  [0:v]fps=30,setsar=1,format=yuv420p[v0];
  [1:v]fps=30,setsar=1,format=yuv420p[v1];
  [v0][v1]concat=n=2:v=1:a=0[vout];
  [0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[peca];
  [2:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${VOL_TRILHA},adelay=${ATRASO}|${ATRASO}[trilha];
  [1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,adelay=${ATRASO}|${ATRASO}[sting];
  [peca][trilha][sting]amix=inputs=3:duration=longest:normalize=0[mx];
  [mx]afade=t=out:st=${INICIO_FADE}:d=1.0[aout]" \
  -map "[vout]" -map "[aout]" -t "$TOTAL" \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart \
  "$SAIDA"

echo "pronto: $SAIDA"
