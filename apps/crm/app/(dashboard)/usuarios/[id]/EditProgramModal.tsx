"use client";

interface Route {
  id: string;
  title: string;
  block_key: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  routes: Route[];
  selectedRouteId: string | null;
  onSelect: (routeId: string) => void;
  onSave: () => void;
  pending: boolean;
}

export default function EditProgramModal({
  open,
  onClose,
  routes,
  selectedRouteId,
  onSelect,
  onSave,
  pending,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 p-8">

        <h2 className="text-2xl font-bold">
          Cambiar ruta
        </h2>

        <p className="mt-2 text-white/50">
          Selecciona la nueva ruta del usuario.
          Su progreso será reiniciado automáticamente.
        </p>

        <div className="mt-8 space-y-3">

          {routes.map((route) => (

            <button
              key={route.id}
              type="button"
              onClick={() => onSelect(route.id)}
              className={`w-full rounded-xl border p-5 text-left transition ${
                selectedRouteId === route.id
                  ? "border-white bg-white/10"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <p className="font-semibold">
                {route.title}
              </p>

              <p className="mt-1 text-sm text-white/50">
                {route.block_key}
              </p>

            </button>

          ))}

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3"
          >
            Cancelar
          </button>

          <button
            disabled={pending || !selectedRouteId}
            onClick={onSave}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending
              ? "Guardando..."
              : "Guardar"}
          </button>

        </div>

      </div>

    </div>
  );
}