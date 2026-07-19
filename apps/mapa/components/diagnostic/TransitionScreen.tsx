"use client";

import { useEffect, useState } from "react";
import { Screen, Button } from "@kairos/ui";
import type { Transition } from "@kairos/scoring-engine";

interface TransitionScreenProps {
  transition: Transition;
  onContinue: () => void;
}

export function TransitionScreen({
  transition,
  onContinue,
}: TransitionScreenProps): React.JSX.Element {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setVisibleLines(0);
    const timers = transition.lines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * 900),
    );
    return () => timers.forEach(clearTimeout);
  }, [transition]);

  const allVisible = visibleLines >= transition.lines.length;

  return (
    <Screen>
      <div className="max-w-sm space-y-4 text-center">
        {transition.lines.map((line, i) => (
          <p
            key={line}
            className={`font-serif text-lg transition-opacity duration-700 ease-kairos ${
              i < visibleLines ? "opacity-100" : "opacity-0"
            }`}
          >
            {line}
          </p>
        ))}
        <div
          className={`pt-4 transition-opacity duration-500 ease-kairos ${
            allVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Button onClick={onContinue}>Continuar</Button>
        </div>
      </div>
    </Screen>
  );
}
