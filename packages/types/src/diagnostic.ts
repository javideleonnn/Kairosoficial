/**
 * Tipos de ejecución del diagnóstico — lo que ocurre cuando un usuario
 * responde Mapa Kairos. Ver Arquitectura Técnica, Parte 2, sección 4.
 */

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

/** Una respuesta individual. Los campos usados dependen del formato de la pregunta. */
export interface Answer {
  id: string;
  sessionId: string;
  questionId: string;
  /** single_select / scenario / fill_blank */
  questionOptionId: string | null;
  /** scale */
  valueNumeric: number | null;
  /** ranking: posición (1 = más se identifica) del ítem representado por questionOptionId */
  rankPosition: number | null;
  createdAt: string;
}

/** Puntaje crudo y normalizado (0-100) de un bloqueo para una sesión. */
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

/** El "Kairos ID" — resultado final calculado por Aletheia. */
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
