import { describe, expect, it } from "vitest";

import { catalogEligibilityApiResult } from "@/lib/catalog/catalog-product-validation";
import type { CatalogProduct } from "@/lib/domain/catalog-product";

const baseProduct: CatalogProduct = {
  id: "fixture-product",
  brandName: "Routinelle Lab",
  productName: "Barrier Moisture Cream",
  productCategory: "moisturizer",
  routineStep: "hydrate",
  inciList: ["Aqua", "Glycerin", "Panthenol"],
  keyIngredients: ["Glycerin", "Panthenol"],
  functionTags: ["hydrating", "barrier-support"],
  cautionTags: [],
  verifiedClaims: [
    {
      claim: "Hydrating cosmetic moisturizer",
      sourceName: "Brand product page",
      verifiedAt: "2026-05-19T00:00:00.000Z",
    },
  ],
  price: { amountMinor: 1290, currency: "EUR" },
  priceBand: "moderate",
  size: { value: 50, unit: "ml" },
  costPerUnit: { amountMinor: 26, currency: "EUR", unit: "ml" },
  market: "france",
  availabilityStatus: "available",
  retailerName: "Example retailer",
  productUrl: "https://example.test/product",
  sourceUrl: "https://example.test/source",
  lastVerifiedAt: "2026-05-19T00:00:00.000Z",
  nextReviewAt: "2026-11-19T00:00:00.000Z",
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

export const catalogValidationFixtures = {
  eligibleProduct: catalogEligibilityApiResult(baseProduct),
  missingMetadataProduct: catalogEligibilityApiResult({
    ...baseProduct,
    inciList: [],
    functionTags: [],
  }),
  unavailableProduct: catalogEligibilityApiResult({
    ...baseProduct,
    availabilityStatus: "unavailable",
  }),
  staleProduct: catalogEligibilityApiResult({
    ...baseProduct,
    dataFreshnessStatus: "stale",
  }),
  unsafeFitProduct: catalogEligibilityApiResult({
    ...baseProduct,
    cautionTags: ["fragrance-heavy"],
  }),
  sensitiveExcludedButEligibleProduct: catalogEligibilityApiResult({
    ...baseProduct,
    cautionTags: ["strong-active"],
  }),
};

describe("catalogEligibilityApiResult", () => {
  it("allows complete, published, available products", () => {
    expect(catalogValidationFixtures.eligibleProduct.ok).toBe(true);
  });

  it("blocks products with missing required metadata", () => {
    const result = catalogValidationFixtures.missingMetadataProduct;

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("validation");
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: "missing-required-metadata" }),
        ]),
      );
    }
  });

  it("blocks unavailable, stale, or high-caution products", () => {
    expect(catalogValidationFixtures.unavailableProduct.ok).toBe(false);
    expect(catalogValidationFixtures.staleProduct.ok).toBe(false);
    expect(catalogValidationFixtures.unsafeFitProduct.ok).toBe(false);
  });

  it("does not hard-block strong-active/avoid-sensitive products (handled per-user in product-matching instead)", () => {
    expect(catalogValidationFixtures.sensitiveExcludedButEligibleProduct.ok).toBe(true);
  });
});
