import { evaluateCatalogProductEligibility } from "@/lib/catalog/catalog-product-validation";
import type { CatalogProduct } from "@/lib/domain/catalog-product";
import type { RoutineProductOption, RoutineStepRole } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

function marketMatches(product: CatalogProduct, profile: OnboardingAnswers) {
  return profile.localMarket === "notSure" || !profile.localMarket
    ? product.market === "france"
    : product.market === profile.localMarket;
}

function budgetMatches(product: CatalogProduct, profile: OnboardingAnswers) {
  if (profile.budget === "notSure" || !profile.budget || profile.budget === "flexible") {
    return true;
  }

  return product.priceBand === profile.budget || product.priceBand === "low";
}

function stepMatches(product: CatalogProduct, role: RoutineStepRole) {
  if (role === "cleanser") return product.routineStep === "cleanse";
  if (role === "moisturizer") return product.routineStep === "hydrate";
  if (role === "sunscreen") return product.routineStep === "protect";
  return product.routineStep === "support";
}

function skinFitMatches(product: CatalogProduct, profile: OnboardingAnswers) {
  const sensitive =
    profile.sensitivity === "oftenSensitive" ||
    profile.sensitivity === "currentlyUncomfortable" ||
    profile.irritationBarrierSignals.some((signal) => signal !== "none" && signal !== "notSure");

  if (sensitive && product.cautionTags.some((tag) => ["strong-active", "avoid-sensitive"].includes(tag))) {
    return false;
  }

  return true;
}

export function matchProductOptions(
  products: CatalogProduct[],
  profile: OnboardingAnswers,
  role: RoutineStepRole,
): RoutineProductOption[] {
  return products
    .filter((product) => evaluateCatalogProductEligibility(product).status === "eligible")
    .filter((product) => stepMatches(product, role))
    .filter((product) => marketMatches(product, profile))
    .filter((product) => budgetMatches(product, profile))
    .filter((product) => skinFitMatches(product, profile))
    .sort((a, b) => {
      const priceA = a.price?.amountMinor ?? Number.MAX_SAFE_INTEGER;
      const priceB = b.price?.amountMinor ?? Number.MAX_SAFE_INTEGER;
      return priceA - priceB || a.productName.localeCompare(b.productName);
    })
    .slice(0, 3)
    .map((product) => ({
      productId: product.id,
      brandName: product.brandName,
      productName: product.productName,
      routineStep: product.routineStep,
      priceBand: product.priceBand,
      retailerName: product.retailerName,
      productUrl: product.productUrl,
      availabilityStatus: product.availabilityStatus,
      fitNotes: product.functionTags.slice(0, 3),
      sourceProductUpdatedAt: product.updatedAt,
    }));
}
