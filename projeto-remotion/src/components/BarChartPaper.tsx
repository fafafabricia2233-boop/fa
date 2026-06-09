import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "900"] });

export type PaperBar = {
  /** Label embaixo da barra (Body Mass, Fat-Free Mass, Fat Mass) */
  label: string;
  /** Valor final */
  value: number;
  /** Cor da barra (default: cinza-verde Nippard) */
  color?: string;
};

export type BarChartPaperProps = {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  /** Title pill bar opcional acima do chart (ex: "NEW LIFTERS", "Normal Diet + 2010 kcal") */
  titlePills?: string[];
  /** Label do eixo Y (rotacionado 90°). Ex: "Total Weight Gain (kg)" */
  yAxisLabel?: string;
  /** Valor máximo do eixo (escala). Default: max(values) * 1.15 */
  yMax?: number;
  /** Número de gridlines horizontais. Default: 7 */
  gridLines?: number;
  /** Barras */
  bars: PaperBar[];
  /** Frames de crescimento das barras */
  growFrames?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const BarChartPaper: React.FC<BarChartPaperProps> = ({
  top = 80,
  left = 60,
  width = 600,
  height = 380,
  titlePills,
  yAxisLabel = "Total Weight Gain (kg)",
  yMax,
  gridLines = 7,
  bars,
  growFrames = 24,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const grow = interpolate(frame, [6, 6 + growFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const effectiveYMax = yMax ?? Math.max(...bars.map((b) => b.value)) * 1.15;
  const chartH = height;
  const barAreaW = width - 80; // espaço pra label do Y
  const barWidth = (barAreaW / bars.length) * 0.55;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        opacity: fade,
        fontFamily,
      }}
    >
      {/* Title pills */}
      {titlePills && titlePills.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {titlePills.map((p, i) => (
            <div
              key={i}
              style={{
                background: "#FFFFFF",
                border: "2px solid #333",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 18,
                fontWeight: 700,
                color: "#1A1A1A",
                boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
              }}
            >
              <EditableText
                value={p}
                editable={editable}
                onChange={(v) => onTextEdit?.(`titlePill${i + 1}`, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Card branco */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 6,
          padding: "20px 24px 24px",
          boxShadow: "0 6px 22px rgba(0,0,0,0.22)",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Eixo Y rotulado */}
          <div
            style={{
              width: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              color: "#444",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                transform: "rotate(-90deg)",
                whiteSpace: "nowrap",
              }}
            >
              <EditableText
                value={yAxisLabel}
                editable={editable}
                onChange={(v) => onTextEdit?.("yAxisLabel", v)}
              />
            </div>
          </div>

          {/* Área do chart */}
          <div style={{ flex: 1, position: "relative", height: chartH }}>
            {/* Gridlines */}
            {Array.from({ length: gridLines }).map((_, i) => {
              const y = (chartH / (gridLines - 1)) * i;
              const label = Math.round(
                effectiveYMax - (effectiveYMax / (gridLines - 1)) * i
              );
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: y,
                    left: 0,
                    right: 0,
                    borderTop: "1px dashed #ddd",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: -22,
                      top: -8,
                      fontSize: 11,
                      color: "#888",
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}

            {/* Barras */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 10,
                right: 10,
                height: "100%",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-end",
              }}
            >
              {bars.map((b, i) => {
                const targetH = (b.value / effectiveYMax) * chartH;
                const currentH = targetH * grow;
                return (
                  <div
                    key={i}
                    style={{
                      width: barWidth,
                      height: currentH,
                      background: b.color ?? "#7A8B7E",
                      borderTop: "1px solid rgba(0,0,0,0.1)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Labels embaixo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            paddingLeft: 50,
            marginTop: 8,
          }}
        >
          {bars.map((b, i) => (
            <div
              key={i}
              style={{
                width: barWidth + 20,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "#222",
              }}
            >
              <EditableText
                value={b.label}
                editable={editable}
                onChange={(v) => onTextEdit?.(`label${i + 1}`, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
