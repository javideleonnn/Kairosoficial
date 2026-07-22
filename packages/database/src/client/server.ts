import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { Database } from "../types/database.types";

export function createSupabaseServerClient(cookies: CookieMethodsServer) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno.",
    );
  }

  return createServerClient<Database>(url, anonKey, { cookies });
}

export function createSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.",
    );
  }

  return createServerClient<Database>(url, serviceRoleKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
