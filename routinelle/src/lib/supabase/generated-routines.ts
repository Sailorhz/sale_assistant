import type { SupabaseClient } from "@supabase/supabase-js";

import type { GeneratedRoutine, PersistedGeneratedRoutine } from "@/lib/domain/routine";

type GeneratedRoutineRow = {
  id?: string;
  user_id: string | null;
  routine_payload: GeneratedRoutine;
  created_at: string;
};

export async function persistGeneratedRoutine(
  supabase: SupabaseClient,
  userId: string,
  routine: GeneratedRoutine,
): Promise<PersistedGeneratedRoutine> {
  const { data, error } = await supabase
    .from("generated_routines")
    .insert({
      user_id: userId,
      profile_hash: routine.profileHash,
      routine_payload: routine,
      routine_state: routine.state,
      routine_variant: routine.variant,
      catalog_version_id: routine.versionContext.catalogVersionId,
      rule_version_id: routine.versionContext.ruleVersionId,
    })
    .select("id,user_id,routine_payload,created_at")
    .single<GeneratedRoutineRow>();

  if (error) {
    throw error;
  }

  return {
    ...data.routine_payload,
    id: data.id ?? data.routine_payload.id,
    userId: data.user_id,
    storedAt: data.created_at,
  };
}

export async function getGeneratedRoutine(
  supabase: SupabaseClient,
  routineId: string,
): Promise<PersistedGeneratedRoutine> {
  const { data, error } = await supabase
    .from("generated_routines")
    .select("id,user_id,routine_payload,created_at")
    .eq("id", routineId)
    .single<GeneratedRoutineRow>();

  if (error) {
    throw error;
  }

  return {
    ...data.routine_payload,
    id: data.id ?? data.routine_payload.id,
    userId: data.user_id,
    storedAt: data.created_at,
  };
}
