import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
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
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { Caption } from "../components/Caption";
import { CognitiveZoom } from "../components/CognitiveZoom";
import { DevDraggable, DevDraggableProvider, DevHUD } from "../components/DevDraggable";
import { loadCaptionFile } from "../lib/whisper";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});
const { fontFamily: anton } = loadAnton();

// ─── Types ────────────────────────────────────────────────────────────────────
export type LegDayReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
  quadAnatomySrc?: string;      // "legday/quad_anatomy.png"
  hamstringAnatomySrc?: string; // "legday/hamstring_anatomy.png"
};

// ─── Beat map (seconds) ───────────────────────────────────────────────────────
const BEATS = {
  agachamento: { start: 8.0,  end: 22.0 },
  extensora:   { start: 22.0, end: 30.5 },
  flexora:     { start: 30.5, end: 44.2 },
  stiff:       { start: 44.2, end: 56.2 },
  panturrilha: { start: 56.2, end: 61.8 },
};

// Thumbnails com labels para o intro grid
type ThumbData = { src: string; sets: string; exercise: string };
const THUMB_DATA: ThumbData[] = [
  { src: "legday/thumb_agachamento.jpg", sets: "2 × FALHAR", exercise: "AGACHAMENTO" },
  { src: "legday/thumb_extensora.jpg",   sets: "3 × FALHAR", exercise: "EXTENSORA"   },
  { src: "legday/thumb_flexora.jpg",     sets: "3 × FALHAR", exercise: "FLEXORA"     },
  { src: "legday/thumb_stiff.jpg",       sets: "2 × FALHAR", exercise: "STIFF"       },
  { src: "legday/thumb_panturrilha.jpg", sets: "3 × SÉRIES", exercise: "PANTURRILHA" },
];

// Caption yellow overrides
const COLOR_OVERRIDES: Record<string, string> = {
  MINUTOS:    "#FFD700",
  FALHA:      "#FFD700",
  FALHAR:     "#FFD700",
  CONTROLADA: "#FFD700",
  ESTOURANDO: "#FFD700",
  FUNCIONA:   "#FFD700",
};

