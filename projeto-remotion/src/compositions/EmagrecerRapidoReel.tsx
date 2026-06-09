import React, { useEffect, useState } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useDelayRender,
} from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { Caption } from "../components/Caption";
import { ScaleProgressCard } from "../components/ScaleProgressCard";
import { PaperHighlightMurphy } from "../components/PaperHighlightMurphy";
import { BeforeAfterCard } from "../components/BeforeAfterCard";
import { DevDraggable, DevDraggableProvider, DevHUD } from "../components/DevDraggable";
import { NeonPill } from "../components/NeonPill";
import { DeficitCard } from "../components/DeficitCard";
import { loadCaptionFile } from "../lib/whisper";

loadAnton();

// ─── Types ────────────────────────────────────────────────────────────────────
export type EmagrecerRapidoReelProps = {
  videoSrc: string;
  captionsJson: string;
  duration: number;
};

// ─── Conversor SS.FF → frame ──────────────────────────────────────────────────
const f = (sec: number, frm: number) => sec * 30 + frm;

// ─── Timeline ────────────────────────────────────────────────────────────────
const T = {
  balancasStart:    f( 7,  0),  //  210
  balancasEnd:      f(13,  2),  //  392

  murphyStart:      f(22, 13),  //  673
  murphyEnd:        f(25, 29),  //  779

  deficitCardStart: f(15,  0),  //  450
  deficitCardEnd:   f(19, 21),  //  591

  beforeAfterStart: f(42, 12),  // 1272
  beforeAfterEnd:   f(43, 29),  // 1319
} as const;

// ─── SFX — timecodes SS.FF → frames ──────────────────────────────────────────
// Selection.MP3  → frames: 20, 1051
// card.MP3       → frames: 214, 674, 1272
// entrada_som    → frames: 214, 232, 252
// escrita.mp3    → frame:  687
// infando.MP3    → frame:  1211
const SFX = {
  selection:  [f(0,20), f(35,1)],
  card:       [f(7,4),  f(15,0),  f(22,14), f(42,12)],
  entrada:    [f(7,4),  f(7,22),  f(8,12)],
  escrita:    [f(22,27)],
  infando:    [f(40,11)],
  title_card:   [f(7,23)],   // NeonPill "PRESSA INIMIGA DO RESULTADO"
  desamacando:  [f(6,16)],   // desamacando.mp3
} as const;

// ─── Volumes ──────────────────────────────────────────────────────────────────
const VOL = {
  music:    0.07,
  selection: 0.4,
  card:      0.5,
  entrada:   0.5,
  escrita:   0.4,
  infando:   0.35,
} as const;

// ─── Palavras amarelas ────────────────────────────────────────────────────────
const YELLOW: Record<string, string> = {
  PRESSA:   "#FFD700",
  "500":    "#FFD700",
  KCAL:     "#FFD700",
  MUSCULO:  "#FFD700",
  MÚSCULO:  "#FFD700",
  SUSTENTA: "#FFD700",
};

// ─── useCaptions ─────────────────────────────────────────────────────────────
const useCaptions = (captionsJson: string) => {
  const [captions, setCaptions] = useState<RemotionCaption[]>([]);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Emagrecer captions"));

  useEffect(() => {
    loadCaptionFile(staticFile(captionsJson))
      .then((caps) => { setCaptions(caps); continueRender(handle); })
      .catch((err) => { cancelRender(err); });
  }, [captionsJson]);

  return captions;
};

