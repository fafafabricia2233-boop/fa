# Biblioteca de Overlays — Xandoka Video Studio

> Referência rápida. Antes de criar overlay novo, checar se já existe aqui.

## Como ler esta doc
- Cada overlay tem: nome, o que faz, props principais, quando usar, exemplo de import.
- Volumes SFX e regras de divisão CapCut vs Remotion estão em `contexto_edicao_xandoka.md`.
- Todos os componentes assumem composição 1080x1920 @ 30fps. Zona rosto y=350–650 deve ficar LIVRE.
- Para posicionar visual durante dev, envolver com `<DevDraggable>` (ver no final).

## Índice por categoria

- **Texto/Títulos**: `TopTitleCard`, `ImpactWord`, `Caption`, **`PillBadge`** ⭐
- **Navegação/Steps**: **`WeekTabBar`** ⭐
- **Charts/Dados**: `SonoBarChart`, `InsulinaBarChart`, `InsulinaBarChartVertical`, `GraficoBarras`, `StatBar`, `FloatingStats`, **`BarChartPaper`**, **`StackedBlockChart`**, **`ExperienceGauge`**
- **Cards/Papers**: `PaperOverlay`, `PaperHighlightCaminhada`, **`PaperHighlight`** (genérico), `IngredientCard`, `BeforeAfterCard`, `DynamicStudyOverlay`
- **Listas**: `IngredientChecklist`, `StrikethroughList`
- **Pictogramas**: **`PictogramGrid`** ⭐, `PopulationBurst`
- **Mockups**: **`PhoneMockup`** ⭐
- **Cards de pessoa**: **`AthleteCard`** ⭐
- **Glows/FX**: **`MuscleGlowOverlay`**
- **Setas/Indicadores**: `SetaAnatomia`
- **Câmera/Zoom**: `CognitiveZoom`, `InsertCutaway`
- **Audio**: `SFXAudio`
- **Dev tools**: `DevDraggable` (não usar em produção final)
- **Ambiente/BG**: `ScientificEnvironment`
- **Selos/Genéricos**: `LogoStamp`, `GuestPhotoOverlay`, `MiniMonsterCan`, `ScientificFooter`

> ⭐ = adicionado 2026-05-18 extraído de 3 reels do Nippard. Genérico, parametrizável. Preview no Studio em `OVERLAYS/Nippard-Refs/`.

---

## ⭐ Nippard-Refs (adicionados 2026-05-18)

> Extraídos de 3 reels do Jeff Nippard. Genéricos, parametrizáveis, alto reuso.
> Preview no Studio: pasta `OVERLAYS/Nippard-Refs/`.

### `<PillBadge>` ⭐⭐⭐
**Arquivo:** `components/PillBadge.tsx`
**O que faz:** Pill rotulada — substitui 15+ overlays do Nippard.
**Variants:** `white` (NEW LIFTERS, WEEK 1, etc), `dark` (Caminhada leve, ↓ 20-50%), `meal` (MEAL 1 - 10:00am com hora azul), `ingredient` (Egg whites, pequenino).
**Props principais:**
- `text` (obrigatório), `variant`, `top`, `left`
- `accent` + `accentColor` (texto secundário colorido — ex: hora em MealTimePill)
- `emoji` (🥗 🍦 etc), `arrow` (↓ ↑ → ←)

**Quando usar:** Rotular grupo, condição, refeição, ingrediente. Use SEMPRE que precisar de label flutuante. **Alavanca máxima — usa em todo reel.**
**Exemplo:**
```tsx
<PillBadge variant="meal" text="MEAL 1 -" accent="10:00am" top={100} left={60} />
<PillBadge variant="dark" text="20-50%" arrow="↓" top={300} left={400} />
```

### `<WeekTabBar>` ⭐⭐
**Arquivo:** `components/WeekTabBar.tsx`
**O que faz:** Faixa de pills no topo (SEMANA 1 | SEMANA 2 | SEMANA 3) com step ativo destacado.
**Props principais:**
- `steps` (array de labels), `activeIndex`
- `fontSize`, `gap`, `fadeInFrames`

