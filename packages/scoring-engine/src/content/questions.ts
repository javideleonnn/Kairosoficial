import type { StaticQuestion } from "./types";

/**
 * Las 12 preguntas de Mapa Kairos — Método Umbral · Los 5 Bloqueos.
 * v3: rediseñadas desde el mapa conceptual de 20 manifestaciones (4 por
 * bloqueo), no por recorte de las 20 preguntas originales. Cada pregunta
 * mide manifestaciones específicas y sin redundancia; 3 preguntas de
 * escenario (Q3, Q4, Q5) existen específicamente para distinguir los 3
 * pares de "conducta idéntica, causa distinta" identificados en el mapa
 * conceptual:
 *   - Q3: FD (abandona por dispersión) vs AS (abandona justo cuando va bien)
 *   - Q4: IDE (no hay yo desde el cual negarse) vs VE (hay yo, pero teme decepcionar)
 *   - Q5: FD (modo reactivo, sin plan) vs DM (con plan, pero depende del ánimo)
 */
export const QUESTIONS: StaticQuestion[] = [
  {
    id: "q1",
    order: 1,
    format: "single_select",
    prompt: "¿Cuál de estas frases se siente más como algo que tú dirías?",
    options: [
      { id: "q1a", label: "Podría estar haciendo esto o cualquier otra cosa, no tengo una meta que lo guíe", blockKey: "FD", weight: 3 },
      { id: "q1b", label: "Me defino por lo que hago por otros, no por quién soy", blockKey: "IDE", weight: 3 },
      { id: "q1c", label: "Si no siento ganas, no empiezo", blockKey: "DM", weight: 3 },
      { id: "q1d", label: "Cuando algo me sale bien, encuentro forma de bajarle el ritmo", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q2",
    order: 2,
    format: "fill_blank",
    prompt: "Lo que más me cuesta es...",
    options: [
      { id: "q2a", label: "...decidir entre varios caminos que parecen igual de válidos", blockKey: "FD", weight: 3 },
      { id: "q2b", label: "...saber si lo que quiero es mío o de alguien más", blockKey: "IDE", weight: 3 },
      { id: "q2c", label: "...sostener algo sin un sistema que me ayude cuando no tengo ganas", blockKey: "DM", weight: 3 },
      { id: "q2d", label: "...no pensar en qué van a decir antes de decidir", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q3",
    order: 3,
    format: "scenario",
    prompt: "¿Cuál te describe más?",
    options: [
      { id: "q3a", label: "Empiezo algo, pierdo el interés, y paso a otra cosa", blockKey: "FD", weight: 3 },
      { id: "q3b", label: "Empiezo algo, va bien, y ahí es cuando lo abandono", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q4",
    order: 4,
    format: "scenario",
    prompt: "Cuando quieres decir que no a algo...",
    options: [
      { id: "q4a", label: "No sé bien cómo negarme, no tengo una postura clara", blockKey: "IDE", weight: 3 },
      { id: "q4b", label: "Sé lo que quiero decir, pero temo decepcionar si lo digo", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q5",
    order: 5,
    format: "scenario",
    prompt: "¿Cuál se parece más a cómo actúas?",
    options: [
      { id: "q5a", label: "Reacciono a lo que va apareciendo, sin un plan propio", blockKey: "FD", weight: 3 },
      { id: "q5b", label: "Tengo un plan, pero solo avanzo en él cuando tengo ánimo", blockKey: "DM", weight: 3 },
    ],
  },
  {
    id: "q6",
    order: 6,
    format: "single_select",
    prompt: "¿Cuál de estas situaciones te frustraría más?",
    options: [
      { id: "q6a", label: "Descubrir que evitas destacar por miedo a lo que eso traería", blockKey: "AS", weight: 3 },
      { id: "q6b", label: "Notar que tu esfuerzo baja cuando nadie más se entera", blockKey: "VE", weight: 3 },
      { id: "q6c", label: "Sentir que eres distinto según con quién estés", blockKey: "IDE", weight: 3 },
      { id: "q6d", label: "Ver que abandonas todo apenas se pasa el entusiasmo inicial", blockKey: "DM", weight: 3 },
    ],
  },
  {
    id: "q7",
    order: 7,
    format: "ranking",
    prompt: "Ordena estas frases de la que MÁS se parece a ti (arriba) a la que MENOS (abajo).",
    options: [
      { id: "q7a", label: "No tengo un rumbo claro todavía", blockKey: "FD", weight: null },
      { id: "q7b", label: "No sé quién soy fuera de lo que hago por otros", blockKey: "IDE", weight: null },
      { id: "q7c", label: "Solo avanzo cuando siento ganas reales", blockKey: "DM", weight: null },
      { id: "q7d", label: "Me freno justo cuando algo va bien", blockKey: "AS", weight: null },
      { id: "q7e", label: "Necesito que otros noten mi esfuerzo para sostenerlo", blockKey: "VE", weight: null },
    ],
    scoringConfig: { kind: "ranking", weights: [5, 4, 3, 2, 1] },
  },
  {
    id: "q8",
    order: 8,
    format: "scale",
    prompt: "Qué tan de acuerdo: \"Anticipo que algo va a salir mal antes de intentarlo, y eso termina por cumplirse.\"",
    options: [],
    scoringConfig: { kind: "scale", blockId: "AS", min: 1, max: 5, direction: "direct" },
  },
  {
    id: "q9",
    order: 9,
    format: "scale",
    prompt: "Qué tan de acuerdo: \"Mi ánimo cambia mucho según cómo reaccionen los demás a lo que hago.\"",
    options: [],
    scoringConfig: { kind: "scale", blockId: "VE", min: 1, max: 5, direction: "direct" },
  },
  {
    id: "q10",
    order: 10,
    format: "single_select",
    prompt: "¿Cuál de estas te resuena más?",
    options: [
      { id: "q10a", label: "Cuando una relación se vuelve importante, encuentro forma de generar distancia", blockKey: "AS", weight: 3 },
      { id: "q10b", label: "Mi rumbo cambia según la última conversación que tuve", blockKey: "FD", weight: 3 },
      { id: "q10c", label: "Sostengo mejor un compromiso si sé que alguien más está al tanto", blockKey: "VE", weight: 3 },
      { id: "q10d", label: "Actúo distinto en cada grupo, casi como versiones distintas de mí", blockKey: "IDE", weight: 3 },
    ],
  },
  {
    id: "q11",
    order: 11,
    format: "ranking",
    prompt: "Ordena de la que MÁS a la que MENOS describe tu último mes.",
    options: [
      { id: "q11a", label: "Cambié de objetivo antes de darle tiempo a funcionar", blockKey: "FD", weight: null },
      { id: "q11b", label: "Mostré una versión distinta de mí según el entorno", blockKey: "IDE", weight: null },
      { id: "q11c", label: "Sin ganas reales, no sostuve casi nada", blockKey: "DM", weight: null },
      { id: "q11d", label: "Me frené justo cuando algo empezaba a funcionar", blockKey: "AS", weight: null },
      { id: "q11e", label: "Necesité aprobación externa para no rendirme", blockKey: "VE", weight: null },
    ],
    scoringConfig: { kind: "ranking", weights: [5, 4, 3, 2, 1] },
  },
  {
    id: "q12",
    order: 12,
    format: "single_select",
    prompt: "De estas cinco, ¿cuál se siente más verdadera hoy?",
    options: [
      { id: "q12a", label: "No sé bien hacia dónde voy", blockKey: "FD", weight: 5 },
      { id: "q12b", label: "No sé bien quién soy cuando nadie más está mirando", blockKey: "IDE", weight: 5 },
      { id: "q12c", label: "Solo avanzo cuando tengo ganas, y eso es un problema", blockKey: "DM", weight: 5 },
      { id: "q12d", label: "Yo mismo me freno más veces de las que quisiera admitir", blockKey: "AS", weight: 5 },
      { id: "q12e", label: "Me importa demasiado lo que piensan de mí", blockKey: "VE", weight: 5 },
    ],
  },
];
