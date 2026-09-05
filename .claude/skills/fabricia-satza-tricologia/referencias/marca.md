# Identidade — Fabrícia Satza Tricologia

## Cabeçalho: a assinatura da marca

Todo slide, sem exceção, carrega dois rótulos nos cantos de cima:

```
FABRÍCIA SATZA TRICOLOGIA                              QUEDA CAPILAR
```

Caixa alta, 22px, tracking `.30em`, cor suave. O da direita (`{{EIXO}}`) muda
conforme o tema: `Queda capilar`, `Alopecia`, `Tricoscopia`, `Saúde capilar`.
O da esquerda nunca muda.

É este par que faz seis imagens soltas lerem como um carrossel só, e o que
identifica a peça quando ela é printada e recompartilhada sem o perfil junto.

## Cor

Paleta oficial da marca, oito cores. O que mantém a unidade não é a lista — é
o **papel** de cada uma. Usadas soltas, oito cores viram ruído.

```
Vinho ameixa profundo   #4A2634
Marfim quente           #F4EFE8
Taupe / nude            #A99B91
Café profundo           #28201F
Champagne               #C9B39B
Branco suave            #FCFAF7
Terracota suave         #B06F53
Marrom terracota        #8A5A44
```

### Papéis

| Cor | Papel |
|---|---|
| **Branco suave** `#FCFAF7` | fundo padrão |
| **Marfim quente** `#F4EFE8` | fundo alternado, dá ritmo sem cor nova |
| **Café profundo** `#28201F` | texto sobre claro **e** fundo escuro neutro |
| **Vinho ameixa** `#4A2634` | fundo escuro de assinatura, o mais marcante |
| **Marrom terracota** `#8A5A44` | números, rótulos, palavra destacada em texto |
| **Terracota suave** `#B06F53` | destaque em corpo grande, bolinha do passo em foco |
| **Taupe** `#A99B91` | fio de 1px sobre fundo claro |
| **Champagne** `#C9B39B` | acento e fio sobre fundo escuro |

### Contraste — a parte que decide o uso

Medido contra cada fundo (mínimo 4,5:1 para texto corrido, 3,0:1 para corpo
grande a partir de 45px):

| Cor | sobre claro | sobre café | sobre vinho |
|---|---|---|---|
| Café profundo | **15,3** | — | — |
| Vinho ameixa | **12,5** | — | — |
| Marrom terracota | **5,6** | 2,8 | 2,2 |
| Terracota suave | 3,8 ⚠ | 4,0 ⚠ | 3,2 ⚠ |
| Taupe | 2,6 ✗ | **5,9** | **4,8** |
| Champagne | 1,9 ✗ | **7,9** | **6,4** |
| Branco suave | — | **15,3** | **12,5** |

Duas leituras dessa tabela mudam como a paleta se usa:

1. **Taupe e champagne se invertem conforme o fundo.** Sobre fundo claro são pálidos
   demais para qualquer texto — servem só como fio e superfície. Sobre café ou
   vinho ficam ótimos e viram o acento. É contraintuitivo, e foi o que quebrou
   a primeira versão deste CSS: números e rótulos estavam em taupe sobre claro,
   a 2,6:1, praticamente invisíveis depois da recompressão do Instagram.
2. **Terracota precisa de corpo.** A 3,8:1 ele só aguenta 45px pra cima. Dentro
   de texto corrido use o **marrom terracota**, que chega a 5,6:1.

### Regras

### As três superfícies de cor

| Classe | Cor | Papel |
|---|---|---|
| `.escuro` | vinho ameixa `#4A2634` | a virada — a frase que tem de ficar |
| `.terra` | marrom terracota `#8A5A44` | respiro quente no meio, não é virada |
| `.cafe` | café profundo `#28201F` | alternativa mais sóbria à virada |

**Uma virada por carrossel.** `.escuro` ou `.cafe`, nunca as duas: seriam duas
viradas, e aí nenhuma é virada.

**`.terra` e `.escuro` nunca adjacentes.** O contraste entre vinho e terracota
é de apenas 2,2:1 — dois slides seguidos nessas cores leem como erro de
arquivo, não como decisão. Deixe pelo menos dois slides claros entre eles.
Um arranjo que funciona em 8 slides: `terra` no 4, virada no 7.

**O `.terra` é pausa, não conclusão.** Ele quebra a sequência clara no meio do
carrossel e devolve calor. A frase de fecho continua sendo da virada — se o
terracota carregar a conclusão, a virada chega sem função.

