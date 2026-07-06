create table if not exists public.catalog_versions (
  id uuid primary key default gen_random_uuid(),
  version_key text not null unique
    check (version_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  summary text not null,
  internal_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rule_versions (
  id uuid primary key default gen_random_uuid(),
  version_key text not null unique
    check (version_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  summary text not null,
  internal_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.catalog_versions enable row level security;
alter table public.rule_versions enable row level security;

create policy "Catalog admins can manage catalog versions"
  on public.catalog_versions
  for all
  using (public.is_catalog_admin(auth.uid()))
  with check (public.is_catalog_admin(auth.uid()));

create policy "Anyone can read published catalog versions"
  on public.catalog_versions
  for select
  using (status = 'published');

create policy "Catalog admins can manage rule versions"
  on public.rule_versions
  for all
  using (public.is_catalog_admin(auth.uid()))
  with check (public.is_catalog_admin(auth.uid()));

create policy "Anyone can read published rule versions"
  on public.rule_versions
  for select
  using (status = 'published');

create or replace function public.set_version_publish_metadata()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists set_catalog_versions_publish_metadata
  on public.catalog_versions;

create trigger set_catalog_versions_publish_metadata
before insert or update on public.catalog_versions
for each row
execute function public.set_version_publish_metadata();

drop trigger if exists set_rule_versions_publish_metadata
  on public.rule_versions;

create trigger set_rule_versions_publish_metadata
before insert or update on public.rule_versions
for each row
execute function public.set_version_publish_metadata();
