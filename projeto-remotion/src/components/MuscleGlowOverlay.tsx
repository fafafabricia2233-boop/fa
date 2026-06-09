import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export type GlowVariant = "red" | "orange" | "yellow" | "custom";

export type MuscleGlowOverlayProps = {
  /** Centro do glow (px no canvas 1080x1920) */
  cx: number;
  cy: number;
  /** Raio horizontal e vertical (px). Default: 200/120 = oval esticado */
  rx?: number;
  ry?: number;
  /** Rotação em graus (alinha com músculo: 0 horizontal, 90 vertical) */
  rotate?: number;
  /** Variante de cor. Default: red */
  variant?: GlowVariant;
  /** Cor custom (HEX). Só usado se variant="custom" */
  customColor?: string;
  /** Opacidade máxima (0-1). Default: 0.55 */
  maxOpacity?: number;
  /** Pulsar suavemente? Default: false (estático) */
  pulse?: boolean;
  /** Frames de fade-in. Default: 8 */
  fadeInFrames?: number;
  /** Blend mode CSS. Default: "screen" — clareia área embaixo */
  blendMode?: "screen" | "multiply" | "overlay" | "soft-light" | "normal";
};

const VARIANT_COLORS: Record<Exclude<GlowVariant, "custom">, string> = {
  red:    "#FF3A2E",
  orange: "#FF7A1A",
  yellow: "#FFD400",
};

export const MuscleGlowOverlay: React.FC<MuscleGlowOverlayProps> = ({
  cx,
  cy,
  rx = 200,
  ry = 120,
  rotate = 0,
  variant = "red",
  customColor,
  maxOpacity = 0.55,
  pulse = false,
  fadeInFrames = 8,
  blendMode = "screen",
}) => {
  const frame = useCurrentFrame();
  const color = variant === "custom" ? (customColor ?? "#FF3A2E") : VARIANT_COLORS[variant];

  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse opcional: oscila ±0.12 ao redor do maxOpacity
  const pulseValue = pulse
    ? maxOpacity + 0.12 * Math.sin((frame / 12) * Math.PI)
    : maxOpacity;

  const opacity = fade * pulseValue;

  // SVG radial gradient — bordas suaves, núcleo intenso
  const gradId = `glow-grad-${cx}-${cy}`;

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        mixBlendMode: blendMode,
        pointerEvents: "none",
        opacity,
      }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor={color} stopOpacity={1} />
          <stop offset="55%" stopColor={color} stopOpacity={0.65} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        transform={`rotate(${rotate} ${cx} ${cy})`}
        fill={`url(#${gradId})`}
      />
    </svg>
  );
};
