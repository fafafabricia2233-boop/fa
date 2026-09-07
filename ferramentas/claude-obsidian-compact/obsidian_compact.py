#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
obsidian_compact.py — Hook PreCompact do Claude Code -> Obsidian.

Dispara ANTES de toda compactacao (manual via /compact e automatica por limite
de contexto) e grava uma nota Markdown estruturada dentro do Vault do Obsidian,
alem de manter uma memoria cumulativa por projeto.

Estrutura gerada no Vault:

    <Vault>/Claude Code/Compacts/<projeto>/<AAAA-MM-DD>/HH-MM - Compact NN.md
    <Vault>/Claude Code/Projetos/<projeto>/MEMORIA.md
    <Vault>/Claude Code/Projetos/<projeto>/_historico/MEMORIA-<ts>.md   (backups)

Funcionamento em duas camadas:

  Camada 1 (sincrona, sempre executa, sub-segundo)
      Le o transcript JSONL da sessao e escreve a nota imediatamente, com todos
      os dados deterministicos (mensagens do usuario na integra, arquivos
      tocados, comandos, todos, referencias da sessao). Nunca depende de rede.

  Camada 2 (assincrona, opcional, nao bloqueia a compactacao)
      Dispara um processo destacado que chama `claude -p` para transformar o
      transcript em um resumo semantico de verdade e para curar o MEMORIA.md.
      Se falhar, expirar ou estiver desligada, a nota da camada 1 permanece
      intacta. Desligue com OBSIDIAN_COMPACT_AI=0.

Contrato do hook: este script NUNCA falha a compactacao. Qualquer erro e
registrado em log e o processo sai com codigo 0.

