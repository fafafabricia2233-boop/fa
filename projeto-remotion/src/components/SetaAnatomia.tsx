import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type SetaAnatomiaProps = {
  /**
   * Origem da seta (ponto de PARTIDA — onde o label fica).
   * Sistema de coordenadas absoluto da composition.
   */
  fromX: number;
  fromY: number;

  /** Destino da seta (ponta — onde aponta no corpo/grafico). */
  toX: number;
  toY: number;

  /**
   * Cor principal da seta + glow.
   * Default: #FFD700 (amarelo Xandoka). Use #E74C3C pra alerta, #FF6B00 pra dado.
   */
  color?: string;

  /** Espessura do traco (px). Default: 8. */
  strokeWidth?: number;

  /** Tamanho da ponta da seta (px). Default: 32. */
  arrowHeadSize?: number;

  /**
   * Texto que aparece junto a origem (fromX/fromY).
   * Ex: "GLUTEO MEDIO", "AQUI", "100% MAIOR". Opcional.
   */
  label?: string;

  /** Posicao do label relativo a origem. Default: "auto" (acima se seta desce, abaixo se sobe). */
  labelPosition?: "above" | "below" | "left" | "right" | "auto";

  /** Tamanho da fonte do label. Default: 32. */
  labelFontSize?: number;

  /** Glow ao redor da seta. Default: true. */
  glow?: boolean;

  /**
   * Frames de draw-in (a seta "desenha" do origem ate o destino).
   * Default: 14.
   */
  drawInFrames?: number;

  /** Frames de pulse continuo apos draw-in (0 desabilita). Default: 0 (estavel). */
  pulseAfterFrames?: number;

  /** Atraso antes de comecar a animar (frames). Default: 0. */
  delayFrames?: number;
};

// ─── Componente ───────────────────────────────────────────────────────────────
/**
 * Seta animada estilo Nippard / anatomy reveal.
 *
 * Anima: desenha do origem ate o destino em `drawInFrames`, ponta aparece no fim,
 * label fade-in junto. Glow amarelo (ou cor escolhida) por baixo.
 *
 * USO: passe `fromX/fromY` (onde fica o label) e `toX/toY` (onde a ponta aponta).
 * Coordenadas em pixels relativas ao topo-esquerdo da composition.
 *
 * Envolva em <DevDraggable> NAO — DevDraggable mexe em `top/left`, mas aqui
 * voce ajusta `fromX/fromY/toX/toY`. Posicione visualmente no Studio editando o JSON.
 */
export const SetaAnatomia: React.FC<SetaAnatomiaProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  color = "#FFD700",
  strokeWidth = 8,
  arrowHeadSize = 32,
  label,
  labelPosition = "auto",
  labelFontSize = 32,
  glow = true,
  drawInFrames = 14,
  pulseAfterFrames = 0,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - delayFrames);

  // Progresso do draw-in (0 -> 1)
  const drawProgress = interpolate(localFrame, [0, drawInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Pulse opcional apos draw-in
  const pulse =
    pulseAfterFrames > 0 && localFrame > drawInFrames
      ? interpolate(
          Math.sin((localFrame - drawInFrames) * (Math.PI * 2 / pulseAfterFrames)),
          [-1, 1],
          [0.7, 1]
        )
      : 1;

  // Ponta da linha animada
  const currentX = fromX + (toX - fromX) * drawProgress;
  const currentY = fromY + (toY - fromY) * drawProgress;

  // Angulo da seta (radianos)
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const angleDeg = (angle * 180) / Math.PI;

  // Ponta da seta — so aparece quando draw chegou perto do fim
  const headOpacity = interpolate(drawProgress, [0.85, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label fade-in junto com a ponta
  const labelOpacity = interpolate(drawProgress, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Box que cobre toda a area pra desenhar SVG
  const minX = Math.min(fromX, toX) - arrowHeadSize * 2 - 40;
  const minY = Math.min(fromY, toY) - arrowHeadSize * 2 - 40;
  const maxX = Math.max(fromX, toX) + arrowHeadSize * 2 + 40;
  const maxY = Math.max(fromY, toY) + arrowHeadSize * 2 + 40;
  const w = maxX - minX;
  const h = maxY - minY;

  // Glow filter id unico por instancia
  const glowId = `seta-glow-${Math.round(fromX)}-${Math.round(fromY)}`;

  // Posicao do label
  const labelOffset = 20;
  const labelStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      position: "absolute",
      fontFamily,
      fontWeight: 900,
      fontSize: labelFontSize,
      color,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.5)",
      opacity: labelOpacity * pulse,
      whiteSpace: "nowrap",
      transform: "translateZ(0)",
    };
    let pos: "above" | "below" | "left" | "right" = "above";
    if (labelPosition === "auto") {
      // Se a seta desce (toY > fromY), label fica em cima. Senao, embaixo.
      pos = toY > fromY ? "above" : "below";
    } else {
      pos = labelPosition;
    }
    switch (pos) {
      case "above":
        return { ...base, top: fromY - labelFontSize - labelOffset, left: fromX, transform: "translateX(-50%)" };
      case "below":
        return { ...base, top: fromY + labelOffset, left: fromX, transform: "translateX(-50%)" };
      case "left":
        return { ...base, top: fromY - labelFontSize / 2, left: fromX - labelOffset, transform: "translateX(-100%)" };
      case "right":
        return { ...base, top: fromY - labelFontSize / 2, left: fromX + labelOffset };
    }
  })();

  return (
    <>
      <svg
        style={{
          position: "absolute",
          left: minX,
          top: minY,
          width: w,
          height: h,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {glow && (
          <defs>
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}

        {/* Linha (do origem ao ponto animado atual) */}
        <line
          x1={fromX - minX}
          y1={fromY - minY}
          x2={currentX - minX}
          y2={currentY - minY}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={pulse}
          filter={glow ? `url(#${glowId})` : undefined}
        />

        {/* Ponta da seta — triangulo rotacionado no destino */}
        <g
          transform={`translate(${toX - minX}, ${toY - minY}) rotate(${angleDeg})`}
          opacity={headOpacity * pulse}
        >
          <polygon
            points={`0,0 -${arrowHeadSize},-${arrowHeadSize / 2.2} -${arrowHeadSize * 0.7},0 -${arrowHeadSize},${arrowHeadSize / 2.2}`}
            fill={color}
            filter={glow ? `url(#${glowId})` : undefined}
          />
        </g>
      </svg>

      {label && <div style={labelStyle}>{label}</div>}
    </>
  );
};
