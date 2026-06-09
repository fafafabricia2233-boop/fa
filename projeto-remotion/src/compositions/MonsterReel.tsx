import React, { useEffect, useMemo, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { Caption } from "../components/Caption";
import { CognitiveZoom } from "../components/CognitiveZoom";
import { DynamicStudyOverlay } from "../components/DynamicStudyOverlay";
import { ImpactWord } from "../components/ImpactWord";
import { IngredientCard } from "../components/IngredientCard";
import { IngredientChecklist } from "../components/IngredientChecklist";
import { LogoStamp } from "../components/LogoStamp";
import { ScientificEnvironment } from "../components/ScientificEnvironment";
import { SFXAudio } from "../components/SFXAudio";
import { loadCaptionFile } from "../lib/whisper";
import { LOW_IMPACT_Y, TOP_IMPACT_Y } from "./monster_safezones";
import { T } from "./monster_timecodes";

export type MonsterReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
  studySrc: string;
  musicSrc: string;
};

const YELLOW = "#FFD700";
const GREEN = "#2ECC71";
const RED = "#E74C3C";
const BLUE = "#1a9cff";
const ORANGE = "#FF6B00";

const isRemote = (src: string) => /^https?:\/\//i.test(src);
const resolveAsset = (src: string) => (src ? (isRemote(src) ? src : staticFile(src)) : "");

const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading Monster captions"));

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

const MainVideo: React.FC<{ src: string }> = ({ src }) => (
  <Video
    src={src}
    delayRenderTimeoutInMilliseconds={120000}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
);

const SceneTint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const hookGreen = interpolate(sec, [0, 1.2, 3.34, 4.1], [0.18, 0.28, 0.1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scienceBlue = interpolate(sec, [T.scienceStart, T.scienceStart + 0.6, T.scienceEnd], [0, 0.22, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.56) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: hookGreen,
          background:
            "radial-gradient(circle at 50% 42%, rgba(46,204,113,0.14), rgba(0,0,0,0) 45%), linear-gradient(180deg, rgba(2,20,10,0.1), rgba(0,0,0,0))",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: scienceBlue,
          background: "radial-gradient(circle at 52% 44%, rgba(26,156,255,0.24), rgba(0,0,0,0) 54%)",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 190px rgba(0,0,0,0.55)",
        }}
      />
    </AbsoluteFill>
  );
};

const CenterStatement: React.FC<{ text: string; sub?: string; color?: string; top?: number }> = ({
  text,
  sub,
  color = "#fff",
  top = 760,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 56, 66], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 10], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: "center",
        fontFamily: "Arial Black, Montserrat, sans-serif",
        color,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 72,
          lineHeight: 0.9,
          fontWeight: 900,
          WebkitTextStroke: "5px #020305",
          paintOrder: "stroke fill",
          textShadow: "0 14px 34px rgba(0,0,0,0.7)",
        }}
      >
        {text}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            fontWeight: 800,
            color: "rgba(255,255,255,0.76)",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

type HUDStat = {
  label: string;
  countTo?: number;
  value?: string;
  format?: (n: number) => string;
  unit?: string;
};

