import type { SupabaseClient } from "@supabase/supabase-js";

import type { PhotoAnalysisOutcome } from "@/lib/domain/photo-analysis";

export async function logPhotoAnalysisEvent(
  supabase: SupabaseClient,
  input: {
    userId: string | null;
    consentVersion: string;
    outcome: PhotoAnalysisOutcome;
    model: string;
    skinTypeSuggestion: string | null;
    concernsSuggestion: string[] | null;
    errorCode: string | null;
  },
) {
  const { error } = await supabase.from("photo_analysis_events").insert({
    user_id: input.userId,
    consent_version: input.consentVersion,
    outcome: input.outcome,
    model: input.model,
    skin_type_suggestion: input.skinTypeSuggestion,
    concerns_suggestion: input.concernsSuggestion,
    error_code: input.errorCode,
  });

  if (error) throw error;
}
