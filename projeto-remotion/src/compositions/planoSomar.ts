/* =============================================================================
   NH — POR QUE A SUA EQUIPE PRECISA SAIR?
   Fita de 16/09/2026 (1UsTyIr6…), 62,1 s, 4K vertical nativo HEVC a 60 fps.
   Mesma pessoa e mesmo cenário da NH_padraoseguir.

   UMA PEÇA SÓ: pergunta → resposta → convite → CTA.

   FONTE POR CORTE (tempos medidos no envelope):
     clip0 gancho 14,22 → 19,75  "Médico, por que os profissionais da sua
                                  clínica precisam sair quando a equipe
                                  terceirizada chega?"
     clip1 clinica 30,08 → 33,75 "A clínica é sua. Os profissionais da sua
                                  clínica também fazem parte da cirurgia."
     clip2 aprender 34,85 → 39,55 "Se eles querem entrar para aprender, se eles
                                  querem entrar para conhecer o transplante
                                  capilar,"
     clip3 somar  39,75 → 44,32  "a gente fica à vontade para isso. A New Hair
                                  quer somar com sua clínica."
     clip4 cta    54,05 → 60,15  "Se você procura uma equipe que também respeita
                                  os profissionais da sua clínica, clique no
                                  link da bio."

   ÚLTIMAS TENTATIVAS. O gancho tem uma versão abandonada em 6,00 ("Médico, por
   que…" morrendo em 8,08) — fica a de 14,22. O fecho também: em 50,92 ela começa
   "se você procura uma equipe" e para; fica a de 54,05.

   ⚠ CUIDADO NA ENTRADA DO GANCHO. A varredura de regiões marca fala a partir de
   13,65, mas ali é respiração: a voz só ataca em **14,37**. Cortar em 13,65
   abriria a peça com um suspiro. O corte foi pra 14,22, 150 ms antes do /m/.

   FICOU DE FORA DE PROPÓSITO:
   · 21,45 → 28,46 — "A New Hair vem pra somar, então a clínica é sua, a equipe
     é a equipe…", tentativa que ela abandona no meio.
   · 44,60 → 50,44 — "Então se você quer uma equipe que some com a sua clínica,
     a New Hair está aqui para isso." É um FECHO COMPLETO e bom, mas repete a
     construção do clip4 ("se você quer/procura uma equipe que…") e o clip4 é
     que carrega o CTA. Ter os dois seria dizer a mesma coisa duas vezes — pelo
     §02, assunto parecido pode, frase igual não, e aqui a forma é a mesma.

   ANÁFORA PRESERVADA: "se eles querem entrar para aprender, se eles querem
   entrar para conhecer" é recurso dela e fica inteira — o portão marca como
   "anáfora?" e não reprova, porque as duas metades seguem diferente.

   OLHAR: folha de contato a 2 quadros/s nos cinco cortes, nenhuma consulta
   lateral. Portão de gagueira: código 0.

   APOIO EM FAIXA MASCARADA, altura 600 (cabelo começa em 512 px). Os dois vêm
   do mesmo arquivo do banco, mas de trechos visualmente opostos: o começo é a
   mão carregando o implanter em close, o fim é a equipe inteira em volta da
   maca — um serve pra "conhecer o transplante capilar", o outro pra "somar com
   sua clínica".

   COM TENSÃO E CLICK: o gancho É o problema (fecha em "chega?") e a resposta
   entra em "A clínica é sua".
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_SOMAR: Plano = {
  fps: 30,
  duration: 928, // 737 de conteúdo + 191 da marca
  endCard: 737,
  hookEnd: 166, // 5,533 s
  clips: [
    { nome: "gancho", src: "newhair/falado16/clip0.mp4", start: 0, duration: 166 },
    { nome: "clinica", src: "newhair/falado16/clip1.mp4", start: 166, duration: 110 },
    { nome: "aprender", src: "newhair/falado16/clip2.mp4", start: 276, duration: 141 },
    { nome: "somar", src: "newhair/falado16/clip3.mp4", start: 417, duration: 137 },
    { nome: "cta", src: "newhair/falado16/clip4.mp4", start: 554, duration: 183 },
  ],
  brolls: [
    /* "conhecer o transplante capilar" — a mão carregando o implanter, em close */
    { fromFrame: 340, duration: 85, src: "newhair/falado16/apoio_craft.mp4", mode: "band", altura: 600, position: "50% 50%" },
    /* "somar com sua clínica" — a equipe inteira em volta da maca */
    { fromFrame: 480, duration: 80, src: "newhair/falado16/apoio_equipe.mp4", mode: "band", altura: 600, position: "50% 50%" },
  ],
  title: ["POR QUE A SUA EQUIPE", "PRECISA SAIR?"],
  titleShift: 0,
  zoomClip: 3,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_SOMAR: Cue[] = [
  { start: 5.82, end: 7.90, lines: [
    { text: "A clínica é sua,", size: 34 },
    { text: "OS PROFISSIONAIS DA SUA CLÍNICA", size: 42, gold: true }] },
  { start: 7.93, end: 9.30, lines: [
    { text: "também fazem parte", size: 34 },
    { text: "DA CIRURGIA.", size: 42, gold: true }] },
  { start: 9.32, end: 11.18, lines: [
    { text: "Se eles querem entrar", size: 34 },
    { text: "PARA APRENDER,", size: 42, gold: true }] },
  { start: 11.20, end: 13.95, lines: [
    { text: "se eles querem entrar", size: 34 },
    { text: "PARA CONHECER O TRANSPLANTE CAPILAR,", size: 38, gold: true }] },
  { start: 14.15, end: 16.15, lines: [
    { text: "a gente fica", size: 34 },
    { text: "À VONTADE PARA ISSO.", size: 42, gold: true }] },
  { start: 16.20, end: 18.55, lines: [
    { text: "A New Hair quer", size: 34 },
    { text: "SOMAR COM SUA CLÍNICA.", size: 42, gold: true }] },
  { start: 18.66, end: 20.75, lines: [
    { text: "Se você procura uma equipe", size: 34 },
    { text: "QUE TAMBÉM RESPEITA", size: 42, gold: true }] },
  { start: 20.76, end: 22.40, lines: [
    { text: "os profissionais", size: 34 },
    { text: "DA SUA CLÍNICA,", size: 42, gold: true }] },
  { start: 23.10, end: 24.50, lines: [
    { text: "clique", size: 34 },
    { text: "NO LINK DA BIO.", size: 42, gold: true }] },
];
