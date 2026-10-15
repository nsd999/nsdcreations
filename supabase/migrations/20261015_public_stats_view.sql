-- Expose only aggregate public agency metrics; never expose client rows.
create or replace view public.public_agency_stats as
select
  50::bigint + (select count(*) from public.cms_portfolio where status = 'completed') as projects_completed,
  30::bigint + (select count(*) from public.clients where status = 'active') as happy_clients;

grant select on public.public_agency_stats to anon, authenticated;
