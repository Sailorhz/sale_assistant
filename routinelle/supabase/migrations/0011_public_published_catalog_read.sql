drop policy if exists "Anyone can read published catalog products"
  on public.catalog_products;

create policy "Anyone can read published catalog products"
  on public.catalog_products
  for select
  using (
    publication_status = 'published'
    and availability_status in ('available', 'limited')
  );

drop policy if exists "Anyone can read published catalog versions"
  on public.catalog_versions;

create policy "Anyone can read published catalog versions"
  on public.catalog_versions
  for select
  using (status = 'published');

drop policy if exists "Anyone can read published rule versions"
  on public.rule_versions;

create policy "Anyone can read published rule versions"
  on public.rule_versions
  for select
  using (status = 'published');
