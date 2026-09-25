-- Admin-only policy removal. Server-side service-role access is the only admin path.
drop policy if exists "Allow admin operations" on public.testimonials;
drop policy if exists "Allow admin operations for contact submissions" on public.contact_submissions;

alter table if exists public.testimonials add column if not exists featured boolean not null default false;

do $$
begin
  if to_regclass('public.push_subscriptions') is not null then
    delete from public.push_subscriptions a
    using public.push_subscriptions b
    where a.ctid < b.ctid
      and a.endpoint = b.endpoint;

    begin
      create unique index push_subscriptions_endpoint_uidx
        on public.push_subscriptions(endpoint);
    exception when duplicate_table then null;
    end;
  end if;
end $$;

-- Prevent normal admin-side database clients from modifying historical payment records accidentally.
create or replace function public.prevent_booking_payment_mutation()
returns trigger
language plpgsql
as $$
begin
  if current_user <> 'service_role' then
    raise exception 'Payment ledger is server managed';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists booking_payments_mutation_guard on public.booking_payments;
create trigger booking_payments_mutation_guard
before update or delete on public.booking_payments
for each row execute function public.prevent_booking_payment_mutation();


alter table if exists public.service_quotes add column if not exists access_token_hash text unique;


create table if not exists public.rate_limit_buckets (
  key_hash text primary key,
  window_start timestamptz not null,
  hits integer not null default 1,
  updated_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.rate_limit_buckets enable row level security;
create index if not exists rate_limit_buckets_updated_idx on public.rate_limit_buckets(updated_at);

create or replace function public.consume_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.rate_limit_buckets;
  now_ts timestamptz := timezone('utc'::text, now());
begin
  if p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  select *
  into current_row
  from public.rate_limit_buckets
  where key_hash = p_key_hash
  for update;

  if not found then
    insert into public.rate_limit_buckets(key_hash, window_start, hits, updated_at)
    values (p_key_hash, now_ts, 1, now_ts);
    return true;
  end if;

  if now_ts >= current_row.window_start + make_interval(secs => p_window_seconds) then
    update public.rate_limit_buckets
    set window_start = now_ts, hits = 1, updated_at = now_ts
    where key_hash = p_key_hash;
    return true;
  end if;

  if current_row.hits >= p_limit then
    update public.rate_limit_buckets
    set updated_at = now_ts
    where key_hash = p_key_hash;
    return false;
  end if;

  update public.rate_limit_buckets
  set hits = hits + 1, updated_at = now_ts
  where key_hash = p_key_hash;

  return true;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;


alter table if exists public.cms_tips add column if not exists scheduled_for timestamptz;
alter table if exists public.notification_campaigns add column if not exists status text not null default 'sent';
alter table if exists public.notification_campaigns add column if not exists recipient_ids jsonb not null default '[]'::jsonb;

do $$
begin
  if to_regclass('public.notification_campaigns') is not null then
    alter table public.notification_campaigns drop constraint if exists notification_campaigns_status_check;
    alter table public.notification_campaigns add constraint notification_campaigns_status_check
      check (status in ('scheduled','sent','failed'));
  end if;
exception when duplicate_object then null;
end $$;
