create table if not exists public.admin_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id text not null references public.admin_credentials(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  last_seen_at timestamptz not null default timezone('utc'::text, now()),
  user_agent text,
  status text not null default 'active' check (status in ('active','inactive')),
  last_notification_status text,
  last_notification_at timestamptz,
  failure_count integer not null default 0
);

alter table public.admin_push_subscriptions enable row level security;

create index if not exists admin_push_subscriptions_admin_idx
  on public.admin_push_subscriptions(admin_user_id);

create index if not exists admin_push_subscriptions_status_idx
  on public.admin_push_subscriptions(status);
