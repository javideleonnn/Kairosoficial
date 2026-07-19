"use client";

import { Screen, Button } from "@kairos/ui";
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

export function QuestionScreen({
  question,
  answer,
  onAnswerChange,
  onContinue,
}: QuestionScreenProps): React.JSX.Element {
  const complete = isAnswerComplete(question, answer);

  return (
    <Screen className="px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="mb-6 font-serif text-xl leading-snug">{question.prompt}</p>

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

        <div
          className={`mt-8 flex justify-center transition-opacity duration-300 ease-kairos ${
            complete ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Button onClick={onContinue} disabled={!complete}>
            Continuar
          </Button>
        </div>
      </div>
    </Screen>
  );
}
