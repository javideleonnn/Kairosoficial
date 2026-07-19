import type { Level } from "./types";

/**
 * Umbrales calibrados ejecutando el motor contra perfiles construidos
 * deliberadamente extremos (ver __calibration.ts, no commiteado — sus
 * hallazgos quedan documentados en /docs/progress.md, Módulo 7).
 *
 * HALLAZGO IMPORTANTE: el rango real de indexScore observado en los
 * perfiles más extremos posibles de construir fue ~59-76, no 0-100. Esto
 * ocurre porque cada una de las 4 dimensiones depende de solo 2-3 de los
 * 5 bloqueos — un perfil con UN bloqueo muy agudo pero los demás bajos
 * puntúa relativamente bien en las otras 3 dimensiones, comprimiendo el
 * índice hacia el centro. Las bandas de abajo reflejan ese rango real
 * (documentado como hallazgo de metodología, no oculto) para que los 5
 * niveles sean todos alcanzables en la práctica.
 */
const LEVEL_BANDS: Array<{ number: number; name: string; min: number; max: number }> = [
  { number: 1, name: "Punto de Partida", min: 0, max: 58 },
  { number: 2, name: "En Movimiento", min: 59, max: 64 },
  { number: 3, name: "Umbral", min: 65, max: 70 },
  { number: 4, name: "Consolidado", min: 71, max: 75 },
  { number: 5, name: "Dominio", min: 76, max: 100 },
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
