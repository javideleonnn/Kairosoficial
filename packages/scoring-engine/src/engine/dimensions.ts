import type { BlockKey } from "../content/types";
import type { BlockScore, DimensionScores } from "./types";

function avg(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function computeDimensionScores(
  blockScores: Record<BlockKey, BlockScore>,
): DimensionScores {
  const n = (key: BlockKey) => blockScores[key].normalized;

  return {
    claridad: Math.round(100 - avg([n("FD"), n("IDE")])),
    accion: Math.round(100 - avg([n("DM"), n("AS")])),
    confianza: Math.round(100 - avg([n("AS"), n("IDE"), n("VE")])),
    compromiso: Math.round(100 - avg([n("DM"), n("VE")])),
  };
}

export function computeIndexScore(dimensions: DimensionScores): number {
  return Math.round(
    avg([dimensions.claridad, dimensions.accion, dimensions.confianza, dimensions.compromiso]),
  );
}