**Quando usar:** Qualquer protocolo multi-semana, progressão de treino, plano alimentar. Trocar `activeIndex` via Sequence pra cada bloco do reel.
**Exemplo:**
```tsx
<Sequence from={0} durationInFrames={150}>
  <WeekTabBar steps={["WEEK 1", "WEEK 2", "WEEK 3"]} activeIndex={0} />
</Sequence>
<Sequence from={150} durationInFrames={150}>
  <WeekTabBar steps={["WEEK 1", "WEEK 2", "WEEK 3"]} activeIndex={1} />
</Sequence>
```

### `<PictogramGrid>` ⭐
**Arquivo:** `components/PictogramGrid.tsx`
**O que faz:** Grid de silhuetas humanas SVG coloridas por grupo, com entrada sequencial (stagger).
**Props principais:**
- `cols` (número de colunas), `groups` (array de `{count, color}`)
- `iconSize`, `gap`, `staggerFrames`

**Quando usar:** "9 em 10 pessoas...", comparação de grupos de estudo, populações.
**Exemplo:**
```tsx
<PictogramGrid
  cols={10}
  iconSize={70}
  groups={[
    { count: 9, color: "#2D6A4F" },
    { count: 1, color: "#888" },
  ]}
/>
```

### `<StackedBlockChart>` ⭐
**Arquivo:** `components/StackedBlockChart.tsx`
**O que faz:** Blocos coloridos empilhados que crescem progressivamente, com header tipo "WEIGHT GAIN →".
**Props principais:**
- `blocks` (array de `{label, height, width?, color, textColor?}`)
- `headerLabel`, `growFrames`, `width`

**Quando usar:** Composição corporal (músculo vs gordura), bulk, comparação de proporções visuais.
**Exemplo:**
```tsx
<StackedBlockChart
  headerLabel="GANHO DE PESO"
  blocks={[
    { label: "GORDURA", height: 110, color: "#D4A017" },
    { label: "MUSCULO", height: 90, color: "#2D6A4F" },
  ]}
/>
```

### `<PaperHighlight>` (genérico — substitui PaperHighlightCaminhada hard-coded)
**Arquivo:** `components/PaperHighlight.tsx`
**O que faz:** Card branco simulando paper científico com highlight amarelo varrendo uma frase. Aceita **modo imagem** (paperSrc + highlightRect) ou **modo texto** (textBefore + highlightWords + textAfter).
**Props principais:**
- Modo imagem: `paperSrc`, `highlightRect: {x, y, w, h}`
- Modo texto: `textBefore`, `highlightWords[]`, `textAfter`, `title`
- `highlightStart`, `highlightDuration`

**Quando usar:** Citar estudo. Preferir modo imagem com screenshot real do NIH/PubMed (mais credibilidade visual).
**Exemplo:**
```tsx
<PaperHighlight
  paperSrc="dismorfia/nih_23percent.png"
  highlightRect={{ x: 40, y: 120, w: 480, h: 22 }}
  highlightDuration={50}
/>
```

### `<BarChartPaper>`
**Arquivo:** `components/BarChartPaper.tsx`
**O que faz:** Bar chart estilo paper científico (fundo branco, eixos, gridlines, barras crescendo).
**Props principais:**
- `bars` (array `{label, value, color}`)
- `titlePills` (array de pills brancas acima — ex: ["NEW LIFTERS", "Normal Diet + 2010 kcal"])
- `yAxisLabel`, `yMax`, `gridLines`

**Quando usar:** Mostrar dado de estudo com aparência acadêmica (mais autoridade que `GraficoBarras` colorido).
**Exemplo:**
```tsx
<BarChartPaper
  titlePills={["INICIANTES", "Dieta + 500 kcal"]}
  yAxisLabel="Ganho de peso (kg)"
  bars={[
    { label: "Massa Total", value: 6.5, color: "#9C9C9C" },
    { label: "Massa Magra", value: 3.2, color: "#2D6A4F" },
    { label: "Gordura", value: 3.0, color: "#D4A017" },
  ]}
/>
```

### `<ExperienceGauge>`
**Arquivo:** `components/ExperienceGauge.tsx`
**O que faz:** Semi-pizza (gauge) com N níveis coloridos + seta apontando o nível ativo.
**Props principais:**
- `levels` (array `{label, color}`)
- `activeIndex`, `arrowLabel`, `arrowColor`

