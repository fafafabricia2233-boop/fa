/* =============================================================================
   NH — ORIENTAR É DIFERENTE DE INTIMIDAR
   Fita "Médicos seu paciente tem medo de falar durante uma cirurgia de horas",
   montada em 14/09/2026.

   A FITA. 4K VERTICAL NATIVA (2160×3840, rotação 90 nos metadados) a 60 fps,
   57 s, 597 MB em HEVC. É a melhor fonte que chegou aqui até hoje — as duas
   peças anteriores vieram de uma cópia comprimida de 480×854. Nada foi baixado
   inteiro: o áudio saiu por leitura de faixa (7 s) e o vídeo virou proxy
   1080×1920 a 30 fps direto da URL. Nenhum esticão: a fita já é 9:16.

   UMA PEÇA SÓ, e isso é conclusão, não preguiça. A regra de 14/09 manda
   perguntar quantas peças inteiras existem na fita. Existe um gancho só ("seu
   paciente precisa ter medo de falar?") e tudo que vem depois é a resposta
   dele: a concessão, a virada, a marca e o fecho. Separar qualquer bloco o
   deixaria sem pergunta pra responder.

   FONTE POR CORTE (tempos conferidos no ENVELOPE, não no JSON do transcritor —
   ver embaixo; os do ASR estavam de 70 a 320 ms atrasados em TODAS as entradas):
     clip0 gancho     8,66 → 13,29  "Médico, seu paciente precisa ficar com medo
                                     de falar durante uma cirurgia de horas?"
     clip1 concessão 14,71 → 20,18  "Claro, existem momentos que ele precisa
                                     ficar mais parado..."
     clip2 virada    20,69 → 28,12  "Mas no decorrer da cirurgia tem momentos
                                     que ele vai poder falar, conversar, perguntar"
     clip3 reforço   31,25 → 33,12  "a gente não impede nada disso."
     clip4 marca     34,13 → 41,83  "Na New Hair a gente preza o conforto do
                                     paciente..."
     clip5 fecho     42,52 → 45,12  "Orientar é diferente de intimidar."

   O GANCHO É A SEGUNDA TENTATIVA. A primeira (2,74 → 8,60) começa gaguejada,
   "Médico, médico, ...", e diz "com medo de falar EM uma cirurgia". A segunda
   sai limpa e diz "DURANTE uma cirurgia". §02: última tentativa completa.

   O QUE FICOU DE FORA, DE PROPÓSITO:
   - "se ele quiser ir ao banheiro, ele vai poder ir ao banheiro" (28,46→31,3):
     repete o banheiro que o clip4 já diz melhor, e ali vem junto com a marca.
   - O CTA "Se você precisa de uma equipe técnica que preza pelo paciente,
     clique no link da bio" (48,94→55,38). Duas razões: vem depois de uma
     gaguejada ("Médico, se você / Se você") e é dito com hesitação — 1,5 s de
     buraco antes de "preza" e outro antes de "clique". E o fecho fica mais
     forte terminando em "Orientar é diferente de intimidar", que é a frase da
     fita. DECISÃO DE EDITOR, não do manual: se a dona quiser o CTA, ele volta.

   APOIO, os dois do banco e os dois conferidos no quadro antes de usar:
   - implantacao.MOV sobre "momentos delicados": equipe trabalhando sob o foco
     cirúrgico, movimento fino, paciente deitado e calmo.
   - CONVERSANDO COM A PACIENTE sobre "falar / conversar / perguntar": paciente
     na cadeira, falando e gesticulando com a técnica. É a prova literal da
     fala. O relógio de parede no quadro marca a hora passando, o que casa com
     "cirurgia de horas".
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_MEDO: Plano = {
  fps: 30,
  duration: 1082, // 891 de conteúdo + 191 da marca
  endCard: 891,
  hookEnd: 139, // 4,633 s
  clips: [
    { nome: "gancho", src: "newhair/falado3/clip0.mp4", start: 0, duration: 139 },
    { nome: "concessao", src: "newhair/falado3/clip1.mp4", start: 139, duration: 164 },
    { nome: "virada", src: "newhair/falado3/clip2.mp4", start: 303, duration: 223 },
    { nome: "reforco", src: "newhair/falado3/clip3.mp4", start: 526, duration: 56 },
    { nome: "marca", src: "newhair/falado3/clip4.mp4", start: 582, duration: 231 },
    { nome: "fecho", src: "newhair/falado3/clip5.mp4", start: 813, duration: 78 },
  ],
  /* Faixa mascarada com ALTURA MEDIDA: o cabelo dela começa em 419 px, e a
     máscara tem que dissolver no topo da cabeça (cabeça a ~85% da faixa), então
     490. Ninguém é empurrado — vídeo na tela toda, ordem de 14/09. */
  brolls: [
    { fromFrame: 155, duration: 145, src: "newhair/falado3/apoio_delicado.mp4", mode: "band", altura: 490, position: "50% 45%" },
    { fromFrame: 379, duration: 145, src: "newhair/falado3/apoio_conversa.mp4", mode: "band", altura: 490, position: "50% 40%" },
  ],
  /* Condensação fiel do gancho falado, sem o vocativo — o §03 autoriza condensar
     e proíbe inventar. 20 e 18 caracteres, cabem nos 880 px úteis. */
  title: ["SEU PACIENTE PRECISA", "TER MEDO DE FALAR?"],
  titleShift: 0,
  zoomClip: 5, // o empurrão de câmera mora na frase de impacto, não no meio
  zoomFrame: 8,
  closeClips: [],
};

