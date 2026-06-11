create extension if not exists pgcrypto with schema extensions;

create table if not exists public.visit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  site text not null default 'steelit-website',
  path text not null default '/',
  referrer text not null default '',
  user_agent text not null default '',
  ip_hash text not null,
  country text not null default '',
  timezone text not null default '',
  notified boolean not null default false
);

create index if not exists visit_events_site_created_at_idx
  on public.visit_events (site, created_at desc);

create index if not exists visit_events_site_ip_hash_created_at_idx
  on public.visit_events (site, ip_hash, created_at desc);

alter table public.visit_events enable row level security;
