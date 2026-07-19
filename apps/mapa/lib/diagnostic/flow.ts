import { QUESTIONS, TRANSITIONS } from "@kairos/scoring-engine";
import type { StaticQuestion, Transition } from "@kairos/scoring-engine";

/**
 * Una respuesta en memoria, con nombres de campo alineados a `Answer` de
 * @kairos/types (questionOptionId, valueNumeric) — para que el Módulo 7
 * (Aletheia) y el Módulo 8 (guardado) puedan consumirla sin traducción.
 */
export interface DraftAnswer {
  questionId: string;
  questionOptionId?: string;
  valueNumeric?: number;
  /** solo en ranking — ids de opción en orden de más a menos identificado */
  rankedOptionIds?: string[];
}

export type FlowStep =
  | { kind: "question"; question: StaticQuestion }
  | { kind: "transition"; transition: Transition };

/** Intercala las 20 preguntas con las 3 transiciones de curiosidad, en el
 * orden correcto, a partir de `afterQuestionId`. */
export function buildFlowSteps(): FlowStep[] {
  const sorted = [...QUESTIONS].sort((a, b) => a.order - b.order);
  const steps: FlowStep[] = [];

  for (const question of sorted) {
    steps.push({ kind: "question", question });
    const transition = TRANSITIONS.find((t) => t.afterQuestionId === question.id);
    if (transition) {
      steps.push({ kind: "transition", transition });
    }
  }

  return steps;
}

export function isAnswerComplete(question: StaticQuestion, answer: DraftAnswer | undefined): boolean {
  if (!answer) return false;
  if (question.format === "scale") return answer.valueNumeric != null;
  if (question.format === "ranking") {
    return (answer.rankedOptionIds?.length ?? 0) === question.options.length;
  }
  return answer.questionOptionId != null;
}

export function countAnsweredQuestions(
  steps: FlowStep[],
  answers: Record<string, DraftAnswer>,
): number {
  return steps.filter(
    (step) => step.kind === "question" && isAnswerComplete(step.question, answers[step.question.id]),
  ).length;
}

export function totalQuestions(steps: FlowStep[]): number {
  return steps.filter((step) => step.kind === "question").length;
}
