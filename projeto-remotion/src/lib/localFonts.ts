// ═══════════════════════════════════════════════════════════════════════════
// Carregador de fontes LOCAL (offline). Substitui @remotion/google-fonts
// para ambientes sem acesso ao fonts.gstatic.com.
//
// Estratégia robusta:
//   1. Injeta @font-face via <style> (CSS) apontando para staticFile.
//   2. Aguarda document.fonts via delayRender, mas com timeout de segurança
//      que SEMPRE libera o render (nunca trava em 28s).
// ═══════════════════════════════════════════════════════════════════════════

import { staticFile } from "remotion";

let antonInjected = false;
let montserratInjected = false;

const canUseDom = () =>
  typeof document !== "undefined" && !!document.head;

const injectStyle = (css: string) => {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};

// Dispara o carregamento das fontes sem bloquear o render (sem delayRender).
// font-display:block garante que o texto espere a fonte local (carrega rápido).
const primeFonts = (families: string[]) => {
  if (typeof document === "undefined" || !document.fonts) return;
  families.forEach((f) => {
    try {
      void document.fonts.load(`900 16px "${f}"`);
      void document.fonts.load(`700 16px "${f}"`);
    } catch {
      /* noop */
    }
  });
};

export const loadAnton = (): { fontFamily: string } => {
  if (!antonInjected && canUseDom()) {
    antonInjected = true;
    injectStyle(`
      @font-face {
        font-family: 'Anton';
        src: url('${staticFile("fonts/Anton-Regular.ttf")}') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }
    `);
    primeFonts(["Anton"]);
  }
  return { fontFamily: "Anton" };
};

export const loadMontserratLocal = (): { fontFamily: string } => {
  if (!montserratInjected && canUseDom()) {
    montserratInjected = true;
    injectStyle(`
      @font-face {
        font-family: 'Montserrat';
        src: url('${staticFile("fonts/Montserrat-Bold.ttf")}') format('truetype');
        font-weight: 700; font-style: normal; font-display: block;
      }
      @font-face {
        font-family: 'Montserrat';
        src: url('${staticFile("fonts/Montserrat-ExtraBold.ttf")}') format('truetype');
        font-weight: 800; font-style: normal; font-display: block;
      }
      @font-face {
        font-family: 'Montserrat';
        src: url('${staticFile("fonts/Montserrat-Black.ttf")}') format('truetype');
        font-weight: 900; font-style: normal; font-display: block;
      }
      @font-face {
        font-family: 'Montserrat';
        src: url('${staticFile("fonts/Montserrat-BlackItalic.ttf")}') format('truetype');
        font-weight: 900; font-style: italic; font-display: block;
      }
    `);
    primeFonts(["Montserrat"]);
  }
  return { fontFamily: "Montserrat" };
};
