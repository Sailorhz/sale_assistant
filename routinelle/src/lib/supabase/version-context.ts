import type { SupabaseClient } from "@supabase/supabase-js";

import {
  mapGovernanceVersionRow,
  type GovernanceVersionRow,
} from "@/lib/catalog/version-context";
import { buildRoutineVersionContext } from "@/lib/domain/version-context";

export type GovernanceVersionInsert = Omit<
  GovernanceVersionRow,
  "id" | "published_at" | "created_at" | "updated_at"
>;

const versionColumns =
  "id,version_key,status,summary,internal_notes,published_at,created_at,updated_at";

export async function listCatalogVersions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("catalog_versions")
    .select(versionColumns)
    .order("created_at", { ascending: false })
    .returns<GovernanceVersionRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapGovernanceVersionRow);
}

async function getLatestPublishedVersion(
  supabase: SupabaseClient,
  tableName: "catalog_versions" | "rule_versions",
) {
  const { data, error } = await supabase
    .from(tableName)
    .select(versionColumns)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle<GovernanceVersionRow>();

  if (error) {
    throw error;
  }

  return data ? mapGovernanceVersionRow(data) : null;
}

export async function getLatestPublishedRoutineVersionContext(
  supabase: SupabaseClient,
) {
  const [catalogVersion, ruleVersion] = await Promise.all([
    getLatestPublishedVersion(supabase, "catalog_versions"),
    getLatestPublishedVersion(supabase, "rule_versions"),
  ]);

  if (!catalogVersion || !ruleVersion) {
    return null;
  }

  return buildRoutineVersionContext(catalogVersion, ruleVersion);
}

export async function createCatalogVersion(
  supabase: SupabaseClient,
  row: GovernanceVersionInsert,
) {
  const { data, error } = await supabase
    .from("catalog_versions")
    .insert(row)
    .select(versionColumns)
    .single<GovernanceVersionRow>();

  if (error) {
    throw error;
  }

  return mapGovernanceVersionRow(data);
}

export async function listRuleVersions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("rule_versions")
    .select(versionColumns)
    .order("created_at", { ascending: false })
    .returns<GovernanceVersionRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapGovernanceVersionRow);
}

export async function createRuleVersion(
  supabase: SupabaseClient,
  row: GovernanceVersionInsert,
) {
  const { data, error } = await supabase
    .from("rule_versions")
    .insert(row)
    .select(versionColumns)
    .single<GovernanceVersionRow>();

  if (error) {
    throw error;
  }

  return mapGovernanceVersionRow(data);
}
