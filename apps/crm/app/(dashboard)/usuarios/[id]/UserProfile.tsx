"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  updateUserAction,
  sendPasswordResetAction,
  removeUserAction,
} from "@/lib/users/actions";

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface Props {
  user: User;
}

export default function UserProfile({ user }: Props) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState({
    full_name: user.full_name,
    email: user.email,
  });

  const handleSave = () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      alert("Completa todos los campos.");
      return;
    }

    startTransition(async () => {
      try {
        await updateUserAction({
          id: user.id,
          ...form,
        });

        router.refresh();

        alert("Usuario actualizado correctamente.");
      } catch (error) {
        console.error(error);
        alert("No fue posible actualizar el usuario.");
      }
    });
  };

  const handlePasswordReset = () => {
    if (
      !confirm(
        `¿Enviar un correo de recuperación a ${user.email}?`
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await sendPasswordResetAction(user.email);

        alert("Correo de recuperación enviado.");
      } catch (error) {
        console.error(error);

        alert("No fue posible enviar el correo de recuperación.");
      }
    });
  };

  const handleRemoveUser = () => {
    if (
      !confirm(
        "¿Eliminar este usuario permanentemente?"
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await removeUserAction(user.id);

        window.location.href = "/usuarios";
      } catch (error) {
        console.error(error);

        alert("No fue posible eliminar el usuario.");
      }
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Información del usuario
        </h2>

        <p className="mt-1 text-sm text-white/50">
          Edita la información básica del alumno.
        </p>
      </div>

      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Nombre completo
          </label>

          <input
            value={form.full_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                full_name: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Correo electrónico
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
          />
        </div>

      </div>

      <div className="mt-8 flex flex-wrap gap-3">

        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={handlePasswordReset}
          className="rounded-xl border border-blue-500/30 px-6 py-3 font-semibold text-blue-400 transition hover:bg-blue-500/10 disabled:opacity-50"
        >
          Restablecer contraseña
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={handleRemoveUser}
          className="rounded-xl border border-red-500/30 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          Eliminar usuario
        </button>

      </div>
    </div>
  );
}