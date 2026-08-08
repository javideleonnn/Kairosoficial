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
  // Evitamos que TypeScript convierta las respuestas de Supabase
  // en "never" mientras el proyecto todavía no tiene los tipos
  // generados de la base de datos.
  const supabase: any = await createClient();

  // ─────────────────────────────────────────────
  // USUARIOS
  // ─────────────────────────────────────────────

  const {
    data: profiles,
    error: profilesError,
  } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("created_at", {
      ascending: false,
    });

  if (profilesError || !profiles) {
    console.error(
      "fetchUsers profiles error:",
      profilesError,
    );

    return [];
  }

  const userIds: string[] = profiles
    .map((profile: any) => profile.id)
    .filter(Boolean);

  if (userIds.length === 0) {
    return [];
  }

  // ─────────────────────────────────────────────
  // PROGRAMAS ASIGNADOS
  // ─────────────────────────────────────────────

  const {
    data: programs,
    error: programsError,
  } = await supabase
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

  if (programsError) {
    console.error(
      "fetchUsers programs error:",
      programsError,
    );
  }

  const programMap = new Map<string, any>();

  for (const program of programs ?? []) {
    if (!program?.user_id) continue;

    programMap.set(
      String(program.user_id),
      program,
    );
  }

  const programIds: string[] = (programs ?? [])
    .map((program: any) => program?.id)
    .filter(Boolean)
    .map((id: string) => String(id));

  // ─────────────────────────────────────────────
  // DÍAS COMPLETADOS
  // ─────────────────────────────────────────────

  const completedMap = new Map<string, number>();

  if (programIds.length > 0) {
    const {
      data: progressRows,
      error: progressError,
    } = await supabase
      .from("user_day_progress")
      .select(`
        user_program_id,
        completed
      `)
      .in(
        "user_program_id",
        programIds,
      );

    if (progressError) {
      console.error(
        "fetchUsers progress error:",
        progressError,
      );
    }

    for (const row of progressRows ?? []) {
      if (!row?.completed) continue;

      const programId = String(
        row.user_program_id,
      );

      completedMap.set(
        programId,
        (completedMap.get(programId) ?? 0) + 1,
      );
    }
  }

  // ─────────────────────────────────────────────
  // RESULTADO FINAL
  // ─────────────────────────────────────────────

  return profiles.map(
    (profile: any): UserListItem => {
      const profileId = String(profile.id);

      const program =
        programMap.get(profileId) ?? null;

      const completed =
        program?.id
          ? completedMap.get(
              String(program.id),
            ) ?? 0
          : 0;

      const currentDay =
        typeof program?.current_day === "number"
          ? program.current_day
          : 1;

      const progress =
        currentDay <= 0
          ? 0
          : Math.min(
              100,
              Math.round(
                (completed / currentDay) * 100,
              ),
            );

      return {
        id: profileId,

        fullName:
          profile.full_name ?? null,

        email:
          profile.email ?? null,

        programId:
          program?.program_id
            ? String(program.program_id)
            : null,

        programName:
          program?.programs?.name ?? null,

        active:
          Boolean(program?.active),

        currentDay,

        completedDays: completed,

        progress,
      };
    },
  );
}