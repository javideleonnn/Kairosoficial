    "use client";

interface ProgressTimelineProps {
  currentDay: number;
  completedDays: number[];
  totalDays?: number;
  onSelectDay?: (day: number) => void;
}

export default function ProgressTimeline({
  currentDay,
  completedDays,
  totalDays = 21,
  onSelectDay,
}: ProgressTimelineProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Progreso del Programa</h3>
          <p className="text-sm text-white/50">
            Día {currentDay} de {totalDays}
          </p>
        </div>

        <div className="rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent">
          {Math.round((completedDays.length / totalDays) * 100)}%
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;

          const completed = completedDays.includes(day);

          const current = day === currentDay;

          const locked = day > currentDay;

          return (
            <button
              key={day}
              onClick={() => onSelectDay?.(day)}
              disabled={locked}
              className={`
                aspect-square rounded-xl border transition-all duration-200

                ${
                  completed
                    ? "border-green-500 bg-green-500 text-white"
                    : current
                    ? "border-accent bg-accent text-black"
                    : locked
                    ? "cursor-not-allowed border-white/10 bg-white/5 text-white/30"
                    : "border-white/15 bg-white/10 hover:border-accent hover:bg-white/15"
                }
              `}
            >
              <div className="flex h-full flex-col items-center justify-center">

                <span className="text-xs opacity-60">
                  Día
                </span>

                <span className="text-lg font-bold">
                  {day}
                </span>

                <span className="mt-1 text-xs">
                  {completed ? "✓" : current ? "●" : locked ? "🔒" : ""}
                </span>

              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}