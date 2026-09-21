#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# MIXAGEM DA PEÇA SEM FALA (texto fixo na tela)
#
# Irmão do `mix-falado.sh`, e existe pelo mesmo motivo: filtergraph montado à
# mão numa janela do terminal não é reprodutível, e o §07 manda mixar os stems
# por fora do Remotion. A diferença é o que está faltando — A VOZ.
#
# POR QUE OS GANHOS DO PADRÃO NÃO SERVEM AQUI, E O QUE MUDA
#
# Os números do `padroes-audio.json` foram calibrados num mix onde a VOZ é o
# elemento mais alto e a música fica 3 dB abaixo dela. Sem voz, a música vira a
# cama e sobe pro topo do mix: medido na FS_tricoscopia v6, com os ganhos do
# padrão o filme ficava 8,2 dB ABAIXO da música, o zoom 9,9 dB abaixo e o click
# 25,3 dB abaixo — inaudível, que é o que o §09 proíbe ("SFX que não se ouve
# mas continua somando no mix é pior que SFX nenhum").
#
# Então este script lê os ganhos do padrão e aplica um fator SÓ para peça sem
# voz, declarado aqui em cima pra ninguém ter que adivinhar:
#
#     filme 1,00×  (0,36 — o pico já fica 14,6 dB acima da cama; a cama está
#                   quieta no ponto da virada)
#     zoom  1,58×  (0,38 → 0,60 — pico ~7 dB acima da cama)
#     click 3,33×  (0,30 → 1,00 — pico ~5 dB acima da cama)
#
# O NÚMERO DO PADRÃO CONTINUA CERTO PARA PEÇA FALADA. O que muda é o contexto.
#
# `--dur` é a duração EXATA do vídeo. O master sai com `apad` e `-t` nela,
# porque `amix` + limitador devolvem alguns microssegundos a menos e o
# `-shortest` do mux trunca o vídeo por isso — custou um frame na v6.
#
# Uso:
#   bash scripts/mix-texto-fixo.sh --musica M.mp3 --musica-em <s> \
#        --saida MASTER.wav --dur <s> --filme <s> [--zoom <s>] [--click <s>]
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."

MUSICA=""; MUSICA_EM=""; SAIDA=""; DUR=""; FILME=""; ZOOM=""; CLICK=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --musica) MUSICA=$2; shift 2;;
    --musica-em) MUSICA_EM=$2; shift 2;;
    --saida) SAIDA=$2; shift 2;;
    --dur) DUR=$2; shift 2;;
    --filme) FILME=$2; shift 2;;
    --zoom) ZOOM=$2; shift 2;;
    --click) CLICK=$2; shift 2;;
    *) echo "flag desconhecida: $1" >&2; exit 2;;
  esac
done
for v in MUSICA MUSICA_EM SAIDA DUR FILME; do
  [[ -n "${!v}" ]] || { echo "falta --${v,,}" >&2; exit 2; }
done

P=padroes-audio.json
ler() { python3 -c "import json,sys;print(json.load(open('$P'))['$1']['$2'])"; }
G_FILME=$(ler filme ganho)
G_ZOOM=$(ler zoom ganho)
G_CLICK=$(ler click ganho)
# fator de peça SEM VOZ — ver cabeçalho
G_FILME=$(python3 -c "print($G_FILME*1.00)")
G_ZOOM=$(python3 -c "print($G_ZOOM*1.5789)")
G_CLICK=$(python3 -c "print($G_CLICK*3.3333)")

SFX_FILME=../kit-new-hair/exemplo-aprovado/public/trocat-transicao.mp3
SFX_CLICK=../kit-new-hair/exemplo-aprovado/public/click.mp3
SFX_ZOOM=public/newhair/zoom.mp3

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# música: recorte a partir de (ataque − virada), com fade de entrada e de saída
ffmpeg -v error -ss "$MUSICA_EM" -i "$MUSICA" -t "$DUR" \
  -af "afade=t=in:st=0:d=0.8,afade=t=out:st=$(python3 -c "print($DUR-1.0)"):d=1.0,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo" \
  -y "$TMP/musica.wav"

# stems de SFX, cada um posicionado com adelay e cortado na fonte do padrão
sfx() { # arquivo ini dur ganho posicao saida
  ffmpeg -v error -ss "$2" -i "$1" -t "$3" \
    -af "volume=$4,adelay=$(python3 -c "print(int($5*1000))")|$(python3 -c "print(int($5*1000))"),apad,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo" \
    -t "$DUR" -y "$6"
}
ENTRADAS=("$TMP/musica.wav")
sfx "$SFX_FILME" 0.566666 0.233334 "$G_FILME" "$FILME" "$TMP/filme.wav"
ENTRADAS+=("$TMP/filme.wav")
if [[ -n "$ZOOM" ]]; then
  sfx "$SFX_ZOOM" 0.35 0.70 "$G_ZOOM" "$ZOOM" "$TMP/zoom.wav"; ENTRADAS+=("$TMP/zoom.wav")
fi
if [[ -n "$CLICK" ]]; then
  sfx "$SFX_CLICK" 0.133333 0.133333 "$G_CLICK" "$CLICK" "$TMP/click.wav"; ENTRADAS+=("$TMP/click.wav")
fi

ARGS=(); for f in "${ENTRADAS[@]}"; do ARGS+=(-i "$f"); done
N=${#ENTRADAS[@]}
# duas passadas de loudnorm, como o §05 manda; a primeira só mede
ffmpeg -v error "${ARGS[@]}" \
  -filter_complex "amix=inputs=$N:duration=longest:normalize=0,alimiter=limit=0.95" \
  -ar 48000 -y "$TMP/cru.wav"
MED=$(ffmpeg -hide_banner -nostats -v info -i "$TMP/cru.wav" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | \
  python3 -c "
import sys,json,re
t=sys.stdin.read(); i=t.rfind('{'); d=json.loads(t[i:])
print('%s:%s:%s:%s'%(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh']))")
IFS=: read -r MI MTP MLRA MTH <<<"$MED"
ffmpeg -v error -i "$TMP/cru.wav" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:linear=true,apad" \
  -t "$DUR" -ar 48000 -c:a pcm_s16le -y "$SAIDA"
echo "master: $SAIDA  ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAIDA") s)"
echo "ganhos aplicados — filme $G_FILME · zoom $G_ZOOM · click $G_CLICK"
