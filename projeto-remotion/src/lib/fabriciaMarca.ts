// ═══════════════════════════════════════════════════════════════════════════
// FABRÍCIA SATZA — tokens da marca pessoal (tricologia e queda capilar).
//
// Amostrados dos posters de referência da marca. Identidade CLARA e editorial:
// fundo creme, tinta escura, um único detalhe em taupe. É o oposto da New Hair
// (fundo escuro + dourado) — as duas marcas não devem se parecer.
// ═══════════════════════════════════════════════════════════════════════════

import { FABRICIA_TEXTO, FABRICIA_TITULO } from "./fabriciaFonts";

export const CORES = {
  /** Fundo padrão de toda peça. */
  creme: "#FDFCF8",
  /** Variação levemente mais quente, para blocos alternados. */
  cremeQuente: "#F7F4EC",
  /** Cor de texto principal. Azul-petróleo tão escuro que lê como preto. */
  tinta: "#23272F",
  /** Texto secundário / legendas. */
  tintaSuave: "rgba(35,39,47,0.58)",
  /** Único acento da marca: filete, sublinhado, detalhe. Nunca em bloco. */
  taupe: "#B9A492",
  /** Para peças invertidas (story escuro, capa de vídeo). */
  tintaFundo: "#23272F",
} as const;

export const FONTES = {
  titulo: `'${FABRICIA_TITULO}', 'Futura', sans-serif`,
  texto: `'${FABRICIA_TEXTO}', 'Futura', sans-serif`,
} as const;

/**
 * Escala tipográfica em px para tela 1080×1350 (carrossel) e 1080×1920 (reel).
 * A fonte é Light: em corpo pequeno ela perde peso, então nada abaixo de 30px.
 */
export const ESCALA = {
  display: 116,
  titulo: 92,
  subtitulo: 54,
  corpo: 46,
  corpoPequeno: 38,
  legenda: 30,
} as const;

/**
 * Rótulos da marca (A TYPEFACE FOR BRIGHTER BRANDS, SIMPLES | ELEGANTE | ...)
 * usam caixa alta com tracking largo. É a assinatura visual dos posters.
 */
export const ROTULO = {
  fontFamily: FONTES.texto,
  fontSize: ESCALA.legenda,
  letterSpacing: "0.30em",
  textTransform: "uppercase",
  color: CORES.tintaSuave,
} as const;
