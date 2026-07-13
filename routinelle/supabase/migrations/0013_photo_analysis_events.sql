-- Audit log for the optional photo-based skin-type suggestion feature.
-- Deliberately contains no image data of any kind -- the raw photo is never
-- persisted anywhere; only the resulting structured outcome is logged.
create table if not exists public.photo_analysis_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  consent_version text not null,
  outcome text not null
    check (outcome in ('analyzed', 'no_face_detected', 'needs_professional_care', 'unsupported_image', 'declined')),
  model text not null,
  skin_type_suggestion text,
  concerns_suggestion text[],
  error_code text,
  created_at timestamptz not null default now()
);

alter table public.photo_analysis_events enable row level security;

create policy "Users can insert their own photo analysis events"
  on public.photo_analysis_events
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Catalog admins can read photo analysis events"
  on public.photo_analysis_events
  for select
  using (public.is_catalog_admin(auth.uid()));
