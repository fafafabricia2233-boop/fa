---
tags: [log]
---
# Log

Registro do que foi feito e quando. Append-only: entrada nova vai no fim.

Prefixo fixo `## [AAAA-MM-DD] operação | assunto`, para poder ler com
ferramenta:

```bash
grep "^## \[" log.md | tail -5
```

---

## [2026-09-07] estrutura | Cofre zerado

Wiki esvaziado a pedido da Fabrícia: as 18 páginas de marca, formatos, técnica
e registro foram removidas para recomeçar do zero. O conteúdo continua no
histórico do git (commit 1a112a4 e anteriores) caso precise voltar.

Mantidos: o padrão LLM Wiki (`raw/`, `wiki/`, `CLAUDE.md`, `index.md`, este
log), o `ferramentas/buscar.sh` e a configuração do Obsidian. O `CLAUDE.md` foi
reescrito sem taxonomia pré-montada — as pastas passam a nascer das fontes — e
mantendo as regras do domínio.
