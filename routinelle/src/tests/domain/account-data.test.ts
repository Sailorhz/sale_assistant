import { describe, expect, it } from "vitest";

import { buildAccountDataSummary } from "@/lib/domain/account-data";

const NO_DATA = { hasSkinProfile: false, hasSavedRoutines: false, hasCheckIns: false };
const ALL_DATA = { hasSkinProfile: true, hasSavedRoutines: true, hasCheckIns: true };

describe("buildAccountDataSummary", () => {
  it("reports nothing stored when the user genuinely has no data", () => {
    const summary = buildAccountDataSummary(null, NO_DATA);

    for (const label of ["Skin profile answers", "Saved routine history", "Outcome and check-in history"]) {
      const item = summary.items.find((entry) => entry.label === label);
      expect(item?.status).toBe("Not stored");
    }
  });

  it("reports each category as stored once the user has real data, instead of claiming nothing is saved", () => {
    const summary = buildAccountDataSummary(null, ALL_DATA);

    for (const label of ["Skin profile answers", "Saved routine history", "Outcome and check-in history"]) {
      const item = summary.items.find((entry) => entry.label === label);
      expect(item?.status).toBe("Stored");
      expect(item?.detail).not.toMatch(/not implemented|no .* exists yet/i);
    }
  });

  it("prioritizes an open deletion request over presence for every category", () => {
    const deletionRequest = {
      id: "req-1",
      status: "requested" as const,
      requestedAt: "2026-08-04T00:00:00Z",
      completedAt: null,
      requestNote: null,
    };

    const summary = buildAccountDataSummary(deletionRequest, ALL_DATA);

    for (const item of summary.items.slice(0, 3)) {
      expect(item.status).toBe("Deletion requested");
    }
  });

  it("always reports photos as not collected, independent of presence", () => {
    const summary = buildAccountDataSummary(null, ALL_DATA);
    const photos = summary.items.find((entry) => entry.label === "Photos");

    expect(photos?.status).toBe("Not collected");
  });
});
