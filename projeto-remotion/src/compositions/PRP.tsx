// ═══════════════════════════════════════════════════════════════════════════
// PRP — Reel New Hair FUE.
// Explica o plasma rico em plaquetas (PRP) com zooms estratégicos:
//   - Zoom agressivo no início na imagem do PRP (hook visual)
//   - Zooms nos beats técnicos: plaquetas, centrifugação, medicina regenerativa
//   - Legendas Anton com destaques dourados nas palavras-chave
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
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

const BrandStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 0.92], {
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
        opacity,
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
          @newhair_fue
        </span>
      </div>
    </div>
  );
};

export type PRPProps = CommonProps;

export const PRP: React.FC<PRPProps> = ({
  videoSrc,
  captionsJson,
  musicSrc = "new sfx/Chill.MP3",
  musicVolume = 0.02,
  colorOverrides,
  sfxCues = [],
  titleCards = [],
}) => {
  const frame = useCurrentFrame();
  const captions = useCaptions(captionsJson, "Loading PRP captions");

  // ── Zoom estratégico — 5 beats sincronizados com a fala ─────────────────
  //
  // Beat 1 (fr0–145): Hook — "Você deixaria alguém aplicar o seu próprio
  //   sangue no seu COURO CABELUDO?" → zoom rápido na imagem de PRP.
  //   Maior escala do vídeo (1.10) para prender atenção imediata.
  //
  // Beat 2 (fr235–410): "plasma rica em plaquetas... PRP"
  //   → zoom médio para destacar o nome do procedimento.
  //
  // Beat 3 (fr470–760): "coleta sangue... centrifugação"
  //   → zoom técnico acompanhando a explicação do processo.
  //
  // Beat 4 (fr1100–1310): "PRP tem despertado interesse na medicina regenerativa"
  //   → zoom crescente que culmina em "regenerativa".
  //
  // Beat 5 (fr1355–fim): CTA — "já conhecia o PRP?"
  //   → micro-zoom final para CTA.
  //
  // Origin: 50% 38% → ancora no rosto/mãos (upper-mid do frame portrait).

  const ZF = [
    // Beat 1 — hook agressivo na imagem de PRP
    0,   15,  67,  100, 145, 200,
    // Beat 2 — plasma rica em plaquetas / PRP
    235, 260, 317, 370, 410,
    // Beat 3 — coleta sangue / centrifugação
    470, 514, 631, 710, 760,
    // Beat 4 — medicina regenerativa
    1100,1140,1232,1263,1310,
    // Beat 5 — CTA
    1355,1380,1413,
  ];
  const ZS = [
    // Beat 1 — sobe rápido, peak em "sangue/cabeludo", desce em "estranho"
    1.000,1.060,1.100,1.100,1.060,1.000,
    // Beat 2
    1.000,1.060,1.085,1.085,1.000,
    // Beat 3
    1.000,1.045,1.070,1.070,1.000,
    // Beat 4
    1.000,1.055,1.075,1.090,1.000,
    // Beat 5
    1.000,1.060,1.000,
  ];

  const videoScale = interpolate(frame, ZF, ZS, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  // Fator de origem: 50% X, 38% Y (ancora acima do meio, zona do rosto/objeto)
  const OX = 0.50;
  const OY = 0.38;

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080c", overflow: "hidden" }}>
      <DevDraggableProvider>
        {/* Vídeo base com zoom via position/size (sem CSS transform) */}
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile(videoSrc)}
            style={{
              position: "absolute",
              width: `${videoScale * 100}%`,
              height: `${videoScale * 100}%`,
              top: `${-(videoScale - 1) * OY * 100}%`,
              left: `${-(videoScale - 1) * OX * 100}%`,
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>

        {/* Vinheta */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Música em loop */}
        <Audio src={staticFile(musicSrc)} volume={musicVolume} loop />

        {/* SFX */}
        {renderSfxCues(sfxCues)}

        {/* Marca */}
        <BrandStamp />

        {/* Title cards */}
        {renderTitleCards(titleCards)}

        {/* L-brackets dourados */}
        <GoldCornerAccent />

        {/* Legenda */}
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