Sem dependencias externas: apenas a biblioteca padrao do Python 3.8+.
"""

from __future__ import annotations

import datetime as _dt
import gzip
import json
import os
import re
import shutil
import subprocess
import sys
import traceback
from pathlib import Path

# --------------------------------------------------------------------------
# Constantes / caminhos
# --------------------------------------------------------------------------

HOOKS_DIR = Path(os.environ.get("CLAUDE_CONFIG_DIR", Path.home() / ".claude")) / "hooks"
CONFIG_PATH = HOOKS_DIR / "obsidian-compact.config.json"
LOG_PATH = HOOKS_DIR / "logs" / "obsidian-compact.log"
JOBS_DIR = HOOKS_DIR / ".jobs"
ARCHIVE_DIR = HOOKS_DIR / "transcripts-archive"

LOG_MAX_BYTES = 1_000_000
BASE_FOLDER_DEFAULT = "Claude Code"

# Marcadores que delimitam o bloco que a camada de IA pode reescrever.
AI_BEGIN = "<!-- claude-compact:ia:inicio -->"
AI_END = "<!-- claude-compact:ia:fim -->"
MEM_BEGIN = "<!-- claude-compact:memoria-curada:inicio -->"
MEM_END = "<!-- claude-compact:memoria-curada:fim -->"

# Orcamento de caracteres do digest enviado para a camada de IA.
DIGEST_BUDGET = 110_000
ASSISTANT_MSG_CAP = 2_400
USER_MSG_CAP = 8_000

TOOL_WRITE = {"Write", "Edit", "MultiEdit", "NotebookEdit", "Update"}
TOOL_READ = {"Read", "NotebookRead"}


# --------------------------------------------------------------------------
# Log
# --------------------------------------------------------------------------

def log(msg: str) -> None:
    """Escreve no log com rotacao simples. Nunca levanta excecao."""
    try:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        if LOG_PATH.exists() and LOG_PATH.stat().st_size > LOG_MAX_BYTES:
            LOG_PATH.replace(LOG_PATH.with_suffix(".log.1"))
        stamp = _dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with LOG_PATH.open("a", encoding="utf-8") as fh:
            fh.write("[{}] {}\n".format(stamp, msg))
    except Exception:
        pass


# --------------------------------------------------------------------------
# Configuracao e deteccao do Vault
# --------------------------------------------------------------------------

def load_config() -> dict:
    cfg = {
        "vault": "",
        "base_folder": BASE_FOLDER_DEFAULT,
        "ai_summary": True,
        "ai_model": "",
        "ai_timeout_seconds": 240,
        "archive_transcript": True,
        "archive_max_mb": 200,
    }
    try:
        if CONFIG_PATH.exists():
            data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                cfg.update({k: v for k, v in data.items() if k in cfg})
    except Exception as exc:
        log("aviso: nao consegui ler {}: {}".format(CONFIG_PATH, exc))

    env_vault = os.environ.get("OBSIDIAN_VAULT", "").strip()
    if env_vault:
        cfg["vault"] = env_vault
    env_ai = os.environ.get("OBSIDIAN_COMPACT_AI", "").strip()
    if env_ai:
        cfg["ai_summary"] = env_ai not in ("0", "false", "no", "off")
    return cfg


def detect_vault() -> str:
    """Procura um Vault (pasta contendo .obsidian) em locais comuns."""
    home = Path.home()
    roots = [
        home,
        home / "Documents",
        home / "Documentos",
        home / "Library" / "Mobile Documents" / "iCloud~md~obsidian" / "Documents",
        home / "Library" / "CloudStorage",
        home / "Dropbox",
        home / "Google Drive",
        home / "OneDrive",
        home / "Desktop",
        home / "Area de Trabalho",
        home / "Sync",
        home / "obsidian",
        home / "Obsidian",
    ]
    found = []
    for root in roots:
        try:
            if not root.is_dir():
                continue
            for cand in root.glob("*/.obsidian"):
                if cand.is_dir():
                    found.append(str(cand.parent))
            for cand in root.glob("*/*/.obsidian"):
                if cand.is_dir():
                    found.append(str(cand.parent))
            if (root / ".obsidian").is_dir():
                found.append(str(root))
        except Exception:
            continue
    # Ordem estavel, sem duplicatas.
    uniq = list(dict.fromkeys(found))
    return uniq[0] if uniq else ""


# --------------------------------------------------------------------------
# Utilitarios de nome de arquivo
# --------------------------------------------------------------------------

_UNSAFE = re.compile(r'[\\/:*?"<>|\x00-\x1f]')


def sanitize(name: str, fallback: str = "sem-nome") -> str:
    """Nome seguro para arquivo/pasta preservando acentos e espacos."""
    name = _UNSAFE.sub("-", (name or "").strip())
    name = re.sub(r"\s+", " ", name).strip(" .")
    if not name:
        return fallback
    return name[:120]


# --------------------------------------------------------------------------
# Parsing do transcript JSONL
# --------------------------------------------------------------------------

def _text_blocks(content) -> list:
    """Extrai texto de um content que pode ser str ou lista de blocos."""
    out = []
    if isinstance(content, str):
        if content.strip():
            out.append(content)
    elif isinstance(content, list):
        for blk in content:
            if isinstance(blk, str):
                if blk.strip():
                    out.append(blk)
            elif isinstance(blk, dict) and blk.get("type") == "text":
                txt = blk.get("text") or ""
                if txt.strip():
                    out.append(txt)
    return out


def _has_tool_result(content) -> bool:
    if isinstance(content, list):
        for blk in content:
            if isinstance(blk, dict) and blk.get("type") == "tool_result":
                return True
    return False


def parse_transcript(path: str) -> dict:
    """Le o JSONL da sessao e devolve um resumo estruturado.

    Tolerante a formato: linhas invalidas sao ignoradas silenciosamente.
    """
    data = {
        "ok": False,
        "lines": 0,
        "user_messages": [],      # [{ts, text}]
        "assistant_messages": [],  # [{ts, text}]
        "files_written": [],      # [(caminho, ferramenta)]
        "files_read": [],
        "commands": [],
        "todos": [],
        "prev_summaries": [],
        "first_ts": "",
        "last_ts": "",
        "cc_version": "",
        "git_branch": "",
        "size_bytes": 0,
    }
    p = Path(path) if path else None
    if not p or not p.is_file():
        log("transcript indisponivel: {!r}".format(path))
        return data

    try:
        data["size_bytes"] = p.stat().st_size
    except Exception:
        pass

    seen_written, seen_read, seen_cmd = set(), set(), set()

    try:
        with p.open("r", encoding="utf-8", errors="replace") as fh:
            for raw in fh:
                raw = raw.strip()
                if not raw:
                    continue
                data["lines"] += 1
                try:
                    ent = json.loads(raw)
                except Exception:
                    continue
                if not isinstance(ent, dict):
                    continue

                ts = ent.get("timestamp") or ""
                if ts:
                    if not data["first_ts"]:
                        data["first_ts"] = ts
                    data["last_ts"] = ts
                if ent.get("version"):
                    data["cc_version"] = ent["version"]
                if ent.get("gitBranch"):
                    data["git_branch"] = ent["gitBranch"]

                etype = ent.get("type")

                # Resumos de compactacoes anteriores desta mesma sessao.
                if etype == "summary" or ent.get("isCompactSummary"):
                    txt = ent.get("summary") or ""
                    if not txt:
                        msg = ent.get("message") or {}
                        txt = "\n".join(_text_blocks(msg.get("content")))
                    if txt.strip():
                        data["prev_summaries"].append(txt.strip())
                    continue

                msg = ent.get("message")
                if not isinstance(msg, dict):
                    continue
                content = msg.get("content")

                if etype == "user":
                    # Ignora resultados de ferramenta e mensagens meta: nao sao
                    # fala do usuario.
                    if ent.get("isMeta") or _has_tool_result(content):
                        continue
                    for txt in _text_blocks(content):
                        s = txt.strip()
                        if s.startswith("<") and s.endswith(">"):
                            continue  # blocos de sistema/reminder
                        data["user_messages"].append({"ts": ts, "text": s})

                elif etype == "assistant":
                    for txt in _text_blocks(content):
                        data["assistant_messages"].append({"ts": ts, "text": txt.strip()})
                    if isinstance(content, list):
                        for blk in content:
                            if not (isinstance(blk, dict) and blk.get("type") == "tool_use"):
                                continue
                            name = blk.get("name") or ""
                            inp = blk.get("input") or {}
                            if not isinstance(inp, dict):
                                continue
                            fp = inp.get("file_path") or inp.get("notebook_path") or ""
                            if name in TOOL_WRITE and fp:
                                key = (fp, name)
                                if key not in seen_written:
                                    seen_written.add(key)
                                    data["files_written"].append(key)
                            elif name in TOOL_READ and fp:
                                if fp not in seen_read:
                                    seen_read.add(fp)
                                    data["files_read"].append(fp)
                            elif name == "Bash":
                                cmd = (inp.get("command") or "").strip()
                                one = " ".join(cmd.split())[:220]
                                if one and one not in seen_cmd:
                                    seen_cmd.add(one)
                                    data["commands"].append(one)
                            elif name in ("TodoWrite", "TaskUpdate", "TaskCreate"):
                                todos = inp.get("todos")
                                if isinstance(todos, list):
                                    data["todos"] = todos
                                elif inp.get("subject") or inp.get("description"):
                                    data["todos"].append({
                                        "content": inp.get("subject") or inp.get("description"),
                                        "status": inp.get("status") or "",
                                    })
        data["ok"] = True
    except Exception as exc:
        log("erro ao ler transcript: {}".format(exc))

    return data


# --------------------------------------------------------------------------
# Montagem da nota
# --------------------------------------------------------------------------

def _fmt_ts(iso: str) -> str:
    if not iso:
        return "?"
    try:
        s = iso.replace("Z", "+00:00")
        dt = _dt.datetime.fromisoformat(s)
        if dt.tzinfo is not None:
            dt = dt.astimezone()
        return dt.strftime("%d/%m/%Y %H:%M")
    except Exception:
        return iso


def _quote(text: str, cap: int) -> str:
    text = text.strip()
    if len(text) > cap:
        text = text[:cap].rstrip() + "\n\n[... truncado ...]"
    return "\n".join("> " + ln if ln else ">" for ln in text.splitlines())


def build_note(ctx: dict) -> str:
    """Monta o Markdown deterministico da nota (camada 1)."""
    tr = ctx["transcript"]
    L = []

    # Frontmatter para o Obsidian.
    L.append("---")
    L.append('titulo: "Compact {:02d} — {}"'.format(ctx["seq"], ctx["project"]))
    L.append("projeto: \"{}\"".format(ctx["project"]))
    L.append("data: {}".format(ctx["date"]))
    L.append("hora: \"{}\"".format(ctx["time_h"]))
    L.append("compact: {}".format(ctx["seq"]))
    L.append("gatilho: {}".format(ctx["trigger"]))
    L.append("sessao: \"{}\"".format(ctx["session_id"]))
    L.append("tags: [claude-code, compact, projeto/{}]".format(
        re.sub(r"\s+", "-", ctx["project"]).lower()))
    L.append("---")
    L.append("")

    L.append("# Claude Code — Compact {:02d}".format(ctx["seq"]))
    L.append("")
    L.append("- **Data:** {}".format(ctx["date_br"]))
    L.append("- **Hora:** {}".format(ctx["time_br"]))
    L.append("- **Projeto:** {}".format(ctx["project"]))
    L.append("- **Diretório do projeto:** `{}`".format(ctx["cwd"]))
    L.append("- **Sessão:** `{}`".format(ctx["session_id"] or "?"))
    L.append("- **Gatilho da compactação:** {}".format(
        "manual (`/compact`)" if ctx["trigger"] == "manual" else "automática (limite de contexto)"))
    if ctx.get("git_branch") or tr.get("git_branch"):
        L.append("- **Branch git:** `{}`".format(ctx.get("git_branch") or tr.get("git_branch")))
    if tr.get("first_ts"):
        L.append("- **Início da sessão:** {}".format(_fmt_ts(tr["first_ts"])))
    if ctx.get("custom_instructions"):
        L.append("- **Instruções passadas ao /compact:** {}".format(ctx["custom_instructions"]))
    L.append("")
    L.append("[[MEMORIA|Memória cumulativa do projeto]] · "
             "[[{}|Todos os compacts de hoje]]".format(ctx["date"]))
    L.append("")
    L.append("---")
    L.append("")

    # ---- Bloco reescrito pela camada de IA -------------------------------
    L.append(AI_BEGIN)
    L.append("> [!info] Resumo semântico")
    L.append("> As seções abaixo foram geradas de forma determinística a partir do "
             "transcript. Se o enriquecimento por IA estiver ativo, elas são "
             "substituídas por um resumo analítico em alguns instantes.")
    L.append("")

    L.append("## Contexto geral")
    L.append("")
    if tr["user_messages"]:
        L.append("Objetivo declarado pelo usuário no início da sessão:")
        L.append("")
        L.append(_quote(tr["user_messages"][0]["text"], 1500))
    else:
        L.append("_Não foi possível extrair o objetivo a partir do transcript._")
    L.append("")

    L.append("## O que foi feito")
    L.append("")
    if tr["files_written"]:
        L.append("**Arquivos escritos/alterados nesta sessão:** {}".format(len(tr["files_written"])))
    if tr["commands"]:
        L.append("**Comandos executados:** {}".format(len(tr["commands"])))
    if tr["assistant_messages"]:
        L.append("")
        L.append("Últimos passos relatados pelo assistente:")
        L.append("")
        for m in tr["assistant_messages"][-6:]:
            snippet = " ".join(m["text"].split())[:400]
            if snippet:
                L.append("- {}".format(snippet))
    if not (tr["files_written"] or tr["commands"] or tr["assistant_messages"]):
        L.append("_Sem atividade registrada no transcript._")
    L.append("")

    L.append("## Decisões importantes")
    L.append("")
    L.append("_A extração determinística não identifica decisões. "
             "Consulte 'Preferências e instruções minhas' e o registro bruto abaixo._")
    L.append("")

    L.append("## Preferências e instruções minhas")
    L.append("")
    if tr["user_messages"]:
        L.append("Transcrição integral do que o usuário pediu (fonte primária, "
                 "preservada na íntegra):")
        L.append("")
        for i, m in enumerate(tr["user_messages"], 1):
            L.append("### Mensagem {} — {}".format(i, _fmt_ts(m["ts"])))
            L.append("")
            L.append(_quote(m["text"], USER_MSG_CAP))
            L.append("")
    else:
        L.append("_Nenhuma mensagem do usuário encontrada no transcript._")
    L.append("")

    L.append("## Informações importantes descobertas")
    L.append("")
    if tr["commands"]:
        L.append("Comandos executados (podem conter caminhos e descobertas relevantes):")
        L.append("")
        for c in tr["commands"][:40]:
            L.append("- `{}`".format(c))
        if len(tr["commands"]) > 40:
            L.append("- _... e mais {} comandos._".format(len(tr["commands"]) - 40))
    else:
        L.append("_Nada registrado._")
    L.append("")

    L.append("## Pendências")
    L.append("")
    if tr["todos"]:
        for t in tr["todos"]:
            if isinstance(t, dict):
                status = (t.get("status") or "").lower()
                mark = "x" if status in ("completed", "done") else " "
                label = t.get("content") or t.get("activeForm") or t.get("subject") or ""
                if label:
                    L.append("- [{}] {}".format(mark, label))
    else:
        L.append("_Nenhuma lista de tarefas registrada nesta sessão._")
    L.append("")

    L.append("## Próximo passo recomendado")
    L.append("")
    L.append("_A definir — veja as pendências acima._")
    L.append("")

    L.append("## Contexto para o próximo Claude")
    L.append("")
    L.append("Sessão do projeto **{}** em `{}`, compactada em {} às {} "
             "(gatilho: {}).".format(ctx["project"], ctx["cwd"], ctx["date_br"],
                                     ctx["time_br"], ctx["trigger"]))
    if tr["user_messages"]:
        L.append("")
        L.append("O pedido original do usuário está transcrito integralmente na seção "
                 "'Preferências e instruções minhas'. Leia-a antes de perguntar "
                 "qualquer coisa que já foi dita.")
    if tr["files_written"]:
        L.append("")
        L.append("Arquivos tocados: {}.".format(
            ", ".join("`{}`".format(f) for f, _ in tr["files_written"][:15])))
    L.append("")
    L.append(AI_END)
    L.append("")
    L.append("---")
    L.append("")

    # ---- Blocos sempre deterministicos -----------------------------------
    L.append("## Arquivos criados ou modificados")
    L.append("")
    if tr["files_written"]:
        for fp, tool in tr["files_written"]:
            L.append("- `{}` — via `{}`".format(fp, tool))
    else:
        L.append("_Nenhum arquivo foi escrito nesta sessão._")
    L.append("")
    if tr["files_read"]:
        L.append("<details><summary>Arquivos lidos ({})</summary>".format(len(tr["files_read"])))
        L.append("")
        for fp in tr["files_read"][:120]:
            L.append("- `{}`".format(fp))
        L.append("")
        L.append("</details>")
        L.append("")

    L.append("## Referência da sessão")
    L.append("")
    L.append("- **session_id:** `{}`".format(ctx["session_id"] or "?"))
    L.append("- **Transcript original (JSONL, não deletado):** `{}`".format(ctx["transcript_path"]))
    if ctx.get("archive_path"):
        L.append("- **Cópia arquivada (gzip):** `{}`".format(ctx["archive_path"]))
    L.append("- **Retomar a sessão:** `claude --resume {}`".format(ctx["session_id"] or "<session-id>"))
    L.append("- **Linhas no transcript:** {} · **Tamanho:** {} KB".format(
        tr["lines"], round(tr["size_bytes"] / 1024, 1)))
    if tr.get("cc_version"):
        L.append("- **Versão do Claude Code:** {}".format(tr["cc_version"]))
    L.append("- **Nota gerada por:** hook `PreCompact` → `obsidian_compact.py`")
    L.append("")

    if tr["prev_summaries"]:
        L.append("## Resumos de compactações anteriores desta sessão")
        L.append("")
        for s in tr["prev_summaries"]:
            L.append("<details><summary>Resumo anterior</summary>")
            L.append("")
            L.append(s[:20000])
            L.append("")
            L.append("</details>")
            L.append("")

    return "\n".join(L) + "\n"


# --------------------------------------------------------------------------
# Digest para a camada de IA
# --------------------------------------------------------------------------

def build_digest(tr: dict, ctx: dict) -> str:
    parts = []
    parts.append("PROJETO: {}".format(ctx["project"]))
    parts.append("DIRETORIO: {}".format(ctx["cwd"]))
    parts.append("DATA/HORA: {} {}".format(ctx["date_br"], ctx["time_br"]))
    parts.append("GATILHO: {}".format(ctx["trigger"]))
    parts.append("")

    if tr["prev_summaries"]:
        parts.append("=== RESUMOS DE COMPACTACOES ANTERIORES ===")
        for s in tr["prev_summaries"][-2:]:
            parts.append(s[:12000])
        parts.append("")

    parts.append("=== MENSAGENS DO USUARIO (na integra, fonte primaria) ===")
    for i, m in enumerate(tr["user_messages"], 1):
        parts.append("--- usuario #{} ({}) ---".format(i, m["ts"]))
        parts.append(m["text"][:USER_MSG_CAP])
    parts.append("")

    parts.append("=== ARQUIVOS ESCRITOS/ALTERADOS ===")
    for fp, tool in tr["files_written"]:
        parts.append("{} ({})".format(fp, tool))
    parts.append("")

    parts.append("=== COMANDOS EXECUTADOS ===")
    for c in tr["commands"][:150]:
        parts.append(c)
    parts.append("")

    if tr["todos"]:
        parts.append("=== TAREFAS ===")
        parts.append(json.dumps(tr["todos"], ensure_ascii=False)[:6000])
        parts.append("")

    head = "\n".join(parts)
    remaining = max(4000, DIGEST_BUDGET - len(head))

    tail = ["=== FALAS DO ASSISTENTE (mais recentes primeiro, truncadas) ==="]
    used = 0
    for m in reversed(tr["assistant_messages"]):
        chunk = m["text"][:ASSISTANT_MSG_CAP]
        if used + len(chunk) > remaining:
            break
        tail.append("--- assistente ({}) ---".format(m["ts"]))
        tail.append(chunk)
        used += len(chunk)

    return head + "\n" + "\n".join(tail)


NOTE_PROMPT = """Você recebe o registro bruto de uma sessão do Claude Code que está prestes a ser compactada. Sua tarefa é escrever a MEMÓRIA EXTERNA dessa sessão em Markdown, em português do Brasil.

