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
     clip1 protoc 136,24 → 143,50  "É claro que nós temos nosso padrão e nosso
                                    protocolo, temos o protocolo de viabilidade
                                    folicular, tomamos cuidados durante toda a
                                    cirurgia."
     clip2 tese   156,20 → 167,55  "Mas nós não tentamos engessar a cirurgia no
                                    médico. A nossa função é entender como o
                                    médico trabalha e principalmente tentar nos
                                    adequar da melhor maneira possível ao estilo
                                    dele."
     clip3 fecho  191,45 → 194,95  "É a equipe que tem que aprender a trabalhar
                                    da melhor maneira com o médico."

   O GANCHO E O FECHO SÃO ÚLTIMAS TENTATIVAS. A pergunta tem uma versão
   interrompida antes (178,42→183,04, "não é a equipe que tem que…" — e repare
   que ali ela troca os papéis, o que confirma que a boa é a segunda). O fecho
   é dito duas vezes seguidas (187,50 e 191,52); fica o segundo.

   ⚠ O BLOCO DOS PROTOCOLOS ENTROU DEPOIS, E CORRIGE UM ERRO MEU. Na v1 eu dei o
   trecho por imprestável: o transcritor da fita inteira escreveu "viabilidade
   CURRICULAR" e "tomamos CUIDAR", e eu li isso como fala embolada. Não era —
   reanalisado o trecho isolado, as duas passadas devolvem **"viabilidade
   FOLICULAR"** e **"tomamos CUIDADOS"**, que é o que faz sentido. Era erro do
   ASR, não dela.

   E o lugar dele é exatamente aqui: sem essa concessão, o "MAS nós não tentamos
   engessar a cirurgia no médico" do clip2 não tinha com o que contrastar. Agora
   a peça faz o movimento inteiro — temos padrão, MAS não engessamos.

   SEM TENSÃO E SEM CLICK, como a irmã: o gancho é a pergunta e a virada está
   no filme.

   APOIO: a dupla trabalhando sob o foco, sobre "entender como o médico
   trabalha". Faixa de 570 px.
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_ADAPTA: Plano = {
  fps: 30,
  duration: 986, // 795 de conteúdo + 191 da marca
  endCard: 795,
  hookEnd: 132, // 4,400 s
  clips: [
    { nome: "gancho", src: "newhair/falado10/clip0.mp4", start: 0, duration: 132 },
    { nome: "protocolos", src: "newhair/falado10/clip0b.mp4", start: 132, duration: 218 },
    { nome: "tese", src: "newhair/falado10/clip1.mp4", start: 350, duration: 341 },
    { nome: "fecho", src: "newhair/falado10/clip2.mp4", start: 691, duration: 104 },
  ],
  brolls: [
    { fromFrame: 470, duration: 130, src: "newhair/falado10/apoio_dupla.mp4", mode: "band", altura: 570, position: "50% 50%" },
  ],
  title: ["O MÉDICO SE ADAPTA", "À EQUIPE?"],
  titleShift: 0,
  zoomClip: 3,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_ADAPTA: Cue[] = [
  { start: 4.46, end: 6.90, lines: [
    { text: "É claro que nós temos", size: 34 },
    { text: "NOSSO PADRÃO E NOSSO PROTOCOLO,", size: 42, gold: true }] },
  { start: 7.20, end: 9.40, lines: [
    { text: "temos o protocolo", size: 34 },
    { text: "DE VIABILIDADE FOLICULAR,", size: 42, gold: true }] },
  { start: 9.50, end: 11.55, lines: [
    { text: "tomamos cuidados", size: 34 },
    { text: "DURANTE TODA A CIRURGIA.", size: 42, gold: true }] },
  { start: 11.70, end: 14.95, lines: [
    { text: "Mas nós não tentamos", size: 34 },
    { text: "ENGESSAR A CIRURGIA NO MÉDICO.", size: 42, gold: true }] },
  { start: 15.35, end: 17.75, lines: [
    { text: "A nossa função é entender", size: 34 },
    { text: "COMO O MÉDICO TRABALHA", size: 42, gold: true }] },
  { start: 18.05, end: 20.35, lines: [
    { text: "e principalmente tentar", size: 34 },
    { text: "NOS ADEQUAR", size: 42, gold: true }] },
  { start: 20.41, end: 23.02, lines: [
    { text: "da melhor maneira possível", size: 34 },
    { text: "AO ESTILO DELE.", size: 42, gold: true }] },
  { start: 23.10, end: 24.95, lines: [
    { text: "É a equipe", size: 34 },
    { text: "QUE TEM QUE APRENDER", size: 42, gold: true }] },
  { start: 25.00, end: 26.40, lines: [
    { text: "a trabalhar da melhor maneira", size: 34 },
    { text: "COM O MÉDICO.", size: 42, gold: true }] },
];
