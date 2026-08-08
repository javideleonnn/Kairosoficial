"use client";

interface Props {
  progress: number;
  currentDay: number;
}

function getLevel(day: number) {
  if (day <= 3) return "I";
  if (day <= 6) return "II";
  if (day <= 9) return "III";
  if (day <= 12) return "IV";
  if (day <= 15) return "V";
  if (day <= 18) return "VI";
  return "VII";
}

export default function EvolutionHero({
  progress,
  currentDay,
}: Props) {
  return (
    <section>

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        TU EVOLUCIÓN
      </p>

      <h1 className="kairos-title mt-2 text-[58px] leading-none">
        Nivel {getLevel(currentDay)}
      </h1>

      <p className="mt-4 text-lg text-white/55 leading-8">
        Cada día que completas no suma tiempo.
        <br />
        Construye una identidad.
      </p>

      <div className="mt-8 overflow-hidden rounded-[34px] border border-white/10 bg-[#101928]">

        <div
          className="gold-gradient h-3 rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-4 flex items-center justify-between">

        <span className="text-sm text-white/45">
          Día {currentDay} de 21
        </span>

        <span className="font-semibold text-[var(--gold)]">
          {progress}%
        </span>

      </div>

    </section>
  );
}