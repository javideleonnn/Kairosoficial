  import { createClient } from "@/lib/supabase/server";
  import { supabaseAdmin } from "@/lib/supabase/admin";

  export async function getUser(userId: string) {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  }

  export async function getProgram(programId: string) {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", programId)
      .single();

    if (error) throw error;

    return data;
  }

  export async function getUserPrograms(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_programs")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return data ?? [];
  }

  export async function getUserProgram(userProgramId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_programs")
      .select("*")
      .eq("id", userProgramId)
      .single();

    if (error) throw error;

    return data;
  }

  export async function getProgramDays(programId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("route_day_content")
      .select("*")
      .eq("program_id", programId)
      .order("day_number");

    if (error) throw error;

    return data ?? [];
  }

  export async function getRouteDays(routeId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("route_day_content")
    .select("*")
    .eq("route_id", routeId)
    .order("day_number");

  if (error) throw error;

  return data ?? [];
}

  export async function getProgress(userProgramId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_day_progress")
      .select("*")
      .eq("user_program_id", userProgramId);

    if (error) throw error;

    return data ?? [];
  }

  export async function deactivatePrograms(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("user_programs")
      .update({
        active: false,
      })
      .eq("user_id", userId);

    if (error) throw error;
  }

  export async function createUserProgram(data: {
    user_id: string;
    program_id: string;
    active: boolean;
    current_day: number;
  }) {
    const supabase = await createClient();

    const { data: created, error } = await supabase
      .from("user_programs")
      .insert({
        ...data,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return created;
  }

  export async function insertProgress(records: any[]) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("user_day_progress")
      .insert(records);

    if (error) throw error;
  }

  export async function activateProgram(userProgramId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("user_programs")
      .update({
        active: true,
      })
      .eq("id", userProgramId);

    if (error) throw error;
  }

  export async function restartProgram(userProgramId: string) {
    const supabase = await createClient();

    const { error: programError } = await supabase
      .from("user_programs")
      .update({
        current_day: 1,
        completed_at: null,
        started_at: new Date().toISOString(),
      })
      .eq("id", userProgramId);

   if (programError) {
  console.log(programError);
  throw programError;
}

    const { error: progressError } = await supabase
      .from("user_day_progress")
      .update({
        completed: false,
        completed_at: null,
        minutes_watched: 0,
      })
      .eq("user_program_id", userProgramId);

    if (progressError) throw progressError;
  }

export async function changeRoute(
  userProgramId: string,
  routeId: string
) {
  const supabase = supabaseAdmin;

  const { error: programError } = await supabase
    .from("user_programs")
    .update({
      route_id: routeId,
      current_day: 1,
      completed_at: null,
      started_at: new Date().toISOString(),
    })
    .eq("id", userProgramId);

  if (programError) throw programError;

  const { error: deleteError } = await supabase
    .from("user_day_progress")
    .delete()
    .eq("user_program_id", userProgramId);

  if (deleteError) throw deleteError;

  const { data: days, error: daysError } = await supabase
    .from("route_day_content")
    .select("id")
    .eq("route_id", routeId)
    .order("day_number");

  if (daysError) throw daysError;

  if (days && days.length > 0) {
    const progress = days.map((day) => ({
      user_program_id: userProgramId,
      day_id: day.id,
      completed: false,
      completed_at: null,
      minutes_watched: 0,
    }));

    const { error: insertError } = await supabase
      .from("user_day_progress")
      .insert(progress);

    if (insertError) throw insertError;
  }
}

  export async function removeProgram(userProgramId: string) {
    const supabase = await createClient();

    await supabase
      .from("user_day_progress")
      .delete()
      .eq("user_program_id", userProgramId);

    const { error } = await supabase
      .from("user_programs")
      .delete()
      .eq("id", userProgramId);

    if (error) throw error;
  }

  export async function createUser(data: {
    full_name: string;
    email: string;
    password: string;
  }) {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
        },
      });

    if (authError) throw authError;

    const supabase = await createClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        full_name: data.full_name,
        email: data.email,
      });

    if (profileError) throw profileError;

    return authData.user;
  }

  export async function updateUser(data: {
    id: string;
    full_name: string;
    email: string;
  }) {
    const { error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(
        data.id,
        {
          email: data.email,
          user_metadata: {
            full_name: data.full_name,
          },
        }
      );

    if (authError) throw authError;

    const supabase = await createClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        email: data.email,
      })
      .eq("id", data.id);

    if (profileError) throw profileError;
  }
  export async function removeUser(userId: string) {
  // usando el admin para evitar problemas de permisos
  await supabaseAdmin
    .from("user_day_progress")
    .delete()
    .in(
      "user_program_id",
      (
        await supabaseAdmin
          .from("user_programs")
          .select("id")
          .eq("user_id", userId)
      ).data?.map((p) => p.id) ?? []
    );

  await supabaseAdmin
    .from("user_programs")
    .delete()
    .eq("user_id", userId);

  await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  const { error } =
    await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

  if (error) throw error;
}       
export async function sendPasswordReset(
  email: string
) {
  const { error } =
    await supabaseAdmin.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "http://localhost:3000/reset-password",
      }
    );

  if (error) throw error;
}