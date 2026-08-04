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

  it("still includes low-band backfill when fewer than 3 products match the chosen band, flagged as backfill", () => {
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
      { ...baseProduct, id: "moderate-1", productName: "Moderate A", priceBand: "moderate", price: { amountMinor: 2000, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, profile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["moderate-1", "low-1"]);
    expect(options.find((option) => option.productId === "moderate-1")?.isBudgetBackfill).toBe(false);
    expect(options.find((option) => option.productId === "low-1")?.isBudgetBackfill).toBe(true);
  });

  it("falls back to plain price ordering when the user has no explicit budget preference", () => {
    const flexibleProfile: OnboardingAnswers = { ...profile, budget: "flexible" };
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "moderate-1", productName: "Moderate A", priceBand: "moderate", price: { amountMinor: 2000, currency: "EUR" } },
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, flexibleProfile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["low-1", "moderate-1"]);
    expect(options.every((option) => option.isBudgetBackfill === false)).toBe(true);
  });

  it("excludes premium products entirely when the user has an explicit lower budget", () => {
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "premium-1", productName: "Premium A", priceBand: "premium", price: { amountMinor: 5000, currency: "EUR" } },
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, profile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["low-1"]);
  });

  it("ranks both premium and luxury bands ahead of low-band backfill for a premium budget", () => {
    const premiumProfile: OnboardingAnswers = { ...profile, budget: "premium" };
    const products: CatalogProduct[] = [
      { ...baseProduct, id: "low-1", productName: "Low A", priceBand: "low", price: { amountMinor: 500, currency: "EUR" } },
      { ...baseProduct, id: "moderate-1", productName: "Moderate A", priceBand: "moderate", price: { amountMinor: 1500, currency: "EUR" } },
      { ...baseProduct, id: "luxury-1", productName: "Luxury A", priceBand: "luxury", price: { amountMinor: 15000, currency: "EUR" } },
      { ...baseProduct, id: "premium-1", productName: "Premium A", priceBand: "premium", price: { amountMinor: 5000, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, premiumProfile, "cleanser");

    expect(options.map((option) => option.productId)).toEqual(["premium-1", "luxury-1", "low-1"]);
    expect(options.find((option) => option.productId === "premium-1")?.isBudgetBackfill).toBe(false);
    expect(options.find((option) => option.productId === "luxury-1")?.isBudgetBackfill).toBe(false);
    expect(options.find((option) => option.productId === "low-1")?.isBudgetBackfill).toBe(true);
  });
});

describe("matchProductOptions texture ranking", () => {
  const moisturizerProduct = { ...baseProduct, routineStep: "hydrate" as const, productCategory: "moisturizer" as const };

  it("ranks a rich-texture product behind a plain one for oily skin, and flags the reason", () => {
    const oilyProfile: OnboardingAnswers = { ...profile, skinType: "oily" };
    const products: CatalogProduct[] = [
      { ...moisturizerProduct, id: "rich-1", productName: "Rich Cream", functionTags: ["hydrating", "rich-texture"], price: { amountMinor: 1000, currency: "EUR" } },
      { ...moisturizerProduct, id: "gel-1", productName: "Light Gel", functionTags: ["hydrating", "lightweight-texture"], price: { amountMinor: 2000, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, oilyProfile, "moisturizer");

    expect(options.map((option) => option.productId)).toEqual(["gel-1", "rich-1"]);
    expect(options.find((option) => option.productId === "rich-1")?.textureMismatchReason).toBe(
      "richer-than-typical-for-oily-skin",
    );
    expect(options.find((option) => option.productId === "gel-1")?.textureMismatchReason).toBeNull();
  });

  it("still shows a rich-texture product for oily skin if it's the only eligible option -- never fully excluded", () => {
    const oilyProfile: OnboardingAnswers = { ...profile, skinType: "oily" };
    const products: CatalogProduct[] = [
      { ...moisturizerProduct, id: "rich-1", productName: "Rich Cream", functionTags: ["hydrating", "rich-texture"] },
    ];

    const options = matchProductOptions(products, oilyProfile, "moisturizer");

    expect(options.map((option) => option.productId)).toEqual(["rich-1"]);
    expect(options[0].textureMismatchReason).toBe("richer-than-typical-for-oily-skin");
  });

  it("ranks a lightweight-texture product behind a plain one for dry skin", () => {
    const dryProfile: OnboardingAnswers = { ...profile, skinType: "dry" };
    const products: CatalogProduct[] = [
      { ...moisturizerProduct, id: "gel-1", productName: "Light Gel", functionTags: ["hydrating", "lightweight-texture"], price: { amountMinor: 1000, currency: "EUR" } },
      { ...moisturizerProduct, id: "rich-1", productName: "Rich Cream", functionTags: ["hydrating", "rich-texture"], price: { amountMinor: 2000, currency: "EUR" } },
    ];

    const options = matchProductOptions(products, dryProfile, "moisturizer");

    expect(options.map((option) => option.productId)).toEqual(["rich-1", "gel-1"]);
    expect(options.find((option) => option.productId === "gel-1")?.textureMismatchReason).toBe(
      "lighter-than-typical-for-dry-skin",
    );
  });

  it("never flags a texture mismatch for balanced or not-sure skin types", () => {
    for (const skinType of ["balanced", "notSure"] as const) {
      const neutralProfile: OnboardingAnswers = { ...profile, skinType };
      const products: CatalogProduct[] = [
        { ...moisturizerProduct, id: "rich-1", functionTags: ["hydrating", "rich-texture"] },
        { ...moisturizerProduct, id: "gel-1", functionTags: ["hydrating", "lightweight-texture"] },
      ];

      const options = matchProductOptions(products, neutralProfile, "moisturizer");

      expect(options.every((option) => option.textureMismatchReason === null)).toBe(true);
    }
  });

  it("ranks texture fit ahead of budget fit when they disagree", () => {
    const oilyProfile: OnboardingAnswers = { ...profile, skinType: "oily", budget: "moderate" };
    const products: CatalogProduct[] = [
      // Matches the chosen budget band exactly, but texturally wrong for oily skin.
      { ...moisturizerProduct, id: "rich-moderate", priceBand: "moderate", functionTags: ["rich-texture"] },
      // Only gets through via the low-band-always-shown rule (budget backfill), but texturally right.
      { ...moisturizerProduct, id: "gel-low", priceBand: "low", functionTags: ["lightweight-texture"] },
    ];

    const options = matchProductOptions(products, oilyProfile, "moisturizer");

    expect(options.map((option) => option.productId)).toEqual(["gel-low", "rich-moderate"]);
  });
});
