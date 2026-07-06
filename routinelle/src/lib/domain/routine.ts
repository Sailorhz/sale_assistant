import type { CatalogPriceBand, CatalogRoutineStep } from "@/lib/domain/catalog-product";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";
import type { RoutineVersionContext } from "@/lib/domain/version-context";

export type RoutineSectionId = "am" | "pm";
export type RoutineStepRole = "cleanser" | "moisturizer" | "sunscreen" | "support";
export type RoutineRecommendationState =
  | "recommended"
  | "caution"
  | "no-safe-match"
  | "safety-blocked";

export type RoutineProductOption = {
  productId: string;
  brandName: string;
  productName: string;
  routineStep: CatalogRoutineStep;
  priceBand: CatalogPriceBand;
  retailerName: string | null;
  productUrl: string | null;
  availabilityStatus: string;
  fitNotes: string[];
  sourceProductUpdatedAt: string;
};

export type RoutineExplanationReference = {
  key: string;
  label: string;
};

export type RoutineNoSafeMatchReason =
  | "no-eligible-product"
  | "budget-market-gap"
  | "safety-filtered";

export type RoutineConflictSeverity = "info" | "caution" | "block";

export type RoutineConflict = {
  code:
    | "duplicate-active"
    | "too-many-actives"
    | "barrier-risk-active-pattern"
    | "current-routine-conflict";
  severity: RoutineConflictSeverity;
  message: string;
  stepId?: string;
};

export type RoutineStep = {
  id: string;
  role: RoutineStepRole;
  routineStep: CatalogRoutineStep;
  title: string;
  timeOfUse: RoutineSectionId | "both";
  frequency: string;
  state: RoutineRecommendationState;
  productOptions: RoutineProductOption[];
  noSafeMatchReason: RoutineNoSafeMatchReason | null;
  cautions: string[];
  explanationRefs: RoutineExplanationReference[];
  conflictRefs: RoutineConflict[];
};

export type RoutineSection = {
  id: RoutineSectionId;
  title: string;
  steps: RoutineStep[];
};

export type RoutineVariant = "standard" | "gentle-start";

export type GeneratedRoutine = {
  id: string;
  profileHash: string;
  profileSnapshot?: OnboardingAnswers;
  variant: RoutineVariant;
  state: Exclude<RoutineRecommendationState, "recommended" | "caution"> | "ready";
  sections: RoutineSection[];
  versionContext: RoutineVersionContext;
  conflicts: RoutineConflict[];
  safetyMessages: string[];
  generatedAt: string;
};

export type PersistedGeneratedRoutine = GeneratedRoutine & {
  userId: string | null;
  storedAt: string;
};
