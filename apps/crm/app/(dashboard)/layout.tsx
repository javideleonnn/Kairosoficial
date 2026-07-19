import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defensa en profundidad: el middleware ya protege esta ruta, pero un
  // Server Component nunca debe asumir que el request llegó validado.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <span className="font-serif text-sm font-medium">Kairos CRM</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground/50">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
