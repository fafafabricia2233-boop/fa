import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "900"] });

export type PillBadgeVariant = "white" | "dark" | "meal" | "ingredient";

export type PillBadgeProps = {
  /** Posição absoluta */
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  /** Variante visual */
  variant?: PillBadgeVariant;
  /** Texto principal */
  text: string;
  /** Texto secundário com cor accent (ex: "10:00am" no MealTimePill) */
  accent?: string;
  /** Cor do accent. Default: azul Nippard (#4A9EFF) */
  accentColor?: string;
  /** Emoji opcional ao final (ex: "🥗", "🍦") */
  emoji?: string;
  /** Seta opcional ao início ("↓", "↑", "→", "←") */
  arrow?: "↓" | "↑" | "→" | "←";
  /** Cor da seta. Default: mesma do texto */
  arrowColor?: string;
  /** Frames de fade-in. Default: 6 */
  fadeInFrames?: number;
  /** Slide-in vertical (px). Default: 12 */
  slideInPx?: number;
  /** Tamanho da fonte (default varia por variant) */
  fontSize?: number;
  /** Padding interno custom */
  padding?: string;
  /** Border radius custom */
  borderRadius?: number;
  /** Underline curto preto abaixo do pill (estilo "1900s" do Nippard) */
  underline?: boolean;
  /** Cor do underline. Default: #1A1A1A */
  underlineColor?: string;
  /** Modo de edicao inline (apenas dev/composer). Default false. */
  editable?: boolean;
  /** Callback quando texto e editado em modo editable */
  onTextEdit?: (key: string, value: string) => void;
};

const VARIANT_STYLES: Record<PillBadgeVariant, {
  bg: string;
  color: string;
  border: string;
  fontSize: number;
  padding: string;
  borderRadius: number;
  shadow: string;
  textTransform: "uppercase" | "none";
  letterSpacing: number;
  fontWeight: number;
}> = {
  white: {
    bg: "#FFFFFF",
    color: "#1A1A1A",
    border: "2px solid #333",
    fontSize: 28,
    padding: "10px 22px",
    borderRadius: 8,
    shadow: "0 4px 14px rgba(0,0,0,0.18)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: 700,
  },
  dark: {
    bg: "rgba(20,20,20,0.78)",
    color: "#FFFFFF",
    border: "none",
    fontSize: 30,
    padding: "12px 26px",
    borderRadius: 40,
    shadow: "0 6px 18px rgba(0,0,0,0.35)",
    textTransform: "none",
    letterSpacing: 0,
    fontWeight: 600,
  },
  meal: {
    bg: "#FFFFFF",
    color: "#3A3A3A",
    border: "2px solid #555",
    fontSize: 34,
    padding: "12px 28px",
    borderRadius: 12,
    shadow: "0 6px 20px rgba(0,0,0,0.25)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 900,
  },
  ingredient: {
    bg: "#FFFFFF",
    color: "#222",
    border: "1px solid #ccc",
    fontSize: 18,
    padding: "6px 12px",
    borderRadius: 6,
    shadow: "0 2px 8px rgba(0,0,0,0.15)",
    textTransform: "none",
    letterSpacing: 0,
    fontWeight: 600,
  },
};

export const PillBadge: React.FC<PillBadgeProps> = ({
  top = 100,
  left = 60,
  width,
  height,
  variant = "white",
  text,
  accent,
  accentColor = "#4A9EFF",
  emoji,
  arrow,
  arrowColor,
  fadeInFrames = 6,
  slideInPx = 12,
  fontSize,
  padding,
  borderRadius,
  underline = false,
  underlineColor = "#1A1A1A",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const s = VARIANT_STYLES[variant];

  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slide = interpolate(frame, [0, fadeInFrames], [slideInPx, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: fade,
        transform: `translateY(${-slide}px)`,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: s.bg,
          color: s.color,
          border: s.border,
          padding: padding ?? s.padding,
          width,
          height,
          boxSizing: "border-box",
          justifyContent: "center",
          borderRadius: borderRadius ?? s.borderRadius,
          boxShadow: s.shadow,
          fontFamily,
          fontSize: fontSize ?? s.fontSize,
          fontWeight: s.fontWeight,
          textTransform: s.textTransform,
          letterSpacing: s.letterSpacing,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {arrow && (
          <span style={{ color: arrowColor ?? s.color, fontWeight: 900 }}>
            {arrow}
          </span>
        )}
        <span>
          <EditableText
            value={text}
            editable={editable}
            onChange={(v) => onTextEdit?.("text", v)}
          />
        </span>
        {accent && (
          <span style={{ color: accentColor, fontWeight: s.fontWeight }}>
            <EditableText
              value={accent}
              editable={editable}
              onChange={(v) => onTextEdit?.("accent", v)}
            />
          </span>
        )}
        {emoji && <span style={{ fontSize: (fontSize ?? s.fontSize) * 0.95 }}>{emoji}</span>}
      </div>
      {underline && (
        <div
          style={{
            marginTop: 4,
            width: "40%",
            height: 3,
            background: underlineColor,
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
};
