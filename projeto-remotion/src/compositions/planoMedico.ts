/* =============================================================================
   NH — MÉDICO, A SUA EQUIPE FAZ PARTE.
   Terceira peça da fita de três rolos de 15/09/2026 (ver planoMaltratado.ts).
   Sai toda da IMG_9334, o rolo em que ela fala DIRETO com o médico.

   É a única das três endereçada a ele em segunda pessoa — por isso existe
   separada em vez de virar bloco de uma das outras. Nenhuma frase se repete
   entre as três.

   ORDEM INVERTIDA DE PROPÓSITO: na fita o vocativo "Médico, pode ter certeza"
   vem em 80 s, quase no fim, e o "porque para nós o paciente não é a cirurgia
   do dia" abre o rolo. Montada, o vocativo abre — o §02 autoriza abrir pelo
   gancho mais forte esteja ele onde estiver (mesmo caso da NH_agilidade e da
   NH_adapta).

   FONTE POR CORTE (tempos medidos no envelope):
     clip0 gancho 9334 80,42 → 86,40  "Médico, pode ter certeza que a sua
                                       equipe também faz parte da experiência
                                       que o paciente vai levar da sua clínica."
     clip1 tese   9334  0,03 →  5,30  "Porque para nós, o paciente não é a
                                       cirurgia do dia. O paciente não é um
                                       número."
     clip2 corpo  9334 25,42 → 33,11  "O paciente escolheu o seu trabalho como
                                       médico e o nosso trabalho como equipe
                                       para realizar o grande sonho dele."
     clip3 fecho  9334 44,42 → 48,45  "E ele precisa sentir segurança em cada
                                       etapa do procedimento."

   ÚLTIMAS TENTATIVAS. O vocativo é dito QUATRO vezes: 61,88 (sem o "também"),
   68,19 (trava no meio — o JSON marca a palavra "da" de 71,38 a 74,92, um vão
   de 3,5 s), 78,38 (abandonada em "que eu…") e 80,60, que é a limpa. Fica a
   quarta.

   ⚠ DUAS BORDAS CORRIGIDAS AQUI. (1) O transcritor marca o fecho começando em
   43,62 e a varredura de regiões acusa fala em 43,05; medido, tudo até 44,47 é
   piso de ruído e a voz só ataca em 44,51 — o corte foi pra 44,42. (2) O
   primeiro corte de clip1 comeu "número": o detector de cauda parou em 4,55 e
   a palavra vai até 5,24. Só apareceu porque transcrevi o CORTE PRONTO, não a
   fita. Refeito em 5,30, no vale de 60 ms antes de "É uma pessoa…".

   FICOU DE FORA DE PROPÓSITO: "É uma pessoa que escolheu confiar no seu
   trabalho como médico e no nosso trabalho como equipe" (9,03) — o clip2 diz a
   mesma coisa e ainda fecha em "o grande sonho dele"; e o "É por isso que na
   New Hair nós cuidamos da cirurgia" (92,39), que é o fecho da NH_maltratado.

   APOIO de tela cheia, curto — mesmo motivo das irmãs: enquadramento sem folga
   pra faixa mascarada.

   SEM TENSÃO E SEM CLICK: o gancho não é um problema delimitado, é uma
   afirmação ao médico. O §05 proíbe forçar o grave sem problema; a virada fica
   por conta do filme. Mesma decisão da NH_velocidade.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_MEDICO: Plano = {
  fps: 30,
  duration: 880, // 689 de conteúdo + 191 da marca
  endCard: 689,
  hookEnd: 179, // 5,967 s — fim de "…da sua clínica"
  clips: [
    { nome: "gancho", src: "newhair/falado13/clip0.mp4", start: 0, duration: 179 },
    { nome: "tese", src: "newhair/falado13/clip1.mp4", start: 179, duration: 158 },
    { nome: "corpo", src: "newhair/falado13/clip2.mp4", start: 337, duration: 231 },
    { nome: "fecho", src: "newhair/falado13/clip3.mp4", start: 568, duration: 121 },
  ],
  brolls: [
    /* "o nosso trabalho como equipe" — a dupla trabalhando junto */
    { fromFrame: 453, duration: 72, src: "newhair/falado13/apoio_equipe.mp4", mode: "full", position: "50% 50%" },
  ],
  title: ["MÉDICO, A SUA EQUIPE", "FAZ PARTE."],
  titleShift: 0,
  /* ordem da dona, 15/09/2026: "deixa o texto embaixo, na altura do peito e
     mão". Nesta fita o rosto vai de ~110 a ~1290 px; 270 cairia em cima dele. */
  tituloTop: 1330,
  /* zoom no corpo: é onde a touca dela tem a maior folga medida desta peça. */
  zoomClip: 2,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_MEDICO: Cue[] = [
  { start: 7.00, end: 9.65, lines: [
    { text: "Porque para nós, o paciente", size: 34 },
    { text: "NÃO É A CIRURGIA DO DIA.", size: 42, gold: true }] },
  { start: 9.70, end: 11.35, lines: [
    { text: "O paciente", size: 34 },
    { text: "NÃO É UM NÚMERO.", size: 42, gold: true }] },
  { start: 12.32, end: 14.75, lines: [
    { text: "O paciente escolheu o seu", size: 34 },
    { text: "TRABALHO COMO MÉDICO", size: 42, gold: true }] },
  { start: 14.78, end: 16.70, lines: [
    { text: "e o nosso", size: 34 },
    { text: "TRABALHO COMO EQUIPE", size: 42, gold: true }] },
  { start: 16.72, end: 19.00, lines: [
    { text: "para realizar", size: 34 },
    { text: "O GRANDE SONHO DELE.", size: 42, gold: true }] },
  { start: 19.04, end: 22.95, lines: [
    { text: "E ele precisa sentir segurança", size: 34 },
    { text: "EM CADA ETAPA DO PROCEDIMENTO.", size: 42, gold: true }] },
];
