/* =============================================================================
   REEL FALADO — motor de vídeo com alguém falando na câmera

   É o FLUXO A do manual: fita bruta com fala → cortes escolhidos → gancho vira
   título → legendas coladas na fala → apoio que prova → filme na virada →
   logo no fim. Diferente do motor de legenda (NewHairLegendaTemplate), que só
   queima overlay por cima de B-roll já cortado.

   O código é o do exemplo aprovado (kit-new-hair/exemplo-aprovado/src/
   video.tsx), com três diferenças, todas deliberadas:

   1. A identidade vem de um PERFIL DE MARCA (src/lib/marcas.ts), não está
      cravada aqui. É o que permite a mesma gramática servir New Hair e
      Fabrícia Satza sem misturar as marcas.
   2. As fontes são lidas do disco (o Chromium do Remotion aqui não confia no
      CA do proxy e o download do Google Fonts mata o render).
   3. Se a marca tiver pendência de identidade, ele NÃO renderiza a peça: mostra
      a lista do que falta. Peça com a cara da marca errada é pior que erro.

   O QUE ESTE MOTOR NÃO FAZ: escolher o corte por você. Ele recebe o plano
   pronto (quais trechos, em que ordem, onde entra o apoio) e executa. A
   escolha da última tentativa completa de cada fala é trabalho de leitura do
   bruto, e é onde o manual manda gastar o tempo.

   O ÁUDIO NÃO MORA AQUI. Renderiza-se a imagem sem som, misturam-se os stems
   (voz, música, SFX) por fora e faz-se o mux — foi assim que o padrão resolveu
   a defasagem do motor antigo (§07).
   ============================================================================= */

import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { pegarMarca } from "../lib/marcas";

/* ----------------------------------------------------------------------------
   O PLANO: o que a peça é. Sai da leitura do bruto, um por vídeo.
---------------------------------------------------------------------------- */
export type Corte = {
  nome: string;
  /** arquivo já recortado em public/ */
  src: string;
  /** onde começa na montagem, em frames */
  start: number;
  duration: number;
};

export type Apoio = {
  fromFrame: number;
  duration: number;
  src: string;
  /** "band" = faixa mascarada em cima, fundida na imagem dela; "full" = tela toda */
  mode: "band" | "full";
  /** altura da faixa em px. NÃO é número fixo: mede-se onde começa a cabeça
      dela no corte e põe-se a faixa pra dissolver ali (ver comentário em Apoio).
      Sem valor, 760 — que é o do exemplo aprovado, e só serve com deslocamento. */
  altura?: number;
  position: string;
};

export type Plano = {
  fps: number;
  duration: number;
  /** frame em que a logo entra. Tudo do overlay sai antes. */
  endCard: number;
  /** frame da virada do gancho: o filme ocupa hookEnd-7 até hookEnd-1 */
  hookEnd: number;
  clips: Corte[];
  brolls: Apoio[];
  /** 2 linhas: a de cima em off-white, a de baixo no destaque */
  title: [string, string];
  /** empurra o plano do gancho pra baixo pra abrir espaço acima da cabeça */
  titleShift: number;
  /** Empurra o plano pra baixo enquanto há apoio em faixa. PADRÃO 0.
      Existe só pra peça antiga: empurrar descobre o fundo da marca no topo, e a
      dona pediu o vídeo na tela toda (14/09/2026). O jeito certo de abrir espaço
      pra faixa é MEDIR a cabeça e encurtar a faixa (`Apoio.altura`), não mover
      o plano. Quem usar isto paga recorte: o motor amplia o quanto for preciso
      pra não sobrar fundo. */
  bandShift?: number;
  zoomClip: number;
  zoomFrame: number;
  closeClips: number[];
};

export type LinhaCue = { text: string; size: number; gold?: boolean; serif?: boolean };
export type Cue = { start: number; end: number; lines: LinhaCue[] };

export type ReelFaladoProps = {
  marca: string;
  plano: Plano;
  cues: Cue[];
};

/* =============================================================================
   NAO MEXER DAQUI PRA BAIXO sem medir. Cada número veio do exemplo aprovado.
   ============================================================================= */

