import React, { useMemo } from "react";
import type { Caption as RemotionCaption } from "@remotion/captions";
import { loadAnton as loadFont } from "../lib/localFonts";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont();

const WORDS_PER_PAGE = 4;
const DEFAULT_GAP_MS = 180;
const BLOCK_PAD_START_MS = 40;
const BLOCK_PAD_END_MS = 90;

export type CaptionPositionOverride = {
  startMs: number;
  endMs: number;
  paddingBottom?: number; // posicionamento anchorado embaixo (comportamento default)
  top?: number;           // posicionamento absoluto pelo topo (substitui paddingBottom)
  left?: number;
  width?: number;
};

type CaptionProps = {
  captions: RemotionCaption[];
  colorOverrides?: Record<string, string>;
  paddingBottom?: number;
  mode?: "paged" | "stable";
  /**
   * Overrides de posicionamento por intervalo de tempo.
   * Se o tempo atual cai em algum override, usa seu paddingBottom.
   * Senao usa o paddingBottom default. NAO afeta outras legendas fora do intervalo.
   */
  positionOverrides?: CaptionPositionOverride[];
};

type CaptionBlock = {
  captions: RemotionCaption[];
  startMs: number;
  endMs: number;
};

const buildStableBlocks = (captions: RemotionCaption[]): CaptionBlock[] => {
  if (captions.length === 0) return [];

  const blocks: CaptionBlock[] = [];
  let current: RemotionCaption[] = [captions[0]];

  for (let i = 1; i < captions.length; i++) {
    const prev = captions[i - 1];
    const cur = captions[i];
    const gap = cur.startMs - prev.endMs;
    const shouldBreak =
      current.length >= WORDS_PER_PAGE ||
      gap > DEFAULT_GAP_MS ||
      /[.!?]$/.test(prev.text.trim());

    if (shouldBreak) {
      blocks.push({
        captions: current,
        startMs: Math.max(0, current[0].startMs - BLOCK_PAD_START_MS),
        endMs: current[current.length - 1].endMs + BLOCK_PAD_END_MS,
      });
      current = [cur];
    } else {
      current.push(cur);
    }
  }

  blocks.push({
    captions: current,
    startMs: Math.max(0, current[0].startMs - BLOCK_PAD_START_MS),
    endMs: current[current.length - 1].endMs + BLOCK_PAD_END_MS,
  });

  // Segunda passagem: elimina gaps < 500ms entre blocos consecutivos
  // (pausa natural de frase — não silêncio intencional)
  // Estende o endMs do bloco anterior até o startMs do próximo.
  for (let i = 0; i < blocks.length - 1; i++) {
    const gap = blocks[i + 1].startMs - blocks[i].endMs;
    if (gap > 0 && gap < 500) {
      blocks[i].endMs = blocks[i + 1].startMs;
    }
  }

  return blocks;
};

export const Caption: React.FC<CaptionProps> = ({
  captions,
  colorOverrides,
  paddingBottom = 230,
  mode = "stable",
  positionOverrides,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = (frame / fps) * 1000;
  const stableBlocks = useMemo(() => buildStableBlocks(captions), [captions]);

  // Resolve override ativo por tempo
  const activeOverride = useMemo(() => {
    if (!positionOverrides || positionOverrides.length === 0) return null;
    return positionOverrides.find(
      (o) => o.startMs <= absoluteTimeMs && o.endMs > absoluteTimeMs,
    ) ?? null;
  }, [absoluteTimeMs, positionOverrides]);

  const effectivePaddingBottom = activeOverride?.paddingBottom ?? paddingBottom;

  const activePage = useMemo(() => {
    if (mode === "stable") {
      const idx = stableBlocks.findIndex(
        (b) => b.startMs <= absoluteTimeMs && b.endMs > absoluteTimeMs,
      );
      if (idx === -1) return null;
      const block = stableBlocks[idx];
      return {
        captions: block.captions,
        activeIndex: -1,
        pageStart: captions.indexOf(block.captions[0]),
        startMs: block.startMs,
      };
    }

    const activeIndex = captions.findIndex(
      (c) => c.startMs <= absoluteTimeMs && c.endMs > absoluteTimeMs,
    );
    if (activeIndex === -1) return null;

    const pageStart = Math.floor(activeIndex / WORDS_PER_PAGE) * WORDS_PER_PAGE;
    return {
      captions: captions.slice(pageStart, pageStart + WORDS_PER_PAGE),
      activeIndex,
      pageStart,
      startMs: captions[pageStart]?.startMs ?? 0,
    };
  }, [absoluteTimeMs, captions, mode, stableBlocks]);

  if (!activePage) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <CaptionPage
        captions={activePage.captions}
        activeIndex={activePage.activeIndex}
        pageStart={activePage.pageStart}
        mode={mode}
        startMs={activePage.startMs}
        colorOverrides={colorOverrides}
        paddingBottom={effectivePaddingBottom}
        overrideTop={activeOverride?.top}
        overrideLeft={activeOverride?.left}
        overrideWidth={activeOverride?.width}
      />
    </AbsoluteFill>
  );
};

