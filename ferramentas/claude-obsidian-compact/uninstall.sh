#!/usr/bin/env bash
# Remove o hook PreCompact -> Obsidian, preservando tudo o mais.
# As notas já salvas no Vault e os transcripts arquivados NÃO são apagados.

set -euo pipefail

CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
HOOKS_DIR="$CLAUDE_DIR/hooks"
STAMP="$(date +%Y%m%d-%H%M%S)"
PY="$(command -v python3 || true)"
[[ -n "$PY" ]] || { echo "ERRO: python3 não encontrado." >&2; exit 1; }

for SETTINGS in "$CLAUDE_DIR/settings.json" "$PWD/.claude/settings.json"; do
  [[ -f "$SETTINGS" ]] || continue
  cp -p "$SETTINGS" "$SETTINGS.backup-$STAMP"
  SETTINGS="$SETTINGS" "$PY" - <<'PYEOF'
import json, os
path = os.environ["SETTINGS"]
with open(path, encoding="utf-8") as fh:
    data = json.load(fh)

hooks = data.get("hooks", {})
pre = hooks.get("PreCompact", [])
kept, removed = [], 0
for group in pre if isinstance(pre, list) else []:
    if not isinstance(group, dict):
        kept.append(group); continue
    inner = [h for h in group.get("hooks", [])
             if not (isinstance(h, dict) and "obsidian_compact.py" in str(h.get("command", "")))]
    removed += len(group.get("hooks", [])) - len(inner)
    if inner:
        group["hooks"] = inner
        kept.append(group)

if removed:
    if kept:
        hooks["PreCompact"] = kept
    else:
        hooks.pop("PreCompact", None)
    if not hooks:
        data.pop("hooks", None)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print("  ✓ hook removido de {} (backup salvo)".format(path))
else:
    print("  · nenhum hook nosso em {}".format(path))
PYEOF
done

for f in "$HOOKS_DIR/obsidian_compact.py" "$HOOKS_DIR/obsidian-compact.config.json"; do
  [[ -f "$f" ]] && mv "$f" "$f.removido-$STAMP" && echo "  ✓ $f -> $f.removido-$STAMP"
done
rm -rf "$HOOKS_DIR/.jobs"

echo ""
echo "Desinstalado. Preservados (apague à mão se quiser):"
echo "  - notas no Vault"
echo "  - $HOOKS_DIR/transcripts-archive/"
echo "  - $HOOKS_DIR/logs/obsidian-compact.log"
