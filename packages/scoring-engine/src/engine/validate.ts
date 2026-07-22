import type { StaticQuestion } from "../content/types";
import type { EngineAnswer } from "./types";
import { AletheiaValidationError } from "./types";

export function validateAnswers(
  answers: EngineAnswer[],
  questions: StaticQuestion[],
): void {
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const answersByQuestionId = new Map(answers.map((a) => [a.questionId, a]));

  for (const question of questions) {
    const answer = answersByQuestionId.get(question.id);
    if (!answer) {
      throw new AletheiaValidationError(
        `Falta la respuesta a la pregunta "${question.id}".`,
      );
    }
    validateSingleAnswer(question, answer);
  }

  for (const answer of answers) {
    if (!questionsById.has(answer.questionId)) {
      throw new AletheiaValidationError(
        `La respuesta referencia una pregunta inexistente: "${answer.questionId}".`,
      );
    }
  }
}

function validateSingleAnswer(question: StaticQuestion, answer: EngineAnswer): void {
  if (question.format === "scale") {
    const config = question.scoringConfig;
    if (!config || config.kind !== "scale") {
      throw new AletheiaValidationError(
        `La pregunta "${question.id}" es de escala pero no tiene scoringConfig válido.`,
      );
    }
    if (
      answer.valueNumeric == null ||
      !Number.isInteger(answer.valueNumeric) ||
      answer.valueNumeric < config.min ||
      answer.valueNumeric > config.max
    ) {
      throw new AletheiaValidationError(
        `Respuesta inválida para "${question.id}": se esperaba un entero entre ${config.min} y ${config.max}.`,
      );
    }
    return;
  }

  if (question.format === "ranking") {
    const expectedIds = question.options.map((o) => o.id).sort();
    const got = [...(answer.rankedOptionIds ?? [])].sort();
    if (
      got.length !== expectedIds.length ||
      !expectedIds.every((id, i) => id === got[i])
    ) {
      throw new AletheiaValidationError(
        `Respuesta de ranking inválida para "${question.id}": debe incluir exactamente los ${expectedIds.length} ítems, sin repetir.`,
      );
    }
    return;
  }

  const validOptionIds = new Set(question.options.map((o) => o.id));
  if (!answer.questionOptionId || !validOptionIds.has(answer.questionOptionId)) {
    throw new AletheiaValidationError(
      `Respuesta inválida para "${question.id}": la opción "${answer.questionOptionId}" no existe.`,
    );
  }
}
