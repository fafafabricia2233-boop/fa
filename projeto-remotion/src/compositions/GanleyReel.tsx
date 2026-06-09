import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Video,
  staticFile,
  useDelayRender,
} from "remotion";
import { Caption } from "../components/Caption";
import { StudioOverlayEditor } from "../components/StudioOverlayEditor";
import { loadCaptionFile } from "../lib/whisper";

export type GanleyReelProps = {
  videoSrc: string;
  captionsJson: string;
  musicSrc?: string;
  duration: number;
};

const COLOR_OVERRIDES: Record<string, string> = {
  "GANLEY": "#FFD700",
  "GUNLEY": "#FFD700",   // Whisper às vezes transcreve assim
  "FISICULTURISMO": "#FFD700",
  "BRASILEIRO": "#FFD700",
  "LENDA": "#FFD700",
  "HIPOGLICEMIA": "#FFD700",
};

const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading GanleyReel captions"));

  useEffect(() => {
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => {
        setCaptions(caps);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [captionsJson, continueRender, cancelRender, handle]);

  return captions;
};

export const GanleyReel: React.FC<GanleyReelProps> = ({
  videoSrc,
  captionsJson,
  musicSrc,
  duration,
}) => {
  const captions = useCaptions(captionsJson);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Video
        src={staticFile(videoSrc)}
        volume={1}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {musicSrc ? <Audio src={staticFile(musicSrc)} volume={0.07} /> : null}

      <Caption
        captions={captions}
        mode="stable"
        paddingBottom={260}
        colorOverrides={COLOR_OVERRIDES}
      />

      <StudioOverlayEditor />
    </AbsoluteFill>
  );
};
