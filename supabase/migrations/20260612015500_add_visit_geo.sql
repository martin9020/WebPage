alter table public.visit_events
  add column if not exists ip_address text not null default '',
  add column if not exists country_code text not null default '',
  add column if not exists city text not null default '',
  add column if not exists region text not null default '',
  add column if not exists location_source text not null default '';