// ─── useCaptions hook ─────────────────────────────────────────────────────────
const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading LegDay captions"));

  useEffect(() => {
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => {
        setCaptions(caps);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [captionsJson, continueRender, cancelRender, handle]);

  return captions;
};

// ─── ThumbnailGridIntro ───────────────────────────────────────────────────────
// Nippard style: 2+3 thumbnails borrados no topo, aparecem progressivamente
// Dura enquanto o gancho está no ar (0 a ~8.6s)
type ThumbnailGridIntroProps = {
  thumbnails: ThumbData[];
  durationFrames: number;
};

const ThumbnailGridIntro: React.FC<ThumbnailGridIntroProps> = ({
  thumbnails,
  durationFrames,
}) => {
  const frame = useCurrentFrame();

  // ── Grupo 1: top 2 aparecem JUNTOS (frame 0)
  // ── Grupo 2: bottom 3 aparecem JUNTOS (frame 16)
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
  // índice 0,1 = top | 2,3,4 = bottom
  const entries = [top2Progress, top2Progress, bot3Progress, bot3Progress, bot3Progress];

  const fadeOut = interpolate(frame, [durationFrames - 4, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const row1 = thumbnails.slice(0, 2);
  const row2 = thumbnails.slice(2, 5);

  const cardWrapper = (idx: number, w: number, h: number): React.CSSProperties => ({
    position: "relative",
    opacity: Math.min(entries[idx], fadeOut),
    transform: `scale(${interpolate(entries[idx], [0, 1], [0.86, 1])})`,
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

  // Mini label — versão compacta do TitleCard (texto NÍTIDO sobre o blur)
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
      {/* Linha 1 — 2 cards JUNTOS */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {row1.map((thumb, i) => (
          <div key={i} style={cardWrapper(i, 172, 210)}>
            {/* blur no container inteiro — imagem + texto juntos, nada legível */}
            <div style={{ width: "100%", height: "100%", position: "relative", filter: "blur(5px) brightness(0.58)" }}>
              <Img src={staticFile(thumb.src)} style={imgStyle} />
              <CardLabel sets={thumb.sets} exercise={thumb.exercise} />
            </div>
          </div>
        ))}
      </div>

      {/* Linha 2 — 3 cards JUNTOS */}
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

// ─── TitleCard — Nippard style ────────────────────────────────────────────────
// Linha 1 (séries): Montserrat 900 italic #FFD700 — entra primeiro (frame 0→10)
// Linha 2 (exercício): Montserrat 900 bold #FFF — entra 8 frames depois (frame 8→18)
// Linha 3 (pill): entra 14 frames depois
type TitleCardProps = {
  sets: string;
  exercise: string;
  durationFrames: number;
  exerciseDelayFrames?: number; // frames até linha branca entrar (default 8)
  position?: "center-bottom" | "top-left"; // default "center-bottom" (determina TAMANHO)
  // Overrides DevDraggable (vencem o position preset pra POSIÇÃO):
  top?: number;
  left?: number;
  width?: number;
};

const TitleCard: React.FC<TitleCardProps> = ({ sets, exercise, durationFrames, exerciseDelayFrames = 8, position = "center-bottom", top, left, width }) => {
  const frame = useCurrentFrame();

  const setsProgress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exerciseProgress = interpolate(frame, [exerciseDelayFrames, exerciseDelayFrames + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

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

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        fontFamily: montserrat,
      }}
    >
      {/* Linha 1 — séries em amarelo */}
      <div
        style={{
          fontSize: setsSize,
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
        {sets}
      </div>

      {/* Linha 2 — exercício em branco */}
      <div
        style={{
          fontSize: exerciseSize,
          fontWeight: 900,
          fontStyle: "normal",
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
        {exercise}
      </div>
    </div>
  );
};

// ─── WhitePill ────────────────────────────────────────────────────────────────
type PillProps = {
  label: string;
  durationFrames: number;
};

const WhitePill: React.FC<PillProps> = ({ label, durationFrames }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [14, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const fadeOut = interpolate(frame, [durationFrames - 8, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 430,
        left: 60,
        opacity: Math.min(progress, fadeOut),
        transform: `translateY(${interpolate(progress, [0, 1], [10, 0])}px)`,
        background: "white",
        border: "2px solid #333",
        borderRadius: 8,
        padding: "8px 20px",
        fontFamily: montserrat,
        fontWeight: 700,
        fontSize: 28,
        textTransform: "uppercase",
        color: "#111",
        letterSpacing: 0.5,
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
      }}
    >
      {label}
    </div>
  );
};

// ─── AnatomyOverlay ───────────────────────────────────────────────────────────
// Caixa branca flutuante Nippard style — canto superior direito
// Scale in + fade out
type AnatomyOverlayProps = {
  imageSrc: string;
  label?: string;
  durationFrames: number;
  top?: number;
  left?: number;
  right?: number;
  width?: number;
  aspectRatio?: string; // e.g. "9/16" para reels format
};

const AnatomyOverlay: React.FC<AnatomyOverlayProps> = ({
  imageSrc,
  label,
  durationFrames,
  top = 140,
  left,
  right = 40,
  width = 260,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const fadeOut = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isLeft = left !== undefined;
  const wrapperPos: React.CSSProperties = isLeft
    ? { top, left }
    : { top, right };
  const origin = isLeft ? "top left" : "top right";

  return (
    <div
      style={{
        position: "absolute",
        ...wrapperPos,
        opacity: Math.min(progress, fadeOut),
        transform: `scale(${interpolate(progress, [0, 1], [0.82, 1])})`,
        transformOrigin: origin,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          width,
          aspectRatio,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/\.(mp4|mov|webm|m4v)$/i.test(imageSrc) ? (
          <Video
            src={staticFile(imageSrc)}
            muted
            style={{
              width: "100%",
              height: aspectRatio ? "100%" : undefined,
              objectFit: aspectRatio ? "cover" : undefined,
              borderRadius: 8,
              display: "block",
              flex: aspectRatio ? 1 : undefined,
              minHeight: 0,
            }}
          />
        ) : (
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: aspectRatio ? "100%" : undefined,
              objectFit: aspectRatio ? "cover" : undefined,
              borderRadius: 8,
              display: "block",
              flex: aspectRatio ? 1 : undefined,
              minHeight: 0,
            }}
          />
        )}
        {label ? (
          <div
            style={{
              fontFamily: montserrat,
              fontWeight: 700,
              fontSize: 18,
              color: "#1A2B4A",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 1,
              paddingTop: 6,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const LegDayReel: React.FC<LegDayReelProps> = ({
  videoSrc,
  captionsJson,
  quadAnatomySrc,
  hamstringAnatomySrc,
}) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions(captionsJson);

  const f = (sec: number) => Math.round(sec * fps);
  const dur = (beat: { start: number; end: number }) => f(beat.end - beat.start);

  const zoomSegments = [
    // Gancho — punch zoom (thumbnail grid)
    { start: 0,    end: 0.3,  from: 1.0,  to: 1.15 },
    { start: 0.3,  end: 0.8,  from: 1.15, to: 1.0  },
    // Agachamento entry
    { start: 8.0,  end: 8.5,  from: 1.0,  to: 1.08 },
    // Extensora entry
    { start: 22.0, end: 22.5, from: 1.08, to: 1.0  },
    { start: 22.0, end: 22.7, from: 1.0,  to: 1.08 },
    // Revelação anatomy quad — zoom out lento (PDF spec: 1.05→1.0 em 1.0s)
    { start: 26.5, end: 27.5, from: 1.08, to: 1.0  },
    // "essa fase é sempre quando o músculo cresce" — punch médio
    { start: 38.0, end: 38.3, from: 1.08, to: 1.12 },
    { start: 38.3, end: 38.8, from: 1.12, to: 1.08 },
    // Stiff entry
    { start: 44.2, end: 45.2, from: 1.08, to: 1.0  },
    // Revelação anatomy posterior — zoom out lento
    { start: 47.5, end: 48.5, from: 1.05, to: 1.0  },
    // CTA — zoom in final lento
    { start: 61.8, end: 66.1, from: 1.0,  to: 1.06 },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DevDraggableProvider>
      <CognitiveZoom segments={zoomSegments}>
        <AbsoluteFill>
          <Video
            src={staticFile(videoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </CognitiveZoom>

      {/* ── MÚSICA DE FUNDO ──────────────────────────────────── */}
      <Audio src={staticFile("new sfx/music.mp3")} volume={0.08} />

      {/* ── SFX GANCHO — grind_intro (2 entradas dos cards) ── */}
      <Sequence from={0}><Audio src={staticFile("new sfx/grind_intro.mp3")} volume={0.5} /></Sequence>
      <Sequence from={16}><Audio src={staticFile("new sfx/grind_intro.mp3")} volume={0.5} /></Sequence>

      {/* ── SFX TITLE CARDS — amarelo / branco ───────────────── */}
      {/* Agachamento: frame 188 (amarelo) / 215 (branco) */}
      <Sequence from={188}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      <Sequence from={215}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      {/* Extensora: frame 672 / 699 */}
      <Sequence from={672}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      <Sequence from={699}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      {/* Flexora: frame 915 / 942 */}
      <Sequence from={915}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      <Sequence from={942}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      {/* Stiff: frame 1273 / 1300 */}
      <Sequence from={1273}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      <Sequence from={1300}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      {/* Panturrilha: frame 1610 / 1637 */}
      <Sequence from={1610}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>
      <Sequence from={1637}><Audio src={staticFile("new sfx/card.MP3")} volume={0.5} /></Sequence>

      {/* ── SFX QUAD ANATOMY — card.mp3 em 00:30.06 (frame 906) */}
      <Sequence from={906}><Audio src={staticFile("new sfx/card.mp3")} volume={0.5} /></Sequence>

      {/* ── SFX SELECTION ─────────────────────────────────────── */}
      {/* 00:17.22 → frame 532 */}
      <Sequence from={532}><Audio src={staticFile("new sfx/selection.mp3")} volume={0.5} /></Sequence>
      {/* 00:44.25 → frame 1345 */}
      <Sequence from={1345}><Audio src={staticFile("new sfx/selection.mp3")} volume={0.5} /></Sequence>

      {/* ── SFX ESTIRAMENTO MUSCULAR ──────────────────────────── */}
      {/* 00:50.12 → frame 1512 */}
      <Sequence from={1512}><Audio src={staticFile("new sfx/estiramento_muscular.mp3")} volume={0.3} /></Sequence>
      {/* 00:58.15 → frame 1755 */}
      <Sequence from={1755}><Audio src={staticFile("new sfx/estiramento_muscular.mp3")} volume={0.3} /></Sequence>

      {/* ── LEGENDAS ──────────────────────────────────────────── */}
      <Caption
        captions={captions}
        mode="stable"
        colorOverrides={COLOR_OVERRIDES}
        paddingBottom={230}
        positionOverrides={[
          // Panturrilha — 00:53.18 (53600ms) → 01:00.21 (60700ms): legenda sobe pro topo
          { startMs: 53600, endMs: 60700, top: 302, left: 233, width: 680 },
        ]}
      />

      {/* ── GANCHO — Thumbnail Grid Intro (0 → frame 170 = 00:05.20 timecode SS:FF) ─ */}
      <Sequence from={0} durationInFrames={170}>
        <ThumbnailGridIntro thumbnails={THUMB_DATA} durationFrames={170} />
      </Sequence>

      {/* ── AGACHAMENTO ───────────────────────────────────────── */}
      <Sequence from={f(6.25)} durationInFrames={f(10.06 - 6.25)}>
        <DevDraggable id="agachamento" label="agachamento title" initialTop={1380} initialLeft={200} initialWidth={680}>
          {(p) => (
            <TitleCard
              sets="2 SÉRIES × 6-10 REPS"
              exercise="AGACHAMENTO"
              durationFrames={f(10.06 - 6.25)}
              exerciseDelayFrames={27}
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>

      {/* ── EXTENSORA ─────────────────────────────────────────── */}
      {/* Extensora — entra em 00:22.12 (SS:FF = frame 672), top-left */}
      <Sequence from={672} durationInFrames={114}>
        <DevDraggable id="extensora" label="extensora title" initialTop={540} initialLeft={60} initialWidth={600}>
          {(p) => (
            <TitleCard
              sets="3 SÉRIES × 6-10 REPS"
              exercise="EXTENSORA"
              durationFrames={114}
              exerciseDelayFrames={27}
              position="top-left"
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>

      {/* Quad anatomy overlay — 00:30.05 (905) → 00:33.12 (1002) = 97 frames */}
      {quadAnatomySrc ? (
        <Sequence from={905} durationInFrames={97}>
          <DevDraggable id="quad-anatomy" initialTop={236} initialLeft={70} initialWidth={387} label="quad anatomy">
            {(p) => (
              <AnatomyOverlay
                imageSrc={quadAnatomySrc}
                durationFrames={97}
                top={p.top}
                left={p.left}
                width={p.width}
              />
            )}
          </DevDraggable>
        </Sequence>
      ) : null}

      {/* ── FLEXORA ───────────────────────────────────────────── */}
      <Sequence from={f(BEATS.flexora.start)} durationInFrames={114}>
        <DevDraggable id="flexora" label="flexora title" initialTop={1380} initialLeft={200} initialWidth={680}>
          {(p) => (
            <TitleCard
              sets="3 SÉRIES × 6-10 REPS"
              exercise="FLEXORA"
              durationFrames={114}
              exerciseDelayFrames={27}
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>

      {/* ── STIFF ─────────────────────────────────────────────── */}
      {/* Stiff — entra em 00:42.13 (SS:FF = frame 1273) */}
      <Sequence from={1273} durationInFrames={114}>
        <DevDraggable id="stiff" label="stiff title" initialTop={1380} initialLeft={200} initialWidth={680}>
          {(p) => (
            <TitleCard
              sets="2 SÉRIES × 6-10 REPS"
              exercise="STIFF"
              durationFrames={114}
              exerciseDelayFrames={27}
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>

      {/* Hamstring anatomy overlay — "posterior estourando" (~47.5s–52s) */}
      {hamstringAnatomySrc ? (
        <Sequence from={f(47.5)} durationInFrames={f(4.5)}>
          <AnatomyOverlay
            imageSrc={hamstringAnatomySrc}
            label="POSTERIOR"
            durationFrames={f(4.5)}
          />
        </Sequence>
      ) : null}

      {/* ── PANTURRILHA ───────────────────────────────────────── */}
      {/* Panturrilha — entra em 00:53.20 (SS:FF = frame 1610) */}
      <Sequence from={1610} durationInFrames={114}>
        <DevDraggable id="panturrilha" label="panturrilha title" initialTop={1555} initialLeft={192} initialWidth={680}>
          {(p) => (
            <TitleCard
              sets="3 SÉRIES × 8-15 REPS"
              exercise="PANTURRILHA"
              durationFrames={114}
              exerciseDelayFrames={27}
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>

      {/* HUD único do DevDraggable — só visível na Studio */}
      <DevHUD />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
