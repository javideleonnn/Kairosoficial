"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "GENERAL",
    items: [
      { href: "/", label: "Dashboard" },
    ],
  },
  {
    title: "GESTIÓN",
    items: [
      { href: "/usuarios", label: "Usuarios" },
    ],
  },
  {
    title: "CONTENIDO",
    items: [
      { href: "/programas", label: "Programas" },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { href: "/configuracion", label: "Configuración" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-white/10 p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-10">
        Kairos
      </h2>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 transition ${
                      active
                        ? "bg-white text-black font-semibold"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}