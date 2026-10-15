-- Replace the SECURITY DEFINER aggregate view with a single-row, read-only stats table.
drop view if exists public.public_agency_stats;
create table if not exists public.public_agency_stats (
  id boolean primary key default true check (id = true),
  projects_completed bigint not null default 50 check (projects_completed >= 50),
  happy_clients bigint not null default 30 check (happy_clients >= 30),
  updated_at timestamptz not null default now()
);
alter table public.public_agency_stats enable row level security;
drop policy if exists public_read_agency_stats on public.public_agency_stats;
create policy public_read_agency_stats on public.public_agency_stats
  for select to anon, authenticated using (id = true);
grant select on public.public_agency_stats to anon, authenticated;
insert into public.public_agency_stats (id, projects_completed, happy_clients)
values (
  true,
  50 + (select count(*) from public.cms_portfolio where status = 'completed'),
  30 + (select count(*) from public.clients where status = 'active')
) on conflict (id) do nothing;

create or replace function public.nsd_track_completed_projects()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare delta bigint := 0;
begin
  if tg_op = 'INSERT' then
    if new.status = 'completed' then delta := 1; end if;
  elsif tg_op = 'DELETE' then
    if old.status = 'completed' then delta := -1; end if;
  else
    if old.status = 'completed' and new.status <> 'completed' then delta := -1;
    elsif old.status <> 'completed' and new.status = 'completed' then delta := 1;
    end if;
  end if;
  if delta <> 0 then
    update public.public_agency_stats
      set projects_completed = greatest(50, projects_completed + delta), updated_at = now()
      where id = true;
  end if;
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

create or replace function public.nsd_track_active_clients()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare delta bigint := 0;
begin
  if tg_op = 'INSERT' then
    if new.status = 'active' then delta := 1; end if;
  elsif tg_op = 'DELETE' then
    if old.status = 'active' then delta := -1; end if;
  else
    if old.status = 'active' and new.status <> 'active' then delta := -1;
    elsif old.status <> 'active' and new.status = 'active' then delta := 1;
    end if;
  end if;
  if delta <> 0 then
    update public.public_agency_stats
      set happy_clients = greatest(30, happy_clients + delta), updated_at = now()
      where id = true;
  end if;
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

drop trigger if exists nsd_track_completed_projects_trigger on public.cms_portfolio;
create trigger nsd_track_completed_projects_trigger
  after insert or update of status or delete on public.cms_portfolio
  for each row execute function public.nsd_track_completed_projects();
drop trigger if exists nsd_track_active_clients_trigger on public.clients;
create trigger nsd_track_active_clients_trigger
  after insert or update of status or delete on public.clients
  for each row execute function public.nsd_track_active_clients();

revoke all on function public.nsd_track_completed_projects() from public, anon, authenticated, service_role;
revoke all on function public.nsd_track_active_clients() from public, anon, authenticated, service_role;
