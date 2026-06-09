import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

type TopTitleCardProps = {
  text: string;
  color?: string;
  subtitle?: string;
  top?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const TopTitleCard: React.FC<TopTitleCardProps> = ({
  text,
  color = "#FFD700",
  subtitle,
  top = 96,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const scale = interpolate(progress, [0, 1], [1.3, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 64,
        right: 64,
        opacity: progress,
        transform: `scale(${scale})`,
        transformOrigin: "center top",
        textAlign: "center",
        fontFamily,
        textShadow: "0 4px 20px rgba(0,0,0,0.85)",
      }}
    >
      <div
        style={{
          color,
          fontSize: 68,
          fontWeight: 900,
          lineHeight: 0.95,
          textTransform: "uppercase",
        }}
      >
        <EditableText
          value={text}
          editable={editable}
          onChange={(v) => onTextEdit?.("text", v)}
        />
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 10,
            color: "white",
            fontSize: 30,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          <EditableText
            value={subtitle}
            editable={editable}
            onChange={(v) => onTextEdit?.("subtitle", v)}
          />
        </div>
      ) : null}
    </div>
  );
};
