"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface UpdateDayContentInput {
  id: string;
  title: string;
  subtitle: string;
  intro: string;

  video_title: string;
  video_url: string;
  estimated_minutes: number;

  reflection: string;
  mission: string;
  daily_quote: string;
  journal_prompt: string;
  celebration: string;

  primary_pillar: string;
  primary_points: number;

  secondary_pillar: string;
  secondary_points: number;

  is_published: boolean;
}

export async function updateDayContent(
  input: UpdateDayContentInput
) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("route_day_content")
    .update({
      title: input.title,
      subtitle: input.subtitle,
      intro: input.intro,

      video_title: input.video_title,
      video_url: input.video_url,
      estimated_minutes: input.estimated_minutes,

      reflection: input.reflection,
      mission: input.mission,
      daily_quote: input.daily_quote,
      journal_prompt: input.journal_prompt,
      celebration: input.celebration,

      primary_pillar: input.primary_pillar,
      primary_points: input.primary_points,

      secondary_pillar: input.secondary_pillar,
      secondary_points: input.secondary_points,

      is_published: input.is_published,
    })
    .eq("id", input.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/programas");
}