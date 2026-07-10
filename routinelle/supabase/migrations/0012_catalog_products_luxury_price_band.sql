alter table public.catalog_products
  drop constraint catalog_products_price_band_check;

alter table public.catalog_products
  add constraint catalog_products_price_band_check
  check (price_band in ('low', 'moderate', 'premium', 'luxury', 'unknown'));
