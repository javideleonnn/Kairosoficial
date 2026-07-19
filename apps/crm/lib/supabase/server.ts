import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@kairos/database";

/**
 * Cliente Supabase para Server Components / Route Handlers de apps/crm.
 * Envuelve `next/headers` y se lo pasa a @kairos/database, que se mantiene
 * agnóstico de Next.js (ver decisión del Módulo 3).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Se llama desde un Server Component sin permiso de escritura —
        // el middleware ya se encarga de refrescar la sesión en ese caso.
      }
    },
  });
}
