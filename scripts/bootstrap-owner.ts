/**
 * Bootstrap de una sola vez: crea la primera organización y el primer
 * usuario `owner`. Necesario porque el signup está deshabilitado a
 * propósito (el CRM es de invitación, ver Módulo 3).
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   OWNER_EMAIL=javi@ejemplo.com OWNER_PASSWORD=... \
 *   ORG_NAME="Club Kairos" ORG_SLUG="club-kairos" \
 *   pnpm bootstrap:owner
 *
 * No es idempotente a propósito — está pensado para correr una única vez
 * por organización. Si necesitas un segundo owner, créalo desde el CRM una
 * vez que exista la gestión de equipo (Módulo 11).
 */
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

async function main() {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const ownerEmail = requireEnv("OWNER_EMAIL");
  const ownerPassword = requireEnv("OWNER_PASSWORD");
  const orgName = requireEnv("ORG_NAME");
  const orgSlug = requireEnv("ORG_SLUG");

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("1/3 — Creando usuario en auth.users...");
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
    });
if (userError) {
  if (userError.message.includes("already been registered")) {
    console.log("El usuario ya existe, continuando...");

    const { data: existingUsers, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`No se pudo obtener el usuario existente: ${listError.message}`);
    }

    const existingUser = existingUsers.users.find(
      (u) => u.email === ownerEmail
    );

    if (!existingUser) {
      throw new Error("El usuario existe pero no se pudo recuperar.");
    }

    userData.user = existingUser;
  } else {
    throw new Error(`No se pudo crear el usuario: ${userError.message}`);
  }
}

if (!userData.user) {
  throw new Error("No se pudo obtener el usuario.");
}

  console.log("2/3 — Creando organización...");
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ name: orgName, slug: orgSlug })
    .select()
    .single();
  if (orgError || !org) {
    throw new Error(`No se pudo crear la organización: ${orgError?.message}`);
  }

  console.log("3/3 — Vinculando como owner...");
  const { data: ownerRole, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("key", "owner")
    .single();
  if (roleError || !ownerRole) {
    throw new Error(`No se encontró el rol owner: ${roleError?.message}`);
  }

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: userData.user.id,
      role_id: ownerRole.id,
      status: "active",
    });
  if (memberError) {
    throw new Error(`No se pudo crear la membresía: ${memberError.message}`);
  }

  console.log(`\nListo. ${ownerEmail} puede hacer login como owner de "${orgName}".`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
