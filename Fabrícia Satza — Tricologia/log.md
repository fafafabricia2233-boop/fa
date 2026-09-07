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

## [2026-09-07] ingest | Manual da marca — setembro 2026

Primeira fonte. O vault original da marca (19 arquivos, exportado em 07/09)
entrou intacto em `raw/Manual da marca — 2026-09-07/`.

Gerou 18 páginas em `wiki/` e a página de resumo em `wiki/Fontes/`. Todas com
`fontes: 1` e link de volta para a fonte. Pastas criadas pela regra das três
páginas: Marca (6), Formatos (5) e Técnica (3); Decisões tomadas, Publicações e
Banco de ideias ficaram na raiz.
