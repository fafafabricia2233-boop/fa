// ═══════════════════════════════════════════════════════════════════════════
// FABRÍCIA SATZA — tokens da marca pessoal (tricologia e queda capilar).
//
// Paleta oficial da marca. Identidade CLARA e editorial, de base quente: fundo
// branco suave, tinta café, acentos em terracota e champagne. É o oposto da
// New Hair (fundo escuro + dourado) — as duas marcas não devem se parecer.
//
// Regras de cor e tabela de contraste completa:
//   .claude/skills/fabricia-satza-tricologia/referencias/marca.md
// ═══════════════════════════════════════════════════════════════════════════

import { FABRICIA_TEXTO, FABRICIA_TITULO } from "./fabriciaFonts";

export const CORES = {
  // ── Superfícies ──
  /** Fundo padrão de toda peça. */
  branco: "#FCFAF7",
  /** Fundo alternado, para dar ritmo sem introduzir cor nova. */
  marfim: "#F4EFE8",
  /** Fundo escuro neutro. Também é a cor do texto sobre fundo claro. */
  cafe: "#28201F",
  /** A VIRADA. Fundo do slide que carrega a frase que tem de ficar. */
  vinho: "#4A2634",
  /**
   * Respiro quente no meio da sequência — não é virada.
   * Nunca adjacente ao vinho: os dois têm só 2,2:1 entre si e lado a lado
   * leem como erro. Sobre esta superfície o acento é marfim, não champagne
   * (que aqui cairia para 2,9:1).
   */
  terra: "#8A5A44",

  // ── Texto ──
  /** Texto principal sobre fundo claro. 15,3:1. */
  forte: "#28201F",
  /** Secundário sobre claro: legendas, notas, rótulos. */
  suave: "rgba(40,32,31,0.58)",
  /** Texto sobre fundo escuro. */
  claro: "#FCFAF7",
  /** Secundário sobre escuro. */
  claroSuave: "rgba(252,250,247,0.64)",

  // ── Acentos ──
  // Taupe e champagne se INVERTEM conforme o fundo: sobre claro são pálidos
  // demais para texto (2,6:1 e 1,9:1) e só valem como fio; sobre escuro ficam
  // ótimos (5,9:1 e 7,9:1) e viram o acento.
  /** Fio de 1px sobre fundo claro. Nunca texto. */
  taupe: "#A99B91",
  /** Acento e fio sobre fundo escuro. Nunca texto sobre claro. */
  champagne: "#C9B39B",
  /** Destaque em corpo grande (45px+) e marcador de passo em foco. 3,8:1. */
  terracota: "#B06F53",
  /** Destaque dentro de texto corrido, números e rótulos. 5,6:1. */
  terracotaEscuro: "#8A5A44",
} as const;

export const FONTES = {
  titulo: `'${FABRICIA_TITULO}', 'Futura', sans-serif`,
  texto: `'${FABRICIA_TEXTO}', 'Futura', sans-serif`,
} as const;

/**
 * Escala tipográfica em px para tela 1080×1350 (carrossel).
 * A fonte é Light: em corpo pequeno ela perde peso, então nada abaixo de 30px.
 * Em reel 1080×1920 suba tudo — legenda mínima confortável é 44px, não 30px.
 */
export const ESCALA = {
  display: 116,
  titulo: 88,
  subtitulo: 52,
  corpo: 45,
  corpoPequeno: 37,
  legenda: 30,
} as const;

/**
 * Rótulos em caixa alta com tracking largo são a assinatura visual da marca —
 * é o par de rótulos nos cantos de cima que faz peças soltas lerem como uma
 * série só.
 */
export const ROTULO = {
  fontFamily: FONTES.texto,
  fontSize: 24,
  letterSpacing: "0.30em",
  textTransform: "uppercase",
  color: CORES.suave,
} as const;
