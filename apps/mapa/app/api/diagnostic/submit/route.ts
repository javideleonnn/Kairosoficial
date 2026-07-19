import { NextResponse } from "next/server";
import { computeAletheiaResult, ENGINE_VERSION, AletheiaValidationError, BLOCK_NAMES } from "@kairos/scoring-engine";
import type { EngineAnswer } from "@kairos/scoring-engine";
import { createSupabaseServiceRoleClient } from "@kairos/database";
import type { Json } from "@kairos/database";
import { notifyManyChatOfCompletedDiagnostic } from "@/lib/manychat/client";

interface SubmitPayload {
  answers: EngineAnswer[];
  startedAt: string;
  durationSeconds: number;
  source?: string;
  locale?: string;
  /** capturado de un query param cuando se llega desde ManyChat, ver Módulo 10 */
  manychatSubscriberId?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const organizationId = process.env.KAIROS_ORGANIZATION_ID;
  if (!organizationId) {
    // Error de configuración del servidor, no del usuario — no debería
    // llegar nunca a producción sin esta variable seteada.
    return NextResponse.json(
      { error: "El servidor no tiene configurada la organización." },
      { status: 500 },
    );
  }

  let payload: SubmitPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!Array.isArray(payload.answers)) {
    return NextResponse.json({ error: "Faltan las respuestas." }, { status: 400 });
  }

  // El cálculo SIEMPRE ocurre aquí, en el servidor — nunca se confía en un
  // resultado que pudiera venir precalculado del cliente (ver Módulo 7).
  let result;
  try {
    result = computeAletheiaResult(payload.answers);
  } catch (error) {
    if (error instanceof AletheiaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("diagnostic_sessions")
    .insert({
      organization_id: organizationId,
      locale: payload.locale ?? "es",
      source: payload.source ?? null,
      started_at: payload.startedAt,
      duration_seconds: Math.round(payload.durationSeconds),
      answers: payload.answers as unknown as Json,
      result: result as unknown as Json,
      engine_version: ENGINE_VERSION,
      manychat_subscriber_id: payload.manychatSubscriberId ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: `No se pudo guardar el diagnóstico: ${error?.message}` },
      { status: 500 },
    );
  }

  // Fire-and-forget: si hay subscriber de ManyChat, notificar. Nunca debe
  // bloquear ni afectar la respuesta al usuario si esto falla.
  if (payload.manychatSubscriberId) {
    void notifyManyChatOfCompletedDiagnostic({
      subscriberId: payload.manychatSubscriberId,
      resultCode: result.resultCode,
      dominantBlockName: BLOCK_NAMES[result.dominantBlock],
    }).then((outcome) => {
      void supabase.from("webhook_events").insert({
        organization_id: organizationId,
        direction: "outbound",
        source: "manychat",
        payload: { sessionId: data.id, resultCode: result.resultCode, outcome } as unknown as Json,
        status: outcome.sent ? "processed" : "error",
      });
    });
  }

  return NextResponse.json({ sessionId: data.id, result });
}
