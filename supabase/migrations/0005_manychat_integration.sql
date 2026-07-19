-- Integración con ManyChat. Ver Módulo 10:
-- - manychat_subscriber_id: capturado de un query param cuando el usuario
--   llega desde un link DENTRO de una conversación de ManyChat (no se pide
--   nunca directamente al usuario).
-- - webhook_events: log de eventos entrantes de ManyChat. Todavía no existe
--   la tabla `leads` (Módulo 11) para asociarlos a un contacto — por ahora
--   se guardan crudos, y el Módulo 11 los procesa retroactivamente si hace
--   falta.

alter table public.diagnostic_sessions
  add column manychat_subscriber_id text;

create index idx_diagnostic_sessions_manychat_subscriber
  on public.diagnostic_sessions(manychat_subscriber_id)
  where manychat_subscriber_id is not null;

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  source text not null,
  payload jsonb not null,
  status text not null default 'received' check (status in ('received', 'processed', 'error')),
  created_at timestamptz not null default now()
);

create index idx_webhook_events_org on public.webhook_events(organization_id);
create index idx_webhook_events_created_at on public.webhook_events(created_at desc);

alter table public.webhook_events enable row level security;

create policy "members_select_own_org_webhook_events" on public.webhook_events
  for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = webhook_events.organization_id
        and om.user_id = auth.uid()
        and om.status = 'active'
    )
  );

-- Igual que diagnostic_sessions: el único escritor es el Route Handler del
-- webhook, vía service_role — sin policy de insert para authenticated/anon.
