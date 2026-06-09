import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

export type ChecklistItem = {
  title: string;
  detail: string;
  at: number;
};

type IngredientChecklistProps = {
  items: ChecklistItem[];
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const IngredientChecklist: React.FC<IngredientChecklistProps> = ({
  items,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  return (
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 820,
        width: 470,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
        fontFamily,
      }}
    >
      {items.map((item) => {
        const local = Math.max(0, (sec - item.at) * fps);
        const visible = sec >= item.at;
        const opacity = visible
          ? interpolate(local, [0, 8], [0, 0.88], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;
        const x = visible
          ? interpolate(local, [0, 8], [-24, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })
          : -24;

        return (
          <div
            key={item.title}
            style={{
              opacity,
              transform: `translateX(${x}px)`,
              borderRadius: 8,
              background: "rgba(2,6,8,0.72)",
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "12px 14px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#2ECC71", fontSize: 22, fontWeight: 900 }}>✓</span>
              <span style={{ color: "#fff", fontSize: 21, fontWeight: 900 }}>
                <EditableText
                  value={item.title}
                  editable={editable}
                  onChange={(v) => onTextEdit?.(`title${items.indexOf(item) + 1}`, v)}
                />
              </span>
            </div>
            <div style={{ marginLeft: 32, color: "rgba(255,255,255,0.68)", fontSize: 16 }}>
              <EditableText
                value={item.detail}
                editable={editable}
                onChange={(v) => onTextEdit?.(`detail${items.indexOf(item) + 1}`, v)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
