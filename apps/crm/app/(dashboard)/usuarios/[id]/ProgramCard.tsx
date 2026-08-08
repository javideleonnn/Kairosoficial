  "use client";

  import { useState, useTransition } from "react";

  import {
    changeRouteAction,
    removeProgramAction,
    restartProgramAction,
  } from "@/lib/users/actions";

  import EditProgramModal from "./EditProgramModal";

  interface Route {
    id: string;
    title: string;
    block_key: string;
  }

  interface Props {
    userId: string;

    currentRouteId: string | null;

    routes: Route[];

    program: {
    id: string;
    active: boolean;
    current_day: number;
    total_days: number;
    completed_days: number;
    progress_percentage: number;

    programs: {
      id: string;
      name: string;
    } | null;

    routes: {
      id: string;
      title: string;
      block_key: string;
    } | null;
  };  
}
  export default function ProgramCard({
    userId,
    program,
    routes,
    currentRouteId,
  }: Props) {
    const [editing, setEditing] =
      useState(false);

    const [selectedRouteId, setSelectedRouteId] =
      useState<string | null>(currentRouteId);

    const [pending, startTransition] =
      useTransition();

    const handleChangeRoute = () => {
      if (!selectedRouteId) return;

      startTransition(async () => {
        await changeRouteAction(
          userId,
          program.id,
          selectedRouteId
        );

        setEditing(false);
      });
    };

  return (
    <>
      <EditProgramModal
        open={editing}
        onClose={() => setEditing(false)}
        routes={routes}
        selectedRouteId={selectedRouteId}
        onSelect={setSelectedRouteId}
        onSave={handleChangeRoute}
        pending={pending}
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">

        <div className="flex items-center justify-between border-b border-white/10 p-6">

          <div>

           <h2 className="text-2xl font-bold">
  {program.programs?.name}
</h2>

<p className="mt-2 text-white/50">
  {program.active
    ? "Programa activo"
    : "Programa inactivo"}
</p>

<p className="mt-4 text-xs uppercase tracking-wider text-white/40">
  Ruta actual
</p>

<p className="text-lg font-semibold">
  {program.routes?.title ?? "Sin ruta asignada"}
</p>

<p className="text-sm text-white/40">
  {program.routes?.block_key}
</p>

          </div>

          <div className="text-right">

            <h3 className="text-5xl font-bold">
              {program.progress_percentage}%
            </h3>

            <p className="text-sm text-white/40">
              progreso
            </p>

          </div>

        </div>

        <div className="p-6">

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

            <div
              className="h-full bg-white transition-all"
              style={{
                width: `${program.progress_percentage}%`,
              }}
            />

          </div>

        </div>

        <div className="grid grid-cols-3 gap-5 px-6">

          <div className="rounded-xl border border-white/10 p-5">

            <p className="text-xs text-white/40">
              Día actual
            </p>

            <p className="mt-3 text-3xl font-bold">
              {program.current_day}
            </p>

          </div>

          <div className="rounded-xl border border-white/10 p-5">

            <p className="text-xs text-white/40">
              Completados
            </p>

            <p className="mt-3 text-3xl font-bold">
              {program.completed_days}
            </p>

            <p className="text-sm text-white/40">
              de {program.total_days}
            </p>

          </div>

          <div className="rounded-xl border border-white/10 p-5">

            <p className="text-xs text-white/40">
              Estado
            </p>

            <p className="mt-3 text-lg font-semibold">
              {program.active
                ? "En curso"
                : "Pausado"}
            </p>

          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 p-6">

          <button
            onClick={() => setEditing(true)}
            className="rounded-xl border border-blue-500/30 px-5 py-3 text-blue-400"
          >
            Cambiar ruta
          </button>

          <button
            disabled={pending}
            onClick={() =>
              startTransition(() =>
                restartProgramAction(
                  userId,
                  program.id
                )
              )
            }
            className="rounded-xl border border-yellow-500/30 px-5 py-3 text-yellow-400 disabled:opacity-50"
          >
            Reiniciar progreso
          </button>

          <button
            disabled={pending}
            onClick={() => {

              if (
                !confirm(
                  "¿Desasignar este programa?"
                )
              )
                return;

              startTransition(() =>
                removeProgramAction(
                  userId,
                  program.id
                )
              );

            }}
            className="rounded-xl border border-red-500/30 px-5 py-3 text-red-400 disabled:opacity-50"
          >
            Desasignar programa
          </button>

        </div>

      </div>
    </>
  );
}