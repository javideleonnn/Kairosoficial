import type { Level } from "./types";

/**
 * Umbrales calibrados por optimización exhaustiva pregunta por pregunta
 * contra el cuestionario de 12 preguntas (v3) — no una estimación.
 *
 * Límite teórico exacto para este set: mínimo 50.33, máximo 69.43
 * (amplitud real ~19.1 puntos, calculado igual que en la v1 de 20
 * preguntas — ver hallazgo del Módulo 7 sobre por qué el rango real es
 * mucho más angosto que 0-100: cada dimensión depende de solo 2-3 de los
 * 5 bloqueos). Las 5 bandas de abajo dividen ese rango real en partes
 * iguales, con los extremos abiertos (0 y 100) para cualquier caso límite.
 */
const LEVEL_BANDS: Array<{ number: number; name: string; min: number; max: number }> = [
  { number: 1, name: "Punto de Partida", min: 0, max: 54 },
  { number: 2, name: "En Movimiento", min: 55, max: 58 },
  { number: 3, name: "Umbral", min: 59, max: 62 },
  { number: 4, name: "Consolidado", min: 63, max: 66 },
  { number: 5, name: "Dominio", min: 67, max: 100 },
];

export function getLevel(indexScore: number): Level {
  const clamped = Math.max(0, Math.min(100, indexScore));
  const band = LEVEL_BANDS.find((b) => clamped >= b.min && clamped <= b.max);
  // No debería ocurrir dado el clamp, pero nunca lanzamos por un nivel —
  // el nivel siempre debe poder calcularse.
  const fallback = LEVEL_BANDS[LEVEL_BANDS.length - 1]!;
  const resolved = band ?? fallback;
  return { number: resolved.number, name: resolved.name };
}
