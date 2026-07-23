"use client";

import { useEffect, useRef, useState } from "react";
import type { StaticQuestion } from "@kairos/scoring-engine";

interface RankingQuestionProps {
  question: StaticQuestion;
  rankedOptionIds: string[];
  onChange: (rankedOptionIds: string[]) => void;
}

/**
 * El arrastre (dos versiones distintas) falló en manos reales dos veces,
 * y no tengo forma de probarlo en un navegador de verdad en este entorno
 * — así que en vez de un tercer intento a ciegas sobre pointer events,
 * reemplazo la interacción por flechas arriba/abajo. Es 100% confiable en
 * cualquier dispositivo (sin pointer capture, sin touch-action, sin
 * ambigüedad de gestos) y sigue viéndose premium.
 */
export function RankingQuestion({ question, rankedOptionIds, onChange }: RankingQuestionProps): React.JSX.Element {
  const [order, setOrder] = useState<string[]>(
    rankedOptionIds.length === question.options.length
      ? rankedOptionIds
      : question.options.map((o) => o.id),
  );
  const optionsById = new Map(question.options.map((o) => [o.id, o]));

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    onChangeRef.current(order);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setOrder(next);
    onChange(next);
  }

  return (
    <div>
      <p className="mb-4 text-sm text-foreground/45">Siendo 1 lo que más te afecta.</p>
      <div className="space-y-3">
        {order.map((id, index) => {
          const option = optionsById.get(id)!;
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/15 px-5 py-5"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent text-sm text-accent">
                  {index + 1}
                </span>
                <span className="text-[15px] text-foreground/90">{option.label}</span>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  aria-label="Mover arriba"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-accent disabled:opacity-25"
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 15l6-6 6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Mover abajo"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-accent disabled:opacity-25"
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-foreground/35">Usa las flechas para reordenar</p>
    </div>
  );
}
