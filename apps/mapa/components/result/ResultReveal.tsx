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

// Orden fijo de despliegue — mismo orden en el radar y en las barras, para
// que ambos se lean como la misma información en dos formatos distintos.
const BLOCK_ORDER: BlockKey[] = ["FD", "IDE", "DM", "AS", "VE"];

// Un solo "paso" de tiempo para TODA la secuencia de revelación (70ms —
// dentro del rango 50-70ms pedido para las barras, y reutilizado para el
// resto de la pantalla por coherencia). Los índices de abajo son la
// posición de cada elemento en la secuencia completa, no por sección.
const STEP_MS = 70;
const STEP = {
  dominant: 0,
  radar: 2,
  bars: 5, // + 0..4, uno por bloqueo
  paragraph: 12,
  nextStep: 14,
  vsl: 16,
  cta: 17,
  closing: 20,
} as const;

interface ResultRevealProps {
  result: AletheiaResult;
  /** cuando exista el VSL, se pasa su url y el bloque se activa solo */
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
      {/* Fondo apenas perceptible — mismo lenguaje del resto del producto */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-sm space-y-16 pb-16">
        {/* 1 — El patrón dominante. Una sola pregunta respondida: cuál. */}
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

        {/* 2 — El radar. El elemento visual más importante de la pantalla.
            Responsive (ver RadarChart) — el tamaño es un tope máximo,
            nunca desborda en pantallas angostas. Se dibuja solo, en tonos
            grises, con el eje dominante resaltado en dorado. */}
        <FadeInSection index={STEP.radar} stepDelayMs={STEP_MS} className="flex justify-center">
          <RadarChart data={radarData} highlightKey={result.dominantBlock} size={360} />
        </FadeInSection>

        {/* 3 — Las 5 barras de bloqueo. Entrada escalonada de 70ms entre
            cada una — sin porcentajes, la dominante con etiqueta. */}
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

        {/* 4 — Un único párrafo, con espacio generoso — un momento de
            reflexión, no un dato más en la lista. line-clamp-4 garantiza
            el límite visual incluso si el copy (todavía provisional) es
            más largo. */}
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
            todavía — solo se activa cuando exista una url real, para no
            mostrar una caja vacía a usuarios reales mientras tanto. */}
        {vslUrl ? (
          <FadeInSection index={STEP.vsl} stepDelayMs={STEP_MS}>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-foreground/10">
              {/* Implementación del reproductor: pendiente, Módulo aparte */}
            </div>
          </FadeInSection>
        ) : null}

        {/* 7 — CTA. Único botón con protagonismo. Copy provisional —
            pendiente de pruebas A/B a futuro. */}
        <FadeInSection index={STEP.cta} stepDelayMs={STEP_MS} className="text-center">
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="px-8 py-3.5">Solicitar revisión personalizada</Button>
            </a>
          ) : (
            <Button disabled className="px-8 py-3.5">
              Solicitar revisión personalizada
            </Button>
          )}
        </FadeInSection>

        {/* 8 — Cierre elegante. Deliberadamente sin botón ni link — la
            única sección de toda la pantalla sin ninguna acción posible,
            para que el conjunto termine en quietud. Copy provisional. */}
        <FadeInSection index={STEP.closing} stepDelayMs={STEP_MS} className="pt-6 text-center">
          <p className="mx-auto max-w-[20rem] font-serif text-base italic leading-relaxed text-foreground/40">
            Toda transformación comienza cuando dejas de repetir el mismo patrón.
          </p>
        </FadeInSection>
      </div>
    </Screen>
  );
}
