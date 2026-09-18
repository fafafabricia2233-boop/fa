/* =============================================================================
   FS_tricoscopia — "Meu cabelo está bonito. Mesmo assim, eu quero olhar o
                     couro cabeludo..."

   Marca: Fabrícia Satza. Formato: ROTINA COM TEXTO FIXO, o mesmo motor e o
   mesmo padrão de legenda da FS_couro_cachos.

   ---------------------------------------------------------------------------
   A ESTRUTURA É A DA FRASE, EM TRÊS BATIDAS

   A frase tem uma concessão no meio ("Mesmo assim"), e a montagem segue:
   o que ela tem → o que ela faz apesar disso → o que ela vê.

   1. "Mostrando cabelo bonito finalizado" (L) 17,00→19,80
      DE COSTAS, o cabelo inteiro na tela, cheio, com movimento. É o "meu
      cabelo está bonito" — a peça abre pelo resultado, como a anterior.
   2. "Tricoscopia cabelo limpo" (P) 4,00→6,70
      Ela encosta o tricoscópio no couro e olha pra lente. É o "mesmo assim":
      o gesto de ir olhar mesmo com o cabelo bonito.
   3. "Tricoscopia cabelo limpo" (P) 42,00→44,30
      O exame de perto — a luz do aparelho na risca aberta, a mão segurando o
      cabelo. Enquadrado SEM o rosto: aqui o assunto é o couro, não ela.
   4. "Tricoscopia do couro cabeludo limpo" (O) 104,00→106,20
      A TELA, com moldura à vista. Diz o que os dois planos seguintes são.
   5. idem, 76,60→79,20 — dentro da imagem: o couro entre os fios, limpo.
   6. idem, 67,80→70,70 — os fios grossos, separados e com brilho. Fecha a peça
      na prova de que o "está bonito" da primeira linha continua verdadeiro
      de perto.

   O QUE FICOU DE FORA, DE PROPÓSITO

   · "Fazendo tricoscopia no cabelo limpo" (N): mesmo gesto do corte 2, mas
     gravada CONTRA O ESPELHO — o "CHICAGO" da camiseta sai invertido. A P faz
     a mesma coisa com câmera direta.
   · "Tricoscopia couro cabeludo sujo descamando seborreia" (Q): é couro sujo
     com descamação. A frase diz que o cabelo está bonito; abrir a imagem num
     couro descamando contradiz o texto e vira outro assunto.
   · O resto da fita O: são 143 s de tela, e a maior parte está fora de foco
     ou com o aparelho correndo rápido demais. A janela escolhida foi medida
     (nitidez alta com movimento contínuo), não pescada no olho.

   ---------------------------------------------------------------------------
   O CORTE 4 É FILMAGEM DE TELA, E ISSO TEM CONSEQUÊNCIA

   A fita O é a tela do tricoscópio filmada de lado: a tela está inclinada,
   tem moldura preta em volta, ícones da interface à esquerda e um botão ciano
   de câmera à direita. O recorte entra DENTRO da imagem — 387×688 no espaço
   da entrega, que é 774×1376 px na fita — e por isso amplia 1,40×. É o único
   plano da peça que amplia; os outros três desceriam de 4K com pixel de
   sobra. Vale porque o conteúdo é textura macro, onde a maciez lê como pouca
   profundidade de campo, e porque não existe enquadramento maior dentro da
   tela sem pegar moldura ou botão.
   ============================================================================= */

import type { PlanoTextoFixo } from "./ReelTextoFixo";
import { LEGENDA_ALINHADA, veuDaLegenda } from "../lib/legendaFabricia";

/* frames MEDIDOS nos arquivos cortados com ffprobe -count_frames */
const C1 = 105; // 3,50 s — GANCHO: cabelo finalizado + faixa mascarada
const C2 = 57; //  1,90 s — o exame de perto, a luz na risca
const C3 = 57; //  1,90 s — ela levando o tricoscópio ao couro
const C4 = 66; //  2,20 s — A TELA do tricoscópio, com a moldura à vista
const C5 = 285; // 9,50 s — dentro da imagem: os fios grossos, demorado

const CENAS = C1 + C2 + C3 + C4 + C5; // 570 frames = 19,00 s
const FECHO = 63; // 2,10 s de lockup parado
const TOTAL = CENAS + FECHO; // 633 frames = 21,10 s

