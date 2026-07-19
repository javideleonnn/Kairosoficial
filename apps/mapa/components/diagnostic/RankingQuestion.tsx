import { FadeInSection } from "@kairos/ui";
import type { StaticQuestion } from "@kairos/scoring-engine";
import { SelectionCard } from "./SelectionCard";

interface RankingQuestionProps {
  question: StaticQuestion;
  rankedOptionIds: string[];
  onChange: (rankedOptionIds: string[]) => void;
}

export function RankingQuestion({
  question,
  rankedOptionIds,
  onChange,
}: RankingQuestionProps): React.JSX.Element {
  function handleTap(optionId: string) {
    if (rankedOptionIds.includes(optionId)) return;
    onChange([...rankedOptionIds, optionId]);
  }

  const isComplete = rankedOptionIds.length === question.options.length;

  return (
    <div className="space-y-3">
      <p className="mb-1 text-xs text-foreground/30">
        Toca en orden, de la que MÁS se parece a ti a la que MENOS.
      </p>
      {question.options.map((option, index) => {
        const rank = rankedOptionIds.indexOf(option.id);
        return (
          <FadeInSection key={option.id} index={index} stepDelayMs={40}>
            <SelectionCard
              label={option.label}
              selected={rank !== -1}
              onSelect={() => handleTap(option.id)}
              rankBadge={rank !== -1 ? rank + 1 : undefined}
            />
          </FadeInSection>
        );
      })}
      {!isComplete && rankedOptionIds.length > 0 ? (
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs text-foreground/40 underline-offset-4 hover:underline"
        >
          Reiniciar orden
        </button>
      ) : null}
    </div>
  );
}