const StudyHUDCard: React.FC<{
  accent: string;
  stats?: HUDStat[];
  headline?: string;
  detail?: string;
}> = ({ accent, stats, headline, detail }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const x = interpolate(frame, [0, 14], [44, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const renderStat = (s: HUDStat, idx: number) => {
    const display = typeof s.countTo === "number"
      ? (s.format ? s.format(s.countTo) : String(s.countTo))
      : s.value ?? "";
    return (
      <div key={idx} style={{ marginTop: idx === 0 ? 0 : 8 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: accent, letterSpacing: 1.4 }}>{s.label}</div>
        <div style={{ marginTop: 1, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{display}</span>
          {s.unit ? <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>{s.unit}</span> : null}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: 600,
        opacity,
        transform: `translateX(${x}px)`,
        borderRadius: 10,
        padding: "16px 24px",
        background: "rgba(4,12,20,0.88)",
        border: `1px solid ${accent}66`,
        boxShadow: `0 14px 30px rgba(0,0,0,0.55), 0 0 28px ${accent}33`,
        fontFamily: "Arial Black, Montserrat, sans-serif",
        color: "#fff",
        pointerEvents: "none",
      }}
    >
      {stats ? stats.map(renderStat) : null}
      {headline ? (
        <div style={{ fontSize: 38, fontWeight: 900, color: accent, lineHeight: 1 }}>{headline}</div>
      ) : null}
      {detail ? (
        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.66)" }}>{detail}</div>
      ) : null}
    </div>
  );
};

const formatThousand = (n: number) => n.toLocaleString("pt-BR");

const PersonGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 24 32" width="100%" height="100%" style={{ display: "block" }}>
    <circle cx="12" cy="6" r="5" fill={color} />
    <path d="M3 31 C3 19, 21 19, 21 31 Z" fill={color} />
  </svg>
);

const PEOPLE_COLS = 12;
const PEOPLE_ROWS = 8;
const PEOPLE_COUNT = PEOPLE_COLS * PEOPLE_ROWS;
const PEOPLE_STAGGER = 0.8;

const peopleGrid = (() => {
  const left = 50;
  const top = 200;
  const width = 980;
  const height = 520;
  const cellW = width / PEOPLE_COLS;
  const cellH = height / PEOPLE_ROWS;
  const cells = [] as { x: number; y: number; order: number }[];
  for (let r = 0; r < PEOPLE_ROWS; r++) {
    for (let c = 0; c < PEOPLE_COLS; c++) {
      const jitterX = ((r * 31 + c * 17) % 13) - 6;
      const jitterY = ((r * 19 + c * 23) % 11) - 5;
      cells.push({
        x: left + c * cellW + cellW / 2 + jitterX,
        y: top + r * cellH + cellH / 2 + jitterY,
        order: 0,
      });
    }
  }
  for (let i = 0; i < cells.length; i++) {
    const j = (i * 53 + 17) % cells.length;
    cells[i].order = j;
  }
  return cells;
})();

const PeopleSwarm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {peopleGrid.map((p, i) => {
        const local = frame - p.order * PEOPLE_STAGGER;
        const opacity = interpolate(local, [0, 6], [0, 0.78], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = interpolate(local, [0, 5, 9], [0.25, 1.18, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const accent = i % 9 === 0 ? YELLOW : "rgba(235,245,255,0.92)";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 36,
              height: 48,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.55))",
            }}
          >
            <PersonGlyph color={accent} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ScienceLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 184,
        width: 520,
        opacity,
        borderRadius: 8,
        padding: "18px 22px",
        background: "rgba(4,12,20,0.74)",
        border: "1px solid rgba(90,180,255,0.34)",
        boxShadow: "0 20px 58px rgba(0,0,0,0.46), 0 0 30px rgba(26,156,255,0.08)",
        color: "#fff",
        fontFamily: "Arial Black, Montserrat, sans-serif",
        pointerEvents: "none",
      }}
    >
      <div style={{ color: BLUE, fontSize: 24, fontWeight: 900, letterSpacing: 0 }}>
        META-ANÁLISE
      </div>
      <div style={{ marginTop: 6, fontSize: 38, fontWeight: 900 }}>32 estudos</div>
      <div style={{ marginTop: 2, color: "rgba(255,255,255,0.74)", fontSize: 22 }}>
        96.549 pessoas avaliadas
      </div>
    </div>
  );
};

const ScienceCleanPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, rgb(1,7,12) 0%, rgb(4,13,22) 48%, rgb(2,7,12) 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 68% 62%, rgba(26,156,255,0.18), rgba(0,0,0,0) 36%), radial-gradient(circle at 18% 22%, rgba(70,130,180,0.12), rgba(0,0,0,0) 30%)",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 180px rgba(0,0,0,0.66)",
        }}
      />
    </AbsoluteFill>
  );
};

const sfxPath = (name: string) => staticFile(`sfx/${name}`);

