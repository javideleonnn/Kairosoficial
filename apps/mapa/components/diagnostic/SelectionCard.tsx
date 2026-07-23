interface SelectionCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  rankBadge?: number | undefined;
}

/**
 * Réplica de las Imágenes 5 y 3: el radio circle va a la DERECHA (no a la
 * izquierda, como en la implementación previa) y la card entera queda con
 * borde dorado al seleccionar. Sin sombra, sin blur.
 */
export function SelectionCard({ label, selected, onSelect, rankBadge }: SelectionCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-6 py-6 text-left text-[15px] ${
        selected ? "border-accent" : "border-foreground/15"
      }`}
    >
      <span className="text-foreground/90">{label}</span>
      {rankBadge != null ? (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent text-sm text-accent">
          {rankBadge}
        </span>
      ) : (
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-accent" : "border-foreground/25"
          }`}
        >
          {selected ? <span className="h-3 w-3 rounded-full bg-accent" /> : null}
        </span>
      )}
    </button>
  );
}
