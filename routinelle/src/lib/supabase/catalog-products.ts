import type { SupabaseClient } from "@supabase/supabase-js";

import {
  mapCatalogProductRow,
  type CatalogProductRow,
} from "@/lib/catalog/catalog-product";
import type { CatalogProduct } from "@/lib/domain/catalog-product";

export const catalogProductSelectColumns = `
  id,
  brand_name,
  product_name,
  product_category,
  routine_step,
  inci_list,
  key_ingredients,
  function_tags,
  caution_tags,
  verified_claims,
  price_amount_minor,
  price_currency,
  price_band,
  size_value,
  size_unit,
  cost_per_unit_amount_minor,
  cost_per_unit_unit,
  market,
  availability_status,
  retailer_name,
  product_url,
  source_url,
  last_verified_at,
  next_review_at,
  formula_status,
  formula_changed_at,
  data_freshness_status,
  data_freshness_notes,
  publication_status,
  published_at,
  unpublished_at,
  review_flagged_at,
  review_reason,
  created_at,
  updated_at
`;

export type CatalogProductMutationRow = Omit<
  CatalogProductRow,
  | "id"
  | "created_at"
  | "updated_at"
  | "published_at"
  | "unpublished_at"
  | "review_flagged_at"
>;

export async function listCatalogProducts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("catalog_products")
    .select(catalogProductSelectColumns)
    .order("updated_at", { ascending: false })
    .returns<CatalogProductRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapCatalogProductRow);
}

export async function listPublishedCatalogProducts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("catalog_products")
    .select(catalogProductSelectColumns)
    .eq("publication_status", "published")
    .in("availability_status", ["available", "limited"])
    .order("updated_at", { ascending: false })
    .returns<CatalogProductRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapCatalogProductRow);
}

export async function createCatalogProduct(
  supabase: SupabaseClient,
  row: CatalogProductMutationRow,
): Promise<CatalogProduct> {
  const { data, error } = await supabase
    .from("catalog_products")
    .insert(row)
    .select(catalogProductSelectColumns)
    .single<CatalogProductRow>();

  if (error) {
    throw error;
  }

  return mapCatalogProductRow(data);
}

export async function updateCatalogProduct(
  supabase: SupabaseClient,
  productId: string,
  row: CatalogProductMutationRow,
): Promise<CatalogProduct> {
  const { data, error } = await supabase
    .from("catalog_products")
    .update(row)
    .eq("id", productId)
    .select(catalogProductSelectColumns)
    .single<CatalogProductRow>();

  if (error) {
    throw error;
  }

  return mapCatalogProductRow(data);
}
