/* =============================================================================
   NEW HAIR - TEMPLATE DE LEGENDA DE REEL
   Padrao §10.1 da frente, edicao 24/08/2026. Motor: Remotion.

   COMO USAR (o Claude faz isso, nao a mao):
   1. Copie este arquivo em src/compositions/ com o nome da peca.
      Ex.: NewHairGelox.tsx
   2. Troque NewHairLegenda por NewHairGelox nas 3 ocorrencias do fim do arquivo
      (o tipo, o componente e o export).
   3. Preencha SO o bloco CONFIG. Nada abaixo da linha "NAO MEXER" precisa ser tocado.
   4. Registre no Root.tsx com o snippet que esta no arquivo de padrao (.md).

   O QUE ESTE MOTOR NUNCA FAZ: recortar o video, mexer no audio original,
   regenerar imagem, colocar musica. Ele so queima overlay por cima do corte pronto.
   ============================================================================= */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
/* Fontes do padrao lidas do disco (mesmas familias e pesos: Montserrat 300/500,
   Cormorant Garamond 500). O @remotion/google-fonts baixa do fonts.gstatic.com
   durante o render e o Chromium do Remotion nao confia no CA do proxy desta
   maquina, o que mata o render. Ver src/lib/newhairFonts.ts. */
import { loadCormorantNH, loadMontserratNH } from "../lib/newhairFonts";

const cormorant = loadCormorantNH();
const montserrat = loadMontserratNH();

/* Identidade da New Hair. Nao trocar cor nem fonte sem ordem dos socios. */
const NH = {
  gold: "#C9A24A",
  navy: "#0B2436",
  offwhite: "#F7F3EA",
};

/* =============================================================================
   CONFIG - E SO ISTO AQUI QUE MUDA DE UMA PECA PRA OUTRA
   ============================================================================= */

const PECA = {
  /* arquivo dentro de public/ do projeto Remotion, JA convertido pra H264.
     Fita montada do take cru IMG_9789.MOV: tirado o ar entre as frases, o
     "ok?" solto aos 13.5s e a 1a leitura de "Insistir em um saque..." (a que
     tem o tropeco em "que ... esta"). Ficou a 2a leitura, limpa. */
  video: "newhair/atencaosaque_h264.mp4",

  /* MEDIDO com medir-fita.py, nunca herdado da peca anterior.
     endCard = segundo em que a logo/animacao final entra. null se a fita nao tiver. */
  endCard: null,

  /* MEDIDO. true = B-roll em cima e rosto embaixo (dois planos no mesmo quadro).
     Aqui NAO e split: e plano unico, a pessoa falando. O medir-fita acusa split
     porque a metade de cima e parede branca e a de baixo e o corpo — as duas
     metades variam separadas. Mas o veu pesado de split existe pra titulo
     dentro de faixa de B-roll, e nao e o caso. false. */
  splitScreen: false,

  /* Geometria aprovada. So mexer se a medicao mostrar que o texto cai em cima da
     prova (area cirurgica) ou em fundo claro demais pra ler. */
  geometria: {
    // ORDEM DA DONA (15/09/2026): "coloque o gancho bem acima da cabeca, nao
    // coloque muito no topo". Entao o titulo nao e ancorado no topo do quadro
    // nem no meio: ele e pendurado logo acima do cabelo.
    // MEDIDO com scripts/altura-cabeca.py na janela do gancho: o cabelo desta
    // fita comeca em y=545px (menor valor de todos os frames — ela mexe
    // a cabeca enquanto fala). O bloco de titulo tem 285px (4 linhas,
    // mais o fio e o "Leia a legenda").
    // 545 + 20 - 285 = 280: o pe do bloco encosta 20px no alto do cabelo, de
    // proposito. O gancho fica APOIADO na cabeca, nao flutuando acima dela —
    // e o que encosta e so o "Leia a legenda", que e a linha mais leve.
    // Remedir sempre que a fita for recortada: o menor valor muda.
    tituloTop: 280,
    legendaBottom: 430,
    seloBottom: 300,
  },
};

