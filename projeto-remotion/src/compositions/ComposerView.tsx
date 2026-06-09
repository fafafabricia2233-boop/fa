/**
 * ComposerView — Composition de layout visual no Studio.
 *
 * Carrega o vídeo real embaixo e deixa você arrastar overlays por cima.
 * 1. Selecionar em Studio: pasta DEV-Composer → ComposerView
 * 2. Painel esquerdo: clicar "+" para adicionar overlay
 * 3. Arrastar para posicionar no canvas
 * 4. DevHUD (direita): ajustar tamanho / texto / tempo → COPY
 * 5. Mandar o COPY pro Claude para implementar no reel real
 *
 * Para trocar o vídeo: Studio → Edit Props → videoSrc → qualquer arquivo em public/
 */

import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, Video, staticFile } from "remotion";
import { z } from "zod";
import { DevDraggableProvider } from "../components/DevDraggable";
import { DevHUD } from "../components/DevDraggable";
import { DevComposerLayer, DevComposerPanel } from "../components/DevComposer";

// Schema Zod — habilita Edit Props no Studio
export const composerViewSchema = z.object({
  videoSrc: z.string(),
  audioSrc: z.string().optional(),
  videoOpacity: z.number().min(0).max(1),
});

export type ComposerViewProps = z.infer<typeof composerViewSchema>;

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v|mkv)$/i;

const normalizeVideoSrc = (src: string) =>
  src
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^public\//i, "");

const isCompleteVideoPath = (src: string) => VIDEO_EXT_RE.test(src);

export const ComposerView: React.FC<ComposerViewProps> = ({
  videoSrc,
  audioSrc,
  videoOpacity,
}) => {
  const normalizedVideoSrc = useMemo(
    () => normalizeVideoSrc(videoSrc),
    [videoSrc]
  );
  const normalizedAudioSrc = useMemo(
    () => (audioSrc ? normalizeVideoSrc(audioSrc) : ""),
    [audioSrc]
  );
  const [activeVideoSrc, setActiveVideoSrc] = useState(() =>
    isCompleteVideoPath(normalizedVideoSrc) ? normalizedVideoSrc : ""
  );
  const [videoStatus, setVideoStatus] = useState<
    "ready" | "typing" | "checking" | "missing"
  >(activeVideoSrc ? "ready" : "typing");

  useEffect(() => {
    if (!normalizedVideoSrc) {
      setVideoStatus("typing");
      return;
    }

    if (!isCompleteVideoPath(normalizedVideoSrc)) {
      setVideoStatus("typing");
      return;
    }

    setVideoStatus("checking");
    const timeout = window.setTimeout(() => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;

      const cleanup = () => {
        video.onloadedmetadata = null;
        video.onerror = null;
        video.removeAttribute("src");
        video.load();
      };

      video.onloadedmetadata = () => {
        setActiveVideoSrc(normalizedVideoSrc);
        setVideoStatus("ready");
        cleanup();
      };
      video.onerror = () => {
        setVideoStatus("missing");
        cleanup();
      };
      video.src = staticFile(normalizedVideoSrc);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [normalizedVideoSrc]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* ── Vídeo de referência ── */}
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        {activeVideoSrc ? (
          <Video
            key={activeVideoSrc}
            src={staticFile(activeVideoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </AbsoluteFill>

      {normalizedAudioSrc ? (
        <Audio src={staticFile(normalizedAudioSrc)} volume={1} />
      ) : null}

      {videoStatus !== "ready" ? (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 350,
            right: 350,
            zIndex: 9996,
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.78)",
            border: "1px solid rgba(255,215,0,0.45)",
            color: "#FFD700",
            fontFamily: "monospace",
            fontSize: 16,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {videoStatus === "checking"
            ? `Carregando video: ${normalizedVideoSrc}`
            : videoStatus === "missing"
              ? `Video nao encontrado ou invalido: ${normalizedVideoSrc}`
              : "Digite um caminho de video completo em videoSrc"}
        </div>
      ) : null}

      {/* ── Camada de overlay drag-and-drop ── */}
      <DevDraggableProvider>
        {/* Overlays dinâmicos */}
        <DevComposerLayer />

        {/* Painel picker (esquerda) */}
        <DevComposerPanel />

        {/* HUD de posicionamento (direita) */}
        <DevHUD />
      </DevDraggableProvider>
    </AbsoluteFill>
  );
};
