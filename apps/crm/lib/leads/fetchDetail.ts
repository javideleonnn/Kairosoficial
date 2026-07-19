import { createClient } from "@/lib/supabase/server";
import type { AletheiaResult } from "@kairos/scoring-engine";

export interface LeadDetail {
  id: string;
  fullName: string | null;
  instagramUsername: string | null;
  email: string | null;
  createdAt: string;
  result: AletheiaResult;
}

export async function fetchLeadDetail(leadId: string): Promise<LeadDetail | null> {
  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("id, full_name, instagram_username, email, created_at, diagnostic_session_id")
    .eq("id", leadId)
    .single();

  if (error || !lead) return null;

  const { data: session } = await supabase
    .from("diagnostic_sessions")
    .select("result")
    .eq("id", lead.diagnostic_session_id)
    .single();

  if (!session) return null;

  return {
    id: lead.id,
    fullName: lead.full_name,
    instagramUsername: lead.instagram_username,
    email: lead.email,
    createdAt: lead.created_at,
    result: session.result as unknown as AletheiaResult,
  };
}
