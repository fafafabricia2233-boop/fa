/* =============================================================================
   NH — AGILIDADE NÃO É PRESSA
   Plano editorial da peça falada, montado em 13/09/2026 a partir de duas fitas.

   FONTE POR CORTE (o manual §02 manda registrar):
     clip0 gancho   = fita B (IMG_9335, 1080x1920 nativo)  fonte 2,92 → 5,40
     clip1 problema = fita A (copy_A479…, 480x854)         fonte 12,14 → 16,14
     clip2 solucao  = fita B                               fonte 5,80 → 12,33
     clip3 fecho    = fita A                               fonte 43,78 → 48,74

   POR QUE ESTA ORDEM: a fala não veio em ordem de peça. O gancho mais forte e
   inteligível está no meio da fita B ("separar rápido não significa separar
   bem"), e o manual (§02) autoriza abrir por ele. Problema, solução e o porquê
   vêm depois, que é a ordem semântica, não a da gravação.

   O APOIO cobre o corte 1 — o de menor resolução — e mostra folículos alinhados
   na placa, que é exatamente do que a fala trata ("machucar o folículo").
   Fonte: banco/contagem-foliculo/contando_foliculo.MOV, 6,0 → 9,6 s.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_AGILIDADE: Plano = {
  fps: 30,
  duration: 730, // 539 de conteúdo + 191 da marca
  endCard: 539,
  hookEnd: 74, // 2,467 s — o gancho é curto e fecha em si mesmo
  clips: [
    { nome: "gancho", src: "newhair/falado/clip0.mp4", start: 0, duration: 74 },
    { nome: "problema", src: "newhair/falado/clip1.mp4", start: 74, duration: 120 },
    { nome: "solucao", src: "newhair/falado/clip2.mp4", start: 194, duration: 196 },
    { nome: "fecho", src: "newhair/falado/clip3.mp4", start: 390, duration: 149 },
  ],
  brolls: [
    { fromFrame: 84, duration: 108, src: "newhair/falado/apoio.mp4", mode: "band", position: "50% 50%" },
  ],
  /* A primeira versão ("SEPARAR RÁPIDO" / "NÃO É SEPARAR BEM.") estourava a
     caixa: 18 caracteres a 72 px não cabem nos 900 px úteis. O manual §03 diz
     pra redistribuir linhas ANTES de reduzir o corpo — headline rebaixada ao
     tamanho de legenda é erro catalogado no §09. Redistribuído, e de quebra
     ficou literal: é exatamente a frase dela. */
  title: ["SEPARAR RÁPIDO NÃO É", "SEPARAR BEM."],
  titleShift: 140, // ela está enquadrada alta; sem isto o título cai no rosto
  zoomClip: 2, // o zoom vive no corte de resolução cheia, não no ampliado
  zoomFrame: 26,
  closeClips: [],
};

/* Legendas coladas na fala, tempo tirado do JSON por palavra do transcritor.
   Padrão da referência recente: uma linha de contexto em off-white e uma de
   sentido em caixa alta dourada. */
export const CUES_AGILIDADE: Cue[] = [
  { start: 2.55, end: 4.50, lines: [
    { text: "Não adianta você", size: 34 },
    { text: "SER RÁPIDO", size: 42, gold: true }] },
  { start: 4.58, end: 6.40, lines: [
    { text: "e machucar o folículo", size: 34 },
    { text: "O TEMPO TODO.", size: 42, gold: true }] },
  { start: 6.60, end: 8.10, lines: [
    { text: "Se para mim ganhar", size: 34 },
    { text: "5 MINUTOS", size: 42, gold: true }] },
  { start: 8.20, end: 10.70, lines: [
    { text: "eu tenho que apertar,", size: 34 },
    { text: "MACHUCAR O FOLÍCULO,", size: 42, gold: true }] },
  { start: 10.80, end: 12.95, lines: [
    { text: "eu prefiro", size: 34 },
    { text: "PERDER OS 5 MINUTOS.", size: 42, gold: true }] },
  { start: 13.10, end: 15.35, lines: [
    { text: "O folículo é", size: 34 },
    { text: "O MAIS IMPORTANTE DA CIRURGIA.", size: 42, gold: true }] },
  { start: 15.95, end: 17.80, lines: [
    { text: "Nós precisamos", size: 34 },
    { text: "MANTER ELE BEM.", size: 42, gold: true }] },
];
