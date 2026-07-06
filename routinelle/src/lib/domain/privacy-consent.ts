export const PRIVACY_CONSENT_VERSION = "2026-05-15.mvp.v1";

export type PrivacyConsent = {
  profileRoutineStorageConsent: boolean;
  outcomeTrackingConsent: boolean;
  consentVersion: string;
  grantedAt: string | null;
  withdrawnAt: string | null;
  updatedAt: string | null;
};

export type PrivacyConsentInput = {
  profileRoutineStorageConsent: boolean;
  outcomeTrackingConsent: boolean;
};

export type RecommendationDataUseItem = {
  label: string;
  detail: string;
};

export const recommendationDataUseSummary: RecommendationDataUseItem[] = [
  {
    label: "Skin profile answers",
    detail:
      "Skin type, concerns, sensitivity signals, budget, and market help Routinelle choose a simpler routine fit.",
  },
  {
    label: "Generated routine",
    detail:
      "Saved AM/PM steps let Routinelle explain what changed and avoid repeating poor-fit guidance later.",
  },
  {
    label: "Outcome check-ins",
    detail:
      "Optional comfort, irritation, and progress feedback can improve future routine updates.",
  },
];

export const mvpPermissionBoundaries = [
  "No precise location is required; a selected country or market is enough.",
  "No camera permission is required for MVP recommendations.",
  "No photo library permission or photo upload is required for MVP recommendations.",
];

export function emptyPrivacyConsent(): PrivacyConsent {
  return {
    profileRoutineStorageConsent: false,
    outcomeTrackingConsent: false,
    consentVersion: PRIVACY_CONSENT_VERSION,
    grantedAt: null,
    withdrawnAt: null,
    updatedAt: null,
  };
}
