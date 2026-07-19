interface SelectionCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  /** para ranking: muestra un badge con el número de rango asignado */
  rankBadge?: number | undefined;
}

export function SelectionCard({
  label,
  selected,
  onSelect,
  rankBadge,
}: SelectionCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[28px] border px-6 py-5 text-left text-sm backdrop-blur-md transition-all duration-200 ease-kairos ${
        selected
          ? "border-accent/30 bg-accent/[0.04] shadow-[0_0_14px_-6px_var(--color-accent)]"
          : "border-foreground/10 bg-foreground/[0.03] hover:-translate-y-0.5 hover:border-foreground/20"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground/90">{label}</span>
        {rankBadge != null ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 text-xs text-accent">
            {rankBadge}
          </span>
        ) : selected ? (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-accent">
            <CheckIcon />
          </span>
        ) : null}
      </div>
    </button>
  );
}

function CheckIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
