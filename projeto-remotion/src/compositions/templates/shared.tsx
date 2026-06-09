// ═══════════════════════════════════════════════════════════════════════════
// Shared helpers para os templates parametrizados:
//   - useCaptions hook (loader Whisper)
//   - TitleCard (Nippard style — yellow italic + white bold)
//   - SFX_MAP e SFX_DEFAULTS (paths + volumes padronizados — LegDay reference)
//   - renderSfxCues / renderTitleCards
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { DevDraggable } from "../../components/DevDraggable";
import { loadCaptionFile } from "../../lib/whisper";
import type { SfxCue, SfxName, TitleCardCue } from "./types";

// ─── Fonts ───────────────────────────────────────────────────────────────────
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});
export { montserrat };

// ─── SFX map (path relativo a public/) ───────────────────────────────────────
// Mantém compatibilidade com `new sfx/*.mp3` que já é o convencionado.
export const SFX_MAP: Record<SfxName, string> = {
  card:        "new sfx/card.MP3",
  selection:   "new sfx/Selection.MP3",
  error:       "new sfx/error.MP3",
  title_card:  "new sfx/card.MP3",
  estiramento: "new sfx/estiramento_muscular.MP3",
  escrita:     "new sfx/escrita.mp3",
  grind_intro: "new sfx/grind_intro.mp3",
  whoosh:      "sfx/whoosh_short.MP3",
  pop:         "new sfx/ui_pop.mp3",
  bass:        "sfx/bass_hit.MP3",
  impact:      "sfx/metal_impact.mp3",
  subDrop:     "sfx/sub_drop.mp3",
  emptying:    "dismorfia/esvaziando_sfx.mp3",
};

// Volumes padronizados — LegDay reference (não alterar sem ordem do Xandoka)
export const SFX_DEFAULTS: Record<SfxName, { volume: number; durationInFrames: number }> = {
  card:        { volume: 0.5,   durationInFrames: 13 },
  selection:   { volume: 0.5,   durationInFrames: 26 },
  error:       { volume: 0.85,  durationInFrames: 13 },
  title_card:  { volume: 0.5,   durationInFrames: 30 },
  estiramento: { volume: 0.3,   durationInFrames: 72 },
  escrita:     { volume: 0.5,   durationInFrames: 60 },
  grind_intro: { volume: 0.5,   durationInFrames: 30 },
  whoosh:      { volume: 0.36,  durationInFrames: 17 },
  pop:         { volume: 0.42,  durationInFrames: 14 },
  bass:        { volume: 0.55,  durationInFrames: 45 },
  impact:      { volume: 0.52,  durationInFrames: 27 },
  subDrop:     { volume: 0.46,  durationInFrames: 54 },
  emptying:    { volume: 0.44,  durationInFrames: 33 },
};

