"use client";

import { ArrowUpRight } from "lucide-react";

export default function QuoteCard() {
  return (
    <section className="relative overflow-hidden rounded-[38px] border border-[#D7B46A]/15 bg-gradient-to-br from-[#0F1827] via-[#111C2D] to-[#08111D] p-8">

      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D7B46A]/10 blur-[120px]" />

      <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-white/[0.04] blur-[90px]" />

      <div className="relative">

        <div className="mb-8 flex items-center justify-between">

          <span className="rounded-full border border-[#D7B46A]/20 bg-[#D7B46A]/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--gold)]">
            MENSAJE DEL DÍA
          </span>

          <ArrowUpRight
            size={22}
            className="text-[var(--gold)]"
          />

        </div>

        <h2 className="kairos-title text-[54px] leading-[0.92]">

          Hoy eres
          <br />
          mejor que
          <br />
          ayer.

        </h2>

        <p className="mt-8 text-lg leading-9 text-white/65">

          La disciplina no aparece cuando tienes ganas.

          <br />
          <br />

          Aparece cuando decides cumplir tu palabra incluso cuando nadie te está viendo.

        </p>

        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-[#D7B46A]/30 to-transparent" />

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/35">

          KAIROS

        </p>

      </div>

    </section>
  );
}