const populationPopEvents = Array.from({ length: 32 }, (_, i) => ({
  at: 33.5 + i * 0.085,
  src: "ui_pop.mp3",
  volume: 0.14,
}));

const sfxEvents = [
  { at: 0, src: "bass_hit.mp3", volume: 0.42 },
  { at: 3.06, src: "bass_hit.mp3", volume: 0.28 },
  { at: T.waterStart, src: "ui_pop.mp3", volume: 0.3 },
  { at: T.citricStart, src: "ui_pop.mp3", volume: 0.3 },
  { at: T.erythritolStart, src: "ui_pop.mp3", volume: 0.3 },
  { at: T.taurineStart, src: "ui_pop.mp3", volume: 0.3 },
  { at: T.caffeineStart, src: "ui_pop.mp3", volume: 0.3 },
  ...populationPopEvents,
  { at: 60.64, src: "bass_hit.mp3", volume: 0.46 },
  { at: 60.64, src: "glitch_hit.mp3", volume: 0.42 },
];

export const MonsterReel: React.FC<MonsterReelProps> = ({
  videoSrc,
  captionsJson,
  duration,
  studySrc,
  musicSrc,
}) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions(captionsJson);
  const f = (seconds: number) => Math.round(seconds * fps);
  const d = (start: number, end: number) => Math.max(1, f(end) - f(start));
  const totalFrames = Math.ceil((duration || T.totalDur) * fps);
  const assets = useMemo(
    () => ({
      video: resolveAsset(videoSrc),
      study: resolveAsset(studySrc),
      music: resolveAsset(musicSrc),
    }),
    [musicSrc, studySrc, videoSrc],
  );

  const checklist = [
    { title: "ÁGUA GASEIFICADA", detail: "risco: 10 litros", at: T.waterStart },
    { title: "ÁCIDO CÍTRICO", detail: "vem do limão", at: T.citricStart },
    { title: "ERITRITOL", detail: "dose absurda", at: T.erythritolStart },
    { title: "TAURINA", detail: "seu corpo produz", at: T.taurineStart },
    { title: "CAFEÍNA", detail: "4 latas = limite", at: T.caffeineStart },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#030507", overflow: "hidden" }}>
      <AbsoluteFill>
        <CognitiveZoom
          segments={[
            { start: 0, end: 0.55, from: 1.08, to: 1 },
            { start: 32.56, end: 34.3, from: 1, to: 1.045 },
            { start: 34.3, end: 34.55, from: 1.045, to: 1 },
          ]}
        >
          {assets.video ? <MainVideo src={assets.video} /> : null}
        </CognitiveZoom>
      </AbsoluteFill>

      <SceneTint />
      {assets.music ? <Audio src={assets.music} volume={0.055} /> : null}

      {sfxEvents.map((event) => (
        <Sequence key={`${event.src}-${event.at}`} from={f(event.at)}>
          <SFXAudio src={sfxPath(event.src)} volume={event.volume} />
        </Sequence>
      ))}

      <Sequence from={f(T.scienceStart)} durationInFrames={d(T.scienceStart, 42.09)}>
        <ScienceCleanPlate />
        <ScientificEnvironment intensity={0.18} />
      </Sequence>

      <Sequence from={f(T.hookStart)} durationInFrames={d(T.hookStart, T.hookEnd)}>
        <ImpactWord text="QUÍMICA" color="#fff" top={TOP_IMPACT_Y} size={108} shake delayFrames={f(0.9)} />
        <ImpactWord text="VAI TE MATAR" color="#fff" top={LOW_IMPACT_Y} size={82} shake delayFrames={f(3.06)} />
      </Sequence>

      <Sequence from={f(T.waterStart)} durationInFrames={d(T.waterStart, T.tenLiters)}>
        <IngredientCard title="ÁGUA GASEIFICADA" subtitle="água com gás" risk="10 litros" tone="blue" />
      </Sequence>

      <Sequence from={f(T.citricStart)} durationInFrames={d(T.citricStart, T.citricEnd)}>
        <IngredientCard title="ÁCIDO CÍTRICO" subtitle="vem do limão" risk="30g puro" tone="yellow" />
      </Sequence>
      <Sequence from={f(T.erythritolStart)} durationInFrames={d(T.erythritolStart, T.erythritolEnd)}>
        <IngredientCard title="ERITRITOL" subtitle="adoçante zero calorias" risk="50g/kg" tone="yellow" />
      </Sequence>
      <Sequence from={f(T.taurineStart)} durationInFrames={d(T.taurineStart, T.taurineEnd)}>
        <IngredientCard title="TAURINA" subtitle="coração e músculo produzem" risk="natural" tone="yellow" />
      </Sequence>
      <Sequence from={f(T.caffeineStart)} durationInFrames={d(T.caffeineStart, T.caffeineEnd)}>
        <IngredientCard title="CAFEÍNA" subtitle="igual café" risk="4 latas = limite" tone="yellow" />
      </Sequence>
      <Sequence from={f(T.ingredientsStart)} durationInFrames={d(T.ingredientsStart, T.caffeineEnd)}>
        <IngredientChecklist items={checklist} />
      </Sequence>

      <Sequence from={f(32.0)} durationInFrames={d(32.0, 42.37)}>
        <DynamicStudyOverlay src={assets.study} mode="full" title="NIH / META-ANÁLISE" footer="2023 · revisão sistemática" />
      </Sequence>
      <Sequence from={f(33.5)} durationInFrames={d(33.5, 42.37)}>
        <PeopleSwarm />
      </Sequence>
      <Sequence from={f(33.4)} durationInFrames={d(33.4, 42.37)}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 740,
              transform: "translateX(-50%)",
            }}
          >
            <StudyHUDCard
              accent={BLUE}
              stats={[
                { label: "ESTUDOS ANALISADOS", countTo: 32, unit: "papers" },
                { label: "PESSOAS AVALIADAS", countTo: 96549, format: formatThousand },
              ]}
            />
          </div>
        </div>
      </Sequence>

      <Sequence from={f(T.notSupplement)} durationInFrames={d(T.notSupplement, 49.05)}>
        <CenterStatement text="NÃO É SUPLEMENTO." color="#fff" top={190} />
      </Sequence>
      <Sequence from={f(T.notKill)} durationInFrames={d(T.notKill, T.realityEnd)}>
        <CenterStatement text="SÓ NÃO É VENENO." sub="e isso já muda o drama" color={YELLOW} />
      </Sequence>
      <Sequence from={f(T.notHealthy)} durationInFrames={d(T.notHealthy, T.notVillain)}>
        <CenterStatement text="NÃO É SAUDÁVEL" sub="mas essa não é a pergunta" color="rgba(255,255,255,0.9)" />
      </Sequence>
      <Sequence from={f(T.notVillain)} durationInFrames={d(T.notVillain, T.scienceDoesntLie)}>
        <CenterStatement text="NÃO É O VILÃO" color={YELLOW} />
      </Sequence>
      <Sequence from={f(T.scienceDoesntLie)} durationInFrames={d(T.scienceDoesntLie, T.unclePunchline)}>
        <CenterStatement text="A CIÊNCIA NÃO MENTE." color={BLUE} top={300} />
      </Sequence>
      <Sequence from={f(T.unclePunchline)} durationInFrames={Math.max(1, totalFrames - f(T.unclePunchline))}>
        <ImpactWord text="SEU TIO SIM." color={YELLOW} top={TOP_IMPACT_Y} size={106} shake />
      </Sequence>

      <Caption
        captions={captions}
        mode="stable"
        paddingBottom={245}
        colorOverrides={{
          MATAR: YELLOW,
          "10": YELLOW,
          "30": YELLOW,
          "50": YELLOW,
          CAFEÍNA: YELLOW,
          "400": YELLOW,
          "96": YELLOW,
          MIL: YELLOW,
          ÁLCOOL: YELLOW,
          VENENO: YELLOW,
          TIO: YELLOW,
        }}
      />
      <LogoStamp handle="@xandokaoriginal" />
    </AbsoluteFill>
  );
};
