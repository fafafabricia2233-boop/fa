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
  useVideoConfig,
  useDelayRender,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { Caption } from "../components/Caption";
import { PillBadge } from "../components/PillBadge";
import { DevDraggable, DevDraggableProvider, DevHUD } from "../components/DevDraggable";
import { loadCaptionFile } from "../lib/whisper";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type FeedReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
  estudoSrc: string;
};

// ─── Timecodes (SS:FF @ 30fps → frame absoluto) ──────────────────────────────
const TC = {
  estudo_in:       3  * 30 +  0, // 00:03.00 — StatBar + Paper entram
  estudo_out:     10  * 30 +  5, // 00:10.05 — StatBar + Paper saem
  neon_falta_in:  33  * 30 + 21, // 00:33.21 — TitleCard neon "FALTA DE DISCIPLINA"
  neon_falta_out: 37  * 30 + 17, // 00:37.17
};

// ─── useCaptions ─────────────────────────────────────────────────────────────
const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading FeedReel captions"));

  useEffect(() => {
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => { setCaptions(caps); continueRender(handle); })
      .catch((err) => { cancelRender(err); });
  }, [captionsJson, continueRender, cancelRender, handle]);

  return captions;
};

// ─── Paper overlay — slide da esquerda, grande e centrado ────────────────────
const PAPER_WIDTH = 980;
const PAPER_LEFT  = (1080 - PAPER_WIDTH) / 2; // 50px — centralizado
const PAPER_TOP   = 720;                        // abaixo da zona do rosto

// Imagem original: 664x422. Exibida a 980px → escala 1.4759
// Frase-alvo (4 linhas): y=13–103 na original → y≈19–152 na exibida
// Margem lateral na original: ~14px → ~21px na exibida
const HL_TOP    = 19;   // px dentro da imagem exibida
const HL_HEIGHT = 133;  // 152 - 19
const HL_LEFT   = 21;
const HL_RIGHT  = 21;
const HL_MAX_W  = PAPER_WIDTH - HL_LEFT - HL_RIGHT; // 938px

// Highlight começa depois do slide completar (~22 frames) + 2 de margem
const HIGHLIGHT_START = 26;
const HIGHLIGHT_DUR   = 32; // ~1s pra varrer a frase

