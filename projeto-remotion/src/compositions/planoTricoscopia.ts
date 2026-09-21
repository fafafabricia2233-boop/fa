/* =============================================================================
   FS_tricoscopia — "Meu cabelo está bonito. Mesmo assim, eu quero olhar o
                     couro cabeludo..."

   Marca: Fabrícia Satza. Formato: ROTINA COM TEXTO FIXO, o mesmo motor e o
   mesmo padrão de legenda da FS_couro_cachos.

   ---------------------------------------------------------------------------
   v7 (20/09/2026) — O EXAME ABRE SOZINHO

   Ordem dela: *"vamos trocar a primeira imagem por a cena onde estou passando
   o tricoscópio de perto, vai entrar sozinha, sem mascarar, por 3 segundos;
   em seguida entra a imagem da tricoscopia do couro cabeludo."*

   O que isso desfaz: o gancho em duas camadas da v5/v6 (cabelo finalizado com
   a faixa mascarada da tricoscopia por cima). As duas imagens que estavam
   EMPILHADAS passam a ser SEQUENCIAIS — primeiro o exame, depois a imagem.

   Consequência que precisa ficar escrita, porque ela não pediu e é efeito da
   ordem: com a posição 2 ocupada pela imagem da tricoscopia, **saíram da peça
   o cabelo finalizado de costas e o plano em que ela leva o tricoscópio ao
   couro**. A primeira linha da legenda ("Meu cabelo está bonito") passa a não
   ter imagem própria — ela é lida, não mostrada. Voltar qualquer um dos dois
   é uma linha neste arquivo.

   O que a peça não perdeu: ela continua no quadro. O plano do exame é fechado,
   mas a sobrancelha e os olhos dela aparecem na borda de baixo — não é um
   plano de mão anônima.

   ---------------------------------------------------------------------------
   A ESTRUTURA, EM TRÊS BATIDAS

   1. "Tricoscopia cabelo limpo" (P) 42,90→45,90 — O EXAME DE PERTO
      3,00 s, sozinho, sem máscara. A luz do aparelho na risca aberta, a mão
      segurando o cabelo, os olhos dela na borda de baixo. É o gancho: a peça
      abre no gesto, não no resultado.
   2. "Tricoscopia do couro cabeludo limpo" (O) 85,80→88,00 — A TELA
      2,20 s. A imagem da tricoscopia com a moldura à vista: é isto que diz ao
      espectador que o que vem a seguir é uma TELA, não uma foto qualquer.
   3. idem, 63,50→73,00 — DENTRO DA IMAGEM
      9,50 s de fio grosso em macro. O final demorado que ela autorizou
      ("pode mostrar a tricoscopia de pelos grossos no final por mais de 9
      segundos").

   O QUE FICOU DE FORA, DE PROPÓSITO

   · "Mostrando cabelo bonito finalizado" (L) 17,00→19,80: era o gancho da v6.
     Saiu pela ordem acima — a posição 1 é o exame e a 2 é a tricoscopia.
   · "Tricoscopia cabelo limpo" (P) 4,00→5,90 — ela levando o aparelho ao
     couro, com o rosto no quadro. Mesmo motivo; e, com o exame de perto
     abrindo, este plano repetia o gesto num enquadramento mais frouxo.
   · "Fazendo tricoscopia no cabelo limpo" (N): mesmo gesto, mas gravada CONTRA
     O ESPELHO — o "CHICAGO" da camiseta sai invertido.
   · "Tricoscopia couro cabeludo sujo descamando seborreia" (Q): couro sujo com
     descamação. A frase diz que o cabelo está bonito; abrir a imagem num couro
     descamando contradiz o texto.
   · O resto da fita O: 143 s de tela, a maior parte fora de foco ou com o
     aparelho correndo rápido demais. As duas janelas foram medidas.

   ---------------------------------------------------------------------------
   O CORTE 3 É FILMAGEM DE TELA, E ISSO TEM CONSEQUÊNCIA

   A fita O é a tela do tricoscópio filmada de lado: a tela está inclinada,
   tem moldura preta em volta, ícones da interface à esquerda e um botão ciano
   de câmera à direita. O recorte do macro entra DENTRO da imagem — 387×688 no
   espaço da entrega, que é 774×1376 px na fita — e por isso amplia 1,40×. Vale
   porque o conteúdo é textura macro, onde a maciez lê como pouca profundidade
   de campo, e porque não existe enquadramento maior dentro da tela sem pegar
   moldura ou botão.
   ============================================================================= */

