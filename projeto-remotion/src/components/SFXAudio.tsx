import React from "react";
import { Audio } from "remotion";

type SFXAudioProps = {
  src: string;
  volume?: number;
  playbackRate?: number;
  startFrom?: number;
  endAt?: number;
};

export const SFXAudio: React.FC<SFXAudioProps> = ({
  src,
  volume = 1,
  playbackRate = 1,
  startFrom = 0,
  endAt,
}) => {
  if (!src) {
    return null;
  }

  return (
    <Audio
      src={src}
      volume={volume}
      playbackRate={playbackRate}
      startFrom={startFrom}
      endAt={endAt}
    />
  );
};
