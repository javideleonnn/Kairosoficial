"use client";

import { useRef } from "react";

interface ScaleQuestionProps {
  value: number | undefined;
  onSelect: (value: number) => void;
  min: number;
  max: number;
}

/**
 * Réplica de la Imagen 4: número gigante, "DE {max}", escala horizontal
 * con línea conectora dorada hasta el valor actual, arrastrable (no
 * botones discretos). El rango (min/max) viene de la pregunta real —
 * el motor de scoring sigue siendo 1-5, no el "10" literal de la imagen
 * (ver nota de la autoauditoría: es la única desviación deliberada).
 */
export function ScaleQuestion({ value, onSelect, min, max }: ScaleQuestionProps): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  const steps = max - min + 1;
  const current = value ?? min;
  const percent = ((current - min) / (max - min)) * 100;

  function valueFromClientX(clientX: number): number {
    const track = trackRef.current;
    if (!track) return current;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(min + ratio * (max - min));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    onSelect(valueFromClientX(event.clientX));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;
    onSelect(valueFromClientX(event.clientX));
  }

  return (
    <div>
      <div className="text-center">
        <p className="font-serif text-[64px] leading-none text-accent">{current}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/40">DE {max}</p>
      </div>

      <div className="mt-10 flex justify-between px-1 text-xs text-foreground/40">
        {Array.from({ length: steps }, (_, i) => min + i).map((n) => (
          <span key={n} className={n === current ? "text-accent" : ""}>{n}</span>
        ))}
      </div>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative mt-2 flex h-8 items-center px-1 touch-none"
      >
        <div className="absolute left-1 right-1 h-px bg-foreground/15" />
        <div
          className="absolute left-1 h-px bg-accent"
          style={{ width: `calc((100% - 8px) * ${percent / 100})` }}
        />
        {Array.from({ length: steps }, (_, i) => min + i).map((n) => {
          const isCurrent = n === current;
          const p = ((n - min) / (max - min)) * 100;
          return (
            <div
              key={n}
              className="absolute"
              style={{ left: `calc(4px + (100% - 8px) * ${p / 100})`, transform: "translateX(-50%)" }}
            >
              {isCurrent ? (
                <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20" />
              ) : null}
              <span
                className={`relative block rounded-full border-2 ${
                  isCurrent ? "h-5 w-5 border-accent bg-accent" : "h-2.5 w-2.5 border-foreground/25 bg-background"
                }`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between text-xs text-foreground/35">
        <span>Muy en desacuerdo</span>
        <span>Muy de acuerdo</span>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-foreground/35">
        <span aria-hidden>↔</span>
        Desliza para seleccionar
      </div>
    </div>
  );
}
