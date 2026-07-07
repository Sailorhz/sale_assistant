import type { RoutineConflict } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

export function detectRoutineConflicts(profile: OnboardingAnswers): RoutineConflict[] {
  const conflicts: RoutineConflict[] = [];
  const activeCount = profile.currentRoutineProductTypes.filter((type) =>
    ["exfoliant", "retinoid", "blemishActive", "vitaminCBrightening"].includes(type),
  ).length;
  // Barrier-risk signals (currentlyUncomfortable sensitivity, stinging/burning, redness,
  // flaking, recent strong actives) are a subset of shouldUseGentleStart's triggers in
  // gentle-start.ts, and gentle-start already drops the support step and adds its own
  // routine-level safety messaging. So a barrier-risk-specific conflict here would never
  // find a support step to attach to — the case is handled upstream instead.
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

  return conflicts;
}