**Quando usar:** Posicionar audiência numa escala (iniciante/intermediário/avançado). Pode reusar para qualquer escala de 3-5 níveis.
**Exemplo:**
```tsx
<ExperienceGauge
  levels={[
    { label: "Iniciante",    color: "#9C9C9C" },
    { label: "Intermediario", color: "#6E7E70" },
    { label: "Avancado",     color: "#2D6A4F" },
  ]}
  activeIndex={0}
  arrowLabel="VOCE"
/>
```

### `<AthleteCard>` ⭐⭐
**Arquivo:** `components/AthleteCard.tsx`
**O que faz:** Card composto — pill superior (década/categoria) + foto centralizada + pill nome amarelo + sub-stats. Pode rodar em modo `scene` (fundo preto full-frame, estilo "era physiques" do Nippard).
**Props principais:**
- `name` (obrigatório), `stats`, `photoSrc`, `topPill`
- `scene: boolean` — modo fundo preto pleno
- `nameAccentColor` (default `#FFD700`)

**Quando usar:** Mostrar atleta de referência, cliente antes/depois, case study, comparação histórica, "personagem da semana".
**Exemplo:**
```tsx
{/* Modo overlay (sobre footage) */}
<AthleteCard
  topPill="1990s"
  name="Dorian Yates"
  stats="5'10, 255 lbs"
  photoSrc="referencias/dorian.jpg"
  width={420}
  top={120}
  left={120}
/>

{/* Modo cena (fundo preto, frame inteiro) */}
<AthleteCard
  scene
  topPill="ANTES"
  name="Cliente João"
  stats="145kg, 30 anos"
  photoSrc="clientes/joao_antes.jpg"
  width={520}
/>
```

### `<MuscleGlowOverlay>`
**Arquivo:** `components/MuscleGlowOverlay.tsx`
**O que faz:** Glow colorido elíptico estático sobre região do canvas. Usa `mix-blend-mode: screen` pra clarear área embaixo (estilo "muscle memory" / aquecimento muscular).
**Props principais:**
- `cx`, `cy` (centro do glow), `rx`, `ry` (raios), `rotate`
- `variant`: `red` | `orange` | `yellow` | `custom`
- `pulse` (oscila opacidade), `maxOpacity`, `blendMode`

**Quando usar:** Enfatizar músculo ativado, mostrar "queima", "ponto de tensão", aquecimento, lesão. **OBS:** estático — pra sujeito em movimento, use tracking no CapCut.
**Exemplo:**
```tsx
<MuscleGlowOverlay cx={540} cy={520} rx={220} ry={130} rotate={-15} variant="red" pulse />
```

### `<PhoneMockup>`
**Arquivo:** `components/PhoneMockup.tsx`
**O que faz:** iPhone frame realista (bezel + notch + botões laterais) com screenshot dentro.
**Props principais:**
- `screenshotSrc` (path em public/), `width`
- `bezelColor`, `showNotch`, `rotate`

**Quando usar:** Mostrar app (Notion, Hotmart, WhatsApp), screenshot de dashboard, antes/depois de progresso em app.
**Exemplo:**
```tsx
<PhoneMockup
  screenshotSrc="screenshots/hotmart_dashboard.png"
  width={380}
  rotate={-3}
/>
```

---

## Texto / Títulos

### `<TopTitleCard>`
**Arquivo:** `components/TopTitleCard.tsx`
**O que faz:** Título grande centralizado no topo, entrada com pop (scale 1.3 → 1).
**Props principais:**
- `text` (obrigatório)
- `color` (default `#FFD700`)
- `subtitle`
- `top` (default 96)

**Quando usar:** Abertura de cena/seção, anunciar conceito ou bloco do roteiro.
**Exemplo:**
```tsx
<TopTitleCard text="META-ANÁLISE" subtitle="32 estudos · 96.549 pessoas" />
```

### `<ImpactWord>`
**Arquivo:** `components/ImpactWord.tsx`
**O que faz:** Palavra única, gigante, com stroke preto + glow opcional + shake opcional. Fade in/out automático (some no frame 42).
**Props principais:**
- `text`, `color` (obrigatórios)
- `top` (default 570)
- `size` (default 112)
- `shake`, `glow` (booleans)
- `delayFrames`

**Quando usar:** Punch line, palavra-chave do gancho, momento de impacto sobre o rosto/B-roll.
**Quando NÃO usar:** Em legenda corrida — pra isso usa `Caption`.
**Exemplo:**
```tsx
<ImpactWord text="MENTIRA" color="#E74C3C" shake glow />
```

