import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../types/database.types";

/**
 * Cliente Supabase para componentes de cliente ("use client").
 * Lee las variables NEXT_PUBLIC_* — Next.js las inyecta en build time
 * incluso dentro de este paquete transpilado (ver decisión de
 * transpilePackages del Módulo 2).
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno.",
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
