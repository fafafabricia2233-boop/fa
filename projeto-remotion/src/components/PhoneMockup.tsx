import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";

export type PhoneMockupProps = {
  top?: number;
  left?: number;
  /** Largura do telefone em px. Altura é calculada (proporção 9:19.5) */
  width?: number;
  /** Path do screenshot (será exibido dentro da tela) */
  screenshotSrc: string;
  /** Cor do bezel/frame. Default: preto */
  bezelColor?: string;
  /** Mostrar notch (Dynamic Island). Default: true */
  showNotch?: boolean;
  /** Frames de fade-in */
  fadeInFrames?: number;
  /** Slide-in vertical (px) na entrada. Default: 30 */
  slideInPx?: number;
  /** Rotação leve (graus). Default: 0 */
  rotate?: number;
};

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  top = 100,
  left = 60,
  width = 360,
  screenshotSrc,
  bezelColor = "#0E0E10",
  showNotch = true,
  fadeInFrames = 10,
  slideInPx = 30,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slide = interpolate(frame, [0, fadeInFrames], [slideInPx, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aspect = 19.5 / 9;
  const height = width * aspect;
  const bezel = width * 0.025;
  const cornerRadius = width * 0.13;
  const innerRadius = cornerRadius - bezel + 2;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: fade,
        transform: `translateY(${slide}px) rotate(${rotate}deg)`,
      }}
    >
      {/* Frame externo (bezel) */}
      <div
        style={{
          width,
          height,
          background: bezelColor,
          borderRadius: cornerRadius,
          padding: bezel,
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)",
          position: "relative",
        }}
      >
        {/* Tela */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: innerRadius,
            overflow: "hidden",
            position: "relative",
            background: "#000",
          }}
        >
          <Img
            src={staticFile(screenshotSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Dynamic Island (notch) */}
          {showNotch && (
            <div
              style={{
                position: "absolute",
                top: width * 0.04,
                left: "50%",
                transform: "translateX(-50%)",
                width: width * 0.32,
                height: width * 0.075,
                background: "#000",
                borderRadius: width * 0.04,
                zIndex: 2,
              }}
            />
          )}
        </div>

        {/* Botões laterais (sutis) */}
        <div
          style={{
            position: "absolute",
            top: height * 0.18,
            right: -2,
            width: 3,
            height: height * 0.08,
            background: "#222",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: height * 0.12,
            left: -2,
            width: 3,
            height: height * 0.05,
            background: "#222",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: height * 0.2,
            left: -2,
            width: 3,
            height: height * 0.1,
            background: "#222",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};