### `<Caption>`
**Arquivo:** `components/Caption.tsx`
**O que faz:** Legenda principal do reel. Anton 72px, uppercase, stroke 6px preto. Dois modos: `paged` (4 palavras com palavra ativa colorida) e `stable` (blocos estáveis sem trocar ativa).
**Props principais:**
- `captions` (array Remotion Caption — `startMs/endMs` já em ms)
- `mode` — **sempre `"stable"` no design system**, nunca reverter pra paged
- `paddingBottom` (default 230)
- `colorOverrides` — `{ "PALAVRA": "#FFD700" }` para destacar tokens
- `positionOverrides` — array `{ startMs, endMs, paddingBottom? | top?, left?, width? }` pra mover legenda em intervalos

**Quando usar:** Toda fala do reel.
**Regra crítica:** `mode="stable"`. Whisper large-v3 já entrega ms — não multiplicar por 1000.
**Exemplo:**
```tsx
<Caption
  captions={captions}
  mode="stable"
  paddingBottom={260}
  colorOverrides={{ "INSULINA": "#FFD700", "GORDURA": "#E74C3C" }}
/>
```

---

## Charts / Dados

### `<GraficoBarras>` ⭐ GENÉRICO (preferir este)
**Arquivo:** `components/GraficoBarras.tsx`
**O que faz:** Versão parametrizável do padrão "Torre" validado. Header preto + subtítulo cinza opcional + N barras horizontais animadas (from → to) com plateau e pulse opcional por barra.
**Props principais:**
- `bars` (obrigatório): array `[{ label: string[], color?, from, to, unit?, decimals?, pulse? }]`
- `headerTitle?`, `headerSubtitle?` — header opcional
- `plateauStart?` (default 44) — frame em que valor congela
- `top`, `left`, `width?` — posicionamento
- `barAreaWidth?`, `barHeight?`, `barGap?` — ajustes finos

**Quando usar:** Qualquer reel com 2-5 dados comparáveis evoluindo no tempo (peso, gordura, força, sono, calorias, macro). **Substitui SonoBarChart e InsulinaBarChart pra reels novos.**
**Quando NÃO usar:** Se for 1 dado só, usar `<StatBar>`. Se for distribuição/pizza, criar componente novo.
**Composition de preview:** `GraficoBarras` (1080x1080 green-screen) — use no Studio pra ajustar coords antes de cravar no JSON.
**Exemplo:**
```tsx
<DevDraggable id="grafico-barras" initialTop={120} initialLeft={60} initialWidth={620}>
  {(p) => (
    <GraficoBarras
      top={p.top} left={p.left} width={p.width}
      headerTitle="DÉFICIT CALÓRICO"
      headerSubtitle="Sem melhorar sensibilidade insulínica"
      bars={[
        { label: ["PESO", "(KG)"], color: "#5A5A5A", from: 118, to: 98, unit: "kg" },
        { label: ["% GORDURA"], color: "#C87D10", from: 34, to: 22, unit: "%" },
        { label: ["RESISTÊNCIA", "INSULÍNICA"], color: "#8B1A1A", from: 100, to: 88, unit: "%", pulse: true },
      ]}
    />
  )}
</DevDraggable>
```

### `<SetaAnatomia>` ⭐ NOVO (Nippard style)
**Arquivo:** `components/SetaAnatomia.tsx`
**O que faz:** Seta animada com draw-in + glow + label opcional. Aponta de um ponto (origem/label) pra outro (ponta no corpo/dado). Glow amarelo (ou cor escolhida).
**Props principais:**
- `fromX, fromY` (origem do traço — onde fica o label)
- `toX, toY` (ponta — onde a seta aponta)
- `color?` (default `#FFD700`)
- `label?` + `labelPosition?` (`"above"|"below"|"left"|"right"|"auto"`)
- `strokeWidth?` (default 8), `arrowHeadSize?` (default 32)
- `glow?` (default true)
- `drawInFrames?` (default 14), `delayFrames?`, `pulseAfterFrames?`

