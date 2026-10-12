-- WhatsApp Cloud API webhook message/event store.
-- Service-role access is used only by server routes; do not expose this table to anon clients.
create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  wamid text not null unique,
  direction text not null check (direction in ('inbound', 'outbound')),
  wa_id text,
  contact_name text,
  message_type text,
  message_text text,
  status text not null default 'received',
  payload jsonb not null default '{}'::jsonb,
  message_timestamp timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists whatsapp_messages_timestamp_idx
  on public.whatsapp_messages (message_timestamp desc);
create index if not exists whatsapp_messages_wa_id_idx
  on public.whatsapp_messages (wa_id);

alter table public.whatsapp_messages enable row level security;
-- Intentionally no anon/authenticated policies. Server-side service-role routes perform access.
