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

## [2026-09-07] estrutura | Vault criado

18 páginas escritas a partir das conversas sobre a marca: identidade, fonte,
paleta, tipografia, formatos, técnica de tricoscopia, regras de antes e depois,
decisões e banco de ideias. Nenhuma fonte externa — tudo veio de conversa.

## [2026-09-07] estrutura | Notas interligadas

51 links laterais entre páginas que já se citavam no texto sem se linkar.
Antes, 5 das 19 páginas tinham link de saída; agora todas têm entrada e saída.
Objetivo: o graph view mostrar as relações reais em vez de uma estrela em volta
do índice.

## [2026-09-07] estrutura | Padrão LLM Wiki instalado

Vault reorganizado nas três camadas do padrão: `raw/` (fontes imutáveis),
`wiki/` (as 18 páginas, movidas), e `CLAUDE.md` como schema. Criados `index.md`
(catálogo) e este `log.md`. Adicionados `atualizado` e `fontes` no frontmatter
de todas as páginas, e `ferramentas/buscar.sh` para busca local.
