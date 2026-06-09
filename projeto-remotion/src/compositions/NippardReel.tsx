import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useDelayRender,
  useVideoConfig,
  Video,
} from "remotion";
import type { Caption as RemotionCaption } from "@remotion/captions";
import { Caption } from "../components/Caption";
import { LogoStamp } from "../components/LogoStamp";
import { PaperOverlay } from "../components/PaperOverlay";
import { StatBar } from "../components/StatBar";
import { loadCaptionFile } from "../lib/whisper";

export type NippardOverlay =
  | {
      type: "paper";
      start: number;
      end: number;
      title: string;
      subtitle?: string;
      source?: string;
      imageSrc?: string;
      position?: "top" | "right" | "bottom";
    }
  | {
      type: "stat";
      start: number;
      end: number;
      label: string;
      value: string;
      detail?: string;
      tone?: "blue" | "orange" | "green" | "red";
    };

export type NippardReelProps = {
  videoSrc: string;
  captionsJson: string;
  overlays: NippardOverlay[];
  duration: number;
};

const isRemote = (src: string) => /^https?:\/\//i.test(src);

const resolveAsset = (src: string) => {
  if (!src) {
    return "";
  }

  return isRemote(src) ? src : staticFile(src);
};

export const NippardReel: React.FC<NippardReelProps> = ({
  videoSrc,
  captionsJson,
  overlays,
}) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading captions"));

  useEffect(() => {
    if (!captionsJson) {
      setCaptions([]);
      continueRender(handle);
      return;
    }

    loadCaptionFile(resolveAsset(captionsJson))
      .then((loaded) => {
        setCaptions(loaded);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [cancelRender, captionsJson, continueRender, handle]);

  const timedOverlays = useMemo(
    () =>
      overlays.map((overlay, index) => ({
        overlay,
        index,
        from: Math.round(overlay.start * fps),
        durationInFrames: Math.max(1, Math.round((overlay.end - overlay.start) * fps)),
      })),
    [fps, overlays],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#080b10", overflow: "hidden" }}>
      {videoSrc ? (
        <Video
          src={resolveAsset(videoSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, #0b1118 0%, #151b22 52%, #07090d 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 140,
              left: 72,
              right: 72,
              color: "white",
              fontFamily: "Arial, sans-serif",
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            Nippard Reel
          </div>
        </AbsoluteFill>
      )}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {timedOverlays.map(({ overlay, index, from, durationInFrames }) => (
        <Sequence
          key={`${overlay.type}-${index}`}
          from={from}
          durationInFrames={durationInFrames}
        >
          {overlay.type === "paper" ? (
            <PaperOverlay {...overlay} />
          ) : (
            <StatBar {...overlay} />
          )}
        </Sequence>
      ))}

      <Caption captions={captions} />
      <LogoStamp handle="@xandokaoriginal" />
    </AbsoluteFill>
  );
};
