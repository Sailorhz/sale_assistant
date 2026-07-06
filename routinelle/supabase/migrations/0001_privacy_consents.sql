create table if not exists public.privacy_consents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_routine_storage_consent boolean not null default false,
  outcome_tracking_consent boolean not null default false,
  consent_version text not null,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.privacy_consents enable row level security;

create policy "Users can read their own privacy consent"
  on public.privacy_consents
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own privacy consent"
  on public.privacy_consents
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own privacy consent"
  on public.privacy_consents
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_privacy_consents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_privacy_consents_updated_at
  on public.privacy_consents;

create trigger set_privacy_consents_updated_at
before update on public.privacy_consents
for each row
execute function public.set_privacy_consents_updated_at();