Escreva APENAS o Markdown final, sem cercas de código ao redor, sem preâmbulo e sem comentários seus.

Use EXATAMENTE estes títulos de nível 2, copiados ao pé da letra (com acentos), nesta ordem:

## Contexto geral
Resumo do que estava sendo feito e o objetivo principal da sessão. Dois a cinco parágrafos curtos.

## O que foi feito
Lista do que foi implementado, criado, alterado, analisado ou decidido. Seja concreto e cite nomes de arquivos, comandos e resultados. Não invente.

## Decisões importantes
Decisões tomadas na conversa que precisam ser preservadas, com o motivo de cada uma. Se não houver, escreva "_Nenhuma decisão relevante registrada._".

## Preferências e instruções minhas
Regras, preferências, padrões e instruções que o USUÁRIO passou e que valem para o futuro. Escreva na voz do usuário ("Quero que...", "Não quero..."). Esta seção é crítica: não perca nada.

## Informações importantes descobertas
Conhecimentos, resultados de investigação, dados, caminhos, versões, configurações e conclusões importantes. Inclua caminhos e valores literais quando existirem.

## Pendências
O que ainda falta fazer. Se não houver, escreva "_Nenhuma pendência registrada._".

## Próximo passo recomendado
A próxima ação lógica, específica e acionável.

