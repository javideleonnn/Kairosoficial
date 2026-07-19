"use client";

import type { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  /** orden de aparición — se multiplica por un delay corto y fijo */
  index?: number;
  className?: string;
}

const STEP_DELAY_MS = 120;

/** Cada sección aparece con un pequeño desfase respecto a la anterior —
 * el total nunca supera ~1s incluso con 7-8 secciones, para no hacer
 * esperar innecesariamente después de que el usuario ya completó el
 * diagnóstico. */
export function FadeInSection({
  children,
  index = 0,
  className = "",
}: FadeInSectionProps): React.JSX.Element {
  return (
    <div
      className={`opacity-0 ${className}`}
      style={{
        animation: `fade-in-up 500ms var(--ease-kairos) forwards`,
        animationDelay: `${index * STEP_DELAY_MS}ms`,
      }}
    >
      {children}
    </div>
  );
}
