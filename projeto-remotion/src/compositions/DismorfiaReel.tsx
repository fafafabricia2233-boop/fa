import React, { useEffect, useMemo, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
  Video,
} from "remotion";
import { BeforeAfterCard } from "../components/BeforeAfterCard";
import { Caption } from "../components/Caption";
import { GuestPhotoOverlay } from "../components/GuestPhotoOverlay";
import { LogoStamp } from "../components/LogoStamp";
import { ScientificFooter } from "../components/ScientificFooter";
import { SFXAudio } from "../components/SFXAudio";
import { StatBar } from "../components/StatBar";
import { TopTitleCard } from "../components/TopTitleCard";
import { loadCaptionFile } from "../lib/whisper";
import { T } from "./dismorfia_timecodes";

export type DismorfiaReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
  leftPhotoSrc: string;
  rightPhotoSrc: string;
  ganleyPhotoSrc: string;
  matuePhotoSrc: string;
  nih23Src: string;
  nih38Src: string;
};

const COLOR_RED = "#E74C3C";
const COLOR_YELLOW = "#FFD700";
const STATBAR_Y1 = 156;
const STATBAR_Y2 = 156;
const BEFORE_AFTER_Y = 820;
const SINGLE_PHOTO_Y = 860;

const SFX = {
  hit: { volume: 0.48, playbackRate: 1.28, startFrom: 5, duration: 1.15 },
  pop: { volume: 0.38, playbackRate: 1.45, startFrom: 2, duration: 0.45 },
  rumble: { volume: 0.36, playbackRate: 1.35, startFrom: 8, duration: 0.95 },
  whoosh: { volume: 0.34, playbackRate: 1.5, startFrom: 2, duration: 0.55 },
  emptying: { volume: 0.42, playbackRate: 1.18, startFrom: 0, duration: 1.1 },
};

const isRemote = (src: string) => /^https?:\/\//i.test(src);
const resolveAsset = (src: string) => (src ? (isRemote(src) ? src : staticFile(src)) : "");

const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading Dismorfia captions"));

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

  return captions;
};

const NihPrintOverlay: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 12], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const inOpacity = interpolate(frame, [0, 10], [0, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(frame, [durationInFrames - 8, durationInFrames], [0.94, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        right: 40,
        bottom: 360,
        width: 420,
        borderRadius: 6,
        opacity: Math.min(inOpacity, outOpacity),
        transform: `translateY(${y}px)`,
        boxShadow: "0 18px 45px rgba(0,0,0,0.36)",
      }}
    />
  );
};

const MainVideo: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const ramp = (start: number, end: number, from: number, to: number) =>
    interpolate(sec, [start, end], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const scale =
    sec < 15.21
      ? 1
      : sec < 16.45
        ? ramp(15.21, 16.45, 1, 1.09)
        : sec < 25.15
          ? 1.09
          : sec < 26.4
            ? ramp(25.15, 26.4, 1.09, 1.18)
            : sec < 37.02
              ? 1.18
              : sec < 38.3
                ? ramp(37.02, 38.3, 1.18, 1.28)
                : sec < T.take8Start
                  ? 1.28
                  : ramp(T.take8Start, T.take8Start + 1.4, 1.18, 1.25);

  return (
    <Video
      src={src}
      delayRenderTimeoutInMilliseconds={120000}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
      }}
    />
  );
};

