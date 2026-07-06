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

export function buildAccountDataSummary(
  deletionRequest: ProfileDeletionRequest | null,
): AccountDataSummary {
  const deletionStatus = deletionRequest
    ? "Deletion requested"
    : "Not stored yet";

  return {
    deletionRequest,
    photoStorageStatus:
      "Photos are not stored for MVP recommendations, so there is no photo deletion control here.",
    items: [
      {
        label: "Skin profile answers",
        status: deletionStatus,
        detail: deletionRequest
          ? "A deletion request is recorded. Future profile views should not show deleted profile answers."
          : "Routinelle has not stored skin profile answers yet because onboarding storage is not implemented.",
      },
      {
        label: "Saved routine history",
        status: deletionStatus,
        detail: deletionRequest
          ? "A deletion request is recorded. Future recommendation history should not show deleted profile-linked routines."
          : "No saved routine history exists yet.",
      },
      {
        label: "Outcome and check-in history",
        status: deletionStatus,
        detail: deletionRequest
          ? "A deletion request is recorded. Future check-in history should not show deleted profile-linked outcomes."
          : "No check-in or outcome history exists yet.",
      },
      {
        label: "Photos",
        status: "Not collected",
        detail:
          "Routinelle does not store photos for MVP recommendations and does not provide photo deletion controls in this version.",
      },
    ],
  };
}
