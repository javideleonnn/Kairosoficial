
import Link from "next/link";
import { RadarChart, DimensionBar, type RadarDatum } from "@kairos/ui";
import { BLOCK_NAMES } from "@kairos/scoring-engine";
import type { BlockKey, AletheiaResult } from "@kairos/scoring-engine";
import { fetchLeadDetail } from "@/lib/leads/fetchDetail";

const SHORT_LABEL: Record<BlockKey, string> = {
  FD: "Dirección",
  IDE: "Identidad",
  DM: "Motivación",
  AS: "Sabotaje",
  VE: "Validación",
};

const DIMENSION_LABEL: Record<
  keyof AletheiaResult["dimensionScores"],
  string
> = {
  claridad: "Claridad",
  accion: "Acción",
  confianza: "Confianza",
  compromiso: "Compromiso",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  const lead = await fetchLeadDetail(id);

  if (!lead) {
    return (
      <div className="p-6">
        <p className="text-sm text-foreground/50">
          No se encontró este lead.
        </p>
      </div>
    );
  }

  const { result } = lead;

  const whatsappNumber =
    lead.phoneCountryCode && lead.phoneNumber
      ? `${lead.phoneCountryCode}${lead.phoneNumber}`.replace(/\D/g, "")
      : null;

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : null;

  const radarData: RadarDatum[] = (
    Object.keys(result.blockScores) as BlockKey[]
  ).map((key) => ({
    key,
    label: SHORT_LABEL[key],
    value: result.blockScores[key].normalized,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <Link
        href="/"
        className="text-xs text-foreground/40 hover:text-foreground/70"
      >
        ← Volver al pipeline
      </Link>

      <div>
        <h1 className="font-serif text-xl">
          {lead.fullName ?? "Sin identificar"}
        </h1>

        {lead.instagramUsername ? (
          <p className="text-sm text-foreground/40">
            @{lead.instagramUsername}
          </p>
        ) : null}

        <p className="mt-1 text-xs text-foreground/30">
          Completado el{" "}
          {new Date(lead.createdAt).toLocaleDateString("es")}
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-foreground/10 p-5">
        <h2 className="text-xs uppercase tracking-widest text-foreground/40">
          Información de contacto
        </h2>

        <div className="space-y-1">
          <p className="text-xs text-foreground/40">Nombre completo</p>
          <p className="text-sm text-foreground/80">
            {lead.fullName ?? "No proporcionado"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-foreground/40">WhatsApp</p>

          {whatsappNumber ? (
            <>
              <p className="text-sm text-foreground/80">
                {lead.phoneCountryCode} {lead.phoneNumber}
              </p>

              <a
                href={whatsappUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Abrir conversación en WhatsApp ↗
              </a>
            </>
          ) : (
            <p className="text-sm text-foreground/40">
              No proporcionado
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-foreground/40">Correo electrónico</p>
          <p className="text-sm text-foreground/80">
            {lead.email ?? "No proporcionado"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-foreground/40">Instagram</p>
          <p className="text-sm text-foreground/80">
            {lead.instagramUsername
              ? `@${lead.instagramUsername}`
              : "No proporcionado"}
          </p>
        </div>
      </section>

      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-foreground/40">
          Kairos ID
        </p>

        <p className="mt-1 font-serif text-3xl text-accent">
          {result.resultCode}
        </p>

        <p className="mt-1 text-sm text-foreground/60">
          Dominante: {BLOCK_NAMES[result.dominantBlock]}
          {result.secondaryBlock
            ? ` · Secundario: ${BLOCK_NAMES[result.secondaryBlock]}`
            : ""}
        </p>
      </div>

      <RadarChart
        data={radarData}
        highlightKey={result.dominantBlock}
        size={240}
      />

      <div className="space-y-4">
        {(Object.keys(
          result.dimensionScores,
        ) as Array<
          keyof AletheiaResult["dimensionScores"]
        >).map((key) => (
          <DimensionBar
            key={key}
            label={DIMENSION_LABEL[key]}
            value={result.dimensionScores[key]}
          />
        ))}
      </div>

      {result.patterns.length > 0 ? (
        <div className="space-y-2 border-t border-foreground/10 pt-6 text-sm">
          <p className="text-xs uppercase tracking-widest text-foreground/40">
            Patrones detectados
          </p>

          {result.patterns.map((pattern) => (
            <p
              key={pattern}
              className="text-foreground/70"
            >
              {pattern}
            </p>
          ))}
        </div>
      ) : null}

      <p className="border-t border-foreground/10 pt-6 text-xs text-foreground/30">
        Notas, etiquetas e historial de interacciones llegan en un próximo
        incremento del CRM.
      </p>
    </div>
  );
}