/* v5 (18/09/2026). Três ordens dela, e a primeira muda a gramática da peça:

   · GANCHO EM DUAS CAMADAS. "Eu mostrando o cabelo finalizado e uma imagem
     mascarada em cima mostrando a tricoscopia de pelos grossos." O primeiro
     plano passa a ter FAIXA MASCARADA — a técnica que a casa já usava nas
     peças faladas e que o motor de texto fixo não tinha. Não é tarja: a faixa
     dissolve na borda que encosta no cabelo, então a imagem do tricoscópio
     nasce de dentro do cabelo dela. É o vídeo inteiro numa imagem só: o cabelo
     bonito por fora, o couro por dentro.

   · SAI A TRICOSCOPIA DOS FIOS FINOS. Os dois planos de tela que mostravam
     couro com fio ralo saíram; sobrou só o dos fios grossos, e a TELA passou a
     mostrar fio grosso também (85,8 s em vez de 104,0 s). A peça inteira agora
     só mostra tricoscopia de fio bom.

   · O FINAL DEMORA. 9,50 s no macro dos fios, contra 2,90 s antes. A janela
     saiu de medida: varridas todas as janelas contínuas de 9,5 s da fita
     exigindo que NENHUM quadro ficasse sem fio, 63,5 s ganhou (espessura média
     20,4 e nenhum quadro escuro). A concorrente de 66,5 s pontuava parecido e
     foi descartada na folha de contato: tem dois quadros quase pretos por
     volta de 73 s, onde o aparelho perde contato com o couro.

   A peça foi de 15,70 s para 21,10 s. Ela autorizou: "pode ser um vídeo longo
   não tem problema". */

