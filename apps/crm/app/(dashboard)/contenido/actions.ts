"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export async function updateRoute(formData: FormData) {
  const supabase: any = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const focus_description = formData.get("focus_description") as string;

  const { error } = await supabase
    .from("routes")
    .update({
      title,
      focus_description,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/contenido");
  revalidatePath(`/contenido/${id}`);

  redirect(`/contenido/${id}`);
}