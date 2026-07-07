create table if not exists public.catalog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id),
  note text
);

alter table public.catalog_admins enable row level security;

create or replace function public.is_catalog_admin(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.catalog_admins
    where user_id = check_user_id
  );
$$;

create policy "Catalog admins can read their own admin membership"
  on public.catalog_admins
  for select
  using (auth.uid() = user_id);

create policy "Catalog admins can read catalog products"
  on public.catalog_products
  for select
  using (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can insert catalog products"
  on public.catalog_products
  for insert
  with check (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can update catalog products"
  on public.catalog_products
  for update
  using (public.is_catalog_admin(auth.uid()))
  with check (public.is_catalog_admin(auth.uid()));
