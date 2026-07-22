/**
 * Tipos de la metodología (Método Umbral · Los 5 Bloqueos).
 * Estos tipos representan las tablas versionadas de `product_versions` —
 * ver Kairos CRM — Arquitectura Técnica, Parte 2, sección 3.
 */

export type Locale = "es" | "en";

export type QuestionFormat =
  | "single_select"
  | "scale"
  | "ranking"
  | "scenario"
  | "fill_blank";

export interface ScaleScoringConfig {
  kind: "scale";
  blockId: string;
  min: number;
  max: number;
  direction: "direct" | "inverse";
}

export interface RankingScoringConfig {
  kind: "ranking";
  weights: number[];
}

export type ScoringConfig = ScaleScoringConfig | RankingScoringConfig;

export interface Block {
  id: string;
  productVersionId: string;
  key: string;
  orderIndex: number;
  name: string;
  description?: string;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  orderIndex: number;
  blockId: string | null;
  weight: number | null;
  label: string;
}

export interface Question {
  id: string;
  productVersionId: string;
  orderIndex: number;
  format: QuestionFormat;
  prompt: string;
  scoringConfig: ScoringConfig | null;
  options: QuestionOption[];
}

export interface Level {
  id: string;
  productVersionId: string;
  key: string;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  orderIndex: number;
}

export interface Pattern {
  id: string;
  productVersionId: string;
  dominantBlockId: string;
  secondaryBlockId: string | null;
  priority: number;
  text: string;
}

export interface ProductVersion {
  id: string;
  productId: string;
  versionNumber: number;
  status: "draft" | "active" | "archived";
  scoringEngineVersion: string;
  blocks: Block[];
  questions: Question[];
  levels: Level[];
  patterns: Pattern[];
}
