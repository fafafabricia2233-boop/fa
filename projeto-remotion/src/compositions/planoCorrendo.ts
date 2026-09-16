/* =============================================================================
   NH — A EQUIPE FEZ CORRENDO. E VOCÊ CORRIGIU?
   Fita de 16/09/2026, pasta "172aZJ…", dois arquivos: "1" (49,6 s, 4K vertical,
   30 fps) e "2" (28,8 s, 1080×1920, 60 fps). São as duas partes de UMA peça
   roteirizada — a parte 1 é o problema, a parte 2 é a solução e o CTA. Outra
   pessoa e outro cenário (parede clara, sem sala cirúrgica).

   UMA PEÇA SÓ, e isso foi conferido: não há bloco sobrando que se sustente
   sozinho. O gancho e a solução são metades do mesmo argumento.

   PEDIDO DA DONA: "edite com máximo cuidado, não quero take olhando pro lado e
   nem gaguejando, geralmente a última fala é a melhor". As três exigências
   foram tratadas como passo, não como intenção — ver abaixo.

   FONTE POR CORTE (tempos medidos no envelope):
     clip0 gancho  p1  9,30 → 14,90  "Médico, já aconteceu de sua equipe fazer
                                      tudo correndo e você precisar corrigir
                                      esse trabalho?"
     clip1 mesa    p1 19,30 → 23,37  "A mesa ficou desorganizada, a informação
                                      não foi conferida,"
     clip2 comunic p1 33,00 → 34,87  "a comunicação se perde"
     clip3 tempo   p1 41,05 → 47,32  "e o tempo que era para ser economizado
                                      acaba sendo gasto quando você precisa
                                      colocar tudo em ordem de novo."
     clip4 solução p2  0,35 →  7,08  "Na New Hair, nós organizamos as tarefas e
                                      acompanhamos o ritmo da cirurgia com muito
                                      cuidado ao manuseio."
     clip5 cta     p2 21,02 → 27,19  "Precisa de uma equipe preparada para
                                      acompanhar a sua rotina? Entra em contato
                                      com a gente pelo link na bio."

   ÚLTIMAS TENTATIVAS, uma a uma. O gancho é dito duas vezes (0,64 "refazer o
   trabalho" e 9,39 "corrigir esse trabalho") — fica o segundo. O "Precisa de
   uma equipe / Entra em contato" também é dito duas vezes na parte 2 (12,70 e
   21,15) — fica o segundo, e como as duas frases são contíguas ali, entram num
   corte só, sem emenda nenhuma entre elas.

   ⚠ "A MESA FICOU DESORGANIZADA" ESTÁ DITA DUAS VEZES, E QUASE PASSOU. As duas
   tentativas se emendam (18,22→19,20 e 19,44→21,04, vale de 240 ms que não
   chega ao piso), então a varredura por região via UMA região só. Quem
   denunciou foi a palavra esticada: o transcritor deu **"desorganizada" durando
   2,16 s**, e **88% desse vão é FALA, não silêncio**. Corte foi pra 19,30, a
   segunda tentativa. O `varrer-corte.py` ganhou essa medida de fração de fala e
   agora reprova sozinho o corte antigo.

   EMENDA DE CLAUSE ENTRE clip2 E clip3, de propósito. Na fita a frase inteira
   nunca sai inteira: em 33,20 ela diz "A comunicação se perde e o tempo que era
   para ser economizado" e TRAVA (2,16 s de hesitação antes de "economizado"); em
   41,23 ela retoma já de "e o tempo…" e termina. Montado, o clip2 entrega só "a
   comunicação se perde" e o clip3 o resto — a frase fica inteira e nada se
   repete. A faixa de apoio atravessa o frame 346 justamente pra suavizar essa
   emenda, como a NH_antecipa fez.

   OLHAR NA CÂMERA — conferido quadro a quadro (§02, "rosto já dirigido à
   câmera, sem consulta lateral"). A entrada do clip1 era o problema: em
   17,90–18,00 ela está com a cabeça virada pra direita, voltando. O rosto só
   fica frontal a partir de 18,10. Com o corte na segunda tentativa (19,30) a
   questão some: ali ela já está olhando na lente há mais de um segundo. Todas
   as outras entradas e os corpos dos seis cortes foram varridos em folhas de
   contato a 2 quadros/s.

   APOIO EM FAIXA MASCARADA, que aqui CABE. Medido, o cabelo dela começa entre
   512 e 564 px — sobra céu de verdade, ao contrário da fita de 15/09. Pela
   regra, altura = 512 ÷ 0,85 ≈ 600; usei 610.

   TÍTULO NO ALTO (270, o padrão). A ordem "deixa o texto embaixo" era daquela
   fita ("NESSE deixa…"), onde o rosto ia de 110 a 1290 px e o título caía nele.
   Aqui o título mora na parede, acima da cabeça, sem encostar no rosto.

   COM TENSÃO E CLICK: o problema é delimitado (fecha em "colocar tudo em ordem
   de novo") e a solução entra em "Na New Hair".
   ============================================================================= */
