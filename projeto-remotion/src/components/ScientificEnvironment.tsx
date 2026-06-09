import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type ScientificEnvironmentProps = {
  scienceBgSrc?: string;
  intensity?: number;
};

export const ScientificEnvironment: React.FC<ScientificEnvironmentProps> = ({
  scienceBgSrc,
  intensity = 0.44,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacityIn = interpolate(frame, [0, 16], [0, intensity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [intensity, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(opacityIn, opacityOut);

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 62%, rgba(26,58,92,0.3), rgba(3,11,19,0.1) 38%, rgba(1,5,10,0.84) 100%), #06101c",
        }}
      />
      {scienceBgSrc ? (
        <OffthreadVideo
          src={scienceBgSrc}
          volume={0}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.16,
            filter: "saturate(0.72) contrast(1.18) brightness(0.48)",
          }}
        />
      ) : null}
      <Img
        src={staticFile("assets_global/hud_grid.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.07,
          mixBlendMode: "screen",
        }}
      />
      <Img
        src={staticFile("assets_global/particles_overlay.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.12,
          mixBlendMode: "screen",
        }}
      />
      <Img
        src={staticFile("assets_global/molecule.png")}
        style={{
          position: "absolute",
          right: -70,
          top: 300,
          width: 460,
          opacity: 0.08,
          filter: "blur(0.2px)",
          mixBlendMode: "screen",
        }}
      />
      <Img
        src={staticFile("assets_global/blue_light_leak.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.16,
          mixBlendMode: "screen",
        }}
      />
      <OffthreadVideo
        src={staticFile("assets_global/grain.mp4")}
        volume={0}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.08,
          mixBlendMode: "soft-light",
        }}
      />
      <Img
        src={staticFile("assets_global/scanline_overlay.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