## Contexto para o próximo Claude
Um resumo autocontido que outro Claude consiga ler e continuar exatamente de onde parou, sem o usuário precisar reexplicar nada. Inclua o objetivo, o estado atual, os caminhos importantes e as restrições já acordadas. Pode ter vários parágrafos.

Regras absolutas:
- Escreva em português correto, com acentuação. Os títulos das seções devem sair exatamente como acima, acentuados.
- Baseie-se somente no registro fornecido. Nunca invente fatos, arquivos ou decisões.
- Se uma informação não existe no registro, diga que não consta.
- Prefira precisão a elegância. Caminhos e nomes literais valem mais que prosa.

REGISTRO DA SESSÃO:
"""

MEM_PROMPT = """Você mantém o arquivo de memória persistente de um projeto (MEMORIA.md), em português do Brasil.

Abaixo estão (A) a versão curada atual dessa memória e (B) a nota do compact mais recente da sessão.

Produza a NOVA versão curada da memória. Escreva APENAS o Markdown final, sem cercas de código, sem preâmbulo.

Use exatamente estes títulos de nível 2, copiados ao pé da letra (com acentos), nesta ordem:

## Objetivo do projeto
## Arquitetura e estrutura
## Decisões tomadas
## Regras definidas
## Preferências do usuário
## Caminhos importantes
## Arquivos principais
## Tarefas concluídas
## Pendências
## Próximos passos