/* GANCHO = TITULO. A primeira fala do video vira headline no topo.
   Ultima linha sai DOURADA e maior; as de cima sao off-white.
   Regra de fidelidade: so se corta palavra repetida. Nunca escrever na tela
   palavra que a pessoa nao disse. */
const TITULO = {
  linhas: [
    "DOUTOR, QUANDO O SAQUE",
    "FICA DIFÍCIL, A SUA EQUIPE",
    "TE AVISA OU",
    "CONTINUA PUXANDO?",
  ],

  /* "temporario" = o titulo sai junto com o gancho e o veu de cima sai com ele.
     Use quando o topo do quadro e B-roll que E a prova (cirurgia acontecendo).
     "permanente" = o titulo fica ate o fim. Use quando o topo e imagem morta. */
  modo: "temporario" as "temporario" | "permanente",

  inicio: 0.15, // quando a primeira letra aparece
  seguraAte: 5.45, // o gancho falado acaba em 5.56 ("puxando")
  saiEm: 5.65, // sai no respiro antes da 1a legenda (5.72)
};

/* LEGENDA DE RODAPE, frase a frase, colada na fala.
   start/end em segundos. A palavra que carrega o sentido vai em gold: true
   (dourado, ja em caixa alta no texto). font: "serif" para frase de impacto.
   size: 34-38 no corpo, 46-48 na palavra de sentido.
   ENQUANTO O GANCHO ESTA SENDO FALADO O RODAPE FICA VAZIO: o titulo ja e a
   legenda dele, e repetir vira parede de texto. Por isso a 1a cue comeca
   depois do gancho. */
type Cue = {
  start: number;
  end: number;
  lines: { text: string; size: number; font?: "serif"; gold?: boolean }[];
};

/* toda cue precisa de pelo menos 0.6s (18 frames): fadeRise usa [f0, f0+8, f1-8, f1]
   e com janela menor que 16 frames f1-8 fica <= f0+8, quebrando a interpolação. */
const CUES: Cue[] = [
  {
    start: 5.68,
    end: 9.28,
    lines: [
      { text: "Quem acompanha essa etapa precisa", size: 26 },
      { text: "perceber RESISTÊNCIA,", size: 34, gold: true },
    ],
  },
  {
    start: 9.38,
    end: 11.20,
    lines: [{ text: "ter CUIDADO com o manuseio,", size: 32, gold: true }],
  },
  {
    start: 11.28,
    end: 14.46,
    lines: [
      { text: "e saber COMUNICAR", size: 34, gold: true },
      { text: "todas as dificuldades.", size: 26 },
    ],
  },
  {
    start: 14.55,
    end: 19.18,
    lines: [
      { text: "Insistir em um saque que está difícil", size: 26 },
      { text: "pode DANIFICAR as estruturas do folículo.", size: 26, gold: true },
    ],
  },
  {
    start: 19.35,
    end: 23.12,
    lines: [
      { text: "Na New Hair, nós valorizamos", size: 28 },
      { text: "essa ATENÇÃO durante o procedimento.", size: 28, gold: true },
    ],
  },
  {
    start: 23.30,
    end: 28.38,
    lines: [
      { text: "Observar, comunicar e acompanhar", size: 26 },
      { text: "a sua orientação faz parte", size: 26 },
      { text: "do nosso PROTOCOLO.", size: 34, gold: true },
    ],
  },
  {
    start: 28.46,
    end: 31.92,
    lines: [
      { text: "Você precisa de uma equipe que", size: 26 },
      { text: "esteja ATENTA AOS DETALHES?", size: 32, gold: true },
    ],
  },
  {
    start: 32.00,
    end: 34.12,
    lines: [
      { text: "Entre em contato com a gente", size: 26 },
      { text: "pelo LINK NA BIO.", size: 36, gold: true },
    ],
  },
];

