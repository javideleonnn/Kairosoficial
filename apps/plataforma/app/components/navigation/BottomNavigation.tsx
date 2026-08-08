"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  ChartColumn,
  Users,
  User,
} from "lucide-react";

const items = [
  {
    href: "/dashboard",
    icon: House,
  },
  {
    href: "/evolucion",
    icon: ChartColumn,
  },
  {
    href: "/comunidad",
    icon: Users,
  },
  {
    href: "/perfil",
    icon: User,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-7 left-1/2 z-50 w-[88%] max-w-sm -translate-x-1/2">

      <div className="glass flex h-[74px] items-center justify-evenly rounded-full border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,.55)]">

        {items.map((item) => {
          const Icon = item.icon;

          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                  active
                    ? "gold-gradient text-[#08111D] shadow-[0_8px_30px_rgba(215,180,106,.35)]"
                    : "text-white/35 hover:text-white/70"
                }`}
              >
                <Icon size={21} strokeWidth={2.2} />
              </div>
            </Link>
          );
        })}

      </div>

    </nav>
  );
}