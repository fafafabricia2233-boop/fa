// ═══════════════════════════════════════════════════════════════════════════
// FABRÍCIA SATZA — carregador LOCAL da fonte da marca pessoal.
//
// Marca pessoal (tricologia e queda capilar). NÃO é a New Hair: paleta,
// tipografia e tom são outros. Ver "Padrão de Carrossel — Fabrícia Satza.md".
//
// Mesmo motivo do newhairFonts.ts: o Chromium do Remotion não confia no CA do
// proxy desta máquina, então nada de fonte remota — os arquivos vêm do disco.
//
// Duas famílias, mesma fonte, diferença só no desenho do 'a':
//   'Fabricia Satza Light'      → 'a' de dois andares  (texto corrido)
//   'Fabricia Satza Light Alt'  → 'a' de um andar      (títulos)
//
// Arquivos: public/fabricia/fontes/ (SIL OFL 1.1, licença junto)
// ═══════════════════════════════════════════════════════════════════════════

import { staticFile } from "remotion";

export const FABRICIA_TEXTO = "Fabricia Satza Light";
export const FABRICIA_TITULO = "Fabricia Satza Light Alt";

let injetado = false;

const podeUsarDom = () => typeof document !== "undefined" && !!document.head;

const injetarCss = (css: string) => {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};

// font-display:block faz o texto ESPERAR a fonte local (carrega em ms), em vez
// de queimar um frame com a fonte de fallback.
const CSS = () => `
  @font-face {
    font-family: '${FABRICIA_TEXTO}';
    src: url('${staticFile("fabricia/fontes/FabriciaSatzaLight-Regular.woff2")}') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: '${FABRICIA_TITULO}';
    src: url('${staticFile("fabricia/fontes/FabriciaSatzaLightAlt-Regular.woff2")}') format('woff2');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
`;

const aquecer = () => {
  if (typeof document === "undefined" || !document.fonts) return;
  for (const spec of [
    `300 40px "${FABRICIA_TEXTO}"`,
    `300 120px "${FABRICIA_TITULO}"`,
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
    injetarCss(CSS());
    aquecer();
  }
};

/** Fonte de texto corrido — 'a' de dois andares. Assinatura igual à do google-fonts. */
export const loadFabriciaTexto = (): { fontFamily: string } => {
  garantir();
  return { fontFamily: FABRICIA_TEXTO };
};

/** Fonte de título — 'a' de um andar, o desenho dos posters da marca. */
export const loadFabriciaTitulo = (): { fontFamily: string } => {
  garantir();
  return { fontFamily: FABRICIA_TITULO };
};
