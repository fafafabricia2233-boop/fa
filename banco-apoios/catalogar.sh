#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# BANCO DE APOIOS — CATALOGADOR
#
# Le banco-apoios/arquivos.tsv (categoria <TAB> nome <TAB> id do Drive) e, pra
# cada video, SONDA DIRETO DA URL: duracao, resolucao, fps, codec e audio.
# Nao baixa o arquivo inteiro — o ffprobe pega so o cabecalho por range.
#
# Depois tira 3 quadros (25%, 50%, 75%) de cada video e monta uma folha de
# contato por categoria, porque o manual (§11) exige LER FRAMES, nao confiar
# no nome da pasta.
#
# Requisito: a pasta do Drive precisa estar como "qualquer pessoa com o link".
#
# Uso:  bash banco-apoios/catalogar.sh
# ═══════════════════════════════════════════════════════════════════════════
set -uo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TSV="$AQUI/arquivos.tsv"
QUADROS="${1:-$AQUI/quadros}"
mkdir -p "$QUADROS"
SAIDA="$AQUI/CATALOGO.md"
FONTE="$AQUI/../projeto-remotion/public/fonts/Montserrat-Bold.ttf"

# Arquivo acima de 100 MB cai na tela de aviso de antivirus do Drive e o
# ffprobe recebe HTML. O host usercontent com confirm=t entrega o binario.
url() { echo "https://drive.usercontent.google.com/download?id=$1&export=download&confirm=t"; }

{
  echo "# Banco de apoios — catálogo técnico"
  echo
  echo "Sondado direto do Drive em $(date +%d/%m/%Y), sem baixar os arquivos."
  echo "Gerado por \`banco-apoios/catalogar.sh\`."
  echo
  echo "| Categoria | Arquivo | Duração | Resolução | fps | Vídeo | Áudio |"
  echo "|---|---|---|---|---|---|---|"
} > "$SAIDA"

while IFS=$'\t' read -r cat nome id; do
  [ -z "${id:-}" ] && continue
  J=$(timeout 180 ffprobe -v error -show_entries format=duration:stream=codec_name,codec_type,width,height,r_frame_rate -of json "$(url "$id")" 2>/dev/null </dev/null)
  if [ -z "$J" ]; then
    echo "| $cat | $nome | — | — | — | **falhou** | — |" >> "$SAIDA"
    echo "  !! $nome"
    continue
  fi
  read -r dur w h fps vcod acod <<<"$(python3 - "$J" <<'PY'
import json,sys
d=json.loads(sys.argv[1])
v=[s for s in d["streams"] if s.get("codec_type")=="video"]
a=[s for s in d["streams"] if s.get("codec_type")=="audio"]
v=v[0] if v else {}
r=v.get("r_frame_rate","0/1")
try:
    n,de=r.split("/"); fps=round(float(n)/float(de),2)
except Exception:
    fps="?"
print(round(float(d["format"].get("duration",0)),2), v.get("width","?"), v.get("height","?"),
      fps, v.get("codec_name","?"), (a[0].get("codec_name") if a else "sem"))
PY
)"
  echo "| $cat | $nome | ${dur}s | ${w}×${h} | $fps | $vcod | $acod |" >> "$SAIDA"
  echo "  ok $nome  ${dur}s ${w}x${h}"

  # tres quadros pra conferir o que o video MOSTRA
  i=0
  for frac in 0.25 0.50 0.75; do
    t=$(python3 -c "print(round($dur*$frac,2))")
    timeout 240 ffmpeg -nostdin -y -v error -ss "$t" -i "$(url "$id")" -frames:v 1 \
      -vf "scale=240:-2,pad=240:ih+30:0:30:color=0x16222c,drawtext=fontfile='$FONTE':text='${cat}/${nome%.*}':x=6:y=7:fontsize=13:fontcolor=0xF7F3EA" \
      "$QUADROS/${cat}__$(echo "$nome" | tr ' .' '__')__$i.jpg" 2>/dev/null </dev/null
    i=$((i+1))
  done
done < "$TSV"

echo "catalogo: $SAIDA"
