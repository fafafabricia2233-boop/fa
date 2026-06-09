import React from "react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

type BeforeAfterCardProps = {
  leftSrc: string;
  rightSrc?: string;
  leftLabel?: string;
  rightLabel?: string;
  yOffset?: number;
  delayFrames?: number;
  leftObjectPosition?: string;
  rightObjectPosition?: string;
  leftZoom?: number;
  rightZoom?: number;
};

export const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({
  leftSrc,
  rightSrc,
  leftLabel = "ANTES",
  rightLabel = "AGORA",
  yOffset = 700,
  delayFrames = 0,
  leftObjectPosition = "center center",
  rightObjectPosition = "center center",
  leftZoom = 1,
  rightZoom = 1,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - delayFrames);
  const safeTop = Math.max(700, yOffset);
  const progress = interpolate(localFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const isSingle = !rightSrc;

  const photo = (
    src: string,
    label: string,
    single = false,
    objectPosition = "center center",
    zoom = 1,
  ) => (
    <div style={{ width: single ? 500 : 464 }}>
      {src ? (
        <div
          style={{
            width: single ? 500 : 464,
            height: single ? 650 : 580,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 16px 36px rgba(0,0,0,0.34)",
          }}
        >
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
              border: "0",
              transform: `scale(${zoom})`,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: single ? 500 : 464,
            height: single ? 650 : 580,
            border: "0",
            borderRadius: 6,
            background: "#333",
          }}
        />
      )}
      <div
        style={{
          marginTop: 12,
          color: "white",
          fontFamily,
          fontSize: 28,
          fontWeight: 900,
          textAlign: "center",
          textTransform: "uppercase",
          textShadow: "0 3px 12px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: safeTop,
        left: isSingle ? 274 : 60,
        width: isSingle ? 532 : 960,
        padding: 16,
        borderRadius: 8,
        background: "rgba(0,0,0,0.55)",
        transform: `translateY(${(1 - progress) * 40}px)`,
        opacity: progress,
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {photo(leftSrc, leftLabel, isSingle, leftObjectPosition, leftZoom)}
        {!isSingle ? photo(rightSrc, rightLabel, false, rightObjectPosition, rightZoom) : null}
      </div>
    </div>
  );
};
