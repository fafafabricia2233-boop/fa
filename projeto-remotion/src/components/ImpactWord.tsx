import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

type ImpactWordProps = {
  text: string;
  color: string;
  top?: number;
  size?: number;
  shake?: boolean;
  glow?: boolean;
  delayFrames?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const ImpactWord: React.FC<ImpactWordProps> = ({
  text,
  color,
  top = 570,
  size = 112,
  shake = false,
  glow = true,
  delayFrames = 0,
  editable = false,
  onTextEdit,
}) => {
  const frame = Math.max(0, useCurrentFrame() - delayFrames);
  const scale = interpolate(frame, [0, 8], [1.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [0, 3, 34, 42], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = shake && frame < 8 ? Math.sin(frame * 2.8) * 7 : 0;
  const shakeY = shake && frame < 8 ? Math.cos(frame * 2.2) * 5 : 0;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 40,
        right: 40,
        opacity,
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
        transformOrigin: "center",
        textAlign: "center",
        fontFamily,
        fontSize: size,
        fontWeight: 900,
        lineHeight: 0.86,
        letterSpacing: 0,
        color,
        textTransform: "uppercase",
        WebkitTextStroke: "7px #020305",
        paintOrder: "stroke fill",
        textShadow: glow
          ? `0 0 18px ${color}, 0 16px 38px rgba(0,0,0,0.75)`
          : "0 16px 38px rgba(0,0,0,0.75)",
        pointerEvents: "none",
      }}
    >
      <EditableText
        value={text}
        editable={editable}
        onChange={(v) => onTextEdit?.("text", v)}
      />
    </div>
  );
};
