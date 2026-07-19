import { Board } from "@/components/kanban/Board";
import { fetchPipelineBoard } from "@/lib/leads/fetchBoard";

export default async function DashboardHome(): Promise<React.JSX.Element> {
  const stages = await fetchPipelineBoard();

  if (stages.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
        <p className="text-sm text-foreground/50">
          Todavía no hay leads — aparecerán aquí en cuanto se complete el
          primer diagnóstico en Mapa Kairos.
        </p>
      </div>
    );
  }

  return <Board initialStages={stages} />;
}
