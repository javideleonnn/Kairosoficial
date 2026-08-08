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
  const supabase: any = await createClient();

  // PROFILE
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    console.error("fetchStudent profile error:", profileError);
    return null;
  }

  if (!profileData) {
    return null;
  }

  const profile = profileData as {
    id: string;
    full_name: string | null;
    email: string | null;
  };

  // ACTIVE PROGRAM
  const { data: userProgramData, error: userProgramError } =
    await supabase
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
      .eq("user_id", profile.id)
      .eq("active", true)
      .maybeSingle();

  if (userProgramError) {
    console.error(
      "fetchStudent userProgram error:",
      userProgramError,
    );
  }

  if (!userProgramData) {
    return {
      profileId: profile.id,

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

  const userProgram = userProgramData as any;

  // COMPLETED DAYS
  const { data: progressData, error: progressError } =
    await supabase
      .from("user_day_progress")
      .select(`
        completed,
        day:route_day_content!day_id(
          day_number
        )
      `)
      .eq("user_program_id", userProgram.id)
      .eq("completed", true);

  if (progressError) {
    console.error(
      "fetchStudent progress error:",
      progressError,
    );
  }

  const completedDays: number[] =
    (progressData ?? [])
      .map((row: any) => row?.day?.day_number)
      .filter(
        (day: unknown): day is number =>
          typeof day === "number",
      );

  // TOTAL DAYS
  const programId =
    userProgram?.program?.id ?? null;

  let totalDays = 21;

  if (programId) {
    const { count, error: daysError } = await supabase
      .from("route_day_content")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("program_id", programId);

    if (!daysError && typeof count === "number") {
      totalDays = count;
    }
  }

  const progress =
    totalDays > 0
      ? Math.round(
          (completedDays.length / totalDays) * 100,
        )
      : 0;

  return {
    profileId: profile.id,

    userProgramId: userProgram.id,
    routeId: userProgram.route_id ?? null,

    fullName: profile.full_name,
    email: profile.email,

    program: userProgram.program
      ? {
          id: String(userProgram.program.id),
          name: String(userProgram.program.name),
        }
      : null,

    currentDay:
      typeof userProgram.current_day === "number"
        ? userProgram.current_day
        : 1,

    completedDays,

    progress,
  };
}