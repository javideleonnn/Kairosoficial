    "use client";

import { ReactNode, useState } from "react";
import AssignProgramModal from "./AssignProgramModal";

interface Program {
  id: string;
  name: string;
}

interface Props {
  userId: string;
  availablePrograms: Program[];
  children: ReactNode;
}

export default function UserProgramsSection({
  userId,
  availablePrograms,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Programas asignados
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          + Asignar programa
        </button>
      </div>

      {children}

      <AssignProgramModal
        open={open}
        onClose={() => setOpen(false)}
        userId={userId}
        programs={availablePrograms}
      />
    </section>
  );
}    