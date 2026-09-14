#!/usr/bin/env bash
# Busca por texto nas páginas do wiki.
#
#   ./ferramentas/buscar.sh anisotricose      linhas que casam, agrupadas por página
#   ./ferramentas/buscar.sh -l terracota      só os nomes das páginas
#
# Sem dependência nenhuma além de grep. Enquanto o wiki couber no index.md,
# isto basta.

set -uo pipefail

VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

so_nomes=0
if [ "${1:-}" = "-l" ]; then
  so_nomes=1
  shift
fi

if [ "$#" -eq 0 ]; then
  echo "uso: buscar.sh [-l] <termo>" >&2
  exit 2
fi

termo="$*"

if [ "$so_nomes" -eq 1 ]; then
  achou=0
  while IFS= read -r arquivo; do
    [ -n "$arquivo" ] || continue
    achou=1
    basename "$arquivo" .md
  done < <(grep -ril --include='*.md' -- "$termo" "$VAULT/wiki" | sort)
  if [ "$achou" -eq 0 ]; then
    echo "nada encontrado para: $termo" >&2
    exit 1
  fi
  exit 0
fi

resultado="$(grep -rin --include='*.md' -- "$termo" "$VAULT/wiki" | sort)"

if [ -z "$resultado" ]; then
  echo "nada encontrado para: $termo" >&2
  exit 1
fi

printf '%s\n' "$resultado" | {
  anterior=""
  paginas=0
  linhas=0
  while IFS= read -r entrada; do
    arquivo="${entrada%%:*}"
    resto="${entrada#*:}"
    numero="${resto%%:*}"
    texto="${resto#*:}"
    relativo="${arquivo#"$VAULT"/}"

    if [ "$relativo" != "$anterior" ]; then
      printf '\n%s\n' "$relativo"
      anterior="$relativo"
      paginas=$((paginas + 1))
    fi
    linhas=$((linhas + 1))
    printf '  %4s  %s\n' "$numero" "${texto#"${texto%%[![:space:]]*}"}"
  done
  printf '\n%d linha(s) em %d página(s).\n' "$linhas" "$paginas"
}
