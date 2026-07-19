-- Corrección del Módulo 12: el trigger que crea el lead solo se dispara
-- cuando el diagnóstico YA se completó (diagnostic_sessions solo guarda
-- sesiones completas, ver Módulo 8) — por lo tanto el lead debe nacer en
-- "Diagnóstico completado", no en "Nuevo". "Nuevo" queda reservado para
-- un futuro donde se capturen leads antes de terminar el diagnóstico
-- (ej. abandono a medio camino — ver pendiente del Módulo 8/12).

create or replace function public.create_lead_from_diagnostic_session()
returns trigger as $$
declare
  v_stage_id uuid;
begin
  select id into v_stage_id
  from public.pipeline_stages
  where organization_id = new.organization_id and key = 'diagnostico_completado'
  limit 1;

  if v_stage_id is null then
    return new;
  end if;

  insert into public.leads (organization_id, diagnostic_session_id, manychat_subscriber_id, current_stage_id)
  values (new.organization_id, new.id, new.manychat_subscriber_id, v_stage_id);

  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;
