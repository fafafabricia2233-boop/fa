#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# NEW HAIR — FECHAR PEÇA (marca d'água + música até o fim)
#
# ORDEM PERMANENTE DA DONA (25/08/2026):
#   "Adicione essa marca de água no final, quero em todos os vídeos que eu te
#    pedir pra fazer a partir desse, a música deve acompanhar até o final do
#    vídeo."
#
# Roda DEPOIS do passo 7 do padrão (o conserto dos 40 ms). A entrada tem que
# ser o arquivo *_final.mp4, que já saiu corrigido.
#
# O que faz:
#   1. emenda a marca d'água ao fim da peça (normalizada pra 30 fps)
#   2. continua a MESMA trilha da fita por baixo da marca, com crossfade,
#      pra música não morrer antes do vídeo
#   3. mistura o sting da própria marca por cima
#   4. fade de 1s no fim
#
# Nenhuma música nova é introduzida: a continuação é a própria trilha da fita.
#
# Uso:
#   bash scripts/fechar-peca.sh out/NH_peca_final.mp4 out/NH_peca_marca.mp4
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

PECA="${1:?uso: fechar-peca.sh <peca_final.mp4> <saida.mp4>}"
SAIDA="${2:?uso: fechar-peca.sh <peca_final.mp4> <saida.mp4>}"

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MARCA_SRC="$AQUI/public/newhair/marca_dagua.mov"
MARCA_30="$AQUI/public/newhair/marca_dagua_30fps.mp4"

[ -f "$MARCA_SRC" ] || { echo "marca d'agua nao encontrada em $MARCA_SRC"; exit 1; }

# 1. normaliza a marca pra 30 fps (a fonte vem a 24) — só se ainda não existir
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
# quanto de música extra é preciso, mais 0.6s que o crossfade come
EXTRA=$(python3 -c "print(round($D_MARCA + 0.6, 3))")
INICIO_FADE=$(python3 -c "print(round($TOTAL - 1.0, 3))")
ATRASO_STING=$(python3 -c "print(int($D_PECA * 1000))")

echo "peca ${D_PECA}s + marca ${D_MARCA}s = ${TOTAL}s"

ffmpeg -y -v error \
  -i "$PECA" -i "$MARCA_30" -i "$PECA" \
  -filter_complex "
  [0:v]fps=30,setsar=1,format=yuv420p[v0];
  [1:v]fps=30,setsar=1,format=yuv420p[v1];
  [v0][v1]concat=n=2:v=1:a=0[vout];
  [0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[am];
  [2:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,atrim=0:${EXTRA},asetpts=PTS-STARTPTS,volume=0.75[bm];
  [am][bm]acrossfade=d=0.6:c1=tri:c2=tri[music];
  [1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,adelay=${ATRASO_STING}|${ATRASO_STING}[sting];
  [music][sting]amix=inputs=2:duration=longest:normalize=0[mx];
  [mx]afade=t=out:st=${INICIO_FADE}:d=1.0[aout]" \
  -map "[vout]" -map "[aout]" -t "$TOTAL" \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart \
  "$SAIDA"

echo "pronto: $SAIDA"
