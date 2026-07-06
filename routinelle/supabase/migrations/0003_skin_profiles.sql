create table if not exists public.skin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null,
  profile_summary jsonb not null,
  routine_regeneration_required boolean not null default false,
  profile_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skin_profiles enable row level security;

create policy "Users can read their own skin profile"
  on public.skin_profiles
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own skin profile"
  on public.skin_profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own skin profile"
  on public.skin_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_skin_profiles_update_metadata()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if tg_op = 'UPDATE' then
    new.profile_version = old.profile_version + 1;
  end if;

  return new;
end;
$$;

drop trigger if exists set_skin_profiles_update_metadata
  on public.skin_profiles;

create trigger set_skin_profiles_update_metadata
before update on public.skin_profiles
for each row
execute function public.set_skin_profiles_update_metadata();
