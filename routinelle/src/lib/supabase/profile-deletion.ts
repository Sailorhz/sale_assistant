import type { SupabaseClient } from "@supabase/supabase-js";

import type { ProfileDeletionRequest } from "@/lib/domain/account-data";

type ProfileDeletionRequestRow = {
  id: string;
  status: "requested" | "completed";
  requested_at: string;
  completed_at: string | null;
  request_note: string | null;
};

function mapProfileDeletionRequest(
  row: ProfileDeletionRequestRow | null,
): ProfileDeletionRequest | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    status: row.status,
    requestedAt: row.requested_at,
    completedAt: row.completed_at,
    requestNote: row.request_note,
  };
}

function isUniqueViolation(error: { code?: string }) {
  return error.code === "23505";
}

export async function getOpenProfileDeletionRequest(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profile_deletion_requests")
    .select("id,status,requested_at,completed_at,request_note")
    .eq("user_id", userId)
    .eq("status", "requested")
    .maybeSingle<ProfileDeletionRequestRow>();

  if (error) {
    throw error;
  }

  return mapProfileDeletionRequest(data);
}

export async function createProfileDeletionRequest(
  supabase: SupabaseClient,
  userId: string,
) {
  const existingRequest = await getOpenProfileDeletionRequest(supabase, userId);

  if (existingRequest) {
    return existingRequest;
  }

  const { data, error } = await supabase
    .from("profile_deletion_requests")
    .insert({
      user_id: userId,
      status: "requested",
      request_note:
        "User requested deletion of recommendation-related profile data.",
    })
    .select("id,status,requested_at,completed_at,request_note")
    .single<ProfileDeletionRequestRow>();

  if (error) {
    if (isUniqueViolation(error)) {
      return getOpenProfileDeletionRequest(supabase, userId);
    }

    throw error;
  }

  return mapProfileDeletionRequest(data);
}
