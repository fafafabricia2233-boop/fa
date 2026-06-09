import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  useDelayRender,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { Caption } from "../components/Caption";
import { CognitiveZoom } from "../components/CognitiveZoom";
import { DevDraggable, DevDraggableProvider, DevHUD } from "../components/DevDraggable";
import { loadCaptionFile } from "../lib/whisper";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type HolgReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
};

// ─── Timecodes (SS:FF @ 30fps → frame absoluto) ───────────────────────────────
const DUR = 80; // 00:02.20 = 80 frames

const TC = {
  puxada:          4  * 30 + 20, // 140
  remada:          9  * 30 +  2, // 272
  supino:          15 * 30 +  0, // 450
  elevacao:        20 * 30 + 18, // 618
  desenvolvimento: 24 * 30 + 23, // 743
  triceps:         28 * 30 +  9, // 849
  rosca:           31 * 30 +  3, // 933
};

// SFX pontuais
const SFX_ESTIRAMENTO = 11 * 30 + 23; // 00:11.23 = 353
const SFX_SELECT_2    = 18 * 30 + 19; // 00:18.19 = 559

// ─── Caption yellow overrides ─────────────────────────────────────────────────
const COLOR_OVERRIDES: Record<string, string> = {
  "5":          "#FFD700",
  FREQUÊNCIA:   "#FFD700",
  FREQUENCIA:   "#FFD700",
  SUPERIOR:     "#FFD700",
  PROGRESSÃO:   "#FFD700",
  PROGRESSAO:   "#FFD700",
  VOLUME:       "#FFD700",
  FOFO:         "#FFD700",
  INTENSIDADE:  "#FFD700",
};

// ─── useCaptions ──────────────────────────────────────────────────────────────
const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading HolgReel captions"));

  useEffect(() => {
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => { setCaptions(caps); continueRender(handle); })
      .catch((err) => { cancelRender(err); });
  }, [captionsJson, continueRender, cancelRender, handle]);

  return captions;
};

// ─── TitleCard — LegDay style (texto puro, sem tarja navy) ───────────────────
type TitleCardProps = {
  sets: string;
  exercise: string;
  durationFrames: number;
  top: number;
  left: number;
  width: number;
};

