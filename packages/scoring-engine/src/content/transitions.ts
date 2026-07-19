import type { Transition } from "./types";

/**
 * Con 12 preguntas (2-3 minutos), 2 transiciones bastan — 3 en un
 * recorrido corto se sentiría como que se interrumpe a sí mismo (ver
 * sugerencia del rediseño de la pantalla de preguntas). Copy provisional.
 */
export const TRANSITIONS: Transition[] = [
  {
    afterQuestionId: "q4",
    message: "Tu mapa empieza a tomar forma.",
  },
  {
    afterQuestionId: "q8",
    message: "Falta muy poco para revelar tu mapa.",
  },
];
