/* =============================================================================
   FS_couro_cachos — "Eu cuido muito da definição dos meus cachos.
                      Mas não deixo o couro cabeludo por último."

   Marca: Fabrícia Satza (tricologia). Formato: ROTINA COM TEXTO FIXO.
   Fonte do material: pasta do Drive "banco de imagens" da Fabrícia
   (1bfbAoD8r0-WurW4ID7dEbGPtHQjbiPgF), examinada arquivo por arquivo em
   16/09/2026. Só cenas dela; nenhum banco de imagem, nenhuma geração.

   ---------------------------------------------------------------------------
   POR QUE ESTES QUATRO CORTES, E NESTA ORDEM

   A frase tem duas metades e a montagem segue as duas: dois planos de
   DEFINIÇÃO e dois de COURO CABELUDO, com a virada caindo no meio da peça.
   Como o texto é fixo, o corte não precisa sincronizar com a leitura — mas a
   prova precisa chegar na ordem em que a frase a promete, e a segunda metade
   é a que a peça existe pra defender.

   1. "passando protetor termico no cabelo" (F) 3,70→6,50
      Ela borrifa e trabalha o cacho com a mão. É o gesto de DEFINIÇÃO, com o
      rosto na lente. Abre a peça direto na cena, sem vinheta.
   2. "usando secador no cabelo, dando volume" (R) 68,30→71,00
      Difusor, volume tomando forma, ela sorri e olha pra câmera. Fecha a
      primeira metade — "a definição" — no melhor momento de expressão da fita.
   3. "Massagem craniana estimulando a circulação do couro cabeludo" (C)
      1,00→3,60. A VIRADA. Dedos abrindo espuma no couro. É a imagem que o
      "mas" pede: não dá pra confundir com cuidado de fio.
   4. "Couro cabeludo limpo após lavagem" (D) 0,90→3,50
      A risca aberta, couro enxaguado e limpo. Fecha provando o resultado do
      que a frase afirma.

   O QUE FICOU DE FORA, DE PROPÓSITO (e por quê — §02 da casa):

   · "Fazendo fitagem, finalizando o cabelo" (H) e "Mostrando o cabelo
     finalizado" (M): é a fita mais literal de "definição", mas é gravada
     CONTRA O ESPELHO — o tripé e o celular lilás ficam dentro do quadro no
     canto inferior esquerdo, e o "CHICAGO" da camiseta sai espelhado. Numa
     peça que tem que parecer premium isso denuncia. Espelhar o vídeo pra
     corrigir resolveria a camiseta e inverteria tudo o mais; alteração de
     imagem não se faz sem a dona mandar.
   · "mostrando e passando óleo capilar no cabelo e no couro" (G): ótima fita,
     câmera direta, e ela pinga o produto na risca — seria o corte 3 ideal.
     Ficou fora por COMPOSIÇÃO: o vidro fica na mão, na altura do peito,
     exatamente onde o texto fixo mora. Texto fixo não sai do lugar pra
     acomodar um corte; ou o corte deixa a faixa livre, ou não entra.
   · "Lavando o cabelo com shampoo... com escova" (B): mesma sessão do corte 3
     e igualmente boa, mas em vários trechos aparece a nuca e as costas nuas
     no chuveiro. O corte 3 conta a mesma coisa enquadrado só na cabeça.
   · Tricoscopia (4 fitas), "Cabelo sujo", "prendendo o cabelo", "pré-poo":
     fora do assunto desta frase. Tricoscópio entra "quando pertinente ao
     tema", e aqui o tema é rotina em casa, não exame.
   · Pasta "finalizando o cabelo": VAZIA no Drive.

   ---------------------------------------------------------------------------
   TIPOGRAFIA — medida, não estimada

   Fonte oficial da marca, lida do disco: família "Fabricia Satza".
     · Light  (peso 300) — a frase inteira
     · Medium (peso 500) — "o couro cabeludo", a ênfase REAL (nunca sintética)
   A face Alt (display) não entra: isto é frase corrida com ponto final, não
   título em display, e misturar Alt com a Light trocaria o desenho do "a" no
   meio da mesma sentença.

   Corpo 54 px. O pedido pede 48–64; a área útil manda no número: margem
   esquerda 90 + margem direita 180 (controles do Reels) deixa 810 px, e a
   linha mais longa — "Mas não deixo o couro cabeludo" — mede 770,7 px a 54 px
   contra o arquivo real da fonte. A 58 px ela mede 827,3 e estoura. O piso de
   texto corrido do manual dela é 37 px, então 54 passa com folga.

   ---------------------------------------------------------------------------
   TRILHA

   "cosy - lofi type beat (FREE FOR PROFIT USE) - Prod. Riddiman".
   SHA-256 confere com kit-new-hair/musicas-ataques-por-hash.json (curadoria de
   licença, não identidade de marca — o arquivo é o mesmo, a licença é a mesma).
   Recorte 97,616 s → 110,416 s: 97,616 é tempo forte de compasso (ataques de
   1,6 em 1,6 s, 75 BPM) e a janela é a mais estável da faixa (desvio 2,04 dB
   contra 3,08 e 4,85 das outras). 12,8 s = 4 compassos exatos.
   ============================================================================= */

import type { PlanoTextoFixo } from "./ReelTextoFixo";

/* frames MEDIDOS nos arquivos cortados com ffprobe -count_frames */
const C1 = 84; // 2,80 s
const C2 = 81; // 2,70 s
const C3 = 78; // 2,60 s
const C4 = 78; // 2,60 s

