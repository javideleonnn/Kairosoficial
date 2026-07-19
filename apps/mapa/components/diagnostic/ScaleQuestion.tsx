import { FadeInSection } from "@kairos/ui";

interface ScaleQuestionProps {
  value: number | undefined;
  onSelect: (value: number) => void;
}

const LABELS: Record<number, string> = {
  1: "Muy en desacuerdo",
  5: "Muy de acuerdo",
};

export function ScaleQuestion({ value, onSelect }: ScaleQuestionProps): React.JSX.Element {
  return (
    <div>
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((n, index) => (
          <FadeInSection key={n} index={index} stepDelayMs={40}>
            <button
              type="button"
              onClick={() => onSelect(n)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm backdrop-blur-md transition-all duration-200 ease-kairos ${
                value === n
                  ? "border-accent/30 bg-accent/[0.04] text-accent shadow-[0_0_14px_-6px_var(--color-accent)]"
                  : "border-foreground/10 bg-foreground/[0.03] hover:-translate-y-0.5 hover:border-foreground/20"
              }`}
            >
              {n}
            </button>
          </FadeInSection>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-foreground/35">
        <span>{LABELS[1]}</span>
        <span>{LABELS[5]}</span>
      </div>
    </div>
  );
}
