-- Capa de tenancy — ver Kairos CRM, Arquitectura Técnica Parte 2, sección 2.
-- Todo lo que se construya en módulos futuros (leads, productos, sesiones)
-- cuelga de organization_id y respeta el mismo patrón de aislamiento.

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  default_locale text not null default 'es',
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'agency')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Utilidad genérica reutilizable por cualquier tabla futura con updated_at.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('owner', 'admin', 'advisor', 'viewer')),
  permissions jsonb not null default '[]'::jsonb
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  status text not null default 'invited' check (status in ('active', 'invited', 'suspended')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index idx_organization_members_org on public.organization_members(organization_id);
create index idx_organization_members_user on public.organization_members(user_id);

-- Roles por defecto de la plataforma (ver Arquitectura Técnica, Parte 3, sección 5).
insert into public.roles (key, permissions) values
  ('owner',   '["leads:read:all","leads:write","leads:assign","pipeline:manage","team:manage","settings:manage"]'),
  ('admin',   '["leads:read:all","leads:write","leads:assign","pipeline:manage","team:manage","settings:manage"]'),
  ('advisor', '["leads:read:assigned","leads:write"]'),
  ('viewer',  '["leads:read:assigned"]');
