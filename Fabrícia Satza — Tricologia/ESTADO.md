---
tags: [meta]
atualizado: 2026-09-14
---
# Estado do projeto

**Documento de retomada.** Se você é um agente começando ou voltando de uma
compactação de contexto: leia isto antes de agir. Ele existe para você
recuperar o raciocínio sem depender do histórico da conversa.

Mantenha-o atualizado. Decisão tomada, problema descoberto ou pendência
resolvida entram aqui no mesmo passo em que acontecem.

---

## O projeto em três linhas

Cofre do Obsidian da marca pessoal **Fabrícia Satza · Tricologia Capilar**
(`@fabriciasatza`), operado no padrão *LLM Wiki* do gist do Karpathy: a Fabrícia
cura as fontes, o agente escreve e mantém o wiki. A marca vende **diagnóstico,
não tratamento** — é o eixo de tudo que se escreve.

## Onde cada coisa vive

| O quê | Onde |
|---|---|
| Vault | `Fabrícia Satza — Tricologia/`, subpasta do repo `fafafabricia2233-boop/fa` |
| Branch de trabalho | `claude/obsidian-salve-0uxb8m` |
| PR | #2, aberto, base `claude/install-find-skills-ZbXWA` |
| Obsidian da Fabrícia | computador dela — **sem ligação automática com o repo** |

## O problema central: transporte

O agente roda num container na nuvem. O Obsidian roda na máquina dela. **Não há
sincronia.** Arquivo escrito e commitado continua invisível para ela até alguém
transportar.

Isso já custou uma sessão inteira: cinco commits prontos, PR aberto, e a tela
dela vazia. Ela cobrou, com razão.

**O protocolo que resolveu:** toda alteração no vault termina com o zip
entregue pelo `SendUserFile`, sem ela pedir. Está escrito no `CLAUDE.md` da raiz
do repositório e na seção *Protocolo de entrega* do `CLAUDE.md` deste vault.

A solução definitiva, que elimina o transporte, é ela rodar o Claude Code no
próprio computador, aberto na pasta do vault. Já foi explicado; ela ainda não
instalou.

## Estado atual do cofre

19 páginas no wiki, 1 fonte ingerida.

```
CLAUDE.md · ESTADO.md · index.md · log.md · README.md
raw/Manual da marca — 2026-09-07/     19 arquivos originais, imutáveis
wiki/
  00 Início
  Marca/      6 páginas
  Formatos/   5 páginas
  Técnica/    3 páginas
  Fontes/     Manual da marca — setembro 2026
  soltas:     Decisões tomadas · Publicações · Banco de ideias
ferramentas/buscar.sh
.obsidian/app.json
```

## O que foi decidido nesta sessão, e por quê

| Decisão | Motivo |
|---|---|
| Vault virou subpasta com três camadas | instanciar o padrão do gist: `raw/` imutável, `wiki/` do agente, `CLAUDE.md` como schema |
| 51 links laterais entre as páginas | o grafo era uma estrela: 5 de 19 páginas tinham link de saída |
| Sem taxonomia pré-montada | pasta criada antes de ter conteúdo vira gaveta vazia. Regra: **uma pasta nasce a partir de três páginas** |
| Marca, Formatos e Técnica têm pasta; Decisões, Publicações e Banco de ideias não | aplicação literal da regra acima — 6, 5 e 3 páginas contra 1 e 1 e 1 |
| O manual da marca entrou como **fonte**, não como restauração | ela mandou o zip de volta depois de zerar; tratar como fonte é o que faz o padrão valer |
| Páginas do wiki vieram do histórico (`1a112a4`), não do zip | o zip é anterior aos 51 links; restaurar dele perderia esse trabalho |
| Cada página tem rodapé `Fonte: [[...]]` | faz a fonte virar hub no grafo — 18 links de entrada |

## Pendências

**Bloqueantes de verdade**

- [ ] **POP confidencial no histórico de repositório público.** O
      `POP Manual Operacional — New Hair.md` foi apagado em `697a060`, mas
      continua acessível no histórico, e o repo é público. Some de vez só
      reescrevendo o histórico e forçando o push. Já oferecido três vezes, sem
      resposta dela. **Perguntar de novo.**

**Do fluxo**

- [ ] PR #2 não mergeado. Enquanto isso, quem clonar precisa de
      `git checkout claude/obsidian-salve-0uxb8m` — o vault não existe na branch
      padrão
- [ ] Ela ainda não rodou o Claude Code local. Até lá, protocolo de entrega em
      todo turno
- [ ] Hotkey `Ctrl+Shift+D` para "Download attachments" não configurada — eu não
      sei o ID interno do comando e não quis chutar. É `Settings → Hotkeys` na
      mão dela
- [ ] Web Clipper, Dataview e Marp: dependem do app dela, não dá para instalar
      por arquivo

**Do conteúdo** (em [[Publicações]])

- [ ] Autorização escrita da paciente do caso 01
- [ ] Autorização para a imagem de tricoscopia
- [ ] Decidir se a marca menciona o registro do COREN
- [ ] Subir o ajuste de Resolution no app do dermatoscópio

## Armadilhas já encontradas

Coisas que custaram tempo. Não repita.

- **O zip que ela manda pode ser idêntico ao anterior.** Aconteceu: o segundo
  envio tinha o mesmo md5 do primeiro. **Confira o checksum antes** de tratar
  como material novo, e diga a ela o que encontrou.
- **A branch padrão do repo não é `main`**, é `claude/install-find-skills-ZbXWA`.
- **Nome de arquivo com espaço e acento quebra laço de shell.** Use
  `find -print0` com `while IFS= read -r -d ''`. Um `for f in $(find ...)` aqui
  falha em quase todo arquivo.
- **Link dentro de tabela markdown precisa da barra escapada:**
  `[[Página\|texto]]`. Sem a barra invertida a célula quebra.
- **O vault é subpasta do repo.** No Obsidian ela tem que apontar para
  `Fabrícia Satza — Tricologia`, não para a pasta de cima — senão abre cofre
  vazio. Já confundiu.
- **Exemplo de link dentro de crase não vira link** no Obsidian. Útil no schema,
  e o validador de links precisa ignorar blocos de código para não dar falso
  positivo.

## Vocabulário dela

Ela escreve em português, direto e às vezes por voz — o que sai transcrito com
frase quebrada. Interprete a intenção, e pergunte quando duas leituras dariam
trabalhos diferentes. "Salve no meu obsidian" quer dizer entregar o arquivo,
não commitar.

## O que ler em seguida

1. `log.md` — as últimas entradas, com data
2. `CLAUDE.md` deste vault — as três operações e as regras do domínio
3. `wiki/00 Início.md` — o conteúdo em si
