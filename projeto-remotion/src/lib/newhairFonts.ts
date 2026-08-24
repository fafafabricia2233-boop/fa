// ═══════════════════════════════════════════════════════════════════════════
// NEW HAIR — carregador LOCAL das fontes do padrão.
//
// POR QUE ISTO EXISTE (e por que NÃO é uma mudança de identidade):
//   O @remotion/google-fonts baixa a fonte do fonts.gstatic.com no momento do
//   render. O Chromium do Remotion não confia no CA do proxy desta máquina e o
//   render morre com ERR_CERT_AUTHORITY_INVALID / NetworkError.
//   Este módulo entrega EXATAMENTE as mesmas famílias e pesos do padrão
//   (Montserrat 300 e 500, Cormorant Garamond 500), lidas do disco.
//   Nada de cor, fonte, peso ou geometria muda. Só a origem do arquivo.
//   O projeto já tinha o mesmo precedente em src/lib/localFonts.ts.
//
// Arquivos: public/newhair/fontes/
// ═══════════════════════════════════════════════════════════════════════════

import { staticFile } from "remotion";

let injetado = false;

const podeUsarDom = () => typeof document !== "undefined" && !!document.head;

const injetarCss = (css: string) => {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};

// font-display:block faz o texto ESPERAR a fonte local (que carrega em ms),
// em vez de queimar um frame com a fonte de fallback.
const CSS = () => `
  @font-face {
    font-family: 'Montserrat';
    src: url('${staticFile("newhair/fontes/Montserrat-Light.ttf")}') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'Montserrat';
    src: url('${staticFile("newhair/fontes/Montserrat-Medium.ttf")}') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'Cormorant Garamond';
    src: url('${staticFile("newhair/fontes/CormorantGaramond-Medium.woff2")}') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: block;
  }
`;

const aquecer = () => {
  if (typeof document === "undefined" || !document.fonts) return;
  for (const spec of [
    '300 36px "Montserrat"',
    '500 48px "Montserrat"',
    '500 46px "Cormorant Garamond"',
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

/** Mesma assinatura do @remotion/google-fonts: retorna { fontFamily }. */
export const loadMontserratNH = (): { fontFamily: string } => {
  garantir();
  return { fontFamily: "Montserrat" };
};

/** Mesma assinatura do @remotion/google-fonts: retorna { fontFamily }. */
export const loadCormorantNH = (): { fontFamily: string } => {
  garantir();
  return { fontFamily: "Cormorant Garamond" };
};
