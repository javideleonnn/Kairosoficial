import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { fetchStudent } from "@/lib/crm/fetchStudent";

export default async function ProgramaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const student = await fetchStudent(user.email!);

  if (!student) {
    redirect("/dashboard");
  }

  redirect(`/programa/${student.currentDay}`);
}   