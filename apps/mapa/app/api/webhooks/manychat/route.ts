import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@kairos/database";
import type { Json } from "@kairos/database";

/**
 * Recibe eventos de ManyChat (ej. "el usuario respondió el DM"). Módulo 12:
 * ya no solo registra el evento crudo — busca el lead por
 * `manychat_subscriber_id` y actualiza su actividad real.
 *
 * Seguridad: ManyChat no firma sus webhooks de forma estándar como Stripe;
 * la práctica común es un secreto compartido en la URL, configurado al
 * crear la automatización externa en ManyChat.
 *
 * Nota: el nombre del campo `subscriber_id` en el body lo define Javi al
 * configurar el "External Request" en ManyChat — debe llamarse así para
 * que este endpoint lo reconozca (documentado en el pendiente del Módulo 10).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const expectedSecret = process.env.MANYCHAT_WEBHOOK_SECRET;
  const organizationId = process.env.KAIROS_ORGANIZATION_ID;

  if (!expectedSecret || !organizationId) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 });
  }

  const providedSecret = new URL(request.url).searchParams.get("secret");
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const supabase = createSupabaseServiceRoleClient();

  // 1. Log crudo siempre — se conserva sin importar si se pudo procesar.
  await supabase.from("webhook_events").insert({
    organization_id: organizationId,
    direction: "inbound",
    source: "manychat",
    payload: payload as Json,
    status: "received",
  });

  // 2. Si el payload trae subscriber_id, buscar y actualizar el lead real.
  const subscriberId = payload.subscriber_id;
  if (typeof subscriberId === "string" && subscriberId.length > 0) {
    const { data: lead } = await supabase
      .from("leads")
      .select("id, current_stage_id")
      .eq("manychat_subscriber_id", subscriberId)
      .single();

    if (lead) {
      const { data: currentStage } = await supabase
        .from("pipeline_stages")
        .select("key")
        .eq("id", lead.current_stage_id)
        .single();

      const updates: { last_interaction_at: string; current_stage_id?: string } = {
        last_interaction_at: new Date().toISOString(),
      };

      // Solo avanza automáticamente desde "diagnóstico completado" — si un
      // asesor ya lo movió más adelante en el pipeline, no se retrocede.
      if (currentStage?.key === "diagnostico_completado") {
        const { data: contactedStage } = await supabase
          .from("pipeline_stages")
          .select("id")
          .eq("organization_id", organizationId)
          .eq("key", "contactado")
          .single();
        if (contactedStage) updates.current_stage_id = contactedStage.id;
      }

      await supabase.from("leads").update(updates).eq("id", lead.id);
    }
  }

  // Responder rápido — ManyChat espera 200 pronto.
  return NextResponse.json({ received: true });
}
