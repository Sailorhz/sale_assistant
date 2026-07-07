import { describe, expect, it } from "vitest";

import { emptyOnboardingAnswers } from "@/lib/domain/skin-profile";
import type { GeneratedRoutine, RoutineStep } from "@/lib/domain/routine";
import {
  hasHighRiskSignals,
  isApprovedCosmeticCopy,
  validateRoutineSafety,
} from "@/lib/safety/claim-guardrails";

describe("isApprovedCosmeticCopy", () => {
  it("allows legitimate cosmetic phrasing", () => {
    for (const copy of [
      "Helps prevent dryness and supports the skin barrier.",
      "Start with cleanse, hydrate, and protect before adding stronger actives.",
      "Lightweight daily treatment-free moisturizer.",
      "Patch-test new products and introduce one change at a time.",
      "Gently treat the under-eye area each morning.",
      "Treat the T-zone with a lightweight gel.",
      "Apply morning and night to treat the skin gently.",
      "A calming serum to treat the delicate eye area.",
      "This helps with your treatment plan.",
      "A gentle way to heal your skin barrier.",
      "This may help heal minor irritation.",
      "Reverses signs of aging.",
      "Acne-prone skin needs a gentle routine.",
      "curated products for you",
    ]) {
      expect(isApprovedCosmeticCopy(copy)).toBe(true);
    }
  });

  it("blocks medical claims", () => {
    for (const copy of [
      "Treats acne fast.",
      "A treatment for eczema.",
      "Cures redness overnight.",
      "Diagnoses your skin condition.",
      "Prevents acne breakouts.",
      "This routine will treat the condition.",
      "Designed to treat the disease.",
      "Treat the infection at its source.",
      "Eczema treatment recommended.",
      "An acne treatment cream.",
      "Rosacea treatments that work.",
      "Disease-free formula.",
      "Prevention of infection is key.",
    ]) {
      expect(isApprovedCosmeticCopy(copy)).toBe(false);
    }
  });

  it("is case-insensitive", () => {
    expect(isApprovedCosmeticCopy("TREATS ACNE FAST.")).toBe(false);
    expect(isApprovedCosmeticCopy("CURES REDNESS OVERNIGHT.")).toBe(false);
  });

  it("does not false-positive on substrings of blocked words", () => {
    for (const copy of [
      "diagnostics dashboard for admins",
      "curated products for you",
      "before adding stronger actives",
    ]) {
      expect(isApprovedCosmeticCopy(copy)).toBe(true);
    }
  });
});

describe("hasHighRiskSignals", () => {
  it("is false when there are no signals", () => {
    expect(hasHighRiskSignals(emptyOnboardingAnswers)).toBe(false);
  });

  it("is false when every signal is 'none'", () => {
    expect(
      hasHighRiskSignals({
        ...emptyOnboardingAnswers,
        seriousSymptomSignals: ["none"],
      }),
    ).toBe(false);
  });

  it("is true when any signal is not 'none'", () => {
    expect(
      hasHighRiskSignals({
        ...emptyOnboardingAnswers,
        seriousSymptomSignals: ["none", "painfulOrSpreading"],
      }),
    ).toBe(true);
  });
});

const versionContext = {
  catalogVersionId: "11111111-1111-4111-8111-111111111111",
  catalogVersionKey: "catalog-test",
  ruleVersionId: "22222222-2222-4222-8222-222222222222",
  ruleVersionKey: "rules-test",
};

function buildStep(overrides: Partial<RoutineStep> = {}): RoutineStep {
  return {
    id: "cleanse-am",
    role: "cleanser",
    routineStep: "cleanse",
    title: "Cleanse",
    timeOfUse: "am",
    frequency: "daily",
    state: "recommended",
    productOptions: [],
    noSafeMatchReason: null,
    cautions: [],
    explanationRefs: [],
    conflictRefs: [],
    ...overrides,
  };
}

function buildRoutine(overrides: Partial<GeneratedRoutine> = {}): GeneratedRoutine {
  return {
    id: "routine-1",
    profileHash: "hash",
    variant: "standard",
    state: "ready",
    sections: [{ id: "am", title: "Morning", steps: [buildStep()] }],
    versionContext,
    conflicts: [],
    safetyMessages: [],
    generatedAt: "2026-05-19T00:00:00.000Z",
    ...overrides,
  };
}

describe("validateRoutineSafety", () => {
  it("passes through a routine with approved copy", () => {
    const routine = buildRoutine();
    expect(validateRoutineSafety(routine, emptyOnboardingAnswers)).toEqual(routine);
  });

  it("blocks the routine when a high-risk symptom signal is present", () => {
    const routine = buildRoutine({
      sections: [
        {
          id: "am",
          title: "Morning",
          steps: [buildStep({ productOptions: [] })],
        },
      ],
    });
    const profile = {
      ...emptyOnboardingAnswers,
      seriousSymptomSignals: ["painfulOrSpreading" as const],
    };

    const result = validateRoutineSafety(routine, profile);

    expect(result.state).toBe("safety-blocked");
    expect(result.sections[0].steps[0].state).toBe("safety-blocked");
    expect(result.sections[0].steps[0].productOptions).toEqual([]);
  });

  it("blocks the routine when a step's caution copy fails the cosmetic-claim guardrail", () => {
    const routine = buildRoutine({
      sections: [
        {
          id: "am",
          title: "Morning",
          steps: [buildStep({ cautions: ["This treatment for eczema is not appropriate here."] })],
        },
      ],
    });

    const result = validateRoutineSafety(routine, emptyOnboardingAnswers);

    expect(result.state).toBe("safety-blocked");
  });

  it("blocks the routine when a product's fitNotes fail the cosmetic-claim guardrail", () => {
    const routine = buildRoutine({
      sections: [
        {
          id: "am",
          title: "Morning",
          steps: [
            buildStep({
              productOptions: [
                {
                  productId: "p1",
                  brandName: "Brand",
                  productName: "Product",
                  routineStep: "cleanse",
                  priceBand: "low",
                  retailerName: null,
                  productUrl: null,
                  availabilityStatus: "available",
                  fitNotes: ["Cures redness overnight."],
                  sourceProductUpdatedAt: "2026-05-19T00:00:00.000Z",
                },
              ],
            }),
          ],
        },
      ],
    });

    const result = validateRoutineSafety(routine, emptyOnboardingAnswers);

    expect(result.state).toBe("safety-blocked");
  });

  it("does not scan non-copy fields such as ids or version context", () => {
    const routine = buildRoutine({
      id: "cures-1",
      profileHash: "disease-hash",
      versionContext: {
        ...versionContext,
        catalogVersionKey: "cures-catalog",
      },
    });

    expect(validateRoutineSafety(routine, emptyOnboardingAnswers).state).toBe("ready");
  });

  it("prioritizes high-risk signal escalation over cosmetic-copy blocking", () => {
    const routine = buildRoutine({
      sections: [
        {
          id: "am",
          title: "Morning",
          steps: [buildStep({ cautions: ["Cures redness overnight."] })],
        },
      ],
    });
    const profile = {
      ...emptyOnboardingAnswers,
      seriousSymptomSignals: ["painfulOrSpreading" as const],
    };

    const result = validateRoutineSafety(routine, profile);

    expect(result.safetyMessages[0]).toContain("professional care");
  });
});
