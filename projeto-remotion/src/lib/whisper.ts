import type { Caption } from "@remotion/captions";

type RawWord = {
  start?: number;
  end?: number;
  startMs?: number;
  endMs?: number;
  timestampMs?: number | null;
  text?: string;
  word?: string;
  confidence?: number | null;
};

type WhisperSegment = {
  words?: RawWord[];
};

type WhisperJson = {
  words?: RawWord[];
  captions?: RawWord[];
  segments?: WhisperSegment[];
};

const toMs = (value: number | undefined, fallback: number, alreadyMs = false) => {
  if (typeof value !== "number") {
    return fallback;
  }

  if (alreadyMs) {
    return Math.round(value);
  }

  return value > 1000 ? Math.round(value) : Math.round(value * 1000);
};

const normalizeWord = (word: RawWord, index: number): Caption => {
  const text = word.text ?? word.word ?? "";
  const hasStartMs = typeof word.startMs === "number";
  const hasEndMs = typeof word.endMs === "number";
  const startMs = toMs(hasStartMs ? word.startMs : word.start, index * 250, hasStartMs);
  const endMs = toMs(hasEndMs ? word.endMs : word.end, startMs + 250, hasEndMs);

  return {
    text: text.startsWith(" ") ? text : ` ${text}`,
    startMs,
    endMs: Math.max(endMs, startMs + 1),
    timestampMs: word.timestampMs ?? startMs,
    confidence: word.confidence ?? null,
  };
};

export const normalizeWhisperJson = (json: WhisperJson | RawWord[]): Caption[] => {
  if (Array.isArray(json)) {
    return json.map(normalizeWord).filter((caption) => caption.text.trim().length > 0);
  }

  const words =
    json.captions ??
    json.words ??
    json.segments?.flatMap((segment) => segment.words ?? []) ??
    [];

  return words.map(normalizeWord).filter((caption) => caption.text.trim().length > 0);
};

export const loadCaptionFile = async (src: string): Promise<Caption[]> => {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Could not load captions: ${src}`);
  }

  return normalizeWhisperJson((await response.json()) as WhisperJson | RawWord[]);
};