**Quando usar:** Apontar pra músculo na anatomia, marcar dado/valor na tela, indicar erro de execução. Substitui setas desenhadas no CapCut quando precisar de animação/glow.
**Quando NÃO usar:** Não envolver em `<DevDraggable>` — DevDraggable mexe em `top/left`, mas SetaAnatomia usa `fromX/fromY/toX/toY`. Ajustar visualmente editando o JSON e olhando no Studio.
**Composition de preview:** `SetaAnatomia` (1080x1080 green-screen).
**Exemplo:**
```tsx
<SetaAnatomia
  fromX={780} fromY={200}
  toX={420} toY={620}
  color="#FFD700"
  label="GLÚTEO MÉDIO"
  labelPosition="above"
  drawInFrames={18}
/>
```

### `<SonoBarChart>`
**Arquivo:** `components/SonoBarChart.tsx`
**O que faz:** Chart horizontal 2 barras (Qualidade de Sono verde militar 100→50%, Sensibilidade Insulínica cinza 100→75%). Hard-coded para take de sono.
**Props principais:** `top`, `left` (posicionamento)
**Quando usar:** Take específico sobre privação de sono → resistência insulínica.
**Status:** Hard-coded para um take específico — não é genérico.

### `<InsulinaBarChart>`
**Arquivo:** `components/InsulinaBarChart.tsx`
**O que faz:** Chart horizontal 3 barras (Peso, % Gordura, Resistência Insulínica). Resistência fica piscando vermelho no platô. Valores hard-coded animados.
**Props principais:** `top`, `left`, `width`
**Quando usar:** Take "déficit calórico sem melhorar sensibilidade insulínica" — peso cai mas resistência fica.
**Status:** Hard-coded — não é genérico.

### `<InsulinaBarChartVertical>`
**Arquivo:** `components/InsulinaBarChartVertical.tsx`
**O que faz:** Mesma data do InsulinaBarChart porém barras verticais.
**Props principais:** `top`, `left`
**Quando usar:** Versão vertical do chart insulina quando layout pedir.
**Status:** Hard-coded — variante do InsulinaBarChart.

### `<StatBar>`
**Arquivo:** `components/StatBar.tsx`
**O que faz:** Card horizontal com label pequeno + valor grande + detail opcional. Barra dourada de progresso embaixo. 5 tons (blue, darknavy, orange, green, red).
**Props principais:**
- `label`, `value` (obrigatórios)
- `detail`
- `tone` (default `blue`)
- `yOffset` (default 156)

**Quando usar:** Mostrar UM dado/estatística destacada (ex: "−7KG EM 12 SEMANAS", "MÉDIA 1g/kg").
**Exemplo:**
```tsx
<StatBar label="META-ANÁLISE" value="-7KG" detail="em 12 semanas" tone="green" />
```

### `<FloatingStats>`
**Arquivo:** `components/FloatingStats.tsx`
**O que faz:** Números/textos que flutuam pelo fundo (opacity ~0.14, drift pra cima). Decoração ambiente, não primário.
**Props principais:**
- `stats: [{ text, at, endAt?, x, y, size?, color? }]` (em segundos)

**Quando usar:** Camada sutil de ambientação científica atrás do rosto.
**Quando NÃO usar:** Como informação primária — é decorativo, opacity baixa.

---

## Cards / Papers

### `<PaperOverlay>`
**Arquivo:** `components/PaperOverlay.tsx`
**O que faz:** Card branco simulando paper científico — título, subtitle, source, imagem opcional. 3 posições preset (top/right/bottom).
**Props principais:**
- `title` (obrigatório)
- `subtitle`, `source`, `imageSrc`
- `position` (`top` | `right` | `bottom`, default `right`)

**Quando usar:** Citar estudo/meta-análise com referência visual.
**Exemplo:**
```tsx
<PaperOverlay
  title="MELHORA RESPOSTA GLICÊMICA"
  subtitle="Caminhada pós-prandial 30min"
  source="Reynolds et al., 2016"
  position="right"
/>
```

### `<PaperHighlightCaminhada>`
**Arquivo:** `components/PaperHighlightCaminhada.tsx`
**O que faz:** Card branco grande com abstract do paper de caminhada pós-prandial. Highlight amarelo progressivo palavra por palavra na conclusão.
**Props principais:** `top`, `left`
**Status:** Hard-coded para um único paper (caminhada). Não reusável genericamente — pra outro paper, fork.

### `<IngredientCard>`
**Arquivo:** `components/IngredientCard.tsx`
**O que faz:** Card horizontal com ícone colorido + título + subtítulo + risco/status à direita. 3 tons (green, blue, yellow).
**Props principais:**
- `title`, `subtitle`, `risk` (obrigatórios)
- `icon` (default ✓)
- `tone` (default green)

