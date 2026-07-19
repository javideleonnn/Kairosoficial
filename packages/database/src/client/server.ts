import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { Database } from "../types/database.types";

/**
 * Cliente Supabase para uso en servidor (Server Components, Route Handlers,
 * Server Actions). Deliberadamente NO importa `next/headers` aquí — recibe
 * el manejo de cookies como parámetro, para que este paquete no dependa de
 * Next.js y sea reutilizable si algún día hay un consumidor que no sea Next
 * (ver decisión del Módulo 2 sobre paquetes sin build propio, mismo espíritu
 * de mantener los paquetes compartidos agnósticos de framework donde se pueda).
 *
 * Cada app (mapa, crm) provee su propio adaptador, típicamente envolviendo
 * `cookies()` de `next/headers`.
 */
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

/**
 * Cliente con privilegios de service_role — bypassa RLS por completo.
 * Solo debe usarse en contextos de servidor de máxima confianza (ej. el
 * webhook que recibe eventos de ManyChat en el Módulo 10). Nunca exponer
 * SUPABASE_SERVICE_ROLE_KEY al cliente.
 */
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
