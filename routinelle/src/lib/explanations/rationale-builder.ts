import type {
  ExplanationTraceRef,
  ProductFitBadge,
  RoutineCautionExplanation,
  RoutineExplanationBundle,
  StepExplanation,
} from "@/lib/domain/explanation";
import type { GeneratedRoutine, RoutineProductOption, RoutineStep } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";
import { isApprovedCosmeticCopy } from "@/lib/safety/claim-guardrails";

const stepPurpose: Record<RoutineStep["role"], string> = {
  cleanser: "Removes daily residue so later steps sit on clean skin.",
  moisturizer: "Supports hydration and comfort in a simple routine.",
  sunscreen: "Helps protect skin from daily UV exposure.",
  support: "Adds focused cosmetic support only when the profile can handle it.",
};

function fitBadges(option: RoutineProductOption, profile: OnboardingAnswers): ProductFitBadge[] {
  const badges: ProductFitBadge[] = [];

  if (option.fitNotes.some((note) => ["hydrating", "barrier-support", "gentle"].includes(note))) {
    badges.push("hydration-support", "barrier-friendly");
  }

  if (profile.budget === "notSure" || profile.budget === "flexible" || option.priceBand === profile.budget || option.priceBand === "low") {
    badges.push("budget-fit");
  }

  if (option.availabilityStatus === "available") {
    badges.push("locally-available");
  }

  if (profile.concerns.includes("blemishes") && option.fitNotes.some((note) => ["blemish", "blemish-support", "oiliness"].includes(note))) {
    badges.push("acne-prone-fit");
  }

  return Array.from(new Set(badges));
}

function cleanCopy(value: string) {
  return isApprovedCosmeticCopy(value)
    ? value
    : "This explanation is unavailable because the copy needs review.";
}

function buildStepExplanation(step: RoutineStep): StepExplanation {
  return {
    stepId: step.id,
    concisePurpose: cleanCopy(stepPurpose[step.role]),
    detail: cleanCopy(
      `${step.title} is included as a ${step.frequency.toLowerCase()} ${step.timeOfUse.toUpperCase()} step so the routine stays simple and structured.`,
    ),
    traceRefs: step.explanationRefs.map((ref) => ({
      type: "approved_copy",
      id: ref.key,
      label: ref.label,
      audience: "internal",
    })),
  };
}

function traceRef(ref: ExplanationTraceRef): ExplanationTraceRef {
  return ref;
}

function cautionExplanations(routine: GeneratedRoutine): RoutineCautionExplanation[] {
  return routine.conflicts.map((conflict) => ({
    id: conflict.code,
    severity:
      conflict.severity === "block"
        ? "block"
        : conflict.severity === "caution"
          ? "strong"
          : "mild",
    message: cleanCopy(conflict.message),
    traceRefs: [
      {
        type: "rule",
        id: conflict.code,
        label: conflict.code,
        audience: "internal",
      },
    ],
  }));
}

export function buildRoutineExplanationBundle(
  routine: GeneratedRoutine,
  profile: OnboardingAnswers,
): RoutineExplanationBundle {
  const steps = routine.sections.flatMap((section) => section.steps);
  const productRationales = steps.flatMap((step) =>
    step.productOptions.map((option) => ({
      productId: option.productId,
      stepId: step.id,
      ingredientFunction: cleanCopy(
        option.fitNotes.length > 0
          ? `Key product notes: ${option.fitNotes.join(", ")}.`
          : "Product facts support this routine role.",
      ),
      skinFit: cleanCopy(
        `This option is matched to the ${step.title.toLowerCase()} step based on your profile answers.`,
      ),
      budgetAvailabilityFit: cleanCopy(
        `${option.priceBand} budget band; availability status: ${option.availabilityStatus}.`,
      ),
      cautionNotes: step.cautions.map(cleanCopy),
      fitBadges: fitBadges(option, profile),
      externalLinkLabel: option.productUrl
        ? "External retailer/product link"
        : null,
      traceRefs: [
        traceRef({
          type: "product",
          id: option.productId,
          label: option.productName,
          audience: "internal",
        }),
        traceRef({
          type: "version",
          id: routine.versionContext.catalogVersionId,
          label: routine.versionContext.catalogVersionKey,
          audience: "internal",
        }),
      ],
    })),
  );

  return {
    stepExplanations: steps.map(buildStepExplanation),
    productRationales,
    cautionExplanations: cautionExplanations(routine),
    gentleStartExplanation:
      routine.variant === "gentle-start"
        ? cleanCopy("This routine starts conservatively because your answers suggest comfort or barrier support should come first.")
        : null,
    safetyExplanation:
      routine.state === "safety-blocked"
        ? cleanCopy("Based on your answers, Routinelle is pausing product guidance and suggesting professional care before product changes.")
        : null,
    neutralityStatement: cleanCopy(
      "Recommendations are based on profile fit, routine role, ingredient facts, budget, and availability. Retailer links are separate from ranking logic.",
    ),
  };
}
