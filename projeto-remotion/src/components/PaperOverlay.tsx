import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "900"],
  subsets: ["latin"],
});

type PaperOverlayProps = {
  title: string;
  subtitle?: string;
  source?: string;
  imageSrc?: string;
  position?: "top" | "right" | "bottom";
};

const positionStyles = {
  top: { top: 146, left: 70, right: 70 },
  right: { top: 560, right: 54, width: 520 },
  bottom: { left: 70, right: 70, bottom: 360 },
};

export const PaperOverlay: React.FC<PaperOverlayProps> = ({
  title,
  subtitle,
  source,
  imageSrc,
  position = "right",
}) => {
  const frame = useCurrentFrame();
  const entrance = interpolate(frame, [0, 12], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        transform: `translateY(${entrance}px)`,
        opacity,
        border: "3px solid rgba(255,255,255,0.9)",
        borderRadius: 8,
        background: "rgba(248,250,252,0.96)",
        boxShadow: "0 22px 60px rgba(0,0,0,0.35)",
        overflow: "hidden",
        fontFamily,
      }}
    >
      {imageSrc ? (
        <Img
          src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)}
          style={{ width: "100%", height: 250, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            height: 190,
            background:
              "linear-gradient(135deg, #d9e2ec 0%, #ffffff 48%, #b7c9dd 100%)",
            borderBottom: "1px solid #b9c5d0",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 28,
              right: 28,
              top: 34,
              height: 18,
              background: "#1a3a5c",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 76,
              width: 250,
              height: 12,
              background: "#7d8da0",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 28,
              bottom: 38,
              width: 350,
              height: 42,
              border: "4px solid #ff6b00",
            }}
          />
        </div>
      )}
      <div style={{ padding: "26px 30px 30px" }}>
        <div
          style={{
            color: "#122033",
            fontSize: 42,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ marginTop: 12, color: "#334155", fontSize: 27, fontWeight: 700 }}>
            {subtitle}
          </div>
        ) : null}
        {source ? (
          <div style={{ marginTop: 18, color: "#516071", fontSize: 21, fontWeight: 500 }}>
            {source}
          </div>
        ) : null}
      </div>
    </div>
  );
};
