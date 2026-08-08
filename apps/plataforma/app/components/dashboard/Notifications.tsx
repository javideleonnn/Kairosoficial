"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";

export default function Notifications() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass relative flex h-12 w-12 items-center justify-center rounded-2xl"
      >
        <Bell
          size={19}
          className="text-white/70"
        />

        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--gold)]" />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-x-0 top-0 z-50 rounded-b-[40px] bg-[#08111D] p-7 shadow-2xl">

            <div className="mb-8 flex items-center justify-between">
              <h2 className="kairos-title text-3xl text-[var(--gold)]">
                Notificaciones
              </h2>

              <button onClick={() => setOpen(false)}>
                <X className="text-white/70" />
              </button>
            </div>

            <div className="space-y-4">

              <NotificationCard
                title="Tu misión de hoy"
                text="Continúa con el siguiente día del programa."
              />

              <NotificationCard
                title="Racha"
                text="Mantén la constancia para construir disciplina."
              />

              <NotificationCard
                title="Comunidad"
                text="Comparte tu avance con la Comunidad Kairos."
              />

            </div>

          </div>
        </>
      )}
    </>
  );
}

function NotificationCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-white/60">
        {text}
      </p>
    </div>
  );  
}