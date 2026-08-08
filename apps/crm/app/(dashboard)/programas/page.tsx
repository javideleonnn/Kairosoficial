      import Link from "next/link";
      import { createClient } from "@/lib/supabase/server";

      export default async function ProgramasPage() {
        const supabase = await createClient();

        const { data: programs } = await supabase
          .from("programs")
          .select(`
            id,
            name,
            created_at
          `)
          .order("created_at", {
            ascending: false,
          });

        return (
          <div className="space-y-8">

            <div className="flex items-center justify-between">

              <div>
                <h1 className="text-3xl font-bold">
                  Programas
                </h1>

                <p className="text-foreground/60">
                  Gestiona todos los programas de Kairos.
                </p>
              </div>

              <Link
                href="/programas/nuevo"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
              >
                Nuevo programa
              </Link>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {(programs ?? []).map((program) => (

                <Link
                  key={program.id}
                  href={`/programas/${program.id}`}
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-6 transition hover:border-white/30 hover:-translate-y-1"
                >
                  <h2 className="text-xl font-bold">
                    {program.name}
                  </h2>

                  <p className="mt-3 text-sm text-white/50">
                    Abrir editor →
                  </p>

                </Link>

              ))}

            </div>

          </div>
        );
      }