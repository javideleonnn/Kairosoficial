import type { BlockKey } from "./types";

export const STRENGTH_BY_BLOCK: Record<BlockKey, string> = {
  FD: "Tienes una dirección más clara que la mayoría — sabes hacia dónde vas.",
  IDE: "Tu identidad es estable — sabes quién eres independientemente del entorno.",
  DM: "Tu constancia no depende del estado de ánimo del día — eso es raro.",
  AS: "No te saboteas cuando las cosas van bien — sostienes tu propio avance.",
  VE: "No dependes de la aprobación externa para sostener tu esfuerzo.",
};

export const RISK_BY_BLOCK: Record<BlockKey, string> = {
  FD: "Seguirás acumulando esfuerzo disperso que nunca suma en una sola dirección.",
  IDE: "Seguirás logrando cosas que se sienten ajenas, sin conectar con quién realmente eres.",
  DM: "La brecha entre tu potencial real y tus resultados seguirá creciendo.",
  AS: "Seguirás repitiendo el ciclo de avance-freno, cada vez con más desgaste.",
  VE: "Seguirás construyendo una vida optimizada para la aprobación de otros, no para ti.",
};
