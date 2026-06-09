// ═══════════════════════════════════════════════════════════════════════════
// DadoCientifico — Template para reels educativos com dado/gráfico/estudo.
// Base: InsulinarReel.
//
// Slots aceitos via props (ver `DadoCientificoProps`):
//   - videoSrc, captionsJson, musicSrc, musicVolume
//   - colorOverrides (palavras destaque amarelas)
//   - sfxCues (array: card/selection/error/title_card/estiramento/escrita)
//   - titleCards (Nippard style, com DevDraggable)
//   - chartCues (SonoBarChart | InsulinaBarChart | InsulinaBarChartVertical)
//
// CapCut faz o corte. Este template é a camada de polimento.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { AbsoluteFill, Audio, Sequence, Video, staticFile } from "remotion";
import { Caption } from "../../components/Caption";
import { DevDraggable, DevDraggableProvider } from "../../components/DevDraggable";
import { SonoBarChart } from "../../components/SonoBarChart";
import { InsulinaBarChart } from "../../components/InsulinaBarChart";
import { InsulinaBarChartVertical } from "../../components/InsulinaBarChartVertical";
import { StudioOverlayTools } from "../../components/StudioOverlayEditor";
import {
  renderSfxCues,
  renderTitleCards,
  useCaptions,
} from "./shared";
import type { ChartCue, CommonProps } from "./types";

export type DadoCientificoProps = CommonProps & {
  chartCues?: ChartCue[];
};

const renderChart = (cue: ChartCue, idx: number) => {
  const dur = Math.max(1, cue.end - cue.start);
  const id = cue.id ?? `${cue.type.toLowerCase()}-${idx}`;
  return (
    <Sequence key={id} from={cue.start} durationInFrames={dur}>
      <DevDraggable
        id={id}
        label={`chart: ${cue.type}`}
        initialTop={cue.top}
        initialLeft={cue.left}
        initialWidth={cue.width}
      >
        {(p) => {
          if (cue.type === "SonoBarChart") {
            return <SonoBarChart top={p.top} left={p.left} width={p.width} />;
          }
          if (cue.type === "InsulinaBarChart") {
            return <InsulinaBarChart top={p.top} left={p.left} width={p.width} />;
          }
          return <InsulinaBarChartVertical top={p.top} left={p.left} />;
        }}
      </DevDraggable>
    </Sequence>
  );
};

export const DadoCientifico: React.FC<DadoCientificoProps> = ({
  videoSrc,
  captionsJson,
  musicSrc = "new sfx/Chill.MP3",
  musicVolume = 0.07,
  colorOverrides,
  sfxCues = [],
  titleCards = [],
  chartCues = [],
}) => {
  const captions = useCaptions(captionsJson, "Loading DadoCientifico captions");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DevDraggableProvider>
        {/* ── Vídeo base ──────────────────────────────────────────────────── */}
        <Video
          src={staticFile(videoSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* ── Música de fundo ─────────────────────────────────────────────── */}
        <Audio src={staticFile(musicSrc)} volume={musicVolume} startFrom={0} />

        {/* ── SFX cues ───────────────────────────────────────────────────── */}
        {renderSfxCues(sfxCues)}

        {/* ── Title cards (Nippard) ──────────────────────────────────────── */}
        {renderTitleCards(titleCards)}

        {/* ── Chart overlays ─────────────────────────────────────────────── */}
        {chartCues.map(renderChart)}

        {/* ── Legendas ───────────────────────────────────────────────────── */}
        <Caption
          captions={captions}
          colorOverrides={colorOverrides}
          mode="stable"
        />

        <StudioOverlayTools />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
