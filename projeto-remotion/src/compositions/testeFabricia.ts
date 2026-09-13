/* Fita neutra + plano mínimo só pra CONFERIR OS TOKENS da marca Fabrícia Satza
   (cor, fonte, cabeçalho, escala, logo do fim) sem usar imagem de outra marca.
   Não é peça: peça nasce de fita dela com plano próprio. */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_TESTE: Plano = {
  fps: 30,
  duration: 270, // 180 de conteúdo + 90 de assinatura
  endCard: 180,
  hookEnd: 141, // mesma virada do exemplo aprovado: 4,70 s
  clips: [
    { nome: "unico", src: "marcas/fabricia/fita_teste.mp4", start: 0, duration: 180 },
  ],
  brolls: [],
  title: ["SEU CABELO NÃO", "CAIU DE UMA VEZ."],
  titleShift: 0,
  zoomClip: 0,
  zoomFrame: 26,
  closeClips: [],
};

export const CUES_TESTE: Cue[] = [
  {
    start: 4.9,
    end: 8.0,
    lines: [
      { text: "Ele foi afinando —", size: 45 },
      { text: "E ISSO MUDA O TRATAMENTO.", size: 52, gold: true },
    ],
  },
];
