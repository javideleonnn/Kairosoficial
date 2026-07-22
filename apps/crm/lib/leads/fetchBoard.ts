import { createClient } from "@/lib/supabase/server";

export interface PipelineStageWithLeads {
  id: string;
  key: string;
  name: string;
  orderIndex: number;
  color: string;
  leads: LeadCardData[];
}

export interface LeadCardData {
  id: string;
  fullName: string | null;
  instagramUsername: string | null;
  resultCode: string | null;
  dominantBlockName: string | null;
  levelName: string | null;
  createdAt: string;
  lastInteractionAt: string | null;
}

export async function fetchPipelineBoard(): Promise<PipelineStageWithLeads[]> {
  const supabase = await createClient();

  const { data: stages, error: stagesError } = await supabase
    .from("pipeline_stages")
    .select("id, key, name, order_index, color")
    .order("order_index");

  if (stagesError || !stages) return [];

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select(
      "id, full_name, instagram_username, current_stage_id, created_at, last_interaction_at, diagnostic_session_id",
    )
    .order("created_at", { ascending: false });

  if (leadsError || !leads) {
    return stages.map((s) => ({
      id: s.id, key: s.key, name: s.name, orderIndex: s.order_index, color: s.color, leads: [],
    }));
  }

  const sessionIds = leads.map((l) => l.diagnostic_session_id);
  const { data: sessions } = await supabase
    .from("diagnostic_sessions")
    .select("id, result")
    .in("id", sessionIds.length > 0 ? sessionIds : [""]);

  const resultBySessionId = new Map(
    (sessions ?? []).map((s) => [s.id, s.result as Record<string, unknown>]),
  );

  const cardsByStage = new Map<string, LeadCardData[]>();
  for (const lead of leads) {
    const result = resultBySessionId.get(lead.diagnostic_session_id);
    const card: LeadCardData = {
      id: lead.id,
      fullName: lead.full_name,
      instagramUsername: lead.instagram_username,
      resultCode: (result?.resultCode as string | undefined) ?? null,
      dominantBlockName: (result?.dominantBlock as string | undefined) ?? null,
      levelName:
        ((result?.level as { name?: string } | undefined)?.name as string | undefined) ?? null,
      createdAt: lead.created_at,
      lastInteractionAt: lead.last_interaction_at,
    };
    const existing = cardsByStage.get(lead.current_stage_id) ?? [];
    existing.push(card);
    cardsByStage.set(lead.current_stage_id, existing);
  }

  return stages.map((s) => ({
    id: s.id, key: s.key, name: s.name, orderIndex: s.order_index, color: s.color,
    leads: cardsByStage.get(s.id) ?? [],
  }));
}
