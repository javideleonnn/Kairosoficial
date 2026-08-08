"use client";

import { Sparkles } from "lucide-react";

export default function IdentityCard() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[#D7B46A]/20 bg-gradient-to-br from-[#151E2F] via-[#101928] to-[#08111D] p-7">

      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#D7B46A]/10 blur-3xl" />

      <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D7B46A]/15">

            <Sparkles
              size={22}
              className="text-[var(--gold)]"
            />

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
              IDENTIDAD
            </p>

            <h2 className="kairos-title mt-1 text-4xl">
              Nivel III
            </h2>

          </div>

        </div>

        <h3 className="kairos-title text-[42px] leading-none">
          Ya no eres
          <br />
          el mismo.
        </h3>

        <p className="mt-6 text-lg leading-8 text-white/60">
          Las personas cambian cuando dejan de negociar
          consigo mismas.
        </p>

        <div className="mt-8 overflow-hidden rounded-full bg-white/10">

          <div
            className="gold-gradient h-3 rounded-full"
            style={{ width: "72%" }}
          />

        </div>

        <div className="mt-4 flex justify-between text-sm">

          <span className="text-white/45">
            Construcción de identidad
          </span>

          <span className="font-semibold text-[var(--gold)]">
            72%
          </span>

        </div>

      </div>

    </section>
  );
}