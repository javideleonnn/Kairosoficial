import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import BottomNavigation from "../components/navigation/BottomNavigation";

export default function ComunidadPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-8 pb-32">

      <div className="rounded-[38px] border border-[#D7B46A]/15 bg-gradient-to-br from-[#121B2B] via-[#0D1624] to-[#08111D] p-8">

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#D7B46A]/10">

          <Users
            size={32}
            className="text-[var(--gold)]"
          />

        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          COMUNIDAD
        </p>

        <h1 className="kairos-title mt-3 text-[56px] leading-none">
          No camines
          <br />
          solo.
        </h1>

        <p className="mt-8 text-lg leading-8 text-white/60">
          Kairos no termina cuando cierras la aplicación.

          <br />
          <br />

          Forma parte de una comunidad donde miles de personas están construyendo disciplina, dirección e identidad igual que tú.
        </p>

      </div>

      <div className="mt-10 space-y-4">

        <Benefit text="Comparte tus avances." />

        <Benefit text="Recibe apoyo cuando falles." />

        <Benefit text="Celebra tus victorias." />

        <Benefit text="Crece junto a personas con el mismo propósito." />

      </div>

      <Link
        href="https://chat.whatsapp.com/IpheE3hXD0s8BGL7aQxmcg"
        target="_blank"
        className="gold-gradient gold-glow mt-12 flex h-16 w-full items-center justify-center gap-3 rounded-3xl text-lg font-semibold text-[#07111D]"
      >
        Unirme a la comunidad

        <ArrowRight size={20} />

      </Link>

      <BottomNavigation />

    </main>
  );
}

function Benefit({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101928] p-5">

      <p className="text-white/75">
        {text}
      </p>

    </div>
  );
}