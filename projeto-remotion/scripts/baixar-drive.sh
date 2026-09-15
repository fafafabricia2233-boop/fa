#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# BAIXAR FITA DO DRIVE EM PEDAÇOS
#
# Por que existe: o endpoint público de download do Drive tem cota por arquivo.
# Depois de muitas leituras, ele passa a responder uma página HTML
# ("Quota exceeded") no lugar do vídeo — mas continua servindo LEITURA POR
# FAIXA normalmente. Este script remonta o arquivo pedaço a pedaço.
#
# Aconteceu em 14/09 (uma fita) e de novo em 15/09 (três fitas de uma vez).
# Não adianta insistir no download inteiro nem esperar: é só pedir em faixas.
#
# Uso: bash scripts/baixar-drive.sh <ID> <saida> [tamanho_do_pedaco_MB]
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

ID="${1:?uso: baixar-drive.sh <ID> <saida> [MB]}"
SAIDA="${2:?uso: baixar-drive.sh <ID> <saida> [MB]}"
MB="${3:-32}"
U="https://drive.usercontent.google.com/download?id=$ID&export=download&confirm=t"
BLOCO=$((MB * 1024 * 1024))

# tamanho real: vem do cabeçalho de uma faixa minúscula (que a cota não barra)
TOTAL=$(curl -sS -r 0-0 -D - -o /dev/null "$U" | tr -d '\r' \
        | awk -F'/' '/[Cc]ontent-[Rr]ange/ {print $2}')
if [ -z "$TOTAL" ]; then
  echo "ERRO: o servidor nao informou o tamanho. Confira se o link e publico." >&2
  exit 1
fi
echo "arquivo: $TOTAL bytes ($((TOTAL/1024/1024)) MB), pedacos de $MB MB"

: > "$SAIDA"
ini=0; n=0
while [ "$ini" -lt "$TOTAL" ]; do
  fim=$((ini + BLOCO - 1)); [ "$fim" -ge "$TOTAL" ] && fim=$((TOTAL - 1))
  ok=0
  for t in 1 2 3 4 5; do
    if curl -sS -r "$ini-$fim" "$U" >> "$SAIDA"; then ok=1; break; fi
    echo "  pedaco $n falhou (tentativa $t), aguardando $((2**t))s" >&2
    sleep $((2**t))
  done
  [ "$ok" -eq 1 ] || { echo "ERRO: pedaco $n nao veio" >&2; exit 1; }
  n=$((n+1)); ini=$((fim + 1))
  printf "\r  %d MB de %d MB" $((ini/1024/1024)) $((TOTAL/1024/1024))
done
echo

# a remontagem só vale se o container reconhecer o arquivo
if ! ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAIDA" >/dev/null 2>&1; then
  echo "ERRO: o arquivo remontado nao abre — pedaco faltando ou HTML no meio." >&2
  exit 1
fi
echo "ok: $SAIDA ($(du -m "$SAIDA" | cut -f1) MB, $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAIDA") s)"
