import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"] });

export type PaperHighlightProps = {
  top?: number;
  left?: number;
  width?: number;

  /**
   * Modo "imagem": passa uma screenshot do paper (PNG/JPG).
   * O highlight amarelo varre uma região definida por highlightRect.
   */
  paperSrc?: string;
  /** Retângulo do highlight relativo ao card. Px. */
  highlightRect?: { x: number; y: number; w: number; h: number };

  /**
   * Modo "texto": texto completo do paper. O array highlightWords define
   * quais palavras vão sendo destacadas em sequência (varredura).
   */
  textBefore?: string;
  highlightWords?: string[];
  textAfter?: string;

  /** Título do card. Default: "Conclusions" */
  title?: string;
  /** Frames pra fade-in do card */
  fadeInFrames?: number;
  /** Frame em que começa o highlight */
  highlightStart?: number;
  /** Duração do highlight (frames) */
  highlightDuration?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const PaperHighlight: React.FC<PaperHighlightProps> = ({
  top = 80,
  left = 60,
  width = 960,
  paperSrc,
  highlightRect,
  textBefore,
  highlightWords,
  textAfter,
  title = "Conclusions",
  fadeInFrames = 10,
  highlightStart = 18,
  highlightDuration = 60,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sweep = interpolate(
    frame,
    [highlightStart, highlightStart + highlightDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── MODO IMAGEM ──
  if (paperSrc) {
    return (
      <div
        style={{
          position: "absolute",
          top,
          left,
          width,
          opacity: fadeIn,
        }}
      >
        <div style={{ position: "relative", boxShadow: "0 6px 20px rgba(0,0,0,0.22)" }}>
          <Img
            src={staticFile(paperSrc)}
            style={{ width: "100%", display: "block", borderRadius: 4 }}
          />
          {highlightRect && (
            <div
              style={{
                position: "absolute",
                top: highlightRect.y,
                left: highlightRect.x,
                width: highlightRect.w * sweep,
                height: highlightRect.h,
                background: "rgba(255, 215, 0, 0.45)",
                borderRadius: 2,
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // ── MODO TEXTO ──
  const words = highlightWords ?? [];
  const wordsVisible = sweep * words.length;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        opacity: fadeIn,
        fontFamily,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 4,
          padding: "28px 32px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#222",
            marginBottom: 10,
            letterSpacing: 0.2,
          }}
        >
          <EditableText
            value={title}
            editable={editable}
            onChange={(v) => onTextEdit?.("title", v)}
          />
        </div>
        <div style={{ height: 1, background: "#ccc", marginBottom: 18 }} />
        <div
          style={{
            fontSize: 15,
            fontWeight: 400,
            color: "#111",
            lineHeight: 1.7,
            textAlign: "justify",
          }}
        >
          {textBefore ? (
            <EditableText
              value={textBefore}
              editable={editable}
              onChange={(v) => onTextEdit?.("textBefore", v)}
            />
          ) : null}
          {words.map((word, i) => {
            const on = i < wordsVisible;
            return (
              <span
                key={i}
                style={{
                  background: on ? "rgba(255, 215, 0, 0.55)" : "transparent",
                  padding: "1px 0",
                  borderRadius: 2,
                }}
              >
                <EditableText
                  value={word}
                  editable={editable}
                  onChange={(v) => onTextEdit?.(`highlight${i + 1}`, v)}
                />
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
          {textAfter ? (
            <EditableText
              value={textAfter}
              editable={editable}
              onChange={(v) => onTextEdit?.("textAfter", v)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
