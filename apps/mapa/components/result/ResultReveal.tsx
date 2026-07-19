"use client";

import {
  Screen,
  Button,
  FadeInSection,
  RadarChart,
  DimensionBar,
  type RadarDatum,
} from "@kairos/ui";
import {
  BLOCK_NAMES,
  FULL_DIAGNOSES,
  STRENGTH_BY_BLOCK,
  RISK_BY_BLOCK,
} from "@kairos/scoring-engine";
import type { AletheiaResult } from "@kairos/scoring-engine";
import type { BlockKey } from "@kairos/scoring-engine";

const SHORT_LABEL: Record<BlockKey, string> = {
  FD: "Dirección",
  IDE: "Identidad",
  DM: "Motivación",
  AS: "Sabotaje",
  VE: "Validación",
};

const DIMENSION_LABEL: Record<keyof AletheiaResult["dimensionScores"], string> = {
  claridad: "Claridad",
  accion: "Acción",
  confianza: "Confianza",
  compromiso: "Compromiso",
};

interface ResultRevealProps {
  result: AletheiaResult;
}

export function ResultReveal({ result }: ResultRevealProps): React.JSX.Element {
  const radarData: RadarDatum[] = (Object.keys(result.blockScores) as BlockKey[]).map((key) => ({
    key,
    label: SHORT_LABEL[key],
    value: result.blockScores[key].normalized,
  }));

  const lowestBlock = (Object.keys(result.blockScores) as BlockKey[]).reduce((lowest, key) =>
    result.blockScores[key].normalized < result.blockScores[lowest].normalized ? key : lowest,
  );

  const diagnosis = FULL_DIAGNOSES[result.dominantBlock];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    `Hola, hice el Mapa Kairos y mi resultado fue ${result.resultCode}. Quiero una revisión personalizada.`,
  );

  return (
    <Screen className="items-start px-6 py-16">
      <div className="mx-auto w-full max-w-md space-y-14 pb-16">
        {/* Paso 1 — Kairos ID */}
        <FadeInSection index={0} className="text-center">
          <p className="text-xs uppercase tracking-widest text-foreground/40">
            Tu Kairos ID
          </p>
          <p className="mt-2 font-serif text-4xl text-accent">{result.resultCode}</p>
        </FadeInSection>

        {/* Paso 2 — Bloqueo dominante */}
        <FadeInSection index={1} className="text-center">
          <p className="text-sm text-foreground/50">Tu bloqueo dominante es</p>
          <h1 className="font-serif text-2xl">{BLOCK_NAMES[result.dominantBlock]}</h1>
          {result.patterns[0] ? (
            <p className="mt-2 text-sm text-foreground/60">{result.patterns[0]}</p>
          ) : null}
        </FadeInSection>

        {/* Paso 3 — Radar */}
        <FadeInSection index={2}>
          <RadarChart data={radarData} highlightKey={result.dominantBlock} size={260} />
        </FadeInSection>

        {/* Paso 4 — secundario, fortaleza, riesgo */}
        <FadeInSection index={3} className="space-y-3 text-sm">
          {result.secondaryBlock ? (
            <p>
              <span className="text-foreground/50">También se nota una corriente de </span>
              <span className="text-foreground">{BLOCK_NAMES[result.secondaryBlock]}</span>
              <span className="text-foreground/50">.</span>
            </p>
          ) : null}
          <p>
            <span className="text-foreground/50">Tu fortaleza natural: </span>
            <span className="text-foreground">{STRENGTH_BY_BLOCK[lowestBlock]}</span>
          </p>
          <p>
            <span className="text-foreground/50">Si esto no se resuelve: </span>
            <span className="text-foreground">{RISK_BY_BLOCK[result.dominantBlock]}</span>
          </p>
        </FadeInSection>

        {/* Paso 5 — las 4 dimensiones */}
        <FadeInSection index={4} className="space-y-4">
          {(Object.keys(result.dimensionScores) as Array<keyof AletheiaResult["dimensionScores"]>).map(
            (key) => (
              <DimensionBar
                key={key}
                label={DIMENSION_LABEL[key]}
                value={result.dimensionScores[key]}
              />
            ),
          )}
        </FadeInSection>

        {/* Paso 6 — diagnóstico completo */}
        <FadeInSection index={5} className="space-y-5 border-t border-foreground/10 pt-10 text-sm leading-relaxed">
          <Section title="Qué significa" text={diagnosis.meaning} />
          <Section title="Cómo se originó" text={diagnosis.origin} />
          <Section title="Cómo afecta tus relaciones" text={diagnosis.relationships} />
          <Section title="Cómo afecta tu trabajo" text={diagnosis.work} />
          <Section title="Cómo afecta tu autoestima" text={diagnosis.selfEsteem} />
          <Section title="Cómo afecta tus decisiones" text={diagnosis.decisions} />
          <Section title="Si no cambia" text={diagnosis.riskIfUnchanged} />
          <Section title="Tu potencial" text={diagnosis.potential} />
        </FadeInSection>

        {/* Paso 7 — CTA */}
        <FadeInSection index={6} className="space-y-3 border-t border-foreground/10 pt-10 text-center">
          <p className="text-sm text-foreground/60">
            Esto explica el origen. Resolverlo es otra conversación.
          </p>
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button>Solicitar revisión personalizada</Button>
            </a>
          ) : (
            <Button disabled>Solicitar revisión personalizada</Button>
          )}
        </FadeInSection>
      </div>
    </Screen>
  );
}

function Section({ title, text }: { title: string; text: string }): React.JSX.Element {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-widest text-foreground/40">{title}</p>
      <p className="text-foreground/80">{text}</p>
    </div>
  );
}
