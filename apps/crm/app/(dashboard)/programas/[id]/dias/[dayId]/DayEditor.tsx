"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateDayContent } from "@/app/(dashboard)/programas/actions";

interface Day {
  id: string;
  day_number: number;

  title: string | null;
  subtitle: string | null;
  intro: string | null;

  video_title: string | null;
  video_url: string | null;
  estimated_minutes: number | null;

  reflection: string | null;
  mission: string | null;
  daily_quote: string | null;
  journal_prompt: string | null;
  celebration: string | null;

  primary_pillar: string | null;
  primary_points: number | null;

  secondary_pillar: string | null;
  secondary_points: number | null;

  is_published: boolean;
}

interface Props {
  day: Day;
}

export default function DayEditor({ day }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    title: day.title ?? "",
    subtitle: day.subtitle ?? "",
    intro: day.intro ?? "",

    video_title: day.video_title ?? "",
    video_url: day.video_url ?? "",
    estimated_minutes: day.estimated_minutes ?? 0,

    reflection: day.reflection ?? "",
    mission: day.mission ?? "",
    daily_quote: day.daily_quote ?? "",
    journal_prompt: day.journal_prompt ?? "",
    celebration: day.celebration ?? "",

    primary_pillar: day.primary_pillar ?? "",
    primary_points: day.primary_points ?? 0,

    secondary_pillar: day.secondary_pillar ?? "",
    secondary_points: day.secondary_points ?? 0,

    is_published: day.is_published,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateDayContent({
          id: day.id,
          ...form,
        });

        router.refresh();

        alert("Contenido guardado correctamente.");
      } catch (error) {
        console.error(error);

        alert("Ocurrió un error al guardar.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Día {day.day_number}
        </h1>

        <p className="text-white/50">
          Editor de contenido
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold">
          Información General
        </h2>

        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Título"
          className="w-full rounded-lg border border-white/10 bg-black p-3"
        />

        <input
          value={form.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          placeholder="Subtítulo"
          className="w-full rounded-lg border border-white/10 bg-black p-3"
        />

        <textarea
          value={form.intro}
          onChange={(e) => updateField("intro", e.target.value)}
          placeholder="Introducción"
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-black p-3"
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold">
          Video
        </h2>
          <input
          value={form.video_title}
          onChange={(e) => updateField("video_title", e.target.value)}
          placeholder="Título del video"
          className="w-full rounded-lg border border-white/10 bg-black p-3"
        />

        <input
          value={form.video_url}
          onChange={(e) => updateField("video_url", e.target.value)}
          placeholder="URL del video"
          className="w-full rounded-lg border border-white/10 bg-black p-3"
        />

        <input
          type="number"
          value={form.estimated_minutes}
          onChange={(e) =>
            updateField(
              "estimated_minutes",
              Number(e.target.value)
            )
          }
          placeholder="Duración estimada (minutos)"
          className="w-full rounded-lg border border-white/10 bg-black p-3"
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold">
            Contenido
          </h2>

          <textarea
            value={form.reflection}
            onChange={(e) => updateField("reflection", e.target.value)}
            placeholder="Reflexión"
            rows={5}
            className="w-full rounded-lg border border-white/10 bg-black p-3"
          />

          <textarea
            value={form.mission}
            onChange={(e) => updateField("mission", e.target.value)}
            placeholder="Misión"
            rows={5}
            className="w-full rounded-lg border border-white/10 bg-black p-3"
          />

          <textarea
            value={form.daily_quote}
            onChange={(e) => updateField("daily_quote", e.target.value)}
            placeholder="Frase del día"
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-black p-3"
          />

          <textarea
            value={form.journal_prompt}
            onChange={(e) => updateField("journal_prompt", e.target.value)}
            placeholder="Journal Prompt"
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-black p-3"
          />

          <textarea
            value={form.celebration}
            onChange={(e) => updateField("celebration", e.target.value)}
            placeholder="Celebración"
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-black p-3"
          />
        </section>
<section className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-6">
  <div>
    <h2 className="font-semibold">
      Estado
    </h2>

    <p className="text-sm text-white/50">
      Publicado
    </p>
  </div>

  <input
    type="checkbox"
    checked={form.is_published}
    onChange={(e) =>
      updateField("is_published", e.target.checked)
    }
    className="h-5 w-5"
  />
</section>

<div className="flex justify-end">
  <button
    type="button"
    onClick={handleSave}
    disabled={isPending}
    className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isPending ? "Guardando..." : "Guardar cambios"}
  </button>
</div>

</div>
  );
}