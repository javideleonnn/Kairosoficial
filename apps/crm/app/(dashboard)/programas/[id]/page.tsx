
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import ProgramBuilder from "./ProgramBuilder";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProgramPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: program } = await supabase
    .from("programs")
    .select(`
      id,
      name,
      slug,
      description,
      active
    `)
    .eq("id", id)
    .single();

  if (!program) notFound();

  const { data: routes } = await supabase
    .from("routes")
    .select(`
      id,
      block_key,
      title,
      focus_description
    `)
    .order("block_key");

  const { data: days, error } = await supabase
    .from("route_day_content")
    .select(`
      id,
      route_id,
      program_id,
      day_number,
      video_title,
      video_url,
      estimated_minutes,
      reflection,
      mission,
      daily_quote,
      primary_pillar,
      primary_points,
      secondary_pillar,
      secondary_points,
      title,
      subtitle,
      intro,
      journal_prompt,
      celebration,
      sort_order,
      is_published
    `)
    .eq("program_id", id)
    .order("route_id")
    .order("day_number");

  if (error) {
    console.error("Error cargando los días del programa:", error);
  }

  return (
    <ProgramBuilder
      program={program}
      routes={routes ?? []}
      days={days ?? []}
    />
  );
}

  }
