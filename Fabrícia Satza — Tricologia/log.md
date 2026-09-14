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

## [2026-09-14] estrutura | Protocolo de entrega e de retomada

A Fabrícia apontou que nada do trabalho tinha chegado no Obsidian dela: cinco
commits e um PR prontos, cofre vazio na tela. A causa é estrutural — o agente
roda na nuvem, o Obsidian roda na máquina dela, e não há sincronia.

Registrado como protocolo em três lugares, para não depender de memória de
conversa:

- `CLAUDE.md` na raiz do repo — para quem abrir a sessão em `/home/user/fa` e
  nunca ler o schema do vault (o buraco que existia)
- `CLAUDE.md` do vault — seções "Protocolo de entrega" e "Protocolo de retomada"
- `ESTADO.md`, novo — documento de retomada pós-compactação: estado, decisões
  com o porquê, pendências e as armadilhas já encontradas

Toda alteração no vault passa a terminar com o zip entregue pelo SendUserFile,
sem ela pedir.
