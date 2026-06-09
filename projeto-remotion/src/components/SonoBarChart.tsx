import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"] });

const PLATEAU_START = 71;  // 70% mais lento: animação vai até frame 71

// Layout — grande, conteúdo principal do take
const BAR_AREA_W = 560;
const BAR_H      = 120;
const BAR_GAP    = 36;
const LABEL_W    = 190;
const SIDE_PAD   = 28;

// Cores
const GREEN_MIL = "#4E7033";  // verde militar
const GRAY      = "#7A7A7A";  // cinza sensibilidade

export const SonoBarChart: React.FC<{
  top?: number;
  left?: number;
  width?: number;
  headerTitle?: string;
  headerSubtitle?: string;
  label1?: string;
  label2?: string;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
}> = ({
  top = 90,
  left = 40,
  width = 600,
  headerTitle = "NOITE MAL DORMIDA",
  headerSubtitle = "Efeito na sensibilidade insulínica",
  label1 = "QUALIDADE\nDE SONO",
  label2 = "SENSIBILIDADE\nINSULÍNICA",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Qualidade de sono: 100 → 50 (70% mais lento) ────────────────────────────
  const sonoBase = interpolate(frame,
    [0, 6, 26, 43, 57, 71], [100, 100, 85, 70, 58, 50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sono = frame >= PLATEAU_START
    ? 50 + Math.sin((frame - PLATEAU_START) * 0.25) * 0.3 : sonoBase;

  // ── Sensibilidade insulínica: 100 → 75 (70% mais lento) ──────────────────────
  const sensiBase = interpolate(frame,
    [0, 6, 26, 43, 57, 71], [100, 100, 94, 88, 81, 75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sensi = frame >= PLATEAU_START
    ? 75 + Math.sin((frame - PLATEAU_START) * 0.19 + 0.8) * 0.4 : sensiBase;

  // ── Largura das barras ───────────────────────────────────────────────────────
  const wSono  = (sono  / 100) * BAR_AREA_W;
  const wSensi = (sensi / 100) * BAR_AREA_W;

  const dec = frame >= PLATEAU_START ? 0 : 0;
  const cardW = SIDE_PAD + LABEL_W + 12 + BAR_AREA_W + SIDE_PAD;

  const bars = [
    {
      key: "label1",
      label: label1,
      color: GREEN_MIL,
      barPx: wSono,
      value: sono,
      unit: "%",
    },
    {
      key: "label2",
      label: label2,
      color: GRAY,
      barPx: wSensi,
      value: sensi,
      unit: "%",
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
        {bars.map((bar, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>

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
                  {Math.round(bar.value)}{bar.unit}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
