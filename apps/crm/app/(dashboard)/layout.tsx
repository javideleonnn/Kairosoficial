import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { Sidebar } from "@/components/crm/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold">
          Kairos Admin
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">
            {user.email}
          </span>

          <LogoutButton />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}