/* Selo de compliance. Linha APROVADA, nao se reescreve. Ele e o que separa
   instrumentacao de ato medico na tela, e a imagem mostra cirurgia. */
const SELO = "Procedimento realizado por médico · a New Hair realiza a instrumentação";

/* TRILHA E SFX POSICIONADO — ORDEM DA DONA (15/09/2026):
   "voce nao colocou os sfx posicionado e nem lofi".

   O motor do padrao nunca punha musica porque a fita chegava do CapCut ja com
   musica dentro. Estas quatro chegaram CRUAS, direto do celular: se a trilha
   nao entrar aqui, nao entra em lugar nenhum.

   A trilha NAO tem fade de saida: ela e continuada, no mesmo ponto e no mesmo
   volume, por scripts/fechar-peca-camera.sh, embaixo da marca d'agua. Se mudar
   arquivo ou volume aqui, mude tambem la — sao o mesmo som.

   "Posicionado" quer dizer instante medido, nao batida solta:
     whoosh — a saida do gancho, um quadro antes de o titulo comecar a sumir
     pop    — a entrada de CADA legenda, 0.06s antes da cue, pra o som chegar
              junto com o texto e nao depois dele
   Volumes da tabela do projeto (components/OVERLAYS_LIBRARY.md: pop 0.42,
   whoosh 0.36) baixados um degrau, porque aqui embaixo ja tem voz e trilha. */
const TRILHA = {
  arquivo: "new sfx/lofi 2.MP3",
  volume: 0.08,
  entrada: 0.6, // fade-in, pra trilha nao dar um soco no primeiro quadro
};

const SFX = {
  whoosh: { arquivo: "sfx/whoosh_short.MP3", volume: 0.3, antes: 0.12 },
  pop: { arquivo: "new sfx/ui_pop.mp3", volume: 0.26, antes: 0.06 },
};

/* =============================================================================
   NAO MEXER DAQUI PRA BAIXO
   Cada detalhe abaixo custou medicao. O comentario diz o que quebra se mudar.
   ============================================================================= */

/* SFX de digitacao: REGRA PERMANENTE. Todo titulo digitado entra com ele.
   Comeca na 1a letra e morre quando a ultima letra entrou. */
const SFX_ARQUIVO = "newhair/digitando.mp3";
const SFX_DURACAO = 5.042; // medido: mono, sem silencio nas pontas, entao ladrilha sem buraco
const SFX_VOLUME = 0.32; // a voz e que manda

/* TETO DE 2 SEGUNDOS PRA DATILOGRAFIA INTEIRA.
   O numero so andou numa direcao (6,13s -> 3s -> 2s) e a razao vale mais que ele:
   SOM CHATO CUSTA MAIS QUE SINCRONIA. Na duvida entre colar na fala e acabar
   rapido, acabar rapido vence. */
const TETO_DIGITACAO = 2.0;
const TAXA_CHARS = 46; // caracteres por segundo
const GAP_LINHA = 0.05;

const calcularEscrita = (linhas: string[], inicio: number): number[][] => {
  const total = linhas.reduce((a, l) => a + l.length, 0) || 1;
  const bruta = Math.min(TETO_DIGITACAO, total / TAXA_CHARS);
  const util = Math.max(0.1, bruta - GAP_LINHA * (linhas.length - 1));
  const janelas: number[][] = [];
  let t = inicio;
  for (const l of linhas) {
    const d = util * (l.length / total);
    janelas.push([t, t + d]);
    t += d + GAP_LINHA;
  }
  return janelas;
};

const ESCRITA = calcularEscrita(TITULO.linhas, TITULO.inicio);
const SFX_INICIO = ESCRITA[0][0];
const SFX_FIM = ESCRITA[ESCRITA.length - 1][1];

