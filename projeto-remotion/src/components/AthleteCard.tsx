import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { EditableText } from "./EditableText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "900"] });

export type AthleteCardProps = {
  top?: number;
  left?: number;
  /** Largura do card */
  width?: number;
  /** Pill superior (década, era, categoria). Ex: "1900s", "ANTES", "CASE STUDY 1" */
  topPill?: string;
  /** Nome do atleta/personagem (vai no pill amarelo) */
  name: string;
  /** Subtítulo (stats: altura/peso/idade). Ex: "5'9, 200 lbs", "27 anos, 145kg" */
  stats?: string;
  /** Path da foto. Se null/undefined, mostra placeholder cinza. */
  photoSrc?: string;
  /** Modo "cena" — fundo preto pleno cobrindo o frame todo + card centralizado (estilo era physiques) */
  scene?: boolean;
  /** Cor do pill do nome. Default: amarelo Xandoka */
  nameAccentColor?: string;
  /** Frames de fade-in */
  fadeInFrames?: number;
  /** Slide-in vertical na entrada */
  slideInPx?: number;
  editable?: boolean;
  onTextEdit?: (key: string, value: string) => void;
};

export const AthleteCard: React.FC<AthleteCardProps> = ({
  top = 100,
  left = 60,
  width = 380,
  topPill,
  name,
  stats,
  photoSrc,
  scene = false,
  nameAccentColor = "#FFD700",
  fadeInFrames = 10,
  slideInPx = 24,
  editable = false,
  onTextEdit,
}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slide = interpolate(frame, [0, fadeInFrames], [slideInPx, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Pill do nome entra depois
  const nameFade = interpolate(
    frame,
    [fadeInFrames + 4, fadeInFrames + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cardContent = (
    <div
      style={{
        position: scene ? "relative" : "absolute",
        top: scene ? undefined : top,
        left: scene ? undefined : left,
        width,
        opacity: fade,
        transform: `translateY(${slide}px)`,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Top pill (década/categoria) */}
      {topPill && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #1A1A1A",
              borderRadius: 8,
              padding: "8px 22px",
              fontSize: 26,
              fontWeight: 700,
              color: "#1A1A1A",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              letterSpacing: 0.4,
            }}
          >
            <EditableText
              value={topPill}
              editable={editable}
              onChange={(v) => onTextEdit?.("topPill", v)}
            />
          </div>
          <div
            style={{
              marginTop: 4,
              width: "45%",
              height: 3,
              background: "#1A1A1A",
              borderRadius: 2,
            }}
          />
        </div>
      )}

      {/* Foto */}
      <div
        style={{
          width: width * 0.95,
          aspectRatio: "3 / 4",
          background: "#2A2A2A",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {photoSrc ? (
          <Img
            src={staticFile(photoSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(0.15) contrast(1.05)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: 22,
              fontWeight: 600,
              background:
                "repeating-linear-gradient(45deg, #2A2A2A, #2A2A2A 12px, #333 12px, #333 24px)",
            }}
          >
            <EditableText
              value="[ FOTO ]"
              editable={editable}
              onChange={(v) => onTextEdit?.("photoPlaceholder", v)}
            />
          </div>
        )}

        {/* Name pill amarelo + stats — sobreposto canto inf-direito */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 16,
            opacity: nameFade,
            transform: `translateX(${(1 - nameFade) * 20}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <div
            style={{
              background: nameAccentColor,
              color: "#1A1A1A",
              padding: "6px 14px",
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 4,
              boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
            }}
          >
            <EditableText
              value={name}
              editable={editable}
              onChange={(v) => onTextEdit?.("name", v)}
            />
          </div>
          {stats && (
            <div
              style={{
                background: "rgba(20,20,20,0.7)",
                color: "#FFFFFF",
                padding: "4px 10px",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 4,
                whiteSpace: "nowrap",
              }}
            >
              <EditableText
                value={stats}
                editable={editable}
                onChange={(v) => onTextEdit?.("stats", v)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Modo cena: envolve com fundo preto full-frame
  if (scene) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
};
