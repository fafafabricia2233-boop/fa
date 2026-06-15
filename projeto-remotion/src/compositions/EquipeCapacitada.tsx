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
import { GoldCornerAccent, GoldFlare, GoldPop, GoldSweep } from "../components/NewHairMotions";
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
  const captions = useCaptions(captionsJson, "Loading EquipeCapacitada captions");

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080c", overflow: "hidden" }}>
      <DevDraggableProvider>
        {/* Vídeo base — sempre visível */}
        <AbsoluteFill>
          <Video
            src={staticFile(videoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

        {/* ── Custom motions New Hair — abaixo da zona do rosto ── */}

        {/* Frame 282 "pop": ponto dourado com anel expansivo */}
        <Sequence from={282} durationInFrames={22}>
          <GoldPop durationFrames={22} />
        </Sequence>

        {/* Frame 1005 "whoosh": linha dourada varrendo esquerda→direita */}
        <Sequence from={1005} durationInFrames={28}>
          <GoldSweep durationFrames={28} />
        </Sequence>

        {/* Frame 1785 "whoosh": flare deslizante anuncia o title card (frame 1788) */}
        <Sequence from={1785} durationInFrames={20}>
          <GoldFlare durationFrames={20} />
        </Sequence>

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
