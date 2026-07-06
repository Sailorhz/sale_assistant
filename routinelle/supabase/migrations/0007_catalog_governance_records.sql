create table if not exists public.catalog_tags (
  id uuid primary key default gen_random_uuid(),
  tag_type text not null
    check (tag_type in ('function', 'caution', 'routine_step')),
  slug text not null
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label text not null,
  description text,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'review')),
  version_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tag_type, slug)
);

create table if not exists public.approved_copy_blocks (
  id uuid primary key default gen_random_uuid(),
  copy_key text not null unique
    check (copy_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  copy_type text not null
    check (
      copy_type in (
        'routine_explanation',
        'ingredient_rationale',
        'caution',
        'neutrality',
        'no_safe_match'
      )
    ),
  title text not null,
  body text not null,
  allowed_contexts text[] not null default '{}',
  claim_scope text not null default 'cosmetic'
    check (claim_scope in ('cosmetic', 'safety', 'commercial')),
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'archived')),
  version_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.catalog_tags enable row level security;
alter table public.approved_copy_blocks enable row level security;

create policy "Catalog admins can read catalog tags"
  on public.catalog_tags
  for select
  using (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can insert catalog tags"
  on public.catalog_tags
  for insert
  with check (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can update catalog tags"
  on public.catalog_tags
  for update
  using (public.is_catalog_admin(auth.uid()))
  with check (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can read approved copy blocks"
  on public.approved_copy_blocks
  for select
  using (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can insert approved copy blocks"
  on public.approved_copy_blocks
  for insert
  with check (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can update approved copy blocks"
  on public.approved_copy_blocks
  for update
  using (public.is_catalog_admin(auth.uid()))
  with check (public.is_catalog_admin(auth.uid()));

create or replace function public.set_catalog_governance_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_catalog_tags_updated_at
  on public.catalog_tags;

create trigger set_catalog_tags_updated_at
before update on public.catalog_tags
for each row
execute function public.set_catalog_governance_updated_at();

drop trigger if exists set_approved_copy_blocks_updated_at
  on public.approved_copy_blocks;

create trigger set_approved_copy_blocks_updated_at
before update on public.approved_copy_blocks
for each row
execute function public.set_catalog_governance_updated_at();
