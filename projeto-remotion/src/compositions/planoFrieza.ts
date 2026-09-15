/* =============================================================================
   NH — ELE CHEGA COM MEDO. ENCONTRA FRIEZA?
   Segunda peça da fita de três rolos de 15/09/2026 (ver planoMaltratado.ts para
   a leitura da fita inteira). Sai toda da IMG_9333, que é o rolo em que ela
   desenvolve o acolhimento.

   Nenhuma frase se repete entre as três peças.

   FONTE POR CORTE (tempos medidos no envelope):
     clip0 gancho 9333  41,94 →  49,91  "O paciente já chega com medo,
                                         expectativas, insegurança sobre o
                                         procedimento. Não é o momento de
                                         tratar ele com frieza."
     clip1 tese   9333  50,75 →  53,74  "Ele não precisa encontrar frieza
                                         dentro de uma sala."
     clip2 virada 9333 108,44 → 113,81  "O paciente chega na clínica, ele é
                                         acolhido, ouvido, tranquilizado."
     clip3 prova  9333 155,42 → 160,48  "Na New Hair, nós chamamos o paciente
                                         pelo nome, entendemos como ele está
                                         se sentindo."
     clip4 fecho  9333 172,78 → 180,46  "Nós explicamos cada etapa e
                                         transmitimos segurança para o
                                         paciente, para que ele possa entrar
                                         para o centro cirúrgico tranquilo."

   ÚLTIMAS TENTATIVAS. O medo/frieza é dito três vezes (15,80 sem terminar;
   27,84 mais curta; 41,94 a completa, com "expectativas" e "insegurança"). O
   "chega na clínica, é acolhido" tem uma gaguejada antes — "o paciente é o
   paciente é" morrendo em 108,24 — e a boa começa em 108,62; o corte em 108,44
   entra no silêncio entre as duas, medido.

   ⚠ O CORTE DO GANCHO QUASE COMEU "FRIEZA". O bordas.py apontou vale em 49,62 e
   o transcritor fecha "frieza" em 49,48; medido no envelope, o /za/ vai até
   49,88 e só então há o vale, de 60 ms, antes da tentativa abandonada que
   começa em 49,96. O corte foi pra 49,91. É o mesmo erro do "agilidade" de
   14/09, pego a tempo desta vez.

   FICOU DE FORA DE PROPÓSITO: "é o momento de a gente acolher ele" (21,60 —
   frase abandonada); as quatro tentativas de "é por isso que na New Hair nós
   nos preocupamos" (68,09 → 86,14 — a peça já tem fecho melhor); "nós
   explicamos cada etapa do procedimento para que ele não fique desassistido"
   (115,29 — a fita corta a frase em 126,27, ela nunca termina); e "escuta a
   história que trouxe o paciente" (165,58), que repete o clip3.

   APOIO de tela cheia, curto, pelo mesmo motivo da peça irmã: nesta fita a
   touca começa em ~100 px e a máscara pendurada vai até ~1050 px, não há onde
   por faixa mascarada sem cobrir o rosto.

   COM TENSÃO E CLICK: o problema é a frieza e termina em "dentro de uma sala";
   a solução entra em "O paciente chega na clínica, ele é acolhido".
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_FRIEZA: Plano = {
  fps: 30,
  duration: 1063, // 872 de conteúdo + 191 da marca
  endCard: 872,
  hookEnd: 158, // 5,267 s — fim de "…sobre o procedimento"
  clips: [
    { nome: "gancho", src: "newhair/falado12/clip0.mp4", start: 0, duration: 239 },
    { nome: "tese", src: "newhair/falado12/clip1.mp4", start: 239, duration: 90 },
    { nome: "virada", src: "newhair/falado12/clip2.mp4", start: 329, duration: 161 },
    { nome: "prova", src: "newhair/falado12/clip3.mp4", start: 490, duration: 152 },
    { nome: "fecho", src: "newhair/falado12/clip4.mp4", start: 642, duration: 230 },
  ],
  brolls: [
    /* "acolhido, ouvido, tranquilizado" — a equipe em volta de quem está deitado */
    { fromFrame: 400, duration: 72, src: "newhair/falado12/apoio_acolhe.mp4", mode: "full", position: "50% 50%" },
  ],
  title: ["ELE CHEGA COM MEDO.", "ENCONTRA FRIEZA?"],
  titleShift: 0,
  /* ordem da dona, 15/09/2026: "deixa o texto embaixo, na altura do peito e
     mão". Nesta fita o rosto vai de ~110 a ~1290 px; 270 cairia em cima dele. */
  tituloTop: 1330,
  /* sem zoom: medida a trajetória da touca nos cinco cortes, nenhum tem folga
     de cabeça suficiente pra aguentar os 12% sem encostar no topo do quadro. */
  zoomClip: -1,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_FRIEZA: Cue[] = [
  { start: 5.26, end: 8.00, lines: [
    { text: "Não é o momento", size: 34 },
    { text: "DE TRATAR ELE COM FRIEZA.", size: 42, gold: true }] },
  { start: 8.24, end: 11.15, lines: [
    { text: "Ele não precisa encontrar", size: 34 },
    { text: "FRIEZA DENTRO DE UMA SALA.", size: 42, gold: true }] },
  { start: 11.18, end: 12.85, lines: [
    { text: "O paciente chega", size: 34 },
    { text: "NA CLÍNICA,", size: 42, gold: true }] },
  { start: 12.86, end: 16.35, lines: [
    { text: "ele é acolhido,", size: 34 },
    { text: "OUVIDO, TRANQUILIZADO.", size: 42, gold: true }] },
  { start: 16.55, end: 19.25, lines: [
    { text: "Na New Hair, nós chamamos", size: 34 },
    { text: "O PACIENTE PELO NOME,", size: 42, gold: true }] },
  { start: 19.28, end: 21.45, lines: [
    { text: "entendemos como ele", size: 34 },
    { text: "ESTÁ SE SENTINDO.", size: 42, gold: true }] },
  { start: 21.62, end: 24.75, lines: [
    { text: "Nós explicamos cada etapa", size: 34 },
    { text: "E TRANSMITIMOS SEGURANÇA", size: 42, gold: true }] },
  { start: 24.78, end: 26.70, lines: [
    { text: "para o paciente,", size: 34 },
    { text: "PARA QUE ELE POSSA ENTRAR", size: 42, gold: true }] },
  { start: 26.72, end: 29.05, lines: [
    { text: "para o centro cirúrgico", size: 34 },
    { text: "TRANQUILO.", size: 42, gold: true }] },
];
