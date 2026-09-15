/* =============================================================================
   NH — O TEMPO DO FOLÍCULO FORA DA SOLUÇÃO
   Fita IMG_1610.MOV, montada em 15/09/2026.

   A FITA. 4K vertical nativa (2160×3840, rotação 90), HEVC, 60 fps, 41,5 s.
   Baixada por cópia + pedaços, como as irmãs deste lote.

   FONTE POR CORTE (bordas lidas direto no envelope: esta fita tem piso de ruído
   alto e a detecção automática batia no limite da busca — quando isso acontece,
   olha-se o desenho em vez de confiar no número):
     clip0 gancho    3,38 →  8,52  "Você sabe quanto tempo o folículo fica fora
                                    da solução durante a cirurgia?"
     clip1 corpo    10,90 → 24,30  "O folículo não pode ficar fora da solução
                                    durante muito tempo. Enquanto a equipe se
                                    organiza, não tem como o folículo ficar fora
                                    da solução. Por isso a equipe tem que ser
                                    organizada e ágil, para que o folículo
                                    mantenha na solução e na temperatura certa,"
     clip2 isquemia 24,62 → 27,75  "para que ele sofra o mínimo possível de
                                    isquemia."
     clip3 fecho    28,86 → 32,55  "E com isso, até a implantação tem que ter
                                    cuidado."

   ESTA É A ÚNICA DAS TRÊS COM TENSÃO E CLICK, e não por gosto: ela tem um bloco
   de problema de verdade. O problema termina em "não tem como o folículo ficar
   fora da solução" (12,00 s da peça) e a solução entra em "Por isso a equipe tem
   que ser organizada e ágil" (12,27 s). O §05 pede exatamente isso — o grave
   morrendo na última palavra do problema e o click na entrada da solução. Nas
   outras duas peças do lote não há bloco de problema, e por isso saem sem.

   ⚠ "sofra", não "sofre": o transcritor sem vocabulário escreve "sofre"; com
   vocabulário, "sofra". O subjuntivo é o que a regência pede depois de "para
   que", e é o que está na legenda.

   FICOU DE FORA: o CTA de perfil pessoal (35,5→39,8).

   APOIO: folículos na cuba de solução sobre "fora da solução", e a dupla
   trabalhando sobre "organizada e ágil". Faixa de 620 px — cabeça em 530 px.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_ISQUEMIA: Plano = {
  fps: 30,
  duration: 952, // 761 de conteúdo + 191 da marca
  endCard: 761,
  hookEnd: 154, // 5,133 s
  clips: [
    { nome: "gancho", src: "newhair/falado8/clip0.mp4", start: 0, duration: 154 },
    { nome: "corpo", src: "newhair/falado8/clip1.mp4", start: 154, duration: 402 },
    { nome: "isquemia", src: "newhair/falado8/clip2.mp4", start: 556, duration: 94 },
    { nome: "fecho", src: "newhair/falado8/clip3.mp4", start: 650, duration: 111 },
  ],
  brolls: [
    { fromFrame: 190, duration: 79, src: "newhair/falado8/apoio_solucao.mp4", mode: "band", altura: 620, position: "50% 50%" },
    { fromFrame: 380, duration: 150, src: "newhair/falado8/apoio_equipe.mp4", mode: "band", altura: 620, position: "50% 50%" },
  ],
  title: ["QUANTO TEMPO O FOLÍCULO FICA", "FORA DA SOLUÇÃO?"],
  titleShift: 0,
  zoomClip: 3,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_ISQUEMIA: Cue[] = [
  { start: 5.23, end: 8.10, lines: [
    { text: "O folículo não pode ficar", size: 34 },
    { text: "FORA DA SOLUÇÃO MUITO TEMPO.", size: 42, gold: true }] },
  { start: 8.25, end: 9.95, lines: [
    { text: "Enquanto a equipe", size: 34 },
    { text: "SE ORGANIZA,", size: 42, gold: true }] },
  { start: 10.03, end: 12.00, lines: [
    { text: "não tem como o folículo", size: 34 },
    { text: "FICAR FORA DA SOLUÇÃO.", size: 42, gold: true }] },
  { start: 12.27, end: 15.20, lines: [
    { text: "Por isso a equipe tem que ser", size: 34 },
    { text: "ORGANIZADA E ÁGIL,", size: 42, gold: true }] },
  { start: 15.39, end: 17.00, lines: [
    { text: "para que o folículo", size: 34 },
    { text: "MANTENHA NA SOLUÇÃO", size: 42, gold: true }] },
  { start: 17.05, end: 18.40, lines: [
    { text: "e na", size: 34 },
    { text: "TEMPERATURA CERTA,", size: 42, gold: true }] },
  { start: 18.53, end: 21.50, lines: [
    { text: "para que ele sofra", size: 34 },
    { text: "O MÍNIMO POSSÍVEL DE ISQUEMIA.", size: 42, gold: true }] },
  { start: 21.93, end: 25.20, lines: [
    { text: "E com isso, até a implantação", size: 34 },
    { text: "TEM QUE TER CUIDADO.", size: 42, gold: true }] },
];
