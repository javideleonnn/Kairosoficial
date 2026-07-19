import type { BlockKey } from "../content/types";
import type { BlockScore } from "./types";

const MIXED_PROFILE_THRESHOLD = 3;

export interface DominantResult {
  dominant: BlockKey;
  secondary: BlockKey | null;
  isMixedProfile: boolean;
}

/**
 * Determina dominante y secundario a partir de los puntajes normalizados.
 *
 * Desempate: si dos o más bloqueos empatan en el primer lugar, se usa la
 * respuesta de la pregunta de cierre (Q20) como voto de confianza — está
 * diseñada exactamente para esto (ver documento v2, pregunta 20). Si por
 * alguna razón el bloqueo de Q20 no está entre los empatados (no debería
 * ocurrir en la práctica), se usa un orden de prioridad fijo y documentado
 * como último recurso determinista.
 */
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
    // Último recurso determinista — orden fijo, documentado, nunca aleatorio.
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
