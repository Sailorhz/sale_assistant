import { describe, expect, it } from "vitest";

import { buildCatalogCoverageReport } from "@/lib/catalog/catalog-coverage";
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

describe("buildCatalogCoverageReport: productsMissingShoppingLink", () => {
  it("flags a published product with no product URL", () => {
    const report = buildCatalogCoverageReport([
      { ...baseProduct, id: "no-link", productUrl: null },
    ]);

    expect(report.productsMissingShoppingLink).toHaveLength(1);
    expect(report.productsMissingShoppingLink[0]).toMatchObject({
      productId: "no-link",
      brandName: "Routinelle Lab",
      productName: "Barrier Moisture Cream",
      market: "france",
      routineStep: "hydrate",
    });
  });

  it("also flags an empty-string product URL, not just null", () => {
    const report = buildCatalogCoverageReport([
      { ...baseProduct, id: "empty-link", productUrl: "" },
    ]);

    expect(report.productsMissingShoppingLink).toHaveLength(1);
  });

  it("does not flag a published product that has a shopping link", () => {
    const report = buildCatalogCoverageReport([{ ...baseProduct, id: "has-link" }]);

    expect(report.productsMissingShoppingLink).toHaveLength(0);
  });

  it("does not flag a draft product missing a link -- it isn't reachable by users yet", () => {
    const report = buildCatalogCoverageReport([
      { ...baseProduct, id: "draft-no-link", productUrl: null, publicationStatus: "draft" },
    ]);

    expect(report.productsMissingShoppingLink).toHaveLength(0);
  });
});
