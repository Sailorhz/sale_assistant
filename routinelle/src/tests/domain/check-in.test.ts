import { describe, expect, it } from "vitest";

import {
  adjustedGuidanceFromCheckIn,
  summarizeCheckInOutcome,
} from "@/lib/domain/check-in";

describe("check-in outcome summary", () => {
  it("turns strong comfort signals into professional-care guidance", () => {
    const summary = summarizeCheckInOutcome({
      routineId: "routine-1",
      adherenceByStep: { cleanse: true, hydrate: false },
      dryness: "mild",
      redness: "strong",
      burning: "none",
      acneChange: "same",
      hydration: "worse",
      irritation: "none",
      suspectedProductDiscomfort: true,
      persistentOrWorsening: false,
    });

    expect(summary.adherenceRate).toBe(0.5);
    expect(summary.hasSeriousSignal).toBe(true);
    expect(summary.profileSignalUpdates).toContain("professional-care-guidance");
    expect(adjustedGuidanceFromCheckIn(summary)).toContain("seek professional care");
  });

  it("keeps mild discomfort below serious-signal threshold", () => {
    const summary = summarizeCheckInOutcome({
      routineId: "routine-1",
      adherenceByStep: { cleanse: true },
      dryness: "mild",
      redness: "none",
      burning: "none",
      acneChange: "same",
      hydration: "same",
      irritation: "none",
      suspectedProductDiscomfort: false,
      persistentOrWorsening: false,
    });

    expect(summary.hasSeriousSignal).toBe(false);
    expect(summary.hasMildDiscomfort).toBe(true);
    expect(adjustedGuidanceFromCheckIn(summary)).toContain("gentler");
  });
});