// ─── Composição ───────────────────────────────────────────────────────────────
export const EmagrecerRapidoReel: React.FC<EmagrecerRapidoReelProps> = ({
  videoSrc,
  captionsJson,
  duration,
}) => {
  const captions = useCaptions(captionsJson);

  return (
    <DevDraggableProvider>
      <AbsoluteFill style={{ background: "#000" }}>

        {/* ── Vídeo base ─────────────────────────────────────────────────── */}
        <Video
          src={staticFile(videoSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* ── Música de fundo (fade out 53s23f = frame 1613) ────────────── */}
        <Audio
          src={staticFile("new sfx/lofi 2.MP3")}
          volume={(f) =>
            interpolate(
              f,
              [1583, 1613],
              [VOL.music, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
        />

        {/* ══════════════════════════════════════════════════════════════════
            SFX — Selection.MP3
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.selection.map((frame, i) => (
          <Sequence key={`sel-${i}`} from={frame} durationInFrames={30}>
            <Audio src={staticFile("new sfx/Selection.MP3")} volume={VOL.selection} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            SFX — card.MP3
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.card.map((frame, i) => (
          <Sequence key={`card-${i}`} from={frame} durationInFrames={30}>
            <Audio src={staticFile("new sfx/card.MP3")} volume={VOL.card} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            SFX — entrada_som.mp3
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.entrada.map((frame, i) => (
          <Sequence key={`ent-${i}`} from={frame} durationInFrames={30}>
            <Audio src={staticFile("new sfx/entrada_som.mp3")} volume={VOL.entrada} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            SFX — escrita.mp3
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.escrita.map((frame, i) => (
          <Sequence key={`esc-${i}`} from={frame} durationInFrames={30}>
            <Audio src={staticFile("new sfx/escrita.mp3")} volume={VOL.escrita} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            SFX — infando.MP3
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.infando.map((frame, i) => (
          <Sequence key={`inf-${i}`} from={frame} durationInFrames={60}>
            <Audio src={staticFile("new sfx/infando.MP3")} volume={VOL.infando} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            SFX — card.MP3  (NeonPill entrada 7s23f)
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.title_card.map((frame, i) => (
          <Sequence key={`tc-${i}`} from={frame} durationInFrames={30}>
            <Audio src={staticFile("new sfx/card.MP3")} volume={0.5} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            SFX — desamacando.mp3  (6s16f)
        ════════════════════════════════════════════════════════════════════ */}
        {SFX.desamacando.map((frame, i) => (
          <Sequence key={`des-${i}`} from={frame} durationInFrames={60}>
            <Audio src={staticFile("new sfx/desamacando.mp3")} volume={0.5} />
          </Sequence>
        ))}

        {/* ══════════════════════════════════════════════════════════════════
            OVERLAY 1 — ScaleProgressCard (7s → 13s02f)
            + NeonPill "PRESSA INIMIGA DO RESULTADO" entra em 7s23f
        ════════════════════════════════════════════════════════════════════ */}
        <Sequence from={T.balancasStart} durationInFrames={T.balancasEnd - T.balancasStart}>
          {/* Balanças */}
          <DevDraggable
            id="scale-card"
            label="balanças"
            initialTop={285}
            initialLeft={55}
            initialWidth={960}
          >
            {(p) => (
              <ScaleProgressCard top={p.top} left={p.left} width={p.width} />
            )}
          </DevDraggable>

          {/* NeonPill — entra 23 frames após o início da Sequence (= 7s23f absoluto) */}
          <Sequence from={23} durationInFrames={T.balancasEnd - T.balancasStart - 23}>
            <NeonPill
              label="PRESSA INIMIGA DO"
              accent="RESULTADO"
              top={228}
              fontSize={36}
            />
          </Sequence>
        </Sequence>

        {/* ══════════════════════════════════════════════════════════════════
            OVERLAY 2 — DeficitCard (15s00f → 22s13f)
        ════════════════════════════════════════════════════════════════════ */}
        <Sequence from={T.deficitCardStart} durationInFrames={T.deficitCardEnd - T.deficitCardStart}>
          <DevDraggable
            id="deficit-card"
            label="deficit card"
            initialTop={181}
            initialLeft={20}
            initialWidth={960}
          >
            {(p) => (
              <DeficitCard top={p.top} left={p.left} />
            )}
          </DevDraggable>
        </Sequence>

        {/* ══════════════════════════════════════════════════════════════════
            OVERLAY 4 — Paper Murphy & Koehler 2022 (22s13f → 25s29f)
            top=619, left=89, width=960 (posição confirmada pelo usuário)
        ════════════════════════════════════════════════════════════════════ */}
        <Sequence from={T.murphyStart} durationInFrames={T.murphyEnd - T.murphyStart}>
          <DevDraggable
            id="paper-murphy"
            label="murphy 2022"
            initialTop={619}
            initialLeft={89}
            initialWidth={960}
          >
            {(p) => (
              <PaperHighlightMurphy top={p.top} left={p.left} width={p.width} />
            )}
          </DevDraggable>
        </Sequence>

        {/* ══════════════════════════════════════════════════════════════════
            OVERLAY 5 — BeforeAfterCard (42s12f → 43s29f)
        ════════════════════════════════════════════════════════════════════ */}
        <Sequence from={T.beforeAfterStart} durationInFrames={T.beforeAfterEnd - T.beforeAfterStart}>
          <BeforeAfterCard
            leftSrc={staticFile("dismorfia/photo_obeso.png")}
            rightSrc={staticFile("dismorfia/photo_atual.PNG")}
            leftLabel="ANTES"
            rightLabel="84KG NATURAL"
            yOffset={900}
          />
        </Sequence>

        {/* ══════════════════════════════════════════════════════════════════
            CAPTIONS — Anton 72px mode=stable
        ════════════════════════════════════════════════════════════════════ */}
        {captions.length > 0 && (
          <Caption
            captions={captions}
            paddingBottom={270}
            colorOverrides={YELLOW}
          />
        )}

        <DevHUD />
      </AbsoluteFill>
    </DevDraggableProvider>
  );
};
