import type { SupabaseClient } from "@supabase/supabase-js";

import type { AccountDataPresence } from "@/lib/domain/account-data";

/**
 * Cheap existence checks only (`limit(1)`, no row data read) -- the account
 * page needs to know whether each category has anything stored, not what's
 * in it.
 */
export async function getAccountDataPresence(
  supabase: SupabaseClient,
  userId: string,
): Promise<AccountDataPresence> {
  const [profile, routines, checkIns] = await Promise.all([
    supabase.from("skin_profiles").select("user_id").eq("user_id", userId).limit(1),
    supabase.from("generated_routines").select("id").eq("user_id", userId).limit(1),
    supabase.from("routine_check_ins").select("id").eq("user_id", userId).limit(1),
  ]);

  if (profile.error) throw profile.error;
  if (routines.error) throw routines.error;
  if (checkIns.error) throw checkIns.error;

  return {
    hasSkinProfile: profile.data.length > 0,
    hasSavedRoutines: routines.data.length > 0,
    hasCheckIns: checkIns.data.length > 0,
  };
}
