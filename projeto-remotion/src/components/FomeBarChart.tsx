import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"] });

// Layout
const BAR_AREA_W = 560;
const BAR_H      = 120;
const BAR_GAP    = 36;
const LABEL_W    = 190;
const SIDE_PAD   = 28;

// Cores
const GREEN = "#4E7033";  // maçã — verde
const RED   = "#C0392B";  // bala — vermelho (sobe = ruim)

// Timings (30fps)
// Ambas em 80% no início
// Maçã: frame 30 (1s) → começa cair → frame 55 chega em 60%
// Bala: frame 180 (6s) → começa subir → frame 205 chega em 100%
const MACA_DROP_START  = 30;   // 1s
const MACA_DROP_END    = 55;   // 1.83s
const BALA_RISE_START  = 180;  // 6s
const BALA_RISE_END    = 210;  // 7s

export type FomeBarChartProps = {
  top?: number;
  left?: number;
  width?: number;
  /** Texto do header preto (default: "FOME") */
  headerTitle?: string;
  /** Texto cinza ao lado (default: "Impacto nas escolhas alimentares") */
  headerSubtitle?: string;
  /** Label da barra verde (default: "MAÇÃ") */
  label1?: string;
  /** Label da barra vermelha (default: "BALA") */
  label2?: string;
  /** Modo de edição inline (apenas dev/composer). Default false. */
  editable?: boolean;
  /** Callback quando texto é editado em modo editable */
  onTextEdit?: (key: string, value: string) => void;
};

export const FomeBarChart: React.FC<FomeBarChartProps> = ({
  top = 90,
  left = 40,
  width = 600,
  headerTitle = "FOME",
  headerSubtitle = "Impacto nas escolhas alimentares",
  label1 = "MAÇÃ",
  label2 = "BALA",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Maçã: 80% → cai para 60% após 1s ───────────────────────────────────────
  const maca = interpolate(
    frame,
    [0, MACA_DROP_START, MACA_DROP_END],
    [80, 80, 60],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    }
  );

  // ── Bala: 80% → sobe para 100% após 6s ──────────────────────────────────────
  const bala = interpolate(
    frame,
    [0, BALA_RISE_START, BALA_RISE_END],
    [80, 80, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    }
  );

  const wMaca = (maca / 100) * BAR_AREA_W;
  const wBala = (bala / 100) * BAR_AREA_W;

  const cardW = SIDE_PAD + LABEL_W + 12 + BAR_AREA_W + SIDE_PAD;

  const bars = [
    {
      key: "label1",
      label: label1,
      color: GREEN,
      barPx: wMaca,
      value: maca,
    },
    {
      key: "label2",
      label: label2,
      color: RED,
      barPx: wBala,
      value: bala,
    },
  ];

  return (
    <div style={{
      position: "absolute",
      top,
      left,
      opacity: fadeIn,
      fontFamily,
      width: cardW,
    }}>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "stretch", marginBottom: 12 }}>
        <div style={{
          background: "#1A1A1A", color: "#fff",
          fontWeight: 900, fontSize: 17, letterSpacing: 1.2,
          padding: "7px 16px", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          <EditableText
            value={headerTitle}
            editable={editable}
            onChange={(v) => onTextEdit?.("headerTitle", v)}
          />
        </div>
        <div style={{
          background: "#EBEBEB", color: "#333",
          fontWeight: 400, fontSize: 14,
          padding: "7px 14px", display: "flex", alignItems: "center", whiteSpace: "nowrap",
        }}>
          <EditableText
            value={headerSubtitle}
            editable={editable}
            onChange={(v) => onTextEdit?.("headerSubtitle", v)}
          />
        </div>
      </div>

      {/* BARRAS */}
      <div style={{
        background: "#F8F8F8",
        padding: `16px ${SIDE_PAD}px`,
        display: "flex",
        flexDirection: "column",
        gap: BAR_GAP,
      }}>
        {bars.map((bar) => (
          <div key={bar.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {/* Label esquerda */}
            <div style={{
              width: LABEL_W,
              flexShrink: 0,
              fontWeight: 700,
              fontSize: 14,
              color: bar.color,
              letterSpacing: 0.6,
              lineHeight: 1.35,
              textTransform: "uppercase",
              textAlign: "left",
            }}>
              <EditableText
                value={bar.label}
                editable={editable}
                onChange={(v) => onTextEdit?.(bar.key, v)}
              />
            </div>

            {/* Track + barra */}
            <div style={{
              width: BAR_AREA_W,
              height: BAR_H,
              background: "#E2E2E2",
              borderRadius: 2,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Barra colorida */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, bottom: 0,
                width: Math.max(4, bar.barPx),
                background: bar.color,
                borderRadius: 2,
                transition: undefined,
              }} />

              {/* Valor dentro da barra */}
              <div style={{
                position: "absolute",
                top: 0, bottom: 0,
                left: 0,
                width: Math.max(4, bar.barPx),
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 12,
                boxSizing: "border-box" as const,
              }}>
                <span style={{
                  fontWeight: 900,
                  fontSize: 28,
                  color: "#fff",
                  fontVariantNumeric: "tabular-nums" as const,
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  whiteSpace: "nowrap",
                }}>
                  {Math.round(bar.value)}%
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
