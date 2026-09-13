#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# NH_agilidade — MIXAGEM DOS STEMS
#
# O motor renderiza imagem MUDA; o áudio é montado aqui e entra no mux. É essa
# ordem que faz o offset dar zero (§07 do manual).
#
# OS GANHOS NÃO MORAM AQUI. Saem de padroes-audio.json, que vale para toda peça
# nova das duas marcas. Mexer lá, não neste script.
#
# Stems (o ganho de cada um vem do JSON):
#   voz         equilibrada corte a corte antes de concatenar
#   digitando   começa na 1ª letra do título, fonte 0–1,25 s
#   filme       7 frames antes da virada do gancho (2,233 s nesta peça)
#   tensão      termina na ÚLTIMA PALAVRA DO PROBLEMA (6,347 s nesta peça),
#               então entra em 6,347 − 2,05 = 4,297 s
#   click       entrada da solução (6,467 s nesta peça)
#   sting       junto com a logo (frame 539 = 17,967 s nesta peça)
#
# Normalização em DUAS passadas (a de uma passada errou 1,6 LU na v1):
#   alvo I=-16 LUFS, TP=-1,5 dBTP, LRA=11.
#
# Uso: bash scripts/mix-agilidade.sh <pasta-dos-stems> <saida.wav>
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

ST="${1:?uso: mix-agilidade.sh <pasta-dos-stems> <saida.wav>}"
SAIDA="${2:?uso: mix-agilidade.sh <pasta-dos-stems> <saida.wav>}"
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K="$AQUI/../kit-new-hair/exemplo-aprovado/public"
CRU="$(mktemp -d)/cru.wav"

# ganhos padrão, um lugar só
leia() { python3 -c "import json,sys;print(json.load(open('$AQUI/padroes-audio.json'))['$1']['ganho'])"; }
G_DIG=$(leia digitando); G_FLM=$(leia filme); G_TEN=$(leia tencao)
G_CLK=$(leia click);     G_STG=$(leia sting_marca)
echo "ganhos: digitando=$G_DIG filme=$G_FLM tensao=$G_TEN click=$G_CLK sting=$G_STG"

ffmpeg -nostdin -y -v error \
 -i "$ST/voz_eq.wav" -i "$AQUI/public/newhair/digitando.mp3" -i "$K/trocat-transicao.mp3" \
 -i "$K/tencao.mp3" -i "$K/click.mp3" -i "$ST/sting.wav" \
 -filter_complex "\
 [0:a]aformat=fltp:48000:mono,apad=whole_dur=24.34[voz];\
 [1:a]aformat=fltp:48000:mono,atrim=0:1.25,asetpts=PTS-STARTPTS,volume=$G_DIG,adelay=150|150[dig];\
 [2:a]aformat=fltp:48000:mono,atrim=0.566666:0.800,asetpts=PTS-STARTPTS,volume=$G_FLM,adelay=2233|2233[flm];\
 [3:a]aformat=fltp:48000:mono,atrim=0:2.05,asetpts=PTS-STARTPTS,volume=$G_TEN,afade=t=out:st=2.04:d=0.01,adelay=4297|4297[ten];\
 [4:a]aformat=fltp:48000:mono,atrim=0.133333:0.266666,asetpts=PTS-STARTPTS,volume=$G_CLK,adelay=6467|6467[clk];\
 [5:a]aformat=fltp:48000:mono,volume=$G_STG,adelay=17967|17967[stg];\
 [voz][dig][flm][ten][clk][stg]amix=inputs=6:duration=longest:normalize=0,alimiter=limit=0.95,\
 afade=t=out:st=23.34:d=1.0[out]" -map "[out]" -ac 1 -ar 48000 "$CRU" </dev/null

M=$(ffmpeg -nostdin -hide_banner -i "$CRU" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - </dev/null 2>&1 | python3 -c "
import sys,json
t=sys.stdin.read(); j=json.loads(t[t.rindex('{'):t.rindex('}')+1])
print('%s %s %s %s %s'%(j['input_i'],j['input_tp'],j['input_lra'],j['input_thresh'],j['target_offset']))")
set -- $M
ffmpeg -nostdin -y -v error -i "$CRU" \
 -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true" \
 -ar 48000 -ac 1 "$SAIDA" </dev/null

echo "master: $SAIDA"
ffmpeg -nostdin -v info -i "$SAIDA" -filter_complex ebur128=peak=true -f null - </dev/null 2>&1 | grep -A2 -E "Integrated|True peak"
