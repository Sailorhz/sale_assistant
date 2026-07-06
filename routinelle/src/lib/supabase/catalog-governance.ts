import type { SupabaseClient } from "@supabase/supabase-js";

import {
  mapApprovedCopyBlockRow,
  mapCatalogTagRow,
  type ApprovedCopyBlockRow,
  type CatalogTagRow,
} from "@/lib/catalog/catalog-governance";

export type CatalogTagInsert = Omit<CatalogTagRow, "id" | "created_at" | "updated_at">;
export type ApprovedCopyBlockInsert = Omit<
  ApprovedCopyBlockRow,
  "id" | "created_at" | "updated_at"
>;

const tagColumns =
  "id,tag_type,slug,label,description,status,version_key,created_at,updated_at";

const copyColumns =
  "id,copy_key,copy_type,title,body,allowed_contexts,claim_scope,status,version_key,created_at,updated_at";

export async function listCatalogTags(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("catalog_tags")
    .select(tagColumns)
    .order("tag_type")
    .order("slug")
    .returns<CatalogTagRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapCatalogTagRow);
}

export async function createCatalogTag(
  supabase: SupabaseClient,
  row: CatalogTagInsert,
) {
  const { data, error } = await supabase
    .from("catalog_tags")
    .insert(row)
    .select(tagColumns)
    .single<CatalogTagRow>();

  if (error) {
    throw error;
  }

  return mapCatalogTagRow(data);
}

export async function listApprovedCopyBlocks(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("approved_copy_blocks")
    .select(copyColumns)
    .order("copy_key")
    .returns<ApprovedCopyBlockRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapApprovedCopyBlockRow);
}

export async function createApprovedCopyBlock(
  supabase: SupabaseClient,
  row: ApprovedCopyBlockInsert,
) {
  const { data, error } = await supabase
    .from("approved_copy_blocks")
    .insert(row)
    .select(copyColumns)
    .single<ApprovedCopyBlockRow>();

  if (error) {
    throw error;
  }

  return mapApprovedCopyBlockRow(data);
}
