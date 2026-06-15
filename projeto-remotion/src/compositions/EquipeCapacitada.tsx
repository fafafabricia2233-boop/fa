// ═══════════════════════════════════════════════════════════════════════════
// EquipeCapacitada — Reel New Hair FUE.
// Talking-head: instrumentadora explica por que a equipe enxerga além do
// folículo (caso real de alopecia frontal fibrosante).
//
// Motion graphics MODERADOS (filosofia Nippard — 1 elemento dominante por vez):
//   - Vídeo base sempre visível
//   - Legenda Anton "stable" com destaques dourados (marca New Hair)
//   - Title cards Nippard nos beats-chave
//   - Marca @newhair_fue discreta e fixa no topo
//   - SFX pontuais (card nos títulos, pop/whoosh nas viradas)
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadMontserratLocal } from "../lib/localFonts";
import { Caption } from "../components/Caption";
import { DevDraggableProvider } from "../components/DevDraggable";
import { StudioOverlayTools } from "../components/StudioOverlayEditor";
import { GoldCornerAccent } from "../components/NewHairMotions";
import { renderSfxCues, renderTitleCards, useCaptions } from "./templates/shared";
import type { CommonProps } from "./templates/types";

const { fontFamily: montserrat } = loadMontserratLocal();

// ─── Selo de marca discreto (top, fade-in suave) ─────────────────────────────
const BrandStamp: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: fade * 0.92,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 26px",
          borderRadius: 50,
          background: "rgba(10,10,10,0.42)",
          border: "1px solid rgba(201,169,110,0.55)",
          backdropFilter: "blur(4px)",
          fontFamily: montserrat,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#C9A96E",
            boxShadow: "0 0 10px rgba(201,169,110,0.9)",
          }}
        />
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: "rgba(255,255,255,0.95)",
            textTransform: "lowercase",
          }}
        >
          {handle}
        </span>
      </div>
    </div>
  );
};

export type EquipeCapacitadaProps = CommonProps;

export const EquipeCapacitada: React.FC<EquipeCapacitadaProps> = ({
  videoSrc,
  captionsJson,
  musicSrc = "new sfx/Chill.MP3",
  musicVolume = 0.06,
  colorOverrides,
  sfxCues = [],
  titleCards = [],
}) => {
  const frame = useCurrentFrame();
  const captions = useCaptions(captionsJson, "Loading EquipeCapacitada captions");

  // ── Zoom estratégico nos beats da fala ──────────────────────────────────
  // 8 momentos-chave sincronizados com as legendas.
  // Scale máximo 1.068 (~7%) — sutil mas perceptível.
  // Origin 50% 38%: ancora no rosto (terço superior do quadro portrait).
  const ZF = [
    0,   80,  108, 130, 170, 250,   // beat 1: "mudam tudo"
    410, 545, 600, 640, 700,         // beat 2: "entende de verdade"
    770, 800, 900, 970,              // beat 3: "saúde do couro" (leve)
    1068,1095,1140,1180,             // beat 4: "alopecia frontal fibrosante"
    1190,1204,1221,1260,1400,        // beat 5: "mudou tudo" (pico máximo)
    1500,1765,1788,1830,1870,        // beat 6: "é segurança"
    1954,1979,2050,2100,             // beat 7: "New Hair não é só"
    2200,2261,2299,2360,             // beat 8: "atenção ao paciente"
    2425,2443,2455,2462,             // CTA "operar com você"
  ];
  const ZS = [
    1.000,1.000,1.000,1.048,1.048,1.000,  // beat 1
    1.000,1.030,1.042,1.042,1.000,         // beat 2
    1.000,1.028,1.028,1.000,               // beat 3
    1.000,1.052,1.052,1.000,               // beat 4
    1.000,1.035,1.068,1.068,1.000,         // beat 5
    1.000,1.000,1.045,1.045,1.000,         // beat 6
    1.000,1.050,1.050,1.000,               // beat 7
    1.000,1.035,1.055,1.055,               // beat 8
    1.055,1.055,1.000,1.000,               // CTA
  ];

  const videoScale = interpolate(frame, ZF, ZS, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080c", overflow: "hidden" }}>
      <DevDraggableProvider>
        {/* Vídeo base com zoom estratégico via position/size (sem CSS transform) */}
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile(videoSrc)}
            style={{
              position: "absolute",
              width: `${videoScale * 100}%`,
              height: `${videoScale * 100}%`,
              top: `${-(videoScale - 1) * 38}%`,
              left: `${-(videoScale - 1) * 50}%`,
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>

        {/* Vinheta leve para legibilidade (topo + base) */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Música de fundo discreta — loop para cobrir todo o vídeo */}
        <Audio src={staticFile(musicSrc)} volume={musicVolume} loop />

        {/* SFX pontuais */}
        {renderSfxCues(sfxCues)}

        {/* Marca discreta no topo */}
        <BrandStamp handle="@newhair_fue" />

        {/* Title cards Nippard nos beats-chave */}
        {renderTitleCards(titleCards)}

        {/* L-brackets dourados persistentes nos cantos inferiores */}
        <GoldCornerAccent />

        {/* Legenda Anton stable com destaques */}
        <Caption
          captions={captions}
          mode="stable"
          paddingBottom={260}
          colorOverrides={colorOverrides}
        />

        <StudioOverlayTools />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