const TitleCard: React.FC<TitleCardProps> = ({
  sets, exercise, durationFrames, top, left, width,
}) => {
  const frame = useCurrentFrame();

  const setsP = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exP = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(frame, [durationFrames - 8, durationFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", top, left, width, fontFamily: montserrat }}>
      <div style={{
        fontSize: 48,
        fontWeight: 900,
        fontStyle: "italic",
        color: "#FFD700",
        textTransform: "uppercase",
        textShadow: "0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.9)",
        lineHeight: 1,
        letterSpacing: 1,
        opacity: Math.min(setsP, fadeOut),
        transform: `translateY(${interpolate(setsP, [0, 1], [16, 0])}px)`,
      }}>
        {sets}
      </div>
      <div style={{
        fontSize: 88,
        fontWeight: 900,
        color: "#FFFFFF",
        textTransform: "uppercase",
        textShadow: "0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.9)",
        lineHeight: 0.95,
        letterSpacing: -2,
        marginTop: 2,
        opacity: Math.min(exP, fadeOut),
        transform: `translateY(${interpolate(exP, [0, 1], [22, 0])}px)`,
      }}>
        {exercise}
      </div>
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const HolgReel: React.FC<HolgReelProps> = ({ videoSrc, captionsJson }) => {
  const captions = useCaptions(captionsJson);

  const zoomSegments = [
    { start: 0,    end: 0.3,  from: 1.0,  to: 1.15 },
    { start: 0.3,  end: 0.8,  from: 1.15, to: 1.0  },
    { start: 9.0,  end: 9.5,  from: 1.0,  to: 1.08 },
    { start: 15.0, end: 15.5, from: 1.08, to: 1.0  },
    { start: 15.0, end: 15.7, from: 1.0,  to: 1.08 },
    { start: 38.0, end: 38.3, from: 1.08, to: 1.12 },
    { start: 38.3, end: 38.8, from: 1.12, to: 1.08 },
    { start: 40.0, end: 42.6, from: 1.0,  to: 1.06 },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DevDraggableProvider>
        <CognitiveZoom segments={zoomSegments}>
          <AbsoluteFill>
            <Video src={staticFile(videoSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </CognitiveZoom>

        {/* ── MÚSICA ──────────────────────────────────────────── */}
        <Audio src={staticFile("new sfx/lofi 3.MP3")} volume={0.08} />

        {/* ── SFX GANCHO — Selection.MP3 (era grind_intro) ───── */}
        <Sequence from={0}>
          <Audio src={staticFile("new sfx/Selection.MP3")} volume={0.5} />
        </Sequence>

        {/* ── SFX PONTUAIS ─────────────────────────────────────── */}
        {/* 00:11.23 — estiramento muscular */}
        <Sequence from={SFX_ESTIRAMENTO}>
          <Audio src={staticFile("new sfx/estiramento_muscular.MP3")} volume={0.3} />
        </Sequence>
        {/* 00:18.19 — selection */}
        <Sequence from={SFX_SELECT_2}>
          <Audio src={staticFile("new sfx/Selection.MP3")} volume={0.5} />
        </Sequence>
        {/* 00:29.28 — estiramento muscular */}
        <Sequence from={29 * 30 + 28}>
          <Audio src={staticFile("new sfx/estiramento_muscular.MP3")} volume={0.3} />
        </Sequence>

        {/* ── SFX TITLE CARDS — alternado entrada_som / grind_intro */}
        <Sequence from={TC.puxada}><Audio src={staticFile("new sfx/entrada_som.mp3")} volume={0.5} /></Sequence>
        <Sequence from={TC.remada}><Audio src={staticFile("new sfx/grind_intro.MP3")} volume={0.5} /></Sequence>
        <Sequence from={TC.supino}><Audio src={staticFile("new sfx/entrada_som.mp3")} volume={0.5} /></Sequence>
        <Sequence from={TC.elevacao}><Audio src={staticFile("new sfx/grind_intro.MP3")} volume={0.5} /></Sequence>
        <Sequence from={TC.desenvolvimento}><Audio src={staticFile("new sfx/entrada_som.mp3")} volume={0.5} /></Sequence>
        <Sequence from={TC.triceps}><Audio src={staticFile("new sfx/grind_intro.MP3")} volume={0.5} /></Sequence>
        <Sequence from={TC.rosca}><Audio src={staticFile("new sfx/entrada_som.mp3")} volume={0.5} /></Sequence>

        {/* ══════════════════════════════════════════════════════
            TITLE CARDS — DevDraggable reativado p/ ajuste fino
        ══════════════════════════════════════════════════════ */}

        {/* 1 — PUXADA ABERTA — frame 140 */}
        <Sequence from={TC.puxada} durationInFrames={DUR}>
          <DevDraggable id="puxada" label="puxada" initialTop={191} initialLeft={123} initialWidth={680}>
            {(p) => <TitleCard sets="3 SÉRIES ATÉ FALHAR" exercise="PUXADA ABERTA" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* 2 — REMADA CURVADA — frame 272 */}
        <Sequence from={TC.remada} durationInFrames={DUR}>
          <DevDraggable id="remada" label="remada" initialTop={98} initialLeft={70} initialWidth={620}>
            {(p) => <TitleCard sets="2 SÉRIES ATÉ FALHAR" exercise="REMADA CURVADA" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* 3 — SUPINO DECLINADO — frame 450 */}
        <Sequence from={TC.supino} durationInFrames={DUR}>
          <DevDraggable id="supino" label="supino" initialTop={1360} initialLeft={411} initialWidth={680}>
            {(p) => <TitleCard sets="3 SÉRIES ATÉ FALHAR" exercise="SUPINO DECLINADO" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* 4 — ELEVAÇÃO LATERAL — frame 618 */}
        <Sequence from={TC.elevacao} durationInFrames={DUR}>
          <DevDraggable id="elevacao" label="elevação" initialTop={1323} initialLeft={89} initialWidth={635}>
            {(p) => <TitleCard sets="2 SÉRIES ATÉ FALHAR" exercise="ELEVAÇÃO LATERAL" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* 5 — DESENVOLVIMENTO — frame 743 */}
        <Sequence from={TC.desenvolvimento} durationInFrames={DUR}>
          <DevDraggable id="desenvolvimento" label="desenvolvimento" initialTop={149} initialLeft={50} initialWidth={680}>
            {(p) => <TitleCard sets="2 SÉRIES ATÉ FALHAR" exercise="DESENVOLVIMENTO" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* 6 — TRÍCEPS PULLEY — frame 849 */}
        <Sequence from={TC.triceps} durationInFrames={DUR}>
          <DevDraggable id="triceps" label="tríceps" initialTop={1324} initialLeft={447} initialWidth={620}>
            {(p) => <TitleCard sets="2 SÉRIES ATÉ FALHAR" exercise="TRÍCEPS PULLEY" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* 7 — ROSCA SCOTT — frame 933 */}
        <Sequence from={TC.rosca} durationInFrames={DUR}>
          <DevDraggable id="rosca" label="rosca" initialTop={268} initialLeft={125} initialWidth={680}>
            {(p) => <TitleCard sets="2 SÉRIES ATÉ FALHAR" exercise="ROSCA SCOTT" durationFrames={DUR} top={p.top} left={p.left} width={p.width} />}
          </DevDraggable>
        </Sequence>

        {/* ── LEGENDAS ─────────────────────────────────────────── */}
        <Caption
          captions={captions}
          mode="stable"
          colorOverrides={COLOR_OVERRIDES}
          paddingBottom={230}
        />

        <DevHUD />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
