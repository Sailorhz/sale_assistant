import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export function shouldUseGentleStart(profile: OnboardingAnswers) {
  return (
    profile.sensitivity === "oftenSensitive" ||
    profile.sensitivity === "currentlyUncomfortable" ||
    profile.irritationBarrierSignals.some((signal) =>
      ["redness", "stingingOrBurning", "tightOrDry", "flakingOrRough", "recentStrongActives"].includes(signal),
    ) ||
    (profile.concerns.includes("blemishes") &&
      profile.concerns.includes("irritationRedness"))
  );
}

export const gentleStartSafetyMessages = [
  "Start with cleanse, hydrate, and protect before adding stronger actives.",
  "Patch-test new products and introduce one change at a time.",
];
