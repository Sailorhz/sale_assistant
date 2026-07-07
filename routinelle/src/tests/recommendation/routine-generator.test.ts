import { describe, expect, it } from "vitest";

import type { CatalogProduct } from "@/lib/domain/catalog-product";
import { emptyOnboardingAnswers } from "@/lib/domain/skin-profile";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";
import { generateStarterRoutine } from "@/lib/recommendation/routine-generator";
import { routineToApiResult, sampleRoutineContract } from "@/lib/recommendation/routine-contract";

const versionContext = {
  catalogVersionId: "11111111-1111-4111-8111-111111111111",
  catalogVersionKey: "catalog-test",
  ruleVersionId: "22222222-2222-4222-8222-222222222222",
  ruleVersionKey: "rules-test",
};

const baseProduct: CatalogProduct = {
  id: "cleanser-1",
  brandName: "Routinelle Lab",
  productName: "Soft Cleanser",
  productCategory: "cleanser",
  routineStep: "cleanse",
  inciList: ["Aqua", "Glycerin"],
  keyIngredients: ["Glycerin"],
  functionTags: ["gentle"],
  cautionTags: [],
  verifiedClaims: [{ claim: "Cosmetic cleanser" }],
  price: { amountMinor: 900, currency: "EUR" },
  priceBand: "low",
  size: { value: 150, unit: "ml" },
  costPerUnit: { amountMinor: 6, currency: "EUR", unit: "ml" },
  market: "france",
  availabilityStatus: "available",
  retailerName: null,
  productUrl: null,
  sourceUrl: null,
  lastVerifiedAt: "2026-05-19T00:00:00.000Z",
  nextReviewAt: null,
  formulaStatus: "stable",
  formulaChangedAt: null,
  dataFreshnessStatus: "current",
  dataFreshnessNotes: null,
  publicationStatus: "published",
  publishedAt: "2026-05-19T00:00:00.000Z",
  unpublishedAt: null,
  reviewFlaggedAt: null,
  reviewReason: null,
  createdAt: "2026-05-19T00:00:00.000Z",
  updatedAt: "2026-05-19T00:00:00.000Z",
};

export const routineGeneratorFixtures = {
  serializedContract: routineToApiResult(sampleRoutineContract),
  noSafeMatchRoutine: generateStarterRoutine({
    profile: {
      ...emptyOnboardingAnswers,
      skinType: "balanced",
      concerns: ["hydration"],
      sensitivity: "rarelySensitive",
      acneOilinessSignals: ["none"],
      irritationBarrierSignals: ["none"],
      seriousSymptomSignals: ["none"],
      currentRoutineChoice: "skip",
      budget: "moderate",
      localMarket: "france",
    },
    products: [],
    versionContext,
  }),
  matchedRoutine: generateStarterRoutine({
    profile: {
      ...emptyOnboardingAnswers,
      skinType: "balanced",
      concerns: ["hydration"],
      sensitivity: "rarelySensitive",
      acneOilinessSignals: ["none"],
      irritationBarrierSignals: ["none"],
      seriousSymptomSignals: ["none"],
      currentRoutineChoice: "skip",
      budget: "low",
      localMarket: "france",
    },
    products: [
      baseProduct,
      { ...baseProduct, id: "moisturizer-1", productName: "Moisture", routineStep: "hydrate", productCategory: "moisturizer" },
      { ...baseProduct, id: "sunscreen-1", productName: "SPF", routineStep: "protect", productCategory: "sunscreen" },
    ],
    versionContext,
  }),
};

const completeProfile: OnboardingAnswers = {
  ...emptyOnboardingAnswers,
  skinType: "balanced",
  concerns: ["hydration"],
  sensitivity: "rarelySensitive",
  acneOilinessSignals: ["none"],
  irritationBarrierSignals: ["none"],
  seriousSymptomSignals: ["none"],
  currentRoutineChoice: "skip",
  budget: "low",
  localMarket: "france",
};

describe("generateStarterRoutine", () => {
  it("returns no-safe-match and preserves the profile snapshot when no products match", () => {
    const routine = generateStarterRoutine({
      profile: completeProfile,
      products: [],
      versionContext,
      generatedAt: "2026-05-19T00:00:00.000Z",
    });

    expect(routine.state).toBe("no-safe-match");
    expect(routine.profileSnapshot).toEqual(completeProfile);
    expect(routine.sections.flatMap((section) => section.steps)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "cleanser", state: "no-safe-match" }),
        expect.objectContaining({ role: "moisturizer", state: "no-safe-match" }),
        expect.objectContaining({ role: "sunscreen", state: "no-safe-match" }),
      ]),
    );
  });

  it("builds a ready cleanse-hydrate-protect routine from eligible published products", () => {
    const products: CatalogProduct[] = [
      baseProduct,
      {
        ...baseProduct,
        id: "moisturizer-1",
        productName: "Moisture",
        routineStep: "hydrate",
        productCategory: "moisturizer",
      },
      {
        ...baseProduct,
        id: "sunscreen-1",
        productName: "SPF",
        routineStep: "protect",
        productCategory: "sunscreen",
      },
    ];

    const routine = generateStarterRoutine({
      profile: completeProfile,
      products,
      versionContext,
      generatedAt: "2026-05-19T00:00:00.000Z",
    });
    const steps = routine.sections.flatMap((section) => section.steps);

    expect(routine.state).toBe("ready");
    expect(steps).toHaveLength(5);
    expect(steps.every((step) => step.productOptions.length > 0)).toBe(true);
    expect(routineToApiResult(sampleRoutineContract).ok).toBe(true);
  });
});
