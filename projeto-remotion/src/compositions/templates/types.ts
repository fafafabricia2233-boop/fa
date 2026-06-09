// ═══════════════════════════════════════════════════════════════════════════
// Types compartilhados entre templates parametrizados (DadoCientifico,
// MitoVerdade, HistoriaPessoal).
//
// Todos os tempos abaixo são FRAMES @ 30fps. Conversão de segundos:
//   frame = round(seconds * 30)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Catálogo de SFX disponíveis ─────────────────────────────────────────────
// Os volumes padronizados (LegDay reference) ficam em SFX_DEFAULTS dentro
// de shared.tsx. Para override pontual, passar `volume` no cue.
export type SfxName =
  | "card"
  | "selection"
  | "error"
  | "title_card"
  | "estiramento"
  | "escrita"
  | "grind_intro"
  | "whoosh"
  | "pop"
  | "bass"
  | "impact"
  | "subDrop"
  | "emptying";

export type SfxCue = {
  /** Frame de início @ 30fps */
  frame: number;
  /** Nome do SFX (resolvido em shared.tsx para o arquivo correto) */
  sfx: SfxName;
  /** Override de volume (0–1). Se omitido usa o default da tabela. */
  volume?: number;
  /** Duração em frames (default: 13 — equivalente ao "tail" usado nos reels). */
  durationInFrames?: number;
};

// ─── Title cards ─────────────────────────────────────────────────────────────
// Estilo Nippard: linha 1 amarela italic + linha 2 branca bold.
// `position` controla preset de tamanho (center-bottom = 96px, top-left = 80px).
// `top` / `left` / `width` SOBRESCREVEM o preset (vindo do DevDraggable).
export type TitleCardCue = {
  start: number;
  end: number;
  line1: string;        // amarelo italic (em LegDay: "sets")
  line2: string;        // branco bold   (em LegDay: "exercise")
  position?: "center-bottom" | "top-left";
  // Posicionamento manual (cravado depois de DevDraggable):
  top?: number;
  left?: number;
  width?: number;
  /** Se true, dispara card.MP3 (vol 0.5) no frame `start`. Default true. */
  withSfx?: boolean;
  /** Frames até a linha branca entrar (default 8) */
  exerciseDelayFrames?: number;
};

// ─── Charts overlays (DadoCientifico) ────────────────────────────────────────
export type ChartType =
  | "SonoBarChart"
  | "InsulinaBarChart"
  | "InsulinaBarChartVertical";

export type ChartCue = {
  start: number;
  end: number;
  type: ChartType;
  top: number;
  left: number;
  width: number;
  /** Label do DevDraggable na UI do Studio (default = type) */
  id?: string;
};

// ─── Thumbnail intro (MitoVerdade) ───────────────────────────────────────────
export type ThumbData = {
  src: string;
  sets: string;
  exercise: string;
};

// ─── Cognitive Zoom segments (opcional) ──────────────────────────────────────
export type ZoomSegment = {
  start: number; // segundos
  end: number;   // segundos
  from: number;
  to: number;
};

// ─── Props comuns a todos os templates ───────────────────────────────────────
export type CommonProps = {
  /** Path relativo a `public/` */
  videoSrc: string;
  /** Path relativo a `public/` para o JSON de captions Whisper */
  captionsJson: string;
  /** Duração em segundos (apenas informativo — Root.tsx define o frame count) */
  duration: number;
  /** Path relativo a `public/` da música de fundo (default "new sfx/music.mp3") */
  musicSrc?: string;
  /** Volume da música (default 0.08) */
  musicVolume?: number;
  /** Map palavra → cor (uppercase) */
  colorOverrides?: Record<string, string>;
  /** Array de SFX cues (ver SfxCue). Default []. */
  sfxCues?: SfxCue[];
  /** Array de title cards (ver TitleCardCue). Default []. */
  titleCards?: TitleCardCue[];
};
