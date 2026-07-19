import type { Transition } from "./types";

export const TRANSITIONS: Transition[] = [
  {
    afterQuestionId: "q6",
    lines: [
      "Empieza a notarse un patrón.",
      "La mayoría de personas cree que su problema es \"falta de disciplina\".",
      "Casi nunca lo es.",
    ],
  },
  {
    afterQuestionId: "q12",
    lines: [
      "Tus respuestas están mostrando algo consistente.",
      "No es un rasgo de personalidad. Es un patrón que se repite.",
      "Vamos a confirmarlo con las últimas preguntas.",
    ],
  },
  {
    afterQuestionId: "q18",
    lines: [
      "Ya casi tenemos el patrón completo.",
      "Las últimas preguntas no buscan nueva información — buscan confirmar lo que ya apareció.",
    ],
  },
];
