"use client";

import {
  Screen,
  Button,
  FadeInSection,
  RadarChart,
  DimensionBar,
  type RadarDatum,
} from "@kairos/ui";
import { BLOCK_NAMES, FULL_DIAGNOSES } from "@kairos/scoring-engine";
import type { AletheiaResult, BlockKey } from "@kairos/scoring-engine";

const SHORT_LABEL: Record<BlockKey, string> = {
  FD: "Dirección",
  IDE: "Identidad",
  DM: "Motivación",
  AS: "Sabotaje",
  VE: "Validación",
};

const BLOCK_ORDER: BlockKey[] = ["FD", "IDE", "DM", "AS", "VE"];

const STEP_MS = 70;
const STEP = {
  dominant: 0,
  radar: 2,
  bars: 5,
  paragraph: 12,
  nextStep: 14,
  vsl: 16,
  cta: 17,
  closing: 20,
} as const;

interface ResultRevealProps {
  result: AletheiaResult;
  vslUrl?: string;
}

export function ResultReveal({ result, vslUrl }: ResultRevealProps): React.JSX.Element {
  const radarData: RadarDatum[] = BLOCK_ORDER.map((key) => ({
    key,
    label: SHORT_LABEL[key],
    value: result.blockScores[key].normalized,
  }));

  const diagnosis = FULL_DIAGNOSES[result.dominantBlock];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    `Hola, hice el Mapa Kairos y mi bloqueo dominante fue ${BLOCK_NAMES[result.dominantBlock]}. Quiero trabajar este patrón.`,
  );

  return (
    <Screen className="items-start px-6 py-16">
      {/* Fondo atmosférico — más presente que en la pantalla de preguntas,
          es el "momento" de toda la experiencia, aquí sí puede notarse. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[28%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
      </div>

      <div className="mx-auto w-full max-w-sm space-y-16 pb-16">
        {/* 1 — El patrón dominante. Nombre completo, nunca siglas. */}
        <FadeInSection index={STEP.dominant} stepDelayMs={STEP_MS} className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/35">
            Tu bloqueo dominante
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight">
            {BLOCK_NAMES[result.dominantBlock]}
          </h1>
          {result.patterns[0] ? (
            <p className="mx-auto mt-3 max-w-[22rem] text-sm text-foreground/55">
              {result.patterns[0]}
            </p>
          ) : null}
        </FadeInSection>

        {/* 2 — El radar. El elemento visual más importante de la pantalla,
            con glow atmosférico propio detrás. Etiquetas cortas (no siglas)
            por espacio; el nombre completo ya se mostró arriba. */}
        <FadeInSection index={STEP.radar} stepDelayMs={STEP_MS} className="relative flex justify-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[90px]" />
          <RadarChart data={radarData} highlightKey={result.dominantBlock} size={360} />
        </FadeInSection>

        {/* 3 — Las 5 barras, con nombres completos, sin porcentajes,
            agrupadas en un contenedor tipo tarjeta. */}
        <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6">
          <div className="space-y-4">
            {BLOCK_ORDER.map((key, i) => (
              <FadeInSection key={key} index={STEP.bars + i} stepDelayMs={STEP_MS}>
                <DimensionBar
                  label={BLOCK_NAMES[key]}
                  value={result.blockScores[key].normalized}
                  showValue={false}
                  highlight={key === result.dominantBlock}
                  tag={key === result.dominantBlock ? "Patrón dominante" : undefined}
                />
              </FadeInSection>
            ))}
          </div>
        </div>

        {/* 4 — Un único párrafo, con espacio generoso. */}
        <FadeInSection index={STEP.paragraph} stepDelayMs={STEP_MS} className="py-6">
          <p className="line-clamp-4 text-center text-sm leading-relaxed text-foreground/70">
            {diagnosis.meaning}
          </p>
        </FadeInSection>

        {/* 5 — Tu siguiente paso */}
        <FadeInSection
          index={STEP.nextStep}
          stepDelayMs={STEP_MS}
          className="space-y-2 border-t border-foreground/10 pt-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/35">
            Tu siguiente paso
          </p>
          <p className="text-sm leading-relaxed text-foreground/70">
            Entender el patrón es el comienzo.
            <br />
            Transformarlo requiere un proceso.
          </p>
        </FadeInSection>

        {/* 6 — Espacio reservado para el VSL. No renderiza nada visible
            todavía — solo se activa cuando exista una url real. */}
        {vslUrl ? (
          <FadeInSection index={STEP.vsl} stepDelayMs={STEP_MS}>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-foreground/10">
              {/* Implementación del reproductor: pendiente, fuera de alcance */}
            </div>
          </FadeInSection>
        ) : null}

        {/* 7 — CTA. Pill sólido dorado (estilo de la referencia) — único
            botón con protagonismo real de toda la pantalla. */}
        <FadeInSection index={STEP.cta} stepDelayMs={STEP_MS} className="text-center">
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="border-accent bg-accent px-8 py-3.5 text-background hover:bg-accent hover:shadow-[0_0_28px_-6px_var(--color-accent)]">
                Solicitar revisión personalizada
              </Button>
            </a>
          ) : (
            <Button disabled className="border-accent bg-accent px-8 py-3.5 text-background">
              Solicitar revisión personalizada
            </Button>
          )}
        </FadeInSection>

        {/* 8 — Cierre elegante. Sin botón ni link. */}
        <FadeInSection index={STEP.closing} stepDelayMs={STEP_MS} className="pt-6 text-center">
          <p className="mb-2 font-serif text-2xl text-accent/40">&rdquo;</p>
          <p className="mx-auto max-w-[20rem] font-serif text-base italic leading-relaxed text-foreground/40">
            Toda transformación comienza cuando dejas de repetir el mismo patrón.
          </p>
        </FadeInSection>
      </div>
    </Screen>
  );
}
