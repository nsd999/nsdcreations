create extension if not exists pgcrypto;

create table if not exists public.admin_credentials (
  id text primary key default 'primary',
  username text,
  password_hash text not null,
  password_changed_at timestamptz,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint admin_credentials_singleton check (id = 'primary')
);
alter table public.admin_credentials enable row level security;

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.admin_credentials(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default timezone('utc'::text, now()),
  last_seen_at timestamptz not null default timezone('utc'::text, now()),
  last_authenticated_at timestamptz not null default timezone('utc'::text, now()),
  expires_at timestamptz not null,
  ip_hash text,
  user_agent text
);
alter table public.admin_sessions enable row level security;
create index if not exists admin_sessions_expires_idx on public.admin_sessions(expires_at);

create table if not exists public.admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  identifier_hash text not null,
  ip_hash text,
  succeeded boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.admin_login_attempts enable row level security;
create index if not exists admin_login_attempts_created_idx on public.admin_login_attempts(created_at);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  target text,
  summary text not null,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.audit_logs enable row level security;
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

create table if not exists public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  business_name text,
  service_id text not null,
  service_name_snapshot text not null,
  package_id text not null,
  package_name_snapshot text not null,
  selected_options jsonb not null default '{}'::jsonb,
  pricing_snapshot jsonb not null default '{}'::jsonb,
  total_amount_paise bigint not null check (total_amount_paise >= 0),
  advance_percentage numeric(7,3) not null check (advance_percentage >= 0 and advance_percentage <= 100),
  advance_amount_paise bigint not null check (advance_amount_paise >= 0),
  balance_amount_paise bigint not null check (balance_amount_paise >= 0),
  currency text not null default 'INR',
  booking_status text not null default 'AWAITING_PAYMENT'
    check (booking_status in ('AWAITING_PAYMENT','CONFIRMED','IN_PROGRESS','ON_HOLD','COMPLETED','CANCELLED','PAYMENT_FAILED','REFUNDED','EXPIRED')),
  payment_status text not null default 'PENDING'
    check (payment_status in ('PENDING','AUTHORIZED','CAPTURED','FAILED','REFUNDED','PARTIALLY_REFUNDED','MANUAL')),
  razorpay_order_id text unique,
  access_token_hash text unique,
  access_token_expires_at timestamptz,
  razorpay_payment_id text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  confirmed_at timestamptz,
  paid_at timestamptz,
  notes text,
  constraint booking_amounts_reconcile check (total_amount_paise = advance_amount_paise + balance_amount_paise),
  constraint booking_advance_not_over_total check (advance_amount_paise <= total_amount_paise)
);
alter table public.service_bookings enable row level security;
create index if not exists service_bookings_created_idx on public.service_bookings(created_at desc);
create index if not exists service_bookings_customer_email_idx on public.service_bookings(customer_email);

create table if not exists public.booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.service_bookings(id) on delete restrict,
  source text not null default 'razorpay' check (source in ('razorpay','manual')),
  razorpay_order_id text,
  razorpay_payment_id text unique,
  amount_paise bigint not null check (amount_paise > 0),
  currency text not null default 'INR',
  status text not null default 'pending'
    check (status in ('pending','verified','failed','refunded','partially_refunded')),
  method text,
  fee_paise bigint,
  tax_paise bigint,
  reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  paid_at timestamptz
);
alter table public.booking_payments enable row level security;
create index if not exists booking_payments_booking_idx on public.booking_payments(booking_id);
create index if not exists booking_payments_order_idx on public.booking_payments(razorpay_order_id);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.payment_events enable row level security;

create table if not exists public.service_quotes (
  id uuid primary key default gen_random_uuid(),
  quote_reference text not null unique,
  lead_id uuid,
  booking_id uuid references public.service_bookings(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  service_id text not null,
  scope text not null,
  line_items jsonb not null default '[]'::jsonb,
  subtotal_paise bigint not null default 0 check (subtotal_paise >= 0),
  discount_paise bigint not null default 0 check (discount_paise >= 0),
  tax_paise bigint not null default 0 check (tax_paise >= 0),
  total_paise bigint not null default 0 check (total_paise >= 0),
  advance_percentage numeric(7,3) not null default 50 check (advance_percentage >= 0 and advance_percentage <= 100),
  advance_amount_paise bigint not null default 0 check (advance_amount_paise >= 0),
  balance_amount_paise bigint not null default 0 check (balance_amount_paise >= 0),
  currency text not null default 'INR',
  validity_date date,
  notes text,
  status text not null default 'DRAFT'
    check (status in ('DRAFT','SENT','VIEWED','ACCEPTED','REJECTED','EXPIRED','CONVERTED')),
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.service_quotes enable row level security;

create table if not exists public.admin_service_overrides (
  service_id text primary key,
  config jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.admin_service_overrides enable row level security;

create table if not exists public.cms_tips (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  title text not null,
  excerpt text not null,
  content jsonb not null default '[]'::jsonb,
  image text,
  author text default 'NSD Creations',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.cms_tips enable row level security;

create table if not exists public.cms_portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  client_name text,
  description text not null,
  thumbnail_url text,
  project_url text,
  tech jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.cms_portfolio enable row level security;

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.site_settings enable row level security;

create table if not exists public.notification_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  url text,
  notification_type text not null default 'announcement',
  audience text not null default 'all',
  recipients_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_by text,
  created_at timestamptz not null default timezone('utc'::text, now())
);
alter table public.notification_campaigns enable row level security;

alter table if exists public.contact_submissions add column if not exists notes text;
alter table if exists public.contact_submissions add column if not exists converted_booking_id uuid references public.service_bookings(id) on delete set null;
alter table if exists public.contact_submissions add column if not exists qualified_at timestamptz;
alter table if exists public.contact_submissions add column if not exists updated_at timestamptz default timezone('utc'::text, now());

do $$
begin
  if to_regclass('public.contact_submissions') is not null then
    alter table public.contact_submissions drop constraint if exists contact_submissions_status_check;
    alter table public.contact_submissions add constraint contact_submissions_status_check
      check (status in ('unread','contacted','qualified','proposal_sent','won','lost','archived','read'));
  end if;
exception when duplicate_object then null;
end $$;

do $$
begin
  if to_regclass('public.push_subscriptions') is null then
    create table public.push_subscriptions (
      id uuid primary key default gen_random_uuid(),
      endpoint text not null,
      p256dh text not null,
      auth text not null,
      last_tip_id bigint,
      created_at timestamptz not null default timezone('utc'::text, now()),
      last_seen_at timestamptz not null default timezone('utc'::text, now()),
      user_agent text,
      status text not null default 'active' check (status in ('active','inactive')),
      last_notification_status text,
      last_notification_at timestamptz,
      failure_count integer not null default 0
    );
  else
    alter table public.push_subscriptions add column if not exists created_at timestamptz default timezone('utc'::text, now());
    alter table public.push_subscriptions add column if not exists last_seen_at timestamptz default timezone('utc'::text, now());
    alter table public.push_subscriptions add column if not exists user_agent text;
    alter table public.push_subscriptions add column if not exists status text default 'active';
    alter table public.push_subscriptions add column if not exists last_notification_status text;
    alter table public.push_subscriptions add column if not exists last_notification_at timestamptz;
    alter table public.push_subscriptions add column if not exists failure_count integer default 0;
  end if;
end $$;

alter table public.push_subscriptions enable row level security;
create index if not exists push_subscriptions_endpoint_idx on public.push_subscriptions(endpoint);

-- Admin tables intentionally have no public RLS policies. The application uses the service-role key server-side.
