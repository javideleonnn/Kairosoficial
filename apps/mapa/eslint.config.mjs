// Config mínima para que `pnpm lint` corra sin error de "no config found".
// El set de reglas real (next/core-web-vitals, etc.) se afina en el Módulo 13
// (Optimización) — no es crítico para la validación de este módulo.
export default [
  {
    ignores: [".next/**", "node_modules/**"],
  },
];
