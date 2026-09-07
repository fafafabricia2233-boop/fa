# Schema do wiki — Fabrícia Satza · Tricologia

Este arquivo diz ao agente **como operar este vault**. Ele é a configuração do
padrão *LLM Wiki*: eu (Fabrícia) curo as fontes e faço as perguntas; o agente
escreve e mantém o wiki inteiro.

Leia este arquivo antes de qualquer operação.

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

## Estrutura do wiki

```
wiki/
  00 Início.md      porta de entrada curada
  01 Marca/         identidade, fonte, cor, tipografia, tom
  02 Formatos/      carrossel, frase, antes/depois, tricoscopia
  03 Técnica/       achados, regras, protocolo de foto
  04 Registro/      decisões tomadas e o que já foi publicado
  05 Ideias/        banco de temas e frases
  06 Fontes/        uma página de resumo por fonte ingerida
```

`06 Fontes/` é criada na primeira ingestão. Cada fonte de `raw/` ganha ali uma
página de resumo — a fonte bruta fica intacta, o resumo é do agente.

Uma pasta nova só nasce quando **três ou mais** páginas pedem por ela. Antes
disso, a página vai na pasta existente mais próxima.

---

## Convenções de página

**Frontmatter em toda página do wiki:**

```yaml
---
tags: [marca, cor]
atualizado: 2026-09-07
fontes: 0
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
`[[Antes e depois\|antes e depois]]`. Toda página precisa de pelo menos **um
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
3. **Crie a página de resumo** em `wiki/06 Fontes/`, com: o que é a fonte, de
   onde veio, data, os achados principais, e o que ela muda no wiki.
4. **Integre nas páginas existentes.** Este é o passo que faz o padrão valer:
   não basta arquivar o resumo. Atualize as páginas de conceito que a fonte
   toca, reforce ou contradiga o que já estava escrito, crie os links novos nos
   dois sentidos. Uma fonte boa mexe em várias páginas.
5. **Contradição não se apaga.** Se a fonte nova contradiz o que está escrito,
   registre as duas versões e o que as separa — e leve para `04 Registro/
   Decisões tomadas.md` se for uma escolha, não um fato.
6. **Atualize** `index.md` e o `fontes:` das páginas tocadas.
7. **Anexe ao `log.md`.**

## Operação: QUERY

Quando a Fabrícia fizer uma pergunta ao wiki:

1. **Leia o `index.md` primeiro**, depois abra só as páginas relevantes. Não
   varra o vault inteiro por padrão.
2. Responda **com citação de página** — `[[Paleta e contraste]] diz que...`.
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
credibilidade e pode custar mais que isso.

1. **Achado, nunca diagnóstico.** "Este padrão pode aparecer em", jamais "isto
   é". Vale para o wiki e para tudo que sai dele. Ver
   `wiki/03 Técnica/Tricoscopia — achados.md`.
2. **Nenhum número que a tricoscopia não sustente.** Sem percentual estimado no
   olho, sem prognóstico.
3. **Imagem de paciente só existe com autorização escrita** específica para
   rede social. Sem ela, a peça não sai — ver
   `wiki/03 Técnica/Regras de antes e depois.md`.
4. **Nada que identifique uma paciente entra no wiki.** Nem em fonte bruta, nem
   em resumo, nem em exemplo.
5. **O texto segue `wiki/01 Marca/Tom de voz.md`** — frase curta, sem emoji,
   sem superlativo, sem promessa. Inclusive as páginas que o agente escreve.
6. **Não invente conteúdo técnico.** Se não veio de fonte ou da Fabrícia,
   marque como lacuna e pergunte.

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
