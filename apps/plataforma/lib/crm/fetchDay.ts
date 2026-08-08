import { createClient } from "@/lib/supabase/server";

export interface DayContent {
  id: string;
  program_id: string;
  route_id: string;

  day_number: number;

  title: string | null;
  subtitle: string | null;
  intro: string | null;

  video_title: string | null;
  video_url: string | null;

  reflection: string | null;
  journal_prompt: string | null;
  mission: string | null;
  celebration: string | null;

  daily_quote: string | null;

  primary_pillar: string | null;
  secondary_pillar: string | null;
}

export async function fetchDay(
  programId: string,
  routeId: string,
  dayNumber: number,
): Promise<DayContent | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("route_day_content")
    .select("*")
    .eq("program_id", programId)
    .eq("route_id", routeId)
    .eq("day_number", dayNumber)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data as DayContent;
}