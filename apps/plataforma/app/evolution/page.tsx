import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import BottomNavigation from "../components/navigation/BottomNavigation";

import { createClient } from "@/lib/supabase/server";
import { fetchStudent } from "@/lib/crm/fetchStudent";

export default async function EvolutionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const student = await fetchStudent(user.email!);

  const completed = student?.completedDays.length ?? 0;
  const current = student?.currentDay ?? 1;
  const progress = student?.progress ?? 0;

  const days = Array.from({ length: 21 }, (_, i) => i + 1);

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-8 pb-32">

      {/* HERO */}

      <div className="rounded-[36px] border border-[#D7B46A]/20 bg-gradient-to-br from-[#171F30] via-[#101827] to-[#08111D] p-8">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          TU EVOLUCIÓN
        </p>

        <h1 className="kairos-title mt-3 text-[62px] leading-none">
          {progress}%
        </h1>

        <p className="mt-3 text-lg text-white/55">
          Has completado {completed} de 21 días.
        </p>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">

          <div
            className="gold-gradient h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="mt-5 flex justify-between text-sm">

          <span className="text-white/45">
            Día {current}
          </span>

          <span className="font-semibold text-[var(--gold)]">
            {21 - completed} restantes
          </span>

        </div>

      </div>

      {/* MI CAMINO */}

      <section className="mt-10">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          TU CAMINO
        </p>

        <div className="mt-6 space-y-3">

          {days.map((day) => {
            const done = day < current;
            const today = day === current;

            return (
              <div
                key={day}
                className={`flex items-center justify-between rounded-2xl border p-5 transition ${
                  today
                    ? "border-[#D7B46A]/30 bg-[#181F2D]"
                    : done
                    ? "border-green-500/20 bg-[#111A27]"
                    : "border-white/10 bg-[#0E1623]"
                }`}
              >
                <div>

                  <h3 className="font-semibold text-white">
                    Día {day}
                  </h3>

                  <p className="mt-1 text-sm text-white/45">
                    {done
                      ? "Completado"
                      : today
                      ? "Tu misión de hoy"
                      : "Pendiente"}
                  </p>

                </div>

                <div className="text-2xl">
                  {done ? "✅" : today ? "⭐" : "○"}
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* LOGRO */}

      <section className="mt-10 rounded-[30px] border border-[#D7B46A]/20 bg-[#101928] p-6">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          PRÓXIMO LOGRO
        </p>

        <h2 className="kairos-title mt-4 text-[42px]">
          🥈 Disciplina
        </h2>

        <p className="mt-3 text-white/55">
          Completa tus primeros 3 días para desbloquear tu siguiente insignia.
        </p>

      </section>

      {/* CTA */}

      <Link
        href={`/programa/${current}`}
        className="gold-gradient gold-glow mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-3xl text-lg font-semibold text-[#07111D]"
      >
        Continuar misión

        <ArrowRight size={20} />

      </Link>

      <BottomNavigation />

    </main>
  );
}