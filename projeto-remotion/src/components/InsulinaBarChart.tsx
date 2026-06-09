import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"] });

const PLATEAU_START = 44;

// Layout horizontal
const BAR_AREA_W = 380; // comprimento máximo da barra em px
const BAR_H      = 64;  // espessura de cada barra
const BAR_GAP    = 20;  // espaço vertical entre barras
const LABEL_W    = 118; // coluna de labels à esquerda
const SIDE_PAD   = 20;

export const InsulinaBarChart: React.FC<{
  top?: number;
  left?: number;
  width?: number;
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
  width = 600,
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

  // ── Largura das barras — relativa ao valor inicial (tudo começa cheio) ────
  // Peso:       118 inicial → ratio = valor/118
  // Gordura:     34 inicial → ratio = valor/34
  // Resistência:100 inicial → ratio = valor/100
  const wPeso = (peso  / 118)  * BAR_AREA_W;
  const wGord = (gord  / 34)   * BAR_AREA_W;
  const wResi = (resi  / 100)  * BAR_AREA_W;

  const dec = frame >= PLATEAU_START ? 1 : 0;
  const cardW = SIDE_PAD + LABEL_W + 12 + BAR_AREA_W + SIDE_PAD;

  const bars = [
    { key: "label1", label: label1, color: "#5A5A5A", barPx: wPeso, value: peso, unit: "kg", pulse: 1 },
    { key: "label2", label: label2, color: "#C87D10", barPx: wGord, value: gord, unit: "%", pulse: 1 },
    { key: "label3", label: label3, color: resiColor, barPx: wResi, value: resi, unit: "%", pulse: frozen ? blinkPulse : 1 },
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
              fontSize: 11,
              color: bar.color,
              letterSpacing: 0.6,
              lineHeight: 1.35,
              textTransform: "uppercase",
              textAlign: "left",
              opacity: bar.pulse,
            }}>
              <EditableText
                value={bar.label}
                editable={editable}
                onChange={(v) => onTextEdit?.(bar.key, v)}
              />
            </div>

            {/* Track + barra colorida */}
            <div style={{
              width: BAR_AREA_W,
              height: BAR_H,
              background: "#E2E2E2",
              borderRadius: 2,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Barra colorida — cresce da esquerda */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, bottom: 0,
                width: Math.max(4, bar.barPx),
                background: bar.color,
                borderRadius: 2,
                opacity: bar.pulse,
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
                paddingRight: 10,
                boxSizing: "border-box" as const,
              }}>
                <span style={{
                  fontWeight: 900,
                  fontSize: 17,
                  color: "#fff",
                  opacity: bar.pulse,
                  fontVariantNumeric: "tabular-nums" as const,
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  whiteSpace: "nowrap",
                }}>
                  {bar.value.toFixed(dec)}{bar.unit}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
