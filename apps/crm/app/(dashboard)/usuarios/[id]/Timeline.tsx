interface TimelineProps {
  days: {
    id: string;
    day_id: string;
    completed: boolean;
    completed_at?: string | null;
  }[];
}

export default function Timeline({
  days,
}: TimelineProps) {
  return (
    <section className="space-y-6">

      <div className="flex items-end justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Timeline
          </h2>

          <p className="text-white/50">
            Avance completo del programa.
          </p>
        </div>

        <span className="text-sm text-white/40">
          {days.filter((d) => d.completed).length} / {days.length} días
        </span>

      </div>

      {days.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/40">
          Este programa aún no tiene progreso.
        </div>

      ) : (

        <div className="grid grid-cols-5 gap-3 md:grid-cols-10">

          {days.map((day, index) => {

            const classes = day.completed
              ? "bg-green-500/20 border-green-500/40 text-green-300"
              : "bg-zinc-900 border-white/10 text-zinc-500";

            return (
              <button
                key={day.id}
                title={`Día ${index + 1}`}
                className={`aspect-square rounded-xl border font-semibold ${classes}`}
              >
                {index + 1}
              </button>
            );

          })}

        </div>

      )}

    </section>
  );
}