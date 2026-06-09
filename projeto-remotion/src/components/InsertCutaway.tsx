import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type InsertCutawayProps = {
  src: string;
  startFrom?: number;
  durationInFrames?: number;
  opacity?: number;
  zoom?: number;
  fit?: "cover" | "contain";
  darken?: boolean;
};

export const InsertCutaway: React.FC<InsertCutawayProps> = ({
  src,
  startFrom = 0,
  durationInFrames,
  opacity = 1,
  zoom = 1,
  fit = "cover",
  darken = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames: compositionDuration } = useVideoConfig();
  const duration = durationInFrames ?? compositionDuration;
  const inOpacity = interpolate(frame, [0, 3], [0, opacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [duration - 4, duration], [opacity, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale =
    zoom > 1
        ? interpolate(frame, [0, duration], [1.03, Math.max(zoom, 1.03)], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })
      : 1.03;

  if (!src) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inOpacity, outOpacity),
        overflow: "hidden",
        backgroundColor: "#030507",
      }}
    >
      <OffthreadVideo
        src={src}
        startFrom={startFrom}
        volume={0}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          filter: darken ? "brightness(0.68) contrast(1.08)" : "contrast(1.04)",
        }}
      />
      {darken ? <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.18)" }} /> : null}
    </AbsoluteFill>
  );
};
