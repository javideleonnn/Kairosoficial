interface Props {
  name: string;
  day: number;
  progress: number;
}

export default function HomeHero({
  name,
  day,
  progress,
}: Props) {
  return (
    <section className="kairos-card-gold overflow-hidden p-8 relative">

      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#D8B56B]/10 blur-3xl" />

      <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          TU MISIÓN
        </p>

        <h1 className="kairos-title mt-3 text-[60px] leading-none">
          Día {day}
        </h1>

        <p className="mt-6 text-lg leading-8 text-white/65">
          Hola <span className="font-semibold text-white">{name}</span>.
          <br />
          Cada decisión que tomas hoy construye la persona que serás mañana.
        </p>

        <div className="mt-10">

          <div className="flex justify-between text-sm">

            <span className="text-white/45">
              Progreso total
            </span>

            <span className="font-semibold text-[var(--gold)]">
              {progress}%
            </span>

          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">

            <div
              className="gold-gradient h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

    </section>
  );
}