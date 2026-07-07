import type { GeneratedRoutine, RoutineStep } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

/**
 * Medical-claim patterns that violate Routinelle's cosmetic-only scope.
 *
 * These target claim-like *phrasing* (e.g. "treats acne", "cures eczema"),
 * not isolated words, so legitimate cosmetic copy such as "helps prevent
 * dryness" or "before adding stronger actives" is not falsely blocked.
 * The few unambiguous single words (diagnose / cure / disease) stay strict.
 */
const blockedCopyPatterns: RegExp[] = [
  /\bdiagnos(?:e|es|is|ing|tic)\b/i,
  /\bcure(?:s|d)?\b/i,
  /\bdisease(?:s)?\b/i,
  // "treat" only when it reads as a medical claim: treat + a named condition,
  // or "treatment for/of ...". Plain cosmetic uses like "treat the T-zone" or
  // "gentle treatment-free" won't match — only "the condition/disease/infection" does.
  /\btreat(?:s|ing|ed)?\b\s+(?:acne|eczema|rosacea|psoriasis|dermatitis|an?\s+\w+\s+condition|the\s+(?:condition|disease|infection))/i,
  /\btreatment\s+(?:for|of)\b/i,
  /\b(?:acne|eczema|rosacea|psoriasis|dermatitis)\s+treatments?\b/i,
  // Explicit disease-prevention / -healing claims (cosmetic "prevent dryness" is fine).
  /\b(?:prevent|heal|reverse)s?\s+(?:acne|eczema|rosacea|psoriasis|dermatitis|disease|infection)/i,
  /\bprevention\s+(?:of|for)\b/i,
];

/**
 * Collect only the user-visible free-text copy from a routine.
 *
 * Deliberately excludes enum codes, field keys, IDs, product metadata, and the
 * profile snapshot — scanning those (as the old JSON.stringify did) caused false
 * blocks on Routinelle's own generated strings.
 */
function collectRoutineCopy(routine: GeneratedRoutine): string[] {
  const copy: string[] = [];

  copy.push(...routine.safetyMessages);
  copy.push(...routine.conflicts.map((conflict) => conflict.message));

  const collectStep = (step: RoutineStep) => {
    copy.push(step.title);
    copy.push(...step.cautions);
    copy.push(...step.explanationRefs.map((ref) => ref.label));
    copy.push(...step.conflictRefs.map((conflict) => conflict.message));
    // Product fitNotes are approved catalog copy shown to the user.
    copy.push(...step.productOptions.flatMap((option) => option.fitNotes));
  };

  for (const section of routine.sections) {
    for (const step of section.steps) {
      collectStep(step);
    }
  }

  return copy.filter((text) => typeof text === "string" && text.trim().length > 0);
}

/**
 * True when a single piece of copy stays within cosmetic scope.
 * Exported so catalog-copy validation (Epic 3) can reuse the same rule.
 */
export function isApprovedCosmeticCopy(copy: string): boolean {
  return !blockedCopyPatterns.some((pattern) => pattern.test(copy));
}

export function hasHighRiskSignals(profile: OnboardingAnswers): boolean {
  return profile.seriousSymptomSignals.some((signal) => signal !== "none");
}

/**
 * Final safety gate before a routine is displayed or persisted.
 *
 * Order matters: high-risk symptom escalation takes precedence over everything
 * else, because those users should be routed to professional care rather than
 * shown any product guidance.
 */
export function validateRoutineSafety(
  routine: GeneratedRoutine,
  profile: OnboardingAnswers,
): GeneratedRoutine {
  if (hasHighRiskSignals(profile)) {
    return {
      ...routine,
      state: "safety-blocked",
      safetyMessages: [
        "Based on your answers, Routinelle should pause routine guidance and suggest professional care before product changes.",
      ],
      sections: routine.sections.map((section) => ({
        ...section,
        steps: section.steps.map((step) => ({
          ...step,
          state: "safety-blocked",
          productOptions: [],
        })),
      })),
    };
  }

  const offendingCopy = collectRoutineCopy(routine).find(
    (text) => !isApprovedCosmeticCopy(text),
  );

  if (offendingCopy) {
    return {
      ...routine,
      state: "safety-blocked",
      safetyMessages: [
        "Routine copy failed cosmetic-scope guardrails and cannot be displayed.",
      ],
    };
  }

  return routine;
}
