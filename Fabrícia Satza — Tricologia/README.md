# Como usar este cofre

Este é um **vault do Obsidian**. Para abrir:

1. Instale o Obsidian (grátis, celular e computador)
2. Abra o app → **Open folder as vault**
3. Aponte para a pasta `Fabrícia Satza — Tricologia`

Comece pela nota **[[00 Início]]** — ela linka para tudo.

As palavras entre colchetes duplos são links: toque para navegar. Se você editar
qualquer nota, ela continua sendo um arquivo `.md` comum, que abre em qualquer
editor de texto.

## Como este cofre funciona

Ele segue o padrão **LLM Wiki**: em vez de jogar documentos num chat e perguntar
de novo toda vez, o agente mantém um wiki que **acumula**. Cada fonte nova é
lida, resumida e **integrada** nas páginas que já existem — os links, as
contradições e a síntese ficam registrados, não são refeitos a cada pergunta.

A divisão de trabalho: **você cura as fontes e faz as perguntas; o agente
escreve e mantém o wiki inteiro.**

```
CLAUDE.md          o schema — como o agente opera este cofre
index.md           catálogo de todas as páginas do wiki
log.md             histórico do que foi feito e quando

raw/               fontes brutas — artigos, papers, capturas
  assets/          imagens (a pasta de anexos do Obsidian aponta pra cá)

wiki/              o que o agente escreve e mantém
  00 Início        porta de entrada
  01 Marca         identidade, fonte, cor, tipografia, tom
  02 Formatos      carrossel, frase, antes/depois, tricoscopia
  03 Técnica       achados, regras, protocolo de foto
  04 Registro      decisões tomadas e o que já foi publicado
  05 Ideias        banco de temas e frases
  06 Fontes        um resumo por fonte ingerida (nasce na 1ª ingestão)

ferramentas/
  buscar.sh        busca por texto no wiki
```

**`raw/` é sua, `wiki/` é do agente.** Ele nunca mexe nas fontes; você não
precisa manter o wiki na mão.

## As três coisas que você pede

| Peça assim | O que acontece |
|---|---|
| *"ingere esse artigo"* (depois de largar o arquivo em `raw/`) | ele lê, conversa com você, escreve o resumo e atualiza todas as páginas que a fonte toca |
| *"o que o wiki diz sobre X?"* | ele lê o `index.md`, abre as páginas certas e responde citando cada uma. Resposta boa vira página nova |
| *"roda um lint"* | ele procura contradição, página órfã, link quebrado, assunto parado e lacuna |

O detalhe todo está em `CLAUDE.md` — é ele que faz o agente se comportar como
mantenedor de wiki, e não como chat genérico.

## Buscar sem abrir o Obsidian

```bash
./ferramentas/buscar.sh anisotricose     # linhas que casam, por página
./ferramentas/buscar.sh -l terracota     # só os nomes das páginas
```

## Sobre o graph view

`Ctrl/Cmd + G` abre o grafo. Todas as páginas têm link de entrada e de saída, então
ele mostra os agrupamentos reais — marca, formatos, técnica — e não uma estrela
em volta do índice. Página solta no grafo é defeito, e o lint acusa.