import type { PlanoTextoFixo } from "./ReelTextoFixo";
import { LEGENDA_ALINHADA, veuDaLegenda } from "../lib/legendaFabricia";

/* frames MEDIDOS nos arquivos cortados com ffprobe -count_frames */
const C1 = 90; //  3,00 s — GANCHO: o exame de perto, sozinho, sem máscara
const C2 = 66; //  2,20 s — A TELA do tricoscópio, com a moldura à vista
const C3 = 285; // 9,50 s — dentro da imagem: os fios grossos, demorado

const CENAS = C1 + C2 + C3; // 441 frames = 14,70 s
const FECHO = 63; // 2,10 s de lockup parado
const TOTAL = CENAS + FECHO; // 504 frames = 16,80 s

/* A JANELA DO GANCHO SAIU DE MEDIDA, não de palpite. Varridos 40→48 s da fita
   P com nitidez (variância do laplaciano) e movimento quadro a quadro:

     · 42,9→45,9 — nitidez de 906 a 1078, subindo; movimento calmo, com um
       reenquadramento suave em 44,1 (o aparelho sobe no quadro);
     · depois de 46,0 o aparelho SAI do couro e o movimento salta de 2 para 23 —
       qualquer janela que atravesse esse ponto quebra;
     · antes de 42,0 a nitidez é 15% menor.

   Escolhida 42,90→45,90. O fim dela é o quadro mais calmo do trecho
   (movimento 0,87), e isso importa: é exatamente ali que o filme entra. */

