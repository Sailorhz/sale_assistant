create table if not exists public.product_action_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  routine_id uuid references public.generated_routines(id) on delete set null,
  product_id uuid references public.catalog_products(id) on delete set null,
  action_type text not null check (action_type in ('product_click')),
  link_status text not null default 'available'
    check (link_status in ('available', 'stale', 'unavailable', 'unknown')),
  created_at timestamptz not null default now()
);

create table if not exists public.routine_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.generated_routines(id) on delete set null,
  adherence jsonb not null default '{}'::jsonb,
  outcomes jsonb not null default '{}'::jsonb,
  outcome_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null check (event_name ~ '^[a-z0-9]+(\.[a-z0-9]+)*$'),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.safety_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  routine_id uuid references public.generated_routines(id) on delete set null,
  product_id uuid references public.catalog_products(id) on delete set null,
  category text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.product_action_events enable row level security;
alter table public.routine_check_ins enable row level security;
alter table public.analytics_events enable row level security;
alter table public.safety_events enable row level security;

create policy "Users can insert their own product action events"
  on public.product_action_events
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own check-ins"
  on public.routine_check_ins
  for insert
  with check (auth.uid() = user_id);

create policy "Users can read their own check-ins"
  on public.routine_check_ins
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analytics events"
  on public.analytics_events
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can insert safety events"
  on public.safety_events
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Catalog admins can read product action events"
  on public.product_action_events
  for select
  using (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can read analytics events"
  on public.analytics_events
  for select
  using (public.is_catalog_admin(auth.uid()));

create policy "Catalog admins can read safety events"
  on public.safety_events
  for select
  using (public.is_catalog_admin(auth.uid()));
