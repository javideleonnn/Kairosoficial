"use client";

import { useEffect, useRef } from "react";
import { Screen } from "@kairos/ui";
import type { Transition } from "@kairos/scoring-engine";

interface TransitionScreenProps {
  transition: Transition;
  onContinue: () => void;
}

// Cuánto se muestra el mensaje antes de continuar solo — breve, no
// interrumpe la experiencia, no requiere ninguna acción del usuario.
const DISPLAY_DURATION_MS = 1800;

export function TransitionScreen({
  transition,
  onContinue,
}: TransitionScreenProps): React.JSX.Element {
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  useEffect(() => {
    const timer = setTimeout(() => onContinueRef.current(), DISPLAY_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Screen>
      <p
        style={{ animation: "fade-in-up 600ms var(--ease-kairos) forwards" }}
        className="font-serif text-lg text-foreground/70"
      >
        {transition.message}
      </p>
    </Screen>
  );
}
