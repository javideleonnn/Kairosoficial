"use client";

import { useEffect, useState, type ReactNode } from "react";

interface EntranceProps {
  children: ReactNode;
  className?: string;
}

/**
 * La ÚNICA primitiva de animación de todo el frontend nuevo. Una sola
 * transición (opacity + transform), nunca una keyframe @animation, nunca
 * stagger. Se monta invisible y pasa a visible un frame después — logra
 * el efecto de entrada sin backdrop-filter, sin blur, sin transition-all.
 * Usada exactamente una vez por pantalla (Intro, Pregunta, Transición,
 * Resultado) — esa es la regla dura de este rediseño.
 */
export function Entrance({ children, className = "" }: EntranceProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 200ms ease-out, transform 200ms ease-out",
      }}
    >
      {children}
    </div>
  );
}
