"use client";

import {
  CalendarDays,
  Clock3,
  Trophy,
  Flame,
} from "lucide-react";

interface Props {
  completed: number;
  remaining: number;
  streak: number;
  minutes: number;
}

export default function StatsGrid({
  completed,
  remaining,
  streak,
  minutes,
}: Props) {
  return (
    <section>

      <h2 className="mb-5 text-sm uppercase tracking-[0.28em] text-white/35">
        Tu progreso
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <Card
          icon={<CalendarDays size={20} />}
          value={completed}
          label="Días completados"
        />

        <Card
          icon={<Trophy size={20} />}
          value={remaining}
          label="Restantes"
        />

        <Card
          icon={<Clock3 size={20} />}
          value={`${Math.floor(minutes / 60)}h ${minutes % 60}m`}
          label="Tiempo invertido"
        />

        <Card
          icon={<Flame size={20} />}
          value={`${streak}`}
          label="Racha"
        />

      </div>

    </section>
  );
}

function Card({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="group overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#101928] to-[#0A111C] p-5 transition duration-300 hover:border-[var(--gold)]/40">

      <div className="flex items-center justify-between">

        <div className="rounded-2xl bg-white/5 p-3 text-[var(--gold)]">
          {icon}
        </div>

      </div>

      <h3 className="mt-7 text-4xl font-bold text-white">
        {value}
      </h3>

      <p className="mt-2 text-sm text-white/45 leading-6">
        {label}
      </p>

    </div>
  );
}