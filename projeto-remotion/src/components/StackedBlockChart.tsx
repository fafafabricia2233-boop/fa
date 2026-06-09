import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export type Block = {
  /** Label dentro do bloco. Ex: "MUSCLE", "FAT" */
  label: string;
  /** Altura final (em px) */
  height: number;
  /** Largura final (em px). Default: largura do card. */
  width?: number;
  /** Cor do bloco */
  color: string;
  /** Cor do texto. Default: branco */
  textColor?: string;
  /** Tamanho da fonte */
  fontSize?: number;
};

export type StackedBlockChartProps = {
  top?: number;
  left?: number;
  /** Largura do card (default: ajusta ao maior bloco + padding) */
  width?: number;
  /** Título com seta acima dos blocos. Ex: "WEIGHT GAIN →" */
  headerLabel?: string;
  /** Blocos empilhados (de baixo para cima na ordem do array) */
  blocks: Block[];
  /** Frames de animação de subida */
  growFrames?: number;
  /** Gap entre blocos */
  gap?: number;
  /** Modo de edicao inline (apenas dev/composer). Default false. */
  editable?: boolean;
  /** Callback quando texto e editado em modo editable */
  onTextEdit?: (key: string, value: string) => void;
};

export const StackedBlockChart: React.FC<StackedBlockChartProps> = ({
  top = 100,
  left = 60,
  width = 380,
  headerLabel = "WEIGHT GAIN",
  blocks,
  growFrames = 24,
  gap = 0,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const grow = interpolate(frame, [4, 4 + growFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        fontFamily,
      }}
    >
      {/* Header com seta */}
      {headerLabel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 14,
            opacity: headerOpacity,
            fontSize: 22,
            fontWeight: 900,
            color: "#1A1A1A",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          <EditableText
            value={headerLabel}
            editable={editable}
            onChange={(v) => onTextEdit?.("headerLabel", v)}
          />
          <span style={{ fontSize: 28 }}>→</span>
        </div>
      )}

      {/* Blocos empilhados (renderiza de baixo p/ cima) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "flex-start",
          gap,
        }}
      >
        {blocks.map((b, i) => {
          const blockWidth = b.width ?? width;
          const currentHeight = b.height * grow;
          return (
            <div
              key={i}
              style={{
                width: blockWidth,
                height: currentHeight,
                background: b.color,
                color: b.textColor ?? "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: b.fontSize ?? 22,
                fontWeight: 900,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {currentHeight > (b.fontSize ?? 22) * 1.3 && (
                <EditableText
                  value={b.label}
                  editable={editable}
                  onChange={(v) => onTextEdit?.(`label${i + 1}`, v)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
