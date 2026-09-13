/* Adapta o plano/cues do exemplo aprovado (formato do kit) para o formato do
   motor ReelFalado. Serve só pra provar que o motor novo reproduz o padrão
   aprovado — peça nova nasce com plano próprio. */
import planoKit from "./plan.json";
import cuesKit from "./cues.json";
import type { Cue, Plano } from "../compositions/ReelFalado";

export const PLANO_KIT: Plano = {
  fps: planoKit.fps,
  duration: planoKit.duration,
  endCard: planoKit.endCard,
  hookEnd: planoKit.hookEnd,
  clips: planoKit.clips.map((c) => ({
    nome: c.name,
    src: c.src,
    start: c.start,
    duration: c.duration,
  })),
  brolls: planoKit.brolls.map((b) => ({
    fromFrame: b.fromFrame,
    duration: b.duration,
    src: b.src,
    mode: b.mode === "band" ? "band" : "full",
    position: b.position,
  })),
  title: [planoKit.title[0], planoKit.title[1]],
  titleShift: planoKit.titleShift,
  zoomClip: planoKit.zoomClip,
  zoomFrame: planoKit.zoomFrame,
  closeClips: planoKit.closeClips,
};

export const CUES_KIT: Cue[] = cuesKit as Cue[];
