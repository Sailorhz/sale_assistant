import type { GeneratedRoutine } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

const blockedCopyPatterns = [
  /\bdiagnos(e|is|tic)\b/i,
  /\btreat(ment|s|ing)?\b/i,
  /\bcure(s|d)?\b/i,
  /\bprevent(s|ion|ing)?\b/i,
  /\bdisease\b/i,
];

export function isApprovedCosmeticCopy(copy: string) {
  return !blockedCopyPatterns.some((pattern) => pattern.test(copy));
}

export function hasHighRiskSignals(profile: OnboardingAnswers) {
  return profile.seriousSymptomSignals.some((signal) => signal !== "none");
}

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

  const copy = JSON.stringify(routine);
  if (!isApprovedCosmeticCopy(copy)) {
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