**Sobre terracota o acento é marfim, não champagne.** Champagne ali cai para
2,9:1. Só branco suave (5,6:1) e marfim (5,1:1) funcionam como texto sobre
essa superfície. O CSS já resolve isso por classe.

**Nenhum acento em área preenchida.** Taupe, champagne e terracota entram como
fio de 1px, número, bolinha ou palavra. No momento em que viram bloco de cor
ou botão, a peça deixa de parecer da marca.

**Ritmo de fundo:** alterne branco suave e marfim em blocos, não a cada slide.

## Tipografia

Família única, **Fabrícia Satza**, derivada da Jost* sob SIL OFL 1.1.

| Face | Peso | `a` | Uso |
|---|---|---|---|
| `Fabricia Satza` | 300 | dois andares | texto corrido, rótulos |
| `Fabricia Satza` | 500 | dois andares | ênfase (`<b>`) |
| `Fabricia Satza Alt` | 300 | um andar | títulos, display |

As três estão embutidas em base64 nos templates — o arquivo abre em qualquer
máquina, offline, sem instalar nada. Os `.ttf` para instalar (Canva, Word,
Illustrator) ficam em `fonte-fabricia-satza-light/` na raiz do repositório.

### Escala (peça 1080×1350)

```
display        116px   line-height 1.04    gancho da capa
título          88px   line-height 1.10    abertura de slide
subtítulo       52px   line-height 1.34    apoio do gancho
texto           45px   line-height 1.44    corpo e itens
texto pequeno   37px   line-height 1.48    nota, ressalva, fonte
rótulo          24px   tracking .30em      CAIXA ALTA
cabeçalho       22px   tracking .30em      CAIXA ALTA
```

**A fonte é Light — ela vive do espaço em volta.** Nada abaixo de 30px em peça
de 1080px de largura, nada com `line-height` abaixo de 1.3 em texto corrido.
Apertar mata o efeito e faz a peça parecer amadora.

### Ênfase sem engrossar

O problema: negrito real deixaria a letra grosseira e mataria a leveza que é a
identidade. A solução tem dois níveis, e eles não se misturam no mesmo slide:

1. **`<b>` → peso 500.** Um passo acima do 300, dois abaixo do negrito. Dá peso
   à palavra sem mudar o desenho. É o recurso principal.
2. **Cor.** Texto em `--tinta-suave` ao lado de texto em `--tinta` cria
   hierarquia sem tocar no peso. É o que o bloco comparativo usa: a coluna
   fraca apaga, o olho vai para a forte sozinho.

Nunca aplique negrito sintético (`font-weight:700` sem a face correspondente) —
o navegador engorda a forma artificialmente e destrói a letra.

## Grade

```
peça          1080 × 1350 (4:5)
margem lateral        80px
conteúdo         170px do topo, 160px da base
cabeçalho         64px do topo
rodapé            64px da base
```

O respiro largo não é desperdício — é o que separa esta marca de um panfleto.
Quando faltar espaço, **corte texto**, não margem.

## A caixa branca sobre foto

`<span class="caixa">` põe um fundo branco suave atrás do texto, uma caixa por linha
(via `box-decoration-break: clone`), então a mancha acompanha o texto em vez de
virar um retângulo cego sobre a foto.

Use quando a imagem é agitada. Quando a foto tem área limpa de verdade, texto
branco direto fica melhor — a caixa é solução, não enfeite.

## O quadro

Duas cantoneiras em L que se cruzam, deixando dois cantos abertos. A moldura
retangular fechada é o lugar-comum do nicho; a aberta respira e é nossa.

Texto entra pelo canto de cima (56px, caixa normal) e conclui pelo de baixo,
alinhado à direita, em caixa alta. A variante `.fechado` fecha o retângulo —
use com parcimônia, e nunca duas vezes no mesmo carrossel.

## Exportação

Os templates exportam PNG 2160×2700 (`scale: 2`) num ZIP, via html2canvas.

O botão espera `document.fonts.ready` antes de renderizar. Sem isso o
html2canvas mede o texto com a fonte de fallback e o layout sai deslocado — foi
um bug real, não remova a espera.

## Licença da fonte

Derivada da **Jost\*** (indestructible type\*) sob **SIL OFL 1.1**. Uso
comercial liberado, inclusive para clientes. A única obrigação é distribuir o
`OFL.txt` junto **quando entregar o arquivo da fonte** para alguém. Publicar
posts e vídeos feitos com ela não exige nada.
