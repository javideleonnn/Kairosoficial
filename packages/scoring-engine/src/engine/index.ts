import type { StaticQuestion } from "../content/types";
import { QUESTIONS } from "../content/questions";
import { validateAnswers } from "./validate";
import { computeBlockScores } from "./scoring";
import { determineDominantAndSecondary } from "./dominant";
import { computeDimensionScores, computeIndexScore } from "./dimensions";
import { getLevel } from "./levels";
import { getPatterns } from "./patterns";
import type { AletheiaResult, EngineAnswer } from "./types";

const ENGINE_VERSION = "aletheia-v1";
const CLOSING_QUESTION_ID = "q12";

export function computeAletheiaResult(
  answers: EngineAnswer[],
  questions: StaticQuestion[] = QUESTIONS,
): AletheiaResult {
  validateAnswers(answers, questions);

  const blockScores = computeBlockScores(answers, questions);

  const closingAnswer = answers.find((a) => a.questionId === CLOSING_QUESTION_ID);
  const closingQuestion = questions.find((q) => q.id === CLOSING_QUESTION_ID);
  const closingOption = closingQuestion?.options.find(
    (o) => o.id === closingAnswer?.questionOptionId,
  );
  const closingBlock = closingOption?.blockKey ?? "FD";

  const { dominant, secondary, isMixedProfile } = determineDominantAndSecondary(
    blockScores,
    closingBlock,
  );

  const dimensionScores = computeDimensionScores(blockScores);
  const indexScore = computeIndexScore(dimensionScores);
  const level = getLevel(indexScore);
  const patterns = getPatterns(dominant, secondary);

  const resultCode = `${dominant}-${secondary ?? "X"}-N${level.number}`;

  return {
    resultCode,
    dominantBlock: dominant,
    secondaryBlock: secondary,
    isMixedProfile,
    blockScores,
    dimensionScores,
    indexScore,
    level,
    patterns,
  };
}

export { ENGINE_VERSION };
