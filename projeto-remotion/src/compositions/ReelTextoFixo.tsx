/* =============================================================================
   REEL DE TEXTO FIXO — motor multimarca (usado pela Fabrícia Satza)

   O QUE ELE É: uma peça sem fala, em que UM bloco de texto fica parado na tela
   do primeiro ao último frame e a imagem troca por baixo dele. É o formato
   "rotina com texto fixo" — o texto conduz, as imagens dão contexto, expressão
   e movimento.

   POR QUE NÃO É O ReelFalado: aquele motor nasce de uma fita falada — gancho
   virando título digitado, legendas coladas na fala, beat caindo na virada.
   Aqui não há fala nem virada; há uma frase só e cortes de apoio. Forçar o
   outro motor significaria animação de digitação e legenda por cue, que é
   exatamente o que este formato proíbe.

   REGRAS QUE ESTÃO NO CÓDIGO DE PROPÓSITO:

   · O bloco de texto mora FORA das Sequences de vídeo. Se morasse dentro, ele
     seria remontado a cada corte e piscaria na troca. É requisito do pedido.

   · Nada de animação no texto: sem digitação, sem palavra a palavra, sem
     brilho, sem salto. Ele entra com a peça e sai com ela.

   · As fontes são carregadas do disco e o render ESPERA por elas
     (useFontesFabriciaProntas). Medir texto com fallback muda a quebra de linha.

   · Pesos sintéticos desligados (`fontSynthesis: none`). A ênfase é a face
     Medium de verdade, peso 500 — o manual dela proíbe negrito sintético.

   · O véu atrás do texto é gradiente com CAUDA LONGA nos dois lados. Véu que
     termina seco em cima de parede lisa vira linha horizontal visível — erro já
     medido nesta casa (14/09/2026) e repetido quando o texto desceu (15/09).

   · Nenhum zoom automático. Fita é movimento real; quem quiser escala usa
     `escala` no corte, e aí é de 1,00 a 1,04, como o pedido permite para foto.
   ============================================================================= */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { pegarMarca } from "../lib/marcas";
import { useFontesFabriciaProntas } from "../lib/fabriciaFontesProntas";

/* -------------------------------------------------------------------------- */
/* TIPOS DO PLANO — é isto que muda de uma peça pra outra                       */
/* -------------------------------------------------------------------------- */

/**
 * FAIXA MASCARADA por cima do plano — a técnica que a casa já usa nas peças
 * faladas, agora disponível na peça de texto fixo.
 *
 * Não é tarja colada: a faixa DISSOLVE na borda que encosta na imagem, de
 * modo que o apoio nasce dentro do plano em vez de tapá-lo. Ordem da dona,
 * 14/09/2026: *"quero que continue mascarando a imagem junto com minha fala"*
 * — trocar máscara por corte seco de tela cheia foi reprovado na época.
 *
 * A borda que encosta na moldura do quadro não leva cauda (não há o que
 * dissolver ali); a que encosta na imagem leva.
 */
export type Faixa = {
  /** caminho dentro de public/ — o mesmo formato dos cortes */
  src: string;
  /** y onde a faixa começa, no espaço 1080×1920 */
  topo: number;
  altura: number;
  /** px de dissolvência nas bordas internas */
  cauda: number;
  /** correção discreta, igual à dos cortes */
  cor?: { brilho?: number; saturacao?: number; contraste?: number };
};

export type Corte = {
  /** caminho dentro de public/, já cortado em 1080x1920 30fps H264 */
  src: string;
  /** duração em FRAMES, medida no arquivo cortado (não estimada) */
  duracao: number;
  /** de onde veio, para o relatório de entrega */
  origem?: string;
  /** escala fixa (1 = sem mexer). Só para FOTO parada; fita usa 1. */
  escala?: number;
  /** correção discreta de exposição/temperatura. 1 = sem mexer. */
  cor?: { brilho?: number; saturacao?: number; contraste?: number };
  /** faixa mascarada por cima deste plano; ausente = plano limpo */
  faixa?: Faixa;
};

/** Um pedaço de linha. `enfase` = face Medium (peso 500 real) no champagne. */
export type Parte = { texto: string; enfase?: boolean };

export type BlocoTexto = {
  /** linhas já quebradas em unidade de sentido — o motor não quebra sozinho */
  linhas: { partes: Parte[] }[];
};

