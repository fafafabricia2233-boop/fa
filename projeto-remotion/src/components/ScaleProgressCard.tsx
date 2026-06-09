import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export type ScaleProgressCardProps = {
  top?: number;
  left?: number;
  width?: number;
  /** Escala das imagens dentro do card (0.0-1.0). Default: 0.82 */
  imageScale?: number;
  label1?: string;
  label2?: string;
  label3?: string;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

const SCALES = [
  { src: "reel07/balanca_110.png", label: "110,3 KG", dir: "left"  },
  { src: "reel07/balanca_102.png", label: "102,5 KG", dir: "right" },
  { src: "reel07/balanca_92.png",  label: "92,9 KG",  dir: "left"  },
] as const;

const SCALE_DELAY = 20;
const SLIDE_DUR   = 14;

export const ScaleProgressCard: React.FC<ScaleProgressCardProps> = ({
  top       = 285,
  left      = 55,
  width     = 960,
  imageScale = 0.82,
  label1 = "110,3 KG",
  label2 = "102,5 KG",
  label3 = "92,9 KG",
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();

  const imgWidth  = Math.round(width * imageScale);
  const imgMargin = Math.round((width - imgWidth) / 2);
  const gap       = 6;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {SCALES.map((scale, idx) => {
        const labels = [label1, label2, label3];
        const start = idx * SCALE_DELAY;

        const slideProgress = interpolate(
          frame,
          [start, start + SLIDE_DUR],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        const offsetX =
          scale.dir === "left"
            ? (1 - slideProgress) * -(imgWidth + 120)
            : (1 - slideProgress) * (imgWidth + 120);

        const opacity = interpolate(frame, [start, start + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={idx}
            style={{
              marginLeft: imgMargin,
              marginRight: imgMargin,
              transform: `translateX(${offsetX}px)`,
              opacity,
            }}
          >
            <Img
              src={staticFile(scale.src)}
              style={{ width: imgWidth, height: "auto", display: "block" }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#FFFFFF",
                textAlign: "center",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                textShadow: "0 3px 12px rgba(0,0,0,0.9)",
                marginTop: 2,
              }}
            >
              <EditableText
                value={labels[idx] ?? scale.label}
                editable={editable}
                onChange={(v) => onTextEdit?.(`label${idx + 1}`, v)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
