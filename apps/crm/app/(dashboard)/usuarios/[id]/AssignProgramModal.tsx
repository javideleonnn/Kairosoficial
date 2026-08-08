  "use client";

  import { useTransition } from "react";
  import { assignProgramAction } from "@/lib/users/actions";

  interface Program {
    id: string;
    name: string;
  }

  interface Props {
    open: boolean;
    onClose: () => void;
    userId: string;
    programs: Program[];
  }

  export default function AssignProgramModal({
    open,
    onClose,
    userId,
    programs,
  }: Props) {
    const [pending, startTransition] = useTransition();

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Asignar programa
            </h2>

            <button
              onClick={onClose}
              className="text-white/40 hover:text-white"
            >
              ✕
            </button>

          </div>

          <div className="mt-8 space-y-3">

            {programs.map((program) => (

              <button
                key={program.id}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await assignProgramAction(
                      userId,
                      program.id
                    );

                    onClose();
                  })
                }
                className="flex w-full items-center justify-between rounded-xl border border-white/10 p-5 transition hover:border-white/30 hover:bg-zinc-900"
              >

                <span className="font-medium">
                  {program.name}
                </span>

                <span className="text-sm text-white/40">
                  Asignar →
                </span>

              </button>

            ))}

          </div>

        </div>

      </div>
    );
  }