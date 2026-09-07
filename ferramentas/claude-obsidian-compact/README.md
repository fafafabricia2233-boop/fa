# Claude Code → Obsidian (autosave no `/compact`)

Salva automaticamente uma nota Markdown no seu Vault do Obsidian **antes de cada
compactação** do Claude Code — tanto no `/compact` manual quanto na compactação
automática por limite de contexto — e mantém uma memória cumulativa por projeto.

Testado contra o **Claude Code 2.1.263**.

---

## Instalação (1 comando, na sua máquina)

```bash
cd ferramentas/claude-obsidian-compact
bash install.sh
```

O instalador detecta o Vault, pergunta se houver mais de um, faz backup do que já
existe, faz merge no `settings.json` (sem apagar outros hooks) e roda um teste
ponta a ponta.

Opções:

```bash
bash install.sh --vault "/caminho/do/Vault"   # pula a detecção
bash install.sh --no-ai                       # sem enriquecimento por IA
bash install.sh --project                     # instala só no projeto atual
```

Depois: reinicie o Claude Code e rode `/hooks` para conferir.

Para remover: `bash uninstall.sh`.

---

## O que é gerado no Vault

```
<Vault>/Claude Code/
├── Compacts/
│   └── <projeto>/
│       └── 2026-09-06/
│           ├── 23-15 - Compact 01.md
│           └── 23-48 - Compact 02.md
└── Projetos/
    └── <projeto>/
        ├── MEMORIA.md
        └── _historico/
            └── MEMORIA-2026-09-06_23-48-02.md
```

- **Nome do projeto** = nome da pasta de trabalho (`cwd`), higienizado para o
  sistema de arquivos.
- **Numeração sequencial** por projeto/dia. Um arquivo existente **nunca** é
  sobrescrito: se o caminho já existir, o número é incrementado.

### Seções da nota

Frontmatter YAML (projeto, data, hora, gatilho, sessão, tags) e então:

`Contexto geral` · `O que foi feito` · `Decisões importantes` ·
`Preferências e instruções minhas` · `Informações importantes descobertas` ·
`Pendências` · `Próximo passo recomendado` · `Contexto para o próximo Claude` ·
`Arquivos criados ou modificados` · `Referência da sessão`

---

## Como funciona: duas camadas

### Camada 1 — determinística (sempre, ~0,15 s)

Lê o JSONL do transcript e escreve a nota na hora. Extrai:

- todas as **mensagens do usuário na íntegra** (fonte primária das preferências);
- arquivos escritos/alterados (`Write`, `Edit`, `MultiEdit`, `NotebookEdit`) e lidos;
- comandos `Bash` executados;
- lista de tarefas (`TodoWrite`/`Task*`);
- resumos de compactações anteriores da mesma sessão;
- versão do Claude Code, branch git, `session_id`, caminho do transcript.

Filtra ruído: mensagens meta, blocos `<system-reminder>` e `tool_result`.

Não depende de rede. Nunca falha a compactação.

### Camada 2 — semântica, assíncrona (opcional)

Dispara um processo **destacado** que chama `claude -p` para transformar o
transcript num resumo analítico de verdade e para **curar o `MEMORIA.md`**.

- Não bloqueia a compactação: a nota da camada 1 já está no disco.
- Se falhar, expirar (240 s) ou o `claude` não estiver no PATH, a nota
  determinística permanece intacta.
- Só reescreve o trecho entre `<!-- claude-compact:ia:inicio -->` e
  `<!-- claude-compact:ia:fim -->`. O restante da nota nunca é tocado.
- Custo: uma chamada curta ao modelo por compactação. Desligue com
  `--no-ai` na instalação ou `"ai_summary": false` na config.
- Recursão é impossível: o worker exporta `OBSIDIAN_COMPACT_CHILD=1` e o hook
  sai imediatamente quando essa variável está presente.

---

## `MEMORIA.md`: cumulativo por construção

O arquivo tem duas metades:

1. **Bloco curado** (entre `<!-- claude-compact:memoria-curada:inicio/fim -->`) —
   consolidado pela IA a cada compactação: objetivo, arquitetura, decisões,
   regras, preferências, caminhos, arquivos, concluídos, pendências, próximos
   passos. Antes de qualquer reescrita, uma cópia vai para `_historico/`.
   A IA é instruída a **nunca apagar decisão antiga**: uma decisão superada é
   mantida riscada e datada — `- ~~decisão antiga~~ — substituída em AAAA-MM-DD por: ...`