export const DismorfiaReel: React.FC<DismorfiaReelProps> = ({
  videoSrc,
  captionsJson,
  duration,
  leftPhotoSrc,
  rightPhotoSrc,
  ganleyPhotoSrc,
  matuePhotoSrc,
  nih23Src,
  nih38Src,
}) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions(captionsJson);
  const totalFrames = Math.ceil((duration || T.totalDur) * fps);
  const f = (seconds: number) => Math.round(seconds * fps);
  const d = (start: number, end: number) => Math.max(1, f(end) - f(start));
  const finalClimax = T.take8Climax < (duration || T.totalDur) ? T.take8Climax : T.take8Start;

  const assets = useMemo(
    () => ({
      video: resolveAsset(videoSrc),
      leftPhoto: resolveAsset(leftPhotoSrc),
      rightPhoto: resolveAsset(rightPhotoSrc),
      ganley: resolveAsset(ganleyPhotoSrc),
      matue: resolveAsset(matuePhotoSrc),
      nih23: resolveAsset(nih23Src),
      nih38: resolveAsset(nih38Src),
      music: staticFile("dismorfia/music_bg.mp3"),
      hit: staticFile("dismorfia/sfx_hit.mp3"),
      pop: staticFile("dismorfia/sfx_pop.mp3"),
      rumble: staticFile("dismorfia/sfx_rumble.mp3"),
      whoosh: staticFile("dismorfia/new_whoosh.mp3"),
      emptying: staticFile("dismorfia/esvaziando_sfx.mp3"),
    }),
    [ganleyPhotoSrc, leftPhotoSrc, matuePhotoSrc, nih23Src, nih38Src, rightPhotoSrc, videoSrc],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080c", overflow: "hidden" }}>
      <AbsoluteFill>{assets.video ? <MainVideo src={assets.video} /> : null}</AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      <Audio src={assets.music} volume={0.07} />

      <Sequence from={f(T.take1Start)} durationInFrames={d(T.take1Start, T.take2Start)}>
        <TopTitleCard text="65KG PERDIDOS" color={COLOR_YELLOW} />
      </Sequence>
      <Sequence from={0} durationInFrames={f(SFX.hit.duration)}>
        <SFXAudio src={assets.hit} {...SFX.hit} />
      </Sequence>
      <Sequence from={f(T.take1Inflate)} durationInFrames={f(SFX.rumble.duration)}>
        <SFXAudio src={assets.rumble} {...SFX.rumble} />
      </Sequence>

      <Sequence from={f(T.take3Start)} durationInFrames={f(SFX.whoosh.duration)}>
        <SFXAudio src={assets.whoosh} {...SFX.whoosh} />
      </Sequence>
      <Sequence from={f(T.take3Start)} durationInFrames={d(T.take3Start, T.take4Start)}>
        <BeforeAfterCard
          leftSrc={assets.leftPhoto}
          leftLabel="EU ANTES"
          yOffset={SINGLE_PHOTO_Y}
          leftObjectPosition="center 42%"
          leftZoom={1.5}
        />
      </Sequence>

      <Sequence from={f(T.take4Stat1)} durationInFrames={Math.max(1, f(T.take4Stat2) - f(T.take4Stat1) - 3)}>
        <StatBar
          label="POPULACAO MUNDIAL"
          value="2 A 3%"
          detail="sofrem de distorcao de imagem"
          tone="blue"
          yOffset={STATBAR_Y1}
        />
      </Sequence>
      <Sequence from={f(T.take4Stat1)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>

      <Sequence from={f(T.take4Stat2)} durationInFrames={d(T.take4Stat2, T.take5Start)}>
        <StatBar
          label="PENSAM NO PROPRIO CORPO"
          value="3 A 8H / DIA"
          detail="todos os dias"
          tone="blue"
          yOffset={STATBAR_Y2}
        />
      </Sequence>
      <Sequence from={f(T.take4Stat2)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>

      <Sequence from={f(T.take4Paper1)} durationInFrames={d(T.take4Paper1, T.take4Paper2)}>
        <NihPrintOverlay src={assets.nih23} durationInFrames={d(T.take4Paper1, T.take4Paper2)} />
      </Sequence>
      <Sequence from={f(T.take4Paper1)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>
      <Sequence from={f(T.take4Paper1)} durationInFrames={f(SFX.whoosh.duration)}>
        <SFXAudio src={assets.whoosh} {...SFX.whoosh} />
      </Sequence>
      <Sequence from={f(T.take4Paper2)} durationInFrames={d(T.take4Paper2, T.take4Photos)}>
        <NihPrintOverlay src={assets.nih38} durationInFrames={d(T.take4Paper2, T.take4Photos)} />
      </Sequence>
      <Sequence from={f(T.take4Paper2)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>

      <Sequence from={f(T.take4Photos)} durationInFrames={d(T.take4Photos, T.take5Start)}>
        <BeforeAfterCard
          leftSrc={assets.leftPhoto}
          rightSrc={assets.rightPhoto}
          leftLabel="ANTES"
          rightLabel="AGORA"
          yOffset={BEFORE_AFTER_Y}
          leftObjectPosition="center 42%"
          rightObjectPosition="center center"
          leftZoom={1.5}
        />
      </Sequence>

      <Sequence from={f(T.ganleyMoment)} durationInFrames={d(T.ganleyMoment, T.ganleyEnd)}>
        <GuestPhotoOverlay
          imageSrc={assets.ganley}
          creditHandle="@ganleygabriel"
          widthPct={42}
          side="left"
          placement="lower-left"
          durationInFrames={d(T.ganleyMoment, T.ganleyEnd)}
        />
      </Sequence>
      <Sequence from={f(T.matueMoment)} durationInFrames={d(T.matueMoment, T.matueEnd)}>
        <GuestPhotoOverlay
          imageSrc={assets.matue}
          creditHandle="@matue"
          widthPct={42}
          side="left"
          placement="lower-left"
          durationInFrames={d(T.matueMoment, T.matueEnd)}
        />
      </Sequence>

      <Sequence from={f(T.take6Inflate)} durationInFrames={f(SFX.rumble.duration)}>
        <SFXAudio src={assets.rumble} {...SFX.rumble} />
      </Sequence>
      <Sequence from={f(T.take6Deflate)} durationInFrames={f(SFX.emptying.duration)}>
        <SFXAudio src={assets.emptying} {...SFX.emptying} />
      </Sequence>

      <Sequence from={f(T.take7Deflate)} durationInFrames={f(SFX.whoosh.duration)}>
        <SFXAudio src={assets.whoosh} {...SFX.whoosh} />
      </Sequence>
      <Sequence from={f(T.compareCard)} durationInFrames={Math.max(1, f(T.take8Start) - f(T.compareCard))}>
        <BeforeAfterCard
          leftSrc={assets.leftPhoto}
          rightSrc={assets.rightPhoto}
          leftLabel="ANTES"
          rightLabel="AGORA"
          yOffset={BEFORE_AFTER_Y}
          leftObjectPosition="center 42%"
          rightObjectPosition="center center"
          leftZoom={1.5}
        />
      </Sequence>

      <Sequence from={f(finalClimax)} durationInFrames={Math.max(1, totalFrames - f(finalClimax))}>
        <SFXAudio src={assets.hit} {...SFX.hit} />
        <TopTitleCard text="ESCOLHA." color="#FFFFFF" />
      </Sequence>
      <Sequence from={f(T.take4Paper1)} durationInFrames={Math.max(1, f(T.take4Photos) - f(T.take4Paper1))}>
        <ScientificFooter
          text="StatPearls · Body Dysmorphic Disorder | Nicewicz et al. · NIH/NLM · Jan 2024"
          durationInFrames={Math.max(1, f(T.take4Photos) - f(T.take4Paper1))}
        />
      </Sequence>

      <Caption
        captions={captions}
        colorOverrides={{
          MENTINDO: COLOR_RED,
          NUNCA: COLOR_RED,
          ENGANAR: COLOR_RED,
          "65": COLOR_YELLOW,
          "65KG": COLOR_YELLOW,
          PROGRESSO: COLOR_YELLOW,
        }}
      />
      <LogoStamp handle="@xandokaoriginal" />
    </AbsoluteFill>
  );
};
