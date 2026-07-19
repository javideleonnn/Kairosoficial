"use client";

import { useRouter } from "next/navigation";
import { Button } from "@kairos/ui";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton(): React.JSX.Element {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className="!px-2 !py-1">
      Cerrar sesión
    </Button>
  );
}
