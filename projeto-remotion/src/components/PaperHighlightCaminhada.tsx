import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"] });

// ── Texto dividido em 3 partes ────────────────────────────────────────────────
const BEFORE =
  "Avaliamos o efeito da caminhada pós-prandial na resposta glicêmica após refeições com " +
  "diferentes características. Vinte e um voluntários jovens e saudáveis participaram de um de " +
  "dois estudos randomizados com medidas repetidas. O Estudo 1 (10 participantes) avaliou os " +
  "efeitos de 30 minutos de caminhada rápida após refeições com diferentes teores de " +
  "carboidratos (CHO) (0,75 ou 1,5 g de CHO por kg de peso corporal). O Estudo 2 (11 " +
  "participantes) avaliou os efeitos de 30 minutos de caminhada rápida após o consumo de uma " +
  "refeição mista ou uma bebida com CHO com teor absoluto de CHO equivalente (75 g). A " +
  "caminhada rápida pós-prandial reduziu substancialmente ( p < 0,009) o pico de glicose em " +
  "ambos os estudos, sem diferenças significativas entre as condições. Ao avaliar a resposta " +
  "glicêmica ao longo das duas horas após a refeição, a caminhada pós-prandial foi mais eficaz " +
  "após o consumo de um teor de CHO menor (Estudo 1) e igualmente eficaz após uma refeição " +
  "mista ou uma bebida com CHO (Estudo 2), embora valores de glicose mais elevados tenham " +
  "sido observados com o consumo da bebida com CHO. ";

const HIGHLIGHT_WORDS = [
  "Nossos", "resultados", "mostram", "que", "uma", "sessão", "de",
  "caminhada", "rápida", "de", "30", "minutos", "após", "as",
  "refeições", "melhora", "a", "resposta", "glicêmica",
];

const AFTER =
  " após refeições com diferentes teores de carboidratos e composição de macronutrientes, " +
  "com implicações para a prescrição de exercícios pós-prandiais em situações da vida diária.";

// ── Timing ────────────────────────────────────────────────────────────────────
const FADE_IN_END   = 10;
const HIGHLIGHT_START = 18;
const HIGHLIGHT_END   = 95;  // 77 frames / 19 palavras ≈ 4 frames por palavra

export const PaperHighlightCaminhada: React.FC<{
  top?: number;
  left?: number;
}> = ({ top = 60, left = 60 }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordCount = HIGHLIGHT_WORDS.length;
  const wordsVisible = interpolate(
    frame,
    [HIGHLIGHT_START, HIGHLIGHT_END],
    [0, wordCount],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: fadeIn,
        fontFamily,
        width: 960,
      }}
    >
      {/* CARD */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 4,
          padding: "28px 32px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}
      >
        {/* Título "Resumo" */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#222",
            marginBottom: 10,
            letterSpacing: 0.2,
          }}
        >
          Resumo
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#ccc",
            marginBottom: 18,
          }}
        />

        {/* Corpo do texto */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "#111",
            lineHeight: 1.7,
            textAlign: "justify",
          }}
        >
          {/* Texto antes do highlight */}
          {BEFORE}

          {/* Palavras com highlight progressivo */}
          {HIGHLIGHT_WORDS.map((word, i) => {
            const highlighted = i < wordsVisible;
            return (
              <span
                key={i}
                style={{
                  background: highlighted
                    ? "rgba(255, 215, 0, 0.55)"
                    : "transparent",
                  padding: "1px 0",
                  borderRadius: 2,
                }}
              >
                {word}
                {i < HIGHLIGHT_WORDS.length - 1 ? " " : ""}
              </span>
            );
          })}

          {/* Texto depois do highlight */}
          {AFTER}
        </div>
      </div>
    </div>
  );
};