/* Rodapé vazio enquanto o gancho é falado (§04). Daí em diante, uma linha de
   contexto em off-white e uma de sentido em caixa alta dourada. */
export const CUES_MEDO: Cue[] = [
  { start: 4.76, end: 7.90, lines: [
    { text: "Claro, existem momentos", size: 34 },
    { text: "QUE ELE PRECISA FICAR PARADO,", size: 42, gold: true }] },
  { start: 7.96, end: 10.05, lines: [
    { text: "que são momentos", size: 34 },
    { text: "DELICADOS DA CIRURGIA.", size: 42, gold: true }] },
  { start: 10.25, end: 11.90, lines: [
    { text: "Mas no decorrer da cirurgia", size: 34 },
    { text: "TEM MOMENTOS", size: 42, gold: true }] },
  { start: 11.99, end: 13.45, lines: [
    { text: "que ele vai", size: 34 },
    { text: "PODER FALAR,", size: 42, gold: true }] },
  { start: 13.59, end: 15.35, lines: [
    { text: "vai poder", size: 34 },
    { text: "CONVERSAR COM A EQUIPE,", size: 42, gold: true }] },
  { start: 15.49, end: 17.35, lines: [
    { text: "vai poder", size: 34 },
    { text: "PERGUNTAR.", size: 42, gold: true }] },
  { start: 17.68, end: 19.35, lines: [
    { text: "A gente", size: 34 },
    { text: "NÃO IMPEDE NADA DISSO.", size: 42, gold: true }] },
  { start: 19.61, end: 22.45, lines: [
    { text: "Na New Hair a gente preza", size: 34 },
    { text: "O CONFORTO DO PACIENTE.", size: 42, gold: true }] },
  { start: 22.71, end: 25.25, lines: [
    { text: "Então ele pode falar,", size: 34 },
    { text: "PODE IR AO BANHEIRO", size: 42, gold: true }] },
  { start: 25.33, end: 27.00, lines: [
    { text: "quantas vezes", size: 34 },
    { text: "FOR NECESSÁRIO.", size: 42, gold: true }] },
  { start: 27.18, end: 29.55, lines: [
    { text: "Orientar é diferente", size: 34 },
    { text: "DE INTIMIDAR.", size: 42, gold: true }] },
];
