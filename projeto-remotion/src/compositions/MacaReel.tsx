import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  staticFile,
  useDelayRender,
} from "remotion";
import { Caption } from "../components/Caption";
import { NeonPill } from "../components/NeonPill";
import { PillBadge } from "../components/PillBadge";
import { StudioOverlayEditor } from "../components/StudioOverlayEditor";
import { loadCaptionFile } from "../lib/whisper";

export type MacaReelProps = {
  videoSrc: string;
  captionsJson: string;
  voiceSrc?: string;
  musicSrc?: string;
  duration: number;
};

const FPS = 30;

const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);
const tcToFrame = (seconds: number, frames: number) => seconds * FPS + frames;

const T = {
  balaIn: msToFrame(700),
  macaIn: msToFrame(2700),
  sugarOut: msToFrame(5667),
  fibraIn: msToFrame(9500),
  vitaminaIn: msToFrame(10033),
  microIn: msToFrame(11033),
  nutrientsOut: msToFrame(12300),
  coranteIn: msToFrame(14867),
  coranteOut: msToFrame(17133),
};

// ── SFX PATTERN (padrão MacaReel — replicar em novos reels) ────────────────
//
// 1. card.MP3 vol=0.5 → toca EM CADA entrada de NeonPill / PillBadge / overlay
//    → listar TODOS os startMs dos cards em TITLE_SFX_MS
//
// 2. entrada_fast.mp3 vol=0.5 → fast hit NO INÍCIO de seção com gráfico animado
//    → 1-2 frames antes do gráfico aparecer (extraído do áudio da maçã/bala)
//
// 3. Selection.MP3 vol=0.5 → click "selection" QUANDO as barras começam a mover
//    → 1 por barra animada, no frame exato em que a animação dispara

const TITLE_SFX_MS = [700, 2700, 9500, 10033, 11033, 14867];
const SFX = {
  entradaFast: [tcToFrame(18, 22)],
  selection: [tcToFrame(19, 11), tcToFrame(24, 12)],
} as const;

const COLOR_OVERRIDES: Record<string, string> = {
  "ACUCAR": "#FFD700",
  "AÇUCAR": "#FFD700",
  "AÇÚCAR": "#FFD700",
  "BALAS": "#FFD700",
  "BALA": "#FFD700",
  "CORANTE": "#FFD700",
  "FIBRA": "#FFD700",
  "MACA": "#FFD700",
  "MAÇA": "#FFD700",
  "MICRONUTRIENTES": "#FFD700",
  "VITAMINA": "#FFD700",
};

const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading MacaReel captions"));

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

export const MacaReel: React.FC<MacaReelProps> = ({
  videoSrc,
  captionsJson,
  voiceSrc,
  musicSrc,
  duration,
}) => {
  const captions = useCaptions(captionsJson);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Video
        src={staticFile(videoSrc)}
        volume={0.3}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {voiceSrc ? <Audio src={staticFile(voiceSrc)} volume={1} /> : null}
      {musicSrc ? <Audio src={staticFile(musicSrc)} volume={0.08} /> : null}

      {TITLE_SFX_MS.map((startMs) => (
        <Sequence
          key={`title-sfx-${startMs}`}
          from={msToFrame(startMs)}
          durationInFrames={30}
          layout="none"
        >
          <Audio src={staticFile("new sfx/card.MP3")} volume={0.5} />
        </Sequence>
      ))}

      {SFX.entradaFast.map((frame) => (
        <Sequence
          key={`entrada-fast-${frame}`}
          from={frame}
          durationInFrames={30}
          layout="none"
        >
          <Audio src={staticFile("new sfx/entrada_fast.mp3")} volume={0.5} />
        </Sequence>
      ))}

      {SFX.selection.map((frame) => (
        <Sequence
          key={`selection-${frame}`}
          from={frame}
          durationInFrames={30}
          layout="none"
        >
          <Audio src={staticFile("new sfx/Selection.MP3")} volume={0.5} />
        </Sequence>
      ))}

      <Sequence
        from={T.balaIn}
        durationInFrames={T.sugarOut - T.balaIn}
        layout="none"
      >
        <NeonPill
          top={323}
          left={102}
          width={600}
          height={80}
          fontSize={28}
          label="bala ="
          accent="15g açúcar"
        />
      </Sequence>

      <Sequence
        from={T.macaIn}
        durationInFrames={T.sugarOut - T.macaIn}
        layout="none"
      >
        <NeonPill
          top={208}
          left={110}
          width={600}
          height={80}
          fontSize={28}
          label="maçã ="
          accent="15g açúcar"
        />
      </Sequence>

      <Sequence
        from={T.fibraIn}
        durationInFrames={T.nutrientsOut - T.fibraIn}
        layout="none"
      >
        <NeonPill
          top={242}
          left={79}
          width={269}
          height={52}
          fontSize={28}
          label="Fibra"
        />
      </Sequence>

      <Sequence
        from={T.vitaminaIn}
        durationInFrames={T.nutrientsOut - T.vitaminaIn}
        layout="none"
      >
        <NeonPill
          top={309}
          left={74}
          width={288}
          height={50}
          fontSize={28}
          label="Vitamina c"
        />
      </Sequence>

      <Sequence
        from={T.microIn}
        durationInFrames={T.nutrientsOut - T.microIn}
        layout="none"
      >
        <NeonPill
          top={376}
          left={68}
          width={331}
          height={64}
          fontSize={28}
          label="micronutrientes"
        />
      </Sequence>

      <Sequence
        from={T.coranteIn}
        durationInFrames={T.coranteOut - T.coranteIn}
        layout="none"
      >
        <PillBadge
          top={237}
          left={131}
          width={400}
          height={70}
          text="Açúcar e"
          accent="corante"
          variant="dark"
        />
      </Sequence>

      <Caption
        captions={captions}
        mode="stable"
        paddingBottom={260}
        colorOverrides={COLOR_OVERRIDES}
        positionOverrides={[
          {
            startMs: 700,
            endMs: 5667,
            paddingBottom: 310,
          },
        ]}
      />

      <StudioOverlayEditor />
    </AbsoluteFill>
  );
};
