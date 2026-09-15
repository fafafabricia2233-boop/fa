/* =============================================================================
   NH — ANTECIPAR É DIFERENTE DE ESPERAR SER PEDIDO
   Fita IMG_1606.MOV, montada em 14/09/2026. Mesma pessoa e mesmo set das duas
   peças anteriores (jaleco vinho, parede lisa).

   A FITA. 4K vertical nativa (2160×3840, rotação 90), HEVC, 60 fps, 57,1 s,
   762 MB. Áudio por leitura de faixa; os quatro cortes puxados direto da URL
   com busca em dois estágios. Sem proxy e sem esticão.

   ─── O TRANSCRITOR CORROMPEU TRÊS PALAVRAS ─────────────────────────────────
   Aqui nenhuma REGIÃO de fala se perdeu — conferido varrendo o envelope da fita
   inteira contra a cobertura do ASR, região por região. O que se perdeu foi
   TEXTO, dentro de trechos que ele anotou:

     "adiantar a" (e mais nada por 3,4 s)  →  "adiantar a MESA ORGANIZADA,
                                               adiantar a PRÓXIMA ETAPA"
     "separar os folhinhos / folíquios"    →  "separar os FOLÍCULOS"
     "para que a cirurgia FUA / FUJA"      →  "para que a cirurgia FLUA"

   Todas resolvidas recortando o trecho e transcrevendo de novo, com e sem
   vocabulário. Regra que já estava escrita e aqui se confirmou pela terceira
   vez: **o JSON da fita inteira não é a transcrição, é um rascunho dela.**

   ⚠ O QUE NÃO SE RESOLVEU: entre "pedir tudo" e "a sua equipe", no gancho, pode
   haver um "ou" — a frase só fecha sentido como pergunta de contraste ("você
   precisa pedir tudo OU a sua equipe antecipa?"). As duas passadas não o
   confirmam e a fala ali é corrida, sem pausa entre as palavras. Por isso o
   TÍTULO não usa o contraste: condensa só a parte certa. Se a dona confirmar o
   "ou", o título vira "VOCÊ PRECISA PEDIR TUDO / OU A EQUIPE ANTECIPA?", que é
   mais forte.

   FONTE POR CORTE (bordas medidas nas duas bandas, larga e >3,5 kHz):
     clip0 gancho    4,68 →  8,41  a pergunta
     clip1 principio 9,42 → 13,35  "Uma cirurgia organizada, a equipe consegue
                                    antecipar o próximo passo do médico"
     clip1b limites 15,18 → 18,35  "sem interromper o médico, sem ultrapassar
                                    os limites."
     clip2 anafora  21,10 → 31,17  "adiantar um processo, adiantar a mesa
                                    organizada, adiantar a próxima etapa,
                                    separar os folículos da melhor forma
                                    possível."
     clip3 fecho    39,52 → 47,79  "A cirurgia é dele, claro, mas você precisa
                                    ter antecipação para que a cirurgia flua da
                                    melhor forma possível."

   ─── A REPETIÇÃO QUE O ASR COSTUROU (corrigido em 15/09) ───────────────────
   A dona ouviu: *"ela repetiu 'sem interromper o médico' 2 vezes, deixe só a
   última fala"*. Estava lá mesmo. Na fita são TRÊS regiões de fala separadas:

     13,40 → 15,00   "sem interromper."                    ← tentativa 1, PARA
     15,26 → 18,35   "sem interromper o médico, sem
                      ultrapassar os limites."             ← tentativa 2, inteira

   Transcritas separadas, as duas passadas mostram as duas tentativas. Transcrito
   o trecho INTEIRO, o modelo funde tudo em "sem interromper o médico, sem
   ultrapassar os limites." — a repetição some do texto. É o mesmo modo de falha
   do gancho da NH_saque, agora no meio da peça.

   **Regra nova:** a varredura de regiões acha onde há fala, mas não basta. Quando
   o texto de um segmento do ASR cobre MAIS DE UMA região separada, transcrever
   cada região sozinha — é aí que a tentativa repetida aparece. Foi exatamente o
   que eu não fiz na v1: vi as três regiões, li o texto costurado e tratei como
   uma frase só.

   FICOU DE FORA: a primeira tentativa acima; "Uma equipe organizada consegue" (18,8→20,7), que repete o
   clip1; "sem que o médico peça tudo, sem que o médico esteja comandando todas
   as etapas" (32,1→38,9), que reafirma a premissa que o gancho já estabelece; e
   o CTA "siga meu perfil" (49,7→55,5), de perfil pessoal e não da clínica —
   mesmo critério da NH_saque. Volta se ela quiser.

   SEM TENSÃO E SEM CLICK: não há bloco de problema separado. O gancho É a
   pergunta e a virada está marcada pelo filme. Igual à NH_velocidade — o §05
   põe o grave na última palavra do problema, e forçá-lo sem problema é
   inventar estrutura.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_ANTECIPA: Plano = {
  fps: 30,
  duration: 1066, // 875 de conteúdo + 191 da marca
  endCard: 875,
  hookEnd: 112, // 3,733 s
  clips: [
    { nome: "gancho", src: "newhair/falado5/clip0.mp4", start: 0, duration: 112 },
    { nome: "principio", src: "newhair/falado5/clip1.mp4", start: 112, duration: 118 },
    { nome: "limites", src: "newhair/falado5/clip1b.mp4", start: 230, duration: 95 },
    { nome: "anafora", src: "newhair/falado5/clip2.mp4", start: 325, duration: 302 },
    { nome: "fecho", src: "newhair/falado5/clip3.mp4", start: 627, duration: 248 },
  ],
  /* Faixa de 680 px: a cabeça dela começa em 580 px neste enquadramento
     (580 ÷ 0,85). Cortadas já em 1080×680 da fonte, que depois da rotação dos
     metadados já é 1080×1920 — recorte puro, sem nenhuma escala. */
  brolls: [
    /* "antecipar o próximo passo" → pinças sendo dispostas em ordem. A faixa
       atravessa de propósito o corte do frame 230, que é onde a tentativa
       repetida foi removida: apoio por cima de emenda é o que a suaviza. */
    { fromFrame: 150, duration: 150, src: "newhair/falado5/apoio_pinca.mp4", mode: "band", altura: 680, position: "50% 50%" },
    // "adiantar a mesa organizada" → a mesa sendo montada, literal
    { fromFrame: 385, duration: 150, src: "newhair/falado5/apoio_mesa.mp4", mode: "band", altura: 680, position: "50% 50%" },
  ],
  title: ["SUA EQUIPE ANTECIPA", "O PRÓXIMO PASSO?"],
  titleShift: 0,
  zoomClip: 4, // o empurrão mora no fecho
  zoomFrame: 20,
  closeClips: [],
};

