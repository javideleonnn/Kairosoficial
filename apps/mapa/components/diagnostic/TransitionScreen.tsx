"use client";

import { useEffect, useRef } from "react";
import type { Transition } from "@kairos/scoring-engine";
import { Entrance } from "./Entrance";

interface TransitionScreenProps {
  transition: Transition;
  onContinue: () => void;
  onBack: () => void;
}

const DISPLAY_DURATION_MS = 1600;

/**
 * Diseño nuevo — una constelación formándose (mismo lenguaje del radar y
 * la intro), no los anillos orbitales de la iteración anterior. Una
 * estrella central con puntos que se conectan a su alrededor, como si el
 * patrón se estuviera revelando en tiempo real.
 */
export function TransitionScreen({ transition, onContinue, onBack }: TransitionScreenProps): React.JSX.Element {
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  useEffect(() => {
    const timer = setTimeout(() => onContinueRef.current(), DISPLAY_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col px-6 text-foreground">
      <div className="pt-5">
        <button type="button" onClick={onBack} aria-label="Atrás" className="text-foreground/70">
          <span aria-hidden className="text-xl">←</span>
        </button>
      </div>

      <Entrance className="flex flex-1 flex-col items-center justify-center">
        <FormingConstellation />
        <p className="mt-10 text-center font-serif text-[26px] leading-tight">{transition.message}</p>
        <p className="mt-4 text-center text-sm text-foreground/45">
          Esto tomará menos de <span className="text-accent">30 segundos.</span>
        </p>
      </Entrance>

      <p className="pb-8 text-center text-xs text-foreground/30">
        Tus respuestas son 100% privadas y no se comparten con nadie.
      </p>
    </div>
  );
}

function FormingConstellation(): React.JSX.Element {
  const points = [
    { x: 130, y: 40 }, { x: 60, y: 100 }, { x: 200, y: 90 },
    { x: 90, y: 180 }, { x: 190, y: 190 }, { x: 130, y: 130 },
  ];
  const edges: Array<[number, number]> = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [1, 3], [2, 4]];

  return (
    <svg viewBox="0 0 260 230" width={220} height={195}>
      <defs>
        <radialGradient id="transitionGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a]!.x} y1={points[a]!.y} x2={points[b]!.x} y2={points[b]!.y}
          stroke="var(--color-accent)" strokeOpacity={0.3}
        />
      ))}
      {points.map((p, i) => {
        const isCore = i === 5;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={isCore ? 20 : 10} fill="url(#transitionGlow)" opacity={isCore ? 1 : 0.5} />
            <circle cx={p.x} cy={p.y} r={isCore ? 5 : 2.5} fill="var(--color-accent)" />
          </g>
        );
      })}
    </svg>
  );
}
