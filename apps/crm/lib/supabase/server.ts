        import { cookies } from "next/headers";
        import { createSupabaseServerClient } from "@kairos/database";

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
                // Server Component sin permiso de escritura — el proxy ya refresca la sesión.
              }
            },
          });
        }
