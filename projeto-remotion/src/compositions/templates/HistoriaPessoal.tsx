// ═══════════════════════════════════════════════════════════════════════════
// HistoriaPessoal — Template para reels de trajetória / antes-depois.
// Base: PerderPesoReel.
//
// Regras Método Xandoka:
//   - SEM fundo navy bloqueando o vídeo (vídeo base sempre visível).
//   - BeforeAfterCard como protagonista visual quando ativo.
//
// Slots aceitos via props:
//   - videoSrc, captionsJson, musicSrc, musicVolume
//   - colorOverrides
//   - sfxCues
//   - titleCards (opcionais — geralmente Nippard top-left)
//   - beforeAfter (opcional — leftSrc/rightSrc/labels/yOffset/start/end)
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { AbsoluteFill, Audio, Sequence, Video, staticFile } from "remotion";
import { BeforeAfterCard } from "../../components/BeforeAfterCard";
import { Caption } from "../../components/Caption";
import { DevDraggableProvider } from "../../components/DevDraggable";
import { StudioOverlayTools } from "../../components/StudioOverlayEditor";
import {
  renderSfxCues,
  renderTitleCards,
  useCaptions,
} from "./shared";
import type { CommonProps } from "./types";

export type BeforeAfterCue = {
  start: number;
  end: number;
  leftSrc: string;
  rightSrc?: string;
  leftLabel?: string;
  rightLabel?: string;
  yOffset?: number;
  leftObjectPosition?: string;
  rightObjectPosition?: string;
  leftZoom?: number;
  rightZoom?: number;
};

export type HistoriaPessoalProps = CommonProps & {
  beforeAfter?: BeforeAfterCue;
};

export const HistoriaPessoal: React.FC<HistoriaPessoalProps> = ({
  videoSrc,
  captionsJson,
  musicSrc = "new sfx/music.mp3",
  musicVolume = 0.08,
  colorOverrides,
  sfxCues = [],
  titleCards = [],
  beforeAfter,
}) => {
  const captions = useCaptions(captionsJson, "Loading HistoriaPessoal captions");

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080c", overflow: "hidden" }}>
      <DevDraggableProvider>
        {/* Vídeo base — sempre visível, sem navy bloqueando */}
        <AbsoluteFill>
          <Video
            src={staticFile(videoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>

        {/* Vinheta leve para legibilidade da legenda */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.50) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Música */}
        <Audio src={staticFile(musicSrc)} volume={musicVolume} />

        {/* SFX cues */}
        {renderSfxCues(sfxCues)}

        {/* BeforeAfterCard (opcional) */}
        {beforeAfter ? (
          <Sequence
            from={beforeAfter.start}
            durationInFrames={Math.max(1, beforeAfter.end - beforeAfter.start)}
          >
            <BeforeAfterCard
              leftSrc={staticFile(beforeAfter.leftSrc)}
              rightSrc={beforeAfter.rightSrc ? staticFile(beforeAfter.rightSrc) : undefined}
              leftLabel={beforeAfter.leftLabel}
              rightLabel={beforeAfter.rightLabel}
              yOffset={beforeAfter.yOffset ?? 560}
              leftObjectPosition={beforeAfter.leftObjectPosition}
              rightObjectPosition={beforeAfter.rightObjectPosition}
              leftZoom={beforeAfter.leftZoom}
              rightZoom={beforeAfter.rightZoom}
            />
          </Sequence>
        ) : null}

        {/* Title cards (opcionais) */}
        {renderTitleCards(titleCards)}

        {/* Legendas */}
        <Caption
          captions={captions}
          mode="stable"
          paddingBottom={270}
          colorOverrides={colorOverrides}
        />

        <StudioOverlayTools />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
