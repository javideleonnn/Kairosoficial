"use client";

import { useState } from "react";
import { BLOCK_NAMES, FULL_DIAGNOSES } from "@kairos/scoring-engine";
import type { AletheiaResult, BlockKey } from "@kairos/scoring-engine";
import { Entrance } from "@/components/diagnostic/Entrance";
import { AtmosphericBackground } from "@/components/AtmosphericBackground";
import { RadarShape } from "./RadarShape";

const BLOCK_ORDER: BlockKey[] = ["FD", "IDE", "DM", "AS", "VE"];

interface ResultRevealProps {
  result: AletheiaResult;
  onRequestContact: () => void;
}

/**
 * Réplica de la Imagen 1. Los números SÍ se muestran (la referencia los
 * exige explícitamente, reemplazando la regla anterior de "sin
 * porcentajes"). "Entrenamiento Kairos" y "Guardar mi Mapa Kairos" son
 * visuales — no hay contenido/backend real detrás (ver autoauditoría).
 * "Ver mi Mapa completo" sí es funcional: expande el diagnóstico extenso.
 */
export function ResultReveal({ result, onRequestContact }: ResultRevealProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const diagnosis = FULL_DIAGNOSES[result.dominantBlock];

  const radarData = BLOCK_ORDER.map((key) => ({
    key,
    label: BLOCK_NAMES[key],
    value: result.blockScores[key].normalized,
  }));

  return (
    <div className="relative min-h-screen px-6 py-10 text-foreground">
      <AtmosphericBackground />
      <Entrance className="mx-auto w-full max-w-sm">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">Tu Mapa Kairos</p>
        <h1 className="mt-3 text-center font-serif text-[26px] leading-[1.3]">
          Este es el patrón que
          <br />
          está limitando tu avance.
        </h1>

        <div className="mt-10">
          <RadarShape data={radarData} highlightKey={result.dominantBlock} />
        </div>

        <div className="mt-10 flex items-start gap-4 rounded-3xl border border-foreground/12 px-5 py-7">
          <TargetIcon />
          <div>
            <p className="text-sm text-foreground/50">Tu bloqueo principal</p>
            <p className="mt-1 font-serif text-xl text-accent">{BLOCK_NAMES[result.dominantBlock]}</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/60">{result.patterns[0]}</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-foreground/12 px-5 py-7">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/50">Tu siguiente paso recomendado</p>
            <span aria-hidden className="text-foreground/40">›</span>
          </div>
          <p className="mt-1 text-[17px] font-medium">Entrenamiento Kairos</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/60">
            Construye un sistema que te mantenga en movimiento, incluso cuando no tengas ganas.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestContact}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-base font-medium text-background"
        >
          Quiero transformar mi patrón
          <span aria-hidden>→</span>
        </button>

        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-accent py-4 text-base font-medium text-accent"
        >
          <span aria-hidden>↓</span>
          Guardar mi Mapa Kairos
        </button>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-foreground/50"
        >
          Ver mi Mapa completo
          <span aria-hidden>{expanded ? "︿" : "⌄"}</span>
        </button>

        {expanded ? (
          <div className="mt-6 space-y-4 border-t border-foreground/10 pt-6 text-sm leading-relaxed text-foreground/65">
            <p>{diagnosis.meaning}</p>
            <p>{diagnosis.origin}</p>
            <p>{diagnosis.riskIfUnchanged}</p>
            <p className="text-foreground/85">{diagnosis.potential}</p>
          </div>
        ) : null}
      </Entrance>
    </div>
  );
}

function TargetIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} className="shrink-0">
      <circle cx="20" cy="20" r="17" fill="none" stroke="var(--color-accent)" strokeOpacity={0.35} />
      <circle cx="20" cy="20" r="11" fill="none" stroke="var(--color-accent)" strokeOpacity={0.6} />
      <circle cx="20" cy="20" r="5" fill="var(--color-accent)" />
    </svg>
  );
}