type CaptionPageProps = {
  captions: RemotionCaption[];
  activeIndex: number;
  pageStart: number;
  startMs: number;
  colorOverrides?: Record<string, string>;
  paddingBottom: number;
  mode: "paged" | "stable";
  overrideTop?: number;
  overrideLeft?: number;
  overrideWidth?: number;
};

const CaptionPage: React.FC<CaptionPageProps> = ({
  captions,
  activeIndex,
  pageStart,
  startMs,
  colorOverrides,
  paddingBottom,
  mode,
  overrideTop,
  overrideLeft,
  overrideWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - Math.round((startMs / 1000) * fps));

  const opacity =
    mode === "stable"
      ? 1
      : (() => {
          const pageStartMs = captions[0]?.startMs ?? 0;
          const pageEndMs = captions[captions.length - 1]?.endMs ?? pageStartMs + 1000;
          const durFrames = Math.max(1, Math.round(((pageEndMs - pageStartMs) / 1000) * fps));
          const inOp = interpolate(localFrame, [0, 2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const outOp = interpolate(localFrame, [durFrames - 2, durFrames], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return Math.min(inOp, outOp);
        })();

  const y = interpolate(localFrame, [0, 3], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const textContent = (
    <>
      {captions.map((caption, index) => {
          const absoluteIndex = pageStart + index;
          const tokenUpper = caption.text.trim().toUpperCase().replace(/[.,!?;:]/g, "");
          const overrideColor = colorOverrides?.[tokenUpper];
          const isActive = absoluteIndex === activeIndex;
          const color =
            mode === "stable"
              ? (overrideColor ?? "white")
              : overrideColor && isActive
                ? overrideColor
                : "white";

          return (
            <span
              key={`${caption.startMs}-${caption.text}`}
              style={{
                color,
                opacity: isActive || overrideColor ? 1 : 0.88,
              }}
            >
              {index > 0 ? " " : ""}
              {caption.text.trim().toLowerCase()}
            </span>
          );
        })}
    </>
  );

  const sharedTextStyle: React.CSSProperties = {
    opacity,
    transform: `translateY(${y}px)`,
    fontFamily,
    fontSize: 72,
    fontWeight: 400,
    lineHeight: 1.05,
    letterSpacing: 0.5,
    color: "white",
    WebkitTextStroke: "6px #060606",
    paintOrder: "stroke fill",
    textShadow: "0 4px 20px rgba(0,0,0,0.85)",
    whiteSpace: "pre-wrap",
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
  };

  // Posicionamento absoluto pelo topo (override ativo com top)
  if (overrideTop !== undefined) {
    return (
      <div
        style={{
          position: "absolute",
          top: overrideTop,
          left: overrideLeft ?? 60,
          width: overrideWidth ?? 960,
          ...sharedTextStyle,
        }}
      >
        {textContent}
      </div>
    );
  }

  // Posicionamento padrão — flex-end + paddingBottom
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          ...sharedTextStyle,
        }}
      >
        {textContent}
      </div>
    </AbsoluteFill>
  );
};
