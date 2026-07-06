create extension if not exists pgcrypto;

create table if not exists public.profile_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'requested'
    check (status in ('requested', 'completed')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  request_note text
);

create unique index if not exists profile_deletion_requests_one_open_per_user
  on public.profile_deletion_requests (user_id)
  where status = 'requested';

alter table public.profile_deletion_requests enable row level security;

create policy "Users can read their own profile deletion requests"
  on public.profile_deletion_requests
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile deletion requests"
  on public.profile_deletion_requests
  for insert
  with check (auth.uid() = user_id);
