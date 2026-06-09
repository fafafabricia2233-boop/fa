import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "900"] });

export type GaugeLevel = {
  label: string;
  color: string;
};

export type ExperienceGaugeProps = {
  top?: number;
  left?: number;
  /** Largura total (do semi-círculo) */
  width?: number;
  /** Níveis em ordem (esquerda → direita) */
  levels: GaugeLevel[];
  /** Index do nível ativo (recebe a seta) */
  activeIndex: number;
  /** Cor da seta. Default: verde Nippard #5A8C50 */
  arrowColor?: string;
  /** Label da seta (opcional). Aparece dentro da fatia ativa */
  arrowLabel?: string;
  /** Frames de fade-in */
  fadeInFrames?: number;
};

export const ExperienceGauge: React.FC<ExperienceGaugeProps> = ({
  top = 100,
  left = 60,
  width = 440,
  levels,
  activeIndex,
  arrowColor = "#5A8C50",
  arrowLabel,
  fadeInFrames = 10,
}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowGrow = interpolate(
    frame,
    [fadeInFrames, fadeInFrames + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const W = width;
  const H = width / 2;
  const cx = W / 2;
  const cy = H;
  const r = H - 10;

  // Cada fatia ocupa (180 / N) graus, esquerda → direita
  const sliceAngle = 180 / levels.length;

  // Helper pra criar path SVG de uma fatia
  const slicePath = (i: number) => {
    const startDeg = 180 + i * sliceAngle; // começa em 180° (esquerda)
    const endDeg = 180 + (i + 1) * sliceAngle;
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Centro angular da fatia ativa (pra posicionar label + seta)
  const activeCenterDeg = 180 + (activeIndex + 0.5) * sliceAngle;
  const activeCenterRad = (activeCenterDeg * Math.PI) / 180;
  const labelR = r * 0.62;
  const labelX = cx + labelR * Math.cos(activeCenterRad);
  const labelY = cy + labelR * Math.sin(activeCenterRad);

  // Seta apontando pro centro da fatia ativa, vindo de fora
  const arrowStartR = r * 0.95;
  const arrowEndR = r * 0.45;
  const aSx = cx + arrowStartR * Math.cos(activeCenterRad);
  const aSy = cy + arrowStartR * Math.sin(activeCenterRad);
  const aEx = cx + arrowEndR * Math.cos(activeCenterRad);
  const aEy = cy + arrowEndR * Math.sin(activeCenterRad);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: fade,
        fontFamily,
      }}
    >
      <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`}>
        {/* Fatias */}
        {levels.map((lvl, i) => (
          <path
            key={i}
            d={slicePath(i)}
            fill={lvl.color}
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        ))}

        {/* Labels em cada fatia */}
        {levels.map((lvl, i) => {
          const centerDeg = 180 + (i + 0.5) * sliceAngle;
          const centerRad = (centerDeg * Math.PI) / 180;
          const lr = r * 0.7;
          const lx = cx + lr * Math.cos(centerRad);
          const ly = cy + lr * Math.sin(centerRad);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily,
                fontSize: 16,
                fontWeight: 700,
                fill: i === activeIndex ? "#FFFFFF" : "#333",
                letterSpacing: 0.3,
              }}
            >
              {lvl.label}
            </text>
          );
        })}

        {/* Seta apontando pra fatia ativa */}
        <g opacity={arrowGrow}>
          <defs>
            <marker
              id="exp-arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill={arrowColor} />
            </marker>
          </defs>
          <line
            x1={aSx}
            y1={aSy}
            x2={aEx}
            y2={aEy}
            stroke={arrowColor}
            strokeWidth={5}
            markerEnd="url(#exp-arrowhead)"
          />
          {arrowLabel && (
            <text
              x={labelX}
              y={labelY + 22}
              textAnchor="middle"
              style={{
                fontFamily,
                fontSize: 14,
                fontWeight: 900,
                fill: "#FFFFFF",
              }}
            >
              {arrowLabel}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
