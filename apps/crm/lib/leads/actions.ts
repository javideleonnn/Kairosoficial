"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateLeadStage(
  leadId: string,
  newStageId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

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
