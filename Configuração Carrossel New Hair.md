# New Hair FUE — Configuração Completa do Carrossel

> Padrão implementado em `Carrossel Template Base.html`. Qualquer peça nova nasce
> copiando esse arquivo e preenchendo os placeholders `{{...}}` — não se reescreve
> cor, fonte ou espaçamento por conta própria.

## Formato

- Slide: 1080 x 1350 px
- Fundo dos slides de texto: `#0A0A0A`
- Fundo do slide CTA: degradê 155° — `#0A0A0A` → `#0F1F50` (60%) → `#0A0A0A`

## Cores

| Nome | Hex | Uso |
|---|---|---|
| Dourado | `#C9A24A` | destaques, ícones, filetes, bordas |
| Marinho | `#0B2436` | fundo e sombra |
| Off-white | `#F7F3EA` | texto |
| Preto | `#0A0A0A` | fundo |

## Fontes

- **Título da capa:** Catchy Mager · 900 · itálico
- **Todo o resto:** Montserrat · 300 (corpo) / 500 (destaque)
- **Impacto:** Cormorant Garamond · 500 (reservada — utilitário `.impacto`, não usada por padrão em nenhum slide)

## Slide 1 — Capa

- Imagem de fundo cobrindo o slide inteiro
- Vinheta por cima (degradê vertical): preto 70% no topo → 15% aos 40% → 30% aos 70% → 90% na base
- **Tag "NEW HAIR FUE":** topo 60px · esquerda 72px · Montserrat 500 · 28px · dourado · caixa alta · espaçamento 0.16em
- **Bloco do título:** topo 120px · margens laterais 72px
- **Título:** Catchy Mager 900 itálico · 80px · caixa alta · off-white · entrelinha 0.96 · espaçamento -0.02em · sombra `0 4px 40px preto 70%` (palavras em dourado dentro do título: usar `.gold`)
- **Subtítulo:** Montserrat 300 itálico · 38px · off-white 75% · entrelinha 1.30 · margem superior 32px
- **Filete dourado:** 80x3px · margem superior 40px · alinhado à esquerda

## Slides 2 a 5 — Texto

Conteúdo centralizado vertical e horizontalmente. Padding: 80px topo · 88px laterais · 120px base.
Espaço entre avatar e corpo: 48px.

**Avatar** (topo do bloco, em linha horizontal): logo círculo 108px · borda dourada 2px · fundo preto ·
imagem interna 86px centralizada · espaço logo→texto 22px · nome Montserrat 500/30px off-white ·
@handle Montserrat 500/22px off-white 42%, margem superior 6px.

**Corpo:** alinhamento centralizado · espaço entre elementos 28px · texto principal Montserrat 300/58px
(entrelinha 1.28) · texto menor Montserrat 300/46px (entrelinha 1.30) · palavras em dourado: mesma
fonte, peso 500 · filete divisor 72x3px centralizado.

**Checklist** (alinhado à ESQUERDA mesmo dentro do bloco centralizado): espaço entre itens 28px ·
ícone ✓ dourado 52px peso 500 · espaço ícone→texto 28px · texto Montserrat 300/52px entrelinha 1.1.

**Bullets** (alinhado à ESQUERDA): espaço entre itens 22px · marcador círculo dourado 12px, margem
superior 18px · espaço marcador→texto 22px · texto Montserrat 300/50px entrelinha 1.15.

**Seta de avanço »:** dourado · 88px · peso 500 · posição base 52px, centralizada horizontalmente.

## Slide 6 — CTA

Tudo centralizado · padding 80px · espaço entre blocos 44px.

- Logo: 140x140px · opacidade 92%
- Texto: Montserrat 300/46px entrelinha 1.30, centralizado
- Link @newhair_fue: Montserrat 500/46px dourado, espaçamento 0.04em · linha fina dourada 40% em
  cima e embaixo · padding interno 18px vertical / 56px horizontal
- Bio: Montserrat 300 itálico/34px off-white 55%

## Regras

- Não usar peso 900 na Montserrat — só a Catchy Mager aguenta
- Corpo e listas sempre 300; destaques e rótulos sempre 500
- Capa alinhada à **ESQUERDA** · slides de texto **CENTRALIZADOS**
- Checklists e bullets à esquerda mesmo dentro de bloco centralizado
- Logo sempre no topo dos slides de texto, nunca no rodapé
- Dourado só em: destaques, ícones, filetes, link e bordas do CTA
