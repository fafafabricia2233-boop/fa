# New Hair FUE — Padrão de Carrossel

> Aprovado pela dona em 31/08/2026, junto com a peça `carrossel-hibrido.html`.
> Este arquivo é a regra do carrossel. O template `Carrossel Template Base.html`
> já sai com tudo isto aplicado — quem gerar carrossel novo parte dele.

---

## A decisão que originou este padrão

Carrossel e reel viviam em identidades diferentes: o carrossel usava Catchy Mager
em tudo com dourado `#C9A96E`, e as peças de vídeo usam Montserrat/Cormorant com
dourado `#C9A24A`. Os dois dourados têm o mesmo vermelho, mas o do carrossel é bem
mais claro no azul (110 contra 74) — lado a lado no feed dava para notar.

A dona decidiu: **título fica na Catchy Mager, todo o resto passa para o padrão do
vídeo.** A display da marca segura a capa, e o corpo ganha a legibilidade da
Montserrat Light.

---

## Fontes

| Onde | Fonte | Peso |
|---|---|---|
| Título da capa (`.hero-title`) | **Catchy Mager** | 900, itálico |
| Título do CTA (`.cta-title`) | Montserrat | **500**, itálico |
| Corpo, listas, subtítulo | Montserrat | **300** |
| Destaques, rótulos, CTA, nome do perfil | Montserrat | **500** |
| Frases de impacto | Cormorant Garamond | 500 |

**A armadilha:** a Catchy Mager é display e aguenta peso 900. A Montserrat não —
em 900 fica grosseira. Trocar só a família mantendo o peso estraga a peça. Os
pesos 300 e 500 acima são exatamente os das peças de vídeo.

Variáveis CSS:
```css
--titulo: 'Catchy Mager','Montserrat',serif;   /* SÓ no título da capa */
--font:   'Montserrat NH','Montserrat',sans-serif;
--serif:  'Cormorant NH',Georgia,serif;
```

As três fontes vão **embutidas em base64**, das mesmas origens que as peças de
vídeo (`projeto-remotion/public/newhair/fontes/`). Carrossel e reel saem do mesmo
arquivo de fonte, não só da mesma especificação.

---

## Cores

| Uso | Hex |
|---|---|
| Dourado — destaques, ícones, filetes, bordas | `#C9A24A` |
| Marinho — fundo e sombra | `#0B2436` |
| Off-white — texto | `#F7F3EA` |
| Preto — fundo dos slides | `#0A0A0A` |

**Cuidado com cor escrita em `rgba()` direto no CSS:** trocar as variáveis não
alcança essas. Já aconteceu duas vezes — as bordas do `.cta-link` e a borda do
logo ficaram com o dourado velho enquanto o resto já era o novo, deixando dois
dourados na mesma peça. Ao mexer na paleta, varrer `rgba(201,169,110` e
`rgba(255,255,255` também.

Equivalentes em rgba: dourado `201,162,74` · off-white `247,243,234`.

---

## Formato e layout

Slide **1080 × 1440 px** (4:3 vertical). A partir de 01/09/2026 as peças novas
saem nesse formato — antes era 1080 × 1350. Os números abaixo são os do
template — valores fixos, não faixas. O template `Carrossel Template Base.html`
é o carrossel aprovado com o conteúdo trocado por marcadores; o CSS é idêntico,
linha por linha.

### S01 — Capa
- Imagem de fundo cobrindo o slide, vinheta por cima
  (preto 70% no topo → 15% aos 40% → 30% aos 70% → 90% na base)
- Tag: topo `60px`, esquerda `72px` · **28px** · dourado · CAIXA ALTA · tracking `.16em`
- Bloco do título: topo `120px`, laterais `72px`
- Título: **80px** · Catchy Mager 900 · itálico · CAIXA ALTA · entrelinha `.96`
  · tracking `-.02em` · sombra `0 4px 40px rgba(0,0,0,.70)`
- Subtítulo: **38px** · Montserrat 300 · itálico · off-white 75% · entrelinha `1.30`
  · margem superior `32px`
- Filete dourado: `80 × 3px` · margem superior `40px`
- **Alinhamento: à ESQUERDA** · sem logo na capa