// ─── useCaptions hook ────────────────────────────────────────────────────────
export const useCaptions = (captionsJson: string, label = "Loading captions") => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender(label));

  useEffect(() => {
    if (!captionsJson) {
      setCaptions([]);
      continueRender(handle);
      return;
    }
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => {
        setCaptions(caps);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [captionsJson, continueRender, cancelRender, handle]);

  return captions;
};

// ─── TitleCard — Nippard style ───────────────────────────────────────────────
// Linha 1 (amarelo italic) entra primeiro. Linha 2 (branco bold) com delay.
// `position`: preset de tamanho. `top/left/width` sobrescrevem.
type TitleCardProps = {
  line1: string;
  line2: string;
  durationFrames: number;
  exerciseDelayFrames?: number;
  position?: "center-bottom" | "top-left";
  top?: number;
  left?: number;
  width?: number;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  line1,
  line2,
  durationFrames,
  exerciseDelayFrames = 8,
  position = "center-bottom",
  top,
  left,
  width,
}) => {
  const frame = useCurrentFrame();

  const setsProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exerciseProgress = interpolate(
    frame,
    [exerciseDelayFrames, exerciseDelayFrames + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const fadeOut = interpolate(frame, [durationFrames - 8, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isTopLeft = position === "top-left";
  const hasOverride = top !== undefined && left !== undefined;

  const positionStyle: React.CSSProperties = hasOverride
    ? { top, left, width, textAlign: isTopLeft ? "left" : "center" }
    : isTopLeft
      ? { top: 540, left: 60, textAlign: "left" }
      : { top: 1380, left: 0, right: 0, textAlign: "center" };

  const setsSize = isTopLeft ? 44 : 52;
  const exerciseSize = isTopLeft ? 80 : 96;

  // Se width foi setado, escalonar fontes proporcionalmente
  const scale = width ? width / (isTopLeft ? 600 : 1000) : 1;

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        fontFamily: montserrat,
      }}
    >
      <div
        style={{
          fontSize: Math.round(setsSize * scale),
          fontWeight: 900,
          fontStyle: "italic",
          color: "#FFD700",
          textTransform: "uppercase",
          textShadow: "0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.9)",
          lineHeight: 1,
          letterSpacing: 1,
          opacity: Math.min(setsProgress, fadeOut),
          transform: `translateY(${interpolate(setsProgress, [0, 1], [16, 0])}px)`,
        }}
      >
        {line1}
      </div>
      <div
        style={{
          fontSize: Math.round(exerciseSize * scale),
          fontWeight: 900,
          color: "#FFFFFF",
          textTransform: "uppercase",
          textShadow: "0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.9)",
          lineHeight: 0.95,
          letterSpacing: -2,
          marginTop: 2,
          opacity: Math.min(exerciseProgress, fadeOut),
          transform: `translateY(${interpolate(exerciseProgress, [0, 1], [22, 0])}px)`,
        }}
      >
        {line2}
      </div>
    </div>
  );
};

// ─── renderSfxCues — itera array de SfxCue e cria Sequences ──────────────────
export const renderSfxCues = (cues: SfxCue[] = []): React.ReactNode =>
  cues.map((cue, i) => {
    const def = SFX_DEFAULTS[cue.sfx];
    const path = SFX_MAP[cue.sfx];
    const vol = cue.volume ?? def.volume;
    const dur = cue.durationInFrames ?? def.durationInFrames;
    return (
      <Sequence
        key={`sfx-${i}-${cue.sfx}-${cue.frame}`}
        from={cue.frame}
        durationInFrames={dur}
      >
        <Audio src={staticFile(path)} startFrom={0} volume={vol} />
      </Sequence>
    );
  });

// ─── renderTitleCards — itera array de TitleCardCue + DevDraggable ──────────
export const renderTitleCards = (cards: TitleCardCue[] = []): React.ReactNode =>
  cards.map((tc, i) => {
    const dur = Math.max(1, tc.end - tc.start);
    const withSfx = tc.withSfx !== false;
    const id = `tc-${i}-${tc.line2.slice(0, 12).replace(/\s+/g, "-").toLowerCase()}`;
    const isTopLeft = tc.position === "top-left";
    const initTop = tc.top ?? (isTopLeft ? 540 : 1380);
    const initLeft = tc.left ?? (isTopLeft ? 60 : 200);
    const initWidth = tc.width ?? (isTopLeft ? 600 : 680);

    return (
      <Sequence key={id} from={tc.start} durationInFrames={dur}>
        {withSfx ? (
          <Audio
            src={staticFile(SFX_MAP.title_card)}
            startFrom={0}
            volume={SFX_DEFAULTS.title_card.volume}
          />
        ) : null}
        <DevDraggable
          id={id}
          label={`title: ${tc.line2}`}
          initialTop={initTop}
          initialLeft={initLeft}
          initialWidth={initWidth}
        >
          {(p) => (
            <TitleCard
              line1={tc.line1}
              line2={tc.line2}
              durationFrames={dur}
              exerciseDelayFrames={tc.exerciseDelayFrames}
              position={tc.position}
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>
    );
  });
