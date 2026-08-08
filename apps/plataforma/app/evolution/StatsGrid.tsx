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
  const stats = [
    {
      value: completed,
      label: "Días completados",
    },
    {
      value: remaining,
      label: "Restantes",
    },
    {
      value: streak,
      label: "Racha",
    },
    {
      value: `${minutes}m`,
      label: "Tiempo invertido",
    },
  ];

  return (
    <section>

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        ESTADÍSTICAS
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">

        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#131D2D] to-[#0D1523] p-6"
          >
            <h2 className="kairos-title text-[42px] leading-none text-[var(--gold)]">
              {item.value}
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              {item.label}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}