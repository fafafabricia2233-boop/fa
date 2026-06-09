import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type ZoomSegment = {
  start: number;
  end: number;
  from: number;
  to: number;
};

type CognitiveZoomProps = {
  children: React.ReactNode;
  segments: ZoomSegment[];
};

export const CognitiveZoom: React.FC<CognitiveZoomProps> = ({ children, segments }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const active = segments.find((segment) => sec >= segment.start && sec <= segment.end);
  const scale = active
    ? interpolate(sec, [active.start, active.end], [active.from, active.to], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : segments.reduce((lastScale, segment) => {
        if (sec > segment.end) {
          return segment.to;
        }
        return lastScale;
      }, 1);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {children}
    </div>
  );
};
