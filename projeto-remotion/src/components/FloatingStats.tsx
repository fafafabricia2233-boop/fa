import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

type FloatingStat = {
  text: string;
  at: number;
  endAt?: number;
  fadeOutStart?: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
};

type FloatingStatsProps = {
  stats: FloatingStat[];
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const FloatingStats: React.FC<FloatingStatsProps> = ({
  stats,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  return (
    <>
      {stats.map((stat, index) => {
        const fadeEnd = stat.endAt ?? stat.at + 3.6;
        const fadeStart = stat.fadeOutStart ?? Math.max(stat.at + 0.7, fadeEnd - 0.5);
        if (sec < stat.at || sec >= fadeEnd) {
          return null;
        }
        const opacity = interpolate(sec, [stat.at, stat.at + 0.35, fadeStart, fadeEnd], [0, 0.14, 0.1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const drift = interpolate(sec, [stat.at, fadeEnd], [0, -36 - index * 4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={`${stat.text}-${stat.at}`}
            style={{
              position: "absolute",
              left: stat.x,
              top: stat.y + drift,
              opacity,
              fontFamily,
              fontSize: stat.size ?? 72,
              fontWeight: 900,
              color: stat.color ?? "#FFFFFF",
              filter: "blur(0.5px)",
              textShadow: "0 14px 34px rgba(0,0,0,0.58)",
              pointerEvents: "none",
            }}
          >
            <EditableText
              value={stat.text}
              editable={editable}
              onChange={(v) => onTextEdit?.(`stat${index + 1}`, v)}
            />
          </div>
        );
      })}
    </>
  );
};
