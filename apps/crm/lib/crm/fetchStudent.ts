import { createClient } from "@/lib/supabase/server";

export interface StudentData {
  profileId: string;

  userProgramId: string | null;
  routeId: string | null;

  fullName: string | null;
  email: string | null;

  program: {
    id: string;
    name: string;
  } | null;

  currentDay: number;
  completedDays: number[];
  progress: number;
}

export async function fetchStudent(
  email: string,
): Promise<StudentData | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,full_name,email")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    throw new Error(`No existe un profile para: ${email}`);
  }

  const profileRow = profile as any;

  const { data: userProgram } = await supabase
    .from("user_programs")
    .select(`
      id,
      current_day,
      route_id,
      program:programs(
        id,
        name
      )
    `)
    .eq("user_id", profileRow.id)
    .eq("active", true)
    .maybeSingle();

  if (!userProgram) {
    return {
      profileId: profileRow.id,
      userProgramId: null,
      routeId: null,

      fullName: profile.full_name,
      email: profile.email,

      program: null,

      currentDay: 1,
      completedDays: [],
      progress: 0,
    };
  }

  const { data: progressRows } = await supabase
    .from("user_day_progress")
    .select(`
      completed,
      day:route_day_content!day_id(
        day_number
      )
    `)
    .eq("user_program_id", userProgram.id)
    .eq("completed", true);

  const completedDays =
    progressRows?.flatMap((row: any) => {
      if (!row.day) return [];
      return [row.day.day_number];
    }) ?? [];

  const { count } = await supabase
    .from("route_day_content")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("program_id", (userProgram.program as any)?.id);

  const totalDays = count ?? 21;

  return {
    profileId: profileRow.id,

    userProgramId: userProgram.id,
    routeId: userProgram.route_id,

    fullName: profile.full_name,
    email: profile.email,

    program: userProgram.program
      ? {
          id: (userProgram.program as any).id,
          name: (userProgram.program as any).name,
        }
      : null,

    currentDay: userProgram.current_day,

    completedDays,

    progress:
      totalDays === 0
        ? 0
        : Math.round(
            (completedDays.length / totalDays) * 100,
          ),
  };
}