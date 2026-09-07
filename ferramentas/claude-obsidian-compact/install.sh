#!/usr/bin/env bash
# Instalador do hook PreCompact -> Obsidian para o Claude Code.
#
# Uso:
#   bash install.sh                      # detecta o Vault e pergunta
#   bash install.sh --vault "/caminho"   # usa o Vault informado
#   bash install.sh --no-ai              # desliga o enriquecimento por IA
#   bash install.sh --project            # instala só neste projeto (.claude/settings.json)
#   bash install.sh --claude-md          # também adiciona o bloco de recuperação ao CLAUDE.md
#
# Não sobrescreve configurações existentes: faz backup e merge.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
HOOKS_DIR="$CLAUDE_DIR/hooks"
TARGET="$HOOKS_DIR/obsidian_compact.py"
CONFIG="$HOOKS_DIR/obsidian-compact.config.json"
STAMP="$(date +%Y%m%d-%H%M%S)"

VAULT=""
AI="true"
SCOPE="user"
CLAUDEMD="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --vault)   VAULT="${2:-}"; shift 2 ;;
    --no-ai)   AI="false"; shift ;;
    --project)   SCOPE="project"; shift ;;
    --claude-md) CLAUDEMD="true"; shift ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "Opção desconhecida: $1" >&2; exit 1 ;;
  esac
done

