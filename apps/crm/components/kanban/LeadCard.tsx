"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import type { LeadCardData } from "@/lib/leads/fetchBoard";

interface LeadCardProps {
  lead: LeadCardData;
}

export function LeadCard({ lead }: LeadCardProps): React.JSX.Element {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        // dnd-kit distingue click de drag vía activationConstraint (distance)
        // configurado en el sensor del Board — un click real sin movimiento
        // sí dispara este onClick.
        if (!isDragging) router.push(`/leads/${lead.id}`);
      }}
      className={`cursor-grab space-y-1.5 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3 text-sm active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="font-medium">{lead.fullName ?? "Sin identificar"}</p>
      {lead.instagramUsername ? (
        <p className="text-xs text-foreground/40">@{lead.instagramUsername}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {lead.resultCode ? (
          <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[10px] text-accent">
            {lead.resultCode}
          </span>
        ) : null}
        {lead.levelName ? (
          <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] text-foreground/60">
            {lead.levelName}
          </span>
        ) : null}
      </div>
    </div>
  );
}
