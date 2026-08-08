interface StudentHeaderProps {
  fullName: string;
  instagram?: string | null;
  email?: string | null;
  program?: string;
  currentDay: number;
  progress: number;
}

export default function StudentHeader({
  fullName,
  instagram,
  email,
  program,
  currentDay,
  progress,
}: StudentHeaderProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-black">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div>

            <h1 className="text-2xl font-bold">
              {fullName}
            </h1>

            {instagram && (
              <p className="text-sm text-white/50">
                @{instagram}
              </p>
            )}

            {email && (
              <p className="text-sm text-white/40">
                {email}
              </p>
            )}

          </div>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-wider text-white/40">
            Programa
          </p>

          <p className="font-semibold">
            {program ?? "Sin asignar"}
          </p>

          <div className="mt-4">

            <p className="text-xs text-white/40">
              Día actual
            </p>

            <p className="text-3xl font-bold text-accent">
              {currentDay}
            </p>

          </div>

        </div>

      </div>

      <div className="mt-6">

        <div className="h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="mt-2 flex justify-between text-xs text-white/40">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>

      </div>
    </div>
  );
}   