say()  { printf '%s\n' "$*"; }
ok()   { printf '  ✓ %s\n' "$*"; }
warn() { printf '  ! %s\n' "$*"; }
die()  { printf 'ERRO: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------- pré-checagens
say "== 1. Pré-checagens =="

PY="$(command -v python3 || true)"
[[ -n "$PY" ]] || die "python3 não encontrado. Instale o Python 3.8+ e rode de novo."
ok "python3: $PY ($("$PY" -c 'import sys;print(".".join(map(str,sys.version_info[:3])))'))"

CLAUDE_BIN="$(command -v claude || true)"
if [[ -n "$CLAUDE_BIN" ]]; then
  ok "claude: $CLAUDE_BIN ($(claude --version 2>/dev/null || echo 'versão desconhecida'))"
else
  warn "binário 'claude' não está no PATH. A instalação continua, mas o resumo por IA ficará desligado."
  AI="false"
fi

[[ -f "$SCRIPT_DIR/obsidian_compact.py" ]] || die "obsidian_compact.py não encontrado em $SCRIPT_DIR"

# ---------------------------------------------------------------- Vault
say ""
say "== 2. Vault do Obsidian =="

if [[ -z "$VAULT" ]]; then
  mapfile -t FOUND < <(
    for root in "$HOME" "$HOME/Documents" "$HOME/Documentos" \
                "$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents" \
                "$HOME/Library/CloudStorage" "$HOME/Dropbox" "$HOME/OneDrive" \
                "$HOME/Google Drive" "$HOME/Desktop" "$HOME/Sync"; do
      [[ -d "$root" ]] || continue
      find "$root" -maxdepth 3 -type d -name ".obsidian" 2>/dev/null
    done | sed 's#/\.obsidian$##' | sort -u
  )

  if [[ ${#FOUND[@]} -eq 0 ]]; then
    die "Nenhum Vault do Obsidian encontrado. Rode: bash install.sh --vault \"/caminho/do/Vault\""
  elif [[ ${#FOUND[@]} -eq 1 ]]; then
    VAULT="${FOUND[0]}"
    ok "Vault detectado: $VAULT"
  else
    say "Foram encontrados ${#FOUND[@]} Vaults:"
    for i in "${!FOUND[@]}"; do printf '  [%d] %s\n' "$((i+1))" "${FOUND[$i]}"; done
    read -r -p "Escolha o número do Vault a usar: " CHOICE
    [[ "$CHOICE" =~ ^[0-9]+$ ]] || die "Escolha inválida."
    VAULT="${FOUND[$((CHOICE-1))]:-}"
    [[ -n "$VAULT" ]] || die "Escolha fora do intervalo."
    ok "Vault escolhido: $VAULT"
  fi
fi

[[ -d "$VAULT" ]] || die "Vault não existe: $VAULT"
[[ -d "$VAULT/.obsidian" ]] || warn "$VAULT não tem pasta .obsidian — confirme que é mesmo um Vault."
[[ -w "$VAULT" ]] || die "Sem permissão de escrita em $VAULT"

# ---------------------------------------------------------------- instalação
say ""
say "== 3. Instalando o script =="

mkdir -p "$HOOKS_DIR" "$HOOKS_DIR/logs"

if [[ -f "$TARGET" ]]; then
  cp -p "$TARGET" "$TARGET.backup-$STAMP"
  ok "backup do script anterior: $TARGET.backup-$STAMP"
fi
cp "$SCRIPT_DIR/obsidian_compact.py" "$TARGET"
chmod +x "$TARGET"
ok "script instalado: $TARGET"

"$PY" -c "import ast,sys; ast.parse(open(sys.argv[1],encoding='utf-8').read())" "$TARGET"
ok "sintaxe Python validada"

if [[ -f "$CONFIG" ]]; then
  cp -p "$CONFIG" "$CONFIG.backup-$STAMP"
  ok "backup da config anterior: $CONFIG.backup-$STAMP"
fi

VAULT="$VAULT" AI="$AI" CONFIG="$CONFIG" "$PY" - <<'PYEOF'
import json, os
cfg = {}
path = os.environ["CONFIG"]
if os.path.exists(path):
    try:
        cfg = json.load(open(path, encoding="utf-8"))
    except Exception:
        cfg = {}
cfg.update({
    "vault": os.environ["VAULT"],
    "base_folder": cfg.get("base_folder", "Claude Code"),
    "ai_summary": os.environ["AI"] == "true",
    "ai_model": cfg.get("ai_model", ""),
    "ai_timeout_seconds": cfg.get("ai_timeout_seconds", 240),
    "archive_transcript": cfg.get("archive_transcript", True),
    "archive_max_mb": cfg.get("archive_max_mb", 200),
})
with open(path, "w", encoding="utf-8") as fh:
    json.dump(cfg, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
PYEOF
ok "config gravada: $CONFIG"

# ---------------------------------------------------------------- settings.json
say ""
say "== 4. Registrando o hook PreCompact =="

if [[ "$SCOPE" == "project" ]]; then
  SETTINGS="$PWD/.claude/settings.json"
  mkdir -p "$PWD/.claude"
else
  SETTINGS="$CLAUDE_DIR/settings.json"
fi

if [[ -f "$SETTINGS" ]]; then
  cp -p "$SETTINGS" "$SETTINGS.backup-$STAMP"
  ok "backup: $SETTINGS.backup-$STAMP"
  "$PY" -c "import json,sys; json.load(open(sys.argv[1],encoding='utf-8'))" "$SETTINGS" \
    || die "$SETTINGS tem JSON inválido. Corrija antes de instalar (o backup está salvo)."
else
  ok "$SETTINGS ainda não existe — será criado"
fi

CMD="$PY \"$TARGET\""
SETTINGS="$SETTINGS" CMD="$CMD" "$PY" - <<'PYEOF'
import json, os

path = os.environ["SETTINGS"]
cmd = os.environ["CMD"]

data = {}
if os.path.exists(path):
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)

hooks = data.setdefault("hooks", {})
pre = hooks.setdefault("PreCompact", [])
if not isinstance(pre, list):
    raise SystemExit("hooks.PreCompact não é uma lista; abortando para não destruir sua config.")

entry = {
    "matcher": "",  # vazio casa com trigger 'manual' E 'auto'
    "hooks": [{"type": "command", "command": cmd, "timeout": 30}],
}

replaced = False
for group in pre:
    if not isinstance(group, dict):
        continue
    for h in group.get("hooks", []):
        if isinstance(h, dict) and "obsidian_compact.py" in str(h.get("command", "")):
            h["command"] = cmd
            h["timeout"] = 30
            group["matcher"] = ""
            replaced = True

if not replaced:
    pre.append(entry)

with open(path, "w", encoding="utf-8") as fh:
    json.dump(data, fh, ensure_ascii=False, indent=2)
    fh.write("\n")

print("  ✓ hook {} em {}".format("atualizado" if replaced else "adicionado", path))
PYEOF

"$PY" -c "import json,sys; json.load(open(sys.argv[1],encoding='utf-8'))" "$SETTINGS"
ok "settings.json continua com JSON válido"

# ---------------------------------------------------------------- CLAUDE.md
if [[ "$CLAUDEMD" == "true" ]]; then
  say ""
  say "== 4b. Bloco de recuperação no CLAUDE.md =="
  if [[ "$SCOPE" == "project" ]]; then MD="$PWD/CLAUDE.md"; else MD="$CLAUDE_DIR/CLAUDE.md"; fi
  if [[ -f "$MD" ]] && grep -q "claude-compact:memoria-projeto" "$MD"; then
    ok "bloco já presente em $MD — nada a fazer"
  else
    [[ -f "$MD" ]] && cp -p "$MD" "$MD.backup-$STAMP" && ok "backup: $MD.backup-$STAMP"
    cat >> "$MD" <<MDEOF

<!-- claude-compact:memoria-projeto -->
## Memória de projeto

Quando estivermos **retomando um projeto já existente** ou quando o contexto
anterior for relevante (logo após uma compactação, ou no início de uma sessão que
continua trabalho anterior), leia primeiro:

\`$VAULT/Claude Code/Projetos/<nome-da-pasta-do-projeto>/MEMORIA.md\`

Use esse arquivo para não me pedir de novo informações que já foram ditas.
Não leia esse arquivo em tarefas pontuais e autocontidas.
<!-- /claude-compact:memoria-projeto -->
MDEOF
    ok "bloco acrescentado a $MD"
  fi
fi

# ---------------------------------------------------------------- teste
say ""
say "== 5. Teste ponta a ponta =="

TESTDIR="$(mktemp -d)"
TRANSCRIPT="$TESTDIR/teste.jsonl"
cat > "$TRANSCRIPT" <<'JSONL'
{"type":"user","timestamp":"2026-01-01T10:00:00.000Z","version":"teste","message":{"role":"user","content":[{"type":"text","text":"Teste de instalacao do hook Obsidian."}]}}
{"type":"assistant","timestamp":"2026-01-01T10:00:05.000Z","message":{"role":"assistant","content":[{"type":"text","text":"Executando verificacao de instalacao."},{"type":"tool_use","name":"Write","input":{"file_path":"/tmp/exemplo.txt"}}]}}
JSONL

PAYLOAD=$(VAULT="$VAULT" TRANSCRIPT="$TRANSCRIPT" TESTDIR="$TESTDIR" "$PY" - <<'PYEOF'
import json, os
print(json.dumps({
    "session_id": "teste-instalacao-0000",
    "transcript_path": os.environ["TRANSCRIPT"],
    "cwd": os.path.join(os.environ["TESTDIR"], "Projeto de Teste"),
    "hook_event_name": "PreCompact",
    "trigger": "manual",
    "custom_instructions": "instalação",
}))
PYEOF
)

BEFORE=$(find "$VAULT" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
# IA desligada no teste para não gastar tokens nem depender de rede.
echo "$PAYLOAD" | OBSIDIAN_COMPACT_AI=0 "$PY" "$TARGET" >/dev/null 2>&1 || true
AFTER=$(find "$VAULT" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')

NOTE=$(find "$VAULT" -path '*Compacts/Projeto de Teste*' -name '*.md' 2>/dev/null | head -1)
if [[ -n "$NOTE" ]]; then
  ok "nota de teste criada: $NOTE"
  ok "notas no Vault: $BEFORE -> $AFTER"
  say ""
  say "  --- primeiras linhas da nota de teste ---"
  head -20 "$NOTE" | sed 's/^/  /'
  say "  ----------------------------------------"
  say ""
  read -r -p "Remover a nota de teste do Vault? [S/n] " RM
  if [[ ! "$RM" =~ ^[Nn] ]]; then
    rm -rf "$VAULT/Claude Code/Compacts/Projeto de Teste" \
           "$VAULT/Claude Code/Projetos/Projeto de Teste"
    ok "artefatos de teste removidos"
  fi
else
  warn "a nota de teste não foi criada. Veja o log: $HOOKS_DIR/logs/obsidian-compact.log"
fi
rm -rf "$TESTDIR"

# ---------------------------------------------------------------- resumo
say ""
say "================ INSTALAÇÃO CONCLUÍDA ================"
say "Vault ................ $VAULT"
say "Compacts ............. $VAULT/Claude Code/Compacts/<projeto>/<data>/"
say "Memória cumulativa ... $VAULT/Claude Code/Projetos/<projeto>/MEMORIA.md"
say "Script ............... $TARGET"
say "Config ............... $CONFIG"
say "Hook registrado em ... $SETTINGS"
say "Log .................. $HOOKS_DIR/logs/obsidian-compact.log"
say "Transcripts (gzip) ... $HOOKS_DIR/transcripts-archive/"
say "Resumo por IA ........ $AI"
[[ "$CLAUDEMD" == "true" ]] && say "CLAUDE.md ............ bloco de recuperação adicionado"
say ""
say "Reinicie o Claude Code e rode /hooks para conferir o registro."
say "Depois é só usar /compact normalmente."
