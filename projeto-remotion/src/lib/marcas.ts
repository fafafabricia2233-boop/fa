/* =============================================================================
   PERFIS DE MARCA

   Existe porque agora há DUAS marcas na mesma casa: New Hair (a clínica) e
   Fabrícia Satza (a tricologista). O manual da New Hair é explícito em §01:
   "Não misture recursos de outras marcas." Então a identidade sai do código
   das peças e vira dado — cada peça declara de quem ela é.

   O que é identidade (muda por marca): cor, fonte, geometria do título e da
   legenda, selo de compliance, logo do fim.
   O que NÃO é identidade (é gramática de montagem, igual nas duas): escolha da
   última tentativa completa da fala, contrato das bordas, gancho virando
   título, digitação com teto de 2 s, filme na virada, tensão terminando na
   última palavra do problema, apoio que prova a fala.
   ============================================================================= */

import { loadCormorantNH, loadMontserratNH } from "./newhairFonts";

export type Marca = {
  id: string;
  nome: string;

  cores: {
    /** fundo do quadro e base dos véus */
    fundo: string;
    /** cor do núcleo de sentido (a palavra que carrega a frase) */
    destaque: string;
    /** cor do texto comum */
    texto: string;
  };

  fontes: {
    corpo: () => { fontFamily: string };
    /** usada em frase de impacto pontual; opcional */
    serif?: () => { fontFamily: string };
  };

  titulo: {
    /** distância do topo, em px. null = centralizado no meio exato do quadro */
    top: number | null;
    tamanhoLinha: number;
    tamanhoRemate: number;
    letterSpacing: number;
    paddingLateral: number;
  };

  legenda: {
    bottom: number;
    corpo: number;
    destaque: number;
    paddingLateral: number;
  };

  /** linha de compliance. texto null = esta marca não usa selo. */
  selo: {
    texto: string | null;
    bottom: number;
    tamanho: number;
    letterSpacing: number;
    opacidade: number;
  };

  /** animação final. arquivo null = esta marca ainda não tem logo no projeto. */
  logo: {
    arquivo: string | null;
    frames: number;
  };

  /**
   * O que falta pra esta marca poder ir pro ar. Enquanto tiver item aqui, o
   * motor NÃO renderiza peça: ele mostra a lista na tela. Marca vazia é pior
   * que erro — sai peça com a cara da marca errada e ninguém percebe até
   * publicar.
   */
  pendencias: string[];
};

/* -----------------------------------------------------------------------------
   NEW HAIR — completa. Os números vêm do exemplo aprovado (kit-new-hair/
   exemplo-aprovado/src/video.tsx + plan.json), conferidos contra a prancha
   quadros-Stephanie.jpg em 12/09/2026.
----------------------------------------------------------------------------- */
export const NEW_HAIR: Marca = {
  id: "newhair",
  nome: "New Hair",
  cores: {
    fundo: "#0B2436",
    destaque: "#C9A24A",
    texto: "#F7F3EA",
  },
  fontes: {
    corpo: loadMontserratNH,
    serif: loadCormorantNH,
  },
  titulo: {
    top: 270,
    tamanhoLinha: 48,
    tamanhoRemate: 72,
    letterSpacing: 2.4,
    paddingLateral: 90,
  },
  legenda: {
    bottom: 430,
    corpo: 34,
    destaque: 42,
    paddingLateral: 100,
  },
  selo: {
    texto: "Procedimento realizado por médico · a New Hair realiza a instrumentação",
    bottom: 300,
    tamanho: 20,
    letterSpacing: 1.2,
    opacidade: 0.6,
  },
  logo: {
    // mesmo asset da marca d'água: 191 frames, conferido contra o manual §06
    arquivo: "newhair/marca_dagua_30fps.mp4",
    frames: 191,
  },
  pendencias: [],
};

/* -----------------------------------------------------------------------------
   FABRÍCIA SATZA — a gramática de montagem já está pronta (é a mesma); o que
   falta é a identidade dela.

   NÃO herdar a paleta da New Hair por preguiça: peça dela com azul-marinho e
   dourado da clínica é peça da clínica com o rosto errado. Os campos abaixo
   ficam com os valores da NEW HAIR só como ESQUELETO de geometria (que é
   medida de tela, não identidade) — cor, fonte, selo e logo estão declarados
   como pendência e o motor se recusa a renderizar até serem preenchidos.

   Hipótese levantada em 12/09, NÃO confirmada: dois carrosséis deste
   repositório usam uma paleta diferente da New Hair — preto #0a0a0a, dourado
   mais claro #C9A96E, azul profundo #1a2a6c, display "Catchy Mager". Mas
   esses arquivos estão assinados @newhair_fue, então não servem como prova da
   identidade dela. Precisa de um carrossel dela de verdade.
----------------------------------------------------------------------------- */
export const FABRICIA: Marca = {
  id: "fabricia",
  nome: "Fabrícia Satza",
  cores: {
    fundo: "#0B2436",
    destaque: "#C9A24A",
    texto: "#F7F3EA",
  },
  fontes: {
    corpo: loadMontserratNH,
  },
  titulo: {
    top: 270,
    tamanhoLinha: 48,
    tamanhoRemate: 72,
    letterSpacing: 2.4,
    paddingLateral: 90,
  },
  legenda: {
    bottom: 430,
    corpo: 34,
    destaque: 42,
    paddingLateral: 100,
  },
  selo: {
    texto: null,
    bottom: 300,
    tamanho: 20,
    letterSpacing: 1.2,
    opacidade: 0.6,
  },
  logo: {
    arquivo: null,
    frames: 0,
  },
  pendencias: [
    "cores: fundo, destaque e texto (os valores aqui são os da New Hair, de esqueleto)",
    "fontes: família do corpo e do destaque + os arquivos em public/marcas/fabricia/fontes/",
    "selo: se a peça dela leva linha de compliance e qual é o texto exato",
    "logo/assinatura do fim: arquivo e duração em frames",
    "referência aprovada: pelo menos um carrossel ou vídeo dela pra comparar",
  ],
};

export const MARCAS: Record<string, Marca> = {
  newhair: NEW_HAIR,
  fabricia: FABRICIA,
};

export const pegarMarca = (id: string): Marca => {
  const m = MARCAS[id];
  if (!m) {
    throw new Error(
      `Marca "${id}" não existe. Cadastradas: ${Object.keys(MARCAS).join(", ")}.`
    );
  }
  return m;
};
