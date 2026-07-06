import type { SupabaseClient } from "@supabase/supabase-js";

export async function isCatalogAdmin(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("catalog_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle<{ user_id: string }>();

  if (error) {
    throw error;
  }

  return data?.user_id === userId;
}
