import type { SupabaseClient } from "@supabase/supabase-js";

import type { SkinProfileSummary } from "@/lib/domain/skin-profile-summary";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export type SkinProfilePersistenceInput = {
  answers: OnboardingAnswers;
  summary: SkinProfileSummary;
  routineRegenerationRequired: boolean;
};

export type SkinProfilePersistenceResult = {
  updatedAt: string | null;
  profileVersion: number;
  routineRegenerationRequired: boolean;
};

type SkinProfileRow = {
  updated_at: string | null;
  profile_version: number;
  routine_regeneration_required: boolean;
};

export async function upsertSkinProfile(
  supabase: SupabaseClient,
  userId: string,
  input: SkinProfilePersistenceInput,
): Promise<SkinProfilePersistenceResult> {
  const { data, error } = await supabase
    .from("skin_profiles")
    .upsert(
      {
        user_id: userId,
        answers: input.answers,
        profile_summary: input.summary,
        routine_regeneration_required: input.routineRegenerationRequired,
      },
      { onConflict: "user_id" },
    )
    .select("updated_at,profile_version,routine_regeneration_required")
    .single<SkinProfileRow>();

  if (error) {
    throw error;
  }

  return {
    updatedAt: data.updated_at,
    profileVersion: data.profile_version,
    routineRegenerationRequired: data.routine_regeneration_required,
  };
}
