import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export type PictogramGroup = {
  /** Quantidade de figuras nesse grupo */
  count: number;
  /** Cor da figura. Ex: "#2D6A4F" (verde), "#888" (cinza), "#7AAACB" (azul claro) */
  color: string;
};

export type PictogramGridProps = {
  top?: number;
  left?: number;
  /** Largura total do grid em px */
  width?: number;
  /** Número de colunas */
  cols: number;
  /** Grupos coloridos. Vão sendo preenchidos da esquerda pra direita, top→bottom */
  groups: PictogramGroup[];
  /** Tamanho de cada pictograma em px (height) */
  iconSize?: number;
  /** Gap horizontal/vertical entre figuras */
  gap?: number;
  /** Delay (em frames) entre cada figura aparecer */
  staggerFrames?: number;
  /** Frame em que começa o stagger. Default 0 */
  startFrame?: number;
};

// SVG silhueta humana flat-icon estilo Nippard
const HumanIcon: React.FC<{ size: number; color: string; opacity: number }> = ({
  size,
  color,
  opacity,
}) => (
  <svg
    width={size * 0.65}
    height={size}
    viewBox="0 0 65 100"
    style={{ opacity, display: "block" }}
  >
    {/* Cabeça */}
    <circle cx="32.5" cy="14" r="11" fill={color} />
    {/* Corpo + braços + pernas (silhueta simplificada) */}
    <path
      d="M32.5 27
         C 20 27, 14 35, 14 46
         L 14 60
         C 14 64, 16 66, 18 66
         L 18 92
         C 18 96, 22 98, 26 98
         L 26 70
         L 39 70
         L 39 98
         C 43 98, 47 96, 47 92
         L 47 66
         C 49 66, 51 64, 51 60
         L 51 46
         C 51 35, 45 27, 32.5 27 Z"
      fill={color}
    />
  </svg>
);

export const PictogramGrid: React.FC<PictogramGridProps> = ({
  top = 100,
  left = 60,
  width,
  cols,
  groups,
  iconSize = 70,
  gap = 6,
  staggerFrames = 2,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();

  // Achata todos os grupos numa lista única com cor
  const allIcons: { color: string }[] = [];
  groups.forEach((g) => {
    for (let i = 0; i < g.count; i++) allIcons.push({ color: g.color });
  });

  const totalWidth = width ?? cols * (iconSize * 0.65 + gap);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: totalWidth,
        display: "flex",
        flexWrap: "wrap",
        gap,
      }}
    >
      {allIcons.map((icon, i) => {
        const visibleAt = startFrame + i * staggerFrames;
        const opacity = interpolate(
          frame,
          [visibleAt, visibleAt + 4],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <HumanIcon
            key={i}
            size={iconSize}
            color={icon.color}
            opacity={opacity}
          />
        );
      })}
    </div>
  );
};
