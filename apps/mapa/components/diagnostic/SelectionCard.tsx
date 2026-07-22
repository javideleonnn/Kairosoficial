interface SelectionCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  /** para ranking: muestra un badge con el número de rango asignado */
  rankBadge?: number | undefined;
}

/**
 * Fila con radio circle a la izquierda — estilo tomado de la imagen de
 * referencia oficial. Deliberadamente SIN backdrop-blur (a diferencia de
 * la versión anterior de glassmorphism): backdrop-filter en hasta 5
 * elementos animándose por pregunta era la causa real del lag en móvil
 * (ver optimización de rendimiento). El look "premium" viene del borde,
 * el radio circle y el glow al seleccionar, no del blur-through.
 */
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
      className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left text-sm transition-colors duration-150 ${
        selected
          ? "border-accent/50 bg-accent/[0.05]"
          : "border-foreground/12 bg-foreground/[0.015] hover:border-foreground/25"
      }`}
    >
      {rankBadge != null ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 text-xs text-accent">
          {rankBadge}
        </span>
      ) : (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
            selected ? "border-accent" : "border-foreground/25"
          }`}
        >
          {selected ? <span className="h-2.5 w-2.5 rounded-full bg-accent" /> : null}
        </span>
      )}
      <span className="text-foreground/90">{label}</span>
    </button>
  );
}