export type PlanoTextoFixo = {
  marca: string;
  cortes: Corte[];
  /** parágrafos do texto fixo; entre eles entra um respiro vertical */
  paragrafos: BlocoTexto[];
  texto: {
    tamanho: number;
    entrelinha: number;
    /** respiro entre parágrafos, em px */
    respiro: number;
    /** distância da BASE do bloco até a base do quadro */
    bottom: number;
    margemEsquerda: number;
    margemDireita: number;
    alinhamento: "left" | "center";
    /** face: "corpo" (Light) ou "display" (Alt) */
    face: "corpo" | "display";
    /**
     * Família tipográfica desta peça, quando não é a do perfil da marca.
     * Existe porque a dona mandou, em 16/09/2026, uma fonte "Fabrícia Light,
     * idêntica à Futura PT" — família própria, um peso só — e pediu que a
     * peça usasse ELA. Trocar o perfil da marca arrastaria junto as peças
     * faladas, que não foram pedidas.
     */
    familia?: string;
    /**
     * Família da ÊNFASE, quando a família do texto não tem peso de ênfase.
     *
     * A "Fabrícia" (Futura PT) que a dona mandou em 16/09/2026 veio com UM
     * peso só. Pedir 500 nela faria o navegador engordar a forma — negrito
     * sintético, proibido no manual dela. Apontando aqui para a "Fabricia
     * Satza" (a Jost do kit de 13/09), a palavra sai no peso 500 DE VERDADE,
     * numa face que é prima da Futura: mesmo esqueleto geométrico, mesmo "a"
     * de um andar. A diferença medida é de altura de x — 24,8 px contra 23,4
     * a 54 px — e a 54 px o olho lê como PESO, não como outra fonte.
     *
     * Some no dia em que chegar a Medium/Bold da própria Futura.
     */
    familiaEnfase?: string;

    /**
     * Cor da ênfase. "texto" = a mesma cor do resto (o peso 500 sozinho marca
     * a palavra) — é o que a referência que a dona mandou faz. "destaque" =
     * champagne da marca, que exige véu mais pesado pra passar de 3,0:1.
     */
    enfaseCor: "texto" | "destaque";
  };
  /**
   * Cabeçalho permanente da marca no alto do quadro.
   *
   * DESLIGADO nesta frente, e a razão está medida: o perfil da marca põe o
   * rótulo a 64 px do topo — a mesma faixa onde o Instagram desenha o próprio
   * "Reels" e o ícone da câmera. O pedido ainda fixa área segura com o texto
   * começando abaixo de ~220 px. Descer o rótulo pra dentro da área segura o
   * joga em cima do cabelo dela, que é o assunto da peça.
   *
   * Fica como chave: `cabecalho: true` devolve o rótulo e o véu de topo junto.
   */
  cabecalho: boolean;

  /** véu localizado atrás do texto; null = sem véu */
  veu: { topo: number; base: number; cauda: number; alfa: number } | null;
  /** frame em que o fecho com a logo entra */
  endCard: number;
  duracao: number;
  /** trilha; null = peça muda */
  audio: {
    src: string;
    /** segundo da faixa em que o recorte começa */
    inicio: number;
    volume: number;
    /** frames de fade de entrada e de saída */
    fadeIn: number;
    fadeOut: number;
  } | null;
};

/* -------------------------------------------------------------------------- */
/* CORTE — um plano da montagem                                                */
/* -------------------------------------------------------------------------- */

const montarFiltros = (cor?: Corte["cor"]) => {
  const f: string[] = [];
  if (cor?.brilho !== undefined) f.push(`brightness(${cor.brilho})`);
  if (cor?.saturacao !== undefined) f.push(`saturate(${cor.saturacao})`);
  if (cor?.contraste !== undefined) f.push(`contrast(${cor.contraste})`);
  return f.length ? f.join(" ") : undefined;
};

/** A faixa mascarada. Ver o comentário do tipo `Faixa`. */
const FaixaMascarada: React.FC<{ f: Faixa }> = ({ f }) => {
  const encostaNoTopo = f.topo <= 0;
  const encostaNaBase = f.topo + f.altura >= 1920;
  const p = (f.cauda / f.altura) * 100;
  /* opaca no meio; dissolve só nas bordas que encostam na IMAGEM */
  const mascara = `linear-gradient(to bottom,
      ${encostaNoTopo ? "black 0%" : `transparent 0%, black ${p.toFixed(2)}%`},
      black ${(100 - (encostaNaBase ? 0 : p)).toFixed(2)}%,
      ${encostaNaBase ? "black 100%" : "transparent 100%"})`;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: f.topo,
        width: 1080,
        height: f.altura,
        overflow: "hidden",
        WebkitMaskImage: mascara,
        maskImage: mascara,
      }}
    >
      <OffthreadVideo
        src={staticFile(f.src)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: montarFiltros(f.cor),
        }}
      />
    </div>
  );
};

