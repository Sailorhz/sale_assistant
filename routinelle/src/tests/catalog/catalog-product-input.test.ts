import { describe, expect, it } from "vitest";

import {
  validateCatalogProductForSave,
  validateCatalogProductInput,
  type CatalogProductInput,
} from "@/lib/catalog/catalog-product-input";

const completeInput: CatalogProductInput = {
  brandName: "Walkthrough Labs",
  productName: "Focus Support Gel",
  productCategory: "serum",
  routineStep: "support",
  inciList: ["Aqua", "Niacinamide"],
  keyIngredients: ["Niacinamide"],
  functionTags: ["blemish-support", "hydrating"],
  cautionTags: [],
  verifiedClaims: [{ claim: "Cosmetic blemish support" }],
  priceAmountMinor: 1200,
  priceCurrency: "EUR",
  priceBand: "moderate",
  sizeValue: 30,
  sizeUnit: "ml",
  costPerUnitAmountMinor: null,
  costPerUnitUnit: "ml",
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
  reviewReason: null,
};

describe("validateCatalogProductForSave", () => {
  it("allows saving a draft product with complete structural data", () => {
    const result = validateCatalogProductForSave({
      ...completeInput,
      publicationStatus: "draft",
    });

    expect(result.status).toBe("eligible");
  });

  it("allows saving an unpublished or review-flagged product", () => {
    expect(
      validateCatalogProductForSave({ ...completeInput, publicationStatus: "unpublished" })
        .status,
    ).toBe("eligible");
    expect(
      validateCatalogProductForSave({ ...completeInput, publicationStatus: "review" }).status,
    ).toBe("eligible");
  });

  it("allows saving an unavailable, stale, or high-caution product", () => {
    expect(
      validateCatalogProductForSave({ ...completeInput, availabilityStatus: "unavailable" })
        .status,
    ).toBe("eligible");
    expect(
      validateCatalogProductForSave({ ...completeInput, dataFreshnessStatus: "stale" }).status,
    ).toBe("eligible");
    expect(
      validateCatalogProductForSave({ ...completeInput, cautionTags: ["strong-active"] }).status,
    ).toBe("eligible");
  });

  it("still blocks saving when required structural fields are missing", () => {
    const result = validateCatalogProductForSave({
      ...completeInput,
      brandName: "",
      inciList: [],
    });

    expect(result.status).toBe("blocked");
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing-required-metadata", field: "brandName" }),
        expect.objectContaining({ code: "missing-required-metadata", field: "inciList" }),
      ]),
    );
  });
});

describe("validateCatalogProductInput (full recommendation eligibility)", () => {
  it("still reports a draft as not recommendation-eligible", () => {
    const result = validateCatalogProductInput({
      ...completeInput,
      publicationStatus: "draft",
    });

    expect(result.status).toBe("blocked");
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unpublished-product" })]),
    );
  });
});
