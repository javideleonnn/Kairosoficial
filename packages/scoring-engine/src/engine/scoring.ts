import type { BlockKey, StaticQuestion } from "../content/types";
import type { BlockScore, EngineAnswer } from "./types";

const ALL_BLOCKS: BlockKey[] = ["FD", "IDE", "DM", "AS", "VE"];

function emptyTally(): Record<BlockKey, number> {
  return { FD: 0, IDE: 0, DM: 0, AS: 0, VE: 0 };
}

export function computeMaxPossiblePerBlock(
  questions: StaticQuestion[],
): Record<BlockKey, number> {
  const max = emptyTally();

  for (const question of questions) {
    if (question.format === "scale" && question.scoringConfig?.kind === "scale") {
      const { blockId, min, max: scaleMax } = question.scoringConfig;
      max[blockId as BlockKey] += scaleMax - min;
    } else if (question.format === "ranking" && question.scoringConfig?.kind === "ranking") {
      const topWeight = question.scoringConfig.weights[0] ?? 0;
      for (const option of question.options) {
        if (option.blockKey) max[option.blockKey] += topWeight;
      }
    } else {
      for (const option of question.options) {
        if (option.blockKey && option.weight) {
          max[option.blockKey] += option.weight;
        }
      }
    }
  }

  return max;
}

export function computeRawScores(
  answers: EngineAnswer[],
  questions: StaticQuestion[],
): Record<BlockKey, number> {
  const raw = emptyTally();
  const questionsById = new Map(questions.map((q) => [q.id, q]));

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    if (!question) continue;

    if (question.format === "scale" && question.scoringConfig?.kind === "scale") {
      const { blockId, min, max, direction } = question.scoringConfig;
      const value = answer.valueNumeric!;
      const points = direction === "direct" ? value - min : max - value;
      raw[blockId as BlockKey] += points;
    } else if (question.format === "ranking" && question.scoringConfig?.kind === "ranking") {
      const weights = question.scoringConfig.weights;
      const ranked = answer.rankedOptionIds ?? [];
      const optionsById = new Map(question.options.map((o) => [o.id, o]));
      ranked.forEach((optionId, position) => {
        const option = optionsById.get(optionId);
        const weight = weights[position];
        if (option?.blockKey && weight != null) {
          raw[option.blockKey] += weight;
        }
      });
    } else {
      const option = question.options.find((o) => o.id === answer.questionOptionId);
      if (option?.blockKey && option.weight) {
        raw[option.blockKey] += option.weight;
      }
    }
  }

  return raw;
}

export function computeBlockScores(
  answers: EngineAnswer[],
  questions: StaticQuestion[],
): Record<BlockKey, BlockScore> {
  const raw = computeRawScores(answers, questions);
  const max = computeMaxPossiblePerBlock(questions);

  const scores = {} as Record<BlockKey, BlockScore>;
  for (const key of ALL_BLOCKS) {
    const maxPossible = max[key];
    const normalized = maxPossible > 0 ? Math.round((raw[key] / maxPossible) * 100) : 0;
    scores[key] = { blockKey: key, raw: raw[key], maxPossible, normalized };
  }
  return scores;
}
