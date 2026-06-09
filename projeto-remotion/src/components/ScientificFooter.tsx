import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

type ScientificFooterProps = {
  text: string;
  durationInFrames?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const ScientificFooter: React.FC<ScientificFooterProps> = ({
  text,
  durationInFrames,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const inOpacity = interpolate(frame, [0, 20], [0, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOpacity =
    durationInFrames === undefined
      ? 0.65
      : interpolate(frame, [durationInFrames - 10, durationInFrames], [0.65, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 210,
        left: (width - 900) / 2,
        width: 900,
        color: "white",
        opacity: Math.min(inOpacity, outOpacity),
        fontFamily,
        fontSize: 21,
        fontWeight: 500,
        textAlign: "center",
        textShadow: "0 3px 12px rgba(0,0,0,0.65)",
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