export const PLANO_TRICOSCOPIA: PlanoTextoFixo = {
  marca: "fabricia",

  cortes: [
    {
      src: "fabricia/cortes-tricoscopia/c1_exame_3s.mp4",
      duracao: C1,
      /* O GANCHO DA v7: o exame de perto, SOZINHO e SEM MÁSCARA, 3,00 s —
         ordem dela em 20/09/2026. É o mesmo enquadramento que era o corte 2 da
         v6 (576×1024 em (272,260), o único recorte da peça que quase não
         reduz: 1152 px de fita para 1080 de entrega), mas agora numa janela
         mais longa e mais nítida. */
      origem:
        "Drive · Tricoscopia · 'Tricoscopia cabelo limpo' " +
        "(1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe) · 42,90→45,90 s · " +
        "recorte 576×1024 em (272, 260) · brilho −0,02",
    },
    {
      src: "fabricia/cortes-tricoscopia/c4_tela.mp4",
      duracao: C2,
      /* "EM SEGUIDA ENTRA A IMAGEM DA TRICOSCOPIA DO COURO CABELUDO."
         A TELA COMO TELA: moldura em cima e embaixo, pedaço do suporte —
         é o que diz que aquilo é uma tela, e foi ordem dela em 18/09 ("as
         pessoas têm que ver um pouco da tela"). Num instante de FIO GROSSO
         (85,8 s). Recorte 562×1000 = 1124 px na fita: não amplia. */
      origem:
        "Drive · Tricoscopia · 'Tricoscopia do couro cabeludo limpo' " +
        "(1sMIzGI1f7w1rt2Hkkbp55xGZm4dem9tu) · 85,80→88,00 s · " +
        "recorte 562×1000 em (260, 700) — a tela inteira, sem ajuste de brilho",
    },
    {
      src: "fabricia/cortes-tricoscopia/c5_fios_longo.mp4",
      duracao: C3,
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

  /* bottom 405: o bloco de 3 linhas (197,6 px) ocupa 1317 → 1515 px. Sobram
     45 px até os últimos 360 px do Reels. Continua valendo na v7: no gancho
     novo a legenda cai sobre o cabelo escuro, acima da sobrancelha dela —
     medido no corte pronto, não herdado. */
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
  /* 0,56 nesta peça, e o número vem de uma MEDIDA REFEITA.

     Histórico: 0,40 é o padrão; virou 0,44 quando o macro dos fios entrou
     (couro branco em macro sob a legenda) e 0,50 quando o zoom entrou na v6.

     Na v7 a conta foi refeita de um jeito mais honesto do que o da v6: em vez
     de estimar o brilho da faixa inteira, eu rendeirizei a peça DUAS vezes —
     uma com a legenda e outra sem — subtraí as duas para saber exatamente
     quais pixels são letra (9,5% da caixa, 15 832 px) e medi o fundo só
     DEBAIXO DELES. Por esse critério o 0,50 dá 4,12:1 no frame 140, no meio
     do zoom sobre a tela: abaixo do piso de 4,5.

     Isso corrige para baixo o "5,0:1" declarado na v6 — o corte da tela e o
     zoom são os mesmos, então o número da v6 estava otimista. 0,56 devolve
     4,79:1 e é o valor entregue aqui. Escurecer o plano continua fora de
     questão: a prova é justamente o couro limpo. */
  veu: veuDaLegenda(405, 3, 0.56),

  cabecalho: false,

  /* A GRAMÁTICA DA NEW HAIR, trazida em 20/09/2026 por ordem da dona
     ("vamos usar a edição remotion da new hair para editar os vídeos da
     Fabrícia Satza"). Ela escolheu manter o texto no padrão alinhado, então
     entram o filme, o beat, o zoom e os SFX — e NÃO entram o título digitado
     nem a legenda de rodapé, que exigiriam partir a frase.

     A VIRADA passou de 105 para o frame 90, porque a própria ordem dela a
     desenhou: *"vai entrar sozinha, sem mascarar, POR 3 SEGUNDOS; em seguida
     entra a imagem da tricoscopia"*. Fim do exame, entrada da imagem — 3,00 s
     = 90 frames. Numa peça falada a virada é o fim do gancho; aqui, sem fala,
     é a troca de assunto da montagem. O filme cai em 83→89 e o beat entra em
     90. O recorte da música anda junto: (ataque − virada) = 22,855 − 3,00.

     O ZOOM continua no plano da TELA — que agora é o corte 1, não o 3 —
     empurrando de 1,02 a 1,12 nos 15 frames antes do corte para o macro. É o
     movimento que motiva a entrada na imagem, e o único da peça. O §04 pede
     poucas alternâncias.

     SEM TENSÃO, e é decisão, não esquecimento: o §05 põe o grave na última
     palavra do PROBLEMA, e esta peça não tem problema delimitado — a frase é
     afirmativa do começo ao fim. Forçar tensão sem problema é inventar
     estrutura, o mesmo caso da NH_velocidade (14/09/2026). */
  hookEnd: 90,
  zoom: { corte: 1, frame: 40 },

  endCard: CENAS,
  duracao: TOTAL,

  /* O ÁUDIO DA ENTREGA NÃO SAI DAQUI. A casa renderiza a imagem em silêncio
     (`--muted`), mistura os stems por fora e faz o mux — é o que o §07 manda e
     o que evita a defasagem do motor. Este bloco só serve para a pré-escuta no
     Studio; os números de verdade estão no relatório da peça.

     Faixa: "lostmemories". A `harmony` da v5 tem entrada de +10,2 dB e não
     marca virada (o piso do padrão é ~+13); a lostmemories tem +26,7. Recorte
     em (ataque − virada) = 22,855 − 3,00 = 19,855 s. */
  audio: {
    src: "fabricia/musica/lostmemories.mp3",
    inicio: 19.855,
    volume: 0.531,
    fadeIn: 24,
    fadeOut: 36,
  },
};

export const DURACAO_TRICOSCOPIA = TOTAL;
