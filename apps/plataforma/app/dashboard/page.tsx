import Link from "next/link";
import { redirect } from "next/navigation";

import HomeHero from "../components/dashboard/HomeHero";
import Journey from "../components/dashboard/Journey";
import BottomNavigation from "../components/navigation/BottomNavigation";

import { createClient } from "@/lib/supabase/server";
import { fetchStudent } from "@/lib/crm/fetchStudent";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const student = await fetchStudent(user.email!);

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-6 pb-32">

      {/* HEADER */}

      <header className="mb-8 flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D8B56B]/20 bg-[#131D2D]">

          <span className="text-lg font-bold text-[var(--gold)]">
            {student?.fullName?.charAt(0).toUpperCase() ?? "K"}
          </span>

        </div>

        <h1 className="kairos-title text-[44px] text-[var(--gold)]">
          KAIROS
        </h1>

        <div className="kairos-chip">
          🔥 {student?.completedDays.length ?? 0}
        </div>

      </header>

      {/* HERO */}

      <HomeHero
        name={student?.fullName ?? "Alumno"}
        day={student?.currentDay ?? 1}
        progress={student?.progress ?? 0}
      />

      {/* PORTADA DEL DÍA */}

      <section className="kairos-card mt-8 overflow-hidden p-0">

        <div className="relative">

          <div className="absolute inset-0 bg-gradient-to-t from-[#08111D] via-[#08111D]/60 to-transparent" />

          <div className="h-52 bg-gradient-to-br from-[#1F3555] via-[#14253E] to-[#0B121D]" />

          <div className="absolute bottom-0 left-0 right-0 p-8">

            <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
              CONTINÚA TU CAMINO
            </p>

            <h2 className="kairos-title mt-2 text-[48px] leading-none">
              Día {student?.currentDay}
            </h2>

            <p className="mt-4 max-w-[260px] text-white/70">
              Tu siguiente decisión puede cambiar el rumbo de toda tu vida.
            </p>

          </div>

        </div>

        <div className="flex items-center justify-between p-7">

          <div>

            <p className="text-sm text-white/40">
              Tiempo estimado
            </p>

            <p className="mt-1 font-semibold text-white">
              8 minutos
            </p>

          </div>

          <Link
            href={`/programa/${student?.currentDay ?? 1}`}
            className="kairos-button gold-gradient gold-glow px-8"
          >
            Empezar
          </Link>

        </div>

      </section>

      {/* CAMINO */}

      <Journey
        currentDay={student?.currentDay ?? 1}
      />

      <BottomNavigation />

    </main>
  );
}