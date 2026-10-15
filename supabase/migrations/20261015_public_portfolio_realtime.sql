-- Public Realtime listeners may only observe portfolio records that are safe to display.
grant select on table public.cms_portfolio to anon, authenticated;
drop policy if exists public_read_published_portfolio on public.cms_portfolio;
create policy public_read_published_portfolio
  on public.cms_portfolio
  for select
  to anon, authenticated
  using (status in ('published','completed'));
