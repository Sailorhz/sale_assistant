alter table public.catalog_products
  add column if not exists publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'unpublished', 'review')),
  add column if not exists published_at timestamptz,
  add column if not exists unpublished_at timestamptz,
  add column if not exists review_flagged_at timestamptz,
  add column if not exists review_reason text;

create index if not exists catalog_products_publication_status_idx
  on public.catalog_products (publication_status);

create or replace function public.set_catalog_products_status_timestamps()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.publication_status = 'published' then
      new.published_at = coalesce(new.published_at, now());
    elsif new.publication_status = 'unpublished' then
      new.unpublished_at = coalesce(new.unpublished_at, now());
    elsif new.publication_status = 'review' then
      new.review_flagged_at = coalesce(new.review_flagged_at, now());
    end if;
  elsif new.publication_status is distinct from old.publication_status then
    if new.publication_status = 'published' then
      new.published_at = now();
    elsif new.publication_status = 'unpublished' then
      new.unpublished_at = now();
    elsif new.publication_status = 'review' then
      new.review_flagged_at = now();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists set_catalog_products_status_timestamps
  on public.catalog_products;

create trigger set_catalog_products_status_timestamps
before insert or update on public.catalog_products
for each row
execute function public.set_catalog_products_status_timestamps();
