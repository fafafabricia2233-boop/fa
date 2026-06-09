import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"] });

const PLATEAU_START = 44;

// Layout vertical
const BAR_MAX_H = 320;  // altura máxima da barra em px
const BAR_W     = 90;   // largura de cada barra
const BAR_GAP   = 18;   // espaço horizontal entre barras
const SIDE_PAD  = 20;
const TOP_PAD   = 16;
const BOTTOM_PAD = 16;

export const InsulinaBarChartVertical: React.FC<{
  top?: number;
  left?: number;
  headerTitle?: string;
  headerSubtitle?: string;
  label1?: string;
  label2?: string;
  label3?: string;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
}> = ({
  top = 90,
  left = 40,
  headerTitle = "DÉFICIT CALÓRICO",
  headerSubtitle = "Sem melhorar sensibilidade insulínica",
  label1 = "PESO\n(KG)",
  label2 = "% GORDURA\nCORPORAL",
  label3 = "RESISTÊNCIA\nINSULÍNICA",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Valores animados ──────────────────────────────────────────────────────
  const pesoBase = interpolate(frame,
    [0, 6, 18, 28, 36, 44], [118, 118, 112, 106, 101, 98],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const peso = frame >= PLATEAU_START
    ? 97.8 + Math.sin((frame - PLATEAU_START) * 0.28) * 0.12 : pesoBase;

  const gordBase = interpolate(frame,
    [0, 6, 18, 28, 36, 44], [34, 34, 31, 28, 25, 22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const gord = frame >= PLATEAU_START
    ? 21.7 + Math.sin((frame - PLATEAU_START) * 0.22 + 1.2) * 0.1 : gordBase;

  const resiBase = interpolate(frame,
    [0, 6, 18, 28, 36, 44], [100, 100, 96, 93, 91, 89],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const resi = frame >= PLATEAU_START
    ? 88 + Math.sin((frame - PLATEAU_START) * 0.19 + 0.5) * 0.8 : resiBase;

  // ── Pisca vermelha ────────────────────────────────────────────────────────
  const frozen = frame >= PLATEAU_START;
  const blinkPulse = frozen
    ? interpolate(Math.sin((frame - PLATEAU_START) * 0.52), [-1, 1], [0.42, 1])
    : 1;
  const resiColor = frozen ? `rgba(192, 28, 18, ${blinkPulse})` : "#8B1A1A";

  // ── Altura das barras — relativa ao valor inicial ─────────────────────────
  const hPeso = (peso / 118) * BAR_MAX_H;
  const hGord = (gord / 34)  * BAR_MAX_H;
  const hResi = (resi / 100) * BAR_MAX_H;

  const dec = frame >= PLATEAU_START ? 1 : 0;
  const cardW = SIDE_PAD + 3 * BAR_W + 2 * BAR_GAP + SIDE_PAD;

  const bars = [
    { key: "label1", label: label1, color: "#5A5A5A", barPx: hPeso, value: peso, unit: "kg", pulse: 1 },
    { key: "label2", label: label2, color: "#C87D10", barPx: hGord, value: gord, unit: "%", pulse: 1 },
    { key: "label3", label: label3, color: resiColor, barPx: hResi, value: resi, unit: "%", pulse: frozen ? blinkPulse : 1 },
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
          fontWeight: 900, fontSize: 13, letterSpacing: 1.2,
          padding: "5px 12px", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          <EditableText
            value={headerTitle}
            editable={editable}
            onChange={(v) => onTextEdit?.("headerTitle", v)}
          />
        </div>
        <div style={{
          background: "#EBEBEB", color: "#333",
          fontWeight: 400, fontSize: 11,
          padding: "5px 10px", display: "flex", alignItems: "center", whiteSpace: "nowrap",
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
        padding: `${TOP_PAD}px ${SIDE_PAD}px ${BOTTOM_PAD}px`,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: BAR_GAP,
      }}>
        {bars.map((bar, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>

            {/* Track + barra colorida */}
            <div style={{
              width: BAR_W,
              height: BAR_MAX_H,
              background: "#E2E2E2",
              borderRadius: 2,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Barra colorida — cresce de baixo para cima */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: Math.max(4, bar.barPx),
                background: bar.color,
                borderRadius: 2,
                opacity: bar.pulse,
              }} />

              {/* Valor no topo da barra colorida */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: Math.max(4, bar.barPx),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 8,
                boxSizing: "border-box" as const,
              }}>
                <span style={{
                  fontWeight: 900,
                  fontSize: 15,
                  color: "#fff",
                  opacity: bar.pulse,
                  fontVariantNumeric: "tabular-nums" as const,
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}>
                  {bar.value.toFixed(dec)}{bar.unit}
                </span>
              </div>
            </div>

            {/* Label abaixo */}
            <div style={{
              width: BAR_W,
              fontWeight: 700,
              fontSize: 10,
              color: bar.color,
              letterSpacing: 0.6,
              lineHeight: 1.3,
              textTransform: "uppercase",
              textAlign: "center",
              opacity: bar.pulse,
            }}>
              <EditableText
                value={bar.label}
                editable={editable}
                onChange={(v) => onTextEdit?.(bar.key, v)}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
