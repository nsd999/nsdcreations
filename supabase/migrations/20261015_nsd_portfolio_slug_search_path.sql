-- Keep trigger function resolution deterministic and prevent caller-controlled search_path shadowing.
alter function public.nsd_portfolio_slugify() set search_path = pg_catalog, public, pg_temp;
