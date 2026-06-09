import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { Caption } from "../components/Caption";
import { SonoBarChart } from "../components/SonoBarChart";
import { DevDraggable, DevDraggableProvider, DevHUD } from "../components/DevDraggable";
import { loadCaptionFile } from "../lib/whisper";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});
const { fontFamily: anton } = loadAnton();

// ─── Types ────────────────────────────────────────────────────────────────────
export type InsulinarReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
};

// ─── SFX timing (frames @ 30fps) ─────────────────────────────────────────────
const SFX = {
  grafico1Card:      48,   // 00:01.18
  grafico1Selection: 52,   // 00:01.22 (+4)
  erro1:             94,   // 00:03.04
  grafico2Card:      220,  // 00:07.10
  grafico2Selection: 224,  // 00:07.14 (+4)
  erro2:             259,  // 00:08.19
  estiramento:       539,  // 00:17.29
  estiramentoEnd:    611,  // 00:20.11
  estudoCard:        894,  // 00:29.24
  sonoStart:         770,  // 00:25.20
  sonoEnd:           890,  // 00:29.20
};

// ─── Title card timing ────────────────────────────────────────────────────────
const TC = {
  tc1Start: 368,  // 00:12.08
  tc1End:   445,  // 00:14.25  (77 frames)
};

// ─── Caption yellow overrides ─────────────────────────────────────────────────
const COLOR_OVERRIDES: Record<string, string> = {
  TRAVADA:     "#FFD700",
  ZOADA:       "#FFD700",
  BLOQUEIA:    "#FFD700",
  DIRETO:      "#FFD700",
  NUNCA:       "#FFD700",
  MÚSCULO:     "#FFD700",
  ULTRA:       "#FFD700",
  PROCESSADO:  "#FFD700",
  VILÃO:       "#FFD700",
  AÇÚCAR:      "#FFD700",
  SEMPRE:      "#FFD700",
  "30":        "#FFD700",
  "%":         "#FFD700",
  DESREGULADA: "#FFD700",
  RESOLVE:     "#FFD700",
};

// ─── TitleCard — escalável via DevDraggable (width controla tamanho) ──────────
// width=1000 → fonte base. Menor = menor. Maior = maior.
const TitleCard: React.FC<{
  line1: string;
  line2: string;
  top?: number;
  left?: number;
  width?: number;  // controla escala das fontes
}> = ({ line1, line2, top = 200, left = 40, width = 1000 }) => {
  const frame = useCurrentFrame();
  const slideIn = Math.min(1, frame / 10);
  const scale = width / 1000;

  return (
    <div style={{
      position: "absolute", top, left,
      opacity: slideIn,
      transform: `translateX(${(1 - slideIn) * -60}px)`,
      fontFamily: montserrat,
      width,
    }}>
      <div style={{
        fontSize: Math.round(48 * scale),
        fontWeight: 900, fontStyle: "italic",
        color: "#FFD700", textTransform: "uppercase",
        textShadow: "0 4px 24px rgba(0,0,0,0.85)",
        lineHeight: 1, letterSpacing: 0.5,
      }}>
        {line1}
      </div>
      <div style={{
        fontSize: Math.round(96 * scale),
        fontWeight: 900, color: "#FFFFFF",
        textTransform: "uppercase",
        textShadow: "0 4px 24px rgba(0,0,0,0.85)",
        lineHeight: 1.05, letterSpacing: -1, marginTop: 4,
      }}>
        {line2}
      </div>
    </div>
  );
};

