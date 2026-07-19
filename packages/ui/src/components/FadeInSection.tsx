"use client";

import type { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  /** orden de aparición — se multiplica por stepDelayMs */
  index?: number;
  /** ms entre cada elemento — 120 por defecto (secciones grandes);
   * usar algo como 30-50 para listas de elementos pequeños (ej. cards) */
  stepDelayMs?: number;
  className?: string;
}

const DEFAULT_STEP_DELAY_MS = 120;

/** Cada sección aparece con un pequeño desfase respecto a la anterior —
 * el total nunca supera ~1s incluso con 7-8 secciones, para no hacer
 * esperar innecesariamente después de que el usuario ya completó el
 * diagnóstico. */
export function FadeInSection({
  children,
  index = 0,
  stepDelayMs = DEFAULT_STEP_DELAY_MS,
  className = "",
}: FadeInSectionProps): React.JSX.Element {
  return (
    <div
      className={`opacity-0 ${className}`}
      style={{
        animation: `fade-in-up 500ms var(--ease-kairos) forwards`,
        animationDelay: `${index * stepDelayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
