import { redirect } from "next/navigation";

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
  const currentDay = student?.currentDay ?? 1;
  const progress = student?.progress ?? 0;

  const achievements = [
    {
      icon: "🥉",
      title: "Primer paso",
      unlocked: completed >= 1,
    },
    {
      icon: "🥈",
      title: "3 días",
      unlocked: completed >= 3,
    },
    {
      icon: "🥇",
      title: "7 días",
      unlocked: completed >= 7,
    },
    {
      icon: "👑",
      title: "21 días",
      unlocked: completed >= 21,
    },
  ];

const maxVisible = Math.min(currentDay + 1, 21);

const days = Array.from(
  {
    length: maxVisible,
  },
  (_, i) => i + 1,
);

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-8 pb-32">

      {/* HERO */}

      <section className="kairos-card-gold overflow-hidden p-8">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          TU EVOLUCIÓN
        </p>

        <h1 className="kairos-title mt-3 text-[62px] leading-none">
          {progress}%
        </h1>

        <p className="mt-5 text-lg leading-8 text-white/65">
          Cada misión completada fortalece la identidad que estás construyendo.
        </p>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">

          <div
            className="gold-gradient h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="mt-5 flex items-center justify-between">

          <span className="text-white/45">
            Día {currentDay} de 21
          </span>

          <span className="font-semibold text-[var(--gold)]">
            {completed} completados
          </span>

        </div>

      </section>

      {/* CAMINO */}  

      <section className="kairos-card mt-8 p-7">

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
  TU CAMINO
</p>  
<div className="mt-7 grid grid-cols-3 gap-3">

           {days.map((day) => {
  const completedDay =
    student?.completedDays.includes(day);

  const today = day === currentDay;
  const locked = day > currentDay;

  return (
    <div
      key={day}
      className="flex flex-col items-center"
    >
      <div
        className={`flex aspect-square h-16 w-16 items-center justify-center rounded-2xl border text-xl font-bold transition-all ${
          completedDay
            ? "border-green-500/40 bg-green-500/15 text-green-300"
            : today
            ? "border-[#D8B56B]/40 bg-[#D8B56B]/15 text-[var(--gold)]"
            : "border-white/10 bg-[#111A28] text-white/35"
        }`}
      >
        {completedDay
          ? "✓"
          : today
          ? "★"
          : "🔒"}
      </div>

      <span className="mt-3 text-sm text-white/45">
        Día {day}
      </span>
    </div>
  );
})}
        </div>

      </section>

      {/* LOGROS */}

      <section className="kairos-card mt-8 p-7">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          LOGROS
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">

          {achievements.map((achievement) => (

            <div
              key={achievement.title}
              className={`rounded-3xl border p-5 transition ${
                achievement.unlocked
                  ? "border-[#D8B56B]/25 bg-[#151F2F]"
                  : "border-white/10 bg-[#111A28] opacity-45"
              }`}
            >

              <div className="text-4xl">
                {achievement.icon}
              </div>

              <h3 className="mt-4 font-semibold">
                {achievement.title}
              </h3>

              <p className="mt-2 text-sm text-white/45">
                {achievement.unlocked
                  ? "Desbloqueado"
                  : "Bloqueado"}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* PRÓXIMO OBJETIVO */}

      <section className="kairos-card-gold mt-8 p-8">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          SIGUIENTE OBJETIVO
        </p>

        <h2 className="kairos-title mt-4 text-[42px] leading-none">
          Día {currentDay + 1}
        </h2>

        <p className="mt-5 text-lg leading-8 text-white/70">
          Cada día completado reduce la distancia entre quien eres y quien quieres llegar a ser.
        </p>

      </section>

      {/* RESUMEN */}

      <section className="mt-8 flex justify-between rounded-3xl border border-white/10 bg-[#101928] p-6">

        <div>

          <p className="text-sm text-white/45">
            Progreso
          </p>

          <h3 className="kairos-title mt-2 text-4xl">
            {progress}%
          </h3>

        </div>

        <div className="text-right">

          <p className="text-sm text-white/45">
            Restan
          </p>

          <h3 className="kairos-title mt-2 text-4xl">
            {21 - completed}
          </h3>

        </div>

      </section>

      <BottomNavigation />

    </main>
  );
}

        