/* datilografia por CARACTERE. Palavra inteira aparecendo de uma vez nao le como escrita. */
const escrever = (
  text: string,
  frame: number,
  fps: number,
  janela: number[]
): { visivel: string; escrevendo: boolean } => {
  const n = Math.round(
    interpolate(frame, [janela[0] * fps, janela[1] * fps], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  return { visivel: text.slice(0, n), escrevendo: n > 0 && n < text.length };
};

/* cursor em span de largura fixa (visibility, nao display): senao a piscada
   empurra o texto pros lados a cada frame. */
const Cursor: React.FC<{ mostra: boolean; altura: number }> = ({ mostra, altura }) => (
  <span
    style={{
      display: "inline-block",
      width: 3,
      height: altura,
      marginLeft: 8,
      verticalAlign: "middle",
      background: NH.gold,
      visibility: mostra ? "visible" : "hidden",
    }}
  />
);

/* ⚠️ NAO TROCAR POR <Loop>: dentro do Loop o frame que chega na funcao de volume
   REINICIA a cada repeticao, entao o fade-in dispara de novo no meio e o fade-out
   nunca acontece. Sequence por pedaco resolve. */
const SfxDigitacao: React.FC<{ inicio: number; fim: number; fps: number }> = ({
  inicio,
  fim,
  fps,
}) => {
  const janela = fim - inicio;
  const pedacos = Math.max(1, Math.ceil(janela / SFX_DURACAO));
  return (
    <>
      {Array.from({ length: pedacos }).map((_, i) => {
        const offset = i * SFX_DURACAO;
        const durF = Math.round(Math.min(SFX_DURACAO, janela - offset) * fps);
        const primeiro = i === 0;
        const ultimo = i === pedacos - 1;
        return (
          <Sequence key={i} from={Math.round((inicio + offset) * fps)} durationInFrames={durF}>
            <Audio
              src={staticFile(SFX_ARQUIVO)}
              volume={(f) =>
                SFX_VOLUME *
                (primeiro
                  ? interpolate(f, [0, 4], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 1) *
                (ultimo
                  ? interpolate(f, [durF - 5, durF], [1, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 1)
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};

/* SFX PONTUAL. Um <Sequence> por disparo, pelo mesmo motivo do SfxDigitacao:
   dentro de <Loop> o frame reinicia e o volume vira outra coisa. Aqui cada
   disparo e um Sequence com inicio proprio, entao o instante e exato. */
const SfxPontual: React.FC<{
  disparos: { t: number; arquivo: string; volume: number }[];
  fps: number;
}> = ({ disparos, fps }) => (
  <>
    {disparos.map((d, i) => (
      <Sequence
        key={i}
        from={Math.max(0, Math.round(d.t * fps))}
        durationInFrames={Math.round(1.4 * fps)}
      >
        <Audio src={staticFile(d.arquivo)} volume={d.volume} />
      </Sequence>
    ))}
  </>
);

/* LINHA ESCRITA QUE NAO TREME.
   Texto centralizado escrito letra a letra se RECENTRA a cada caractere, e a 30fps
   isso vira tremida. Um span fantasma com o texto COMPLETO reserva a largura final
   (visibility hidden, ocupa espaco) e o visivel corre por cima ancorado a esquerda. */
const LinhaEscrita: React.FC<{
  completo: string;
  visivel: string;
  cursor: boolean;
  altura: number;
  style: React.CSSProperties;
}> = ({ completo, visivel, cursor, altura, style }) => (
  <div style={{ ...style, textAlign: "center" }}>
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "pre" }}>
      <span style={{ visibility: "hidden" }}>{completo}</span>
      <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "pre" }}>
        {visivel}
        <Cursor mostra={cursor} altura={altura} />
      </span>
    </span>
  </div>
);

const fadeRise = (frame: number, fps: number, start: number, end: number) => {
  const f0 = start * fps;
  const f1 = end * fps;
  const opacity = interpolate(frame, [f0, f0 + 8, f1 - 8, f1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [f0, f0 + 12], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `translateY(${y}px)` };
};

export type NewHairAtencaoSaqueProps = {
  durationSeconds: number;
  video: string;
};

export const NewHairAtencaoSaque: React.FC<NewHairAtencaoSaqueProps> = ({ video }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const fonte = video || PECA.video;

  /* TUDO do overlay sai antes do end card. Sem end card, vai ate o fim da fita. */
  const duracao = durationInFrames / fps;
  const FIM = PECA.endCard ? PECA.endCard - 0.05 : duracao;
  const permanente = TITULO.modo === "permanente";
  const seguraAte = permanente ? FIM - 0.35 : TITULO.seguraAte;
  const saiEm = permanente ? FIM : TITULO.saiEm;

  /* disparos de SFX: a saida do gancho e a entrada de cada legenda */
  const disparos = React.useMemo(
    () => [
      { t: saiEm - SFX.whoosh.antes, ...SFX.whoosh },
      ...CUES.map((c) => ({ t: c.start - SFX.pop.antes, ...SFX.pop })),
    ],
    [saiEm]
  );

  const tituloOpacity = interpolate(frame, [seguraAte * fps, saiEm * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const escritas = TITULO.linhas.map((l, i) => escrever(l, frame, fps, ESCRITA[i]));

  /* cursor pisca a ~3 Hz e so existe enquanto AQUELA linha esta sendo escrita */
  const piscando = Math.floor(frame / (fps / 6)) % 2 === 0;

  /* o fio dourado CRESCE conforme a ultima linha e escrita: e parte da escrita, nao enfeite */
  const ultima = ESCRITA[ESCRITA.length - 1];
  const fio = interpolate(frame, [ultima[0] * fps, ultima[1] * fps], [0, 64], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seal = interpolate(
    frame,
    [1.0 * fps, 1.6 * fps, (FIM - 0.35) * fps, FIM * fps],
    [0, 0.6, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  /* SCRIM EM DOIS. O de cima existe SO enquanto o titulo existe: depois que ele sai,
     o B-roll cirurgico (que e a prova) fica limpo, sem veu por cima.
     Peso maior em split screen, porque ali o titulo mora dentro da faixa de B-roll.
     Aqui o veu volta a morrer na metade da tela, porque o titulo voltou pro
     topo (ordem da dona, 15/09/2026 — ver o bloco do GANCHO la embaixo). O
     peso de cima subiu de 0.72 pra 0.78: o fundo destas fitas e parede branca,
     e off-white sobre branco sem veu nao le. Abaixo de 50% a imagem fica
     limpa: e ali que esta o rosto. */
  const pesoTopo = PECA.splitScreen ? 0.82 : 0.78;
  const scrimTopo = interpolate(
    frame,
    [0, 0.4 * fps, seguraAte * fps, saiEm * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scrimRodape = interpolate(
    frame,
    [0, 0.5 * fps, (FIM - 0.35) * fps, FIM * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: NH.navy }}>
      <OffthreadVideo
        src={staticFile(fonte)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <SfxDigitacao inicio={SFX_INICIO} fim={SFX_FIM} fps={fps} />

      {/* trilha: entra em fade e NAO sai — quem fecha e o fechar-peca-camera.sh */}
      <Audio
        src={staticFile(TRILHA.arquivo)}
        volume={(f) =>
          TRILHA.volume *
          interpolate(f, [0, TRILHA.entrada * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      <SfxPontual disparos={disparos} fps={fps} />


      <AbsoluteFill
        style={{
          opacity: scrimTopo,
          background: `linear-gradient(to bottom, rgba(11,36,54,${pesoTopo}) 0%, rgba(11,36,54,0.66) 18%, rgba(11,36,54,0.44) 28%, rgba(11,36,54,0.20) 38%, rgba(11,36,54,0) 50%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: scrimRodape,
          background: `linear-gradient(to top, rgba(11,36,54,0.62) 0%, rgba(11,36,54,0) 45%)`,
        }}
      />

      {/* ===== GANCHO = TITULO (no alto, acima do rosto) =====
           ORDEM DA DONA (15/09/2026), sobre estas quatro pecas de camera:
           "o gancho nao pode ficar bem em cima da minha cara".
           A regra de centralizar no meio exato do quadro nasceu nas pecas de
           B-roll cirurgico, onde o meio da tela e prova e nao tem rosto. Aqui a
           fita e a pessoa falando: o meio da tela E a cara dela.
           E tambem nao e pra colar no topo: o gancho fica PENDURADO LOGO
           ACIMA DA CABECA, em PECA.geometria.tituloTop, que sai da medicao
           do cabelo (ver o comentario la em cima, no CONFIG).
           So mexer se o gancho ganhar ou perder linha — ai refaz a conta. */}
      <div
        style={{
          position: "absolute",
          top: PECA.geometria.tituloTop,
          width: "100%",
          textAlign: "center",
          padding: "0 150px",
          boxSizing: "border-box",
          opacity: tituloOpacity,
        }}
      >
        {TITULO.linhas.map((linha, i) => {
          const remate = i === TITULO.linhas.length - 1;
          return (
            <LinhaEscrita
              key={i}
              completo={linha}
              visivel={escritas[i].visivel}
              cursor={escritas[i].escrevendo && piscando}
              altura={remate ? 42 : 32}
              style={{
                fontFamily: montserrat.fontFamily,
                fontWeight: remate ? 500 : 300,
                fontSize: remate ? 44 : 36,
                letterSpacing: remate ? 2 : 2.5,
                color: remate ? NH.gold : NH.offwhite,
                lineHeight: remate ? 1.25 : 1.32,
                marginTop: remate ? 14 : 0,
                textShadow: "0 2px 18px rgba(11,36,54,0.9)",
              }}
            />
          );
        })}
        <div
          style={{
            width: fio,
            height: 1.5,
            background: NH.gold,
            opacity: 0.75,
            margin: "22px auto 0",
          }}
        />
        <div
          style={{
            marginTop: 28,
            fontFamily: montserrat.fontFamily,
            fontWeight: 300,
            fontSize: 18,
            letterSpacing: 1.2,
            color: NH.offwhite,
            textAlign: "center",
            opacity: tituloOpacity,
            textShadow: "0 1px 12px rgba(11,36,54,0.8)",
          }}
        >
          Leia a legenda. ↓
        </div>
      </div>

      {/* ===== LEGENDA (rodape, uma frase por vez) ===== */}
      {t < FIM + 0.05 &&
        CUES.map((cue, i) => {
          const st = fadeRise(frame, fps, cue.start, Math.min(cue.end, FIM));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: PECA.geometria.legendaBottom,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "0 110px",
                boxSizing: "border-box",
                ...st,
              }}
            >
              {cue.lines.map((l, j) => (
                <div
                  key={j}
                  style={{
                    fontFamily:
                      l.font === "serif" ? cormorant.fontFamily : montserrat.fontFamily,
                    fontWeight: l.gold ? 500 : l.font === "serif" ? 500 : 300,
                    fontSize: l.size,
                    letterSpacing: l.font === "serif" ? 1 : 2.2,
                    color: l.gold ? NH.gold : NH.offwhite,
                    textAlign: "center",
                    lineHeight: 1.35,
                    textShadow: "0 1px 16px rgba(11,36,54,0.85)",
                  }}
                >
                  {l.text}
                </div>
              ))}
            </div>
          );
        })}

      {/* selo de compliance permanente */}
      <div
        style={{
          position: "absolute",
          bottom: PECA.geometria.seloBottom,
          width: "100%",
          textAlign: "center",
          fontFamily: montserrat.fontFamily,
          fontWeight: 300,
          fontSize: 20,
          letterSpacing: 1.2,
          color: NH.offwhite,
          opacity: seal,
        }}
      >
        {SELO}
      </div>
    </AbsoluteFill>
  );
};
