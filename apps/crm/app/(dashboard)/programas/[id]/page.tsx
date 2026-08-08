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
    day_number,
    route_id,
    program_id,
    title,
    routes (
      block_key
    )
  `)
  .eq("program_id", id)
  .order("route_id")
  .order("day_number");   

  console.log(days);

    return (
      <ProgramBuilder
        program={program}
        routes={routes ?? []}
        days={days ?? []}
      />
    );
  }