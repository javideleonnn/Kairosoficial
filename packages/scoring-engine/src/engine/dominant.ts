import type { BlockKey } from "../content/types";
import type { BlockScore } from "./types";

const MIXED_PROFILE_THRESHOLD = 3;

export interface DominantResult {
  dominant: BlockKey;
  secondary: BlockKey | null;
  isMixedProfile: boolean;
}

export function determineDominantAndSecondary(
  blockScores: Record<BlockKey, BlockScore>,
  closingQuestionBlock: BlockKey,
): DominantResult {
  const sorted = (Object.values(blockScores) as BlockScore[]).sort(
    (a, b) => b.normalized - a.normalized,
  );

  const topScore = sorted[0]!.normalized;
  const tiedForFirst = sorted.filter((s) => s.normalized === topScore);

  let dominant: BlockKey;
  if (tiedForFirst.length === 1) {
    dominant = tiedForFirst[0]!.blockKey;
  } else if (tiedForFirst.some((s) => s.blockKey === closingQuestionBlock)) {
    dominant = closingQuestionBlock;
  } else {
    const FIXED_PRIORITY: BlockKey[] = ["AS", "FD", "DM", "IDE", "VE"];
    dominant = FIXED_PRIORITY.find((key) =>
      tiedForFirst.some((s) => s.blockKey === key),
    )!;
  }

  const remaining = sorted.filter((s) => s.blockKey !== dominant);
  const secondary = remaining[0]?.blockKey ?? null;
  const secondaryScore = remaining[0]?.normalized ?? 0;

  const isMixedProfile =
    secondary != null && topScore - secondaryScore <= MIXED_PROFILE_THRESHOLD;

  return { dominant, secondary, isMixedProfile };
}
