#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# MIXAGEM DE PEÇA FALADA — genérico
#
# O motor renderiza imagem MUDA; o áudio é montado aqui e entra no mux. É essa
# ordem que faz o offset dar zero (§07 do manual).
#
# Os GANHOS não moram aqui: saem de padroes-audio.json, que vale pras duas
# marcas. Aqui ficam só as POSIÇÕES, que mudam por peça.
#
# Uso:
#   bash scripts/mix-falado.sh --voz VOZ.wav --sting STING.wav --saida OUT.wav \
#        --dur 23.333 --filme 3.800 --sting-em 16.967 \
#        [--tensao-fim 6.347] [--click 6.467] \
#        [--musica FAIXA.mp3 --musica-de 21.627]
#
#   --filme      segundo em que o filme entra (virada do gancho menos 7 frames)
#   --tensao-fim segundo da ÚLTIMA PALAVRA DO PROBLEMA. O grave é posicionado
#                em (fim − 2,05) pra terminar ali. Omitir quando a peça não tem
#                problema narrativo — o manual proíbe forçar tensão.
#   --click      entrada da solução. Omitir se a virada já é marcada pelo filme.
#   --musica     faixa de fundo. O ganho sai do JSON; o ATAQUE não se chuta: vem
#                de kit-new-hair/musicas-ataques-por-hash.json, casado por
#                SHA-256. scripts/conferir-musica.py barra faixa fora da lista.
#   --musica-de  segundo do arquivo onde o recorte COMEÇA. Conta do §05:
#                (ataque − virada do gancho), pro ataque cair na virada.
#
# O ganho da música é o único que NÃO sai pronto do JSON: o JSON guarda a folga
# (quantos dB abaixo da voz), e o ganho se calcula por peça, porque o nível do
# stem de voz muda de peça pra peça. Ver scripts/ganho-musica.py.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

VOZ=""; STING=""; SAIDA=""; DUR=""; FILME=""; STING_EM=""; TENSAO_FIM=""; CLICK=""
MUSICA=""; MUSICA_DE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --voz) VOZ="$2"; shift 2;; --sting) STING="$2"; shift 2;;
    --saida) SAIDA="$2"; shift 2;; --dur) DUR="$2"; shift 2;;
    --filme) FILME="$2"; shift 2;; --sting-em) STING_EM="$2"; shift 2;;
    --tensao-fim) TENSAO_FIM="$2"; shift 2;; --click) CLICK="$2"; shift 2;;
    --musica) MUSICA="$2"; shift 2;; --musica-de) MUSICA_DE="$2"; shift 2;;
    *) echo "opcao desconhecida: $1"; exit 1;;
  esac
done
: "${VOZ:?--voz}" "${STING:?--sting}" "${SAIDA:?--saida}" "${DUR:?--dur}" "${FILME:?--filme}" "${STING_EM:?--sting-em}"

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K="$AQUI/../kit-new-hair/exemplo-aprovado/public"
CRU="$(mktemp -d)/cru.wav"
ms() { python3 -c "print(int(round(float('$1')*1000)))"; }
leia() { python3 -c "import json;print(json.load(open('$AQUI/padroes-audio.json'))['$1']['ganho'])"; }

G_DIG=$(leia digitando); G_FLM=$(leia filme); G_TEN=$(leia tencao)
G_CLK=$(leia click);     G_STG=$(leia sting_marca)
FADE=$(python3 -c "print(round(float('$DUR')-1.0,3))")

ENT=( -i "$VOZ" -i "$AQUI/public/newhair/digitando.mp3" -i "$K/trocat-transicao.mp3" -i "$STING" )
FC="[0:a]aformat=fltp:48000:mono,apad=whole_dur=$DUR[voz];"
FC+="[1:a]aformat=fltp:48000:mono,atrim=0:1.25,asetpts=PTS-STARTPTS,volume=$G_DIG,adelay=150|150[dig];"
FC+="[2:a]aformat=fltp:48000:mono,atrim=0.566666:0.800,asetpts=PTS-STARTPTS,volume=$G_FLM,adelay=$(ms "$FILME")|$(ms "$FILME")[flm];"
FC+="[3:a]aformat=fltp:48000:mono,volume=$G_STG,adelay=$(ms "$STING_EM")|$(ms "$STING_EM")[stg];"
MIX="[voz][dig][flm][stg]"; N=4

if [ -n "$TENSAO_FIM" ]; then
  T=$(python3 -c "print(round(float('$TENSAO_FIM')-2.05,3))")
  ENT+=( -i "$K/tencao.mp3" )
  FC+="[${N}:a]aformat=fltp:48000:mono,atrim=0:2.05,asetpts=PTS-STARTPTS,volume=$G_TEN,afade=t=out:st=2.04:d=0.01,adelay=$(ms "$T")|$(ms "$T")[ten];"
  MIX+="[ten]"; N=$((N+1))
fi
if [ -n "$CLICK" ]; then
  ENT+=( -i "$K/click.mp3" )
  FC+="[${N}:a]aformat=fltp:48000:mono,atrim=0.133333:0.266666,asetpts=PTS-STARTPTS,volume=$G_CLK,adelay=$(ms "$CLICK")|$(ms "$CLICK")[clk];"
  MIX+="[clk]"; N=$((N+1))
fi
if [ -n "$MUSICA" ]; then
  : "${MUSICA_DE:?--musica exige --musica-de (ataque menos a virada do gancho)}"
  # ataque medido vale pro ARQUIVO, nao pra faixa: confere o SHA-256 ou para aqui
  python3 "$AQUI/scripts/conferir-musica.py" "$MUSICA" || exit 1
  # o ganho da musica NAO e fixo: e a folga pra voz que e fixa (ver o JSON)
  ABAIXO=$(python3 -c "import json;print(json.load(open('$AQUI/padroes-audio.json'))['musica']['abaixo_da_voz_dB'])")
  G_MUS=$(python3 "$AQUI/scripts/ganho-musica.py" "$VOZ" "$MUSICA" "$MUSICA_DE" "$DUR" --abaixo "$ABAIXO" | head -1)
  echo "ganho da musica nesta peca: $G_MUS"
  ENT+=( -ss "$MUSICA_DE" -t "$DUR" -i "$MUSICA" )
  # fade de entrada curtinho so pra nao estalar; a saida vem do fade geral do mix
  FC+="[${N}:a]aformat=fltp:48000:mono,asetpts=PTS-STARTPTS,volume=$G_MUS,afade=t=in:st=0:d=0.25[mus];"
  MIX+="[mus]"; N=$((N+1))
fi
FC+="${MIX}amix=inputs=${N}:duration=longest:normalize=0,alimiter=limit=0.95,afade=t=out:st=$FADE:d=1.0[out]"

ffmpeg -nostdin -y -v error "${ENT[@]}" -filter_complex "$FC" -map "[out]" -ac 1 -ar 48000 "$CRU" </dev/null

# normalizacao em DUAS passadas: a de uma passada errou 1,6 LU na primeira peca
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
