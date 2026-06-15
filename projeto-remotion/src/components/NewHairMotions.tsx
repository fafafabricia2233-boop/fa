// Motion graphics minimalistas New Hair FUE.
// Paleta: #C9A96E ouro | #0a0a0a preto | #1a2a6c azul
// REGRA: nenhum elemento acima da zona do rosto (y < 700px na composição 1920h).

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const GOLD = "#C9A96E";
const GOLD_GLOW = "rgba(201,169,110,0.9)";
const GOLD_RING = "rgba(201,169,110,0.75)";

// ─── GoldPop ─────────────────────────────────────────────────────────────────
// Ponto dourado com anel expansivo — para SFX "pop".
// Posição: canto inferior-direito, bottom 330px (acima das legendas).
export const GoldPop: React.FC<{ durationFrames?: number }> = ({
  durationFrames = 22,
}) => {
  const frame = useCurrentFrame();

  const dotScale = interpolate(frame, [0, 3, 5, 8], [0, 1.45, 0.82, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotOpacity = interpolate(
    frame,
    [0, 2, durationFrames - 5, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const ringScale = interpolate(frame, [1, durationFrames], [0.5, 4.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const ringOpacity = interpolate(frame, [1, durationFrames - 2], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 64,
        bottom: 330,
        width: 20,
        height: 20,
        pointerEvents: "none",
      }}
    >
      {/* Anel expansivo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `1.5px solid ${GOLD_RING}`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      {/* Segundo anel (delay) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `1px solid ${GOLD_RING}`,
          transform: `translate(-50%, -50%) scale(${interpolate(
            frame,
            [4, durationFrames],
            [0.4, 3.5],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
          )})`,
          opacity: interpolate(frame, [4, durationFrames - 2], [0.55, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      {/* Ponto central */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: GOLD,
          boxShadow: `0 0 22px ${GOLD_GLOW}, 0 0 8px ${GOLD_GLOW}`,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
          opacity: dotOpacity,
        }}
      />
    </div>
  );
};

// ─── GoldSweep ────────────────────────────────────────────────────────────────
// Linha horizontal dourada que varre da esquerda para a direita — para "whoosh".
// Posição: acima da zona de legendas.
export const GoldSweep: React.FC<{
  durationFrames?: number;
  fromRight?: boolean;
}> = ({ durationFrames = 28, fromRight = false }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const opacity = interpolate(
    frame,
    [0, 3, durationFrames - 7, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const lineWidth = progress * 100;

  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 96,
        bottom: 320,
        height: 1.5,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
        display: "flex",
        justifyContent: fromRight ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          width: `${lineWidth}%`,
          height: "100%",
          background: fromRight
            ? `linear-gradient(270deg, transparent 0%, ${GOLD} 10%, ${GOLD} 90%, transparent 100%)`
            : `linear-gradient(90deg, transparent 0%, ${GOLD} 10%, ${GOLD} 90%, transparent 100%)`,
        }}
      />
    </div>
  );
};

// ─── GoldFlare ────────────────────────────────────────────────────────────────
// Reflexo de luz (lens flare minimalista) que desliza horizontalmente.
// Versão mais criativa para o whoosh antes do title card.
export const GoldFlare: React.FC<{ durationFrames?: number }> = ({
  durationFrames = 20,
}) => {
  const frame = useCurrentFrame();

  const xPos = interpolate(frame, [0, durationFrames], [-60, 1140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });
  const opacity = interpolate(
    frame,
    [0, 4, durationFrames - 5, durationFrames],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 318,
        width: "100%",
        height: 3,
        pointerEvents: "none",
        opacity,
        overflow: "hidden",
      }}
    >
      {/* Linha base */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 96,
          right: 96,
          height: 1,
          transform: "translateY(-50%)",
          background: `linear-gradient(90deg, transparent, ${GOLD}88 20%, ${GOLD}88 80%, transparent)`,
        }}
      />
      {/* Ponto de luz deslizante */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: xPos,
          transform: "translateY(-50%)",
          width: 120,
          height: 3,
          background: `radial-gradient(ellipse at center, rgba(255,245,210,0.95) 0%, ${GOLD} 30%, transparent 100%)`,
          borderRadius: 99,
        }}
      />
    </div>
  );
};

// ─── GoldCornerAccent ─────────────────────────────────────────────────────────
// L-brackets dourados nos cantos inferiores — presença discreta durante todo o vídeo.
// fade-in suave nos primeiros 30 frames, fade-out nos últimos 20.
export const GoldCornerAccent: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 20, durationInFrames],
    [0, 0.48, 0.48, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const ARM = 26;
  const T = 1.5;

  const hBar: React.CSSProperties = {
    position: "absolute",
    background: GOLD,
    width: ARM,
    height: T,
    bottom: 0,
  };
  const vBar: React.CSSProperties = {
    position: "absolute",
    background: GOLD,
    width: T,
    height: ARM,
    bottom: 0,
  };

  return (
    <>
      {/* Canto inferior-esquerdo */}
      <div
        style={{
          position: "absolute",
          left: 48,
          bottom: 266,
          width: ARM,
          height: ARM,
          opacity,
          pointerEvents: "none",
        }}
      >
        <div style={{ ...hBar, left: 0 }} />
        <div style={{ ...vBar, left: 0 }} />
      </div>

      {/* Canto inferior-direito */}
      <div
        style={{
          position: "absolute",
          right: 48,
          bottom: 266,
          width: ARM,
          height: ARM,
          opacity,
          pointerEvents: "none",
        }}
      >
        <div style={{ ...hBar, right: 0 }} />
        <div style={{ ...vBar, right: 0 }} />
      </div>
    </>
  );
};
