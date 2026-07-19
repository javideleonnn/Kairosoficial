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

/** Config de una pregunta tipo escala (1-5), dirección directa o inversa. */
export interface ScaleScoringConfig {
  kind: "scale";
  blockId: string;
  min: number;
  max: number;
  direction: "direct" | "inverse";
}

/** Config de una pregunta tipo ranking — pesos por posición elegida. */
export interface RankingScoringConfig {
  kind: "ranking";
  /** pesos en orden: posición 1 (más se identifica) → última posición */
  weights: number[];
}

export type ScoringConfig = ScaleScoringConfig | RankingScoringConfig;

/** Un bloqueo de la metodología (FD, IDE, DM, AS, VE en la v1). */
export interface Block {
  id: string;
  productVersionId: string;
  key: string;
  orderIndex: number;
  name: string;
  description?: string;
}

/** Una opción de respuesta (usada en single_select, scenario, fill_blank, y como ítem en ranking). */
export interface QuestionOption {
  id: string;
  questionId: string;
  orderIndex: number;
  /** a qué bloqueo suma esta opción; en ranking, representa el ítem ordenado */
  blockId: string | null;
  /** peso fijo (no aplica a ranking, que usa scoringConfig.weights según posición) */
  weight: number | null;
  label: string;
}

export interface Question {
  id: string;
  productVersionId: string;
  orderIndex: number;
  format: QuestionFormat;
  prompt: string;
  /** solo presente en formatos scale y ranking */
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

/** Un patrón de la biblioteca de "patrones detectados" (combinación dominante + secundario). */
export interface Pattern {
  id: string;
  productVersionId: string;
  dominantBlockId: string;
  /** null = aplica solo por el dominante, sin importar el secundario */
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
