interface Props {
  currentDay: number;
}

export default function Journey({
  currentDay,
}: Props) {

  let startDay = Math.max(1, currentDay - 2);

  if (startDay > 17) {
    startDay = 17;
  }

  const endDay = Math.min(21, startDay + 4);

  const days = Array.from(
    {
      length: endDay - startDay + 1,
    },
    (_, i) => startDay + i,
  );

  return (
    <section className="kairos-card mt-8 p-7">

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        TU CAMINO
      </p>

      <div className="mt-8 flex items-center justify-between">

        {days.map((day) => {

          const completed = day < currentDay;
          const today = day === currentDay;
          const locked = day > currentDay;

          return (

            <div
              key={day}
              className="relative flex flex-col items-center"
            >

              {day !== startDay && (

                <div className="absolute -left-5 top-7 h-[2px] w-5 bg-white/10" />

              )}

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
                  completed
                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,.18)]"
                    : today
                    ? "border-[#D8B56B] bg-[#D8B56B]/15 text-[var(--gold)] shadow-[0_0_25px_rgba(216,181,107,.25)]"
                    : "border-white/10 bg-[#111A28] text-white/35"
                }`}
              >

                <span className="text-lg font-semibold">

                  {completed
                    ? "✓"
                    : locked
                    ? "🔒"
                    : day}

                </span>

              </div>

              <span className="mt-3 text-xs text-white/45">
                Día {day}
              </span>

            </div>

          );

        })}

      </div>

      <p className="mt-8 text-center text-white/55 leading-7">
        Has recorrido{" "}
        <span className="font-semibold text-[var(--gold)]">
          {currentDay - 1}
        </span>{" "}
        de los 21 días.
      </p>

    </section>
  );
}