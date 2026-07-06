import type { RoutineConflict, RoutineStep } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export function detectRoutineConflicts(
  profile: OnboardingAnswers,
  steps: RoutineStep[],
): RoutineConflict[] {
  const conflicts: RoutineConflict[] = [];
  const activeCount = profile.currentRoutineProductTypes.filter((type) =>
    ["exfoliant", "retinoid", "blemishActive", "vitaminCBrightening"].includes(type),
  ).length;
  const barrierRisk =
    profile.sensitivity === "currentlyUncomfortable" ||
    profile.irritationBarrierSignals.some((signal) =>
      ["stingingOrBurning", "redness", "flakingOrRough", "recentStrongActives"].includes(signal),
    );

  if (activeCount >= 2) {
    conflicts.push({
      code: "too-many-actives",
      severity: barrierRisk ? "block" : "caution",
      message: "Current routine signals suggest too many active-style steps.",
    });
  }

  if (profile.currentRoutineProductTypes.includes("exfoliant") && profile.currentRoutineProductTypes.includes("retinoid")) {
    conflicts.push({
      code: "duplicate-active",
      severity: "caution",
      message: "Current routine includes exfoliant and retinoid-style products.",
    });
  }

  if (barrierRisk && steps.some((step) => step.role === "support")) {
    conflicts.push({
      code: "barrier-risk-active-pattern",
      severity: "block",
      message: "Barrier-risk answers require a conservative support step.",
      stepId: steps.find((step) => step.role === "support")?.id,
    });
  }

  return conflicts;
}
