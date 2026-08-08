import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import DayEditor from "./DayEditor";

interface Props {
  params: Promise<{
    id: string;
    dayId: string;
  }>;
}

export default async function DayPage({
  params,
}: Props) {
  const { id, dayId } = await params;

  const supabase = await createClient();

  const { data: day, error } = await supabase
    .from("route_day_content")
    .select("*")
    .eq("id", dayId)
    .eq("program_id", id)
    .single();

  console.log("PROGRAM ID:", id);
  console.log("DAY ID:", dayId);
  console.log("DAY:", day);
  console.log("ERROR:", error);

  if (error || !day) {
    notFound();
  }

  return <DayEditor day={day} />;
}