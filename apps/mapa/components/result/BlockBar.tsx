interface BlockBarProps {
  label: string;
  value: number;
  highlight: boolean;
  tag?: string | undefined;
}

/** Implementación nueva, local — sin números (solo intensidad visual). */
export function BlockBar({ label, value, highlight, tag }: BlockBarProps): React.JSX.Element {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs">
        <span className={highlight ? "text-foreground/80" : "text-foreground/50"}>{label}</span>
        {tag ? (
          <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[9px] uppercase tracking-wide text-accent/80">
            {tag}
          </span>
        ) : null}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className={`h-full rounded-full ${highlight ? "bg-accent" : "bg-foreground/25"}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
