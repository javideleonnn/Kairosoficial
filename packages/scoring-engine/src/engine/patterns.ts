import type { BlockKey } from "../content/types";

/**
 * Subset MVP de la biblioteca de patrones del documento de arquitectura
 * (que preveía 3-5 patrones por combinación dominante+secundario). Aquí:
 * un patrón base por bloqueo dominante, más un puñado de combinaciones
 * específicas cuando existen. Se amplía cuando el negocio lo requiera —
 * la función ya soporta agregar entradas sin cambiar su forma.
 */
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