const clamp = (x: number) => Math.max(0, Math.min(1, x));

const lerp = (f: number, x: number[], y: number[]) =>
  interpolate(f, x, y, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* Plano base. O zoom é de 1,02 a 1,12 em 15 frames com easing u²(3−2u) — não é
   enfeite: é o movimento que o SFX de zoom acompanha. */
const Base: React.FC<{
  i: number;
  src: string;
  plano: Plano;
  temApoioBanda: boolean;
}> = ({ i, src, plano, temApoioBanda }) => {
  const local = useCurrentFrame();
  const progresso = clamp((local - plano.zoomFrame) / 15);
  const suave = progresso * progresso * (3 - 2 * progresso);
  const escala =
    i === plano.zoomClip
      ? 1.02 + 0.1 * suave
      : plano.closeClips.includes(i)
        ? 1.08
        : 1;
  const origem = i > 0 ? "50% 80%" : "50% 42%";
  const desloca = temApoioBanda
    ? (plano.bandShift ?? 0)
    : i === 0
      ? plano.titleShift
      : 0;

  /* COBERTURA — ordem da dona, 14/09/2026: "prefiro que o vídeo fique na tela
     toda". O `objectFit: cover` preenche exatamente 1080×1920; qualquer
     translateY pra baixo descobre o fundo da marca lá em cima, e é isso que
     virava a faixa azul reclamada na NH_velocidade v1 (209 px medidos).

     O quanto a escala precisa crescer depende de ONDE fica a origem da
     transformação: o topo do elemento vai parar em `desloca + oy*1920*(1−S)`,
     então preencher exige S ≥ 1 + desloca/(oy*1920). Mais 0,5% de folga pra
     arredondamento de subpixel não abrir um fio de fundo na borda.

     Isto NÃO é convite pra deslocar: empurrar o plano custa recorte, e num
     material já ampliado custa nitidez. É rede de segurança — a faixa não pode
     voltar por descuido de plano. Quem não desloca não paga nada. */
  const oy = i > 0 ? 0.8 : 0.42;
  const cobertura = desloca > 0 ? (1 + desloca / (oy * 1920)) * 1.005 : 1;
  const escalaFinal = Math.max(escala, cobertura);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateY(${desloca}px) scale(${escalaFinal})`,
          transformOrigin: origem,
        }}
      />
    </AbsoluteFill>
  );
};

/* Apoio. Em "band" ele é uma faixa no topo, opaca até 82% e transparente em
   100% — é a máscara de MISTURA (o apoio se funde na imagem dela em vez de
   ser uma tarja colada), e não substitui os véus de texto.

   A ALTURA se mede, não se herda. O que faz a máscara funcionar é a dissolução
   cair no topo da cabeça dela: no exemplo aprovado a cabeça ficava a 85% da
   altura da faixa, logo abaixo do limite opaco de 82%. Aquele 760 px só fecha
   essa conta porque o plano estava empurrado 240 px pra baixo — e é o empurrão
   que descobria o fundo da marca no topo (ordem da dona de 14/09: vídeo na tela
   toda). Sem empurrão, mede-se onde a cabeça começa e divide-se por 0,85.
   Na NH_velocidade a touca começa em 430 px, então a faixa é 500. */
const Apoio: React.FC<{ b: Apoio }> = ({ b }) => {
  const f = useCurrentFrame();
  const fade = lerp(f, [0, 3, b.duration - 3, b.duration], [0, 1, 1, 0]);
  const mascara =
    b.mode === "band"
      ? "linear-gradient(to bottom,black 0%,black 82%,transparent 100%)"
      : undefined;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: b.mode === "band" ? (b.altura ?? 760) : 1920,
        overflow: "hidden",
        opacity: fade,
        maskImage: mascara,
        WebkitMaskImage: mascara,
      }}
    >
      <OffthreadVideo
        src={staticFile(b.src)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: b.position,
        }}
      />
    </div>
  );
};

/* Linha digitada que não treme: um fantasma com o texto completo reserva a
   largura final e o visível corre por cima, ancorado à esquerda. */
const Digitada: React.FC<{
  texto: string;
  inicio: number;
  fim: number;
  size: number;
  cor: string;
  peso: number;
  familia: string;
  letterSpacing: number;
  corCursor: string;
  /** sombra na cor da MARCA — não pode ficar cravada no azul da New Hair */
  sombra: string;
}> = ({ texto, inicio, fim, size, cor, peso, familia, letterSpacing, corCursor, sombra }) => {
  const f = useCurrentFrame();
  const n = Math.round(lerp(f, [inicio * 30, fim * 30], [0, texto.length]));
  const escrevendo = f >= inicio * 30 && f < fim * 30;
  return (
    <div
      style={{
        fontFamily: familia,
        fontWeight: peso,
        fontSize: size,
        color: cor,
        letterSpacing,
        lineHeight: 1,
        marginBottom: 4,
        textShadow: `0 2px 18px ${sombra}`,
        textAlign: "center",
      }}
    >
      <span style={{ display: "inline-block", position: "relative", whiteSpace: "pre" }}>
        <span style={{ visibility: "hidden" }}>{texto}</span>
        <span style={{ position: "absolute", top: 0, left: 0, whiteSpace: "pre" }}>
          {texto.slice(0, n)}
          <span
            style={{
              display: "inline-block",
              height: size * 0.82,
              width: 3,
              marginLeft: 8,
              background: corCursor,
              verticalAlign: "middle",
              visibility:
                escrevendo && Math.floor(f / 5) % 2 === 0 ? "visible" : "hidden",
            }}
          />
        </span>
      </span>
    </div>
  );
};

/* A transição de FILME: 7 frames de exposição quente, clarão, escuro e preto,
   imediatamente antes da virada do gancho. Não trocar por transição genérica
   de slideshow — é assinatura, e o SFX está casado com ela. */
const Filme: React.FC<{ hookEnd: number }> = ({ hookEnd }) => {
  const f = useCurrentFrame();
  const q = f - (hookEnd - 7);
  if (q < 0 || q > 6) return null;
  const cores = [
    "rgba(255,181,127,0.18)",
    "rgba(255,205,152,0.75)",
    "#fffbd6",
    "#ffffdf",
    "#321923",
    "#020203",
    "#000",
  ];
  return (
    <AbsoluteFill style={{ background: cores[q], overflow: "hidden" }}>
      {q < 5 && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg,rgba(217,72,54,.7),transparent 35%,rgba(255,246,176,.5) 75%,rgba(255,255,235,.8))",
              opacity: q === 0 ? 0.2 : 0.8,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 24,
              top: -300 + q * 95,
              width: 115,
              height: 2500,
              filter: "blur(4px)",
              opacity: q === 4 ? 0.8 : 0.3,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 108,
                  width: 94,
                  background: q === 4 ? "#120007" : "#ba774f",
                  marginBottom: 78,
                  borderRadius: 12,
                }}
              />
            ))}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/* Cartão que aparece quando a marca ainda não tem identidade fechada. Existe
   pra falhar ALTO: melhor a peça não sair do que sair com a cara de outra
   marca. */
const FaltaIdentidade: React.FC<{ nome: string; pendencias: string[] }> = ({
  nome,
  pendencias,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#1b1b1b",
      padding: 90,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      fontFamily: "monospace",
      color: "#f5f5f5",
    }}
  >
    <div style={{ fontSize: 52, marginBottom: 28, color: "#ff9d4d" }}>
      Falta a identidade de {nome}
    </div>
    <div style={{ fontSize: 26, lineHeight: 1.5, opacity: 0.85, marginBottom: 30 }}>
      O motor não renderiza peça desta marca enquanto isto não for preenchido em
      src/lib/marcas.ts:
    </div>
    {pendencias.map((p, i) => (
      <div key={i} style={{ fontSize: 28, lineHeight: 1.6, marginBottom: 12 }}>
        · {p}
      </div>
    ))}
  </AbsoluteFill>
);

export const ReelFalado: React.FC<ReelFaladoProps> = ({ marca, plano, cues }) => {
  const m = pegarMarca(marca);
  const frame = useCurrentFrame();
  const t = frame / plano.fps;

  if (m.pendencias.length > 0) {
    return <FaltaIdentidade nome={m.nome} pendencias={m.pendencias} />;
  }

  const corpo = m.fontes.corpo();
  const serif = m.fontes.serif ? m.fontes.serif() : corpo;
  /* face de display pro título; quem não tem, usa a do corpo */
  const display = m.fontes.display ? m.fontes.display() : corpo;

  const tituloOpacity = lerp(frame, [plano.hookEnd - 14, plano.hookEnd - 7], [1, 0]);
  const ativo = frame < plano.endCard;
  const veuTopo = lerp(
    frame,
    [0, 10, plano.hookEnd - 14, plano.hookEnd - 7],
    [0, 1, 1, 0]
  );
  const veuRodape = lerp(
    frame,
    [0, 12, plano.endCard - 5, plano.endCard],
    [0, 1, 1, 0]
  );
  const cue = cues.find((c) => t >= c.start && t < c.end);

  const rgbFundo = (op: number) => {
    const h = m.cores.fundo.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${op})`;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: m.cores.fundo }}>
      {plano.clips.map((c, i) => {
        const temApoioBanda = plano.brolls.some(
          (b) =>
            b.mode === "band" &&
            c.start < b.fromFrame + b.duration &&
            c.start + c.duration > b.fromFrame
        );
        return (
          <Sequence key={i} from={c.start} durationInFrames={c.duration}>
            <Base i={i} src={c.src} plano={plano} temApoioBanda={temApoioBanda} />
          </Sequence>
        );
      })}

      {plano.brolls.map((b, i) => (
        <Sequence key={`b${i}`} from={b.fromFrame} durationInFrames={b.duration}>
          <Apoio b={b} />
        </Sequence>
      ))}

      {/* fechamento limpo: sem legenda, selo, cabeçalho, título ou véu por cima.
          Duas formas: animação (New Hair) ou lockup parado (Fabrícia). */}
      {m.logo.arquivo && (
        <Sequence
          from={plano.endCard}
          durationInFrames={plano.duration - plano.endCard}
        >
          {m.logo.tipo === "video" ? (
            <OffthreadVideo
              src={staticFile(m.logo.arquivo)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <AbsoluteFill
              style={{
                backgroundColor: m.logo.fundo ?? m.cores.fundo,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Img
                src={staticFile(m.logo.arquivo)}
                style={{ width: m.logo.largura ?? 620, height: "auto" }}
              />
            </AbsoluteFill>
          )}
        </Sequence>
      )}

      {ativo && (
        <>
          {/* véu do título: sai junto com ele */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              /* 900 px com cauda longa, não 520 com queda seca. Enquanto o
                 plano era empurrado pra baixo, a faixa de fundo escondia o fim
                 do véu; com o vídeo ocupando a tela toda (14/09/2026) a queda
                 de 0,62 a 0 em 140 px virou linha horizontal visível — medida
                 na parede lisa: o brilho saltava de 87 pra 198 em 140 px. Os
                 degraus abaixo imitam uma saída suave; a escuridão onde o
                 título mora (270→470 px) não muda. */
              height: 900,
              opacity: veuTopo,
              background: `linear-gradient(to bottom,${rgbFundo(0.52)} 0%,${rgbFundo(
                0.62
              )} 30%,${rgbFundo(0.62)} 50%,${rgbFundo(0.44)} 64%,${rgbFundo(
                0.24
              )} 78%,${rgbFundo(0.1)} 89%,${rgbFundo(0)} 100%)`,
            }}
          />
          {/* véu de baixo: acompanha legenda e selo */}
          <AbsoluteFill
            style={{
              opacity: veuRodape,
              background: `linear-gradient(to top,${rgbFundo(0.62)} 0%,${rgbFundo(0)} 45%)`,
            }}
          />

          {m.cabecalho && (
            <div
              style={{
                position: "absolute",
                top: m.cabecalho.top,
                left: m.titulo.paddingLateral,
                right: m.titulo.paddingLateral,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: corpo.fontFamily,
                fontWeight: 300,
                fontSize: m.cabecalho.tamanho,
                letterSpacing: m.cabecalho.letterSpacing,
                color: m.cores.destaque,
                opacity:
                  m.cabecalho.opacidade *
                  lerp(
                    frame,
                    [12, 26, plano.endCard - 12, plano.endCard - 2],
                    [0, 1, 1, 0]
                  ),
                textShadow: `0 1px 14px ${rgbFundo(0.85)}`,
              }}
            >
              <span>{m.cabecalho.esquerda}</span>
              <span>{m.cabecalho.direita}</span>
            </div>
          )}

          {frame < plano.hookEnd && (
            <div
              style={
                m.titulo.top === null
                  ? {
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "100%",
                      boxSizing: "border-box",
                      padding: `0 ${m.titulo.paddingLateral}px`,
                      textAlign: "center",
                      opacity: tituloOpacity,
                    }
                  : {
                      position: "absolute",
                      top: m.titulo.top,
                      width: "100%",
                      boxSizing: "border-box",
                      padding: `0 ${m.titulo.paddingLateral}px`,
                      textAlign: "center",
                      opacity: tituloOpacity,
                    }
              }
            >
              <Digitada
                texto={plano.title[0]}
                inicio={0.15}
                fim={0.85}
                size={m.titulo.tamanhoLinha}
                cor={m.cores.texto}
                peso={300}
                familia={display.fontFamily}
                letterSpacing={m.titulo.letterSpacing}
                corCursor={m.cores.destaque}
                sombra={rgbFundo(0.9)}
              />
              <Digitada
                texto={plano.title[1]}
                inicio={0.88}
                fim={1.4}
                size={m.titulo.tamanhoRemate}
                cor={m.cores.destaque}
                peso={500}
                familia={display.fontFamily}
                letterSpacing={m.titulo.letterSpacing}
                corCursor={m.cores.destaque}
                sombra={rgbFundo(0.9)}
              />
              {/* o filete cresce junto com a última linha: é parte da escrita */}
              <div
                style={{
                  height: 1.5,
                  width: lerp(frame, [0.88 * 30, 1.4 * 30], [0, 64]),
                  background: m.cores.destaque,
                  opacity: 0.75,
                  margin: "6px auto 0",
                }}
              />
            </div>
          )}

          {cue && frame >= plano.hookEnd && (
            <div
              style={{
                position: "absolute",
                bottom: m.legenda.bottom,
                width: "100%",
                boxSizing: "border-box",
                padding: `0 ${m.legenda.paddingLateral}px`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
                opacity: Math.min(
                  clamp((t - cue.start) / 0.1),
                  clamp((cue.end - t) / 0.1)
                ),
                transform: `translateY(${10 * (1 - clamp((t - cue.start) / 0.2))}px)`,
              }}
            >
              {cue.lines.map((l, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: l.serif ? serif.fontFamily : corpo.fontFamily,
                    fontWeight: l.gold ? 500 : 300,
                    fontSize: l.size,
                    letterSpacing: l.serif ? 1 : 2.2,
                    color: l.gold ? m.cores.destaque : m.cores.texto,
                    textAlign: "center",
                    lineHeight: 1.35,
                    textShadow: `0 1px 16px ${rgbFundo(0.85)}`,
                  }}
                >
                  {l.text}
                </div>
              ))}
            </div>
          )}

          {m.selo.texto && (
            <div
              style={{
                position: "absolute",
                bottom: m.selo.bottom,
                width: "100%",
                textAlign: "center",
                fontFamily: corpo.fontFamily,
                fontWeight: 300,
                fontSize: m.selo.tamanho,
                letterSpacing: m.selo.letterSpacing,
                color: m.cores.texto,
                opacity: lerp(
                  frame,
                  [30, 48, plano.endCard - 12, plano.endCard - 2],
                  [0, m.selo.opacidade, m.selo.opacidade, 0]
                ),
              }}
            >
              {m.selo.texto}
            </div>
          )}
        </>
      )}

      <Filme hookEnd={plano.hookEnd} />
    </AbsoluteFill>
  );
};
