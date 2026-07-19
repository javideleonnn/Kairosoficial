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
      className={`w-full rounded-2xl border px-5 py-4 text-left text-sm transition-colors duration-200 ease-kairos ${
        selected
          ? "border-accent bg-foreground/5"
          : "border-foreground/10 bg-transparent hover:border-foreground/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {rankBadge != null ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent text-xs text-accent">
            {rankBadge}
          </span>
        ) : null}
      </div>
    </button>
  );
}
