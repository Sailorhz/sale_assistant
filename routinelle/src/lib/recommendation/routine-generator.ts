import type { CatalogProduct } from "@/lib/domain/catalog-product";
import type { GeneratedRoutine, RoutineSection, RoutineStep, RoutineVariant } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";
import type { RoutineVersionContext } from "@/lib/domain/version-context";
import { validateRoutineSafety } from "@/lib/safety/claim-guardrails";
import { detectRoutineConflicts } from "@/lib/recommendation/conflict-checks";
import { gentleStartSafetyMessages, shouldUseGentleStart } from "@/lib/recommendation/gentle-start";
import { matchProductOptions } from "@/lib/recommendation/product-matching";

function hashProfile(profile: OnboardingAnswers) {
  const input = JSON.stringify(profile);
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}

function buildStep(
  id: string,
  role: RoutineStep["role"],
  title: string,
  timeOfUse: RoutineStep["timeOfUse"],
  products: CatalogProduct[],
  profile: OnboardingAnswers,
): RoutineStep {
  const productOptions = matchProductOptions(products, profile, role);
  const noSafeMatchReason = productOptions.length === 0 ? "no-eligible-product" : null;

  return {
    id,
    role,
    routineStep:
      role === "cleanser"
        ? "cleanse"
        : role === "moisturizer"
          ? "hydrate"
          : role === "sunscreen"
            ? "protect"
            : "support",
    title,
    timeOfUse,
    frequency: "Daily",
    state: noSafeMatchReason ? "no-safe-match" : "recommended",
    productOptions,
    noSafeMatchReason,
    cautions: [],
    explanationRefs: [{ key: `${role}-basic`, label: title }],
    conflictRefs: [],
  };
}

export function generateStarterRoutine({
  profile,
  products,
  versionContext,
  generatedAt = new Date().toISOString(),
}: {
  profile: OnboardingAnswers;
  products: CatalogProduct[];
  versionContext: RoutineVersionContext;
  generatedAt?: string;
}): GeneratedRoutine {
  const variant: RoutineVariant = shouldUseGentleStart(profile)
    ? "gentle-start"
    : "standard";
  const includeSupport =
    !shouldUseGentleStart(profile) &&
    (profile.concerns.includes("blemishes") ||
      profile.concerns.includes("poresOiliness") ||
      profile.acneOilinessSignals.some((signal) => signal !== "none" && signal !== "notSure"));

  const amSteps: RoutineStep[] = [
    buildStep("am-cleanse", "cleanser", "Cleanse", "am", products, profile),
    buildStep("am-hydrate", "moisturizer", "Hydrate", "am", products, profile),
    buildStep("am-protect", "sunscreen", "Protect", "am", products, profile),
  ];
  const pmSteps: RoutineStep[] = [
    buildStep("pm-cleanse", "cleanser", "Cleanse", "pm", products, profile),
    buildStep("pm-hydrate", "moisturizer", "Hydrate", "pm", products, profile),
  ];

  if (includeSupport) {
    pmSteps.push(buildStep("pm-support", "support", "Support", "pm", products, profile));
  }

  const sections: RoutineSection[] = [
    { id: "am", title: "AM", steps: amSteps },
    { id: "pm", title: "PM", steps: pmSteps },
  ];
  const flatSteps = sections.flatMap((section) => section.steps);
  const conflicts = detectRoutineConflicts(profile, flatSteps);
  const stepsWithConflicts = flatSteps.map((step) => ({
    ...step,
    conflictRefs: conflicts.filter((conflict) => conflict.stepId === step.id),
    state: conflicts.some((conflict) => conflict.stepId === step.id && conflict.severity === "block")
      ? "caution"
      : step.state,
    cautions: conflicts
      .filter((conflict) => conflict.stepId === step.id)
      .map((conflict) => conflict.message),
  }));
  const routine: GeneratedRoutine = {
    id: `routine-${hashProfile(profile)}`,
    profileHash: hashProfile(profile),
    profileSnapshot: profile,
    variant,
    state: flatSteps.some((step) => step.state === "no-safe-match") ? "no-safe-match" : "ready",
    versionContext,
    conflicts,
    safetyMessages: variant === "gentle-start" ? gentleStartSafetyMessages : [],
    generatedAt,
    sections: sections.map((section) => ({
      ...section,
      steps: stepsWithConflicts.filter((step) => step.timeOfUse === section.id),
    })),
  };

  return validateRoutineSafety(routine, profile);
}
