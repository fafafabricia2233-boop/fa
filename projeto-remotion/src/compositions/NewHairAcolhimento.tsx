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
  /* Fita montada do take cru IMG_9786.MOV, que e o mais baguncado dos quatro.
     Sairam: a 1a leitura de "Para voce, o procedimento aconteceu como
     planejado..." (que tropeca duas vezes no meio), a repeticao de "ou se ate
     mesmo ele", a repeticao de "porque o acolhimento faz parte do nosso
     trabalho", o "Um, dois, tres" e o "Nao, ta errado" do fim da gravacao.
     As duas repeticoes do meio o whisper nao mostrava: so apareceram medindo a
     energia do audio e passando o modelo grande em cima do trecho. */
  video: "newhair/acolhimento_h264.mp4",

  /* MEDIDO com medir-fita.py, nunca herdado da peca anterior. */
  endCard: null,

  /* MEDIDO: plano unico, a pessoa falando. Nao e split. */
  splitScreen: false,

  geometria: {
    // altura do gancho. Nesta fita o rosto comeca por volta de 550px, entao o
    // bloco de titulo tem que acabar antes disso — conferido em still.
    tituloTop: 118,
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
    "DOUTOR, A CIRURGIA",
    "FOI TRANQUILA, MAS SERÁ",
    "QUE O SEU PACIENTE",
    "TAMBÉM ACHOU ISSO?",
  ],

  modo: "temporario" as "temporario" | "permanente",

  inicio: 0.15,
  seguraAte: 5.2, // gancho falado acaba em 5.42 ("isso?")
  saiEm: 5.45, // a frase seguinte comeca em 5.40: aqui o respiro e curto mesmo
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
    start: 5.50,
    end: 10.35,
    lines: [
      { text: "Pra você, o procedimento deu tudo certo,", size: 26 },
      { text: "mas o paciente, ele passou HORAS ali.", size: 28, gold: true },
    ],
  },
  {
    start: 10.45,
    end: 14.80,
    lines: [
      { text: "Ele ouviu cada CONVERSA,", size: 32, gold: true },
      { text: "ele percebeu a maneira", size: 26 },
      { text: "com que ele foi TRATADO.", size: 30, gold: true },
    ],
  },
  {
    start: 14.88,
    end: 18.05,
    lines: [
      { text: "Se ele fez uma pergunta", size: 26 },
      { text: "e recebeu uma RESPOSTA SECA,", size: 30, gold: true },
    ],
  },
  {
    start: 18.18,
    end: 22.05,
    lines: [
      { text: "ou se até mesmo ele", size: 26 },
      { text: "apresentou desconforto", size: 26 },
      { text: "e NINGUÉM DEU ATENÇÃO,", size: 30, gold: true },
    ],
  },
  {
    start: 22.15,
    end: 24.62,
    lines: [
      { text: "ele vai se LEMBRAR disso", size: 30, gold: true },
      { text: "no pós-operatório.", size: 26 },
    ],
  },
  {
    start: 24.75,
    end: 27.28,
    lines: [
      { text: "Na New Hair, a gente", size: 26 },
      { text: "ORIENTA o paciente,", size: 32, gold: true },
    ],
  },
  {
    start: 27.38,
    end: 32.40,
    lines: [
      { text: "EXPLICA e COMUNICA ao médico", size: 28, gold: true },
      { text: "todas as intercorrências", size: 26 },
      { text: "durante o procedimento.", size: 26 },
    ],
  },
  {
    start: 32.85,
    end: 37.45,
    lines: [
      { text: "Porque o ACOLHIMENTO faz parte", size: 28, gold: true },
      { text: "do nosso trabalho", size: 26 },
      { text: "durante toda a cirurgia.", size: 26 },
    ],
  },
  {
    start: 37.90,
    end: 41.40,
    lines: [
      { text: "Você quer uma equipe que CUIDE", size: 28, gold: true },
      { text: "dessa experiência junto com você?", size: 26 },
    ],
  },
  {
    start: 41.50,
    end: 44.32,
    lines: [
      { text: "Entre em contato com a gente", size: 26 },
      { text: "pelo LINK NA BIO.", size: 36, gold: true },
    ],
  },
];

/* Selo de compliance. Linha APROVADA, nao se reescreve. Ele e o que separa
   instrumentacao de ato medico na tela, e a imagem mostra cirurgia. */
const SELO = "Procedimento realizado por médico · a New Hair realiza a instrumentação";

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

export type NewHairAcolhimentoProps = {
  durationSeconds: number;
  video: string;
};

export const NewHairAcolhimento: React.FC<NewHairAcolhimentoProps> = ({ video }) => {
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
           fita e a pessoa falando: o meio da tela E a cara dela. Entao o gancho
           volta pro topo, em PECA.geometria.tituloTop, que e parede vazia.
           So mexer se o bloco de titulo crescer a ponto de encostar no cabelo. */}
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
