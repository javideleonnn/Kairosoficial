"use client";

import { Entrance } from "./Entrance";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";

interface IntroScreenProps {
  onStart: () => void;
}

/**
 * Segunda iteración del diseño — editorial, más moderno. Ya no hay un
 * emblema central aislado: el titular es el protagonista absoluto, con
 * la constelación integrada como una firma discreta detrás del texto,
 * no como una ilustración separada. Layout de una sola columna, muy
 * vertical, con mucho aire — lenguaje más "revista de lujo" que "app".
 */
export function IntroScreen({ onStart }: IntroScreenProps): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col px-6 py-8 text-foreground">
      <AtmosphericBackground />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-accent/80">Kairos</span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>

      <Entrance className="flex flex-1 flex-col justify-center">
        <div className="relative">
          <ConstellationSignature />
          <p className="relative text-[13px] uppercase tracking-[0.3em] text-accent/70">
            Diagnóstico personal
          </p>
          <h1 className="relative mt-4 font-serif text-[44px] leading-[1.08] tracking-tight">
            Descubre
            <br />
            qué te está
            <br />
            <span className="italic text-accent">frenando.</span>
          </h1>
          <p className="relative mt-6 max-w-[19rem] text-[15px] leading-relaxed text-foreground/50">
            En menos de 3 minutos obtendrás tu Mapa Kairos — una
            representación visual del patrón que hoy limita tu crecimiento.
          </p>
        </div>

        <div className="mt-14 flex gap-8 border-y border-foreground/10 py-6">
          {[
            ["12", "preguntas"],
            ["3 min", "duración"],
            ["100%", "privado"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-serif text-xl text-foreground">{value}</p>
              <p className="mt-0.5 text-xs text-foreground/45">{label}</p>
            </div>
          ))}
        </div>
      </Entrance>

      <div className="w-full pb-2 pt-8">
        <button
          type="button"
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-base font-medium text-background"
        >
          Comenzar mi Mapa
          <span aria-hidden>→</span>
        </button>
        <p className="mt-4 text-center text-xs text-foreground/35">Sin registro. 100% privado.</p>
      </div>
    </main>
  );
}

/** Firma discreta detrás del titular — unas pocas estrellas conectadas,
 * posicionada absoluta, muy sutil (opacidad baja), no es el protagonista. */
function ConstellationSignature(): React.JSX.Element {
  const stars = [
    { x: 260, y: 10 }, { x: 300, y: 55 }, { x: 250, y: 95 }, { x: 310, y: 130 },
  ];
  return (
    <svg viewBox="0 0 340 220" className="pointer-events-none absolute -right-4 -top-6 h-56 w-full opacity-70" preserveAspectRatio="xMaxYMin meet">
      {stars.map((s, i) => (
        <g key={i}>
          {i > 0 ? (
            <line x1={stars[i - 1]!.x} y1={stars[i - 1]!.y} x2={s.x} y2={s.y} stroke="var(--color-accent)" strokeOpacity={0.25} />
          ) : null}
          <circle cx={s.x} cy={s.y} r={i === 1 ? 3 : 2} fill="var(--color-accent)" fillOpacity={0.8} />
        </g>
      ))}
    </svg>
  );
}
