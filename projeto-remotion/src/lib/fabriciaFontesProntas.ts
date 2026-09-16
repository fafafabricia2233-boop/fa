/* =============================================================================
   FABRÍCIA SATZA — PORTÃO DE FONTE

   Por que existe: o `fabriciaFonts.ts` injeta o @font-face e "aquece" as faces,
   mas não SEGURA o render. O Remotion pode pintar o frame 0 antes de o woff2
   terminar de carregar, e aí o Chromium mede o texto com a fonte de fallback —
   quebra de linha diferente, largura diferente, e a peça sai com a tipografia
   errada sem erro nenhum.

   Este módulo devolve um hook que chama `delayRender()` até
   `document.fonts.load()` resolver PARA AS TRÊS FACES que a peça usa, e só
   então `continueRender()`. É o que o pedido exige: "aguarde o carregamento
   antes de medir textos ou renderizar frames".

   As faces são só estas, e é de propósito: pedir um peso que não existe faz o
   navegador sintetizar (engordar/inclinar a forma), o que o manual dela proíbe.
   ============================================================================= */

import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { loadFabriciaDisplay, loadFabriciaTexto } from "./fabriciaFonts";

/** As únicas especificações de fonte que a marca tem de verdade. */
export const FACES_FABRICIA = [
  '300 54px "Fabricia Satza"', // Light — texto corrido
  '500 54px "Fabricia Satza"', // Medium — a ênfase (peso 500 REAL)
  '300 88px "Fabricia Satza Alt"', // Light Alt — display
] as const;

export type FonteCarregada = {
  familia: string;
  peso: number;
  arquivo: string;
};

/** O que de fato foi carregado — vai para o relatório de entrega. */
export const FONTES_DECLARADAS: FonteCarregada[] = [
  {
    familia: "Fabricia Satza",
    peso: 300,
    arquivo: "marcas/fabricia/fontes/FabriciaSatzaLight-Regular.woff2",
  },
  {
    familia: "Fabricia Satza",
    peso: 500,
    arquivo: "marcas/fabricia/fontes/FabriciaSatzaMedium-Regular.woff2",
  },
  {
    familia: "Fabricia Satza Alt",
    peso: 300,
    arquivo: "marcas/fabricia/fontes/FabriciaSatzaLightAlt-Regular.woff2",
  },
];

/**
 * Segura o render até as faces da marca estarem carregadas de verdade.
 * Devolve `true` quando pode medir/pintar texto.
 */
export const useFontesFabriciaProntas = (): boolean => {
  const [pronto, setPronto] = useState(false);
  const [handle] = useState(() =>
    delayRender("Carregando as faces da Fabrícia Satza")
  );

  useEffect(() => {
    // injeta o @font-face antes de pedir o load
    loadFabriciaTexto();
    loadFabriciaDisplay();

    let vivo = true;

    const carregar = async () => {
      try {
        if (typeof document === "undefined" || !document.fonts) {
          // sem FontFaceSet não há o que esperar; segue e deixa o CSS resolver
          if (vivo) setPronto(true);
          continueRender(handle);
          return;
        }
        await Promise.all(
          FACES_FABRICIA.map((spec) => document.fonts.load(spec))
        );
        await document.fonts.ready;
        if (vivo) setPronto(true);
        continueRender(handle);
      } catch (e) {
        cancelRender(e as Error);
      }
    };

    void carregar();
    return () => {
      vivo = false;
    };
  }, [handle]);

  return pronto;
};
