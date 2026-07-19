import type { BlockKey } from "../content/types";

/** Entrada del motor — una respuesta en memoria. Idéntico en forma a
 * `DraftAnswer` de apps/mapa, para que no haga falta traducir nada. */
export interface EngineAnswer {
  questionId: string;
  questionOptionId?: string;
  valueNumeric?: number;
  rankedOptionIds?: string[];
}

export interface BlockScore {
  blockKey: BlockKey;
  raw: number;
  maxPossible: number;
  /** 0-100 */
  normalized: number;
}

export interface DimensionScores {
  claridad: number;
  accion: number;
  confianza: number;
  compromiso: number;
}

export interface Level {
  number: number;
  name: string;
}

export interface AletheiaResult {
  /** código compacto y compartible, ej. "AS-VE-N2" */
  resultCode: string;
  dominantBlock: BlockKey;
  secondaryBlock: BlockKey | null;
  /** true si dominante y secundario quedaron a ≤3 puntos de diferencia */
  isMixedProfile: boolean;
  blockScores: Record<BlockKey, BlockScore>;
  dimensionScores: DimensionScores;
  indexScore: number;
  level: Level;
  patterns: string[];
}

export class AletheiaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AletheiaValidationError";
  }
}
