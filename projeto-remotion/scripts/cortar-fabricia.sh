#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════
# CORTAR + REENQUADRAR + TRATAR um plano da Fabrícia, direto da fita 4K.
#
# Por que num passo só: a fita é 2160x3840 e a entrega é 1080x1920 — sobra
# exatamente 2x. Recortar ANTES de reduzir significa que um enquadramento
# fechado ainda chega em 1080 de largura com pixel de sobra, em vez de
# ampliar um arquivo já reduzido.
#
# Uso: cortar-fabricia.sh <fita> <ini> <dur> <cx> <cy> <cw> <ch> <extra> <saida>
# As coordenadas do recorte vêm no espaço 1080x1920 (o mesmo das pranchas de
# conferência); o script dobra pra chegar no espaço da fita.
# ══════════════════════════════════════════════════════════════════════════
set -euo pipefail
FITA=$1; INI=$2; DUR=$3; CX=$4; CY=$5; CW=$6; CH=$7; EXTRA=$8; OUT=$9

# ---- GRADE (medido contra a referência que a dona mandou em 16/09/2026) ----
# A curva protege a PELE de propósito. A referência tem p50=111 e p5=7; copiar
# isso escurece a pele dela, que é o "não deixe a pele pesada". Então: preto
# fechado só no preto de verdade (0,08→0,05), meio-tom da pele intocado
# (0,45→0,455) e o alto puxado (0,87→0,795). O clima vem da COR, não de
# apagar a pessoa.
CURVA="curves=m='0/0 0.08/0.05 0.25/0.245 0.45/0.455 0.70/0.665 0.87/0.795 1/0.95'"
# sombra quente, meio menos vermelho, alta fria — a divisão que a referência
# mostra (sombras R-B +11,8 / altas R-B -3,7) contra as fitas dela, que vinham
# com R-B de +25 a +42 no meio.
COR="colorbalance=rs=0.03:bs=-0.015:rm=-0.055:gm=-0.008:bm=0.035:rh=-0.035:bh=0.05,eq=saturation=0.98"
# PELE: smartblur com limiar NEGATIVO só alisa área lisa e preserva borda —
# some com mancha e mantém cílio, sobrancelha, fio e armação do óculos.
# lt=-30/ls=0.8 já deixa plástico; -22/0.5 é o ponto medido.
PELE="smartblur=lr=3:ls=0.5:lt=-22"

VF="crop=$((CW*2)):$((CH*2)):$((CX*2)):$((CY*2)),scale=1080:1920:flags=lanczos,fps=30,$CURVA,$COR${EXTRA:+,$EXTRA},$PELE,format=yuv420p"

ffmpeg -v error -ss "$INI" -i "$FITA" -t "$DUR" -vf "$VF" -an \
  -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -color_range tv \
  -movflags +faststart -y "$OUT"
n=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$OUT")
echo "$(basename "$OUT")  frames=$n"
