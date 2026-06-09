import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin"],
});

type IngredientCardProps = {
  title: string;
  subtitle: string;
  risk: string;
  icon?: string;
  tone?: "green" | "blue" | "yellow";
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

const toneColor = {
  green: "#2ECC71",
  blue: "#37A7FF",
  yellow: "#FFD700",
};

export const IngredientCard: React.FC<IngredientCardProps> = ({
  title,
  subtitle,
  risk,
  icon = "✓",
  tone = "green",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 8], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = toneColor[tone];

  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 90,
        width: 900,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(8,18,25,0.58))",
        boxShadow: "0 18px 45px rgba(0,0,0,0.36)",
        padding: "22px 28px",
        fontFamily,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            color: "#07100a",
            backgroundColor: color,
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          <EditableText
            value={icon}
            editable={editable}
            onChange={(v) => onTextEdit?.("icon", v)}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 0.94,
            }}
          >
            <EditableText
              value={title}
              editable={editable}
              onChange={(v) => onTextEdit?.("title", v)}
            />
          </div>
          <div
            style={{
              marginTop: 7,
              fontSize: 24,
              fontWeight: 700,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            <EditableText
              value={subtitle}
              editable={editable}
              onChange={(v) => onTextEdit?.("subtitle", v)}
            />
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color,
            textAlign: "right",
            maxWidth: 265,
          }}
        >
          <EditableText
            value={risk}
            editable={editable}
            onChange={(v) => onTextEdit?.("risk", v)}
          />
        </div>
      </div>
    </div>
  );
};
