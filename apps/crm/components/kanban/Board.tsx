"use client";

import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { Column } from "./Column";
import { updateLeadStage } from "@/lib/leads/actions";
import type { PipelineStageWithLeads } from "@/lib/leads/fetchBoard";

interface BoardProps {
  initialStages: PipelineStageWithLeads[];
}

export function Board({ initialStages }: BoardProps): React.JSX.Element {
  const [stages, setStages] = useState(initialStages);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event: DragEndEvent) {
    const leadId = event.active.id as string;
    const newStageId = event.over?.id as string | undefined;
    if (!newStageId) return;

    const currentStage = stages.find((s) => s.leads.some((l) => l.id === leadId));
    if (!currentStage || currentStage.id === newStageId) return;

    const lead = currentStage.leads.find((l) => l.id === leadId)!;

    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === currentStage.id) {
          return { ...stage, leads: stage.leads.filter((l) => l.id !== leadId) };
        }
        if (stage.id === newStageId) {
          return { ...stage, leads: [lead, ...stage.leads] };
        }
        return stage;
      }),
    );

    void updateLeadStage(leadId, newStageId).then((result) => {
      if (!result.success) setStages(initialStages);
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6">
        {stages.map((stage) => (
          <Column key={stage.id} stage={stage} />
        ))}
      </div>
    </DndContext>
  );
}