export const CUES_ANTECIPA: Cue[] = [
  { start: 3.75, end: 5.05, lines: [
    { text: "Uma cirurgia", size: 34 },
    { text: "ORGANIZADA,", size: 42, gold: true }] },
  { start: 5.15, end: 7.45, lines: [
    { text: "a equipe consegue antecipar", size: 34 },
    { text: "O PRÓXIMO PASSO DO MÉDICO,", size: 42, gold: true }] },
  { start: 7.75, end: 9.34, lines: [
    { text: "sem interromper", size: 34 },
    { text: "O MÉDICO,", size: 42, gold: true }] },
  { start: 9.44, end: 10.75, lines: [
    { text: "sem ultrapassar", size: 34 },
    { text: "OS LIMITES.", size: 42, gold: true }] },
  { start: 10.92, end: 12.52, lines: [
    { text: "Adiantar", size: 34 },
    { text: "UM PROCESSO,", size: 42, gold: true }] },
  { start: 13.02, end: 14.77, lines: [
    { text: "adiantar a", size: 34 },
    { text: "MESA ORGANIZADA,", size: 42, gold: true }] },
  { start: 15.94, end: 17.27, lines: [
    { text: "adiantar a", size: 34 },
    { text: "PRÓXIMA ETAPA,", size: 42, gold: true }] },
  { start: 18.50, end: 20.72, lines: [
    { text: "separar os folículos", size: 34 },
    { text: "DA MELHOR FORMA POSSÍVEL.", size: 42, gold: true }] },
  { start: 20.97, end: 22.92, lines: [
    { text: "A cirurgia", size: 34 },
    { text: "É DELE, CLARO,", size: 42, gold: true }] },
  { start: 23.02, end: 26.12, lines: [
    { text: "mas você precisa ter", size: 34 },
    { text: "ANTECIPAÇÃO", size: 42, gold: true }] },
  { start: 26.27, end: 29.02, lines: [
    { text: "para que a cirurgia", size: 34 },
    { text: "FLUA DA MELHOR FORMA POSSÍVEL.", size: 42, gold: true }] },
];
