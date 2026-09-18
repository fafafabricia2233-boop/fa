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
   4. "Tricoscopia do couro cabeludo limpo" (O) 76,60→79,50
      O que o aparelho mostra. Fecha a frase com a imagem que ela foi buscar.

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
const C1 = 84; // 2,80 s
const C2 = 81; // 2,70 s
const C3 = 69; // 2,30 s
const C4 = 87; // 2,90 s

const CENAS = C1 + C2 + C3 + C4; // 321 frames = 10,70 s
const FECHO = 63; // 2,10 s de lockup parado
const TOTAL = CENAS + FECHO; // 384 frames = 12,80 s

export const PLANO_TRICOSCOPIA: PlanoTextoFixo = {
  marca: "fabricia",

  cortes: [
    {
      src: "fabricia/cortes-tricoscopia/c1_cabelo.mp4",
      duracao: C1,
      origem:
        "Drive · Mostrando o cabelo · " +
        "'Mostrando cabelo bonito finalizado repartindo ao meio o couro cabeludo' " +
        "(1f3khS0vJfGb4O4nw10Z1zh_XJGyOq-T6) · 17,00→19,80 s · " +
        "recorte 810×1440 em (0, 480) · brilho +0,023",
    },
    {
      src: "fabricia/cortes-tricoscopia/c2_tricoscopia.mp4",
      duracao: C2,
      origem:
        "Drive · Tricoscopia · 'Tricoscopia cabelo limpo' " +
        "(1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe) · 4,00→6,70 s · " +
        "recorte 882×1568 em (59, 285) · brilho −0,058",
    },
    {
      src: "fabricia/cortes-tricoscopia/c3_exame.mp4",
      duracao: C3,
      origem:
        "Drive · Tricoscopia · 'Tricoscopia cabelo limpo' " +
        "(1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe) · 42,00→44,30 s · " +
        "recorte 576×1024 em (272, 260) · brilho −0,02",
    },
    {
      src: "fabricia/cortes-tricoscopia/c4_imagem.mp4",
      duracao: C4,
      origem:
        "Drive · Tricoscopia · 'Tricoscopia do couro cabeludo limpo' " +
        "(1sMIzGI1f7w1rt2Hkkbp55xGZm4dem9tu) · 76,60→79,50 s · " +
        "recorte 387×688 em (458, 755) — DENTRO da tela · brilho −0,062",
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
        { partes: [{ texto: "olhar o couro cabeludo..." }] },
      ],
    },
  ],

  /* bottom 405: o bloco de 3 linhas (197,6 px) ocupa 1317 → 1515 px. Mais
     baixo que na FS_couro_cachos porque aqui o corte 2 tem o rosto dela grande
     no meio do quadro — a 1150 a legenda caía em cima da boca. O enquadramento
     do corte 2 foi refeito junto (882×1568) pra levantar o rosto e liberar a
     faixa. Sobram 45 px até os últimos 360 px do Reels. */
  texto: { ...LEGENDA_ALINHADA, bottom: 405 },
  veu: veuDaLegenda(405, 3),

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
    volume: 0.531, // −5,5 dB, o mesmo ganho do master
    fadeIn: 24,
    fadeOut: 36,
  },
};

export const DURACAO_TRICOSCOPIA = TOTAL;
