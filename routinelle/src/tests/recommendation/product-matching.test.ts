import { describe, expect, it } from "vitest";

import type { CatalogProduct } from "@/lib/domain/catalog-product";
import { emptyOnboardingAnswers } from "@/lib/domain/skin-profile";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";
import { matchProductOptions } from "@/lib/recommendation/product-matching";

const baseProduct: CatalogProduct = {
  id: "product-1",
  brandName: "Routinelle Lab",
  productName: "Cleanser",
  productCategory: "cleanser",
  routineStep: "cleanse",
  inciList: ["Aqua"],
  keyIngredients: [],
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

const profile: OnboardingAnswers = {
  ...emptyOnboardingAnswers,
  budget: "moderate",
  localMarket: "france",
};

describe("matchProductOptions budget ranking", () => {
  it("does not let cheap low-band products crowd out the user's chosen band", () => {
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
      { ...baseProduct, id: "low-2", productName: "Low B", priceBand: "low", price: { amountMinor: 600, currency: "EUR" } },
      { ...baseProduct, id: "low-3", productName: "Low C", priceBand: "low", price: { amountMinor: 700, currency: "EUR" } },
      { ...baseProduct, id: "moderate-1", productName: "Moderate A", priceBand: "moderate", price: { amountMinor: 2000, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, profile, "cleanser");

    expect(options).toHaveLength(3);
    expect(options[0].productId).toBe("moderate-1");
    expect(options.map((option) => option.productId)).toEqual(
      expect.arrayContaining(["moderate-1", "low-1", "low-2"]),
    );
  });

  it("still includes low-band backfill when fewer than 3 products match the chosen band", () => {
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
      { ...baseProduct, id: "moderate-1", productName: "Moderate A", priceBand: "moderate", price: { amountMinor: 2000, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, profile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["moderate-1", "low-1"]);
  });

  it("falls back to plain price ordering when the user has no explicit budget preference", () => {
    const flexibleProfile: OnboardingAnswers = { ...profile, budget: "flexible" };
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "moderate-1", productName: "Moderate A", priceBand: "moderate", price: { amountMinor: 2000, currency: "EUR" } },
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, flexibleProfile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["low-1", "moderate-1"]);
  });

  it("excludes premium products entirely when the user has an explicit lower budget", () => {
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "premium-1", productName: "Premium A", priceBand: "premium", price: { amountMinor: 5000, currency: "EUR" } },
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, profile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["low-1"]);
  });
});
