import type { StaticQuestion } from "@kairos/scoring-engine";
import { SelectionCard } from "./SelectionCard";

interface SingleSelectQuestionProps {
  question: StaticQuestion;
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
}

export function SingleSelectQuestion({
  question,
  selectedOptionId,
  onSelect,
}: SingleSelectQuestionProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <SelectionCard
          key={option.id}
          label={option.label}
          selected={selectedOptionId === option.id}
          onSelect={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}
