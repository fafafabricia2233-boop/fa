import React from "react";
import { Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

type GuestPhotoOverlayProps = {
  imageSrc: string;
  creditHandle: string;
  widthPct?: number;
  side?: "left" | "right" | "center";
  placement?: "center" | "lower-left";
  delayFrames?: number;
  durationInFrames?: number;
};

export const GuestPhotoOverlay: React.FC<GuestPhotoOverlayProps> = ({
  imageSrc,
  creditHandle,
  widthPct = 70,
  side = "center",
  placement = "center",
  delayFrames = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const localFrame = Math.max(0, frame - delayFrames);
  const imageWidth = width * (widthPct / 100);
  const inProgress = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const outOpacity =
    durationInFrames === undefined
      ? 1
      : interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const xOffset =
    side === "left" ? (1 - inProgress) * -50 : side === "right" ? (1 - inProgress) * 50 : 0;
  const top = placement === "lower-left" ? 820 : 250;
  const left = placement === "lower-left" ? 64 : (width - imageWidth) / 2;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: imageWidth,
        opacity: inProgress * outOpacity,
        transform: `translateX(${xOffset}px)`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 26px 70px rgba(0,0,0,0.52)",
      }}
    >
      <Img src={imageSrc} style={{ width: "100%", maxHeight: 1150, objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          borderRadius: 4,
          padding: "6px 14px",
          background: "rgba(0,0,0,0.65)",
          color: "white",
          fontFamily,
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        {creditHandle}
      </div>
    </div>
  );
};