const CENAS = C1 + C2 + C3 + C4; // 321 frames = 10,70 s
const FECHO = 63; // 2,10 s de lockup parado
const TOTAL = CENAS + FECHO; // 384 frames = 12,80 s

export const PLANO_COURO_CACHOS: PlanoTextoFixo = {
  marca: "fabricia",

  cortes: [
    {
      src: "fabricia/cortes/clip1_cachos.mp4",
      duracao: C1,
      origem:
        "Drive · passando produto no cabelo · " +
        "'passando protetor termico no cabelo, passando spray protetor no cabelo' " +
        "(1ZCxmAleTExcVGIEjWXcSL1jnk8QRAcS-) · 3,70→6,50 s",
    },
    {
      src: "fabricia/cortes/clip2_volume.mp4",
      duracao: C2,
      origem:
        "Drive · usando secador · " +
        "'usando secador no cabelo, dando volume no cabelo crespo' " +
        "(1wl0D2pX1UbPrbsNnqlRGw9EMB5T3C6lu) · 68,30→71,00 s",
    },
    {
      src: "fabricia/cortes/clip3_massagem.mp4",
      duracao: C3,
      origem:
        "Drive · lavando o cabelo · " +
        "'Massagem craniana estimulando a circulação sanguínea do couro cabeludo' " +
        "(1TXQ7rJV4RCD3gVIpDvXdtfdZZqK_V_HE) · 1,00→3,60 s",
    },
    {
      src: "fabricia/cortes/clip4_courolimpo.mp4",
      duracao: C4,
      origem:
        "Drive · lavando o cabelo · " +
        "'Couro cabeludo limpo após lavagem, exibindo couro cabeludo limpo' " +
        "(1g_SyoyKOOADHjAPNxK46sfD46ASH1Pz1) · 0,90→3,50 s",
    },
  ],

  /* Quebra em unidade de sentido, dois parágrafos = as duas metades da frase.
     O texto é o do pedido, palavra por palavra. */
  paragrafos: [
    {
      linhas: [
        { partes: [{ texto: "Eu cuido muito da definição" }] },
        { partes: [{ texto: "dos meus cachos." }] },
      ],
    },
    {
      linhas: [
        {
          partes: [
            { texto: "Mas não deixo " },
            { texto: "o couro cabeludo", enfase: true },
          ],
        },
        { partes: [{ texto: "por último." }] },
      ],
    },
  ],

  texto: {
    /* 56 px: MEDIDO na referência que a dona mandou em 16/09/2026. A altura de
       x da legenda dela é 17 px num quadro de 720 de largura — 25,5 px em
       1080 — e a família tem altura de x de 0,460 em, o que dá corpo ~55 px.
       Conferido por largura também: "de nutrição de pequi." mede 541 px lá e
       a mesma frase sai em 539 px a 58. 56 é o meio das duas medidas e cabe
       na caixa (linha mais longa 793 px numa caixa de 840). */
    tamanho: 56,
    entrelinha: 1.42,
    respiro: 26,
    /* bloco mede 4×78,8 + 28 = 343,4 px. bottom 415 ⇒ ocupa 1161,6 → 1505 px:
       começa muito abaixo dos 220 px de topo e sobra 55 px até os últimos
       360 px (1560), onde o nome, a legenda e o áudio do Reels vão aparecer.
       Conferido na prévia com a interface sobreposta: a coluna de botões da
       direita começa em x≈950 e a linha mais longa acaba em x=860. */
    /* bloco: 4×79,5 + 26 = 344 px. bottom 476 ⇒ ocupa 1100 → 1444 px.
       Fica abaixo do queixo nos dois planos de rosto (que acabam em ~900 e
       ~830 com o enquadramento novo) e bem acima dos últimos 360 px. */
    bottom: 476,
    /* CENTRALIZADO, como a referência. A caixa é 90→930, então o eixo cai em
       510: a linha mais longa (793 px) vai de 113 a 907 e não encosta na
       coluna de botões do Reels, que começa por volta de x=950. */
    margemEsquerda: 90,
    margemDireita: 150,
    alinhamento: "center",
    face: "corpo",
    /* A referência marca a palavra só pelo PESO, em branco. Some a questão de
       contraste do champagne sobre imagem e fica igual ao que ela pediu. */
    enfaseCor: "texto",
  },

  /* Sem cabeçalho: ver a nota no tipo. A marca fica identificada pela fonte
     oficial, pelo champagne da ênfase, pelo café do véu e pelo lockup do fim —
     e a imagem ocupa a tela toda, que é a ordem permanente da dona (14/09). */
  cabecalho: false,

  /* Véu localizado, não placa: gradiente com cauda dos DOIS lados (170 px),
     porque véu que acaba seco em cima de parede lisa vira linha horizontal —
     defeito já medido nesta casa em 14 e 15/09/2026. */
  /* Véu bem mais leve que na v1: a referência não tem véu nenhum, e o grade
     novo já escureceu o fundo. 0,40 é o mínimo que ainda segura a legenda
     sobre a camiseta verde-clara do corte 2 — conferido frame a frame. */
  veu: { topo: 1060, base: 1470, cauda: 200, alfa: 0.4 },

  endCard: CENAS,
  duracao: TOTAL,

  audio: {
    src: "fabricia/musica/cosy.mp3",
    inicio: 97.616,
    volume: 0.55,
    fadeIn: 24,
    fadeOut: 36,
  },
};

export const DURACAO_COURO_CACHOS = TOTAL;
