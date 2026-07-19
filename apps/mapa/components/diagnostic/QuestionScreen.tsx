"use client";

import { useEffect, useRef } from "react";
import { Screen } from "@kairos/ui";
import type { StaticQuestion } from "@kairos/scoring-engine";
import type { DraftAnswer } from "@/lib/diagnostic/flow";
import { isAnswerComplete } from "@/lib/diagnostic/flow";
import { SingleSelectQuestion } from "./SingleSelectQuestion";
import { ScaleQuestion } from "./ScaleQuestion";
import { RankingQuestion } from "./RankingQuestion";

interface QuestionScreenProps {
  question: StaticQuestion;
  answer: DraftAnswer | undefined;
  onAnswerChange: (answer: DraftAnswer) => void;
  onContinue: () => void;
}

// Palabra discreta sobre la pregunta — copy provisional (ver rediseño).
const EYEBROW = "Reflexiona";

// Cuánto permanece visible la selección antes de avanzar sola.
const AUTO_ADVANCE_DELAY_MS = 300;

// Duración de la transición entre preguntas — ajustada de 400ms a 250ms
// para que se sienta casi imperceptible, no una animación "vista".
const TRANSITION_DURATION_MS = 250;

export function QuestionScreen({
  question,
  answer,
  onAnswerChange,
  onContinue,
}: QuestionScreenProps): React.JSX.Element {
  const complete = isAnswerComplete(question, answer);
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  const answerKey = JSON.stringify(answer);
  useEffect(() => {
    if (!complete) return;
    const timer = setTimeout(() => onContinueRef.current(), AUTO_ADVANCE_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, answerKey]);

  return (
    <Screen className="px-6 pb-16 pt-28">
      {/* Fondo — apenas perceptible, no debe notarse como "diseño" */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[130px]" />
      </div>

      <div
        key={question.id}
        style={{ animation: `fade-in-slide ${TRANSITION_DURATION_MS}ms var(--ease-kairos) forwards` }}
        className="w-full max-w-sm"
      >
        <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-foreground/25">
          {EYEBROW}
        </p>
        <p className="mb-16 font-serif text-[28px] leading-[1.25] tracking-tight sm:text-4xl">
          {question.prompt}
        </p>

        {question.format === "scale" ? (
          <ScaleQuestion
            value={answer?.valueNumeric}
            onSelect={(valueNumeric) => onAnswerChange({ questionId: question.id, valueNumeric })}
          />
        ) : question.format === "ranking" ? (
          <RankingQuestion
            question={question}
            rankedOptionIds={answer?.rankedOptionIds ?? []}
            onChange={(rankedOptionIds) =>
              onAnswerChange({ questionId: question.id, rankedOptionIds })
            }
          />
        ) : (
          <SingleSelectQuestion
            question={question}
            selectedOptionId={answer?.questionOptionId}
            onSelect={(questionOptionId) =>
              onAnswerChange({ questionId: question.id, questionOptionId })
            }
          />
        )}
      </div>
    </Screen>
  );
}
