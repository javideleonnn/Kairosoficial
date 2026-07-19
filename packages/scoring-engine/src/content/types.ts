import type { QuestionFormat, ScoringConfig } from "@kairos/types";

export type { QuestionFormat, ScoringConfig } from "@kairos/types";

/**
 * Los 5 bloqueos, como llaves fijas — no como filas de una tabla `blocks`.
 * Ver decisión del Módulo 6: el contenido vive en código hasta que exista
 * una razón real (multi-producto, multi-idioma) para moverlo a Supabase.
 */
export type BlockKey = "FD" | "IDE" | "DM" | "AS" | "VE";

export const BLOCK_NAMES: Record<BlockKey, string> = {
  FD: "Falta de Dirección",
  IDE: "Identidad Débil",
  DM: "Dependencia de la Motivación",
  AS: "Autosabotaje",
  VE: "Validación Externa",
};

export interface StaticOption {
  id: string;
  label: string;
  /** a qué bloqueo suma esta opción (null solo para ítems sin peso directo) */
  blockKey: BlockKey | null;
  weight: number | null;
}

export interface StaticQuestion {
  id: string;
  order: number;
  format: QuestionFormat;
  prompt: string;
  /** presente en single_select, scenario, fill_blank, y como ítems en ranking */
  options: StaticOption[];
  /** presente solo en scale y ranking */
  scoringConfig?: ScoringConfig;
}

export interface Transition {
  /** el id de la pregunta después de la cual aparece esta transición */
  afterQuestionId: string;
  lines: string[];
}