**Quando usar:** Avaliar ingrediente/alimento (ex: "ASPARTAME — adoçante artificial — SEGURO").
**Exemplo:**
```tsx
<IngredientCard title="CAFEÍNA" subtitle="200mg/dose" risk="SEGURO" tone="green" />
```

### `<BeforeAfterCard>`
**Arquivo:** `components/BeforeAfterCard.tsx`
**O que faz:** Lado a lado ANTES/AGORA com 2 fotos + labels. Pode rodar single (só leftSrc).
**Props principais:**
- `leftSrc` (obrigatório)
- `rightSrc` (opcional — se omitir, vira single)
- `leftLabel`/`rightLabel` (default ANTES/AGORA)
- `yOffset` (default 700, min 700 — preserva safe zone rosto)
- `leftZoom`, `rightZoom`, `leftObjectPosition`, `rightObjectPosition`
- `delayFrames`

**Quando usar:** Mostrar transformação Xandoka 145kg→84kg, ou comparação visual qualquer.

### `<DynamicStudyOverlay>`
**Arquivo:** `components/DynamicStudyOverlay.tsx`
**O que faz:** Card com imagem de estudo/print + header (título + footer) + scan-line azul passando. Estética HUD científico.
**Props principais:**
- `src` (obrigatório)
- `mode` (`results` | `conclusion` | `full`, default `full`)
- `title` (default "META-ANÁLISE")
- `footer` (default "32 estudos · 96.549 pessoas")

**Quando usar:** Mostrar screenshot real de paper/abstract de forma cinematográfica.

---

## Listas

### `<IngredientChecklist>`
**Arquivo:** `components/IngredientChecklist.tsx`
**O que faz:** Lista vertical pequena de items com ✓ verde, title + detail. Reveal sequencial baseado em segundos.
**Props principais:**
- `items: [{ title, detail, at }]` (`at` em segundos)

**Quando usar:** Checklist de ingredientes/etapas que aparecem em cascata enquanto a fala lista. Posição default canto inferior-esquerdo (left:58, top:820).
**Exemplo:**
```tsx
<IngredientChecklist items={[
  { title: "WHEY", detail: "25g proteína", at: 1.2 },
  { title: "AVEIA", detail: "carbo lento", at: 2.0 },
]} />
```

### `<StrikethroughList>`
**Arquivo:** `components/StrikethroughList.tsx`
**O que faz:** Lista de itens com bullet laranja que aparecem e depois são riscados em vermelho (0.38s após reveal).
**Props principais:**
- `items: [{ label, revealFrame }]` (frame absoluto dentro da Sequence)

**Quando usar:** "Coisas que NÃO funcionam" — desmistificar mitos riscando um por um.
**Exemplo:**
```tsx
<StrikethroughList items={[
  { label: "DIETA DETOX", revealFrame: 0 },
  { label: "JEJUM EXTREMO", revealFrame: 30 },
]} />
```

---

## Câmera / Zoom

### `<CognitiveZoom>`
**Arquivo:** `components/CognitiveZoom.tsx`
**O que faz:** Wrapper que aplica zoom no children por segmentos de tempo. Cada segmento define `start`, `end`, `from`, `to`.
**Props principais:**
- `children`
- `segments: [{ start, end, from, to }]` (segundos)

**Quando usar:** Push-in cognitivo no rosto durante punch line, ou pull-back depois.
**Exemplo:**
```tsx
<CognitiveZoom segments={[{ start: 2, end: 3, from: 1, to: 1.15 }]}>
  <OffthreadVideo src={...} />
</CognitiveZoom>
```

### `<InsertCutaway>`
**Arquivo:** `components/InsertCutaway.tsx`
**O que faz:** B-roll em AbsoluteFill com fade in/out automático, zoom progressivo opcional, darken opcional.
**Props principais:**
- `src` (obrigatório)
- `startFrom` (default 0)
- `durationInFrames`
- `opacity` (default 1)
- `zoom` (default 1)
- `fit` (`cover` | `contain`)
- `darken` (boolean)

**Quando usar:** Inserir B-roll por cima do shot principal durante uma fala.
**Exemplo:**
```tsx
<InsertCutaway src={staticFile("broll/cafeina.mp4")} zoom={1.08} darken />
```

---

## Audio

