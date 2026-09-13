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
import { loadFabriciaDisplay, loadFabriciaTexto } from "./fabriciaFonts";

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
    /** face de título/display. Sem ela, o título usa a do corpo. */
    display?: () => { fontFamily: string };
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

  /**
   * Assinatura permanente no alto do quadro, um rótulo em cada canto. É o que
   * identifica a peça quando ela é printada e recompartilhada sem o perfil
   * junto. null = esta marca não usa.
   */
  cabecalho: {
    esquerda: string;
    /** muda por tema: "Queda capilar", "Alopecia", "Tricoscopia"… */
    direita: string;
    tamanho: number;
    /** em px, já convertido do tracking em em */
    letterSpacing: number;
    top: number;
    opacidade: number;
  } | null;

  /** linha de compliance. texto null = esta marca não usa selo. */
  selo: {
    texto: string | null;
    bottom: number;
    tamanho: number;
    letterSpacing: number;
    opacidade: number;
  };

  /** fechamento da peça. arquivo null = esta marca não tem assinatura final. */
  logo: {
    arquivo: string | null;
    frames: number;
    /** "video" = animação; "imagem" = logo parada sobre um fundo da marca */
    tipo: "video" | "imagem";
    /** só para tipo "imagem": cor de fundo e largura da logo em px */
    fundo?: string;
    largura?: number;
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
  cabecalho: null,
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
    tipo: "video",
  },
  pendencias: [],
};

/* -----------------------------------------------------------------------------
   FABRÍCIA SATZA — identidade recebida em 13/09/2026 (ZIP oficial: paleta com
   tabela de contraste, três faces de fonte, logo em cinco cores, manual e tom
   de voz). Instalada em marcas/fabricia-satza/.

   O manual dela é feito pra CARROSSEL 1080×1440 sobre fundo claro. Vídeo é
   outro suporte: o texto mora sobre imagem, não sobre papel. As escolhas
   abaixo são a tradução, e cada uma sai de uma regra escrita no manual dela —
   nenhuma é gosto:

   · FUNDO/VÉU = café profundo #28201F. O manual dá a ele dois papéis: "texto
     sobre claro E fundo escuro neutro". É o escuro sóbrio; o vinho ameixa é o
     escuro de virada, forte demais pra ficar a peça inteira no ar.

   · DESTAQUE = champagne #C9B39B, não terracota. Esta é a regra que o manual
     dela mais insiste, porque já quebrou uma versão do CSS: "taupe e champagne
     se invertem conforme o fundo". Sobre escuro, champagne dá 7,9:1 e vira o
     acento; marrom terracota cai pra 2,8:1 (reprovado) e terracota suave pra
     4,0:1 — que só passa de 45px pra cima. Legenda de 42px em terracota seria
     exatamente o erro que ela documentou.

   · TEXTO = branco suave #FCFAF7, 15,3:1 sobre café.

   · TIPOGRAFIA: título na face Alt (o "a" de um andar, que o manual reserva
     pra display) e legenda na Light. A ênfase é peso 500 REAL (face Medium),
     nunca negrito sintético.

   · TAMANHOS: o piso dela é 37px em texto corrido — a legenda da New Hair
     (34/42) fica ABAIXO desse piso e não serve aqui. Então legenda 45/52
     ("texto" e "subtítulo" da escala dela) e título 52/88 ("subtítulo" e
     "título"), mantendo a headline ~1,7x a legenda, que é a proporção do
     padrão aprovado.

   · MARGEM 80px, a da grade dela (a New Hair usa 90/100).

   · CABEÇALHO: "FABRÍCIA SATZA TRICOLOGIA" à esquerda e o eixo do tema à
     direita, 22px, tracking .30em (= 6,6px). O manual diz "todo slide, sem
     exceção" — é o que faz a peça continuar identificada quando é printada e
     recompartilhada sem o perfil junto. O campo `direita` muda por peça.

   · FIM: ela não tem animação de logo, tem lockup parado. Então o fechamento é
     a logo em marfim sobre café profundo. 90 frames = 3 s.

   · SELO: não tem. Peça de tricologia dela não é ato cirúrgico da clínica, e
     o selo da New Hair não atravessa pra cá.
----------------------------------------------------------------------------- */
export const FABRICIA: Marca = {
  id: "fabricia",
  nome: "Fabrícia Satza",
  cores: {
    fundo: "#28201F", // café profundo
    destaque: "#C9B39B", // champagne — o acento sobre escuro
    texto: "#FCFAF7", // branco suave
  },
  fontes: {
    corpo: loadFabriciaTexto,
    display: loadFabriciaDisplay,
  },
  cabecalho: {
    esquerda: "FABRÍCIA SATZA TRICOLOGIA",
    direita: "SAÚDE CAPILAR",
    tamanho: 22,
    letterSpacing: 6.6, // .30em a 22px
    top: 64, // grade dela: cabeçalho a 64px do topo
    opacidade: 0.75,
  },
  titulo: {
    top: 170, // grade dela: conteúdo começa a 170px do topo
    tamanhoLinha: 52, // subtítulo
    tamanhoRemate: 88, // título
    letterSpacing: 1.5,
    paddingLateral: 80, // margem lateral da grade dela
  },
  legenda: {
    bottom: 430,
    corpo: 45, // "texto" — e o piso dela é 37
    destaque: 52, // "subtítulo"
    paddingLateral: 80,
  },
  selo: {
    texto: null,
    bottom: 300,
    tamanho: 22,
    letterSpacing: 6.6,
    opacidade: 0.75,
  },
  logo: {
    arquivo: "marcas/fabricia/logo/fs-lockup-marfim.png",
    frames: 90,
    tipo: "imagem",
    fundo: "#28201F",
    largura: 620,
  },
  pendencias: [],
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
