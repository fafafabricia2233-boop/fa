import React from "react";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

type LogoStampProps = {
  handle: string;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const LogoStamp: React.FC<LogoStampProps> = ({
  handle,
  editable = false,
  onTextEdit,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        right: 48,
        fontFamily,
        fontSize: 26,
        fontWeight: 800,
        color: "rgba(255,255,255,0.92)",
        textShadow: "0 3px 12px rgba(0,0,0,0.55)",
      }}
    >
      <EditableText
        value={handle}
        editable={editable}
        onChange={(v) => onTextEdit?.("handle", v)}
      />
    </div>
  );
};
