/* =============================================================================
   FABRÍCIA SATZA — PADRÃO DE LEGENDA ALINHADA

   Ordem da dona, 17/09/2026: "salve esse padrão de legenda bonita e alinhada".

   ---------------------------------------------------------------------------
   DE ONDE SAEM OS NÚMEROS

   Tudo aqui foi MEDIDO na referência que ela apontou (a rotina no chuveiro),
   quadro a quadro, convertido para um quadro de 1080×1920:

     · linhas com 618 · 566 · 567 · 596 px  → variação de 9%
     · passo entre linhas 51 px, com corpo de ~48 px → razão 1,06
     · centralizada, texto branco, sem caixa, sem sombra, sem respiro entre
       frases (é um bloco corrido só)

   E a lição que isso ensinou: **o que o olho lê como "alinhadinha" é a
   variação de largura entre as linhas, não a quebra em unidade de sentido.**
   A referência quebra em cima de palavra pequena de propósito — as linhas dela
   terminam em "but" e em "to". A legenda da FS_couro_cachos v6 tinha 661 · 420
   · 806 · 255 (variação de 48%): cada linha era uma unidade de sentido
   perfeita e o bloco parecia bagunçado mesmo assim.

   ---------------------------------------------------------------------------
   O QUE NÃO SE COPIA DA REFERÊNCIA

   · A LETRA. A da referência é uma serifada de livro. A marca usa a "Fabrícia"
     (Futura PT) que a dona mandou em 16/09. O §01 do pedido dela é explícito:
     não substituir por fonte "visualmente semelhante". Trocar a identidade
     tipográfica é decisão da dona, nunca do editor.
   · A COR. Lá o texto é escuro sobre azulejo claro. Sobre cabelo escuro e
     espuma isso sumiria; aqui é branco suave sobre véu leve.
   · A ENTRELINHA EXATA. 1,06 é de texto em inglês. O português carrega til e
     acento agudo no meio do bloco: medido a 54 px, com 1,22 sobram 17 px entre
     o descendente de uma linha e o til de "definição" na seguinte. Abaixo
     disso eles se encostam. **1,22 é o piso, não um gosto.**

   ---------------------------------------------------------------------------
   COMO USAR NUMA PEÇA NOVA

   1. Rode `python3 scripts/quebrar-legenda.py "<o texto inteiro>"` — ele mede
      todas as divisões possíveis contra o ARQUIVO da fonte e devolve a mais
      equilibrada de cada contagem de linhas. Os números da peça pronta não
      transferem; a conta transfere.
   2. Escolha a de menor variação que ainda cabe na caixa. Abaixo de ~25% já lê
      como bloco; acima de ~40% lê como bagunça.
   3. No plano: `texto: { ...LEGENDA_ALINHADA, bottom: <a altura desta peça> }`
      e `veu: veuDaLegenda(bottom)`.
   4. `bottom` é o único número que muda por peça, porque depende de onde o
      rosto e o assunto caem no enquadramento. Regra da área segura: o bloco
      começa abaixo de 220 px e termina acima de 1560 px.
   ============================================================================= */

import type { PlanoTextoFixo } from "../compositions/ReelTextoFixo";

/** Corpo em px. Muda junto com a fonte — ver a nota de altura de x abaixo. */
export const CORPO_LEGENDA = 54;

/**
 * Razão de entrelinha. 1,22 é o PISO para português a 54 px (til x
 * descendente). A referência usa 1,06, mas é texto em inglês.
 */
export const ENTRELINHA_LEGENDA = 1.22;

/** Margens da caixa: 90 à esquerda, 150 à direita (controles do Reels). */
export const MARGEM_ESQ = 90;
export const MARGEM_DIR = 150;

/** Largura útil que a quebra tem que respeitar: 1080 − 90 − 150. */
export const CAIXA_LEGENDA = 1080 - MARGEM_ESQ - MARGEM_DIR;

/**
 * O padrão. `bottom` vem com o valor da FS_couro_cachos e É PRA SER
 * SOBRESCRITO por peça — é o único número que depende do enquadramento.
 */
export const LEGENDA_ALINHADA: PlanoTextoFixo["texto"] = {
  tamanho: CORPO_LEGENDA,
  entrelinha: ENTRELINHA_LEGENDA,
  respiro: 0, // bloco corrido: a referência não tem respiro entre frases
  bottom: 522,
  margemEsquerda: MARGEM_ESQ,
  margemDireita: MARGEM_DIR,
  alinhamento: "center",
  face: "corpo",
  familia: "Fabricia", // a fonte que a dona mandou em 16/09/2026
  enfaseCor: "texto",
};

/**
 * Altura do bloco em px, para posicionar sem chutar.
 * Ex.: 4 linhas → 4 × 54 × 1,22 = 263,5 px.
 */
export const alturaDoBloco = (linhas: number) =>
  linhas * CORPO_LEGENDA * ENTRELINHA_LEGENDA;

/**
 * Véu que acompanha o bloco: gradiente de café profundo com cauda longa nos
 * dois lados, nunca placa. 0,40 é o mínimo medido que ainda segura o branco
 * acima de 4,5:1 sobre a camiseta verde-clara. Véu que acaba seco em cima de
 * parede lisa vira linha horizontal visível — daí a cauda de 190 px.
 */
export const veuDaLegenda = (
  bottom: number,
  linhas = 4
): PlanoTextoFixo["veu"] => {
  const base = 1920 - bottom;
  const topo = base - alturaDoBloco(linhas);
  return {
    topo: Math.round(topo - 34),
    base: Math.round(base + 22),
    cauda: 190,
    alfa: 0.4,
  };
};
