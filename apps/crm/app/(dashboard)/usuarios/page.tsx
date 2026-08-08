import { createClient } from "@/lib/supabase/server";
import UsersTable from "./UsersTable";

export default async function UsuariosPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email
    `)
    .order("full_name");

  return (
    <div className="space-y-8">
      <UsersTable users={users ?? []} />
    </div>
  );
}