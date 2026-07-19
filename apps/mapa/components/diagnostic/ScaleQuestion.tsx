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
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm transition-colors duration-200 ease-kairos ${
              value === n
                ? "border-accent bg-foreground/5 text-accent"
                : "border-foreground/15 hover:border-foreground/30"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-foreground/40">
        <span>{LABELS[1]}</span>
        <span>{LABELS[5]}</span>
      </div>
    </div>
  );
}
