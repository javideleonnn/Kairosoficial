"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 50% -10%, rgba(214,178,106,.10), transparent 25%),
          radial-gradient(circle at 15% 90%, rgba(33,63,104,.22), transparent 38%),
          radial-gradient(circle at 90% 85%, rgba(18,32,54,.28), transparent 42%),
          linear-gradient(180deg,#08111D 0%,#060C16 55%,#03060C 100%)
        `,
      }}
    >
      <div className="absolute -top-60 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#D4AF63]/10 blur-[180px]" />

      <div className="absolute -bottom-52 -right-28 h-[420px] w-[420px] rounded-full bg-[#18365D]/30 blur-[180px]" />

      <div className="absolute left-[-180px] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[#0F213B] blur-[170px]" />

      <section className="relative z-10 w-full max-w-lg px-8">

        <div className="text-center">

          <h1
            style={{ fontFamily: "Georgia, serif" }}
            className="text-[58px] font-light tracking-[0.34em] text-[#D7B46A]"
          >
            KAIROS
          </h1>

          <div className="mx-auto mt-7 h-px w-20 bg-gradient-to-r from-transparent via-[#D7B46A] to-transparent" />

          <p className="mt-7 text-[11px] uppercase tracking-[0.55em] text-[#D7B46A]/80">
            Recupera el control
          </p>

          <p className="mt-1 text-[11px] uppercase tracking-[0.55em] text-[#D7B46A]/80">
            de tu mente
          </p>

          <p className="mt-16 text-[16px] text-white/55">
            Inicia sesión para continuar
          </p>

        </div>

        <div className="mt-14 space-y-5">

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 w-full rounded-3xl bg-white/[0.035] px-7 text-[15px] text-white placeholder:text-white/25 outline-none backdrop-blur-xl ring-1 ring-white/5 transition-all duration-300 focus:bg-white/[0.05] focus:ring-[#D7B46A]/30"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-16 w-full rounded-3xl bg-white/[0.035] px-7 text-[15px] text-white placeholder:text-white/25 outline-none backdrop-blur-xl ring-1 ring-white/5 transition-all duration-300 focus:bg-white/[0.05] focus:ring-[#D7B46A]/30"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 h-16 w-full rounded-3xl bg-gradient-to-b from-[#DEC07A] to-[#C19B58] text-[15px] font-semibold text-[#07111D] shadow-[0_18px_60px_rgba(215,180,106,.18)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_25px_70px_rgba(215,180,106,.25)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <button className="w-full pt-4 text-sm text-white/35 transition hover:text-white/60">
            ¿Olvidaste tu contraseña?
          </button>

        </div>

      </section>
    </main>
  );
}