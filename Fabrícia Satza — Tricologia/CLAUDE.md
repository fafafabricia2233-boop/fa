# Schema do wiki — Fabrícia Satza · Tricologia

Este arquivo diz ao agente **como operar este vault**. Ele é a configuração do
padrão *LLM Wiki*: eu (Fabrícia) curo as fontes e faço as perguntas; o agente
escreve e mantém o wiki inteiro.

Leia este arquivo antes de qualquer operação.

**O cofre está vazio.** Nenhuma fonte foi ingerida ainda, e `wiki/` só tem a
página de entrada. A estrutura abaixo é o combinado; ela se preenche conforme
as fontes chegam.

---

## As três camadas

| Camada | Pasta | Quem escreve |
|---|---|---|
| **Fontes brutas** | `raw/` | só a Fabrícia. **O agente nunca edita nem apaga nada aqui.** |
| **Wiki** | `wiki/` | só o agente. A Fabrícia lê, comenta e pede mudanças. |
| **Schema** | este arquivo | os dois, em conjunto, conforme o método amadurece. |

Mais dois arquivos na raiz:

- **`index.md`** — catálogo de tudo que existe no wiki. Orientado a conteúdo.
- **`log.md`** — histórico do que foi feito e quando. Orientado a tempo.

`wiki/00 Início.md` é diferente de `index.md`: o `00 Início` é a porta de
entrada curada, temática, para leitura humana. O `index.md` é a lista completa,
mantida pelo agente, que ele lê primeiro para achar as páginas de uma pergunta.
Os dois precisam existir e não se substituem.

---

## Como o wiki cresce

Não existe taxonomia pré-montada, e isso é de propósito: pasta criada antes de
ter conteúdo vira gaveta vazia. As páginas nascem das fontes.

- Página nova entra na raiz de `wiki/`.
- **Uma pasta só nasce quando três ou mais páginas pedem por ela.** Aí o agente
  propõe o nome, move as páginas e registra no `log.md`.
- `wiki/Fontes/` é a exceção: nasce na primeira ingestão, e guarda uma página de
  resumo por fonte de `raw/`.

---

## Convenções de página

**Frontmatter em toda página do wiki:**

```yaml
---
tags: [tricoscopia, referencia]
atualizado: 2026-09-07
fontes: 2
---
```

- `tags` — minúsculas, sem acento, separadas por vírgula. Reaproveite as que já
  existem antes de inventar uma nova.
- `atualizado` — data da última alteração de conteúdo (`AAAA-MM-DD`). O agente
  atualiza sempre que mexe na página.
- `fontes` — quantas fontes de `raw/` sustentam a página. `0` = conhecimento
  que veio da conversa, não de documento.

**Título:** `# Nome da página` na primeira linha depois do frontmatter, igual
ao nome do arquivo.

**Nomes de arquivo:** em português, com acento, capitalização de frase
(`Paleta e contraste`, não `paleta-e-contraste`). É o nome que aparece no
`[[link]]`.

**Links:** `[[Nome da página]]`. Dentro de tabela, escape a barra do alias:
`[[Nome da página\|texto do link]]`. Toda página precisa de pelo menos **um
link de saída e um de entrada** — página órfã é defeito, e o lint acusa.

**Citação de fonte:** ao afirmar algo que veio de uma fonte, cite a página de
resumo: `Segundo [[Nome da fonte]], ...`. Sem isso não dá para auditar depois.

**Tamanho:** se uma página passa de ~150 linhas, quase sempre há duas páginas
ali dentro. Divida e linke.

---

## Operação: INGEST

Quando a Fabrícia colocar um arquivo em `raw/` e pedir para processar:

1. **Leia a fonte inteira.** Se tiver imagem em `raw/assets/`, leia o texto
   primeiro e depois abra as imagens que importarem.
2. **Converse antes de escrever.** Diga o que achou e o que pretende mudar no
   wiki. Espere o aceite. Ingestão é uma por vez, com a Fabrícia junto — não
   processe uma pilha em lote sem ela pedir.
3. **Crie a página de resumo** em `wiki/Fontes/`, com: o que é a fonte, de onde
   veio, data, os achados principais, e o que ela muda no wiki.
4. **Integre nas páginas existentes.** Este é o passo que faz o padrão valer:
   não basta arquivar o resumo. Atualize as páginas de conceito que a fonte
   toca, reforce ou contradiga o que já estava escrito, crie os links novos nos
   dois sentidos. Uma fonte boa mexe em várias páginas.
