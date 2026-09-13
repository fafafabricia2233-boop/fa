/* =============================================================================
   FABRÍCIA SATZA — carregador local da fonte da marca.

   A família é a "Fabrícia Satza", derivada da Jost* sob SIL OFL 1.1. Três
   faces, e o manual dela é explícito sobre o porquê de serem três:

     Light      (300, "a" de dois andares) — texto corrido e rótulos
     Light Alt  (300, "a" de um andar)     — títulos e display
     Medium     (500)                       — a ênfase

   REGRA QUE NÃO SE QUEBRA: nunca usar negrito sintético. Pedir font-weight 700
   sem ter a face faz o navegador engordar a forma e destrói o desenho da letra.
   Por isso as faces entram como famílias/pesos declarados, e o peso 500 existe
   de verdade.

   Os arquivos ficam em public/marcas/fabricia/fontes/ (woff2). Lidos do disco
   pelo mesmo motivo da New Hair: o Chromium do Remotion não confia no CA do
   proxy desta máquina e baixar fonte durante o render mata o render.

   A licença exige distribuir o OFL.txt junto quando o ARQUIVO da fonte é
   entregue a alguém — por isso o OFL.txt está ao lado dos woff2. Publicar
   vídeo feito com ela não exige nada.
   ============================================================================= */

import { staticFile } from "remotion";

let injetado = false;

const podeUsarDom = () => typeof document !== "undefined" && !!document.head;

const CSS = () => `
  @font-face {
    font-family: 'Fabricia Satza';
    src: url('${staticFile("marcas/fabricia/fontes/FabriciaSatzaLight-Regular.woff2")}') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'Fabricia Satza';
    src: url('${staticFile("marcas/fabricia/fontes/FabriciaSatzaMedium-Regular.woff2")}') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'Fabricia Satza Alt';
    src: url('${staticFile("marcas/fabricia/fontes/FabriciaSatzaLightAlt-Regular.woff2")}') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
`;

const aquecer = () => {
  if (typeof document === "undefined" || !document.fonts) return;
  for (const spec of [
    '300 45px "Fabricia Satza"',
    '500 52px "Fabricia Satza"',
    '300 88px "Fabricia Satza Alt"',
  ]) {
    try {
      void document.fonts.load(spec);
    } catch {
      /* noop */
    }
  }
};

const garantir = () => {
  if (!injetado && podeUsarDom()) {
    injetado = true;
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(CSS()));
    document.head.appendChild(style);
    aquecer();
  }
};

/** Texto corrido, rótulos e a ênfase (peso 500 de verdade). */
export const loadFabriciaTexto = (): { fontFamily: string } => {
  garantir();
  return { fontFamily: "Fabricia Satza" };
};

/** Títulos e display — o "a" de um andar. */
export const loadFabriciaDisplay = (): { fontFamily: string } => {
  garantir();
  return { fontFamily: "Fabricia Satza Alt" };
};
