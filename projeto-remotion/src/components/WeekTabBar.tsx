import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "900"] });

export type WeekTabBarProps = {
  top?: number;
  left?: number;
  /** Labels dos steps. Ex: ["WEEK 1", "WEEK 2", "WEEK 3"] */
  steps: string[];
  /** Index ativo (0-based) */
  activeIndex: number;
  /** Espaçamento entre pills */
  gap?: number;
  /** Tamanho da fonte */
  fontSize?: number;
  /** Frames de fade-in */
  fadeInFrames?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const WeekTabBar: React.FC<WeekTabBarProps> = ({
  top = 60,
  left = 40,
  steps,
  activeIndex,
  gap = 14,
  fontSize = 26,
  fadeInFrames = 6,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: fade,
        display: "flex",
        gap,
        fontFamily,
      }}
    >
      {steps.map((label, i) => {
        const active = i === activeIndex;
        return (
          <div
            key={i}
            style={{
              background: active ? "#FFFFFF" : "rgba(220,220,220,0.55)",
              color: active ? "#1A1A1A" : "rgba(80,80,80,0.85)",
              padding: "10px 22px",
              borderRadius: 8,
              border: active ? "2px solid #1A1A1A" : "2px solid rgba(150,150,150,0.4)",
              fontWeight: active ? 900 : 600,
              fontSize,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              boxShadow: active
                ? "0 6px 18px rgba(0,0,0,0.25)"
                : "0 2px 6px rgba(0,0,0,0.12)",
              transition: "none",
              transform: active ? "scale(1.04)" : "scale(1.0)",
            }}
          >
            <EditableText
              value={label}
              editable={editable}
              onChange={(v) => onTextEdit?.(`step${i + 1}`, v)}
            />
          </div>
        );
      })}
    </div>
  );
};
