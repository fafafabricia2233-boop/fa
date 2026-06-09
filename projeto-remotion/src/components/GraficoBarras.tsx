import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"] });

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type BarSpec = {
  /** Linhas do label esquerdo. Ex: ["PESO", "(KG)"] */
  label: string[];
  /** Cor da barra (e do label). Aceita hex/rgba. Se omitido, usa cor neutra. */
  color?: string;
  /** Valor inicial (frame 0) */
  from: number;
  /** Valor final (plateau ou fim da animacao) */
  to: number;
  /** Unidade exibida no valor. Ex: "kg", "%", "g" */
  unit?: string;
  /** Casas decimais durante a animacao (default 0). No plateau, sempre 1 casa. */
  decimals?: number;
  /**
   * Pisca/pulsa a barra apos o plateau. Use pra alerta (ex: resistencia insulinica alta).
   * Cor passada e usada com alpha modulado.
   */
  pulse?: boolean;
};

export type GraficoBarrasProps = {
  /** Posicao absoluta */
  top?: number;
  left?: number;
  /** Largura total do card. Se omitido, calculado automaticamente. */
  width?: number;

  /** Header preto. Ex: "DEFICIT CALORICO" */
  headerTitle?: string;
  /** Subtitulo cinza ao lado do header. Ex: "Sem melhorar sensibilidade insulinica" */
  headerSubtitle?: string;

  /** As barras a renderizar. 2 a 5 funciona bem. */
  bars: BarSpec[];

  /** Frame em que comeca o plateau (valor congela e pulse comeca). Default: 44. */
  plateauStart?: number;

  /** Frames de fade-in. Default: 6. */
  fadeInFrames?: number;

  /** Comprimento maximo da barra (px). Default: 380. */
  barAreaWidth?: number;
  /** Altura/espessura de cada barra (px). Default: 64. */
  barHeight?: number;
  /** Gap vertical entre barras (px). Default: 20. */
  barGap?: number;

  /** Background do bloco interno. Default: #F8F8F8. */
  background?: string;

  /** Modo de edicao inline (apenas dev/composer). Default false. */
  editable?: boolean;
  /** Callback quando texto e editado em modo editable */
  onTextEdit?: (key: string, value: string) => void;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_BAR_AREA_W = 380;
const DEFAULT_BAR_H = 64;
const DEFAULT_BAR_GAP = 20;
const DEFAULT_LABEL_W = 118;
const DEFAULT_SIDE_PAD = 20;
const DEFAULT_PLATEAU_START = 44;
const DEFAULT_FADE_IN = 6;
const NEUTRAL_COLOR = "#5A5A5A";

// ─── Componente ───────────────────────────────────────────────────────────────
/**
 * Grafico de barras horizontais validado (estilo Insulina/Torre).
 * Animacao: cada barra anima do valor `from` ate `to` ao longo dos primeiros
 * `plateauStart` frames. Depois congela com micro-oscilacao senoidal.
 * Use pra mostrar evolucao com plateau: peso, gordura, sono, deficit, etc.
 *
 * Registrado como Composition verde 1080x1080 no Root.tsx (chroma key prep).
 */
export const GraficoBarras: React.FC<GraficoBarrasProps> = ({
  top = 90,
  left = 40,
  width,
  headerTitle,
  headerSubtitle,
  bars,
  plateauStart = DEFAULT_PLATEAU_START,
  fadeInFrames = DEFAULT_FADE_IN,
  barAreaWidth = DEFAULT_BAR_AREA_W,
  barHeight = DEFAULT_BAR_H,
  barGap = DEFAULT_BAR_GAP,
  background = "#F8F8F8",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const frozen = frame >= plateauStart;

  // Pulse global pra alertas — calculado uma vez, aplicado por barra que pediu
  const blinkPulse = frozen
    ? interpolate(Math.sin((frame - plateauStart) * 0.52), [-1, 1], [0.42, 1])
    : 1;

  // Animacao de cada barra: from -> to em [0, plateauStart]. Depois jitter senoidal.
  const computed = bars.map((bar, i) => {
    const interp = interpolate(
      frame,
      [0, fadeInFrames, Math.floor(plateauStart * 0.4), Math.floor(plateauStart * 0.65), Math.floor(plateauStart * 0.82), plateauStart],
      [
        bar.from,
        bar.from,
        bar.from + (bar.to - bar.from) * 0.4,
        bar.from + (bar.to - bar.from) * 0.65,
        bar.from + (bar.to - bar.from) * 0.82,
        bar.to,
      ],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    // Apos plateau, jitter pequeno por barra (fase diferente pra nao casar)
    const jitter = Math.sin((frame - plateauStart) * (0.19 + i * 0.04) + i * 0.7) * 0.12;
    const value = frozen ? bar.to + jitter : interp;

    // Largura: relativa ao valor inicial (tudo comeca cheio)
    const maxRef = Math.max(Math.abs(bar.from), Math.abs(bar.to), 0.0001);
    const barPx = (Math.abs(value) / maxRef) * barAreaWidth;

    // Pulse so se a barra pediu
    const pulse = bar.pulse ? blinkPulse : 1;

    const baseColor = bar.color ?? NEUTRAL_COLOR;
    const colorWithPulse = bar.pulse
      ? `rgba(${hexToRgb(baseColor).join(", ")}, ${pulse})`
      : baseColor;

    return {
      ...bar,
      value,
      barPx: Math.max(4, barPx),
      pulse,
      resolvedColor: colorWithPulse,
    };
  });

  const cardW =
    width ?? DEFAULT_SIDE_PAD + DEFAULT_LABEL_W + 12 + barAreaWidth + DEFAULT_SIDE_PAD;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: fadeIn,
        fontFamily,
        width: cardW,
      }}
    >
      {/* HEADER (opcional) */}
      {(headerTitle || headerSubtitle) && (
        <div style={{ display: "flex", alignItems: "stretch", marginBottom: 12 }}>
          {headerTitle && (
            <div
              style={{
                background: "#1A1A1A",
                color: "#fff",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 1.2,
                padding: "5px 12px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              <EditableText
                value={headerTitle}
                editable={editable}
                onChange={(v) => onTextEdit?.("headerTitle", v)}
              />
            </div>
          )}
          {headerSubtitle && (
            <div
              style={{
                background: "#EBEBEB",
                color: "#333",
                fontWeight: 400,
                fontSize: 11,
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <EditableText
                value={headerSubtitle}
                editable={editable}
                onChange={(v) => onTextEdit?.("headerSubtitle", v)}
              />
            </div>
          )}
        </div>
      )}

      {/* BARRAS */}
      <div
        style={{
          background,
          padding: `16px ${DEFAULT_SIDE_PAD}px`,
          display: "flex",
          flexDirection: "column",
          gap: barGap,
        }}
      >
        {computed.map((bar, i) => {
          const dec = frozen ? 1 : bar.decimals ?? 0;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Label */}
              <div
                style={{
                  width: DEFAULT_LABEL_W,
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: 11,
                  color: bar.color ?? NEUTRAL_COLOR,
                  letterSpacing: 0.6,
                  lineHeight: 1.35,
                  textTransform: "uppercase",
                  textAlign: "left",
                  opacity: bar.pulse,
                }}
              >
                <EditableText
                  value={bar.label.join("\n")}
                  editable={editable}
                  onChange={(v) => onTextEdit?.(`label${i + 1}`, v)}
                />
              </div>

              {/* Track + barra */}
              <div
                style={{
                  width: barAreaWidth,
                  height: barHeight,
                  background: "#E2E2E2",
                  borderRadius: 2,
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: bar.barPx,
                    background: bar.resolvedColor,
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: bar.barPx,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 10,
                    boxSizing: "border-box" as const,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: 17,
                      color: "#fff",
                      opacity: bar.pulse,
                      fontVariantNumeric: "tabular-nums" as const,
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bar.value.toFixed(dec)}
                    {bar.unit ?? ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  // aceita "#RRGGBB" ou "RRGGBB" ou ja rgba — fallback pra cinza
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) return [90, 90, 90];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
