---
name: fabricia-satza-tricologia
description: Cria carrosséis de Instagram, peças de antes/depois, quadros explicativos e vídeos para a marca pessoal da Fabrícia Satza (tricologia e queda capilar, @fabriciasatza). Use SEMPRE que o pedido envolver conteúdo para a Fabrícia Satza — carrossel, post, slide, story, reel, legenda, arte, "faz um conteúdo sobre X", ou quando ela mandar fotos de resultado de paciente (antes e depois) para montar a peça. Use também quando o assunto for explicar algo de tricologia visualmente — alopecia, eflúvio, ciclo do fio, miniaturização, tricoscopia, protocolo, queda capilar. NÃO use para a New Hair, que é outra marca com outra identidade visual.
---

# Fabrícia Satza — Tricologia e queda capilar

Marca **pessoal**. Perfil `@fabriciasatza`. Conteúdo clínico sobre queda
capilar, feito para uma paciente que já tentou de tudo e não foi diagnosticada.

> **Isto não é a New Hair.** A New Hair (`@newhair_fue`) vive no mesmo
> repositório, com fundo escuro, dourado e Montserrat. São marcas separadas e
> nunca compartilham arquivo, cor ou template. Se uma peça da Fabrícia pode ser
> confundida com uma da New Hair, ela está errada.

## O que existe aqui

| Arquivo | Para quê |
|---|---|
| `assets/carrossel.html` | 12 blocos de slide prontos. Copie, monte, exporte ZIP. |
| `assets/antes-depois.html` | Peça de resultado com marcadores de região. |
| `referencias/marca.md` | Identidade completa: cor, escala, regras. **Leia antes de inventar layout novo.** |
| `referencias/tom.md` | Como escrever. Leia antes de redigir o texto dos slides. |
| `scripts/montar.py` | Regera os HTML quando o CSS-fonte muda. |

Os `.html` são **gerados**. Para mudar o visual, edite `scripts/base.css`,
`scripts/blocos.css` ou os `scripts/corpo-*.html` e rode `python3 montar.py`.
Editar o `.html` de `assets/` direto funciona para uma peça, mas some na
próxima geração.

## Como montar um carrossel

1. **Leia `referencias/tom.md`** e escreva o texto primeiro, fora do template.
   Layout bonito não salva texto fraco, e escrever dentro do HTML empurra você
   a encher o slide só porque tem espaço sobrando.
2. Copie `assets/carrossel.html` para a raiz do projeto com um nome do tema
   (`carrossel-eflúvio-telógeno.html`).
3. Escolha os blocos. O arquivo traz 12; **um carrossel usa 6 a 8**. Apague os
   que não servem, duplique os que servem, reordene à vontade — a ordem no
   arquivo é a ordem no ZIP.
4. Troque os `{{PLACEHOLDERS}}`. `{{EIXO}}` é o rótulo do canto superior
   direito: `Queda capilar` no geral, ou o subtema (`Alopecia`, `Tricoscopia`).
5. Renderize e **olhe** antes de entregar (veja *Conferir* abaixo).

### Os blocos

| Bloco | Quando usa |
|---|---|
| **Capa** | Sempre o primeiro. Só o gancho. |
| **Quadro** | A frase que a pessoa printa. Entra em cima, conclui em caixa alta embaixo. |
| **Foto com caixa** | Texto sobre foto qualquer. A caixa em branco suave garante leitura. |
| **Foto sem caixa** | Só quando a imagem tem área limpa de verdade. |
| **Lista** | Até 4 itens. Acima disso vira folheto. |
| **Etapas** | Quando a **ordem** importa: protocolo, investigação, jornada. |
| **Comparativo** | Mito × fato, o que parece × o que é. |
| **Ciclo** | Fases em sequência: anágena/catágena/telógena, linha do tempo. |
| **Definição** | Explicar um termo técnico sem soar aula. |
| **Dado** | Um número só. Dois números no mesmo slide se anulam. |
| **Virada** | Fundo escuro. **No máximo um por carrossel**, senão perde a força. |
| **Chamada** | Sempre o último. |

Os quatro do meio — etapas, comparativo, ciclo, definição — são os "quadros
explicativos". Use-os quando o conteúdo **ensina**. Um carrossel que ensina
carrega no máximo dois deles; três seguidos viram apostila e a pessoa sai.

## Como montar um antes e depois

Quando ela mandar fotos de resultado:

1. **Olhe as duas fotos e ache a região que mudou.** É o trabalho principal.
   Se marcar o lugar errado, a peça fica pior que sem marcador nenhum.
2. Copie `assets/antes-depois.html`, aponte `{{FOTO_ANTES}}` e `{{FOTO_DEPOIS}}`
   para os arquivos.
