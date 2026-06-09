import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin"],
});

type StatBarProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "blue" | "darknavy" | "orange" | "green" | "red";
  yOffset?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

const tones = {
  blue: "#1a3a5c",
  darknavy: "#1A2B4A",
  orange: "#ff6b00",
  green: "#168a52",
  red: "#c9352b",
};

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  detail,
  tone = "blue",
  yOffset = 156,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: yOffset,
        left: 72,
        right: 72,
        fontFamily,
        transform: `translateY(${(1 - progress) * -18}px)`,
        opacity: progress,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 156,
          padding: "24px 34px",
          borderRadius: 8,
          background: tones[tone],
          color: "white",
          boxShadow: "0 20px 50px rgba(0,0,0,0.38)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 9,
            width: `${Math.round(progress * 100)}%`,
            background: "#FFD700",
          }}
        />
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 0,
              opacity: 0.86,
              textTransform: "uppercase",
            }}
          >
            <EditableText
              value={label}
              editable={editable}
              onChange={(v) => onTextEdit?.("label", v)}
            />
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            <EditableText
              value={value}
              editable={editable}
              onChange={(v) => onTextEdit?.("value", v)}
            />
          </div>
          {detail ? (
            <div style={{ marginTop: 12, fontSize: 24, fontWeight: 600, opacity: 0.92 }}>
              <EditableText
                value={detail}
                editable={editable}
                onChange={(v) => onTextEdit?.("detail", v)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
