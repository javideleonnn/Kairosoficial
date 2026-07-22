import type { BlockKey } from "../content/types";

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
  resultCode: string;
  dominantBlock: BlockKey;
  secondaryBlock: BlockKey | null;
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
