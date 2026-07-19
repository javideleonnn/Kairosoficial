-- CRM v1 (corte vertical) — Módulo 11.
-- Simplificación deliberada: `pipeline_stages` cuelga directo de
-- `organization_id` (un pipeline implícito por organización), no existe
-- todavía la tabla `pipelines` intermedia del documento de arquitectura
-- original — se agrega si algún día un negocio necesita más de un pipeline.

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  name text not null,
  order_index integer not null,
  color text not null default '#c8a96e',
  unique (organization_id, key)
);

create index idx_pipeline_stages_org on public.pipeline_stages(organization_id);

-- Cada organización nueva recibe automáticamente las 8 etapas por defecto.
-- Resuelve un problema de secuencia real: las migraciones corren antes de
-- que exista ninguna organización (se crea después, vía bootstrap-owner.ts
-- del Módulo 4) — no se puede seedear con un organization_id fijo aquí.
create or replace function public.seed_default_pipeline_stages()
returns trigger as $$
begin
  insert into public.pipeline_stages (organization_id, key, name, order_index, color) values
    (new.id, 'nuevo', 'Nuevo', 1, '#c8a96e'),
    (new.id, 'diagnostico_completado', 'Diagnóstico completado', 2, '#c8a96e'),
    (new.id, 'contactado', 'Contactado', 3, '#c8a96e'),
    (new.id, 'conversacion_activa', 'Conversación activa', 4, '#c8a96e'),
    (new.id, 'llamada_agendada', 'Llamada agendada', 5, '#c8a96e'),
    (new.id, 'cliente', 'Cliente', 6, '#3fae6a'),
    (new.id, 'seguimiento', 'Seguimiento', 7, '#c8a96e'),
    (new.id, 'perdido', 'Perdido', 8, '#8a8a8a');
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

create trigger trg_seed_default_pipeline_stages
  after insert on public.organizations
  for each row execute function public.seed_default_pipeline_stages();

-- leads -------------------------------------------------------------------

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  diagnostic_session_id uuid not null unique references public.diagnostic_sessions(id) on delete cascade,
  full_name text,
  instagram_username text,
  email text,
  manychat_subscriber_id text,
  current_stage_id uuid not null references public.pipeline_stages(id),
  assigned_advisor_id uuid references auth.users(id),
  last_interaction_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_leads_org on public.leads(organization_id);
create index idx_leads_stage on public.leads(current_stage_id);
create index idx_leads_assigned on public.leads(assigned_advisor_id);

-- Cada diagnóstico completado se convierte automáticamente en un lead, en
-- la etapa "Nuevo" de su organización — así el CRM tiene datos reales
-- desde el primer diagnóstico, sin depender de que Mapa Kairos capture
-- contacto (que hoy no hace).
create or replace function public.create_lead_from_diagnostic_session()
returns trigger as $$
declare
  v_nuevo_stage_id uuid;
begin
  select id into v_nuevo_stage_id
  from public.pipeline_stages
  where organization_id = new.organization_id and key = 'nuevo'
  limit 1;

  if v_nuevo_stage_id is null then
    -- No debería ocurrir (el trigger de organizations ya sembró las etapas),
    -- pero nunca debe romper el guardado del diagnóstico por esto.
    return new;
  end if;

  insert into public.leads (organization_id, diagnostic_session_id, manychat_subscriber_id, current_stage_id)
  values (new.organization_id, new.id, new.manychat_subscriber_id, v_nuevo_stage_id);

  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

create trigger trg_create_lead_from_diagnostic_session
  after insert on public.diagnostic_sessions
  for each row execute function public.create_lead_from_diagnostic_session();

-- RLS -----------------------------------------------------------------

alter table public.pipeline_stages enable row level security;

create policy "members_select_own_org_stages" on public.pipeline_stages
  for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = pipeline_stages.organization_id
        and om.user_id = auth.uid()
        and om.status = 'active'
    )
  );

alter table public.leads enable row level security;

create policy "members_select_leads" on public.leads
  for select
  using (
    public.has_permission(organization_id, 'leads:read:all')
    or (
      public.has_permission(organization_id, 'leads:read:assigned')
      and assigned_advisor_id = auth.uid()
    )
  );

create policy "members_update_leads" on public.leads
  for update
  using (public.has_permission(organization_id, 'leads:write'));

-- Sin policy de insert para authenticated/anon — los leads solo se crean
-- vía el trigger (que corre con privilegios de definer), nunca directo.