export const PLANO_TRICOSCOPIA: PlanoTextoFixo = {
  marca: "fabricia",

  cortes: [
    {
      src: "fabricia/cortes-tricoscopia/c1_gancho.mp4",
      duracao: C1,
      /* GANCHO EM DUAS CAMADAS: o cabelo finalizado de costas, e por cima a
         faixa mascarada com a tricoscopia dos fios grossos — a MESMA imagem
         que fecha a peça, como ela pediu. A faixa ocupa o alto e dissolve
         para dentro do cabelo. */
      faixa: {
        src: "fabricia/cortes-tricoscopia/faixa_fios.mp4",
        topo: 0,
        altura: 620,
        cauda: 180,
        cor: { brilho: 0.96 },
      },
      origem:
        "Drive · Mostrando o cabelo · " +
        "'Mostrando cabelo bonito finalizado repartindo ao meio o couro cabeludo' " +
        "(1f3khS0vJfGb4O4nw10Z1zh_XJGyOq-T6) · 17,00→20,50 s · " +
        "recorte 810×1440 em (0, 480) · brilho +0,023 · " +
        "faixa: 'Tricoscopia do couro cabeludo limpo' 63,50→67,00 s",
    },
    {
      src: "fabricia/cortes-tricoscopia/c1_exame.mp4",
      duracao: C2,
      origem:
        "Drive · Tricoscopia · 'Tricoscopia cabelo limpo' " +
        "(1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe) · 42,00→43,90 s · " +
        "recorte 576×1024 em (272, 260) · brilho −0,02",
    },
    {
      src: "fabricia/cortes-tricoscopia/c3_tricoscopia.mp4",
      duracao: C3,
      origem:
        "Drive · Tricoscopia · 'Tricoscopia cabelo limpo' " +
        "(1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe) · 4,00→5,90 s · " +
        "recorte 882×1568 em (59, 285) · brilho −0,058",
    },
    {
      src: "fabricia/cortes-tricoscopia/c4_tela.mp4",
      duracao: C4,
      /* A TELA COMO TELA: moldura em cima e embaixo, pedaço do suporte. Agora
         num instante de FIO GROSSO (85,8 s), não mais no de fio ralo. Recorte
         562×1000 = 1124 px na fita: é o único corte de tela que não amplia. */
      origem:
        "Drive · Tricoscopia · 'Tricoscopia do couro cabeludo limpo' " +
        "(1sMIzGI1f7w1rt2Hkkbp55xGZm4dem9tu) · 85,80→88,00 s · " +
        "recorte 562×1000 em (260, 700) — a tela inteira, sem ajuste de brilho",
    },
    {
      src: "fabricia/cortes-tricoscopia/c5_fios_longo.mp4",
      duracao: C5,
      /* O FINAL DEMORADO: 9,50 s de fio grosso em macro. Janela escolhida
         varrendo TODAS as janelas contínuas de 9,5 s da fita com a exigência
         de que nenhum quadro ficasse sem fio. */
      origem:
        "Drive · Tricoscopia · 'Tricoscopia do couro cabeludo limpo' " +
        "(1sMIzGI1f7w1rt2Hkkbp55xGZm4dem9tu) · 63,50→73,00 s · " +
        "recorte 387×688 em (458, 755) — DENTRO da tela · brilho −0,09",
    },
  ],

  /* PADRÃO DE LEGENDA ALINHADA. A quebra saiu de
     `python3 scripts/quebrar-legenda.py "<o texto>" --corpo 54 --caixa 840`:

        548,6  Meu cabelo está bonito.
        540,0  Mesmo assim, eu quero
        580,8  olhar o couro cabeludo...

     Variação de 41 px = **7%**, melhor até que os 9% da referência — e, de
     brinde, cada linha caiu numa unidade de sentido inteira. Nem sempre dá as
     duas coisas; aqui deu.

     As reticências: ela escreveu nove pontos ("cabeludo........."). Ficaram
     três — a reticência tipográfica. Nove pontos brigam com o "minimalista" e
     com a regra de "frase curta, ponto final" do tom de voz dela. É reversível
     numa linha. */
  paragrafos: [
    {
      linhas: [
        { partes: [{ texto: "Meu cabelo está bonito." }] },
        { partes: [{ texto: "Mesmo assim, eu quero" }] },
        {
          partes: [
            { texto: "olhar o " },
            /* A PALAVRA EM NEGRITO, pedido dela em 18/09 ("igual à referência
               do vídeo"). Sai na face Medium de VERDADE — ver `familiaEnfase`
               abaixo. Com ela a linha passa de 580,8 para 600,2 px, e o bloco
               fica 548,6 · 540,0 · 600,2: variação de 10%, ainda dentro do
               padrão alinhado (a referência tem 9%). */
            { texto: "couro cabeludo...", enfase: true },
          ],
        },
      ],
    },
  ],

  /* bottom 405: o bloco de 3 linhas (197,6 px) ocupa 1317 → 1515 px. Mais
     baixo que na FS_couro_cachos porque aqui o corte 2 tem o rosto dela grande
     no meio do quadro — a 1150 a legenda caía em cima da boca. O enquadramento
     do corte 2 foi refeito junto (882×1568) pra levantar o rosto e liberar a
     faixa. Sobram 45 px até os últimos 360 px do Reels. */
  texto: {
    ...LEGENDA_ALINHADA,
    bottom: 405,
    /* A "Fabrícia" (Futura PT) que ela mandou tem UM peso só, então a ênfase
       vem da face Medium da "Fabricia Satza" — a Jost do kit de 13/09, prima
       da Futura: mesmo esqueleto geométrico, mesmo "a" de um andar. Medida a
       diferença: altura de x de 24,8 px contra 23,4 a 54 px. Conferido em
       tamanho real que o olho lê como PESO, não como outra fonte.
       Isto SOME no dia em que chegar a Medium/Bold da própria Futura. */
    familiaEnfase: "Fabricia Satza",
  },
  /* 0,44 em vez dos 0,40 do padrão: medido, o corte dos fios grossos tem couro
     branco em macro e derrubava o branco da legenda para 4,4:1, abaixo do piso
     de 4,5. Escurecer o plano estragaria a prova — quem sobe é o véu. */
  veu: veuDaLegenda(405, 3, 0.44),

  cabecalho: false,

  endCard: CENAS,
  duracao: TOTAL,

  /* Faixa DIFERENTE da peça anterior, como manda a rotação. "harmony - lofi
     type beat (FREE FOR PROFIT USE) - Prod. Riddiman"; SHA-256 1f9feee1…
     confere com a curadoria. Recorte a partir de 88,112 s, que é tempo forte
     de compasso (compasso de 3,04 s, ~79 BPM). O master mixado por fora sai a
     −16,00 LUFS e pico real −5,93 dBTP. */
  audio: {
    src: "fabricia/musica/harmony.mp3",
    inicio: 88.112,
    volume: 0.531, // −5,5 dB, o mesmo ganho do master (13,90 s)
    fadeIn: 24,
    fadeOut: 36,
  },
};

export const DURACAO_TRICOSCOPIA = TOTAL;
