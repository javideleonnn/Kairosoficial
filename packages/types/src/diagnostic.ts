import type { Locale } from "./methodology";

export type SessionStatus = "in_progress" | "completed" | "abandoned";

export interface DiagnosticSession {
  id: string;
  organizationId: string;
  productVersionId: string;
  leadId: string | null;
  locale: Locale;
  status: SessionStatus;
  source: string | null;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
}

export interface Answer {
  id: string;
  sessionId: string;
  questionId: string;
  questionOptionId: string | null;
  valueNumeric: number | null;
  rankPosition: number | null;
  createdAt: string;
}

export interface SessionScore {
  sessionId: string;
  blockId: string;
  rawScore: number;
  normalizedScore: number;
}

export interface DimensionScores {
  claridad: number;
  accion: number;
  confianza: number;
  compromiso: number;
}

export interface DiagnosticResult {
  id: string;
  sessionId: string;
  resultCode: string;
  dominantBlockId: string;
  secondaryBlockId: string | null;
  levelId: string;
  indexScore: number;
  dimensionScores: DimensionScores;
  patternIds: string[];
  engineVersion: string;
  computedAt: string;
}
