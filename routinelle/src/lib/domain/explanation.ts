export type ExplanationAudience = "consumer" | "internal";

export type ExplanationTraceRef = {
  type: "product" | "rule" | "source" | "approved_copy" | "version";
  id: string;
  label: string;
  audience: ExplanationAudience;
};

export type StepExplanation = {
  stepId: string;
  concisePurpose: string;
  detail: string;
  traceRefs: ExplanationTraceRef[];
};

export type ProductFitBadge =
  | "barrier-friendly"
  | "low-irritation-risk"
  | "budget-fit"
  | "locally-available"
  | "acne-prone-fit"
  | "hydration-support"
  | "caution";

export type ProductRationale = {
  productId: string;
  stepId: string;
  ingredientFunction: string;
  skinFit: string;
  budgetAvailabilityFit: string;
  cautionNotes: string[];
  fitBadges: ProductFitBadge[];
  externalLinkLabel: string | null;
  traceRefs: ExplanationTraceRef[];
};

export type RoutineCautionExplanation = {
  id: string;
  severity: "mild" | "strong" | "block";
  message: string;
  traceRefs: ExplanationTraceRef[];
};

export type RoutineExplanationBundle = {
  stepExplanations: StepExplanation[];
  productRationales: ProductRationale[];
  cautionExplanations: RoutineCautionExplanation[];
  gentleStartExplanation: string | null;
  safetyExplanation: string | null;
  neutralityStatement: string;
};