const Plano: React.FC<{ c: Corte }> = ({ c }) => {
  const filtros = montarFiltros(c.cor);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(c.src)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: c.escala && c.escala !== 1 ? `scale(${c.escala})` : undefined,
          filter: filtros,
        }}
      />
      {c.faixa && <FaixaMascarada f={c.faixa} />}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/* MOTOR                                                                       */
/* -------------------------------------------------------------------------- */

export const ReelTextoFixo: React.FC<{ plano: PlanoTextoFixo }> = ({ plano }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = pegarMarca(plano.marca);
  const fontesProntas = useFontesFabriciaProntas();

  if (m.pendencias.length > 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#7A1020",
          color: "#fff",
          padding: 90,
          fontSize: 44,
        }}
      >
        <div>Marca "{m.nome}" incompleta:</div>
        {m.pendencias.map((p, i) => (
          <div key={i}>· {p}</div>
        ))}
      </AbsoluteFill>
    );
  }

  // posições de entrada de cada corte, somadas em frames (determinístico)
  let acumulado = 0;
  const posicoes = plano.cortes.map((c) => {
    const inicio = acumulado;
    acumulado += c.duracao;
    return { c, inicio };
  });

  const t = plano.texto;
  const noEndCard = frame >= plano.endCard;

  /* O overlay inteiro (texto, véu, cabeçalho) sai ANTES do fecho: a logo
     aparece limpa, sem texto por cima. A saída é uma dissolvência curta, não
     um corte, para não piscar. */
  const saidaOverlay = interpolate(
    frame,
    [plano.endCard - 8, plano.endCard],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fonteCorpo =
    t.familia ??
    (t.face === "display"
      ? m.fontes.display?.().fontFamily
      : m.fontes.corpo().fontFamily);

  return (
    <AbsoluteFill style={{ backgroundColor: m.cores.fundo }}>
      {/* --------------------------------------------------------------- */}
      {/* 1. OS CORTES                                                      */}
      {/* --------------------------------------------------------------- */}
      {posicoes.map(({ c, inicio }, i) => (
        <Sequence key={i} from={inicio} durationInFrames={c.duracao}>
          <Plano c={c} />
        </Sequence>
      ))}

      {/* --------------------------------------------------------------- */}
      {/* 2. FECHO — lockup parado sobre café profundo.                     */}
      {/*    Entra por dissolvência curta vinda do último plano.            */}
      {/* --------------------------------------------------------------- */}
      {m.logo.arquivo && (
        <Sequence
          from={plano.endCard - 10}
          durationInFrames={plano.duracao - plano.endCard + 10}
        >
          <Fecho marca={m} />
        </Sequence>
      )}

      {/* --------------------------------------------------------------- */}
      {/* 3. VÉU LOCALIZADO — atrás do texto, com cauda dos DOIS lados.     */}
      {/* --------------------------------------------------------------- */}
      {plano.veu && !noEndCard && (
        <AbsoluteFill style={{ opacity: saidaOverlay, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              top: plano.veu.topo - plano.veu.cauda,
              height:
                plano.veu.base - plano.veu.topo + plano.veu.cauda * 2,
              /* Platô largo (34–74%) para o bloco inteiro de texto cair
                 dentro dele, e cauda longa nas duas pontas para o véu morrer
                 sem deixar linha visível em parede lisa. */
              background: `linear-gradient(to bottom,
                ${hexAlfa(m.cores.fundo, 0)} 0%,
                ${hexAlfa(m.cores.fundo, plano.veu.alfa * 0.3)} 18%,
                ${hexAlfa(m.cores.fundo, plano.veu.alfa)} 34%,
                ${hexAlfa(m.cores.fundo, plano.veu.alfa)} 74%,
                ${hexAlfa(m.cores.fundo, plano.veu.alfa * 0.3)} 88%,
                ${hexAlfa(m.cores.fundo, 0)} 100%)`,
            }}
          />
        </AbsoluteFill>
      )}

      {/* --------------------------------------------------------------- */}
      {/* 4. CABEÇALHO — a assinatura permanente da marca.                  */}
      {/* --------------------------------------------------------------- */}
      {plano.cabecalho && m.cabecalho && !noEndCard && (
        <AbsoluteFill style={{ opacity: saidaOverlay, pointerEvents: "none" }}>
          {/* véu de topo, cauda longa: véu que acaba seco em parede lisa
              denuncia a borda (medido em 14/09/2026) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 420,
              /* 0,62 no topo: medido. Com 0,5 o cabeçalho caía a 2,5:1 sobre a
                 parede de azulejo branco do corte 4 (frame 252). A cauda vai
                 até 420 px e chega a zero — véu que acaba seco em parede lisa
                 vira linha horizontal visível. */
              background: `linear-gradient(to bottom,
                ${hexAlfa(m.cores.fundo, 0.62)} 0%,
                ${hexAlfa(m.cores.fundo, 0.4)} 30%,
                ${hexAlfa(m.cores.fundo, 0.16)} 62%,
                ${hexAlfa(m.cores.fundo, 0.04)} 82%,
                ${hexAlfa(m.cores.fundo, 0)} 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: m.cabecalho.top,
              left: t.margemEsquerda,
              right: t.margemEsquerda,
              display: "flex",
              justifyContent: "space-between",
              color: m.cores.texto,
              opacity: m.cabecalho.opacidade,
              fontFamily: m.fontes.corpo().fontFamily,
              fontWeight: 300,
              fontStyle: "normal",
              fontSynthesis: "none",
              fontSize: m.cabecalho.tamanho,
              letterSpacing: m.cabecalho.letterSpacing,
            }}
          >
            <span>{m.cabecalho.esquerda}</span>
            <span>{m.cabecalho.direita}</span>
          </div>
        </AbsoluteFill>
      )}

      {/* --------------------------------------------------------------- */}
      {/* 5. TEXTO FIXO — fora das Sequences, então não pisca no corte.     */}
      {/* --------------------------------------------------------------- */}
      {fontesProntas && !noEndCard && (
        <AbsoluteFill style={{ opacity: saidaOverlay, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              left: t.margemEsquerda,
              right: t.margemDireita,
              bottom: t.bottom,
              textAlign: t.alinhamento,
              fontFamily: fonteCorpo,
              fontStyle: "normal",
              fontSynthesis: "none",
              color: m.cores.texto,
              fontSize: t.tamanho,
              lineHeight: t.entrelinha,
              /* nada de transform de escala horizontal: o pedido proíbe
                 comprimir ou esticar as letras */
              letterSpacing: 0.2,
            }}
          >
            {plano.paragrafos.map((p, pi) => (
              <div
                key={pi}
                style={{ marginTop: pi === 0 ? 0 : t.respiro }}
              >
                {p.linhas.map((l, li) => (
                  <div key={li}>
                    {l.partes.map((parte, si) =>
                      parte.enfase ? (
                        <span
                          key={si}
                          style={{
                            fontFamily: t.familiaEnfase ?? fonteCorpo,
                            fontWeight: 500, // face Medium REAL, nunca sintética
                            color:
                              t.enfaseCor === "destaque"
                                ? m.cores.destaque
                                : m.cores.texto,
                          }}
                        >
                          {parte.texto}
                        </span>
                      ) : (
                        <span key={si} style={{ fontWeight: 300 }}>
                          {parte.texto}
                        </span>
                      )
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* --------------------------------------------------------------- */}
      {/* 6. TRILHA                                                         */}
      {/* --------------------------------------------------------------- */}
      {plano.audio && (
        <Audio
          src={staticFile(plano.audio.src)}
          startFrom={Math.round(plano.audio.inicio * fps)}
          volume={(f) =>
            plano.audio
              ? plano.audio.volume *
                interpolate(
                  f,
                  [
                    0,
                    plano.audio.fadeIn,
                    plano.duracao - plano.audio.fadeOut,
                    plano.duracao,
                  ],
                  [0, 1, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )
              : 0
          }
        />
      )}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/* FECHO — lockup parado. A marca dela não tem animação de logo.               */
/* -------------------------------------------------------------------------- */

const Fecho: React.FC<{ marca: ReturnType<typeof pegarMarca> }> = ({ marca }) => {
  const f = useCurrentFrame();

  // a dissolvência que traz o fundo café por cima do último plano
  const fundo = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // o lockup entra depois que o fundo fechou — nunca sobre a imagem
  const marcaOp = interpolate(f, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // o fio de 1px da grade dela, abrindo do centro
  const fio = interpolate(f, [24, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: marca.logo.fundo ?? marca.cores.fundo,
          opacity: fundo,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Img
          src={staticFile(marca.logo.arquivo as string)}
          style={{
            width: marca.logo.largura ?? 620,
            height: "auto",
            opacity: marcaOp,
          }}
        />
        <div
          style={{
            marginTop: 64,
            width: 220 * fio,
            height: 1,
            backgroundColor: marca.cores.destaque,
            opacity: 0.85 * fio,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */

const hexAlfa = (hex: string, alfa: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alfa})`;
};

export default ReelTextoFixo;
