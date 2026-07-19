interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps): React.JSX.Element {
  const percent = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return (
    <div className="fixed left-0 top-0 z-10 h-0.5 w-full bg-foreground/10">
      <div
        className="h-full bg-accent transition-all duration-300 ease-kairos"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
