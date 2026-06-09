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
import { LogoStamp } from "../components/LogoStamp";
import { SFXAudio } from "../components/SFXAudio";
import { ScientificFooter } from "../components/ScientificFooter";
import { StatBar } from "../components/StatBar";
import { StrikethroughList } from "../components/StrikethroughList";
import { TopTitleCard } from "../components/TopTitleCard";
import { loadCaptionFile } from "../lib/whisper";
import { T } from "./perder_peso_timecodes";

// ─── Props ────────────────────────────────────────────────────────────────────
export type PerderPesoReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
  antesSrc: string;
  depoisSrc: string;
  pubmedSrc: string;
  fundoSrc?: string;
  semFundoSrc?: string;
  inicioSrc?: string;
};

// ─── Constantes visuais ───────────────────────────────────────────────────────
const COLOR_NAVY       = "#1A2B4A";
const COLOR_NAVY_LIGHT = "#3D5A8C"; // navy mais claro para o card 145→80
const COLOR_YELLOW     = "#FFD700";

const INICIO_DUR = 2.333; // 2.3s reais + 1 frame de freeze (00:02.10 @ 30fps)

const SFX = {
  bass:     { volume: 0.55, playbackRate: 1.0,  startFrom: 0, duration: 1.5  },
  pop:      { volume: 0.42, playbackRate: 1.5,  startFrom: 0, duration: 0.45 },
  whoosh:   { volume: 0.36, playbackRate: 1.4,  startFrom: 0, duration: 0.55 },
  impact:   { volume: 0.52, playbackRate: 1.0,  startFrom: 0, duration: 0.9  },
  emptying: { volume: 0.44, playbackRate: 1.18, startFrom: 0, duration: 1.1  },
  subDrop:  { volume: 0.46, playbackRate: 1.0,  startFrom: 0, duration: 1.8  },
};

const isRemote  = (src: string) => /^https?:\/\//i.test(src);
const resolveAsset = (src: string) => (src ? (isRemote(src) ? src : staticFile(src)) : "");

// ─── Captions loader ──────────────────────────────────────────────────────────
const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading PerderPeso captions"));

  useEffect(() => {
    if (!captionsJson) {
      setCaptions([]);
      continueRender(handle);
      return;
    }
    loadCaptionFile(resolveAsset(captionsJson))
      .then((loaded) => { setCaptions(loaded); continueRender(handle); })
      .catch((err) => cancelRender(err));
  }, [cancelRender, captionsJson, continueRender, handle]);

  return captions;
};

// ─── PubMed overlay (canto inferior direito) ──────────────────────────────────
const PubMedOverlay: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const inOpacity = interpolate(frame, [0, 10], [0, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0.92, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const y = interpolate(frame, [0, 12], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        right: 36,
        bottom: 320,
        width: 400,
        borderRadius: 8,
        opacity: Math.min(inOpacity, outOpacity),
        transform: `translateY(${y}px)`,
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        border: "1.5px solid rgba(255,255,255,0.15)",
      }}
    />
  );
};

// ─── Tagline abaixo do BeforeAfterCard ────────────────────────────────────────
const PhotoTagline: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const delay = 18; // aparece 18 frames após a Sequence iniciar
  const local = Math.max(0, frame - delay);
  const progress = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const outProgress = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 420,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: progress * outProgress,
        transform: `translateY(${(1 - progress) * 16}px)`,
      }}
    >
      <div
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 28,
          paddingRight: 28,
          borderRadius: 40,
          background: COLOR_NAVY,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {["3 ANOS", "SEM CIRURGIA", "SEM MILAGRE"].map((txt, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLOR_YELLOW }} />
            )}
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "white",
                letterSpacing: 0.5,
                fontFamily: "sans-serif",
              }}
            >
              {txt}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─── Video principal com zoom Nippard ─────────────────────────────────────────
