export const PROFILE_DELETION_CONFIRMATION = "DELETE PROFILE DATA";

export type AccountDataSummaryItem = {
  label: string;
  status: string;
  detail: string;
};

export type ProfileDeletionRequest = {
  id: string;
  status: "requested" | "completed";
  requestedAt: string;
  completedAt: string | null;
  requestNote: string | null;
};

export type AccountDataSummary = {
  items: AccountDataSummaryItem[];
  deletionRequest: ProfileDeletionRequest | null;
  photoStorageStatus: string;
};

/** Whether the signed-in user actually has each category of data stored. */
export type AccountDataPresence = {
  hasSkinProfile: boolean;
  hasSavedRoutines: boolean;
  hasCheckIns: boolean;
};

function summaryItem(
  label: string,
  hasData: boolean,
  deletionRequest: ProfileDeletionRequest | null,
  storedDetail: string,
  notStoredDetail: string,
  deletedDetail: string,
): AccountDataSummaryItem {
  if (deletionRequest) {
    return { label, status: "Deletion requested", detail: deletedDetail };
  }

  return {
    label,
    status: hasData ? "Stored" : "Not stored",
    detail: hasData ? storedDetail : notStoredDetail,
  };
}

export function buildAccountDataSummary(
  deletionRequest: ProfileDeletionRequest | null,
  presence: AccountDataPresence,
): AccountDataSummary {
  return {
    deletionRequest,
    photoStorageStatus:
      "Photos are not stored for MVP recommendations, so there is no photo deletion control here.",
    items: [
      summaryItem(
        "Skin profile answers",
        presence.hasSkinProfile,
        deletionRequest,
        "Your skin profile answers are saved to your account.",
        "You haven't saved skin profile answers to your account yet -- this is optional and happens when you opt in during onboarding or on this page.",
        "A deletion request is recorded. Future profile views should not show deleted profile answers.",
      ),
      summaryItem(
        "Saved routine history",
        presence.hasSavedRoutines,
        deletionRequest,
        "At least one generated routine is saved to your account.",
        "You don't have any saved routine history yet.",
        "A deletion request is recorded. Future recommendation history should not show deleted profile-linked routines.",
      ),
      summaryItem(
        "Outcome and check-in history",
        presence.hasCheckIns,
        deletionRequest,
        "At least one check-in outcome is saved to your account.",
        "You don't have any check-in or outcome history yet.",
        "A deletion request is recorded. Future check-in history should not show deleted profile-linked outcomes.",
      ),
      {
        label: "Photos",
        status: "Not collected",
        detail:
          "Routinelle does not store photos for MVP recommendations and does not provide photo deletion controls in this version.",
      },
    ],
  };
}