import type { Cue, Plano } from "./ReelFalado";

export const PLANO_CORRENDO: Plano = {
  fps: 30,
  duration: 1112, // 921 de conteúdo + 191 da marca
  endCard: 921,
  hookEnd: 168, // 5,600 s — fim de "…corrigir esse trabalho?"
  clips: [
    { nome: "gancho", src: "newhair/falado14/clip0.mp4", start: 0, duration: 168 },
    { nome: "mesa", src: "newhair/falado14/clip1.mp4", start: 168, duration: 122 },
    { nome: "comunicacao", src: "newhair/falado14/clip2.mp4", start: 290, duration: 56 },
    { nome: "tempo", src: "newhair/falado14/clip3.mp4", start: 346, duration: 188 },
    { nome: "solucao", src: "newhair/falado14/clip4.mp4", start: 534, duration: 202 },
    { nome: "cta", src: "newhair/falado14/clip5.mp4", start: 736, duration: 185 },
  ],
  brolls: [
    /* atravessa o frame 346 — é a emenda entre "a comunicação se perde" e
       "e o tempo…", e é o apoio que a suaviza */
    { fromFrame: 306, duration: 100, src: "newhair/falado14/apoio_maos.mp4", mode: "band", altura: 610, position: "50% 50%" },
    /* "organizamos as tarefas": as pinças alinhadas na mesa, literal */
    { fromFrame: 565, duration: 110, src: "newhair/falado14/apoio_mesa.mp4", mode: "band", altura: 610, position: "50% 50%" },
  ],
  title: ["A EQUIPE FEZ CORRENDO", "E VOCÊ CORRIGIU?"],
  titleShift: 0,
  /* zoom no clip do desfecho do problema: cabelo em 524 px no pior quadro, o
     empurrão de 12% ainda deixa 400 px de céu. */
  zoomClip: 3,
  zoomFrame: 10,
  closeClips: [],
};

export const CUES_CORRENDO: Cue[] = [
  { start: 5.76, end: 7.45, lines: [
    { text: "A mesa ficou", size: 34 },
    { text: "DESORGANIZADA,", size: 42, gold: true }] },
  { start: 7.48, end: 9.45, lines: [
    { text: "a informação", size: 34 },
    { text: "NÃO FOI CONFERIDA,", size: 42, gold: true }] },
  { start: 9.96, end: 11.32, lines: [
    { text: "a comunicação", size: 34 },
    { text: "SE PERDE,", size: 42, gold: true }] },
  { start: 11.36, end: 13.62, lines: [
    { text: "e o tempo", size: 34 },
    { text: "QUE ERA PARA SER ECONOMIZADO", size: 42, gold: true }] },
  { start: 13.65, end: 14.85, lines: [
    { text: "acaba", size: 34 },
    { text: "SENDO GASTO", size: 42, gold: true }] },
  { start: 14.88, end: 17.95, lines: [
    { text: "quando você precisa", size: 34 },
    { text: "COLOCAR TUDO EM ORDEM DE NOVO.", size: 42, gold: true }] },
  { start: 18.02, end: 20.32, lines: [
    { text: "Na New Hair, nós", size: 34 },
    { text: "ORGANIZAMOS AS TAREFAS", size: 42, gold: true }] },
  { start: 20.35, end: 22.62, lines: [
    { text: "e acompanhamos", size: 34 },
    { text: "O RITMO DA CIRURGIA", size: 42, gold: true }] },
  { start: 22.64, end: 24.65, lines: [
    { text: "com muito cuidado", size: 34 },
    { text: "AO MANUSEIO.", size: 42, gold: true }] },
  { start: 24.76, end: 28.05, lines: [
    { text: "Precisa de uma equipe preparada", size: 34 },
    { text: "PARA ACOMPANHAR A SUA ROTINA?", size: 42, gold: true }] },
  { start: 28.08, end: 30.70, lines: [
    { text: "Entra em contato com a gente", size: 34 },
    { text: "PELO LINK NA BIO.", size: 42, gold: true }] },
];
