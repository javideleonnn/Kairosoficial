import * as repository from "./repository";

export async function createUser(data: {
  full_name: string;
  email: string;
  password: string;
}) {
  return await repository.createUser(data);
}

export async function updateUser(data: {
  id: string;
  full_name: string;
  email: string;
}) {
  return await repository.updateUser(data);
}

export async function changeRoute(
  userProgramId: string,
  routeId: string
) {
  await repository.changeRoute(
    userProgramId,
    routeId
  );
}

export async function assignProgram(
  userId: string,
  programId: string
) {
  const programs =
    await repository.getUserPrograms(userId);

  const existing = programs.find(
    (program) => program.program_id === programId
  );

  await repository.deactivatePrograms(userId);

  if (existing) {
    await repository.activateProgram(existing.id);

    return existing;
  }

  const userProgram =
    await repository.createUserProgram({
      user_id: userId,
      program_id: programId,
      active: true,
      current_day: 1,
    });

  const days =
    await repository.getProgramDays(programId);

  const progress = days.map((day) => ({
    user_program_id: userProgram.id,
    day_id: day.id,
    completed: false,
    completed_at: null,
    minutes_watched: 0,
  }));

  if (progress.length > 0) {
    await repository.insertProgress(progress);
  }

  return userProgram;
}

export async function restartProgram(
  userProgramId: string
) {
  await repository.restartProgram(userProgramId);
}

export async function activateProgram(
  userId: string,
  userProgramId: string
) {
  await repository.deactivatePrograms(userId);

  await repository.activateProgram(
    userProgramId
  );
}

export async function removeProgram(
  userProgramId: string
) {
  await repository.removeProgram(
    userProgramId
  );
}

export async function getDashboard(
  userId: string
) {
  const user =
    await repository.getUser(userId);

  const programs =
    await repository.getUserPrograms(userId);

  return {
    user,
    programs,
  };
}
export async function removeUser(userId: string) {
  await repository.removeUser(userId);
} 
export async function removeUserAction(
  userId: string
) {
  await service.removeUser(userId);

  revalidatePath("/usuarios");
}
export async function sendPasswordReset(
  email: string
) {
  await repository.sendPasswordReset(email);
}