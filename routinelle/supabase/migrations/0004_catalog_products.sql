create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null,
  product_name text not null,
  product_category text not null
    check (
      product_category in (
        'cleanser',
        'moisturizer',
        'sunscreen',
        'serum',
        'active',
        'exfoliant',
        'toner',
        'mask',
        'other'
      )
    ),
  routine_step text not null
    check (
      routine_step in (
        'cleanse',
        'hydrate',
        'protect',
        'support',
        'optional'
      )
    ),
  inci_list text[] not null
    check (array_length(inci_list, 1) > 0),
  key_ingredients text[] not null default '{}',
  function_tags text[] not null default '{}',
  caution_tags text[] not null default '{}',
  verified_claims jsonb not null default '[]'::jsonb
    check (jsonb_typeof(verified_claims) = 'array'),
  price_amount_minor integer
    check (price_amount_minor is null or price_amount_minor >= 0),
  price_currency text
    check (price_currency is null or price_currency ~ '^[A-Z]{3}$'),
  price_band text not null default 'unknown'
    check (price_band in ('low', 'moderate', 'premium', 'unknown')),
  size_value numeric(10, 2)
    check (size_value is null or size_value > 0),
  size_unit text
    check (size_unit is null or size_unit in ('ml', 'g', 'oz', 'unit')),
  cost_per_unit_amount_minor integer
    check (
      cost_per_unit_amount_minor is null or cost_per_unit_amount_minor >= 0
    ),
  cost_per_unit_unit text
    check (
      cost_per_unit_unit is null or cost_per_unit_unit in ('ml', 'g', 'oz', 'unit')
    ),
  market text not null
    check (market in ('france', 'eu', 'uk', 'us', 'other')),
  availability_status text not null default 'unknown'
    check (
      availability_status in (
        'available',
        'limited',
        'unavailable',
        'unknown'
      )
    ),
  retailer_name text,
  product_url text,
  source_url text,
  last_verified_at timestamptz not null,
  next_review_at timestamptz,
  formula_status text not null default 'stable'
    check (
      formula_status in (
        'stable',
        'changed',
        'suspected_change',
        'unknown'
      )
    ),
  formula_changed_at timestamptz,
  data_freshness_status text not null default 'current'
    check (
      data_freshness_status in (
        'current',
        'review_due',
        'stale',
        'needs_review'
      )
    ),
  data_freshness_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_name, product_name, market)
);

alter table public.catalog_products enable row level security;

create index if not exists catalog_products_market_idx
  on public.catalog_products (market);

create index if not exists catalog_products_routine_step_idx
  on public.catalog_products (routine_step);

create index if not exists catalog_products_availability_status_idx
  on public.catalog_products (availability_status);

create index if not exists catalog_products_last_verified_at_idx
  on public.catalog_products (last_verified_at);

create index if not exists catalog_products_freshness_review_idx
  on public.catalog_products (data_freshness_status, next_review_at);

create or replace function public.set_catalog_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_catalog_products_updated_at
  on public.catalog_products;

create trigger set_catalog_products_updated_at
before update on public.catalog_products
for each row
execute function public.set_catalog_products_updated_at();
