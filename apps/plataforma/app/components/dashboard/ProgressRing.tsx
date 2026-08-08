"use client";

interface Props {
  progress: number;
}

export default function ProgressRing({
  progress,
}: Props) {
  const radius = 95;
  const stroke = 9;

  const normalizedRadius = radius - stroke / 2;

  const circumference =
    normalizedRadius * 2 * Math.PI;

  const offset =
    circumference -
    (progress / 100) * circumference;

  function getLevel(progress: number) {
    if (progress < 15) return "I";
    if (progress < 30) return "II";
    if (progress < 45) return "III";
    if (progress < 60) return "IV";
    if (progress < 75) return "V";
    if (progress < 90) return "VI";
    return "VII";
  }

  return (
    <div className="relative flex justify-center">

      {/* Glow */}

      <div className="absolute h-[240px] w-[240px] rounded-full bg-[#D7B46A]/20 blur-[70px]" />

      {/* Ring */}

      <div className="relative flex h-[235px] w-[235px] items-center justify-center">

        <svg
          width="235"
          height="235"
          className="-rotate-90 absolute"
        >
          <defs>

            <linearGradient
              id="gold"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#F6D37A"
              />

              <stop
                offset="100%"
                stopColor="#C79A34"
              />

            </linearGradient>

          </defs>

          <circle
            cx="117.5"
            cy="117.5"
            r={normalizedRadius}
            fill="transparent"
            stroke="rgba(255,255,255,.06)"
            strokeWidth={stroke}
          />

          <circle
            cx="117.5"
            cy="117.5"
            r={normalizedRadius}
            fill="transparent"
            stroke="url(#gold)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition:
                "stroke-dashoffset .9s ease",
              filter:
                "drop-shadow(0 0 18px rgba(215,180,106,.9))",
            }}
          />

        </svg>

        {/* Centro */}

        <div className="flex h-[175px] w-[175px] flex-col items-center justify-center rounded-full border border-white/10 bg-[#0E1726] shadow-[inset_0_0_35px_rgba(255,255,255,.03)]">

          <p className="text-[11px] uppercase tracking-[0.45em] text-white/30">
            NIVEL
          </p>

          <h2 className="kairos-title mt-1 text-[70px] leading-none text-[#E4C06A]">
            {getLevel(progress)}
          </h2>

          <div className="my-5 h-px w-16 bg-white/10" />

          <p className="text-sm text-white/40">
            Construyendo
          </p>

          <p className="text-lg font-semibold text-white">
            Identidad
          </p>

          <p className="mt-4 text-sm font-medium text-[#E4C06A]">
            {progress}% completado
          </p>

        </div>

      </div>

    </div>
  );
}