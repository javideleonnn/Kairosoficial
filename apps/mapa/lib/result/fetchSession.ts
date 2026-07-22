import { createSupabaseServiceRoleClient } from "@kairos/database";
import type { AletheiaResult } from "@kairos/scoring-engine";

export interface DiagnosticSessionRecord {
  id: string;
  result: AletheiaResult;
  createdAt: string;
}

export async function fetchDiagnosticSession(
  sessionId: string,
): Promise<DiagnosticSessionRecord | null> {
  try {
    const supabase = createSupabaseServiceRoleClient();

    const { data, error } = await supabase
      .from("diagnostic_sessions")
      .select("id, result, created_at")
      .eq("id", sessionId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      result: data.result as unknown as AletheiaResult,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}
