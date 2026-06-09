// ═══════════════════════════════════════════════════════════════════════════
// MitoVerdade — Template para reels de desmistificação / cortes alternados.
// Base: LegDayReel.
//
// Slots aceitos via props (ver `MitoVerdadeProps`):
//   - videoSrc, captionsJson, musicSrc, musicVolume
//   - colorOverrides (palavras destaque amarelas)
//   - sfxCues
//   - thumbnails (opcional — se presente, renderiza ThumbnailGridIntro 2+3)
//   - thumbnailDurationFrames (default 170)
//   - titleCards (Nippard style com DevDraggable, suporta center-bottom | top-left)
//   - zoomSegments (CognitiveZoom — opcional)
//
// Regra Nippard: 1 elemento dominante por vez. NÃO empilhar overlays.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Caption } from "../../components/Caption";
import { CognitiveZoom } from "../../components/CognitiveZoom";
import { DevDraggableProvider } from "../../components/DevDraggable";
import { StudioOverlayTools } from "../../components/StudioOverlayEditor";
import {
  montserrat,
  renderSfxCues,
  renderTitleCards,
  useCaptions,
} from "./shared";
import type { CommonProps, ThumbData, ZoomSegment } from "./types";

export type MitoVerdadeProps = CommonProps & {
  thumbnails?: ThumbData[];
  thumbnailDurationFrames?: number; // default 170 (~5.7s)
  zoomSegments?: ZoomSegment[];
};

// ─── ThumbnailGridIntro (idêntico ao LegDay — 2+3 layout) ───────────────────
const ThumbnailGridIntro: React.FC<{
  thumbnails: ThumbData[];
  durationFrames: number;
}> = ({ thumbnails, durationFrames }) => {
  const frame = useCurrentFrame();

  const top2Progress = interpolate(frame, [0, 11], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const bot3Progress = interpolate(frame, [16, 27], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const entries = [top2Progress, top2Progress, bot3Progress, bot3Progress, bot3Progress];

  const fadeOut = interpolate(frame, [durationFrames - 4, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const row1 = thumbnails.slice(0, 2);
  const row2 = thumbnails.slice(2, 5);

  const cardWrapper = (idx: number, w: number, h: number): React.CSSProperties => ({
    position: "relative",
    opacity: Math.min(entries[idx] ?? 1, fadeOut),
    transform: `scale(${interpolate(entries[idx] ?? 1, [0, 1], [0.86, 1])})`,
    width: w,
    height: h,
    borderRadius: 16,
    overflow: "hidden",
    border: "3px solid rgba(255,255,255,0.88)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    flexShrink: 0,
  });

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scale(1.12)",
  };

  const CardLabel: React.FC<{ sets: string; exercise: string }> = ({ sets, exercise }) => (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        fontFamily: montserrat,
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          fontStyle: "italic",
          color: "#FFD700",
          textTransform: "uppercase",
          textShadow: "0 2px 6px rgba(0,0,0,0.95)",
          lineHeight: 1,
          letterSpacing: 0.5,
        }}
      >
        {sets}
      </div>
      <div
        style={{
          fontSize: 19,
          fontWeight: 900,
          color: "#FFFFFF",
          textTransform: "uppercase",
          textShadow: "0 2px 8px rgba(0,0,0,0.95)",
          lineHeight: 1,
          letterSpacing: -0.5,
          marginTop: 2,
        }}
      >
        {exercise}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "0 20px",
      }}
    >
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {row1.map((thumb, i) => (
          <div key={i} style={cardWrapper(i, 172, 210)}>
            <div style={{ width: "100%", height: "100%", position: "relative", filter: "blur(5px) brightness(0.58)" }}>
              <Img src={staticFile(thumb.src)} style={imgStyle} />
              <CardLabel sets={thumb.sets} exercise={thumb.exercise} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 22, justifyContent: "center" }}>
        {row2.map((thumb, i) => (
          <div key={i} style={cardWrapper(i + 2, 158, 196)}>
            <div style={{ width: "100%", height: "100%", position: "relative", filter: "blur(5px) brightness(0.58)" }}>
              <Img src={staticFile(thumb.src)} style={imgStyle} />
              <CardLabel sets={thumb.sets} exercise={thumb.exercise} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Composition ─────────────────────────────────────────────────────────────
export const MitoVerdade: React.FC<MitoVerdadeProps> = ({
  videoSrc,
  captionsJson,
  musicSrc = "new sfx/music.mp3",
  musicVolume = 0.08,
  colorOverrides,
  sfxCues = [],
  titleCards = [],
  thumbnails,
  thumbnailDurationFrames = 170,
  zoomSegments,
}) => {
  const captions = useCaptions(captionsJson, "Loading MitoVerdade captions");

  const videoLayer = (
    <AbsoluteFill>
      <Video
        src={staticFile(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DevDraggableProvider>
        {zoomSegments && zoomSegments.length > 0 ? (
          <CognitiveZoom segments={zoomSegments}>{videoLayer}</CognitiveZoom>
        ) : (
          videoLayer
        )}

        {/* Música */}
        <Audio src={staticFile(musicSrc)} volume={musicVolume} />

        {/* SFX cues */}
        {renderSfxCues(sfxCues)}

        {/* Thumbnail intro (opcional) */}
        {thumbnails && thumbnails.length > 0 ? (
          <Sequence from={0} durationInFrames={thumbnailDurationFrames}>
            <ThumbnailGridIntro
              thumbnails={thumbnails}
              durationFrames={thumbnailDurationFrames}
            />
          </Sequence>
        ) : null}

        {/* Title cards Nippard */}
        {renderTitleCards(titleCards)}

        {/* Legendas */}
        <Caption
          captions={captions}
          mode="stable"
          colorOverrides={colorOverrides}
          paddingBottom={230}
        />

        <StudioOverlayTools />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