const StudyPaper: React.FC<{ imageSrc: string }> = ({ imageSrc }) => {
  const frame = useCurrentFrame();

  // Slide da esquerda
  const slideX = interpolate(frame, [0, 22], [-1180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight progressivo — varre da esquerda pra direita como marca-texto
  const hlProgress = interpolate(
    frame,
    [HIGHLIGHT_START, HIGHLIGHT_START + HIGHLIGHT_DUR],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: PAPER_TOP,
        left: PAPER_LEFT,
        width: PAPER_WIDTH,
        transform: `translateX(${slideX}px)`,
        opacity,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 28px 80px rgba(0,0,0,0.55)",
        border: "3px solid rgba(255,255,255,0.75)",
        fontFamily: montserrat,
      }}
    >
      {/* Imagem + highlight animado por cima */}
      <div style={{ position: "relative" }}>
        <Img
          src={staticFile(imageSrc)}
          style={{ width: "100%", display: "block" }}
        />
        {/* Marca-texto varre da esquerda pra direita sobre a frase-alvo */}
        <div
          style={{
            position: "absolute",
            top: HL_TOP,
            left: HL_LEFT,
            width: HL_MAX_W * hlProgress,
            height: HL_HEIGHT,
            background: "rgba(255, 215, 0, 0.42)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div
        style={{
          background: "#1A2B4A",
          padding: "18px 24px",
          color: "rgba(255,255,255,0.85)",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        University of Liverpool · Whalen et al. · 2019
      </div>
    </div>
  );
};

// ─── CenteredPill — pill branco+azul centralizado horizontalmente ────────────
const CenteredPill: React.FC<{ top: number; text: string; accent: string }> = ({ top, text, accent }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slideY = interpolate(frame, [0, 6], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      opacity: fade,
      transform: `translateY(${-slideY}px)`,
      pointerEvents: "none",
    }}>
      <div style={{
        fontFamily: montserrat,
        fontSize: 46,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        background: "#FFFFFF",
        color: "#1A1A1A",
        border: "2px solid #333",
        borderRadius: 10,
        padding: "18px 34px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}>
        <span>{text}</span>
        <span style={{ color: "#4A9EFF" }}>{accent}</span>
      </div>
    </div>
  );
};

// ─── LegDayTitleCard — mesmo estilo do LegDay (Montserrat 900) ───────────────
// Linha 1: italic #FFD700 — slide-up do frame 0
// Linha 2: bold #FFF     — slide-up do frame 8
const LegDayTitleCard: React.FC<{ line1: string; line2: string; durationFrames: number }> = ({
  line1,
  line2,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const SHADOW = "0 4px 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.9)";

  const p1 = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const p2 = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(frame, [durationFrames - 8, durationFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", top: 264, left: 485, width: 240, fontFamily: montserrat, textAlign: "center" }}>
      {/* Linha 1 — amarelo italic */}
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        fontStyle: "italic",
        color: "#FFD700",
        textTransform: "uppercase",
        textShadow: SHADOW,
        lineHeight: 1,
        letterSpacing: 1,
        opacity: Math.min(p1, fadeOut),
        transform: `translateY(${interpolate(p1, [0, 1], [14, 0])}px)`,
      }}>
        {line1}
      </div>
      {/* Linha 2 — branco bold */}
      <div style={{
        fontSize: 44,
        fontWeight: 900,
        fontStyle: "normal",
        color: "#FFFFFF",
        textTransform: "uppercase",
        textShadow: SHADOW,
        lineHeight: 0.95,
        letterSpacing: -1,
        marginTop: 2,
        opacity: Math.min(p2, fadeOut),
        transform: `translateY(${interpolate(p2, [0, 1], [18, 0])}px)`,
      }}>
        {line2}
      </div>
    </div>
  );
};

// ─── COLOR overrides para legenda amarela ─────────────────────────────────────
const COLOR_OVERRIDES: Record<string, string> = {
  FEED:        "#FFD700",
  "32%":       "#FFD700",
  ESTÍMULO:    "#FFD700",
  ESTIMULO:    "#FFD700",
  DISCIPLINA:  "#FFD700",
  "6":         "#FFD700",
  HORAS:       "#FFD700",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const FeedReel: React.FC<FeedReelProps> = ({
  videoSrc,
  captionsJson,
  duration,
  estudoSrc,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const captions = useCaptions(captionsJson);

  const totalFrames = Math.ceil(duration * fps);
  const estudo_dur = TC.estudo_out - TC.estudo_in;

  return (
    <DevDraggableProvider>
      <AbsoluteFill>

        {/* ── Vídeo principal ───────────────────────────────────────────── */}
        <Video src={staticFile(videoSrc)} style={{ width: "100%", height: "100%" }} />

        {/* ── Música fundo ─────────────────────────────────────────────── */}
        <Audio src={staticFile("feed/musica.mp3")} volume={0.08} />

        {/* ── SFX grind no gancho (frame 0) ────────────────────────────── */}
        <Sequence from={0} durationInFrames={16}>
          <Audio src={staticFile("new sfx/grind_intro.MP3")} volume={0.5} />
        </Sequence>

        {/* ── SFX card/pop no PillBadge ────────────────────────────────── */}
        <Sequence from={TC.estudo_in} durationInFrames={30}>
          <Audio src={staticFile("new sfx/card.MP3")} volume={0.5} />
        </Sequence>

        {/* ── SFX desamacando — paper entra ────────────────────────────── */}
        <Sequence from={TC.estudo_in + 9} durationInFrames={60}>
          <Audio src={staticFile("new sfx/desamacando.MP3")} volume={0.5} />
        </Sequence>

        {/* ── SFX escrita — começa o highlight progressivo ─────────────── */}
        <Sequence from={TC.estudo_in + 9 + HIGHLIGHT_START} durationInFrames={90}>
          <Audio src={staticFile("new sfx/escrita.mp3")} volume={0.6} />
        </Sequence>

        {/* ── SFX ui_pop no encerramento ────────────────────────────────── */}
        <Sequence from={Math.round(33.7 * 30)} durationInFrames={30}>
          <Audio src={staticFile("new sfx/ui_pop.mp3")} volume={0.5} />
        </Sequence>

        {/* ── PillBadge branco + azul — +32% DE CALORIAS — centrado ─────── */}
        <Sequence from={TC.estudo_in} durationInFrames={estudo_dur}>
          <CenteredPill top={564} text="+32%" accent="DE CALORIAS" />
        </Sequence>

        {/* ── TitleCard LegDay "FALTA DE / DISCIPLINA" — 00:33.21 → 00:37.17 ── */}
        <Sequence from={TC.neon_falta_in} durationInFrames={TC.neon_falta_out - TC.neon_falta_in}>
          <LegDayTitleCard
            line1="FALTA DE"
            line2="DISCIPLINA"
            durationFrames={TC.neon_falta_out - TC.neon_falta_in}
          />
        </Sequence>

        {/* ── Paper overlay (estudo) — slide da esquerda, centrado grande ── */}
        <Sequence from={TC.estudo_in + 9} durationInFrames={estudo_dur - 9}>
          <StudyPaper imageSrc={estudoSrc} />
        </Sequence>

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <DevDraggable
          id="logo-stamp"
          label="logo"
          initialTop={48}
          initialLeft={60}
          initialWidth={240}
        >
          {(p) => (
            <div
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                fontFamily: montserrat,
                fontSize: 24,
                fontWeight: 900,
                color: "rgba(255,255,255,0.72)",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              }}
            >
              @xandokaoriginal
            </div>
          )}
        </DevDraggable>

        {/* ── Captions ──────────────────────────────────────────────────── */}
        <Caption
          captions={captions}
          paddingBottom={270}
          colorOverrides={COLOR_OVERRIDES}
          positionOverrides={[
            // Quando StatBar está na tela, subir legenda pra não colidir
            { startMs: Math.round(TC.estudo_in / 30 * 1000), endMs: Math.round(TC.estudo_out / 30 * 1000), paddingBottom: 270 },
          ]}
        />

        <DevHUD />
      </AbsoluteFill>
    </DevDraggableProvider>
  );
};
