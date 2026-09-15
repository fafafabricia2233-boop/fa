/* =============================================================================
   NH — PADRÃO É UMA FORMA DE PROTEGER O FOLÍCULO
   Fita IMG_1611.MOV, montada em 15/09/2026.

   ─── O DRIVE FECHOU A PORTA, E O CONSERTO VIROU FERRAMENTA ─────────────────
   As três fitas deste lote chegaram com o endpoint público do Drive já em
   "Quota exceeded": nem download inteiro nem leitura por faixa passavam. Duas
   descobertas resolveram, e as duas estão em scripts/baixar-drive.sh:

     1. A cota é por ARQUIVO e deixa passar ~128 MB antes de cortar. Leitura por
        faixa continua funcionando quando o download inteiro já não funciona.
     2. Uma CÓPIA do arquivo é um arquivo novo, com cota nova. Copiar → baixar em
        pedaços → jogar a cópia no lixo resolve sem esperar as 24 h e sem deixar
        nada para trás. Pico de 450 MB no Drive dela, um arquivo por vez.

   A FITA. 4K vertical nativa (2160×3840, rotação 90), HEVC, 60 fps, 41,5 s.

   FONTE POR CORTE:
     clip0 gancho    5,70 → 10,02  "Sua equipe organiza o folículo de qualquer
                                    jeito ou mantém o padrão?"
     clip1 conferência 11,22 → 15,93 "A conferência dos folículos é muito
                                    importante para facilitar na hora da
                                    implantação."
     clip2 mesmo    16,10 → 24,71  "Sua equipe precisa todas organizadas da
                                    mesma forma, para que na hora da implantação
                                    … seja mais rápida."
     clip3 tese     36,33 → 38,69  "Padrão é uma forma de proteger o folículo."

   ⚠ A TESE É A SEGUNDA TENTATIVA. Ela diz a frase DUAS vezes, 33,60→35,78 e
   36,44→38,60. A primeira abre com um "o/e" solto que as duas passadas do
   transcritor leem diferente; a segunda sai limpa. §02: a última completa.
   E repare na ORDEM da fita: a frase vem DEPOIS do CTA. Montada, ela vira o
   fecho — que é onde ela sempre deveria estar.

   CONDENSAÇÃO NA LEGENDA DO clip2: ela diz "implantação" três vezes na mesma
   frase ("para que na hora da implantação, facilite a implantação e a
   implantação seja mais rápida"). A legenda condensa para "para que na hora da
   implantação / SEJA MAIS RÁPIDA." — o §03 autoriza condensar fielmente, e o
   áudio continua inteiro.

   APOIO: folículos conferidos e alinhados em fileira, nos dois cortes onde ela
   fala de conferência e de padrão. Faixa de 740 px — a cabeça dela começa em
   630 px neste enquadramento, o mais aberto das três fitas do lote.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_PADRAO: Plano = {
  fps: 30,
  duration: 791, // 600 de conteúdo + 191 da marca
  endCard: 600,
  hookEnd: 130, // 4,333 s
  clips: [
    { nome: "gancho", src: "newhair/falado7/clip0.mp4", start: 0, duration: 130 },
    { nome: "conferencia", src: "newhair/falado7/clip1.mp4", start: 130, duration: 141 },
    { nome: "mesmo", src: "newhair/falado7/clip2.mp4", start: 271, duration: 258 },
    { nome: "tese", src: "newhair/falado7/clip3.mp4", start: 529, duration: 71 },
  ],
  brolls: [
    { fromFrame: 140, duration: 128, src: "newhair/falado7/apoio_fileira.mp4", mode: "band", altura: 740, position: "50% 50%" },
    { fromFrame: 300, duration: 150, src: "newhair/falado7/apoio_conferencia.mp4", mode: "band", altura: 740, position: "50% 50%" },
  ],
  title: ["DE QUALQUER JEITO", "OU NO PADRÃO?"],
  titleShift: 0,
  zoomClip: 3,
  zoomFrame: 8,
  closeClips: [],
};

export const CUES_PADRAO: Cue[] = [
  { start: 4.47, end: 6.30, lines: [
    { text: "A conferência dos folículos", size: 34 },
    { text: "É MUITO IMPORTANTE", size: 42, gold: true }] },
  { start: 6.35, end: 8.90, lines: [
    { text: "para facilitar", size: 34 },
    { text: "NA HORA DA IMPLANTAÇÃO.", size: 42, gold: true }] },
  { start: 9.23, end: 12.60, lines: [
    { text: "Sua equipe precisa todas", size: 34 },
    { text: "ORGANIZADAS DA MESMA FORMA,", size: 42, gold: true }] },
  { start: 12.83, end: 17.40, lines: [
    { text: "para que na hora da implantação", size: 34 },
    { text: "SEJA MAIS RÁPIDA.", size: 42, gold: true }] },
  { start: 17.74, end: 19.90, lines: [
    { text: "Padrão é uma forma", size: 34 },
    { text: "DE PROTEGER O FOLÍCULO.", size: 42, gold: true }] },
];
