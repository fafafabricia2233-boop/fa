---
name: fabricia-satza-tricologia
description: Cria carrosséis de Instagram, peças de antes/depois, quadros explicativos e vídeos para a marca pessoal da Fabrícia Satza (tricologia e queda capilar, @fabriciasatza). Use SEMPRE que o pedido envolver conteúdo para a Fabrícia Satza — carrossel, POST DE FRASE, post, slide, story, reel, legenda, arte, "faz um conteúdo sobre X", ou quando ela mandar fotos de resultado de paciente (antes e depois) para montar a peça. Use também quando o assunto for explicar algo de tricologia visualmente — alopecia, eflúvio, ciclo do fio, miniaturização, tricoscopia, protocolo, queda capilar. NÃO use para a New Hair, que é outra marca com outra identidade visual.
---

# Fabrícia Satza — Tricologia e queda capilar

Marca **pessoal**. Perfil `@fabriciasatza`. Conteúdo clínico sobre queda
capilar, feito para uma paciente que já tentou de tudo e não foi diagnosticada.

> **Ela atua como terapeuta capilar.** Terapia capilar não é profissão
> regulamentada no Brasil, e é nessa condição que ela trabalha — não como
> técnica de enfermagem, embora tenha o registro no COREN. Portanto o COFEN não
> rege estas peças, **a menos que a peça invoque a credencial de enfermagem**.
> Nesse caso a Resolução 554/2017 passa a valer, e o campo `{{REGISTRO}}`
> (nome, COREN, categoria) precisa ser preenchido. Não misture os dois
> registros na mesma peça. Detalhe em `referencias/antes-depois-regras.md`.

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

Os dois blocos de foto dependem da classe **`sobre-foto`** no `<section>`: é ela
que liga o véu, joga o texto para o rodapé e inverte cabeçalho e rodapé para
claro. Ao trocar a classe de fundo de um slide, **acrescente** — não substitua a
lista inteira, ou o slide perde o véu e o texto sai na cor de fundo claro, cinza
sobre a imagem.
| **Lista** | Até 4 itens. Acima disso vira folheto. |
| **Etapas** | Quando a **ordem** importa: protocolo, investigação, jornada. |
| **Comparativo** | Mito × fato, o que parece × o que é. |
| **Ciclo** | Fases em sequência: anágena/catágena/telógena, linha do tempo. |
| **Definição** | Explicar um termo técnico sem soar aula. |
| **Dado** | Um número só. Dois números no mesmo slide se anulam. |
| **Citação** | Uma fala dela, no formato de post de rede social. Sozinha ou dentro de carrossel. |
| **Virada** | O único slide de cor. **Uma por carrossel** — vinho, terracota ou café. |
| **Chamada** | Sempre o último. |

## Tricoscopia na prática

Série numerada em que ela mostra uma imagem de tricoscopia e lê os achados.
**Leia `referencias/tricoscopia.md` antes de escrever** — ele traz os achados,
os nomes técnicos e, principalmente, o que nunca escrever.

Seis slides, nesta ordem:

| # | Bloco | Conteúdo |
|---|---|---|
| 01 | `TRICO CAPA` | imagem sangrando, título por cima. "Tricoscopia na prática 01 \| tema" |
| 02 | `TRICO PRANCHA` | a imagem grande, achados numerados, legenda embaixo |
| 03 | `QUADRO` | o que mais chamou atenção — **um** achado, não uma lista |
| 04 | `LISTA` | "este padrão pode aparecer em" — duas a quatro possibilidades |
| 05 | `ETAPAS` | "e depois de identificar isso?" — o método e o encaminhamento |
| 06 | `VIRADA` | o fechamento |

Regras próprias da série:

- **A imagem mostra achados, não doença.** Escreva "o que eu observo" e "este
  padrão pode aparecer em", nunca "isto é". O slide 04 sempre no plural: uma
  possibilidade só vira diagnóstico disfarçado.
- **Três a cinco achados marcados.** Acima disso a pessoa para de ler e a
  imagem vira um mapa.
- **Numere os achados na imagem e explique na legenda.** Rótulo escrito em cima
  da tricoscopia cobre justamente o que a pessoa precisa ver.
- **Nome técnico entre parênteses, depois do português.** "Fios de calibres bem
  diferentes (anisotricose)" ensina; "anisotricose" sozinho afasta.
- **Autorização vale igual.** Imagem de tricoscopia parece anônima, mas veio de
  uma pessoa.

## Post de frase

Quando ela pedir um **"post de frase"**, é este formato — e o padrão está
fechado, não se rediscute a cada peça. Um comando entrega tudo:

```bash
python3 scripts/frase.py "a frase dela" posts-de-frase
```

Sai o `.html` e a imagem já exportada, em 3:4 e sem metadados. Para várias de
uma vez, `--arquivo frases.txt` com uma frase por linha.