Regras absolutas:
- Escreva em português correto, com acentuação. Os títulos devem sair exatamente como acima.
- Faça merge, não substituição. Tudo que continua válido na memória atual deve permanecer.
- Elimine duplicatas: não repita a mesma informação com palavras diferentes.
- NUNCA apague uma decisão antiga relevante. Se uma decisão nova substitui uma antiga, mantenha a antiga marcada assim: "- ~~decisão antiga~~ — substituída em AAAA-MM-DD por: decisão nova".
- Em "Tarefas concluídas", acumule; não remova itens já concluídos.
- Não invente nada que não esteja em (A) ou (B).
- Seja conciso. Bullets curtos, sem enchimento.

=== (A) MEMÓRIA CURADA ATUAL ===
"""


# --------------------------------------------------------------------------
# MEMORIA.md
# --------------------------------------------------------------------------

def memoria_skeleton(project: str) -> str:
    return (
        "---\n"
        'titulo: "Memória do projeto — {p}"\n'
        "projeto: \"{p}\"\n"
        "tags: [claude-code, memoria]\n"
        "---\n\n"
        "# Memória do projeto — {p}\n\n"
        "> [!note] Como usar\n"
        "> Este arquivo é a memória persistente do projeto. O bloco curado abaixo é\n"
        "> reescrito e consolidado a cada compactação. O histórico de compacts no fim\n"
        "> do arquivo é somente-acréscimo e nunca é reescrito.\n\n"
        "{b}\n"
        "## Objetivo do projeto\n\n_A preencher._\n\n"
        "## Arquitetura e estrutura\n\n_A preencher._\n\n"
        "## Decisões tomadas\n\n_A preencher._\n\n"
        "## Regras definidas\n\n_A preencher._\n\n"
        "## Preferências do usuário\n\n_A preencher._\n\n"
        "## Caminhos importantes\n\n_A preencher._\n\n"
        "## Arquivos principais\n\n_A preencher._\n\n"
        "## Tarefas concluídas\n\n_A preencher._\n\n"
        "## Pendências\n\n_A preencher._\n\n"
        "## Próximos passos\n\n_A preencher._\n"
        "{e}\n\n"
        "---\n\n"
        "# Histórico de compacts\n\n"
        "<!-- append-only: cada compactação acrescenta um bloco abaixo. Nada é removido. -->\n"
    ).format(p=project, b=MEM_BEGIN, e=MEM_END)


def append_memoria_entry(mem_path: Path, ctx: dict, note_rel: str) -> None:
    """Acrescenta (nunca sobrescreve) o registro deste compact no MEMORIA.md."""
    tr = ctx["transcript"]
    if not mem_path.exists():
        mem_path.parent.mkdir(parents=True, exist_ok=True)
        mem_path.write_text(memoria_skeleton(ctx["project"]), encoding="utf-8")

    lines = []
    lines.append("")
    lines.append("## {} {} — Compact {:02d} ({})".format(
        ctx["date_br"], ctx["time_br"], ctx["seq"], ctx["trigger"]))
    lines.append("")
    lines.append("- Nota: [[{}]]".format(note_rel))
    lines.append("- Sessão: `{}`".format(ctx["session_id"] or "?"))
    lines.append("- Transcript: `{}`".format(ctx["transcript_path"]))
    if ctx.get("archive_path"):
        lines.append("- Arquivo morto: `{}`".format(ctx["archive_path"]))
    if tr["files_written"]:
        lines.append("- Arquivos alterados ({}): {}".format(
            len(tr["files_written"]),
            ", ".join("`{}`".format(Path(f).name) for f, _ in tr["files_written"][:12])))
    if tr["user_messages"]:
        first = " ".join(tr["user_messages"][0]["text"].split())[:280]
        lines.append("- Pedido inicial: {}".format(first))
    lines.append("")

    with mem_path.open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


def replace_between(text: str, begin: str, end: str, new_body: str):
    """Substitui o conteudo entre marcadores. Devolve (texto, sucesso)."""
    i = text.find(begin)
    j = text.find(end)
    if i == -1 or j == -1 or j < i:
        return text, False
    return text[:i + len(begin)] + "\n" + new_body.strip() + "\n" + text[j:], True


# --------------------------------------------------------------------------
# Camada 2: worker de IA (processo destacado)
# --------------------------------------------------------------------------

def run_claude(prompt: str, model: str, timeout: int) -> str:
    exe = shutil.which("claude")
    if not exe:
        log("worker: binario 'claude' nao encontrado no PATH; IA desativada")
        return ""
    cmd = [exe, "-p", "--output-format", "text"]
    if model:
        cmd += ["--model", model]
    env = dict(os.environ)
    env["OBSIDIAN_COMPACT_CHILD"] = "1"  # impede recursao do hook
    try:
        proc = subprocess.run(
            cmd, input=prompt, capture_output=True, text=True,
            timeout=timeout, env=env,
        )
        if proc.returncode != 0:
            log("worker: claude -p retornou {} :: {}".format(
                proc.returncode, (proc.stderr or "")[:400]))
            return ""
        return (proc.stdout or "").strip()
    except subprocess.TimeoutExpired:
        log("worker: claude -p excedeu {}s".format(timeout))
        return ""
    except Exception as exc:
        log("worker: falha ao chamar claude -p: {}".format(exc))
        return ""


def strip_fences(text: str) -> str:
    t = text.strip()
    if t.startswith("```"):
        nl = t.find("\n")
        if nl != -1:
            t = t[nl + 1:]
        if t.rstrip().endswith("```"):
            t = t.rstrip()[:-3]
    return t.strip()


def ai_worker(job_path: str) -> int:
    """Executa em processo destacado. Enriquece a nota e cura o MEMORIA.md."""
    try:
        job = json.loads(Path(job_path).read_text(encoding="utf-8"))
    except Exception as exc:
        log("worker: job invalido {}: {}".format(job_path, exc))
        return 0

    model = job.get("ai_model") or ""
    timeout = int(job.get("ai_timeout_seconds") or 240)
    note_path = Path(job["note_path"])
    mem_path = Path(job["mem_path"])

    # --- 1) Resumo semantico da nota ---
    note_md = strip_fences(run_claude(NOTE_PROMPT + job["digest"], model, timeout))
    if note_md and "## Contexto geral" in note_md:
        try:
            current = note_path.read_text(encoding="utf-8")
            updated, ok = replace_between(current, AI_BEGIN, AI_END, note_md)
            if ok:
                note_path.write_text(updated, encoding="utf-8")
                log("worker: nota enriquecida -> {}".format(note_path))
            else:
                log("worker: marcadores de IA nao encontrados em {}".format(note_path))
        except Exception as exc:
            log("worker: falha ao gravar nota enriquecida: {}".format(exc))
    else:
        log("worker: resumo da nota vazio ou fora do formato; nota deterministica mantida")
        note_md = ""

    # --- 2) Curadoria do MEMORIA.md ---
    try:
        mem_text = mem_path.read_text(encoding="utf-8") if mem_path.exists() else ""
        if not mem_text:
            return 0
        i, j = mem_text.find(MEM_BEGIN), mem_text.find(MEM_END)
        if i == -1 or j == -1:
            log("worker: MEMORIA sem marcadores; curadoria pulada")
            return 0
        curada_atual = mem_text[i + len(MEM_BEGIN):j].strip()

        base_nota = note_md or note_path.read_text(encoding="utf-8")
        prompt = (MEM_PROMPT + curada_atual +
                  "\n\n=== (B) NOTA DO COMPACT MAIS RECENTE ===\n" + base_nota[:60000])
        nova = strip_fences(run_claude(prompt, model, timeout))
        if not nova or "## Objetivo do projeto" not in nova:
            log("worker: curadoria da memoria vazia ou fora do formato; memoria mantida")
            return 0

        # Backup antes de qualquer reescrita.
        hist = mem_path.parent / "_historico"
        hist.mkdir(parents=True, exist_ok=True)
        stamp = _dt.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        shutil.copy2(mem_path, hist / "MEMORIA-{}.md".format(stamp))

        mem_text = mem_path.read_text(encoding="utf-8")  # relê: pode ter mudado
        updated, ok = replace_between(mem_text, MEM_BEGIN, MEM_END, nova)
        if ok:
            mem_path.write_text(updated, encoding="utf-8")
            log("worker: memoria curada -> {}".format(mem_path))
    except Exception as exc:
        log("worker: falha na curadoria da memoria: {}".format(exc))

    try:
        Path(job_path).unlink()
    except Exception:
        pass
    return 0


def spawn_ai_worker(job: dict) -> None:
    """Dispara o worker destacado. Nunca bloqueia a compactacao."""
    try:
        JOBS_DIR.mkdir(parents=True, exist_ok=True)
        stamp = _dt.datetime.now().strftime("%Y%m%d-%H%M%S-%f")
        job_path = JOBS_DIR / "job-{}.json".format(stamp)
        job_path.write_text(json.dumps(job, ensure_ascii=False), encoding="utf-8")

        env = dict(os.environ)
        env["OBSIDIAN_COMPACT_CHILD"] = "1"

        # stderr do worker vai para um arquivo: se o processo destacado morrer,
        # o traceback fica registrado em vez de sumir em /dev/null.
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        errlog = open(LOG_PATH.parent / "worker-stderr.log", "ab")

        kwargs = dict(
            stdin=subprocess.DEVNULL,
            stdout=errlog,
            stderr=errlog,
            env=env,
            close_fds=True,
            cwd=str(Path.home()),
        )
        if hasattr(os, "setsid"):
            kwargs["start_new_session"] = True
        subprocess.Popen(
            [sys.executable, os.path.abspath(__file__), "--ai-worker", str(job_path)],
            **kwargs
        )
        errlog.close()
        log("worker de IA disparado: {}".format(job_path))
    except Exception as exc:
        log("nao consegui disparar o worker de IA: {}".format(exc))


# --------------------------------------------------------------------------
# Arquivamento do transcript
# --------------------------------------------------------------------------

def archive_transcript(src: str, project: str, ctx: dict, max_mb: int) -> str:
    try:
        p = Path(src)
        if not p.is_file():
            return ""
        size_mb = p.stat().st_size / (1024 * 1024)
        if size_mb > max_mb:
            log("arquivamento pulado: transcript com {:.1f} MB (limite {} MB)".format(size_mb, max_mb))
            return ""
        dest_dir = ARCHIVE_DIR / sanitize(project)
        dest_dir.mkdir(parents=True, exist_ok=True)
        name = "{}_{}_Compact-{:02d}_{}.jsonl.gz".format(
            ctx["date"], ctx["time_h"], ctx["seq"], (ctx["session_id"] or "sem-id")[:8])
        dest = dest_dir / name
        with p.open("rb") as fin, gzip.open(dest, "wb", compresslevel=6) as fout:
            shutil.copyfileobj(fin, fout, length=1024 * 512)
        return str(dest)
    except Exception as exc:
        log("falha ao arquivar transcript: {}".format(exc))
        return ""


# --------------------------------------------------------------------------
# Numeracao sequencial
# --------------------------------------------------------------------------

_SEQ_RE = re.compile(r"- Compact (\d+)\.md$", re.IGNORECASE)


def next_sequence(day_dir: Path) -> int:
    highest = 0
    try:
        if day_dir.is_dir():
            for f in day_dir.glob("*.md"):
                m = _SEQ_RE.search(f.name)
                if m:
                    highest = max(highest, int(m.group(1)))
    except Exception:
        pass
    return highest + 1


def unique_path(day_dir: Path, time_h: str, seq: int):
    """Devolve um caminho que ainda nao existe. Nunca sobrescreve."""
    while True:
        cand = day_dir / "{} - Compact {:02d}.md".format(time_h, seq)
        if not cand.exists():
            return cand, seq
        seq += 1


# --------------------------------------------------------------------------
# Fluxo principal
# --------------------------------------------------------------------------

def main() -> int:
    # O worker destacado e lancado com OBSIDIAN_COMPACT_CHILD=1 no ambiente, e
    # por isso precisa ser despachado ANTES da guarda anti-recursao abaixo.
    if len(sys.argv) >= 3 and sys.argv[1] == "--ai-worker":
        return ai_worker(sys.argv[2])

    # Guarda anti-recursao: a sessao `claude -p` aberta pelo worker herda esta
    # variavel; se ela compactar, o hook nao deve reprocessar nada.
    if os.environ.get("OBSIDIAN_COMPACT_CHILD") == "1":
        return 0

    raw = ""
    try:
        raw = sys.stdin.read()
    except Exception:
        pass

    try:
        payload = json.loads(raw) if raw.strip() else {}
    except Exception as exc:
        log("payload do hook nao e JSON valido: {} :: {!r}".format(exc, raw[:300]))
        payload = {}

    cfg = load_config()

    vault = (cfg.get("vault") or "").strip()
    if not vault:
        vault = detect_vault()
        if vault:
            log("vault detectado automaticamente: {}".format(vault))
    if not vault:
        log("ERRO: nenhum Vault do Obsidian configurado nem detectado. "
            "Defina 'vault' em {} ou a variavel OBSIDIAN_VAULT.".format(CONFIG_PATH))
        return 0

    vault_path = Path(os.path.expanduser(vault))
    if not vault_path.is_dir():
        log("ERRO: vault inexistente ou indisponivel: {} (compactacao segue normalmente)".format(vault_path))
        return 0

    cwd = payload.get("cwd") or os.getcwd()
    project = sanitize(Path(cwd).name or "projeto")
    session_id = payload.get("session_id") or ""
    transcript_path = payload.get("transcript_path") or ""
    trigger = payload.get("trigger") or "manual"
    custom = payload.get("custom_instructions") or ""

    now = _dt.datetime.now()
    ctx = {
        "project": project,
        "cwd": cwd,
        "session_id": session_id,
        "transcript_path": transcript_path,
        "trigger": trigger,
        "custom_instructions": custom,
        "date": now.strftime("%Y-%m-%d"),
        "date_br": now.strftime("%d/%m/%Y"),
        "time_h": now.strftime("%H-%M"),
        "time_br": now.strftime("%H:%M"),
        "git_branch": "",
    }

    base = vault_path / cfg.get("base_folder", BASE_FOLDER_DEFAULT)
    day_dir = base / "Compacts" / project / ctx["date"]
    proj_dir = base / "Projetos" / project
    day_dir.mkdir(parents=True, exist_ok=True)
    proj_dir.mkdir(parents=True, exist_ok=True)

    seq = next_sequence(day_dir)
    note_path, seq = unique_path(day_dir, ctx["time_h"], seq)
    ctx["seq"] = seq

    ctx["transcript"] = parse_transcript(transcript_path)

    if cfg.get("archive_transcript", True):
        ctx["archive_path"] = archive_transcript(
            transcript_path, project, ctx, int(cfg.get("archive_max_mb", 200)))
    else:
        ctx["archive_path"] = ""

    note_md = build_note(ctx)
    note_path.write_text(note_md, encoding="utf-8")
    log("nota criada: {} ({} linhas de transcript, gatilho={})".format(
        note_path, ctx["transcript"]["lines"], trigger))

    mem_path = proj_dir / "MEMORIA.md"
    append_memoria_entry(mem_path, ctx, note_path.stem)

    if cfg.get("ai_summary", True):
        spawn_ai_worker({
            "note_path": str(note_path),
            "mem_path": str(mem_path),
            "digest": build_digest(ctx["transcript"], ctx),
            "ai_model": cfg.get("ai_model") or "",
            "ai_timeout_seconds": cfg.get("ai_timeout_seconds", 240),
        })

    # Mensagem curta no stderr: aparece no transcript do Claude Code sem
    # interferir na compactacao.
    sys.stderr.write("[Obsidian] Compact salvo em: {}\n".format(note_path))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        log("EXCECAO NAO TRATADA:\n" + traceback.format_exc())
        sys.exit(0)  # jamais bloquear a compactacao
