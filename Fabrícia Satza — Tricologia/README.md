# Como usar este cofre

Este é um **vault do Obsidian**. Para abrir:

1. Instale o Obsidian (grátis, celular e computador)
2. Abra o app → **Open folder as vault**
3. Aponte para a pasta `Fabrícia Satza — Tricologia`

Comece pela nota **[[00 Início]]**.

O cofre tem **19 páginas e 1 fonte** — o manual da marca, ingerido em 07/09.

## Como ele funciona

Segue o padrão **LLM Wiki**: em vez de jogar documentos num chat e perguntar de
novo toda vez, o agente mantém um wiki que **acumula**. Cada fonte nova é lida,
resumida e **integrada** nas páginas que já existem — os links, as contradições
e a síntese ficam registrados, não são refeitos a cada pergunta.

A divisão de trabalho: **você cura as fontes e faz as perguntas; o agente
escreve e mantém o wiki inteiro.**

```
CLAUDE.md          o schema — como o agente opera este cofre
index.md           catálogo das páginas do wiki
log.md             histórico do que foi feito e quando

raw/               suas fontes — artigos, papers, capturas
  assets/          imagens (a pasta de anexos do Obsidian aponta pra cá)
  Manual da marca — 2026-09-07/    o vault original, intacto

wiki/              o que o agente escreve e mantém
  00 Início        porta de entrada
  Marca/           identidade, fonte, cor, tipografia, tom
  Formatos/        carrossel, frase, antes/depois, tricoscopia
  Técnica/         achados, regras, protocolo de foto
  Fontes/          um resumo por fonte ingerida
  (soltas)         Decisões tomadas · Publicações · Banco de ideias

ferramentas/
  buscar.sh        busca por texto no wiki
```

**`raw/` é sua, `wiki/` é do agente.** Ele nunca mexe nas fontes; você não
precisa manter o wiki na mão.

Não há taxonomia pronta: as páginas nascem das fontes, e uma pasta só é criada
quando três ou mais páginas pedem por ela. Gaveta vazia não ajuda ninguém.

## As três coisas que você pede

| Peça assim | O que acontece |
|---|---|
| *"ingere esse artigo"* (depois de largar o arquivo em `raw/`) | ele lê, conversa com você, escreve o resumo e atualiza as páginas que a fonte toca |
| *"o que o wiki diz sobre X?"* | ele lê o `index.md`, abre as páginas certas e responde citando cada uma. Resposta boa vira página nova |
| *"roda um lint"* | ele procura contradição, página órfã, link quebrado, assunto parado e lacuna |

O detalhe todo está em `CLAUDE.md` — é ele que faz o agente se comportar como
mantenedor de wiki, e não como chat genérico. Inclusive as regras que valem
acima de tudo: achado nunca diagnóstico, nenhum número sem sustentação, imagem
de paciente só com autorização escrita, nada que identifique paciente.

## Buscar sem abrir o Obsidian

```bash
./ferramentas/buscar.sh anisotricose     # linhas que casam, por página
./ferramentas/buscar.sh -l terracota     # só os nomes das páginas
```

## Sobre o graph view

`Ctrl/Cmd + G` abre o grafo. Você vai ver os três agrupamentos — marca,
formatos, técnica — e a fonte como um hub ligado a tudo. É o melhor jeito de
ver o formato do wiki conforme ele cresce. Página solta é defeito, e o lint
acusa.
