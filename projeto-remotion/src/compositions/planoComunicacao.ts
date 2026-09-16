/* =============================================================================
   NH — COMUNICAÇÃO É O QUE FAZ A CIRURGIA FLUIR
   Fita IMG_1603.MOV, montada em 15/09/2026. Mesma pessoa e mesmo set das peças
   NH_saque e NH_antecipa.

   A FITA. 4K vertical nativa (2160×3840, rotação 90), HEVC, 60 fps, 43,0 s,
   450 MB. Baixada INTEIRA, em pedaços de 32 MB — ver o percalço no comentário
   da peça irmã (planoPadrao.ts) e em scripts/baixar-drive.sh.

   ⚠ v2 (16/09/2026) — O FECHO ABRIA NO MEIO DE "PRECISA". A auditoria do
   catálogo inteiro, feita depois que a dona pegou "cirurgia" comida na NH_somar,
   reprovou este corte: entrada com 0 ms de ar. Medido na fita, o corte de 27,71
   caía DENTRO da palavra — "precisa" começa em 27,54 — e o transcritor
   reconstruía um "você" que não estava inteiro ali.

   A v1 tinha tentado consertar a gagueira "você VOCÊ precisa" cortando depois
   dela, em 27,71. O erro foi confiar num vale que o `bordas.py` da época
   apontava com piso de ruído medido dentro da janela. Existe silêncio de
   verdade em 26,76 → 27,31, antes de tudo: o corte foi pra **27,14**, e o fecho
   passou a abrir em "Você precisa estar atento", com o /p/ e o "você" inteiros.
   De quebra a anáfora dela fica com os quatro tempos completos.

   FONTE POR CORTE (bordas medidas nas duas bandas):
     clip0 gancho   2,80 →  6,58  "Na sua cirurgia, você precisa orientar a
                                   equipe várias vezes?"
     clip1 princípio 8,21 → 14,23 "Eu aprendi que ao longo da cirurgia existe
                                   comunicação, é preciso ter comunicação."
     clip2 anáfora  15,00 → 26,80 "Você precisa comunicar ao médico qualquer
                                   intercorrência que aconteça, você precisa
                                   estar de olho em qualquer coisa que aconteça
                                   durante a cirurgia, de olho no paciente, de
                                   olho no monitor,"
     clip3 fecho    27,14 → 33,94 "Você precisa estar atento a qualquer detalhe da
                                   cirurgia e, com isso, facilita o fluxo da
                                   cirurgia."

   ⚠ O FECHO COMEÇA EM "PRECISA", E ISSO CUSTOU DUAS TENTATIVAS. Ela diz "você
   VOCÊ precisa": o primeiro "você" vai de 27,32 a 27,50, o segundo de 27,54 a
   27,72, e entre eles há UM frame de vale. Cortar ali (27,53) abriu o plano no
   meio da vogal do segundo "você" — medido na abertura do corte, a energia já
   entrava em 2 barras subindo, sem o ataque do "v", e o transcritor nem ouviu a
   palavra. Palavras coladas não têm corte limpo entre elas: ou entra a gagueira
   inteira, ou se começa DEPOIS dela. Começando em 27,71, o /p/ de "precisa" tem
   o ataque inteiro e a frase fica "Precisa estar atento…", que é português
   corrente com o sujeito implícito — e emenda bem no "de olho no monitor," que
   vem antes.

   FICOU DE FORA: o CTA "siga o meu perfil" (34,7→41,4), de perfil pessoal e não
   da clínica — mesmo critério das peças anteriores.

   SEM TENSÃO E SEM CLICK: não há bloco de problema. O gancho é a pergunta, a
   virada está marcada pelo filme, e a peça inteira é resposta.

   APOIO: a dupla trabalhando sob o foco cirúrgico, sobre a anáfora do "estar de
   olho". Faixa de 600 px — a cabeça dela começa em 510 px neste enquadramento.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_COMUNICACAO: Plano = {
  fps: 30,
  duration: 1043, // 852 de conteúdo + 191 da marca
  endCard: 852,
  hookEnd: 113, // 3,767 s
  clips: [
    { nome: "gancho", src: "newhair/falado6/clip0.mp4", start: 0, duration: 113 },
    { nome: "principio", src: "newhair/falado6/clip1.mp4", start: 113, duration: 181 },
    { nome: "anafora", src: "newhair/falado6/clip2.mp4", start: 294, duration: 354 },
    { nome: "fecho", src: "newhair/falado6/clip3.mp4", start: 648, duration: 204 },
  ],
  brolls: [
    { fromFrame: 495, duration: 150, src: "newhair/falado6/apoio_dupla.mp4", mode: "band", altura: 600, position: "50% 50%" },
  ],
  title: ["PRECISA ORIENTAR A EQUIPE", "VÁRIAS VEZES?"],
  titleShift: 0,
  zoomClip: 3,
  zoomFrame: 15,
  closeClips: [],
};

export const CUES_COMUNICACAO: Cue[] = [
  { start: 3.74, end: 6.20, lines: [
    { text: "Eu aprendi que", size: 34 },
    { text: "AO LONGO DA CIRURGIA", size: 42, gold: true }] },
  { start: 6.28, end: 9.40, lines: [
    { text: "existe comunicação,", size: 34 },
    { text: "É PRECISO TER COMUNICAÇÃO.", size: 42, gold: true }] },
  { start: 9.90, end: 11.35, lines: [
    { text: "Você precisa", size: 34 },
    { text: "COMUNICAR AO MÉDICO", size: 42, gold: true }] },
  { start: 11.40, end: 13.55, lines: [
    { text: "qualquer intercorrência", size: 34 },
    { text: "QUE ACONTEÇA.", size: 42, gold: true }] },
  { start: 13.66, end: 17.45, lines: [
    { text: "Você precisa estar de olho", size: 34 },
    { text: "EM QUALQUER COISA QUE ACONTEÇA", size: 42, gold: true }] },
  { start: 17.54, end: 19.25, lines: [
    { text: "você precisa estar", size: 34 },
    { text: "DE OLHO NO PACIENTE,", size: 42, gold: true }] },
  { start: 19.32, end: 21.30, lines: [
    { text: "você precisa estar", size: 34 },
    { text: "DE OLHO NO MONITOR.", size: 42, gold: true }] },
  { start: 21.74, end: 24.95, lines: [
    { text: "Você precisa estar atento", size: 34 },
    { text: "A QUALQUER DETALHE DA CIRURGIA", size: 42, gold: true }] },
  { start: 25.20, end: 28.35, lines: [
    { text: "e, com isso,", size: 34 },
    { text: "FACILITA O FLUXO DA CIRURGIA.", size: 42, gold: true }] },
];
