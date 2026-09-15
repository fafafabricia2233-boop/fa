/* =============================================================================
   NH — QUEM SE ADAPTA A QUEM
   Segunda peça da mesma fita da planoIguais.ts (1T6dlcwq…), 15/09/2026.
   Nenhuma frase se repete entre as duas.

   ORDEM INVERTIDA DE PROPÓSITO. Na fita, a pergunta vem no FIM (183 s) e o
   "não engessar" vem antes (156 s). Montada, a pergunta abre — o §02 autoriza
   abrir pelo gancho mais forte esteja ele onde estiver, e foi o mesmo caso da
   NH_agilidade.

   FONTE POR CORTE:
     clip0 gancho 182,96 → 187,35  "Por que no final você concorda que não é o
                                    médico que tem que se adaptar à equipe?"
     clip1 tese   156,20 → 167,55  "Mas nós não tentamos engessar a cirurgia no
                                    médico. A nossa função é entender como o
                                    médico trabalha e principalmente tentar nos
                                    adequar da melhor maneira possível ao estilo
                                    dele."
     clip2 fecho  191,45 → 194,95  "É a equipe que tem que aprender a trabalhar
                                    da melhor maneira com o médico."

   O GANCHO E O FECHO SÃO ÚLTIMAS TENTATIVAS. A pergunta tem uma versão
   interrompida antes (178,42→183,04, "não é a equipe que tem que…" — e repare
   que ali ela troca os papéis, o que confirma que a boa é a segunda). O fecho
   é dito duas vezes seguidas (187,50 e 191,52); fica o segundo.

   SEM TENSÃO E SEM CLICK, como a irmã: o gancho é a pergunta e a virada está
   no filme.

   APOIO: a dupla trabalhando sob o foco, sobre "entender como o médico
   trabalha". Faixa de 570 px.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_ADAPTA: Plano = {
  fps: 30,
  duration: 768, // 577 de conteúdo + 191 da marca
  endCard: 577,
  hookEnd: 132, // 4,400 s
  clips: [
    { nome: "gancho", src: "newhair/falado10/clip0.mp4", start: 0, duration: 132 },
    { nome: "tese", src: "newhair/falado10/clip1.mp4", start: 132, duration: 341 },
    { nome: "fecho", src: "newhair/falado10/clip2.mp4", start: 473, duration: 104 },
  ],
  brolls: [
    { fromFrame: 250, duration: 130, src: "newhair/falado10/apoio_dupla.mp4", mode: "band", altura: 570, position: "50% 50%" },
  ],
  title: ["O MÉDICO SE ADAPTA", "À EQUIPE?"],
  titleShift: 0,
  zoomClip: 2,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_ADAPTA: Cue[] = [
  { start: 4.45, end: 7.50, lines: [
    { text: "Mas nós não tentamos", size: 34 },
    { text: "ENGESSAR A CIRURGIA NO MÉDICO.", size: 42, gold: true }] },
  { start: 8.08, end: 10.30, lines: [
    { text: "A nossa função é entender", size: 34 },
    { text: "COMO O MÉDICO TRABALHA", size: 42, gold: true }] },
  { start: 10.78, end: 13.10, lines: [
    { text: "e principalmente tentar", size: 34 },
    { text: "NOS ADEQUAR", size: 42, gold: true }] },
  { start: 13.14, end: 15.70, lines: [
    { text: "da melhor maneira possível", size: 34 },
    { text: "AO ESTILO DELE.", size: 42, gold: true }] },
  { start: 15.84, end: 17.70, lines: [
    { text: "É a equipe", size: 34 },
    { text: "QUE TEM QUE APRENDER", size: 42, gold: true }] },
  { start: 17.75, end: 19.20, lines: [
    { text: "a trabalhar da melhor maneira", size: 34 },
    { text: "COM O MÉDICO.", size: 42, gold: true }] },
];