// ─── useCaptions ─────────────────────────────────────────────────────────────
const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading InsulinarReel captions"));

  useEffect(() => {
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => { setCaptions(caps); continueRender(handle); })
      .catch((err) => cancelRender(err));
  }, [captionsJson, continueRender, cancelRender, handle]);

  return captions;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export const InsulinarReel: React.FC<InsulinarReelProps> = ({
  videoSrc,
  captionsJson,
}) => {
  const captions = useCaptions(captionsJson);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DevDraggableProvider>

      {/* ── Vídeo (gráficos já embutidos pelo CapCut) ── */}
      <Video
        src={staticFile(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* ── Chill.MP3 — música de fundo ── */}
      <Audio src={staticFile("new sfx/Chill.MP3")} volume={0.07} startFrom={0} />

      {/* ════ SFX Gráfico 1 — 00:01.18 ════ */}
      <Sequence from={SFX.grafico1Card} durationInFrames={13}>
        <Audio src={staticFile("new sfx/card.MP3")} startFrom={0} volume={0.5} />
      </Sequence>
      <Sequence from={SFX.grafico1Selection} durationInFrames={26}>
        <Audio src={staticFile("new sfx/Selection.MP3")} startFrom={0} volume={0.5} />
      </Sequence>

      {/* ════ SFX Error 1 — 00:03.04 ════ */}
      <Sequence from={SFX.erro1} durationInFrames={13}>
        <Audio src={staticFile("new sfx/error.MP3")} startFrom={0} volume={0.85} />
      </Sequence>

      {/* ════ SFX Gráfico 2 — 00:07.10 ════ */}
      <Sequence from={SFX.grafico2Card} durationInFrames={13}>
        <Audio src={staticFile("new sfx/card.MP3")} startFrom={0} volume={0.5} />
      </Sequence>
      <Sequence from={SFX.grafico2Selection} durationInFrames={26}>
        <Audio src={staticFile("new sfx/Selection.MP3")} startFrom={0} volume={0.5} />
      </Sequence>

      {/* ════ SFX Error 2 — 00:08.19 ════ */}
      <Sequence from={SFX.erro2} durationInFrames={13}>
        <Audio src={staticFile("new sfx/error.MP3")} startFrom={0} volume={0.85} />
      </Sequence>

      {/* ════ SFX Estiramento muscular — 00:17.29 → 00:20.11 ════ */}
      <Sequence from={SFX.estiramento} durationInFrames={SFX.estiramentoEnd - SFX.estiramento}>
        <Audio src={staticFile("new sfx/estiramento_muscular.MP3")} startFrom={0} volume={0.3} />
      </Sequence>

      {/* ════ Title card — 00:12.08 → 00:14.25 ════ */}
      <Sequence from={TC.tc1Start} durationInFrames={TC.tc1End - TC.tc1Start}>
        <Audio src={staticFile("new sfx/card.MP3")} startFrom={0} volume={0.5} />
        <TitleCard line1="INSULINA ALTA =" line2="MODO ESTOQUE" top={200} left={40} />
      </Sequence>

      {/* ════ SFX Gráfico Sono — 00:25.20 ════ */}
      <Sequence from={SFX.sonoStart} durationInFrames={13}>
        <Audio src={staticFile("new sfx/card.MP3")} startFrom={0} volume={0.5} />
      </Sequence>
      <Sequence from={SFX.sonoStart + 4} durationInFrames={26}>
        <Audio src={staticFile("new sfx/Selection.MP3")} startFrom={0} volume={0.5} />
      </Sequence>

      {/* ════ Title card Sono — 00:26.01 → +3s (90 frames) ════ */}
      <Sequence from={781} durationInFrames={90}>
        <Audio src={staticFile("new sfx/card.MP3")} startFrom={0} volume={0.5} />
        <DevDraggable
          id="tc-sono"
          label="title card sono"
          initialTop={120}
          initialLeft={40}
          initialWidth={1000}
        >
          {(p) => (
            <TitleCard
              line1="NOITE MAL DORMIDA ="
              line2="PIORA DA SENSIBILIDADE INSULÍNICA"
              top={p.top}
              left={p.left}
              width={p.width}
            />
          )}
        </DevDraggable>
      </Sequence>

      {/* ════ Gráfico Sono — 00:25.20 → 00:29.20 ════ */}
      <Sequence from={SFX.sonoStart} durationInFrames={SFX.sonoEnd - SFX.sonoStart}>
        <DevDraggable
          id="sono-chart-reel"
          label="gráfico sono"
          initialTop={666}
          initialLeft={141}
          initialWidth={735}
        >
          {(p) => <SonoBarChart top={p.top} left={p.left} width={p.width} />}
        </DevDraggable>
      </Sequence>

      {/* ════ SFX Estudo — 00:29.24 ════ */}
      <Sequence from={SFX.estudoCard} durationInFrames={13}>
        <Audio src={staticFile("new sfx/card.MP3")} startFrom={0} volume={0.5} />
      </Sequence>

      {/* ════ SFX Escrita — 00:30.00 ════ */}
      <Sequence from={900} durationInFrames={60}>
        <Audio src={staticFile("new sfx/escrita.mp3")} startFrom={0} volume={0.5} />
      </Sequence>

      {/* ── Legendas — mode="stable" para não piscar ── */}
      <Caption
        captions={captions}
        colorOverrides={COLOR_OVERRIDES}
        mode="stable"
      />

      <DevHUD />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
