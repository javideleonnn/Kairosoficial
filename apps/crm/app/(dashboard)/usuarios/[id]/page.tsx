  import { notFound } from "next/navigation";
  import { createClient } from "@/lib/supabase/server";

  import UserProfile from "./UserProfile";
  import ProgramCard from "./ProgramCard";
  import Timeline from "./Timeline";
  import ActivityCard from "./ActivityCard";
  import UserProgramsSection from "./UserProgramsSection";

  interface PageProps {
    params: Promise<{
      id: string;
    }>;
  }

  export default async function UserPage({
    params,
  }: PageProps): Promise<React.JSX.Element> {
    const { id } = await params;

    const supabase = await createClient();

    const { data: user } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        created_at
      `)
      .eq("id", id)
      .single();

    if (!user) notFound();
const { data: programs } = await supabase
  .from("programs")
  .select(`
    id,
    name
  `)
  .order("name");
const { data: routes } = await supabase
  .from("routes")
  .select(`
    id,
    title,
    block_key
  `)
  .order("title");

const { data: assignedPrograms } = await supabase
  .from("user_programs")
  .select(`
    id,
    active,
    current_day,
    program_id,
    route_id,
    created_at,
    programs(
      id,
      name
    ),
    routes(
      id,
      title,
      block_key
    )
  `)
  .eq("user_id", id);

    const userPrograms = await Promise.all(
      (assignedPrograms ?? []).map(async (program: any) => {
        const { count: completedDays } = await supabase
          .from("user_day_progress")
          .select("*", {
            head: true,
            count: "exact",
          })
          .eq("user_program_id", program.id)
          .eq("completed", true);

        const { count: totalDays } = await supabase
  .from("route_day_content")
  .select("*", {
    head: true,
    count: "exact",
  })
  .eq("route_id", program.route_id);

        return {
          ...program,
          completed_days: completedDays ?? 0,
          total_days: totalDays ?? 0,
          progress_percentage:
            (totalDays ?? 0) === 0
              ? 0
              : Math.round(
                  ((completedDays ?? 0) /
                    (totalDays ?? 1)) *
                    100
                ),
        };
      })
    );

    const activeProgram =
      userPrograms.find((p: any) => p.active) ??
      userPrograms[0];

const { data: timeline } = activeProgram
  ? await supabase
      .from("user_day_progress")
      .select(`
        id,
        day_id,
        completed,
        completed_at
      `)
      .eq("user_program_id", activeProgram.id)
      .order("day_id")
  : { data: [] };
    const completed =
      activeProgram?.completed_days ?? 0;

    const total =
      activeProgram?.total_days ?? 0;

    const pending = Math.max(total - completed, 0);

    return (
      <div className="mx-auto max-w-7xl space-y-10 p-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">

          <UserProfile user={user} />

          <div
            className={`flex h-fit items-center rounded-full px-5 py-2 text-sm font-semibold ${
              activeProgram?.active
                ? "bg-green-500/20 text-green-400"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {activeProgram?.active
              ? "Programa activo"
              : "Sin programa"}
          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-4">

          <ActivityCard
            title="Programa"
            value={activeProgram?.programs?.name ?? "-"}
          />

          <ActivityCard
            title="Día actual"
            value={activeProgram?.current_day ?? 0}
          />

          <ActivityCard
            title="Progreso"
            value={`${
              activeProgram?.progress_percentage ?? 0
            }%`}
            subtitle={`${completed} de ${total} días`}
          />

          <ActivityCard
            title="Pendientes"
            value={pending}
            subtitle="Días restantes"
          />

        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">

          <div className="mb-4 flex justify-between">

            <span className="text-sm text-white/50">
              Avance del programa
            </span>

            <span className="font-semibold">
              {activeProgram?.progress_percentage ??
                0}
              %
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${
                  activeProgram?.progress_percentage ??
                  0
                }%`,
              }}
            />

          </div>

        </div>

        <Timeline days={timeline ?? []} />

        <UserProgramsSection
          userId={user.id}
          availablePrograms={programs ?? []}
        >
          {userPrograms.map((program: any) => (
<ProgramCard
  key={program.id}
  userId={user.id}
  program={program}
routes={routes ?? []} 
  currentRouteId={program.route_id}
/>
          ))}
        </UserProgramsSection>

      </div>
    );
  }