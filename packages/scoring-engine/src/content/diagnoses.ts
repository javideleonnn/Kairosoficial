import type { BlockKey } from "./types";

export interface FullDiagnosis {
  meaning: string;
  origin: string;
  relationships: string;
  work: string;
  selfEsteem: string;
  decisions: string;
  riskIfUnchanged: string;
  potential: string;
}

/**
 * Los 5 diagnósticos completos — deliberadamente sin sección de "cómo
 * resolverlo" (ver documento original). El objetivo es generar claridad
 * total, no ofrecer el camino de salida.
 */
export const FULL_DIAGNOSES: Record<BlockKey, FullDiagnosis> = {
  FD: {
    meaning:
      "No es indecisión ocasional. Es la ausencia de un punto de referencia interno estable desde el cual evaluar qué vale la pena perseguir. No careces de opciones — careces de un criterio. Por eso cambias de objetivo con facilidad: no porque el anterior fuera malo, sino porque nunca hubo una brújula real que lo sostuviera en primer lugar.",
    origin:
      "Casi siempre se forma en entornos donde nunca se te exigió — ni se te permitió — definir un rumbo propio. O el camino estuvo siempre trazado por otros, o hubo demasiada libertad sin ninguna estructura que enseñara a elegir con intención. El resultado es el mismo: capacidad de acción sin mapa.",
    relationships:
      "Entras en vínculos por cercanía o conveniencia del momento, no por alineación real de valores o dirección de vida. Con el tiempo, esto genera relaciones que funcionan superficialmente pero no acompañan ningún proyecto de vida compartido.",
    work:
      "Una carrera hecha de saltos: proyectos abandonados a medio camino, cambios de rumbo constantes disfrazados de \"flexibilidad\", y una productividad que se siente intensa pero no acumula.",
    selfEsteem:
      "Una fatiga silenciosa: la sensación crónica de estar haciendo cosas sin llegar a ningún lado. Sin evidencia acumulada de progreso, la mente concluye —incorrectamente— que la capacidad tampoco existe.",
    decisions:
      "Cada decisión pesa más de lo necesario porque se toma desde cero, sin un marco que la simplifique. Parálisis por análisis, decisiones por descarte, tendencia a delegar lo importante en otros.",
    riskIfUnchanged:
      "Seguirás acumulando esfuerzo disperso que nunca suma en una sola dirección — los años pasan, las opciones se acumulan, y la falta de dirección empieza a sentirse menos como \"todavía no decido\" y más como una identidad.",
    potential:
      "Una vez que existe una dirección clara, la misma energía que antes se dispersaba se convierte en enfoque acumulativo. El cambio no es de esfuerzo, es de eje.",
  },
  IDE: {
    meaning:
      "No es falta de personalidad. Es la ausencia de un \"yo\" estable que se sostenga independientemente del entorno. Tienes múltiples versiones de ti — una para cada contexto — y ninguna se siente completamente \"la real\".",
    origin:
      "Suele formarse a partir de una necesidad de adaptación constante en la infancia o adolescencia — entornos inestables, o dinámicas donde el amor se sentía condicionado a \"ser de cierta forma\". El resultado: experto en detectar lo que el entorno espera, poca práctica en preguntarte qué quieres tú, sin referencia externa.",
    relationships:
      "Se construyen sobre una versión adaptada, no sobre la persona real — lo cual genera la sensación crónica de no ser completamente visto, incluso en vínculos cercanos. También dificulta poner límites: decir que no requiere un \"yo\" firme.",
    work:
      "Una carrera que parece \"de otra persona\" — elegida por presión o prestigio más que por conexión genuina con quién eres. Dificultad para desarrollar una voz propia, porque eso requeriría primero saber quién habla.",
    selfEsteem:
      "Queda atada a la validación del entorno inmediato, porque no hay un núcleo interno estable que la sostenga sola. Cada cambio de contexto puede sentirse como una pequeña crisis de identidad.",
    decisions:
      "Las decisiones importantes se toman en función de lo que \"se supone\" que debe hacerse, no desde una claridad interna de quién eres. Una vida que desde afuera parece exitosa, pero que internamente se siente ajena.",
    riskIfUnchanged:
      "La sensación de \"no saber quién soy\" se profundiza incluso mientras se acumulan logros externos — porque los logros no resuelven una identidad débil, solo la disfrazan mejor.",
    potential:
      "Una estabilidad interna que ya no depende del entorno para sostenerse — la misma esencia en cualquier contexto. Esa estabilidad es la base desde la cual todo lo demás se vuelve más fácil.",
  },
  DM: {
    meaning:
      "La acción está condicionada a un estado emocional que no controlas. Cuando hay ganas, hay avance; cuando no, todo se detiene, sin importar la importancia real de lo que había que hacer. No es pereza — es un sistema que confunde el sentir con el poder.",
    origin:
      "Se forma en entornos donde la acción nunca se disoció del deseo — donde no hubo necesidad temprana de \"hacer cosas difíciles sin ganas\" y construir el músculo de la disciplina independiente del ánimo.",
    relationships:
      "Vínculos inconsistentes: presencia intensa cuando hay ganas de conectar, distancia cuando no — lo cual genera relaciones que se sienten inestables para el otro, aunque la intención sea genuina.",
    work:
      "Rachas: períodos de productividad intensa seguidos de estancamientos que no se explican del todo, porque no dependen de la carga de trabajo sino del estado interno.",
    selfEsteem:
      "Un ciclo de culpa recurrente: días de alta productividad seguidos de auto-juicio severo en los días de baja energía, interpretados como \"falta de disciplina\" cuando es un patrón estructural, no un defecto moral.",
    decisions:
      "Las decisiones de largo plazo se ven comprometidas — se empieza con entusiasmo genuino y se abandona cuando el impulso decae, antes de que una estructura externa pueda sostener el proceso.",
    riskIfUnchanged:
      "La brecha entre potencial y resultados reales se hace cada vez más visible y más dolorosa, porque sabes que eres capaz, y ves la evidencia en tus rachas buenas, pero no logras sostenerla.",
    potential:
      "Una consistencia que ya no depende del clima emocional del día — la misma intensidad de las rachas buenas, sostenida de forma estructural.",
  },
  AS: {
    meaning:
      "El patrón más paradójico: te frenas justo cuando las cosas empiezan a ir bien. No por falta de capacidad ni dirección, sino por un conflicto entre lo que deseas conscientemente y lo que, a un nivel más profundo, se siente \"seguro\" o \"merecido\".",
    origin:
      "Suele tener raíz en experiencias donde el éxito o la visibilidad trajeron consecuencias negativas — críticas, envidia, mayor exigencia, distanciamiento de personas cercanas. El sistema nervioso aprendió que avanzar demasiado no es seguro.",
    relationships:
      "Puede manifestarse como sabotaje de vínculos que van bien — generar conflicto justo cuando una relación se vuelve significativa, como si la cercanía real activara la misma alarma que el éxito profesional.",
    work:
      "Proyectos abandonados justo antes de completarse, oportunidades no aprovechadas por \"no sentirse listo\", errores cometidos en momentos clave que, en retrospectiva, parecen casi intencionales.",
    selfEsteem:
      "Una relación de desconfianza contigo mismo: empiezas a anticipar tu propio sabotaje, lo cual añade una capa extra de ansiedad a cualquier intento de avance.",
    decisions:
      "Se toma la opción más segura, no la más alineada con tu potencial real, porque una parte de la mente ya está negociando con el riesgo de \"ir demasiado lejos\".",
    riskIfUnchanged:
      "Seguirás repitiendo el ciclo de avance-freno, cada vez con más desgaste — cada intento fallido refuerza la creencia de que \"algo en mí no funciona\", cuando el mecanismo es predecible y nunca fue interrumpido.",
    potential:
      "Al eliminar el freno de mano invisible, la capacidad y dirección que ya existen se traducen finalmente en resultados sostenidos, sin el patrón repetitivo de avanzar y retroceder.",
  },
  VE: {
    meaning:
      "El valor propio se calcula desde afuera hacia adentro: la aprobación o la mirada de otros se convierte en la medida principal de si algo vale la pena o si tú mismo vales. No es vanidad — es una dependencia estructural.",
    origin:
      "Frecuentemente se origina en entornos donde el afecto estuvo condicionado al logro o al comportamiento. Con el tiempo aprendiste a monitorear constantemente la reacción de otros como mecanismo de seguridad emocional.",
    relationships:
      "Das más de lo que recibes con tal de mantener la aprobación del otro, dificultad real para poner límites, y atención desproporcionada a cómo te perciben en vez de a lo que realmente sientes o necesitas.",
    work:
      "El desempeño se orienta hacia lo que será reconocido, más que hacia lo que genera valor real o satisfacción propia — puede producir éxito aparente que, sin embargo, se siente vacío.",
    selfEsteem:
      "Tan volátil como la opinión ajena: un comentario negativo o un silencio puede desestabilizar el estado de ánimo por completo, porque no existe un ancla interna independiente de la mirada externa.",
    decisions:
      "Se filtran constantemente por la pregunta \"¿qué van a pensar?\", lo cual desplaza la pregunta más importante: \"¿qué es lo que yo realmente quiero?\".",
    riskIfUnchanged:
      "Puedes construir una vida entera optimizada para la aprobación ajena, y darte cuenta —a menudo tarde— de que lograste todo lo que \"se suponía\" debía impresionar a otros, pero nada de eso te conecta con satisfacción propia.",
    potential:
      "Una estabilidad emocional que ya no depende de factores fuera de tu control — la opinión de otros deja de tener poder de veto sobre tus decisiones y tu estado de ánimo.",
  },
};
