import { redirect } from "next/navigation";
import {
  ChevronRight,
  Users,
  LogOut,
} from "lucide-react";

import Link from "next/link";

import BottomNavigation from "../components/navigation/BottomNavigation";

import { createClient } from "@/lib/supabase/server";
import { fetchStudent } from "@/lib/crm/fetchStudent";

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const student = await fetchStudent(user.email!);

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-8 pb-32">

      <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
        MI PERFIL
      </p>

      <h1 className="kairos-title mt-3 text-[56px] leading-none">
        {student?.fullName}
      </h1>

      <p className="mt-3 text-white/50">
        {student?.email}
      </p>

      {/* TARJETA */}

      <div className="mt-10 rounded-[34px] border border-[#D7B46A]/15 bg-gradient-to-br from-[#121B2B] via-[#0E1726] to-[#08111D] p-7">

        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          TU TRANSFORMACIÓN
        </p>

        <div className="mt-8 space-y-6">

          <Row
            label="Programa"
            value={student?.program?.name ?? "-"}
          />

          <Row
            label="Día actual"
            value={`${student?.currentDay ?? 1} / 21`}
          />

          <Row
            label="Progreso"
            value={`${student?.progress ?? 0}%`}
          />

        </div>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="gold-gradient h-full rounded-full"
            style={{
              width: `${student?.progress ?? 0}%`,
            }}
          />

        </div>

      </div>

      {/* OPCIONES */}

      <div className="mt-10 space-y-4">

        <Link href="/comunidad">

          <Item
            icon={<Users size={21} />}
            title="Comunidad"
            subtitle="Conecta con otros miembros"
          />

        </Link>

        <Item
          icon={<LogOut size={21} />}
          title="Cerrar sesión"
          subtitle="Salir de Kairos"
        />

      </div>

      <BottomNavigation />

    </main>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-white/45">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>

    </div>
  );
}

function Item({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-[28px] border border-white/10 bg-[#101928] p-5 transition hover:border-[#D7B46A]/30">

      <div className="flex items-center gap-5">

        <div className="rounded-2xl bg-[#D7B46A]/10 p-3 text-[var(--gold)]">
          {icon}
        </div>

        <div className="text-left">

          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-white/45">
            {subtitle}
          </p>

        </div>

      </div>

      <ChevronRight
        size={18}
        className="text-white/30"
      />

    </button>
  );
}