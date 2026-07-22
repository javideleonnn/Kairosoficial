import type { ReactNode } from "react";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

export function Screen({ children, className = "" }: ScreenProps): React.JSX.Element {
  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground ${className}`}
    >
      {children}
    </main>
  );
}