### S02–S05 — Texto
- Conteúdo centralizado nos dois eixos · padding `80px 88px 120px` · gap `48px`
- **Logo sempre no topo do bloco, nunca no rodapé**
  - círculo **108px** · borda dourada `2px` · imagem interna `86px`, sem `width:100%`
  - espaço logo→texto: `22px`
  - nome "New Hair FUE" **30px** peso 500 · `@newhair_fue` **22px** peso 500,
    off-white 42%, margem superior `6px`
- Corpo `.t-main`: **58px** · peso 300 · entrelinha `1.28`
- Corpo menor `.t-main-sm`: **46px** · peso 300 · entrelinha `1.30`
- Destaque dourado dentro do corpo: mesma fonte, peso **500**
- Filete divisor `.gold-line`: `72 × 3px`, centralizado
- **Alinhamento do corpo: CENTRALIZADO**
- Checklist e bullets: **alinhados à ESQUERDA** mesmo dentro do bloco centralizado
  - checklist: gap `28px` · ícone ✓ dourado **52px** peso 500 · espaço `28px`
    · texto **52px** peso 300 · entrelinha `1.1`
  - bullets: gap `22px` · marcador dourado `12px` (margem superior `18px`)
    · espaço `22px` · texto **50px** peso 300 · entrelinha `1.15`
- Seta `»`: base `52px` · centralizada · dourado · **88px** peso 500

### S06 — CTA
- Fundo: degradê 155° `#0a0a0a → #0f1f50 (60%) → #0a0a0a` · vinheta por cima
- Tudo centralizado · padding `80px` · gap `44px`
- Logo **140px** · opacidade 92%
- Texto: **46px** peso 300 · entrelinha `1.30` — Montserrat, **não** Catchy Mager
- Link `@newhair_fue`: **46px** peso 500 · dourado · tracking `.04em`
  · filete dourado 40% em cima e embaixo · padding `18px 56px`
- Bio: **34px** peso 300 · itálico · off-white 55%

---

## Marcadores do template

`{{TEMA}}` `{{COVER_BASE64}}` `{{HOOK}}` `{{SUBTITULO}}` `{{CONTEUDO_S02}}`
`{{INTRO_S03}}` `{{ITEM_1..4}}` `{{INTRO_S04}}` `{{BULLET_1..4}}`
`{{CONTEUDO_S05}}` `{{CTA_TEXTO}}` `{{CTA_BIO}}`

Checklist e bullets: repetir o bloco do item quantas vezes precisar.
O nome do arquivo do ZIP sai do `{{TEMA}}` automaticamente.

---

## Regras invioláveis

1. **Peso 900 só na Catchy Mager.** Nunca na Montserrat.
2. **Catchy Mager só no título da capa.** Em nenhum outro lugar da peça —
   nem no título do CTA. Decisão da dona em 31/08/2026.
3. **Logo no topo** dos slides de texto. Nunca no rodapé.
4. **Avatar sem `width:100%`** na imagem interna — quebra o alinhamento.
5. **Nome completo** no avatar ("New Hair FUE"), nunca apelido.
6. `hero-tag` **separado** do `hero-block` — dois absolutos independentes
   (`top:60px` e `top:120px`), senão um empurra o outro.
7. Título de 3+ linhas usa 88px; 128px só para 1–2 linhas.
8. Copy longo (6+ linhas) usa `.t-main-sm` (46px), não `.t-main`.
9. **Dourado só em**: destaques, ícones, filetes, link e bordas do CTA.
10. Assets **embutidos em base64** — o HTML tem que abrir offline.
11. **6 slides fixos.**

---

## Compliance

Vale o item 5 do padrão de vídeo, e vale igual aqui:

- ❌ promessa de resultado clínico · antes/depois · citar concorrente · preço
- ❌ a palavra **bisturi** (o vocabulário da casa é punch, implanter, pinça)
- ❌ sugerir que a equipe faz o que é privativo do médico (indicação, incisão, extração)
- ✅ selo obrigatório em peça que mostra cirurgia:
  `Procedimento realizado por médico · a New Hair realiza a instrumentação`

Criativo com chamada para ação passa pelos sócios antes de ir ao ar.
