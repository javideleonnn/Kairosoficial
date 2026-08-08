"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Route = {
  id: string;
  block_key: string;
  title: string;
  focus_description: string | null;
};

type DayContent = {
  id: string;
  route_id: string;
  program_id: string | null;
  day_number: number;
  video_title: string | null;
  video_url: string | null;
  estimated_minutes: number | null;
  reflection: string | null;
  mission: string | null;
  daily_quote: string | null;
  primary_pillar: string | null;
  primary_points: number | null;
  secondary_pillar: string | null;
  secondary_points: number | null;
  title: string | null;
  subtitle: string | null;
  intro: string | null;
  journal_prompt: string | null;
  celebration: string | null;
  sort_order: number | null;
  is_published: boolean;
};

interface Props {
  program: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    active: boolean;
  };
  routes: Route[];
  days: DayContent[];
}

export default function ProgramBuilder({
  program,
  routes,
  days,
}: Props) {
  const router = useRouter();

  const [selectedRouteId, setSelectedRouteId] = useState(
    routes[0]?.id ?? ""
  );

  const [pending, startTransition] = useTransition();

  const selectedRoute = useMemo(() => {
    return (
      routes.find((route) => route.id === selectedRouteId) ??
      routes[0]
    );
  }, [routes, selectedRouteId]);

  const filteredDays = useMemo(() => {
    return days
      .filter((day) => day.route_id === selectedRoute?.id)
      .sort((a, b) => a.day_number - b.day_number);
  }, [days, selectedRoute]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">{program.name}</h1>
          <p className="mt-2 text-white/50">
            Editor del programa y sus 21 días.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white/70">
          {program.active ? "Activo" : "Inactivo"}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ruta</h2>
            <p className="text-sm text-white/50">
              Selecciona la ruta para ver el contenido asociado.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {routes.map((route) => {
            const active = route.id === selectedRoute?.id;

            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`rounded-xl border px-4 py-4 text-left transition ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-zinc-950 text-white/80 hover:border-white/30"
                }`}
              >
                <p className="text-sm font-semibold">
                  {route.block_key}
                </p>

                <p className="mt-1 text-sm">{route.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Días</h2>

            <p className="text-sm text-white/50">
              {selectedRoute?.title ?? "Sin ruta seleccionada"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredDays.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-white/40">
              No hay contenido creado para esta ruta.
            </div>
          ) : (
            filteredDays.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between rounded-xl border border-white/10 p-5"
              >
                <div>
                  <p className="font-semibold">
                    Día {day.day_number}
                  </p>

                  <p className="text-sm text-white/50">
                    {day.title ?? "Sin título"}
                  </p>
                </div>

                <button
                  disabled={pending}
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `/programas/${program.id}/dias/${day.id}`
                      );
                    });
                  }}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 