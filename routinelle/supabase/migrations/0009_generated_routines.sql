create table if not exists public.generated_routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  profile_hash text not null,
  routine_payload jsonb not null,
  routine_state text not null
    check (routine_state in ('ready', 'no-safe-match', 'safety-blocked')),
  routine_variant text not null
    check (routine_variant in ('standard', 'gentle-start')),
  catalog_version_id uuid not null references public.catalog_versions(id),
  rule_version_id uuid not null references public.rule_versions(id),
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.generated_routines enable row level security;

create policy "Users can read their own generated routines"
  on public.generated_routines
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generated routines"
  on public.generated_routines
  for insert
  with check (auth.uid() = user_id);

create index if not exists generated_routines_user_id_idx
  on public.generated_routines (user_id);

create index if not exists generated_routines_version_context_idx
  on public.generated_routines (catalog_version_id, rule_version_id);
