import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export type NeonPillProps = {
  /** Texto normal (cinza escuro) */
  label: string;
  /** Texto destaque (azul) */
  accent?: string;
  top?: number;
  /** Centralizado horizontalmente no canvas 1080px se undefined */
  left?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  /** Frames de fade-in. Default: 10 */
  fadeInFrames?: number;
  /** Modo de edicao inline (apenas dev/composer). Default false. */
  editable?: boolean;
  /** Callback quando texto e editado em modo editable */
  onTextEdit?: (key: string, value: string) => void;
};

export const NeonPill: React.FC<NeonPillProps> = ({
  label,
  accent,
  top = 230,
  left,
  width,
  height,
  fontSize = 30,
  fadeInFrames = 10,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const slideY = interpolate(frame, [0, fadeInFrames], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Se left não definido → centralizar no canvas 1080px
  const containerStyle: React.CSSProperties =
    left !== undefined
      ? { position: "absolute", top, left, opacity: fade, transform: `translateY(${slideY}px)` }
      : {
          position: "absolute",
          top,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: fade,
          transform: `translateY(${slideY}px)`,
        };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 28,
          paddingRight: 28,
          width,
          height,
          boxSizing: "border-box",
          justifyContent: "center",
          background: "#FFFFFF",
          borderRadius: 50,
          // Glow neon branco (igual print)
          boxShadow: [
            "0 0 12px rgba(255,255,255,0.95)",
            "0 0 28px rgba(255,255,255,0.70)",
            "0 0 56px rgba(255,255,255,0.35)",
            "0 4px 16px rgba(0,0,0,0.18)",
          ].join(", "),
          fontFamily,
          whiteSpace: "nowrap",
          gap: 0,
        }}
      >
        {/* Texto normal — cinza escuro (igual "MEAL 1 -") */}
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: "#555555",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          <EditableText
            value={label}
            editable={editable}
            onChange={(v) => onTextEdit?.("label", v)}
          />
          {accent ? "\u00a0" : null}
        </span>

        {/* Acento azul (igual "10:00am") */}
        {accent ? (
          <span
            style={{
              fontSize,
              fontWeight: 900,
              color: "#4A8FE8",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            <EditableText
              value={accent}
              editable={editable}
              onChange={(v) => onTextEdit?.("accent", v)}
            />
          </span>
        ) : null}
      </div>
    </div>
  );
};
