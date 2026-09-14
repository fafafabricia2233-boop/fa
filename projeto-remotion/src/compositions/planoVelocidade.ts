/* =============================================================================
   NH — A VELOCIDADE QUE NÃO COBRA O PREÇO DO ENXERTO
   Segunda peça do mesmo material, montada em 14/09/2026 com a fala que sobrou
   da NH_agilidade. Nada aqui repete texto que já foi ao ar na outra.

   FONTE POR CORTE — tudo da fita A (copy_A479…, 480×854, ampliada 2,25×):
     clip0 gancho   fonte  1,100 → 5,233  "Agilidade não é pegar o folículo de
                                           qualquer jeito, contar de qualquer jeito."
       O corte original começava em 1,22 e comia o começo de "agilidade" — a dona
       ouviu (14/09/2026). O transcritor marcava a palavra em 1,30, mas ele ancora
       na SÍLABA FORTE: medida a energia de 10 em 10 ms, "que" termina em 1,09 e o
       "a" de agilidade vai de 1,13 a 1,28. O corte em 1,22 caía no meio da vogal.
       1,100 é o vale entre as duas palavras — não há silêncio ali, "porque" e
       "agilidade" são ditos emendados, então o corte mora no ponto mais baixo.
     clip1 definição fonte  6,74 → 12,04  "Agilidade vem de treinamento,
                                           constância e cuidado com o folículo."
     clip2 solução  fonte 34,42 → 42,05   "É a velocidade que não cobra o preço
                                           do enxerto… sem danificar nenhuma
                                           estrutura do folículo."

   O "Porque" inicial saiu: é conector de resposta a uma pergunta que o
   espectador não ouviu. Sai inteiro — o vale em 1,100 é logo depois dele. O "Isso não é agilidade" (5,36→6,30) também saiu, por
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
  duration: 703, // 512 de conteúdo + 191 da marca
  endCard: 512,
  hookEnd: 124, // 4,133 s
  clips: [
    { nome: "gancho", src: "newhair/falado2/clip0.mp4", start: 0, duration: 124 },
    { nome: "definicao", src: "newhair/falado2/clip1.mp4", start: 124, duration: 159 },
    { nome: "solucao", src: "newhair/falado2/clip2.mp4", start: 283, duration: 229 },
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
    { fromFrame: 138, duration: 132, src: "newhair/falado2/apoio_maos.mp4", mode: "band", altura: 500, position: "50% 50%" },
    // "sem danificar nenhuma estrutura" → implante com pinça, movimento fino
    { fromFrame: 383, duration: 120, src: "newhair/falado2/apoio_pinca.mp4", mode: "band", altura: 500, position: "50% 50%" },
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
  { start: 4.30, end: 7.00, lines: [
    { text: "Agilidade vem de", size: 34 },
    { text: "TREINAMENTO E CONSTÂNCIA,", size: 42, gold: true }] },
  { start: 7.05, end: 9.30, lines: [
    { text: "e cuidado com", size: 34 },
    { text: "O FOLÍCULO, PRINCIPALMENTE.", size: 42, gold: true }] },
  { start: 9.60, end: 11.95, lines: [
    { text: "É a velocidade que", size: 34 },
    { text: "NÃO COBRA O PREÇO DO ENXERTO.", size: 42, gold: true }] },
  { start: 12.05, end: 14.50, lines: [
    { text: "É aquela velocidade em que", size: 34 },
    { text: "A GENTE CONSEGUE IR RÁPIDO,", size: 42, gold: true }] },
  { start: 14.55, end: 16.95, lines: [
    { text: "mas sem danificar", size: 34 },
    { text: "NENHUMA ESTRUTURA DO FOLÍCULO.", size: 42, gold: true }] },
];