O padrão fechado:

| | |
|---|---|
| Nome | Fabrícia Satza \| Tricologia Capilar, com o selo de verificado |
| Texto | peso único, **sem negrito** |
| Rodapé | só o arroba, **sem seta** |
| Limite | até 5 linhas |

O avatar e o selo vivem em `assets/avatar.png` e `assets/selo.svg`, então a
frase é a única coisa que muda de uma peça para outra.

O bloco de **citação** é o formato mais rápido de publicar: uma frase que ela
repete no consultório, com foto de perfil, nome e arroba. Lê rápido e não soa
propaganda, porque é uma fala e não um anúncio. Duas regras nele:

- **Até cinco linhas.** Passou disso deixa de parecer fala e vira parágrafo.
  Meça em vez de contar caracteres: `e.offsetHeight / lineHeight` no
  `.citacao-texto` dá o número exato de linhas renderizadas.
- **Com selo de verificado, sem marca de plataforma.** A conta `@fabriciasatza`
  é verificada — ela confirmou —, então o selo entra por padrão no campo
  `{{SELO}}` e não precisa perguntar de novo. Já a interface da plataforma fica
  de fora: imitá-la entrega o post visualmente a ela em vez de à marca. Foto,
  nome, arroba e fala carregam o formato sozinhos.
- **Nada de negrito.** Fala não tem ênfase: marcar palavra ali denuncia que a
  frase foi montada para convencer, e o formato perde a naturalidade que o faz
  funcionar. O CSS anula qualquer `<b>` que escape para dentro do bloco.

O avatar sai de uma foto dela recortada em círculo. Gere em 320px: ele aparece
a 106px na peça, então 320 cobre o export em 2x com folga. Em 512px o arquivo
pesava 509 KB sozinho, mais que o dobro do necessário.

Os quatro do meio — etapas, comparativo, ciclo, definição — são os "quadros
explicativos". Use-os quando o conteúdo **ensina**. Um carrossel que ensina
carrega no máximo dois deles; três seguidos viram apostila e a pessoa sai.

## Como montar um antes e depois

**Leia `referencias/antes-depois-regras.md` antes de qualquer coisa.** Três
conjuntos de regra incidem sobre esta peça — Instagram orgânico, anúncio pago e
o conselho profissional dela — e eles não são o mesmo. A lista de verificação
de onze itens no fim daquele arquivo é obrigatória; falhou em um, a peça não
sai.

Três coisas travam a entrega e precisam ser resolvidas com ela, não por você:

1. **Autorização escrita da paciente**, específica para rede social.
   Consentimento de tratamento não cobre publicação de imagem. Sem isso não há
   enquadramento nem tarja que resolva.
2. **A regra do conselho dela.** Muda conforme o registro; alguns proíbem antes
   e depois por completo. Levante a questão na primeira vez.
3. **Fotos em mesma luz, ângulo e repartição** — ver
   `referencias/protocolo-de-foto.md`, que traz o protocolo de captação e as
   duas correções legítimas para quando o par não bate. Sem isso a peça não prova nada
   e qualquer pessoa percebe. Se as fotos não baterem, diga a ela em vez de
   disfarçar no tratamento da imagem.

Resolvido isso:

4. **Olhe as duas fotos e ache a região que mudou.** É o trabalho principal. Se
   marcar o lugar errado, a peça fica pior que sem marcador nenhum.
5. Copie `assets/antes-depois.html`, aponte `{{FOTO_ANTES}}` e `{{FOTO_DEPOIS}}`.
6. Posicione os anéis com `--x` e `--y`, em **% da metade** (não da peça
   inteira): `--x:50%` é o centro daquele lado.
7. **O anel do DEPOIS fica na MESMA coordenada do ANTES.** É a coordenada
   repetida que faz o olho comparar. Se cada lado marca um ponto diferente, a
   pessoa só vê duas fotos.
8. Nomeie o achado, nunca julgue a pessoa: `Rarefação central`, `Risca
   alargada` no antes; `Preenchimento`, `Risca estreita` no depois. Duas ou
   três palavras.
9. Dois marcadores por lado bastam. Três viram poluição.
10. **Não remova a ressalva nem o slide do que foi feito.** A ressalva vai na
    imagem porque a legenda é cortada no "... mais" e o print circula sem ela.
    O slide de conduta é o que tira a peça do registro de propaganda e coloca
    no de relato clínico.

A correção de temperatura, quando usada, tem de ser **igual nos dois lados**.
Tratamento diferente em cada lado altera o resultado aparente, e isso é o que
transforma um relato em alegação enganosa.

## Formato da peça## Formato da peça

O padrão dela é **3:4, 1080×1440**. Monte nele salvo pedido em contrário. Para
trocar, mexa só nos dois tokens no topo do `base.css`:

```css
--peca-larg:1080px;  --peca-alt:1440px;   /* 3:4  padrão dela */
--peca-larg:1080px;  --peca-alt:1350px;   /* 4:5  preset de carrossel */
--peca-larg:1080px;  --peca-alt:1080px;   /* 1:1  quadrado */
```

Os presets do Instagram para carrossel são **4:5, 1:1 e 1.91:1**. O 3:4
(1080×1440) nasceu para post de feed avulso, casando com o corte da grade. O
4:3 em paisagem (1440×1080) não é preset, mas cai dentro da faixa aceita e
posta sem corte — só ocupa bem menos tela no feed, o que costuma custar
alcance. Se ela pedir, faça; o custo é dela conhecer.

**Paisagem não é troca de parâmetro, é outro layout.** A altura cai para 1080px
e a largura sobe para 1440, então:

- A escala inteira desce cerca de 25% (display 88, título 66, corpo 36).
- O texto passa a viver numa coluna de ~64% da largura. Sem isso a linha
  atravessa 1260px e chega a ~70 caracteres, o que cansa de ler e desmancha o
  ar editorial. O vazio ao lado é proposital.
- `.corpo.topo` precisa centralizar. Ancorar no topo faz sentido no retrato,
  onde o conteúdo alto encosta em cima; em paisagem sobra altura e a metade de
  baixo fica vazia.
- Recuos escritos direto no slide (`style="padding-top:200px"`) foram
  calculados para 1350px de altura e precisam sair.

Ao trocar de formato, duas coisas precisam acompanhar:

1. **Recorte as fotos na nova proporção a partir do original.** Deixar o
   `object-fit:cover` apertar uma imagem já cortada em outra proporção joga
   fora resolução e desloca o enquadramento.
2. **A altura extra vira respiro, não texto maior.** Suba o `padding` do
   `.corpo` na mesma medida. Aumentar o corpo do texto para "preencher" acaba
   com a leveza que sustenta a marca.

## Entregar os slides

O botão **Baixar ZIP** do template serve para quem abre no computador. **No
celular ele não resolve** — o navegador não descompacta o ZIP e acaba salvando
a peça inteira como um PDF único, e o Instagram precisa de um arquivo por
slide. Quando ela for postar pelo telefone, exporte as imagens separadas:

```bash
python3 scripts/exportar.py carrossel-tema.html slides-tema
```

Sai um arquivo por slide em 2160×2700, numerado na ordem de publicação. JPEG
de qualidade 95, porque em slide com foto o PNG passa de 4 MB e trava o envio
pelo celular — a 95 a diferença visual é nula. Use `--png` só para impressão.

Mande os arquivos com o `SendUserFile`, todos numa chamada, para ela salvar um
a um no rolo da câmera.

**Nenhuma imagem sai com metadado.** O `exportar.py` limpa antes de entregar —
some todo EXIF, XMP, perfil de cor, IPTC e comentário; no PNG, os blocos de
texto e de tempo. A limpeza é feita cortando os marcadores byte a byte, sem
reencodar, para não gastar uma geração de qualidade. Se algum dia você gerar
imagem por outro caminho, passe pela mesma função antes de entregar: peça que
publica em nome dela não deve carregar rastro de ferramenta nenhuma.

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
- Cabeçalho e rodapé cinza-escuro sobre foto (sinal de que `sobre-foto` caiu)
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

Fundo claro (branco suave, com marfim alternando) e **um único slide de cor por
carrossel**: a virada. Ela tem três cores possíveis:

| Classe | Cor | Caráter |
|---|---|---|
| `escuro` | vinho ameixa `#4A2634` | marcante, o mais assinatura |
| `terra` | marrom terracota `#8A5A44` | quente, mais próximo |
| `cafe` | café profundo `#28201F` | sóbrio, o mais clínico |

**A variação acontece entre publicações, não dentro de uma.** Este post sai em
vinho, o próximo em terracota, o outro em café. O feed ganha ritmo e cada
carrossel continua coerente consigo mesmo. Escolha a cor pelo caráter do tema:
vinho no conteúdo que quer marcar, terracota no acolhedor, café no técnico.

Antes de montar, **veja qual cor foi a última publicada** e use outra.

Duas regras fecham a marca:

1. **Uma cor por carrossel.** Duas seriam duas viradas, e aí nenhuma é virada.
   Vinho e terracota ainda têm só 2,2:1 entre si — juntos leriam como erro de
   arquivo, não como escolha.
2. **Nenhum acento em área preenchida.** Taupe, champagne e terracota suave
   entram como fio de 1px, número, bolinha ou palavra destacada.

O acento troca sozinho conforme a superfície: champagne sobre vinho e café
(6,4:1 e 7,9:1), **marfim** sobre terracota — ali o champagne cairia para
2,9:1. Dentro de texto sobre fundo claro o destaque é o marrom terracota
(5,6:1); o terracota suave só aguenta 45px pra cima.

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
