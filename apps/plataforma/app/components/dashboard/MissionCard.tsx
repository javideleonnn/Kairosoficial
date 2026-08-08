interface MissionCardProps {
  day: number;
  totalDays: number;
  progress: number;
}

export default function MissionCard({
  day,
  totalDays,
  progress,
}: MissionCardProps) {
  return (
    <section className="rounded-[28px] border border-white/5 bg-[#111823]/85 p-6 backdrop-blur-3xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[11px] uppercase tracking-[0.35em] text-[#D7B46A]">
            Día {day} de {totalDays}
          </p>

          <h2 className="mt-3 text-[30px] font-semibold leading-tight">
            Continúa tu misión de hoy
          </h2>

          <p className="mt-3 max-w-[260px] text-sm leading-7 text-white/45">
            Cada día que completas te acerca a la mejor versión de ti.
          </p>

        </div>

        <div className="text-right">

          <p className="text-5xl font-light text-[#D7B46A]">
            {progress}%
          </p>

          <p className="text-xs text-white/35">
            completado
          </p>

        </div>

      </div>

      <div className="mt-7 h-[6px] overflow-hidden rounded-full bg-white/5">

        <div
          className="h-full rounded-full bg-[#D7B46A]"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <button className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#D7B46A] text-[15px] font-semibold text-[#08111D] transition hover:brightness-105">

        ▶

        <span className="ml-3">
          Continuar misión
        </span>

      </button>

    </section>
  );
}