2. **Histórico de compacts** — **somente-acréscimo**, escrito pela camada
   determinística. Nunca é reescrito, nem pela IA. Cada compactação acrescenta um
   bloco com link `[[wikilink]]` para a nota, sessão, transcript, arquivos
   alterados e o pedido inicial.

---

## Preservação do histórico completo

- O JSONL original do Claude Code **não é deletado nem movido**.
- Uma **cópia gzip** é arquivada em
  `~/.claude/hooks/transcripts-archive/<projeto>/<data>_<hora>_Compact-NN_<sessão>.jsonl.gz`.
  Fica **fora do Vault** de propósito: JSONL bruto degradaria a indexação do
  Obsidian. A nota registra o caminho dos dois.
  Isso importa porque o Claude Code limpa transcripts antigos
  (`cleanupPeriodDays`, 30 dias por padrão) — o arquivo morto sobrevive a isso.
- Cada nota registra `claude --resume <session-id>` para retomar a sessão.
- Transcripts acima de `archive_max_mb` (200 MB) não são arquivados, para não
  encher o disco; a nota continua registrando o caminho original.

---

## Configuração

`~/.claude/hooks/obsidian-compact.config.json`:

```json
{
  "vault": "/Users/voce/Documents/MeuVault",
  "base_folder": "Claude Code",
  "ai_summary": true,
  "ai_model": "",
  "ai_timeout_seconds": 240,
  "archive_transcript": true,
  "archive_max_mb": 200
}
```

Variáveis de ambiente têm precedência: `OBSIDIAN_VAULT`, `OBSIDIAN_COMPACT_AI=0`.

Hook registrado em `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command",
            "command": "/usr/bin/python3 \"/Users/voce/.claude/hooks/obsidian_compact.py\"",
            "timeout": 30 }
        ]
      }
    ]
  }
}
```

`"matcher": ""` casa com os dois triggers. Confirmado no código da 2.1.263:
`w.filter(P => !P.matcher || match(query, P.matcher))` — matcher ausente ou vazio
casa com tudo.

---

## Continuar depois do compact

O instalador não mexe no seu `CLAUDE.md`. Se quiser, acrescente à mão:

```markdown
## Memória de projeto

Quando estivermos **retomando um projeto já existente** ou quando o contexto
anterior for relevante (logo após uma compactação, ou no início de uma sessão
que continua trabalho anterior), leia primeiro:

`<Vault>/Claude Code/Projetos/<nome-da-pasta-do-projeto>/MEMORIA.md`

Não leia esse arquivo para tarefas pontuais e autocontidas.
```

---

## Diagnóstico

```bash
tail -f ~/.claude/hooks/logs/obsidian-compact.log     # log (rotaciona em 1 MB)
claude                                                # dentro: /hooks
```

Teste manual, sem compactar de verdade:

```bash
echo '{"session_id":"teste","transcript_path":"","cwd":"'"$PWD"'","hook_event_name":"PreCompact","trigger":"manual"}' \
  | python3 ~/.claude/hooks/obsidian_compact.py
```

Sintomas comuns:

| Sintoma | Causa provável |
|---|---|
| Nada é criado | `vault` errado ou Vault indisponível — veja `ERRO:` no log |
| Nota criada mas sem resumo de IA | `claude` fora do PATH, timeout, ou `ai_summary: false` |
| Hook não dispara | Claude Code não foi reiniciado após editar `settings.json` |

---

## Limitações conhecidas (2.1.263)

- **`PostCompact` não existe** nesta versão. A doc pública lista o evento, mas o
  binário instalado não o implementa — a enum de eventos vai de `PreCompact` a
  `TaskCompleted` sem ele. Portanto **não há como capturar o resumo que o Claude
  Code gera**: o `PreCompact` roda antes de o resumo existir. A camada 2 gera um
  resumo próprio a partir do transcript, que é a alternativa confiável.
- Em compactação **automática**, o hook dispara igual — mas o transcript pode já
  conter resumos de compactações anteriores em vez da conversa crua inicial. Eles
  são capturados na seção "Resumos de compactações anteriores".
- `install.sh` cobre **macOS, Linux e WSL**. No Windows nativo (PowerShell), faça
  a instalação manual: copie o `.py` para `%USERPROFILE%\.claude\hooks\`, crie o
  `obsidian-compact.config.json` e adicione o bloco `PreCompact` ao
  `settings.json` com `python` no lugar de `python3`.
- Requer Python 3.8+. Sem dependências externas.
