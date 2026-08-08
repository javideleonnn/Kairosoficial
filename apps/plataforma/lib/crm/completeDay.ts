"use server";

import { createClient } from "@/lib/supabase/server";

export async function completeDay(
  userProgramId: string,
  dayId: string,
) {
  const supabase = await createClient();

  const { data: progress, error } = await supabase
    .from("user_day_progress")
    .select("id, completed")
    .eq("user_program_id", userProgramId)
    .eq("day_id", dayId)
    .single();

  if (error) {
    throw error;
  }

  if (!progress.completed) {
    const { error: updateProgressError } = await supabase
      .from("user_day_progress")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", progress.id);

    if (updateProgressError) {
      throw updateProgressError;
    }
  }

  const { data: userProgram, error: programError } = await supabase
    .from("user_programs")
    .select("current_day")
    .eq("id", userProgramId)
    .single();

  if (programError) {
    throw programError;
  }

  const { error: updateProgramError } = await supabase
    .from("user_programs")
    .update({
      current_day: userProgram.current_day + 1,
    })
    .eq("id", userProgramId);

  if (updateProgramError) {
    throw updateProgramError;
  }
}