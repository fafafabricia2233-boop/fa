/* =============================================================================
   NH — CADA UM DA SUA EQUIPE FAZ DE UM JEITO?
   Fita de 16/09/2026 (1ugrPn8…), 61,4 s, 4K vertical nativo HEVC a 60 fps — a
   melhor fonte que passou por aqui. Terceira pessoa da série, sentada, parede
   clara, enquadramento aberto.

   UMA PEÇA SÓ: é um roteiro fechado, problema → padrão → prova → CTA. Não sobra
   bloco que se sustente sozinho.

   FONTE POR CORTE (tempos medidos no envelope):
     clip0 gancho  5,30 →  9,70  "Médico. Cada membro da equipe trabalha de uma
                                  forma diferente."
     clip1 atrapa 20,72 → 22,95  "Isso atrapalha o fluxo da cirurgia."
     clip2 precisa 23,18 → 25,95 "Precisa ter um padrão a seguir."
     clip3 padroes 26,05 → 30,40 "Um padrão de contagem, um padrão de
                                  manipulação, um padrão de implantação."
     clip4 flui   30,90 → 33,95  "Com isso, a cirurgia flui de forma melhor."
     clip5 previs 43,80 → 47,20  "Organização traz previsibilidade para a
                                  cirurgia."
     clip6 sevoce 48,95 → 54,20  "Se você quer uma equipe que tem padrão e que
                                  todos os membros da equipe"
     clip7 agem   54,95 → 57,05  "agem de acordo com esse padrão,"
     clip8 cta    57,10 → 59,70  "Chame a New Hair. Link na bio."

   ⚠ "ORGANIZAÇÃO TRAZ PREVISIBILIDADE PARA A CIRURGIA" ESTÁ DITA TRÊS VEZES, e
   só a terceira sai limpa:
     34,40  "Organização traz pré-vip… mas previsibilidade para a cirurgia"  ✗
     39,80  "Organização traz previs… previsibilidade para a cirurgia"       ✗
     43,92  "Organização traz previsibilidade para a cirurgia."              ✓
   As duas primeiras tropeçam na própria palavra e se corrigem. O transcritor da
   fita inteira devolvia as três como frases limpas — só aparecem recortando
   janelas curtas, porque ele estica UMA palavra por cima da tropeçada
   ("presibilidade" de 36,68 a 38,90).

   FICOU DE FORA DE PROPÓSITO: a primeira enumeração ("Organização, contagem,
   manipulação de folículo, implantação", 10,58 → 18,53). Ela lista as MESMAS
   quatro tarefas que o clip3 lista de novo como "um padrão de contagem, um
   padrão de manipulação, um padrão de implantação" — ter as duas é redundância,
   e a segunda é a que fica do lado da solução. Também saiu "Cada um faz de uma
   forma" (18,80), que repete o gancho.

   OLHAR NA CÂMERA conferido nos nove cortes, folha de contato a 2 quadros/s.
   Nenhuma consulta lateral: ela fica na lente a fita inteira.

   "CHAME A NEW HAIR" — o transcritor devolve "chame-ne o Ré" sem vocabulário e
   "Chame a New Hair" com ele, mas a 0,03 de confiança. O sentido não deixa
   dúvida (é o CTA da marca); vale o ouvido dela.

   APOIO EM FAIXA MASCARADA: o cabelo começa entre 524 e 556 px, então
   altura = 524 ÷ 0,85 ≈ 615. Título no alto (270), bem acima da cabeça.

   COM TENSÃO E CLICK: o problema fecha em "isso atrapalha o fluxo da cirurgia"
   e a solução entra em "Precisa ter um padrão a seguir".
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_PADRAO_SEGUIR: Plano = {
  fps: 30,
  duration: 1097, // 906 de conteúdo + 191 da marca
  endCard: 906,
  hookEnd: 132, // 4,400 s
  clips: [
    { nome: "gancho", src: "newhair/falado15/clip0.mp4", start: 0, duration: 132 },
    { nome: "atrapalha", src: "newhair/falado15/clip1.mp4", start: 132, duration: 67 },
    { nome: "precisa", src: "newhair/falado15/clip2.mp4", start: 199, duration: 83 },
    { nome: "padroes", src: "newhair/falado15/clip3.mp4", start: 282, duration: 131 },
    { nome: "flui", src: "newhair/falado15/clip4.mp4", start: 413, duration: 92 },
    { nome: "previsibilidade", src: "newhair/falado15/clip5.mp4", start: 505, duration: 102 },
    { nome: "sevoce", src: "newhair/falado15/clip6.mp4", start: 607, duration: 158 },
    { nome: "agem", src: "newhair/falado15/clip7.mp4", start: 765, duration: 63 },
    { nome: "cta", src: "newhair/falado15/clip8.mp4", start: 828, duration: 78 },
  ],
  brolls: [
    /* "um padrão de contagem" — os folículos enfileirados na placa, literal */
    { fromFrame: 300, duration: 110, src: "newhair/falado15/apoio_contagem.mp4", mode: "band", altura: 615, position: "50% 50%" },
    /* "organização traz previsibilidade" — a mesa sendo montada */
    { fromFrame: 512, duration: 95, src: "newhair/falado15/apoio_organiza.mp4", mode: "band", altura: 615, position: "50% 50%" },
  ],
  title: ["CADA UM DA SUA EQUIPE", "FAZ DE UM JEITO?"],
  titleShift: 0,
  /* zoom no corte da tese: cabelo em 544 px, sobra folga de sobra pros 12% */
  zoomClip: 5,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_PADRAO_SEGUIR: Cue[] = [
  { start: 4.54, end: 6.75, lines: [
    { text: "Isso atrapalha", size: 34 },
    { text: "O FLUXO DA CIRURGIA.", size: 42, gold: true }] },
  { start: 7.20, end: 9.55, lines: [
    { text: "Precisa ter", size: 34 },
    { text: "UM PADRÃO A SEGUIR.", size: 42, gold: true }] },
  { start: 9.80, end: 11.15, lines: [
    { text: "Um padrão", size: 34 },
    { text: "DE CONTAGEM,", size: 42, gold: true }] },
  { start: 11.18, end: 12.48, lines: [
    { text: "um padrão", size: 34 },
    { text: "DE MANIPULAÇÃO,", size: 42, gold: true }] },
  { start: 12.50, end: 13.85, lines: [
    { text: "um padrão", size: 34 },
    { text: "DE IMPLANTAÇÃO.", size: 42, gold: true }] },
  { start: 13.88, end: 16.95, lines: [
    { text: "Com isso, a cirurgia", size: 34 },
    { text: "FLUI DE FORMA MELHOR.", size: 42, gold: true }] },
  { start: 17.00, end: 20.30, lines: [
    { text: "A organização traz", size: 34 },
    { text: "PREVISIBILIDADE PARA A CIRURGIA.", size: 42, gold: true }] },
  { start: 20.52, end: 22.70, lines: [
    { text: "Se você quer uma equipe", size: 34 },
    { text: "QUE TEM PADRÃO", size: 42, gold: true }] },
  { start: 22.74, end: 25.62, lines: [
    { text: "e que todos", size: 34 },
    { text: "OS MEMBROS DA EQUIPE", size: 42, gold: true }] },
  { start: 25.64, end: 27.45, lines: [
    { text: "agem de acordo", size: 34 },
    { text: "COM ESSE PADRÃO,", size: 42, gold: true }] },
  { start: 27.50, end: 30.15, lines: [
    { text: "Chame a New Hair.", size: 34 },
    { text: "LINK NA BIO.", size: 42, gold: true }] },
];
