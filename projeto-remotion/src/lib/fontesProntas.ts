/* =============================================================================
   PORTÃO DE FONTE, POR MARCA

   Por que existe: os carregadores (`newhairFonts.ts`, `fabriciaFonts.ts`)
   injetam o @font-face e "aquecem" as faces, mas não SEGURAM o render. O
   Remotion pode pintar o frame 0 antes de o woff2 terminar de carregar, e aí o
   Chromium mede o texto com a fonte de fallback — largura diferente, quebra
   diferente, e a peça sai com a tipografia errada sem erro nenhum. O §07 do
   manual é explícito: carregar FontFace dentro do ciclo React, com
   delayRender/continueRender.

   O irmão mais velho disto é `fabriciaFontesProntas.ts`, que faz o mesmo só
   para a Fabrícia e continua servindo as peças de texto fixo. Este aqui existe
   porque o motor falado é multimarca: ele pergunta ao PERFIL quais faces a
   marca declara e espera exatamente essas.

   A lista vem de `Marca.faces`, e é de propósito que ela seja explícita: pedir
   um peso que a família não tem faz o navegador sintetizar (engordar a forma),
   o que o manual da Fabrícia proíbe.
   ============================================================================= */

import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import type { Marca } from "./marcas";

export const useFontesProntas = (m: Marca): boolean => {
  const [pronto, setPronto] = useState(false);
  const [handle] = useState(() => delayRender(`Carregando as faces de ${m.nome}`));

  useEffect(() => {
    // injeta os @font-face antes de pedir o load
    m.fontes.corpo();
    m.fontes.display?.();
    m.fontes.serif?.();
    m.fontes.enfase?.();

    let vivo = true;
    const carregar = async () => {
      try {
        if (typeof document === "undefined" || !document.fonts) {
          if (vivo) setPronto(true);
          continueRender(handle);
          return;
        }
        await Promise.all(m.faces.map((spec) => document.fonts.load(spec)));
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
  }, [handle, m]);

  return pronto;
};