3. Posicione os anéis com `--x` e `--y`, em **% da metade** (não da peça
   inteira): `--x:50%` é o centro daquele lado.
4. **A regra que faz a peça funcionar: o anel do DEPOIS fica na MESMA
   coordenada do ANTES.** É a coordenada repetida que faz o olho comparar. Se
   cada lado marca um ponto diferente, a pessoa só vê duas fotos.
5. Nomeie: no antes a perda (`Rarefação central`, `Risca alargada`), no depois
   o ganho (`Preenchimento`, `Risca estreita`). Duas ou três palavras — o
   rótulo é uma etiqueta, não uma frase.
6. Dois marcadores por lado bastam. Três já viram poluição.
7. Mantenha o slide **"O que foi feito"**. É ele que separa resultado clínico
   de propaganda: mostra diagnóstico, conduta e tempo.

Antes de publicar, confira se as duas fotos têm **mesma luz, mesmo ângulo e
mesma repartição** — sem isso o antes/depois não prova nada e qualquer pessoa
percebe. Se não tiverem, diga isso a ela em vez de disfarçar no tratamento da
imagem.

Peça de resultado tem regra de conselho profissional, e ela varia conforme o
registro (CFM, CFBM, CRBM). Vale ela confirmar o que o conselho dela permite
antes de publicar antes/depois — isso é decisão dela, não sua, mas levantar a
questão uma vez é útil.

## Conferir antes de entregar

Renderize e **olhe as imagens**. Boa parte dos defeitos só aparece renderizado:

```bash
python3 scripts/previa.py <arquivo.html> <saida.png>
```

O que olhar:

- Texto vazando o slide ou encostando na borda
- Gancho da capa quebrando em linha feia (cabe em ~3 linhas de 18 caracteres —
  se não cabe, o texto é que está longo, encurte em vez de diminuir a fonte)
- Fios de 1px que sumiram
- Marcador do antes/depois fora do lugar
- `{{PLACEHOLDER}}` esquecido

## Tipografia — o essencial

Uma família só: **Fabrícia Satza**, em dois pesos.

- **Ênfase é peso 500, via `<b>`**, não negrito de verdade. O salto de 300 para
  500 dá peso à palavra sem engrossar a letra. Nunca aplique negrito sintético
  (o navegador engorda a forma e destrói o desenho da fonte).
- **Destaque em taupe é `<em>`.** Uma palavra por slide, no máximo.
- Títulos usam `Fabricia Satza Alt` (o `a` de um andar); texto corrido usa
  `Fabricia Satza` (o `a` de dois andares). O CSS já faz isso — não troque.

## Cor — o essencial

```
branco suave #FCFAF7 · marfim quente #F4EFE8 · café profundo #28201F
vinho ameixa #4A2634 · marrom terracota #8A5A44 · terracota suave #B06F53
taupe #A99B91 · champagne #C9B39B
```

Duas regras carregam a marca:

1. **Nenhum acento em área preenchida.** Taupe, champagne e terracota entram
   como fio de 1px, número, bolinha ou palavra destacada. Viraram bloco de cor
   ou botão, a peça deixou de ser da marca.
2. **Taupe e champagne se invertem conforme o fundo.** Sobre claro são pálidos
   demais para texto (2,6:1 e 1,9:1) e só valem como fio. Sobre escuro ficam
   ótimos (5,9:1 e 7,9:1) e viram o acento. Dentro de texto sobre fundo claro,
   o destaque é o **marrom terracota** (5,6:1) — o terracota claro só aguenta
   45px pra cima.

Um fundo escuro por carrossel (café **ou** vinho), nunca os dois: seriam duas
viradas, e aí nenhuma é virada.

Tabela de contraste completa em `referencias/marca.md`.

## Vídeo (Remotion)

O projeto em `projeto-remotion/` já carrega a fonte e os tokens:

```tsx
import { loadFabriciaTitulo, loadFabriciaTexto } from "../lib/fabriciaFonts";
import { CORES, ESCALA } from "../lib/fabriciaMarca";
```

Em reel 1080×1920 a fonte Light pede corpo maior: legenda mínima 44px, não 30px.

## Não copiar referência

Ela manda prints de perfis que gosta. Use-os para entender **a ideia** — um
quadro, uma caixa branca, um marcador — e então resolva do seu jeito dentro
desta identidade. Exemplo do que já foi feito: a referência tinha moldura
retangular fechada; aqui virou duas cantoneiras em L que se cruzam e deixam
dois cantos abertos. Mesma função, desenho próprio. Nunca reproduza o layout
de outro perfil traço a traço — o objetivo dela é ter marca, não parecer com
alguém.
