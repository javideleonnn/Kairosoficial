import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { fetchStudent } from "@/lib/crm/fetchStudent";
import { fetchDay } from "@/lib/crm/fetchDay";
import { completeDay } from "@/lib/crm/completeDay";

import SectionCard from "../../components/day/SectionCard";

interface Props {
  params: Promise<{
    day: string;
  }>;
}

function getYoutubeEmbed(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  );

  if (!match) return null;

  return `https://www.youtube.com/embed/${match[1]}`;
}

export default async function DayPage({
  params,
}: Props) {
  const { day } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const student = await fetchStudent(user.email!);

  if (!student?.program || !student.userProgramId) {
    redirect("/dashboard");
  }

  const content = await fetchDay(
    student.program.id,
    student.routeId!,
    Number(day),
  );

  if (!content) {
    redirect("/dashboard");
  }

  const userProgramId = student.userProgramId;

async function finishDay() {
  "use server";

  if (!userProgramId) {
    redirect("/dashboard");
  }

  await completeDay(
    userProgramId,
    content.id,
  );

  redirect("/dashboard");
}

  const embed =
    content.video_url &&
    getYoutubeEmbed(content.video_url);

  return (
    <main className="mx-auto max-w-md px-6 pt-8 pb-32">

      {/* HERO */}

      <section className="kairos-card-gold overflow-hidden p-8">

        <div className="flex items-center justify-between">

          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            DÍA {content.day_number}
          </p>

          <div className="kairos-chip">
            ⏱ 8 min
          </div>

        </div>

        <h1 className="kairos-title mt-5 text-[58px] leading-none">
          {content.title}
        </h1>

        {content.subtitle && (
          <p className="mt-6 text-xl leading-9 text-white/65">
            {content.subtitle}
          </p>
        )}

        {(content.primary_pillar ||
          content.secondary_pillar) && (

          <div className="mt-8 flex flex-wrap gap-3">

            {content.primary_pillar && (
              <div className="kairos-chip">
                {content.primary_pillar}
              </div>
            )}

            {content.secondary_pillar && (
              <div className="kairos-chip">
                {content.secondary_pillar}
              </div>
            )}

          </div>

        )}

      </section>

      {/* VIDEO */}

      {embed && (

        <section className="kairos-card mt-8 overflow-hidden p-2">

          {content.video_title && (

            <div className="px-5 pt-5">

              <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
                VIDEO
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                {content.video_title}
              </h2>

            </div>

          )}

          <div className="mt-5">

            <iframe
              src={embed}
              className="aspect-video w-full rounded-[24px]"
              allowFullScreen
            />

          </div>

        </section>

      )}

      {/* ANTES DE COMENZAR */}

      {content.intro && (

        <SectionCard title="ANTES DE COMENZAR">

          {content.intro}

        </SectionCard>

      )}

      {/* FRASE DEL DÍA */}

      {content.daily_quote && (

        <section className="kairos-card mt-8 p-8">

          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            FRASE DEL DÍA
          </p>

          <div className="kairos-divider my-6" />

          <blockquote className="kairos-title text-[42px] leading-tight text-center italic">
            “{content.daily_quote}”
          </blockquote>

        </section>

      )}

      {/* REFLEXIÓN */}

      {content.reflection && (

        <SectionCard title="REFLEXIÓN">

          {content.reflection}

        </SectionCard>

      )}
            {/* TU MISIÓN */}

      {content.mission && (

        <section className="kairos-card-gold mt-8 p-8">

          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            TU MISIÓN
          </p>

          <div className="kairos-divider my-6" />

          <p className="text-2xl leading-10 text-white">
            {content.mission}
          </p>

        </section>

      )}

      {/* JOURNAL */}

      <section className="kairos-card mt-8 p-8">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          TU ESPACIO
        </p>

        <div className="kairos-divider my-6" />

        {content.journal_prompt && (

          <div className="mb-6 rounded-2xl border border-[#D8B56B]/20 bg-[#151E2C] p-5">

            <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]">
              ESCRIBE SOBRE ESTO
            </p>

            <p className="mt-3 leading-8 text-white/75">
              {content.journal_prompt}
            </p>

          </div>

        )}

        <textarea
          placeholder="Escribe aquí todo lo que descubriste hoy..."
          className="min-h-[220px] w-full resize-none rounded-3xl border border-white/10 bg-[#0D1623] p-6 text-lg leading-8 text-white outline-none transition focus:border-[#D8B56B]/30 placeholder:text-white/25"
        />

      </section>

      {/* CELEBRACIÓN */}

      {content.celebration && (

        <section className="kairos-card mt-8 p-8">

          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            CUANDO TERMINES...
          </p>

          <div className="kairos-divider my-6" />

          <p className="text-xl leading-9 text-white/75">
            {content.celebration}
          </p>

        </section>

      )}

      {/* CTA */}

      <form action={finishDay} className="mt-10">

        <button
          className="kairos-button gold-gradient gold-glow w-full text-lg"
        >
          Completar día
        </button>

      </form>

    </main>
  );
}