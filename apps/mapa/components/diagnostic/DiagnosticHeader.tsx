interface DiagnosticHeaderProps {
  answered: number;
  total: number;
}

export function DiagnosticHeader({ answered, total }: DiagnosticHeaderProps): React.JSX.Element {
  const percent = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return (
    <header className="fixed left-0 top-0 z-10 w-full">
      <div className="flex justify-center pb-3 pt-5">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/40">
          Kairos
        </span>
      </div>
      <div className="h-0.5 w-full bg-foreground/10">
        <div
          className="h-full bg-accent transition-all duration-500 ease-kairos"
          style={{ width: `${percent}%` }}
        />
      </div>
    </header>
  );
}
