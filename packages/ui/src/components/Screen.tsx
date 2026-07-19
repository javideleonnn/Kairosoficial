import type { ReactNode } from "react";

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

/** Pantalla completa, fondo de marca, contenido centrado. El patrón base de
 * casi cualquier pantalla de Mapa Kairos y del CRM. */
export function Screen({ children, className = "" }: ScreenProps): React.JSX.Element {
  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground ${className}`}
    >
      {children}
    </main>
  );
}
