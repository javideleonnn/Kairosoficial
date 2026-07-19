import { createSupabaseServiceRoleClient } from "@kairos/database";
import type { AletheiaResult } from "@kairos/scoring-engine";

export interface DiagnosticSessionRecord {
  id: string;
  result: AletheiaResult;
  createdAt: string;
}

/**
 * Recupera una sesión por su id (UUID impredecible = la "llave" de acceso,
 * patrón de URL de capacidad — ver decisión del Módulo 9). Usa el cliente
 * de service_role porque esta consulta corre en un Server Component, nunca
 * se expone la tabla directamente al cliente vía anon key.
 */
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
    // Config faltante (env vars) o cualquier error de red/cliente — nunca
    // debe crashear la página, solo mostrar el estado de "no encontrado".
    return null;
  }
}
