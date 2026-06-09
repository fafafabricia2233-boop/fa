import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"] });

// ── Imagem original: 697×509px exibida a width=960 → scale=1.377 → height≈701px
//
// Frase alvo (últimas 3 linhas visíveis):
//   Linha 1 (parcial, final da linha): "e indivíduos que praticam TR para"
//   Linha 2 (completa):                "preservar a massa muscular durante a perda de peso devem evitar déficits energéticos superiores a"
//   Linha 3 (parcial, início):         "500 kcal · dia⁻¹ ."
//
// Coordenadas em display px (width=960):
const LINES = [
  { y: 597, h: 32, xStart: 570, maxW: 390 }, // "e indivíduos que praticam TR para"
  { y: 630, h: 32, xStart:   0, maxW: 960 }, // "preservar a massa... superiores a"
  { y: 663, h: 32, xStart:   0, maxW: 218 }, // "500 kcal · dia⁻¹ ."
] as const;

const SLIDE_IN_DUR    = 16;  // frames — folha entra da direita
const HIGHLIGHT_START = 20;  // frame em que o grifo começa (relativo ao Sequence)
const LINE_SWEEP_DUR  = 20;  // frames para varrer cada linha
const LINE_DELAY      = 18;  // frames de intervalo entre início de cada linha

export const PaperHighlightMurphy: React.FC<{
  top?: number;
  left?: number;
  width?: number;
}> = ({ top = 619, left = 89, width = 960 }) => {
  const frame = useCurrentFrame();

  // ── Slide da folha (entra da direita) ────────────────────────────────────
  const slideX = interpolate(frame, [0, SLIDE_IN_DUR], [width + 200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fadeIn = interpolate(frame, [0, SLIDE_IN_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Altura da imagem no display
  const imgDisplayHeight = Math.round(509 * (width / 697));

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        opacity: fadeIn,
        transform: `translateX(${slideX}px)`,
        fontFamily,
      }}
    >
      {/* ── Card branco com imagem original ──────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: imgDisplayHeight }}>
          {/* Imagem original — sem cortes */}
          <Img
            src={staticFile("reel07/estudo_murphy.png")}
            style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }}
          />

          {/* ── Grifo linha a linha ─────────────────────────────────────── */}
          {LINES.map((line, idx) => {
            const lineStart = HIGHLIGHT_START + idx * LINE_DELAY;
            const lineEnd   = lineStart + LINE_SWEEP_DUR;

            // Sweep de xStart até xStart+maxW
            const swept = interpolate(frame, [lineStart, lineEnd], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const currentWidth = swept * line.maxW;

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top:    line.y,
                  left:   line.xStart,
                  width:  currentWidth,
                  height: line.h,
                  background: "rgba(255, 215, 0, 0.52)",
                  borderRadius: 2,
                  pointerEvents: "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── URL do estudo ─────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 10,
          fontSize: 18,
          fontWeight: 600,
          color: "#FFFFFF",
          textAlign: "center",
          opacity: 0.88,
          textShadow: "0 2px 8px rgba(0,0,0,0.85)",
          letterSpacing: 0.3,
        }}
      >
        pubmed.ncbi.nlm.nih.gov/34623696
      </div>
    </div>
  );
};
