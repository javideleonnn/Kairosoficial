import type { BlockKey } from "../content/types";

const DOMINANT_PATTERNS: Record<BlockKey, string> = {
  FD: "Cambias de enfoque antes de que el anterior tenga oportunidad de dar resultado.",
  IDE: "Actúas distinto según el entorno — cuesta identificar cuál es la versión que de verdad eres tú.",
  DM: "Tu constancia depende más del ánimo del día que de un sistema sostenido.",
  AS: "Justo cuando algo empieza a funcionar, aparece un freno que tú mismo pones.",
  VE: "Buena parte de tus decisiones pasan primero por el filtro de qué pensarán otros.",
};

const COMBO_PATTERNS: Partial<Record<string, string>> = {
  "FD-AS": "No solo no tienes un rumbo claro — cuando por accidente avanzas en una dirección, algo en ti la frena.",
  "AS-VE": "El freno aparece más fuerte cuando hay ojos externos mirando el resultado.",
  "DM-VE": "Necesitas tanto ganas como aprobación externa para sostener el esfuerzo — cuando faltan las dos, todo se detiene.",
  "IDE-VE": "La versión de ti que muestras depende tanto del entorno que cuesta saber cuál es la que de verdad decide.",
};

export function getPatterns(dominant: BlockKey, secondary: BlockKey | null): string[] {
  const patterns: string[] = [DOMINANT_PATTERNS[dominant]];

  if (secondary) {
    const combo = COMBO_PATTERNS[`${dominant}-${secondary}`];
    if (combo) patterns.push(combo);
  }

  return patterns;
}
