"use client";

import type { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  index?: number;
  stepDelayMs?: number;
  className?: string;
}

const DEFAULT_STEP_DELAY_MS = 120;

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
