"use server";

import { revalidatePath } from "next/cache";
import * as service from "./service";

export async function createUserAction(data: {
  full_name: string;
  email: string;
  password: string;
}) {
  await service.createUser(data);

  revalidatePath("/usuarios");
}

export async function updateUserAction(data: {
  id: string;
  full_name: string;
  email: string;
}) {
  await service.updateUser(data);

  revalidatePath(`/usuarios/${data.id}`);
}

export async function changeRouteAction(
  userId: string,
  userProgramId: string,
  routeId: string
) {
  await service.changeRoute(
    userProgramId,
    routeId
  );

  revalidatePath(`/usuarios/${userId}`);
}

export async function assignProgramAction(
  userId: string,
  programId: string
) {
  await service.assignProgram(
    userId,
    programId
  );

  revalidatePath(`/usuarios/${userId}`);
}

export async function restartProgramAction(
  userId: string,
  userProgramId: string
) {
  await service.restartProgram(
    userProgramId
  );

  revalidatePath(`/usuarios/${userId}`);
}

export async function activateProgramAction(
  userId: string,
  userProgramId: string
) {
  await service.activateProgram(
    userId,
    userProgramId
  );

  revalidatePath(`/usuarios/${userId}`);
}

export async function removeProgramAction(
  userId: string,
  userProgramId: string
) {
  await service.removeProgram(
    userProgramId
  );

  revalidatePath(`/usuarios/${userId}`);
}
export async function removeUserAction(
  userId: string
) {
  await service.removeUser(userId);

  revalidatePath("/usuarios");
}
export async function sendPasswordResetAction(
  email: string
) {
  await service.sendPasswordReset(email);
}