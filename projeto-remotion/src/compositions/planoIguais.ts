/* =============================================================================
   NH — ATENDEMOS VÁRIOS MÉDICOS, E NENHUM IGUAL
   Fita "Nos atendemos vários médicos e não atendemos da mesma forma"
   (1T6dlcwq…), montada em 15/09/2026.

   ─── ESTA FITA É UM CADERNO DE TOMADAS ─────────────────────────────────────
   196 segundos — quase 5× as outras do lote — e não é uma fala corrida: é ela
   ensaiando. O gancho aparece OITO vezes entre 0 e 65 s, em versões diferentes
   ("não atende todos iguais" / "não trabalhamos com todos iguais" / "não
   trabalha com todos igual" / duas interrompidas). §02: vale a última tentativa
   completa, que está em 59,78 — e é também a mais bem dita.

   DUAS PEÇAS, e isso é conclusão. A regra de 14/09 manda perguntar quantas peças
   inteiras existem. Existem dois ganchos de verdade nesta fita:
     • "não trabalhamos iguais com todos"  → esta peça
     • "não é o médico que tem que se adaptar à equipe?" → planoAdapta.ts
   Cada um tem desenvolvimento e fecho próprios, e nenhuma frase se repete entre
   as duas.

   FONTE POR CORTE (bordas lidas no envelope — o piso desta fita não deixou a
   detecção automática fechar, então foi no desenho):
     clip0 gancho  59,88 →  64,92  "Nós trabalhamos com vários médicos, é
                                    justamente por isso que nós não trabalhamos
                                    iguais com todos."
     clip1 anáfora 79,98 →  86,35  "Cada médico tem o seu jeito, cada médico tem
                                    a forma com que gosta de montar a mesa, de
                                    conduzir a cirurgia,"
     clip2 erro   107,05 → 113,85  "E o maior erro do mundo seria eu chegar na
                                    clínica dele querendo impor padrão que
                                    funciona com outro profissional."

   ⚠ A TERCEIRA BATIDA DA ANÁFORA FICOU DE FORA, e por um buraco: ela diz "cada"
   em 88,76 e só retoma "médico tem a sua forma de trabalhar com a nossa equipe"
   em 94,02 — **5,3 segundos de hesitação no meio da frase**. Emendar exigiria um
   corte dentro da locução, e a anáfora já fica de pé com duas batidas. O que se
   perde é a menção à equipe; o que se ganha é a frase correndo.

   FICOU DE FORA TAMBÉM o bloco dos protocolos (125→143 s): a primeira tentativa
   termina em "temos todo…" e a segunda sai embolada ("viabilidade curricular",
   "tomamos cuidar"). Nenhuma das duas está publicável, e o argumento fecha sem
   ela. Se a dona quiser esse trecho, vale regravar a frase.

   SEM TENSÃO E SEM CLICK: o gancho é a afirmação-paradoxo e a virada está
   marcada pelo filme; não há bloco de problema separado.

   APOIO: a mesa cirúrgica sendo montada, exatamente sobre "gosta de montar a
   mesa". Faixa de 570 px — a cabeça dela começa em 490 px nesta fita.

   NOTA: esta fita é da OUTRA pessoa (touca, máscara e lupa), a mesma das peças
   NH_agilidade e NH_velocidade — não a de jaleco vinho das últimas cinco. E a
   imagem continua espelhada, com a logo do jaleco lida ao contrário: pendência
   antiga, registrada em CONTINUIDADE.md e não resolvida aqui.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_IGUAIS: Plano = {
  fps: 30,
  duration: 737, // 546 de conteúdo + 191 da marca
  endCard: 546,
  hookEnd: 151, // 5,033 s
  clips: [
    { nome: "gancho", src: "newhair/falado9/clip0.mp4", start: 0, duration: 151 },
    { nome: "anafora", src: "newhair/falado9/clip1.mp4", start: 151, duration: 191 },
    { nome: "erro", src: "newhair/falado9/clip2.mp4", start: 342, duration: 204 },
  ],
  brolls: [
    { fromFrame: 225, duration: 115, src: "newhair/falado9/apoio_mesa.mp4", mode: "band", altura: 570, position: "50% 50%" },
  ],
  title: ["ATENDEMOS VÁRIOS MÉDICOS", "E NENHUM IGUAL."],
  titleShift: 0,
  zoomClip: 2,
  zoomFrame: 20,
  closeClips: [],
};

export const CUES_IGUAIS: Cue[] = [
  { start: 5.11, end: 6.70, lines: [
    { text: "Cada médico tem", size: 34 },
    { text: "O SEU JEITO,", size: 42, gold: true }] },
  { start: 6.75, end: 8.20, lines: [
    { text: "cada médico tem", size: 34 },
    { text: "A FORMA COM QUE", size: 42, gold: true }] },
  { start: 8.23, end: 11.00, lines: [
    { text: "gosta de montar a mesa,", size: 34 },
    { text: "DE CONDUZIR A CIRURGIA.", size: 42, gold: true }] },
  { start: 11.54, end: 13.35, lines: [
    { text: "E o maior erro do mundo", size: 34 },
    { text: "SERIA EU CHEGAR", size: 42, gold: true }] },
  { start: 13.40, end: 15.50, lines: [
    { text: "na clínica dele", size: 34 },
    { text: "QUERENDO IMPOR", size: 42, gold: true }] },
  { start: 15.58, end: 18.10, lines: [
    { text: "padrão que funciona", size: 34 },
    { text: "COM OUTRO PROFISSIONAL.", size: 42, gold: true }] },
];
