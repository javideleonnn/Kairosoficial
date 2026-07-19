"use client";

import { Screen, Button } from "@kairos/ui";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps): React.JSX.Element {
  return (
    <Screen>
      <div className="max-w-sm space-y-4 text-center">
        <p className="font-serif text-lg">Esto no mide tu personalidad.</p>
        <p className="font-serif text-lg">
          Mide el origen real de tu estancamiento.
        </p>
        <p className="text-sm text-foreground/50">
          5 minutos. Sin respuestas correctas. Solo patrones.
        </p>
        <div className="pt-4">
          <Button onClick={onStart}>Comenzar</Button>
        </div>
      </div>
    </Screen>
  );
}
