"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateLeadStage(
  leadId: string,
  newStageId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // El update pasa por RLS real (policy "members_update_leads", requiere
  // permiso leads:write) — si alguien sin permiso intenta esto, Postgres
  // lo rechaza sin que este código tenga que validarlo por su cuenta.
  const { error } = await supabase
    .from("leads")
    .update({ current_stage_id: newStageId })
    .eq("id", leadId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
