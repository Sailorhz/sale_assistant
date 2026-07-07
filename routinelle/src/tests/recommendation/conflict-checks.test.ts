import { describe, expect, it } from "vitest";

import { emptyOnboardingAnswers } from "@/lib/domain/skin-profile";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";
import { detectRoutineConflicts } from "@/lib/recommendation/conflict-checks";

describe("detectRoutineConflicts", () => {
  it("returns no conflicts for a plain profile with no current-routine actives", () => {
    expect(detectRoutineConflicts(emptyOnboardingAnswers)).toEqual([]);
  });

  it("flags too-many-actives as a caution when there is no barrier risk", () => {
    const profile: OnboardingAnswers = {
      ...emptyOnboardingAnswers,
      currentRoutineProductTypes: ["exfoliant", "retinoid", "vitaminCBrightening"],
    };

    const conflicts = detectRoutineConflicts(profile);

    expect(conflicts).toContainEqual(
      expect.objectContaining({ code: "too-many-actives", severity: "caution" }),
    );
  });

  it("escalates too-many-actives to block when barrier-risk signals are present", () => {
    const profile: OnboardingAnswers = {
      ...emptyOnboardingAnswers,
      currentRoutineProductTypes: ["exfoliant", "retinoid", "vitaminCBrightening"],
      sensitivity: "currentlyUncomfortable",
    };

    const conflicts = detectRoutineConflicts(profile);

    expect(conflicts).toContainEqual(
      expect.objectContaining({ code: "too-many-actives", severity: "block" }),
    );
  });

  it("flags duplicate-active when both exfoliant and retinoid are in the current routine", () => {
    const profile: OnboardingAnswers = {
      ...emptyOnboardingAnswers,
      currentRoutineProductTypes: ["exfoliant", "retinoid"],
    };

    const conflicts = detectRoutineConflicts(profile);

    expect(conflicts).toContainEqual(
      expect.objectContaining({ code: "duplicate-active", severity: "caution" }),
    );
  });
});
