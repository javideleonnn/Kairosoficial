create table public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  locale text not null default 'es',
  source text,
  status text not null default 'completed' check (status in ('completed', 'abandoned')),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  duration_seconds integer,
  answers jsonb not null,
  result jsonb not null,
  engine_version text not null,
  created_at timestamptz not null default now()
);

create index idx_diagnostic_sessions_org on public.diagnostic_sessions(organization_id);
create index idx_diagnostic_sessions_created_at on public.diagnostic_sessions(created_at desc);

alter table public.diagnostic_sessions enable row level security;

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