### `<SFXAudio>`
**Arquivo:** `components/SFXAudio.tsx`
**O que faz:** Wrapper trivial em volta de `<Audio>` com volume/playbackRate/startFrom/endAt.
**Props principais:** `src`, `volume`, `playbackRate`, `startFrom`, `endAt`
**Quando usar:** Adicionar SFX (whoosh, impact, etc) numa Sequence. Volumes seguem `contexto_edicao_xandoka.md`.

---

## Ambiente / Background

### `<ScientificEnvironment>`
**Arquivo:** `components/ScientificEnvironment.tsx`
**O que faz:** AbsoluteFill com camadas — gradient navy, vídeo de fundo opcional, HUD grid, partículas, molécula, light leak azul, grain, scanlines. Tudo blendado.
**Props principais:**
- `scienceBgSrc` (vídeo opcional)
- `intensity` (default 0.44)

**Quando usar:** Cena "modo científico" — usar atrás do rosto pra puxar atmosfera de laboratório/HUD.
**Quando NÃO usar:** Reels casuais/treino — fica overdesigned. Reservar pra takes de meta-análise/dado científico.

### `<PopulationBurst>`
**Arquivo:** `components/PopulationBurst.tsx`
**O que faz:** Mar de 260 silhuetas pequenas (cabeça+corpo) aparecendo em cascata, drift pra cima. Respeita SAFE_FACE_ZONE.
**Props principais:** `start`, `end` (segundos)
**Quando usar:** Ilustrar tamanho de amostra de estudo ("96 mil pessoas"). Sutil — opacity ~0.1.

---

## Selos / Genéricos

### `<LogoStamp>`
**Arquivo:** `components/LogoStamp.tsx`
**O que faz:** @handle no canto superior direito.
**Props principais:** `handle`
**Quando usar:** Branding fixo em todo reel (ex: `@xandokaoriginal`).

### `<GuestPhotoOverlay>`
**Arquivo:** `components/GuestPhotoOverlay.tsx`
**O que faz:** Foto retrato grande de "guest" (ex: Nippard, autor de estudo) com credit handle no canto. Entra deslizando do lado.
**Props principais:**
- `imageSrc`, `creditHandle` (obrigatórios)
- `widthPct` (default 70)
- `side` (`left` | `right` | `center`)
- `placement` (`center` | `lower-left`)
- `delayFrames`, `durationInFrames`

**Quando usar:** Citar especialista/pesquisador com a cara dele aparecendo.

### `<MiniMonsterCan>`
**Arquivo:** `components/MiniMonsterCan.tsx`
**O que faz:** 4 mini latas Monster aparecendo em cascata no canto direito (top:760, right:54).
**Props principais:** `src` (default `monster/monster_can_reference_clean.png`)
**Status:** Específico do MonsterReel — checar antes de reusar.

### `<ScientificFooter>`
**Arquivo:** `components/ScientificFooter.tsx`
**O que faz:** Texto pequeno centralizado em `bottom: 210`, opacity 0.65, fade in/out.
**Props principais:** `text`, `durationInFrames`
**Quando usar:** Citação/disclaimer/referência discreta no rodapé.

---

## Dev tools

### `<DevDraggable>` + `<DevDraggableProvider>` + `<DevHUD>`
**Arquivo:** `components/DevDraggable.tsx`
**O que faz:** Wrapper dev-only que permite arrastar/redimensionar overlay diretamente na preview do Studio. Posições persistem em localStorage. HUD no canto exibe coords + botão COPY.
**Como usar (workflow):**
1. Envolver overlay novo: `<DevDraggable id="meu-overlay" initialTop={X} initialLeft={Y} initialWidth={W}>{(p) => <Componente top={p.top} left={p.left} width={p.width} />}</DevDraggable>`
2. Studio: arrasta visual até ficar bom
3. HUD → COPY → cola as coords no código
4. Remove o wrapper, mantém só o componente com coords cravadas

**Quando NÃO usar:** Em produção final / render. É dev-only — não renderiza nada em produção (mas o wrapper repassa as initials, então funciona inerte).
**Exemplo:**
```tsx
<DevDraggable id="stat-deficit" label="StatBar Deficit"
  initialTop={156} initialLeft={72} initialWidth={936}>
  {(p) => <StatBar label="DÉFICIT" value="500kcal" yOffset={p.top} />}
</DevDraggable>
```
