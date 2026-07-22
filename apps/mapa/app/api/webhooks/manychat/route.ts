import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@kairos/database";
import type { Json } from "@kairos/database";

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
  await supabase.from("webhook_events").insert({
    organization_id: organizationId,
    direction: "inbound",
    source: "manychat",
    payload: payload as Json,
    status: "received",
  });

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

  return NextResponse.json({ received: true });
}
