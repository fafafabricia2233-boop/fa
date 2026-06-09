// PerderPesoReel — timecodes derivados do captions.json (word-level, 30fps)
// Vídeo: main.mov → main_preview.mp4 | 43.537s total

export const T = {
  // TAKE 1 — GANCHO (0–2.2s)
  take1Hook: 0,          // "Eu saí dos 145 quilos pra isso."
  take1Deflate: 0.3,     // SFX esvaziando — corpo gordo deflando → musculoso
  take1End: 2.3,

  // TAKE 2 — COMIDA (5.32–14.7s)
  take2FoodStart: 5.32,  // "Arroz, feijão, carne..."
  take2DeficitBar: 10.5, // "Contei caloria, bati proteína" → StatBar entra

  // TAKE 3 — CIÊNCIA (15.14–22.16s)
  take3SciStart: 15.14,  // "Não é opinião."
  take3Stat1: 15.14,     // StatBar 1: DÉFICIT CALÓRICO
  take3Stat2: 19.02,     // StatBar 2: PROTEÍNA PRESERVA MASSA → PubMed entra junto
  take3Paper: 19.02,     // PubMed overlay canto inf. direito
  take3PaperEnd: 22.46,

  // TAKE 4 — PROVA PESSOAL / BLANK PAGE (22.46–25.24s)
  take4PhotosStart: 22.46, // "Deixa eu te mostrar o que 3 anos de constância fazem."
  take4PhotosEnd: 25.24,   // "Não fiz low carb" começa

  // TAKE 5 — O QUE NÃO FIZ / LISTA RISCADA (25.24–31.78s)
  take5ListStart: 25.24,
  take5LowCarb: 25.64,     // "low carb" → item 1 revela + risca
  take5Jejum: 26.9,        // "jejum" → item 2
  take5Shake: 29.34,       // "shake" → item 3
  take5Sofri: 31.14,       // "sofri" → item 4 + metal_impact

  // TAKE 6 — TREINO B-ROLL (31.78–37.44s)
  take6TrainoStart: 31.78, // "Musculação, constância." — sem overlay

  // TAKE 7 — ENCERRAMENTO (37.44–43.537s)
  take7Close: 37.44,    // "Anos de constância no básico."
  take7Climax: 41.2,    // "Funciona?" — punch zoom + cinematic hit final

  totalDur: 43.537,
} as const;
