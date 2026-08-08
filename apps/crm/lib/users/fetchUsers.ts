import { createClient } from "@/lib/supabase/server";

export interface UserListItem {
  id: string;
  fullName: string | null;
  email: string | null;

  programId: string | null;
  programName: string | null;

  active: boolean;

  currentDay: number;

  completedDays: number;

  progress: number;
}

export async function fetchUsers(): Promise<UserListItem[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("created_at", { ascending: false });

  if (error || !profiles) return [];

  const userIds = profiles.map((p) => p.id);

  const { data: programs } = await supabase
    .from("user_programs")
    .select(`
      id,
      user_id,
      program_id,
      active,
      current_day,
      programs (
        id,
        name
      )
    `)
    .in("user_id", userIds);

  const programMap = new Map(
    (programs ?? []).map((p: any) => [p.user_id, p])
  );

  const programIds = (programs ?? []).map((p: any) => p.id);

  const { data: progressRows } = await supabase
    .from("user_day_progress")
    .select(`
      user_program_id,
      completed
    `)
    .in("user_program_id", programIds);

  const completedMap = new Map<string, number>();

  for (const row of progressRows ?? []) {
    if (!row.completed) continue;

    completedMap.set(
      row.user_program_id,
      (completedMap.get(row.user_program_id) ?? 0) + 1
    );
  }

  return profiles.map((profile) => {
    const program: any = programMap.get(profile.id);

    const completed = completedMap.get(program?.id) ?? 0;

    const currentDay = program?.current_day ?? 1;

    const progress =
      currentDay <= 0
        ? 0
        : Math.min(
            100,
            Math.round((completed / currentDay) * 100)
          );

    return {
      id: profile.id,

      fullName: profile.full_name,

      email: profile.email,

      programId: program?.program_id ?? null,

      programName: program?.programs?.name ?? null,

      active: program?.active ?? false,

      currentDay,

      completedDays: completed,

      progress,
    };
  });
}