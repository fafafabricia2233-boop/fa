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

   1. "Mostrando cabelo bonito finalizado" (L) 17,00→19,80  ← TROCADO em 17/09
      DE COSTAS, o cabelo INTEIRO na tela — silhueta completa, não textura —,
      cheio e com movimento de verdade (ela sacode e levanta o cabelo). Pedido
      dela: abrir mostrando o cabelo bonito finalizado de costas. É a prova do
      "eu cuido da definição" antes de a frase ser lida — o resultado abre a
      peça, não o processo.
      O recorte é 810×1440 em (0, 480), e a largura é o número que manda: o
      cabelo mede ~800 px de largura na fita, então recorte mais estreito que
      isso corta a silhueta. Como 9:16 amarra altura à largura, 810 de largura
      pede 1440 de altura, e a barra do boxe (y 690→770) entra no alto. É o
      preço de ver o cabelo inteiro: a fita não tem céu suficiente abaixo dela.
      SAIU daqui o "passando protetor térmico" (F, 3,70→6,50): bom gesto e
      rosto na lente, mas é o PROCESSO, e ela pediu o resultado.
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
import { LEGENDA_ALINHADA, veuDaLegenda } from "../lib/legendaFabricia";

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
        "Drive · Mostrando o cabelo · " +
        "'Mostrando cabelo bonito finalizado repartindo ao meio o couro cabeludo' " +
        "(1f3khS0vJfGb4O4nw10Z1zh_XJGyOq-T6) · 17,00→19,80 s · " +
        "recorte 810×1440 em (0, 480)",
    },
    {
      src: "fabricia/cortes/clip2_volume.mp4",
      duracao: C2,
      origem:
        "Drive · usando secador · " +
        "'usando secador no cabelo, dando volume no cabelo crespo' " +
        "(1wl0D2pX1UbPrbsNnqlRGw9EMB5T3C6lu) · 68,30→71,00 s · " +
        "recorte 792×1408 em (184, 86)",
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
  /* UM bloco só, quatro linhas EQUILIBRADAS — o pedido de 17/09: "que a
     legenda fique bonita alinhadinha minimalista".

     A referência que ela apontou (a rotina no chuveiro) tem seis linhas com
     larguras de 618, 566, 567 e 596 px em 1080: variação de 9%. É isso que o
     olho lê como "alinhadinha" — não a quebra em unidade de sentido, e sim a
     forma do bloco. Lá as linhas terminam em "but" e em "to" de propósito.

     Aqui, medidas as quebras possíveis contra o arquivo da fonte, esta é a
     mais equilibrada que ainda deixa cada linha legível:
        413 · 625 · 525 · 473 px  (variação 212 contra 386 da versão anterior)
     O preço é a linha 1 acabar em "da", que é exatamente o que a referência
     faz. Sem respiro entre as frases: lá é um bloco corrido só. */
  paragrafos: [
    {
      linhas: [
        { partes: [{ texto: "Eu cuido muito da" }] },
        { partes: [{ texto: "definição dos meus cachos." }] },
        { partes: [{ texto: "Mas não deixo o couro" }] },
        { partes: [{ texto: "cabeludo por último." }] },
      ],
    },
  ],

  /* PADRÃO DE LEGENDA ALINHADA — os números e o porquê estão em
     src/lib/legendaFabricia.ts. Aqui só o que é desta peça: a altura do bloco
     na tela, que depende de onde o rosto e o assunto caem no enquadramento.
     bottom 522 ⇒ o bloco de 4 linhas (263,5 px) ocupa 1134 → 1398 px: abaixo
     do queixo nos dois planos de rosto e bem acima dos últimos 360 px. */
  texto: { ...LEGENDA_ALINHADA, bottom: 522 },

  /* Sem cabeçalho: ver a nota no tipo. A marca fica identificada pela fonte
     oficial, pelo champagne da ênfase, pelo café do véu e pelo lockup do fim —
     e a imagem ocupa a tela toda, que é a ordem permanente da dona (14/09). */
  cabecalho: false,

  /* Peça entregue antes de 20/09/2026, quando a gramática da New Hair (filme
     na virada, beat, zoom) chegou na peça de texto fixo. Fica sem virada
     marcada pra não alterar o que já foi entregue. */
  hookEnd: null,
  zoom: null,

  /* Véu localizado, não placa: gradiente com cauda dos DOIS lados (170 px),
     porque véu que acaba seco em cima de parede lisa vira linha horizontal —
     defeito já medido nesta casa em 14 e 15/09/2026. */
  veu: veuDaLegenda(522, 4),

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
