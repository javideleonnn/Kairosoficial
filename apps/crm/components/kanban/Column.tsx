"use client";

import { useDroppable } from "@dnd-kit/core";
import { LeadCard } from "./LeadCard";
import type { PipelineStageWithLeads } from "@/lib/leads/fetchBoard";

interface ColumnProps {
  stage: PipelineStageWithLeads;
}

export function Column({ stage }: ColumnProps): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-2xl border p-3 transition-colors duration-150 ${
        isOver ? "border-accent/60 bg-accent/5" : "border-foreground/10"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-medium text-foreground/70">{stage.name}</span>
        <span className="text-xs text-foreground/30">{stage.leads.length}</span>
      </div>
      <div className="min-h-[60px] space-y-2">
        {stage.leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
