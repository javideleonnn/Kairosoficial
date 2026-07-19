interface DimensionBarProps {
  label: string;
  value: number;
  /** oculta el número — usado en Mapa Kairos donde no se muestran porcentajes */
  showValue?: boolean;
  /** true por defecto (comportamiento original) — la barra dominante de un
   * grupo puede quedar en dorado mientras el resto va en un tono neutro */
  highlight?: boolean;
  /** etiqueta discreta opcional junto al label, ej. "Patrón dominante" */
  tag?: string | undefined;
}

export function DimensionBar({
  label,
  value,
  showValue = true,
  highlight = true,
  tag,
}: DimensionBarProps): React.JSX.Element {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="flex items-center gap-2">
          <span className={highlight ? "text-foreground/80" : "text-foreground/50"}>{label}</span>
          {tag ? (
            <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[9px] uppercase tracking-wide text-accent/80">
              {tag}
            </span>
          ) : null}
        </span>
        {showValue ? <span className="text-foreground/40">{clamped}</span> : null}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-kairos ${
            highlight ? "bg-accent" : "bg-foreground/25"
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
