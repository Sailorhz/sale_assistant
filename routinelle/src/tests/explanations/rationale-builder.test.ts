import { describe, expect, it } from "vitest";

import { buildRoutineExplanationBundle } from "@/lib/explanations/rationale-builder";
import type { GeneratedRoutine, RoutineProductOption, RoutineStep } from "@/lib/domain/routine";
import { emptyOnboardingAnswers } from "@/lib/domain/skin-profile";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

const versionContext = {
  catalogVersionId: "11111111-1111-4111-8111-111111111111",
  catalogVersionKey: "catalog-test",
  ruleVersionId: "22222222-2222-4222-8222-222222222222",
  ruleVersionKey: "rules-test",
};

const baseOption: RoutineProductOption = {
  productId: "p1",
  brandName: "Brand",
  productName: "Product",
  routineStep: "cleanse",
  priceBand: "low",
  retailerName: null,
  productUrl: null,
  availabilityStatus: "available",
  fitNotes: [],
  sourceProductUpdatedAt: "2026-05-19T00:00:00.000Z",
  isBudgetBackfill: false,
  textureMismatchReason: null,
};

function buildStep(productOptions: RoutineProductOption[]): RoutineStep {
  return {
    id: "cleanse-am",
    role: "cleanser",
    routineStep: "cleanse",
    title: "Cleanse",
    timeOfUse: "am",
    frequency: "daily",
    state: "recommended",
    productOptions,
    noSafeMatchReason: null,
    cautions: [],
    explanationRefs: [],
    conflictRefs: [],
  };
}

function buildRoutine(productOptions: RoutineProductOption[]): GeneratedRoutine {
  return {
    id: "routine-1",
    profileHash: "hash",
    variant: "standard",
    state: "ready",
    sections: [{ id: "am", title: "Morning", steps: [buildStep(productOptions)] }],
    versionContext,
    conflicts: [],
    safetyMessages: [],
    generatedAt: "2026-05-19T00:00:00.000Z",
  };
}

describe("buildRoutineExplanationBundle: budget-fit badge", () => {
  it("does not tag a low-band backfill product as budget-fit when the user asked for premium", () => {
    const profile: OnboardingAnswers = { ...emptyOnboardingAnswers, budget: "premium" };
    const routine = buildRoutine([{ ...baseOption, priceBand: "low", isBudgetBackfill: true }]);

    const bundle = buildRoutineExplanationBundle(routine, profile);

    expect(bundle.productRationales[0].fitBadges).not.toContain("budget-fit");
  });

  it("still tags a genuinely matching product as budget-fit", () => {
    const profile: OnboardingAnswers = { ...emptyOnboardingAnswers, budget: "premium" };
    const routine = buildRoutine([
      { ...baseOption, priceBand: "premium", isBudgetBackfill: false },
    ]);

    const bundle = buildRoutineExplanationBundle(routine, profile);

    expect(bundle.productRationales[0].fitBadges).toContain("budget-fit");
  });

  it("tags a low-band product as budget-fit when the user's own budget is low", () => {
    const profile: OnboardingAnswers = { ...emptyOnboardingAnswers, budget: "low" };
    const routine = buildRoutine([{ ...baseOption, priceBand: "low", isBudgetBackfill: false }]);

    const bundle = buildRoutineExplanationBundle(routine, profile);

    expect(bundle.productRationales[0].fitBadges).toContain("budget-fit");
  });

  it("tags every product as budget-fit when the user has no explicit budget preference", () => {
    const profile: OnboardingAnswers = { ...emptyOnboardingAnswers, budget: "flexible" };
    const routine = buildRoutine([{ ...baseOption, priceBand: "low", isBudgetBackfill: false }]);

    const bundle = buildRoutineExplanationBundle(routine, profile);

    expect(bundle.productRationales[0].fitBadges).toContain("budget-fit");
  });
});
