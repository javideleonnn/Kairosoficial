"use client";

import { Button, FadeInSection } from "@kairos/ui";

interface IntroScreenProps {
  onStart: () => void;
}

const FEATURES = [
  { icon: IconList, label: "12 preguntas" },
  { icon: IconClock, label: "3 minutos" },
  { icon: IconSpark, label: "Resultado inmediato" },
  { icon: IconLock, label: "Sin registro" },
] as const;

const TRUST_ITEMS = ["Metodología propia", "Resultado personalizado", "Información privada"];

export function IntroScreen({ onStart }: IntroScreenProps): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-background px-6 py-8 text-foreground sm:py-12">
      {/* Fondo — degradados suaves, sin imágenes ni color plano */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-accent/[0.06] blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />
      </div>

      {/* Header */}
      <FadeInSection index={0} className="flex justify-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/50">
          Kairos
        </span>
      </FadeInSection>

      {/* Hero + card + CTA */}
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 py-10">
        <FadeInSection index={1} className="text-center">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            Descubre qué te está frenando.
          </h1>
          <p className="mx-auto mt-3 max-w-[26rem] text-sm text-foreground/55 sm:text-base">
            En menos de 3 minutos obtendrás tu Mapa Kairos, una representación
            visual del patrón que hoy limita más tu crecimiento.
          </p>
        </FadeInSection>

        <FadeInSection index={2}>
          <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.04] p-5 backdrop-blur-xl sm:p-6">
            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 text-accent">
                    <Icon />
                  </span>
                  <span className="text-sm text-foreground/80">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInSection>

        <FadeInSection index={3} className="flex justify-center">
          <Button onClick={onStart} className="w-full px-8 py-3.5 text-base sm:w-auto">
            Comenzar mi Mapa
          </Button>
        </FadeInSection>
      </div>

      {/* Indicadores de confianza */}
      <FadeInSection index={4} className="flex justify-center">
        <p className="text-center text-[11px] text-foreground/35">
          {TRUST_ITEMS.join("  ·  ")}
        </p>
      </FadeInSection>
    </main>
  );
}

function IconList(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <line x1="8" y1="6" x2="19" y2="6" />
      <line x1="8" y1="12" x2="19" y2="12" />
      <line x1="8" y1="18" x2="19" y2="18" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconClock(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function IconSpark(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4z" />
    </svg>
  );
}

function IconLock(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