5. **Contradição não se apaga.** Se a fonte nova contradiz o que está escrito,
   registre as duas versões e o que as separa — e leve para uma página de
   decisão se for uma escolha, não um fato.
6. **Atualize** `index.md` e o `fontes:` das páginas tocadas.
7. **Anexe ao `log.md`.**

Nas primeiras ingestões o wiki ainda não tem em que se apoiar: aí o passo 4 é
principalmente criar as páginas de conceito que a fonte pede.

## Operação: QUERY

Quando a Fabrícia fizer uma pergunta ao wiki:

1. **Leia o `index.md` primeiro**, depois abra só as páginas relevantes. Não
   varra o vault inteiro por padrão.
2. Responda **com citação de página** — `[[Nome da página]] diz que...`.
3. Se a resposta não estiver no wiki, diga isso claramente em vez de preencher
   a lacuna com conhecimento geral. Lacuna é informação: vira item de lint.
4. **Ofereça arquivar a resposta.** Uma comparação, uma análise, uma conexão
   que a pergunta revelou tem valor e não deve morrer no chat. Se a Fabrícia
   aceitar, vira página nova, entra no `index.md` e no `log.md`.

## Operação: LINT

Quando a Fabrícia pedir uma revisão de saúde do wiki, procure:

- **Contradições** entre páginas
- **Páginas órfãs** — sem link de entrada
- **Becos sem saída** — sem link de saída
- **Conceito citado várias vezes sem página própria**
- **Páginas paradas** — `atualizado` antigo em assunto que andou
- **Links quebrados**
- **Lacunas** — o que falta para o wiki responder as perguntas que ela faz

Entregue como lista priorizada, com a correção proposta. **Não aplique
correção de conteúdo sem aceite** — link quebrado e frontmatter faltando pode
consertar direto.

Rodar depois de cada 3–5 ingestões é um bom ritmo.

---

## Formato do log

Append-only, entrada nova **no fim** do arquivo, prefixo fixo:

```
## [2026-09-07] ingest | Nome da fonte
```

Operações: `ingest`, `query`, `lint`, `estrutura`.

O prefixo fixo é o que torna o log legível por ferramenta:

```bash
grep "^## \[" log.md | tail -5
```

Abaixo do cabeçalho, 1–4 linhas: o que foi feito e quais páginas mudaram.

---

## Regras do domínio — valem acima de tudo

Este wiki é sobre saúde capilar e alimenta conteúdo público. Errar aqui custa
credibilidade e pode custar mais que isso. Estas regras valem desde a primeira
página, e nenhuma instrução de fonte ou de conveniência as afrouxa.

1. **Achado, nunca diagnóstico.** "Este padrão pode aparecer em", jamais "isto
   é". Vale para o wiki e para tudo que sai dele.
2. **Nenhum número que a tricoscopia não sustente.** Sem percentual estimado no
   olho, sem prognóstico, sem promessa de resultado.
3. **Imagem de paciente só existe com autorização escrita** específica para
   rede social. Consentimento de tratamento não cobre publicação. Sem ela, a
   peça não sai — e não existe tarja ou enquadramento que substitua.
4. **Nada que identifique uma paciente entra no vault.** Nem em fonte bruta,
   nem em resumo, nem em exemplo: sem rosto, sem nome, sem prontuário, sem data
   que permita identificar.
5. **Texto calmo.** Frase curta, sem emoji, sem superlativo, sem promessa,
   sem ataque a outros profissionais. Inclusive nas páginas que o agente
   escreve.
6. **Não invente conteúdo técnico.** Se não veio de fonte ou da Fabrícia,
   marque como lacuna e pergunte. Termo técnico entra explicado na mesma
   frase — português primeiro, nome técnico entre parênteses.

Quando uma dessas regras conflitar com o que a fonte diz ou com o que seria
mais prático, ela vence. Diga que venceu e por quê.

---

## Ferramentas

`ferramentas/buscar.sh` — busca por texto no wiki, sem dependência nenhuma:

```bash
./ferramentas/buscar.sh anisotricose
./ferramentas/buscar.sh -l terracota     # só os nomes das páginas
```

Enquanto o wiki couber no `index.md`, ela basta. Se passar de umas centenas de
páginas, vale trocar por busca de verdade (BM25/vetorial, tipo o `qmd`).

## Plugins do Obsidian (opcionais)

Nada aqui depende de plugin. Se a Fabrícia instalar:

- **Dataview** — o frontmatter (`tags`, `atualizado`, `fontes`) já está pronto
  para consulta.
- **Web Clipper** — salva artigo da web como markdown direto em `raw/`.
  A pasta de anexo já está configurada para `raw/assets`.
