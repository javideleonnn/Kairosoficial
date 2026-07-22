"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@kairos/ui";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-foreground/10 p-8"
      >
        <div>
          <h1 className="font-serif text-xl">Kairos CRM</h1>
          <p className="mt-1 text-sm text-foreground/50">Acceso solo para el equipo.</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-foreground/70">Correo</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-foreground/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-foreground/70">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-foreground/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {error ? <p className="text-sm text-amber-400">{error}</p> : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </main>
  );
}
