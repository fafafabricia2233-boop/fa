/* =============================================================================
   NH — O CUIDADO COM O FOLÍCULO COMEÇA NO SAQUE
   Fita IMG_1607.MOV, montada em 14/09/2026.

   A FITA. 4K vertical nativa (2160×3840, rotação 90), HEVC, 60 fps, 75,3 s,
   **789 MB**. Nada foi baixado inteiro: áudio por leitura de faixa (13 s) e os
   três cortes puxados direto da URL com busca em dois estágios — 39 s por
   corte, contra ~6 min de um proxy completo. Sem esticão: a fita já é 9:16.

   UMA PEÇA SÓ: existe um gancho e tudo depois é a resposta dele.

   ─── O GANCHO QUE O TRANSCRITOR ESCONDEU ───────────────────────────────────
   O transcritor devolveu UM segmento de 13,22 a 22,82 com a frase inteira. Era
   mentira: entre "tratado" (16,4) e "com cuidado" (19,7) ele marcou silêncio, e
   o envelope mostrava FALA ali. Reanalisado o trecho isolado, com e sem
   vocabulário, o mesmo resultado nas duas passadas e 0,99 de confiança em quase
   toda palavra:

     13,22 → ~16,9   tentativa 1, ela para depois de "tratado"
     17,15 → 21,93   TENTATIVA 2, INTEIRA E FLUIDA  ← é esta
     (o ASR fundiu as duas e apagou o começo da segunda)

   Sem a conferência no envelope, o gancho teria sido montado da tentativa
   quebrada, com um buraco de 3 s no meio ou um corte no meio da frase. §02:
   "a última tentativa completa costuma ser a boa" — mas quem acha ela é a
   medição, não o JSON.

   FONTE POR CORTE (bordas medidas no envelope):
     clip0 gancho  17,10 → 22,20  "Sua equipe sabe que o folículo precisa ser
                                   tratado com cuidado desde o momento do saque?"
     clip1 bloco   31,15 → 44,85  "É muito importante ter cuidado com o folículo,
                                   ele não pode ser desidratado, não pode haver
                                   compressão, não pode haver queda, tem que ter
                                   maior cuidado porque qualquer coisa ele pode
                                   sofrer danos e não ser viável mais."
     clip2 tese    58,12 → 64,95  "ter todo o cuidado com o enxerto até a
                                   implantação para que ele possa ser implantado
                                   de forma viável."

   ZERO CORTE INTERNO. As três tomadas são contínuas — foi por isso que o bloco
   escolhido foi o de 31,15, e não o resumo de 24,16 ("não pode apertar o
   folículo, fazer compressão, desidratar"): o de 31,15 é a versão completa,
   é a última, e corre sem hesitação. O §02 manda tirar redundância, e aqui a
   redundância é o resumo.

   FICOU DE FORA: o resumo de 24,16 (acima); "para se revivir" (45,1→45,7, o ASR
   deu 0,40 de confiança e a palavra não existe em português); o trecho de 46,5
   a 57,6, que diz a mesma tese do clip2 mas com buracos de 2 a 3 s entre as
   palavras; e o CTA "segue o meu perfil" (65,6→73,7) — é CTA de perfil pessoal,
   não da clínica, e as peças da New Hair fecham na marca. Volta se ela quiser.

   ⚠ UMA PALAVRA POR CONFIRMAR: em "não pode haver ___" o transcritor escreve
   "compreensão" e MANTEVE isso mesmo com "compressão" no vocabulário. Na lista
   (desidratado / ___ / queda), e logo depois de ela dizer "não pode apertar o
   folículo", só "compressão" fecha sentido — é o que está na legenda. Sem
   escuta perceptual aqui: confirmar por ouvido.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_SAQUE: Plano = {
  fps: 30,
  duration: 960, // 769 de conteúdo + 191 da marca
  endCard: 769,
  hookEnd: 153, // 5,10 s
  clips: [
    { nome: "gancho", src: "newhair/falado4/clip0.mp4", start: 0, duration: 153 },
    { nome: "bloco", src: "newhair/falado4/clip1.mp4", start: 153, duration: 411 },
    { nome: "tese", src: "newhair/falado4/clip2.mp4", start: 564, duration: 205 },
  ],
  /* Faixa de 800 px — o dobro das peças anteriores, e medida igual: o
     enquadramento aqui é bem mais aberto e a cabeça dela só começa em 690 px.
     Os dois apoios foram cortados já em 1080×800, com recorte 27:20 da fonte
     vertical, então nada é esticado nem desperdiçado fora da faixa. */
  brolls: [
    // "não pode ser desidratado" → folículos na cuba de hidratação
    { fromFrame: 250, duration: 79, src: "newhair/falado4/apoio_hidrata.mp4", mode: "band", altura: 800, position: "50% 50%" },
    // "cuidado com o enxerto até a implantação" → carregamento do implanter
    { fromFrame: 600, duration: 150, src: "newhair/falado4/apoio_implante.mp4", mode: "band", altura: 800, position: "50% 50%" },
  ],
  title: ["SUA EQUIPE CUIDA DO FOLÍCULO", "DESDE O SAQUE?"],
  titleShift: 0,
  zoomClip: 2, // o empurrão mora na tese, que é onde a peça conclui
  zoomFrame: 20,
  closeClips: [],
};

export const CUES_SAQUE: Cue[] = [
  { start: 5.63, end: 7.75, lines: [
    { text: "É muito importante", size: 34 },
    { text: "TER CUIDADO COM O FOLÍCULO,", size: 42, gold: true }] },
  { start: 7.79, end: 9.25, lines: [
    { text: "ele não pode ser", size: 34 },
    { text: "DESIDRATADO,", size: 42, gold: true }] },
  { start: 9.31, end: 10.85, lines: [
    { text: "não pode haver", size: 34 },
    { text: "COMPRESSÃO,", size: 42, gold: true }] },
  { start: 11.09, end: 12.45, lines: [
    { text: "não pode haver", size: 34 },
    { text: "QUEDA,", size: 42, gold: true }] },
  { start: 12.71, end: 13.85, lines: [
    { text: "tem que ter", size: 34 },
    { text: "MAIOR CUIDADO", size: 42, gold: true }] },
  { start: 13.89, end: 16.85, lines: [
    { text: "porque qualquer coisa", size: 34 },
    { text: "ELE PODE SOFRER DANOS", size: 42, gold: true }] },
  { start: 16.95, end: 18.75, lines: [
    { text: "e não ser", size: 34 },
    { text: "VIÁVEL MAIS.", size: 42, gold: true }] },
  { start: 19.10, end: 20.48, lines: [
    { text: "Ter todo o cuidado", size: 34 },
    { text: "COM O ENXERTO", size: 42, gold: true }] },
  { start: 20.54, end: 21.68, lines: [
    { text: "até a", size: 34 },
    { text: "IMPLANTAÇÃO,", size: 42, gold: true }] },
  { start: 21.78, end: 25.50, lines: [
    { text: "para que ele possa ser", size: 34 },
    { text: "IMPLANTADO DE FORMA VIÁVEL.", size: 42, gold: true }] },
];
