"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  House,
  CalendarDays,
  ChartColumn,
  User,
  Users,
  LifeBuoy,
  LogOut,
} from "lucide-react";

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass flex h-12 w-12 items-center justify-center rounded-2xl"
      >
        <Menu size={20} className="text-white/70" />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <aside className="fixed left-0 top-0 z-50 flex h-screen w-[300px] flex-col bg-[#08111D] px-7 py-8 shadow-2xl">

            <div className="mb-10 flex items-center justify-between">
              <h2 className="kairos-title text-4xl text-[var(--gold)]">
                KAIROS
              </h2>

              <button onClick={() => setOpen(false)}>
                <X className="text-white/70" />
              </button>
            </div>

            <nav className="space-y-2">

              <Item href="/dashboard" icon={<House size={20} />}>
                Inicio
              </Item>

              <Item href="/programa" icon={<CalendarDays size={20} />}>
                Programa
              </Item>

              <Item href="/evolucion" icon={<ChartColumn size={20} />}>
                Estadísticas
              </Item>

              <Item href="/perfil" icon={<User size={20} />}>
                Perfil  
              </Item>

              <div className="my-6 border-t border-white/10" />

              <Item href="/comunidad" icon={<Users size={20} />}>
                Comunidad
              </Item>

              <Item href="/soporte" icon={<LifeBuoy size={20} />}>
                Soporte
              </Item>

            </nav>

            <div className="mt-auto">

              <Item href="/logout" icon={<LogOut size={20} />}>
                Cerrar sesión
              </Item>

            </div>

          </aside>
        </>
      )}
    </>
  );
}

function Item({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl px-4 py-4 text-white/75 transition hover:bg-white/5 hover:text-white"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}