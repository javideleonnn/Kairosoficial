interface DiagnosticHeaderProps {
  answered: number;
  total: number;
}

/**
 * Chrome persistente (no es "una pantalla" a efectos de la regla de una
 * animación por pantalla — es una barra continua, como el scrubber de un
 * video). Sin contador numérico visible a propósito. Transform, no width.
 */
export function DiagnosticHeader({ answered, total }: DiagnosticHeaderProps): React.JSX.Element {
  const percent = total > 0 ? Math.min(1, answered / total) : 0;

  return (
    <header className="fixed left-0 top-0 z-10 w-full bg-background">
      <div className="px-6 pb-3 pt-5">
        <span className="font-serif text-sm tracking-wide text-accent">Kairos</span>
      </div>
      <div className="h-0.5 w-full bg-foreground/10">
        <div
          className="h-full origin-left bg-accent transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${percent})` }}
        />
      </div>
    </header>
  );
}
