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

```
--creme         #FDFCF8   fundo padrão
--creme-quente  #F7F4EC   fundo alternado, para dar ritmo entre slides
--tinta         #23272F   texto (azul-petróleo tão escuro que lê como preto)
--tinta-suave   rgba(35,39,47,.58)   secundário, rótulos, notas
--taupe         #B9A492   único acento
```

Amostradas dos posters originais da marca, não escolhidas do zero.

**Taupe:** fio de 1px, número de lista, bolinha de etapa, uma palavra em
`<em>`. Nunca área preenchida. Esta é a regra que mais rápido quebra a marca.

**Fundo escuro** (`--tinta`): só o slide de virada, no máximo um por carrossel.
Ele existe para marcar a frase que você quer que a pessoa lembre — se aparecer
três vezes, não marca nada.

**Ritmo de fundo:** alternar creme e creme-quente entre slides dá respiração
sem introduzir cor nova. Não alterne a cada slide; use em blocos.

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

## A caixa creme sobre foto

`<span class="caixa">` põe um fundo creme atrás do texto, uma caixa por linha
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
