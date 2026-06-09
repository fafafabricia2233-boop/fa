import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export type DeficitCardProps = {
  top?: number;
  left?: number;
  fontSize?: number;
  /** Frames de fade-in. Default: 10 */
  fadeInFrames?: number;
  label?: string;
  accent1?: string;
  middle?: string;
  accent2?: string;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

const GRAY = "#555555";
const BLUE = "#4A8FE8";

export const DeficitCard: React.FC<DeficitCardProps> = ({
  top = 400,
  left,
  fontSize = 30,
  fadeInFrames = 10,
  label = "DEFICIT AGRESSIVO =",
  accent1 = "INSUSTENTAVEL",
  middle = "+ PERDA DE",
  accent2 = "MASSA MUSCULAR",
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
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 36,
          paddingRight: 36,
          background: "#FFFFFF",
          borderRadius: 24,
          boxShadow: [
            "0 0 12px rgba(255,255,255,0.95)",
            "0 0 28px rgba(255,255,255,0.70)",
            "0 0 56px rgba(255,255,255,0.35)",
            "0 4px 16px rgba(0,0,0,0.18)",
          ].join(", "),
          fontFamily,
          whiteSpace: "nowrap",
          gap: 6,
        }}
      >
        {/* Linha 1 — cinza */}
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: GRAY,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          <EditableText
            value={label}
            editable={editable}
            onChange={(v) => onTextEdit?.("label", v)}
          />
        </span>

        {/* Linha 2 — azul + cinza + azul */}
        <span
          style={{
            fontSize,
            fontWeight: 900,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: BLUE }}>
            <EditableText
              value={accent1}
              editable={editable}
              onChange={(v) => onTextEdit?.("accent1", v)}
            />
          </span>
          <span style={{ color: GRAY }}>
            {" "}
            <EditableText
              value={middle}
              editable={editable}
              onChange={(v) => onTextEdit?.("middle", v)}
            />
            {" "}
          </span>
          <span style={{ color: BLUE }}>
            <EditableText
              value={accent2}
              editable={editable}
              onChange={(v) => onTextEdit?.("accent2", v)}
            />
          </span>
        </span>
      </div>
    </div>
  );
};
