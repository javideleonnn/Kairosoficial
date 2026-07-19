-- Guardado de diagnósticos completados. Ver decisión del Módulo 8:
-- respuestas y resultado se guardan como JSONB en una sola tabla, no
-- normalizados en tablas separadas (answers, session_scores,
-- diagnostic_results) como preveía el documento de arquitectura original.
-- Motivo: para el primer diagnóstico funcional, no hay ninguna consulta
-- que necesite filtrar por respuesta individual o por puntaje de bloqueo
-- a nivel SQL — eso solo se vuelve necesario cuando el CRM (Módulo 11)
-- necesite analítica agregada, momento en el que se normaliza.

create table public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null default 'es',
  source text,
  status text not null default 'completed' check (status in ('completed', 'abandoned')),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  duration_seconds integer,
  -- El array de respuestas tal como las produce apps/mapa (EngineAnswer[]).
  answers jsonb not null,
  -- El AletheiaResult completo, calculado en el servidor, nunca en el cliente.
  result jsonb not null,
  engine_version text not null,
  created_at timestamptz not null default now()
);

create index idx_diagnostic_sessions_org on public.diagnostic_sessions(organization_id);
create index idx_diagnostic_sessions_created_at on public.diagnostic_sessions(created_at desc);

alter table public.diagnostic_sessions enable row level security;

-- Solo lectura para miembros de la organización (el CRM del Módulo 11 la
-- usará). No hay policy de insert/update para el rol authenticated/anon —
-- el único escritor es el Route Handler de apps/mapa, que usa el cliente
-- de service_role (bypassa RLS a propósito, ver @kairos/database Módulo 3).
create policy "members_select_own_org_sessions" on public.diagnostic_sessions
  for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = diagnostic_sessions.organization_id
        and om.user_id = auth.uid()
        and om.status = 'active'
    )
  );
