"use client";

import { useEffect, useRef } from "react";
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

// Palabra discreta sobre la pregunta — copy provisional (sin cambios en
// este sprint, fuera de alcance — ver auditoría UX, Hallazgo #6).
const EYEBROW = "Reflexiona";
const HELPER = "Elige la que más se acerque a tu realidad.";

const AUTO_ADVANCE_DELAY_MS = 300;
const TRANSITION_DURATION_MS = 250;

/**
 * Nota de rendimiento: este componente ya NO renderiza su propio fondo
 * (antes tenía un blur de 130px que se recalculaba en cada remount, cada
 * ~300-550ms — la causa real del lag en móvil). El fondo ahora vive una
 * sola vez en DiagnosticFlow, que nunca se remonta.
 */
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
    <div className="flex min-h-screen items-center justify-center px-6 pb-16 pt-28">
      <div
        key={question.id}
        style={{ animation: `fade-in-slide ${TRANSITION_DURATION_MS}ms var(--ease-kairos) forwards` }}
        className="w-full max-w-sm"
      >
        <div className="mb-10 text-center">
          <p className="mb-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground/30">
            <span className="h-1 w-1 rounded-full bg-accent/60" />
            {EYEBROW}
          </p>
          <p className="font-serif text-[26px] leading-[1.3] tracking-tight sm:text-3xl">
            {question.prompt}
          </p>
          <p className="mt-4 text-sm text-accent/70">{HELPER}</p>
        </div>

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
    </div>
  );
}
