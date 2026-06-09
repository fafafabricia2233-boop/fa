import React from "react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

type DynamicStudyOverlayProps = {
  src: string;
  mode?: "results" | "conclusion" | "full";
  title?: string;
  footer?: string;
};

export const DynamicStudyOverlay: React.FC<DynamicStudyOverlayProps> = ({
  src,
  mode = "full",
  title = "META-ANÁLISE",
  footer = "32 estudos · 96.549 pessoas",
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 0.96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [0, 14], [54, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rotate = interpolate(frame, [0, 16], [1.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanY = interpolate(frame % 70, [0, 70], [-35, 315], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!src) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 340,
        width: mode === "full" ? 720 : 640,
        opacity,
        transform: `translateX(calc(-50% + ${x}px)) rotate(${rotate}deg)`,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#09111a",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 28px 90px rgba(0,0,0,0.64), 0 0 56px rgba(26,156,255,0.12)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          background: "linear-gradient(90deg, rgba(26,156,255,0.28), rgba(0,0,0,0.2))",
          fontFamily,
          color: "white",
        }}
      >
        <div style={{ fontSize: 21, fontWeight: 900 }}>{title}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
          {footer}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <Img
          src={src}
          style={{
            display: "block",
            width: "100%",
            maxHeight: 640,
            objectFit: "contain",
            objectPosition: "top",
            filter: "contrast(1.04) brightness(0.94)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 36,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0), rgba(89,190,255,0.2), rgba(255,255,255,0))",
            mixBlendMode: "screen",
          }}
        />
      </div>
    </div>
  );
};
