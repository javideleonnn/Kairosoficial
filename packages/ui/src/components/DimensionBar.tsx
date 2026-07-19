interface DimensionBarProps {
  label: string;
  value: number;
}

export function DimensionBar({ label, value }: DimensionBarProps): React.JSX.Element {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-foreground/70">{label}</span>
        <span className="text-foreground/40">{clamped}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 ease-kairos"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
