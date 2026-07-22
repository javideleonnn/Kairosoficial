create or replace function public.has_permission(org_id uuid, permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.organization_members om
    join public.roles r on r.id = om.role_id
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and r.permissions ? permission_key
  );
$$;

alter table public.organizations enable row level security;

create policy "members_select_own_organization" on public.organizations
  for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organizations.id
        and om.user_id = auth.uid()
        and om.status = 'active'
    )
  );

create policy "admins_update_organization" on public.organizations
  for update
  using (public.has_permission(id, 'settings:manage'));

alter table public.roles enable row level security;

create policy "roles_are_public_reference_data" on public.roles
  for select
  using (true);

alter table public.organization_members enable row level security;

create policy "members_select_self_or_team_managers" on public.organization_members
  for select
  using (
    user_id = auth.uid()
    or public.has_permission(organization_id, 'team:manage')
  );

create policy "team_managers_insert_members" on public.organization_members
  for insert
  with check (public.has_permission(organization_id, 'team:manage'));

create policy "team_managers_update_members" on public.organization_members
  for update
  using (public.has_permission(organization_id, 'team:manage'));

create policy "team_managers_delete_members" on public.organization_members
  for delete
  using (public.has_permission(organization_id, 'team:manage'));
