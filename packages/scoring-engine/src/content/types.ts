import type { QuestionFormat, ScoringConfig } from "@kairos/types";

export type { QuestionFormat, ScoringConfig } from "@kairos/types";

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
  blockKey: BlockKey | null;
  weight: number | null;
}

export interface StaticQuestion {
  id: string;
  order: number;
  format: QuestionFormat;
  prompt: string;
  options: StaticOption[];
  scoringConfig?: ScoringConfig;
}

export interface Transition {
  afterQuestionId: string;
  message: string;
}