const MainVideo: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;

  const ramp = (s: number, e: number, from: number, to: number) =>
    interpolate(sec, [s, e], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  // Punch zoom: gancho 1.0→1.14→1.0 em 0.3s
  const punchIn  = ramp(0, 0.15, 1.0, 1.14);
  const punchOut = ramp(0.15, 0.45, 1.14, 1.0);
  const hookScale = sec < 0.15 ? punchIn : sec < 0.45 ? punchOut : 1.0;

  // Zoom gradual acumulado: ciência e encerramento
  const midScale =
    sec < T.take3SciStart ? 1.0
    : sec < T.take3SciStart + 1.2 ? ramp(T.take3SciStart, T.take3SciStart + 1.2, 1.0, 1.06)
    : sec < T.take7Climax ? 1.06
    : sec < T.take7Climax + 1.5 ? ramp(T.take7Climax, T.take7Climax + 1.5, 1.06, 1.12)
    : 1.12;

  const scale = sec < 0.5 ? hookScale : midScale;

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

// ─── Composition principal ────────────────────────────────────────────────────
export const PerderPesoReel: React.FC<PerderPesoReelProps> = ({
  videoSrc,
  captionsJson,
  duration,
  antesSrc,
  depoisSrc,
  pubmedSrc,
  fundoSrc,
  semFundoSrc,
  inicioSrc,
}) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions(captionsJson);

  const f = (s: number) => Math.round(s * fps);
  const d = (start: number, end: number) => Math.max(1, f(end) - f(start));

  const inicioFrames = Math.round(INICIO_DUR * fps);

  const assets = useMemo(
    () => ({
      video:    resolveAsset(videoSrc),
      inicio:   inicioSrc ? resolveAsset(inicioSrc) : null,
      antes:    resolveAsset(antesSrc),
      depois:   resolveAsset(depoisSrc),
      pubmed:   resolveAsset(pubmedSrc),
      fundo:    fundoSrc ? resolveAsset(fundoSrc) : null,
      semFundo: semFundoSrc ? resolveAsset(semFundoSrc) : null,
      music:    staticFile("perder 68kg/music.mp3"),
      bass:     staticFile("sfx/bass_hit.MP3"),
      pop:      staticFile("sfx/ui_pop.mp3"),
      whoosh:   staticFile("sfx/whoosh_short.MP3"),
      impact:   staticFile("sfx/metal_impact.mp3"),
      subDrop:  staticFile("sfx/sub_drop.mp3"),
      emptying: staticFile("dismorfia/esvaziando_sfx.mp3"),
    }),
    [videoSrc, inicioSrc, antesSrc, depoisSrc, pubmedSrc, fundoSrc, semFundoSrc],
  );

  // Items da lista riscada — frames relativos ao início da Sequence do take5
  const strikeItems = useMemo(() => {
    const seqStart = T.take5ListStart;
    return [
      { label: "LOW CARB",        revealFrame: f(T.take5LowCarb - seqStart) },
      { label: "JEJUM DE 36H",    revealFrame: f(T.take5Jejum   - seqStart) },
      { label: "SHAKE MILAGROSO", revealFrame: f(T.take5Shake   - seqStart) },
      { label: "SOFRIMENTO",      revealFrame: f(T.take5Sofri   - seqStart) },
    ];
  }, [fps]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080c", overflow: "hidden" }}>

      {/* ── Vídeo base ────────────────────────────────────────────────────── */}
      <AbsoluteFill>
        {assets.video ? <MainVideo src={assets.video} /> : null}
      </AbsoluteFill>

      {/* ── Overlay início (2.3s, sem áudio — main toca normalmente) ─────── */}
      {assets.inicio ? (
        <Sequence from={0} durationInFrames={inicioFrames}>
          <AbsoluteFill>
            <Video
              src={assets.inicio}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {/* ── Vídeo de treino: substitui fundo branco 22.46–25.24s ─────────── */}
      {assets.fundo ? (
        <Sequence
          from={f(T.take4PhotosStart)}
          durationInFrames={d(T.take4PhotosStart, T.take4PhotosEnd)}
        >
          <AbsoluteFill>
            <Video
              src={assets.fundo}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {/* ── Gradiente de vinheta ──────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.60) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Música de fundo ───────────────────────────────────────────────── */}
      <Audio src={assets.music} volume={0.08} />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 1 — card 145KG→80KG em navy, só após o clip de início        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <Sequence from={0} durationInFrames={inicioFrames}>
        <TopTitleCard text="145KG → 84KG" color={COLOR_NAVY_LIGHT} top={360} />
      </Sequence>

      {/* SFX esvaziando: corpo gordo → musculoso (sincroniza com a deflação) */}
      <Sequence from={f(T.take1Deflate)} durationInFrames={f(SFX.emptying.duration)}>
        <SFXAudio src={assets.emptying} {...SFX.emptying} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 2 — COMIDA + DÉFICIT                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* StatBar: DÉFICIT + PROTEÍNA */}
      <Sequence from={f(T.take2DeficitBar)} durationInFrames={d(T.take2DeficitBar, T.take3SciStart)}>
        <StatBar
          label="A FÓRMULA"
          value="DÉFICIT + PROTEÍNA"
          detail="Sem cortar nada — só controlar a quantidade"
          tone="darknavy"
          yOffset={136}
        />
      </Sequence>
      <Sequence from={f(T.take2DeficitBar)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 3 — CIÊNCIA                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* StatBar 1: Déficit calórico */}
      <Sequence from={f(T.take3Stat1)} durationInFrames={d(T.take3Stat1, T.take3Stat2)}>
        <StatBar
          label="PRINCÍPIO BÁSICO"
          value="DÉFICIT CALÓRICO"
          detail="= perda de peso (não é opinião, é ciência)"
          tone="darknavy"
          yOffset={136}
        />
      </Sequence>
      <Sequence from={f(T.take3Stat1)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>

      {/* PubMed overlay */}
      {assets.pubmed ? (
        <Sequence from={f(T.take3Paper)} durationInFrames={d(T.take3Paper, T.take3PaperEnd)}>
          <PubMedOverlay
            src={assets.pubmed}
            durationInFrames={d(T.take3Paper, T.take3PaperEnd)}
          />
        </Sequence>
      ) : null}
      <Sequence from={f(T.take3Paper)} durationInFrames={f(SFX.whoosh.duration)}>
        <SFXAudio src={assets.whoosh} {...SFX.whoosh} />
      </Sequence>

      {/* Rodapé científico */}
      <Sequence from={f(T.take3Paper)} durationInFrames={d(T.take3Paper, T.take3PaperEnd)}>
        <ScientificFooter
          text="Morton et al. · Protein Supplementation and Resistance Training · PMC8017325 · NIH/NLM"
          durationInFrames={d(T.take3Paper, T.take3PaperEnd)}
        />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 4 — BLANK PAGE / PROVA PESSOAL (fotos antes + depois)         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <Sequence
        from={f(T.take4PhotosStart)}
        durationInFrames={d(T.take4PhotosStart, T.take4PhotosEnd)}
      >
        <BeforeAfterCard
          leftSrc={assets.antes}
          rightSrc={assets.depois}
          leftLabel="EU ANTES · 145KG"
          rightLabel="EU AGORA · 80KG"
          yOffset={560}
          leftObjectPosition="center 30%"
          rightObjectPosition="center 20%"
          leftZoom={1.4}
          rightZoom={1.1}
        />
        <PhotoTagline durationInFrames={d(T.take4PhotosStart, T.take4PhotosEnd)} />
      </Sequence>

      {/* SFX entrada das fotos */}
      <Sequence from={f(T.take4PhotosStart)} durationInFrames={f(SFX.pop.duration)}>
        <SFXAudio src={assets.pop} {...SFX.pop} />
      </Sequence>
      <Sequence from={f(T.take4PhotosStart)} durationInFrames={f(SFX.whoosh.duration)}>
        <SFXAudio src={assets.whoosh} {...SFX.whoosh} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 5 — LISTA RISCADA (o que eu NÃO fiz)                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      <Sequence
        from={f(T.take5ListStart)}
        durationInFrames={d(T.take5ListStart, T.take6TrainoStart)}
      >
        <StrikethroughList items={strikeItems} />
      </Sequence>

      {/* Pop SFX em cada item */}
      {[T.take5LowCarb, T.take5Jejum, T.take5Shake].map((ts, i) => (
        <Sequence key={i} from={f(ts)} durationInFrames={f(SFX.pop.duration)}>
          <SFXAudio src={assets.pop} {...SFX.pop} />
        </Sequence>
      ))}
      {/* Metal impact no "nem sofri" */}
      <Sequence from={f(T.take5Sofri)} durationInFrames={f(SFX.impact.duration)}>
        <SFXAudio src={assets.impact} {...SFX.impact} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 6 — B-ROLL TREINO (sem overlay — limpo)                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Nenhum overlay aqui — intencional (regra Nippard) */}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAKE 7 — ENCERRAMENTO                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* SFX climax + sub drop */}
      <Sequence from={f(T.take7Climax)} durationInFrames={f(SFX.bass.duration)}>
        <SFXAudio src={assets.bass} {...SFX.bass} />
      </Sequence>
      <Sequence from={f(T.take7Climax)} durationInFrames={f(SFX.subDrop.duration)}>
        <SFXAudio src={assets.subDrop} {...SFX.subDrop} />
      </Sequence>

      {/* ─── Legenda ─────────────────────────────────────────────────────── */}
      <Caption
        captions={captions}
        mode="stable"
        paddingBottom={270}
        colorOverrides={{
          DÉFICIT:      COLOR_YELLOW,
          PROTEÍNA:     COLOR_YELLOW,
          CONSTÂNCIA:   COLOR_YELLOW,
          CONSISTÊNCIA: COLOR_YELLOW,
          BÁSICO:       COLOR_YELLOW,
          PROVA:        COLOR_YELLOW,
        }}
      />

      {/* ─── Logo ───────────────────────────────────────────────────────── */}
      <LogoStamp handle="@xandokaoriginal" />

    </AbsoluteFill>
  );
};
