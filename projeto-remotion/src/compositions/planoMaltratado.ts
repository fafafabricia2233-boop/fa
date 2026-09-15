/* =============================================================================
   NH — NÃO FOI A CIRURGIA QUE MARCOU ELE
   Primeira das TRÊS peças da fita de 15/09/2026. A dona mandou três arquivos
   (IMG_9332 73,5 s · IMG_9333 183,6 s · IMG_9334 101,0 s) dizendo "são 3 mas
   são 1 só": é uma fala contínua gravada em três rolos, mesmo enquadramento,
   mesma sala, mesma roupa. 358 s de bruto no total.

   ESTA É A MELHOR PEÇA DA FITA (§02, a pergunta "qual é o melhor trecho?" vem
   antes de "quantas peças existem?"). Motivo: é a única com uma HISTÓRIA — um
   paciente de verdade, operado por outra equipe, e o que ficou nele não foi a
   cirurgia. O resto da fita é tese; isto é caso.

   FONTE POR CORTE (tempos medidos no envelope, não no JSON do transcritor):
     clip0 setup  9332  4,84 → 11,48  "Hoje nós recebemos um paciente aqui na
                                       clínica que já havia sido submetido a
                                       outro transplante capilar com outra
                                       equipe."
     clip1 punch  9332 17,40 → 22,82  "E o que mais marcou para ele não foi a
                                       cirurgia em si, foi a forma com que ele
                                       foi maltratado."
     clip2 tese   9333  0,40 →  8,48  "Uma equipe pode dominar todas as
                                       técnicas, mas se ela fala com grosseria,
                                       não escuta, não acolhe o paciente, tem
                                       alguma coisa de errada."
     clip3 fecho  9334 92,55 → 99,60  "É por isso que na New Hair nós cuidamos
                                       da cirurgia, do fluxo e principalmente
                                       de quem está deitado na sua maca."

   ÚLTIMAS TENTATIVAS, como o §02 manda. O setup é dito duas vezes (a primeira
   em 0,00, com "super querido", abandonada em 4,88); fica a segunda. O punch
   também: a primeira morre em 14,66 ("não foi a…") e a boa é a de 17,40 — e o
   JSON do transcritor COLOU as duas numa frase só, marcando a palavra "a" de
   14,66 a 19,72. Foi o vão de 5 s dentro do segmento que denunciou. A tese
   tem três tentativas (9332 em 22,98 e 30,18, 9333 em 0,40); a completa, com
   "tem alguma coisa de errada", é só a da 9333.

   "CUIDAMOS", NÃO "CODAMOS". O transcritor devolve "codamos" nas duas passadas
   do trecho isolado (0,65 e 0,84) — palavra que não existe. No stem montado ele
   escreve "cuidamos". O sentido decide: "cuidamos da cirurgia, do fluxo e
   principalmente de quem está deitado na maca". Vale um ouvido dela.

   FICOU DE FORA DE PROPÓSITO: todo o miolo da 9332 (36 s → 73 s) é bastidor de
   sala com conversa de fundo, não fala pra câmera. E as duas outras peças desta
   mesma fita (NH_frieza e NH_medico) não repetem nenhuma frase daqui.

   APOIO: esta fita NÃO ACEITA a faixa mascarada. Medido quadro a quadro, a
   touca dela começa entre 72 e 400 px e a máscara cirúrgica pendurada vai até
   1290 px — não há céu em cima nem chão embaixo. A faixa de 500-800 px das
   peças anteriores cairia no rosto. Então aqui o apoio é corte seco de tela
   cheia, curto (72 frames), nos dois pontos em que a imagem prova a fala.

   COM TENSÃO E CLICK: a peça tem problema delimitado (o paciente maltratado,
   fechando em "tem alguma coisa de errada") e solução entrando em "É por isso
   que na New Hair".
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_MALTRATADO: Plano = {
  fps: 30,
  duration: 1007, // 816 de conteúdo + 191 da marca
  endCard: 816,
  hookEnd: 199, // 6,633 s — fim do setup, onde o filme e o beat entram
  clips: [
    { nome: "setup", src: "newhair/falado11/clip0.mp4", start: 0, duration: 199 },
    { nome: "punch", src: "newhair/falado11/clip1.mp4", start: 199, duration: 163 },
    { nome: "tese", src: "newhair/falado11/clip2.mp4", start: 362, duration: 242 },
    { nome: "fecho", src: "newhair/falado11/clip3.mp4", start: 604, duration: 212 },
  ],
  brolls: [
    /* "dominar todas as técnicas" — a dupla de lupa trabalhando fino */
    { fromFrame: 387, duration: 72, src: "newhair/falado11/apoio_tecnica.mp4", mode: "full", position: "50% 50%" },
    /* "quem está deitado na sua maca" — entra e vai direto na marca */
    { fromFrame: 744, duration: 72, src: "newhair/falado11/apoio_maca.mp4", mode: "full", position: "50% 50%" },
  ],
  title: ["NÃO FOI A CIRURGIA", "QUE MARCOU ELE."],
  titleShift: 0,
  /* ordem da dona, 15/09/2026: "deixa o texto embaixo, na altura do peito e
     mão". Nesta fita o rosto vai de ~110 a ~1290 px; 270 cairia em cima dele. */
  tituloTop: 1330,
  /* zoom no fecho: é o único corte com folga de cabeça medida (324→432 px no
     momento em que o zoom completa). Nos outros a touca começa cedo demais. */
  zoomClip: 3,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_MALTRATADO: Cue[] = [
  { start: 6.88, end: 9.95, lines: [
    { text: "E o que mais marcou pra ele", size: 34 },
    { text: "NÃO FOI A CIRURGIA EM SI,", size: 42, gold: true }] },
  { start: 10.00, end: 12.10, lines: [
    { text: "foi a forma com que ele", size: 34 },
    { text: "FOI MALTRATADO.", size: 42, gold: true }] },
  { start: 12.26, end: 14.58, lines: [
    { text: "Uma equipe pode dominar", size: 34 },
    { text: "TODAS AS TÉCNICAS,", size: 42, gold: true }] },
  { start: 14.64, end: 16.35, lines: [
    { text: "mas se ela fala", size: 34 },
    { text: "COM GROSSERIA,", size: 42, gold: true }] },
  { start: 16.38, end: 18.78, lines: [
    { text: "não escuta,", size: 34 },
    { text: "NÃO ACOLHE O PACIENTE,", size: 42, gold: true }] },
  { start: 18.82, end: 20.30, lines: [
    { text: "tem alguma coisa", size: 34 },
    { text: "DE ERRADA.", size: 42, gold: true }] },
  { start: 20.34, end: 22.88, lines: [
    { text: "É por isso que na New Hair", size: 34 },
    { text: "NÓS CUIDAMOS DA CIRURGIA,", size: 42, gold: true }] },
  { start: 22.92, end: 24.55, lines: [
    { text: "do fluxo", size: 34 },
    { text: "E PRINCIPALMENTE", size: 42, gold: true }] },
  { start: 24.58, end: 27.15, lines: [
    { text: "de quem está deitado", size: 34 },
    { text: "NA SUA MACA.", size: 42, gold: true }] },
];
