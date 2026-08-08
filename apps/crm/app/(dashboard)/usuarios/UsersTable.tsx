"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createUserAction } from "@/lib/users/actions";

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Props {
  users: User[];
}

export default function UsersTable({ users }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [pending, startTransition] = useTransition();

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleCreateUser = () => {
    if (
      !newUser.full_name.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    ) {
      alert("Completa todos los campos.");
      return;
    }

    startTransition(async () => {
      try {
        await createUserAction(newUser);

        setNewUser({
          full_name: "",
          email: "",
          password: "",
        });

        setOpen(false);

        router.refresh();

        alert("Usuario creado correctamente.");
      } catch (error) {
        console.error(error);

        alert("No fue posible crear el usuario.");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Usuarios
          </h1>

          <p className="text-foreground/60">
            Todos los alumnos registrados en Kairos.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          + Agregar usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left">
                Nombre
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-right">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-6 py-4 font-medium">
                  {user.full_name}
                </td>

                <td className="px-6 py-4 text-foreground/70">
                  {user.email}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/usuarios/${user.id}`}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
                  >
                    Ver perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Nuevo usuario
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-white/40 transition hover:text-white"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Nombre completo
                </label>

                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  placeholder="Juan Pérez"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="juan@email.com"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Contraseña temporal
                </label>

                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateUser}
                disabled={pending}
                className="rounded-lg bg-white px-4 py-2 font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Creando..." : "Crear usuario"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}