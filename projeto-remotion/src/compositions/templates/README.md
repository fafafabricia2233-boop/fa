# Templates Parametrizados — video-studio/remotion

Camada de polimento (captions + SFX + title cards + 1 chart/before-after) sobre vídeo já cortado no CapCut.

**Regra de ouro Nippard:** 1 elemento dominante por vez. NÃO empilhar overlays.

---

## Os 3 templates

| Template | Quando usar | Base |
|---|---|---|
| **DadoCientifico** | Reel educativo com dado / gráfico / estudo (insulina, sono, calorias) | InsulinarReel |
| **MitoVerdade** | Desmistificação / cortes alternados / lista de exercícios estilo LegDay | LegDayReel |
| **HistoriaPessoal** | Trajetória, antes-depois, prova pessoal (PerderPeso) | PerderPesoReel |

---

## Arquivos

```
remotion/src/compositions/templates/
├── types.ts            ← SfxCue, TitleCardCue, ChartCue, CommonProps
├── shared.tsx          ← useCaptions, TitleCard, SFX_MAP, renderSfxCues, renderTitleCards
├── DadoCientifico.tsx
├── MitoVerdade.tsx
├── HistoriaPessoal.tsx
└── README.md           ← este arquivo
```

Exemplos de props.json em `remotion/props.example.<tipo>.json`.

---

## Como usar (fluxo Xandoka)

### 1. Copiar o exemplo
```bash
cp remotion/props.example.dado.json remotion/props.meu-reel.json
```

### 2. Editar o props.json
Trocar paths (`videoSrc`, `captionsJson`), ajustar frames de SFX, escrever title cards.

### 3. Registrar a Composition no `Root.tsx`
Importar e adicionar (exemplo DadoCientifico):

```tsx
import { DadoCientifico } from "./compositions/templates/DadoCientifico";
import meuReelProps from "../props.meu-reel.json";

<Composition
  id="MeuReel"
  component={DadoCientifico}
  durationInFrames={Math.round(meuReelProps.duration * 30)}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={meuReelProps}
/>
```

### 4. Abrir Studio e posicionar overlays
```bash
npm run dev   # http://localhost:3001
```
DevDraggable está ativo em **todos os overlays novos**. Arrastar, copiar coords do DevHUD, colar de volta no props.json em `top/left/width`, recarregar.

### 5. Render
```bash
npx remotion render MeuReel out/meu-reel.mp4
```

---

## Schemas

### `CommonProps` (todos os templates)
| Campo | Obrigatório | Default | Notas |
|---|---|---|---|
| `videoSrc` | sim | — | path relativo a `public/` |
| `captionsJson` | sim | — | Whisper JSON (já em ms) |
| `duration` | sim | — | segundos (informativo) |
| `musicSrc` | não | `new sfx/music.mp3` (Mito/Historia) / `new sfx/Chill.MP3` (Dado) | |
| `musicVolume` | não | 0.07–0.08 | |
| `colorOverrides` | não | — | `{ PALAVRA: "#FFD700" }` (uppercase) |
| `sfxCues` | não | `[]` | ver tabela SFX |
| `titleCards` | não | `[]` | Nippard style |

### `SfxCue`
```ts
{ frame: number, sfx: SfxName, volume?: number, durationInFrames?: number }
```

Volumes padronizados (LegDay reference — **não alterar sem aprovação**):

| SfxName | volume default | path |
|---|---|---|
| `card` | 0.5 | `new sfx/card.MP3` |
| `selection` | 0.5 | `new sfx/Selection.MP3` |
| `error` | 0.85 | `new sfx/error.MP3` |
| `title_card` | 0.5 | `new sfx/card.MP3` |
| `estiramento` | 0.3 | `new sfx/estiramento_muscular.MP3` |
| `escrita` | 0.5 | `new sfx/escrita.mp3` |
| `grind_intro` | 0.5 | `new sfx/grind_intro.mp3` |
| `whoosh` | 0.36 | `sfx/whoosh_short.MP3` |
| `pop` | 0.42 | `sfx/ui_pop.mp3` |
| `bass` | 0.55 | `sfx/bass_hit.MP3` |
| `impact` | 0.52 | `sfx/metal_impact.mp3` |
| `subDrop` | 0.46 | `sfx/sub_drop.mp3` |
| `emptying` | 0.44 | `dismorfia/esvaziando_sfx.mp3` |

### `TitleCardCue`
```ts
{
  start: number, end: number,             // frames
  line1: string,                          // amarelo italic
  line2: string,                          // branco bold
  position?: "center-bottom" | "top-left",// default center-bottom
  top?: number, left?: number, width?: number,  // override DevDraggable
  withSfx?: boolean,                      // default true (card.MP3)
  exerciseDelayFrames?: number            // default 8
}
```

### `ChartCue` (apenas DadoCientifico)
```ts
{
  start: number, end: number,
  type: "SonoBarChart" | "InsulinaBarChart" | "InsulinaBarChartVertical",
  top: number, left: number, width: number,
  id?: string
}
```

### `thumbnails` (apenas MitoVerdade)
Array de 5 itens `{ src, sets, exercise }`. Renderiza grid 2+3 borrado por `thumbnailDurationFrames` (default 170).

### `beforeAfter` (apenas HistoriaPessoal)
```ts
{
  start: number, end: number,
  leftSrc: string, rightSrc?: string,
  leftLabel?: string, rightLabel?: string,
  yOffset?: number,
  leftZoom?: number, rightZoom?: number,
  leftObjectPosition?: string, rightObjectPosition?: string
}
```

---

## Regras invioláveis

1. Captions **sempre** `mode="stable"`. Nunca "paged".
2. Todo overlay novo nasce dentro de `<DevDraggable>` (já está nos templates).
3. Resolução **1080x1920 30fps**.
4. Frames @ 30fps. Conversão: `frame = round(seconds * 30)`.
5. Não empilhar overlays. 1 elemento dominante por vez.
6. HistoriaPessoal **não tem fundo navy** — vídeo base sempre visível.
