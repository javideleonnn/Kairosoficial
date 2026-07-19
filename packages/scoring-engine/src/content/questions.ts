import type { StaticQuestion } from "./types";

/**
 * Las 20 preguntas de Mapa Kairos — Método Umbral · Los 5 Bloqueos.
 * Ver documento "Mapa Kairos — Sistema de Diagnóstico v2" para el diseño
 * completo de cada formato y su justificación.
 */
export const QUESTIONS: StaticQuestion[] = [
  {
    id: "q1",
    order: 1,
    format: "single_select",
    prompt: "¿Cuál de estas frases se siente más como algo que tú dirías?",
    options: [
      { id: "q1a", label: "Podría estar haciendo esto o cualquier otra cosa, la verdad", blockKey: "FD", weight: 3 },
      { id: "q1b", label: "Cuando estoy solo, ni siquiera sé bien quién soy", blockKey: "IDE", weight: 3 },
      { id: "q1c", label: "Si hoy no tengo ganas, simplemente no pasa", blockKey: "DM", weight: 3 },
      { id: "q1d", label: "En el fondo sé que yo mismo me freno", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q2",
    order: 2,
    format: "fill_blank",
    prompt: "Termino esta frase: \"Lo que más me cuesta es...\"",
    options: [
      { id: "q2a", label: "...saber hacia dónde ir", blockKey: "FD", weight: 3 },
      { id: "q2b", label: "...sentirme yo mismo en todos lados", blockKey: "IDE", weight: 3 },
      { id: "q2c", label: "...sostener algo sin sentir ganas todos los días", blockKey: "DM", weight: 3 },
      { id: "q2d", label: "...que lo que hago no dependa de lo que otros piensen", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q3",
    order: 3,
    format: "scale",
    prompt: "Qué tan de acuerdo estás: \"Sigo adelante incluso cuando nadie más lo sabe o lo nota.\"",
    options: [],
    scoringConfig: { kind: "scale", blockId: "VE", min: 1, max: 5, direction: "inverse" },
  },
  {
    id: "q4",
    order: 4,
    format: "scenario",
    prompt: "Imagina que tienes dos caminos posibles esta semana. ¿Cuál se parece más a ti?",
    options: [
      { id: "q4a", label: "Avanzo en un proyecto, pero cambio de dirección a mitad de camino", blockKey: "FD", weight: 3 },
      { id: "q4b", label: "Empiezo con todo, pero me freno justo cuando iba bien", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q5",
    order: 5,
    format: "single_select",
    prompt: "¿Cuál de estas describe mejor tu semana típica?",
    options: [
      { id: "q5a", label: "Hago cosas distintas cada semana, sin un hilo conductor claro", blockKey: "FD", weight: 3 },
      { id: "q5b", label: "Actúo distinto según con quién esté", blockKey: "IDE", weight: 3 },
      { id: "q5c", label: "Tengo días muy productivos y días donde no logro nada", blockKey: "DM", weight: 3 },
      { id: "q5d", label: "Reviso cómo reaccionan otros a lo que hago", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q6",
    order: 6,
    format: "single_select",
    prompt: "¿Cuál de estas situaciones te generaría más frustración real?",
    options: [
      { id: "q6a", label: "Llevar meses sin saber si vas en la dirección correcta", blockKey: "FD", weight: 3 },
      { id: "q6b", label: "Lograr algo y sentir que ni siquiera fue \"tú\" quien lo logró", blockKey: "IDE", weight: 3 },
      { id: "q6c", label: "Empezar algo con toda la intención y abandonarlo semanas después", blockKey: "DM", weight: 3 },
      { id: "q6d", label: "Hacer un buen trabajo y que nadie lo note", blockKey: "VE", weight: 3 },
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
    format: "fill_blank",
    prompt: "Si tuviera que admitir algo, sería: \"En realidad...\"",
    options: [
      { id: "q8a", label: "...no he decidido qué quiero de verdad", blockKey: "FD", weight: 3 },
      { id: "q8b", label: "...no sé si esta es la versión real de mí", blockKey: "IDE", weight: 3 },
      { id: "q8c", label: "...dependo demasiado de cómo me siento cada día", blockKey: "DM", weight: 3 },
      { id: "q8d", label: "...me importa demasiado lo que piensan de mí", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q9",
    order: 9,
    format: "scale",
    prompt: "Qué tan de acuerdo: \"Cuando algo empieza a salirme bien, encuentro una forma de bajarle el ritmo.\"",
    options: [],
    scoringConfig: { kind: "scale", blockId: "AS", min: 1, max: 5, direction: "direct" },
  },
  {
    id: "q10",
    order: 10,
    format: "single_select",
    prompt: "¿Cuál se siente más verdadera hoy?",
    options: [
      { id: "q10a", label: "Tengo varias metas, pero ninguna firme del todo", blockKey: "FD", weight: 3 },
      { id: "q10b", label: "Soy bueno adaptándome, pero no sé cuál es la versión \"real\"", blockKey: "IDE", weight: 3 },
      { id: "q10c", label: "Necesito un empujón externo para empezar casi todo", blockKey: "DM", weight: 3 },
      { id: "q10d", label: "Sé lo que quiero, pero algo en mí lo complica siempre", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q11",
    order: 11,
    format: "scenario",
    prompt: "¿Cuál de estas dos situaciones describe mejor cómo actúas?",
    options: [
      { id: "q11a", label: "Tomo una decisión grande y la cambio poco después", blockKey: "FD", weight: 3 },
      { id: "q11b", label: "Tomo una decisión grande según lo que otros esperarían de mí", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q12",
    order: 12,
    format: "single_select",
    prompt: "¿Qué te frustraría más si te pasara a ti?",
    options: [
      { id: "q12a", label: "Darte cuenta de que llevas años sin una dirección clara", blockKey: "FD", weight: 3 },
      { id: "q12b", label: "Sentir que ni tú mismo sabes cómo eres \"de verdad\"", blockKey: "IDE", weight: 3 },
      { id: "q12c", label: "Ver que solo avanzas cuando alguien más está pendiente", blockKey: "VE", weight: 3 },
      { id: "q12d", label: "Descubrir que te has estado saboteando sin darte cuenta", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q13",
    order: 13,
    format: "single_select",
    prompt: "¿Con cuál te identificas más al pensar en tus últimos 12 meses?",
    options: [
      { id: "q13a", label: "Cambié de enfoque varias veces sin quedarme con ninguno", blockKey: "FD", weight: 3 },
      { id: "q13b", label: "Sentí que actuaba distinto según el entorno, sin un \"yo\" estable", blockKey: "IDE", weight: 3 },
      { id: "q13c", label: "Tuve rachas intensas y luego meses sin avanzar nada", blockKey: "DM", weight: 3 },
      { id: "q13d", label: "Avancé, pero me frené justo cuando algo empezaba a funcionar", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q14",
    order: 14,
    format: "fill_blank",
    prompt: "La razón por la que no he avanzado más este año es que...",
    options: [
      { id: "q14a", label: "...no tengo un objetivo lo suficientemente claro", blockKey: "FD", weight: 3 },
      { id: "q14b", label: "...no sé bien qué es lo que realmente quiero, versus lo que otros quieren para mí", blockKey: "IDE", weight: 3 },
      { id: "q14c", label: "...necesito sentirme inspirado para actuar, y eso no es constante", blockKey: "DM", weight: 3 },
      { id: "q14d", label: "...cuando las cosas van bien, algo en mí las complica", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q15",
    order: 15,
    format: "scale",
    prompt: "Qué tan de acuerdo: \"Sigo pensando en lo que otros dirían antes de tomar decisiones importantes.\"",
    options: [],
    scoringConfig: { kind: "scale", blockId: "VE", min: 1, max: 5, direction: "direct" },
  },
  {
    id: "q16",
    order: 16,
    format: "ranking",
    prompt: "Ordena de la que MÁS a la que MENOS describe tu último mes.",
    options: [
      { id: "q16a", label: "No supe bien en qué enfocar mi energía", blockKey: "FD", weight: null },
      { id: "q16b", label: "Sentí que mostraba una versión distinta según con quién estaba", blockKey: "IDE", weight: null },
      { id: "q16c", label: "Solo avancé en los días que sentí ganas reales", blockKey: "DM", weight: null },
      { id: "q16d", label: "Cuando algo iba bien, encontré forma de frenarlo", blockKey: "AS", weight: null },
      { id: "q16e", label: "Necesité que alguien más notara mi esfuerzo para seguir", blockKey: "VE", weight: null },
    ],
    scoringConfig: { kind: "ranking", weights: [5, 4, 3, 2, 1] },
  },
  {
    id: "q17",
    order: 17,
    format: "scenario",
    prompt: "Si tuvieras que elegir cuál te describe más...",
    options: [
      { id: "q17a", label: "Sé lo que quiero, pero me cuesta sostenerlo sin ganas constantes", blockKey: "DM", weight: 3 },
      { id: "q17b", label: "Sé lo que quiero, pero necesito que otros lo validen para seguir", blockKey: "VE", weight: 3 },
    ],
  },
  {
    id: "q18",
    order: 18,
    format: "single_select",
    prompt: "Última de este bloque — ¿cuál resuena más?",
    options: [
      { id: "q18a", label: "Todavía no tengo un rumbo que sienta 100% mío", blockKey: "FD", weight: 3 },
      { id: "q18b", label: "No termino de saber quién soy fuera de mis roles", blockKey: "IDE", weight: 3 },
      { id: "q18c", label: "Mi consistencia depende demasiado de cómo me siento", blockKey: "DM", weight: 3 },
      { id: "q18d", label: "Yo mismo he sido mi principal obstáculo, más de una vez", blockKey: "AS", weight: 3 },
    ],
  },
  {
    id: "q19",
    order: 19,
    format: "scale",
    prompt:
      "Qué tan de acuerdo: \"Si nadie más se enterara nunca de mis logros, seguiría esforzándome exactamente igual.\"",
    options: [],
    // Simplificado respecto al documento de diseño: solo afecta VE (no VE+DM),
    // para no extender ScoringConfig a múltiples bloqueos por un solo caso.
    scoringConfig: { kind: "scale", blockId: "VE", min: 1, max: 5, direction: "inverse" },
  },
  {
    id: "q20",
    order: 20,
    format: "single_select",
    prompt: "De estas cinco, ¿cuál se siente más verdadera cuando piensas en ti hoy?",
    options: [
      { id: "q20a", label: "No sé bien hacia dónde voy", blockKey: "FD", weight: 5 },
      { id: "q20b", label: "No sé bien quién soy cuando nadie más está mirando", blockKey: "IDE", weight: 5 },
      { id: "q20c", label: "Solo avanzo cuando tengo ganas, y eso es un problema", blockKey: "DM", weight: 5 },
      { id: "q20d", label: "Yo mismo me freno más veces de las que quisiera admitir", blockKey: "AS", weight: 5 },
      { id: "q20e", label: "Me importa demasiado lo que piensan de mí", blockKey: "VE", weight: 5 },
    ],
  },
];
