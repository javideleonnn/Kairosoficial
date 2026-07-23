"use client";

import { useEffect, useRef } from "react";
import type { StaticQuestion } from "@kairos/scoring-engine";
import type { DraftAnswer } from "@/lib/diagnostic/flow";
import { isAnswerComplete } from "@/lib/diagnostic/flow";
import { Entrance } from "./Entrance";
import { SingleSelectQuestion } from "./SingleSelectQuestion";
import { ScaleQuestion } from "./ScaleQuestion";
import { RankingQuestion } from "./RankingQuestion";

interface QuestionScreenProps {
  question: StaticQuestion;
  answer: DraftAnswer | undefined;
  onAnswerChange: (answer: DraftAnswer) => void;
  onContinue: () => void;
  onBack: () => void;
  questionNumber: number;
  totalQuestions: number;
}

const AUTO_ADVANCE_DELAY_MS = 120;

/**
 * Réplica de las Imágenes 3, 4, 5: header propio (flecha atrás, contador
 * "X / N", menú "•••", barra de progreso).
 */
export function QuestionScreen({
  question,
  answer,
  onAnswerChange,
  onContinue,
  onBack,
  questionNumber,
  totalQuestions,
}: QuestionScreenProps): React.JSX.Element {
  const complete = isAnswerComplete(question, answer);
  const isRanking = question.format === "ranking";
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  const answerKey = JSON.stringify(answer);
  useEffect(() => {
    // El ranking es la única excepción del flujo: nunca avanza solo, sin
    // importar cuántas veces se reordene — el usuario confirma con el
    // botón "Continuar". Ningún timer se programa para este formato.
    if (!complete || isRanking) return;
    const timer = setTimeout(() => onContinueRef.current(), AUTO_ADVANCE_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, answerKey, isRanking]);

  const percent = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 0;
  const scaleConfig = question.scoringConfig?.kind === "scale" ? question.scoringConfig : null;

  return (
    <div className="min-h-screen px-6 pb-16 text-foreground">
      <div className="flex items-center justify-between pt-5">
        <button type="button" onClick={onBack} aria-label="Atrás" className="text-foreground/70">
          <span aria-hidden className="text-xl">←</span>
        </button>
        <span className="text-sm text-foreground/60">{questionNumber} / {totalQuestions}</span>
        <button type="button" aria-label="Más opciones" className="text-foreground/70">
          <span aria-hidden>•••</span>
        </button>
      </div>

      <div className="mt-4 h-0.5 w-full rounded-full bg-foreground/10">
        <div
          className="h-full origin-left rounded-full bg-accent transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>

      <Entrance key={question.id} className="mx-auto mt-12 w-full max-w-sm">
        <p className="mb-10 text-center font-serif text-[26px] leading-[1.3]">{question.prompt}</p>

        {question.format === "scale" && scaleConfig ? (
          <ScaleQuestion
            value={answer?.valueNumeric}
            min={scaleConfig.min}
            max={scaleConfig.max}
            onSelect={(valueNumeric) => onAnswerChange({ questionId: question.id, valueNumeric })}
          />
        ) : question.format === "ranking" ? (
          <>
            <RankingQuestion
              question={question}
              rankedOptionIds={answer?.rankedOptionIds ?? []}
              onChange={(rankedOptionIds) => onAnswerChange({ questionId: question.id, rankedOptionIds })}
            />
            <button
              type="button"
              disabled={!complete}
              onClick={onContinue}
              className="mt-8 w-full rounded-full bg-accent py-4 text-base font-medium text-background disabled:opacity-40"
            >
              Continuar
            </button>
          </>
        ) : (
          <SingleSelectQuestion
            question={question}
            selectedOptionId={answer?.questionOptionId}
            onSelect={(questionOptionId) => onAnswerChange({ questionId: question.id, questionOptionId })}
          />
        )}
      </Entrance>
    </div>
  );
}
