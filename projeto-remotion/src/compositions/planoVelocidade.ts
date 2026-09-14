/* =============================================================================
   NH — A VELOCIDADE QUE NÃO COBRA O PREÇO DO ENXERTO
   Segunda peça do mesmo material, montada em 14/09/2026 com a fala que sobrou
   da NH_agilidade. Nada aqui repete texto que já foi ao ar na outra.

   FONTE POR CORTE — tudo da fita A (copy_A479…, 480×854, ampliada 2,25×):
     clip0 gancho   fonte  1,22 →  5,25   "Agilidade não é pegar o folículo de
                                           qualquer jeito, contar de qualquer jeito."
     clip1 definição fonte  6,74 → 12,04  "Agilidade vem de treinamento,
                                           constância e cuidado com o folículo."
     clip2 solução  fonte 34,42 → 42,05   "É a velocidade que não cobra o preço
                                           do enxerto… sem danificar nenhuma
                                           estrutura do folículo."

   O "Porque" inicial saiu: é conector de resposta a uma pergunta que o
   espectador não ouviu. O "Isso não é agilidade" (5,36→6,30) também saiu, por
   dizer a mesma coisa que o título já diz — o §02 manda tirar redundância sem
   inverter a lógica.

   FICOU DE FORA, DE PROPÓSITO: "Sabe qual é a velocidade de voo?" (32,80→34,42).
   O transcritor bateu "de voo" em três passadas com 0,93–0,98 de confiança, mas
   a expressão não fecha sentido e não há escuta perceptual neste ambiente. Não
   se põe na tela palavra que não se confirmou.

   PREÇO A PAGAR, REGISTRADO: os três cortes vêm da fita de 480×854. A peça
   inteira é ampliada — a NH_agilidade tinha metade em resolução nativa. Por
   isso os dois apoios cobrem mais tempo aqui do que lá.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_VELOCIDADE: Plano = {
  fps: 30,
  duration: 700, // 509 de conteúdo + 191 da marca
  endCard: 509,
  hookEnd: 121, // 4,033 s
  clips: [
    { nome: "gancho", src: "newhair/falado2/clip0.mp4", start: 0, duration: 121 },
    { nome: "definicao", src: "newhair/falado2/clip1.mp4", start: 121, duration: 159 },
    { nome: "solucao", src: "newhair/falado2/clip2.mp4", start: 280, duration: 229 },
  ],
  /* APOIO EM FAIXA MASCARADA, com a ALTURA MEDIDA (ordem da dona, 14/09/2026:
     mantém o mascaramento, e o vídeo na tela toda).

     São duas exigências que pareciam brigar: a faixa de 760 px do exemplo
     aprovado só cabia acima da cabeça dela porque o plano ia 240 px pra baixo —
     e era esse empurrão que descobria o fundo azul no topo.

     Não brigam. O que a máscara precisa é dissolver no topo da cabeça, não ter
     760 px. Medida a touca azul nos dois cortes (clip1 em y=430, clip2 em
     y=440) e mantida a mesma proporção do exemplo aprovado — cabeça a ~85% da
     faixa, logo abaixo do limite opaco de 82% — a faixa fica em 500 px. O apoio
     se funde na imagem dela igual, o rosto continua livre, e ninguém sai do
     lugar: zero fundo à mostra e zero ampliação. */
  brolls: [
    // "treinamento e constância" → mãos treinadas carregando o implanter
    { fromFrame: 135, duration: 132, src: "newhair/falado2/apoio_maos.mp4", mode: "band", altura: 500, position: "50% 50%" },
    // "sem danificar nenhuma estrutura" → implante com pinça, movimento fino
    { fromFrame: 380, duration: 120, src: "newhair/falado2/apoio_pinca.mp4", mode: "band", altura: 500, position: "50% 50%" },
  ],
  title: ["PEGAR DE QUALQUER JEITO", "NÃO É AGILIDADE."],
  /* 0, não 140: o título mora sobre a imagem, segurado pelo véu do topo. O
     empurrão existia pra abrir céu acima da cabeça dela, mas custava faixa de
     fundo à mostra — e a fita não tem imagem sobrando acima da cabeça pra
     pagar isso sem ampliar ainda mais um material já ampliado 2,25×. */
  titleShift: 0,
  zoomClip: 2,
  zoomFrame: 26,
  closeClips: [],
};

export const CUES_VELOCIDADE: Cue[] = [
  { start: 4.20, end: 6.90, lines: [
    { text: "Agilidade vem de", size: 34 },
    { text: "TREINAMENTO E CONSTÂNCIA,", size: 42, gold: true }] },
  { start: 6.95, end: 9.20, lines: [
    { text: "e cuidado com", size: 34 },
    { text: "O FOLÍCULO, PRINCIPALMENTE.", size: 42, gold: true }] },
  { start: 9.50, end: 11.85, lines: [
    { text: "É a velocidade que", size: 34 },
    { text: "NÃO COBRA O PREÇO DO ENXERTO.", size: 42, gold: true }] },
  { start: 11.95, end: 14.40, lines: [
    { text: "É aquela velocidade em que", size: 34 },
    { text: "A GENTE CONSEGUE IR RÁPIDO,", size: 42, gold: true }] },
  { start: 14.45, end: 16.85, lines: [
    { text: "mas sem danificar", size: 34 },
    { text: "NENHUMA ESTRUTURA DO FOLÍCULO.", size: 42, gold: true }] },
];
