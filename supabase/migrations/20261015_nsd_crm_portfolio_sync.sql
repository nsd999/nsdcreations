-- NSD Creations CRM and portfolio CMS extension.
-- Additive migration: preserves existing submissions and CMS portfolio rows.
create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text,
  phone text,
  email text,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  services_purchased text[] not null default '{}',
  notes text,
  converted_from_lead_id uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.clients enable row level security;
create index if not exists clients_full_name_idx on public.clients (lower(full_name));
create index if not exists clients_business_name_idx on public.clients (lower(business_name));
create index if not exists clients_email_idx on public.clients (lower(email));

alter table public.contact_submissions add column if not exists business_name text;
alter table public.contact_submissions add column if not exists lead_source text;
alter table public.contact_submissions add column if not exists estimated_budget_inr numeric(12,2);
alter table public.contact_submissions add column if not exists follow_up_at timestamptz;
alter table public.contact_submissions add column if not exists assigned_to text;
alter table public.contact_submissions add column if not exists converted_client_id uuid;
alter table public.contact_submissions add column if not exists converted_at timestamptz;
alter table public.contact_submissions add column if not exists archived_at timestamptz;
alter table public.contact_submissions add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'contact_submissions_converted_client_id_fkey'
      and conrelid = 'public.contact_submissions'::regclass
  ) then
    alter table public.contact_submissions
      add constraint contact_submissions_converted_client_id_fkey
      foreign key (converted_client_id) references public.clients(id) on delete set null;
  end if;
end $$;

alter table public.clients
  drop constraint if exists clients_converted_from_lead_id_fkey;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'clients_converted_from_lead_id_fkey'
      and conrelid = 'public.clients'::regclass
  ) then
    alter table public.clients
      add constraint clients_converted_from_lead_id_fkey
      foreign key (converted_from_lead_id) references public.contact_submissions(id) on delete set null;
  end if;
end $$;

create index if not exists contact_submissions_status_created_idx
  on public.contact_submissions (status, created_at desc);
create index if not exists contact_submissions_follow_up_idx
  on public.contact_submissions (follow_up_at)
  where follow_up_at is not null;
create index if not exists contact_submissions_converted_client_idx
  on public.contact_submissions (converted_client_id)
  where converted_client_id is not null;

alter table public.cms_portfolio add column if not exists slug text;
alter table public.cms_portfolio add column if not exists client_id uuid references public.clients(id) on delete set null;
alter table public.cms_portfolio add column if not exists cover_image_url text;
alter table public.cms_portfolio add column if not exists additional_images jsonb not null default '[]'::jsonb;
alter table public.cms_portfolio add column if not exists live_url text;
alter table public.cms_portfolio add column if not exists completed_at timestamptz;

-- Backfill stable slugs for existing CMS items before adding uniqueness.
update public.cms_portfolio
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')) || '-' || left(id::text, 8)
where slug is null or btrim(slug) = '';

create unique index if not exists cms_portfolio_slug_unique_idx on public.cms_portfolio (slug);
create index if not exists cms_portfolio_status_order_idx
  on public.cms_portfolio (status, display_order, created_at desc);
create index if not exists cms_portfolio_client_idx on public.cms_portfolio (client_id);

-- Database-side slug generation means clients do not need to supply identifiers.
create or replace function public.nsd_portfolio_slugify()
returns trigger
language plpgsql
as $$
declare
  base_slug text;
begin
  if new.slug is null or btrim(new.slug) = '' then
    base_slug := trim(both '-' from regexp_replace(lower(coalesce(new.title, 'project')), '[^a-z0-9]+', '-', 'g'));
    if base_slug = '' then base_slug := 'project'; end if;
    new.slug := base_slug || '-' || left(gen_random_uuid()::text, 8);
  end if;
  return new;
end;
$$;

drop trigger if exists nsd_portfolio_slugify_trigger on public.cms_portfolio;
create trigger nsd_portfolio_slugify_trigger
before insert on public.cms_portfolio
for each row execute function public.nsd_portfolio_slugify();

-- Realtime is enabled idempotently when the existing Supabase publication exists.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.contact_submissions;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.clients;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.cms_portfolio;
    exception when duplicate_object then null;
    end;
  end if;
end $$;

-- Extend legacy status checks without invalidating existing rows.
alter table public.contact_submissions drop constraint if exists contact_submissions_status_check;
alter table public.contact_submissions add constraint contact_submissions_status_check
  check (status in ('unread','read','new','contacted','qualified','proposal_sent','negotiation','won','converted','lost','archived'));

alter table public.cms_portfolio drop constraint if exists cms_portfolio_status_check;
alter table public.cms_portfolio add constraint cms_portfolio_status_check
  check (status in ('draft','published','archived','completed'));
