import { describe, expect, it } from "vitest";

import { buildAnalyticsEvent } from "@/lib/analytics/events";

describe("buildAnalyticsEvent", () => {
  it("keeps only allowlisted payload keys", () => {
    const event = buildAnalyticsEvent("routine.generated", {
      routineId: "routine-1",
      routineState: "ready",
      freeTextSymptom: "burning near my eyes",
      nested: { unsafe: true },
    });

    expect(event.payload).toEqual({
      routineId: "routine-1",
      routineState: "ready",
    });
  });

  it("rejects unsupported event names", () => {
    expect(() =>
      buildAnalyticsEvent("unknown.event" as never, { routineId: "routine-1" }),
    ).toThrow("Unsupported analytics event.");
  });
});
