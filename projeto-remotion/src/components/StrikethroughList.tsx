import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export type StrikeItem = {
  label: string;
  revealFrame: number; // frame absoluto dentro da Sequence em que o item aparece
};

export const StrikethroughList: React.FC<{
  items: StrikeItem[];
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
}> = ({ items, editable = false, onTextEdit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strikeDelay = Math.round(fps * 0.38); // 0.38s após reveal → risca

  return (
    <div
      style={{
        position: "absolute",
        top: 780,
        left: 60,
        right: 60,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        fontFamily,
      }}
    >
      {items.map((item, i) => {
        const local = frame - item.revealFrame;
        const visible = local >= 0;

        const revealProgress = visible
          ? interpolate(local, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })
          : 0;

        const strikeProgress =
          visible && local - strikeDelay >= 0
            ? interpolate(local - strikeDelay, [0, 14], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })
            : 0;

        return (
          <div
            key={i}
            style={{
              opacity: revealProgress,
              transform: `translateX(${(1 - revealProgress) * -24}px)`,
            }}
          >
            {/*
             * position: relative aqui garante que o risco absoluto
             * se posicione relativo SOMENTE ao container da label,
             * não à largura total da linha/tela.
             */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                position: "relative",       // âncora do risco
                paddingLeft: 20,
                paddingRight: 24,
                paddingTop: 14,
                paddingBottom: 14,
                borderRadius: 6,
                background: "rgba(26,43,74,0.82)",
                backdropFilter: "blur(4px)",
              }}
            >
              {/* Bullet laranja */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FF6B00",
                  marginRight: 18,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: 38,
                  fontWeight: 900,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: -0.5,
                }}
              >
                <EditableText
                  value={item.label}
                  editable={editable}
                  onChange={(v) => onTextEdit?.(`item${i + 1}`, v)}
                />
              </span>

              {/* Risco vermelho — 100% da largura do container (só a label) */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  height: 5,
                  borderRadius: 3,
                  background: "#E74C3C",
                  width: `${strikeProgress * 100}%`,
                  transform: "translateY(-50%)",
                  boxShadow: "0 0 8px rgba(231,76,60,0.6)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
