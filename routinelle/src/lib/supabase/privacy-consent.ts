import type { SupabaseClient } from "@supabase/supabase-js";

import {
  emptyPrivacyConsent,
  PRIVACY_CONSENT_VERSION,
  type PrivacyConsent,
  type PrivacyConsentInput,
} from "@/lib/domain/privacy-consent";

type PrivacyConsentRow = {
  profile_routine_storage_consent: boolean;
  outcome_tracking_consent: boolean;
  consent_version: string;
  granted_at: string | null;
  withdrawn_at: string | null;
  updated_at: string | null;
};

function mapPrivacyConsent(row: PrivacyConsentRow | null): PrivacyConsent {
  if (!row) {
    return emptyPrivacyConsent();
  }

  return {
    profileRoutineStorageConsent: row.profile_routine_storage_consent,
    outcomeTrackingConsent: row.outcome_tracking_consent,
    consentVersion: row.consent_version,
    grantedAt: row.granted_at,
    withdrawnAt: row.withdrawn_at,
    updatedAt: row.updated_at,
  };
}

export async function getPrivacyConsent(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("privacy_consents")
    .select(
      "profile_routine_storage_consent,outcome_tracking_consent,consent_version,granted_at,withdrawn_at,updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle<PrivacyConsentRow>();

  if (error) {
    throw error;
  }

  return mapPrivacyConsent(data);
}

export async function upsertPrivacyConsent(
  supabase: SupabaseClient,
  userId: string,
  input: PrivacyConsentInput,
) {
  const hasConsent =
    input.profileRoutineStorageConsent || input.outcomeTrackingConsent;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("privacy_consents")
    .upsert(
      {
        user_id: userId,
        profile_routine_storage_consent: input.profileRoutineStorageConsent,
        outcome_tracking_consent: input.outcomeTrackingConsent,
        consent_version: PRIVACY_CONSENT_VERSION,
        granted_at: hasConsent ? now : null,
        withdrawn_at: hasConsent ? null : now,
      },
      { onConflict: "user_id" },
    )
    .select(
      "profile_routine_storage_consent,outcome_tracking_consent,consent_version,granted_at,withdrawn_at,updated_at",
    )
    .single<PrivacyConsentRow>();

  if (error) {
    throw error;
  }

  return mapPrivacyConsent(data);
}
