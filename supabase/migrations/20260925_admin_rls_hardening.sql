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
