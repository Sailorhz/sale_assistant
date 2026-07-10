import { evaluateCatalogProductEligibility } from "@/lib/catalog/catalog-product-validation";
import type { CatalogProduct } from "@/lib/domain/catalog-product";
import type { RoutineProductOption, RoutineStepRole } from "@/lib/domain/routine";
import type { OnboardingAnswers } from "@/lib/domain/skin-profile";

function marketMatches(product: CatalogProduct, profile: OnboardingAnswers) {
  return profile.localMarket === "notSure" || !profile.localMarket
    ? product.market === "france"
    : product.market === profile.localMarket;
}

/**
 * Bands a chosen budget preference is willing to see, beyond its own name.
 * "premium" also surfaces "luxury" products -- there is no separate onboarding
 * choice for true luxury/prestige brands, so a premium budget is treated as
 * "the nicer stuff", spanning both tiers.
 */
export function budgetBands(budget: Exclude<OnboardingAnswers["budget"], "flexible" | "notSure" | null>) {
  return budget === "premium" ? ["premium", "luxury"] : [budget];
}

function budgetMatches(product: CatalogProduct, profile: OnboardingAnswers) {
  if (profile.budget === "notSure" || !profile.budget || profile.budget === "flexible") {
    return true;
  }

  return budgetBands(profile.budget).includes(product.priceBand) || product.priceBand === "low";
}

function stepMatches(product: CatalogProduct, role: RoutineStepRole) {
  if (role === "cleanser") return product.routineStep === "cleanse";
  if (role === "moisturizer") return product.routineStep === "hydrate";
  if (role === "sunscreen") return product.routineStep === "protect";
  return product.routineStep === "support";
}

/**
 * 0 when the product's price band matches the user's chosen budget (or the user
 * has no explicit preference), 1 otherwise. Used to rank matching-band options
 * ahead of low-band backfill, without excluding low-band options entirely --
 * hiding affordable options would violate the neutrality/commercial-firewall
 * principle, so budgetMatches still lets them through; this only fixes the
 * ordering so they no longer crowd out the band the user actually asked for.
 */
function budgetRank(product: CatalogProduct, profile: OnboardingAnswers) {
  if (profile.budget === "notSure" || !profile.budget || profile.budget === "flexible") {
    return 0;
  }

  return budgetBands(profile.budget).includes(product.priceBand) ? 0 : 1;
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
      const rankA = budgetRank(a, profile);
      const rankB = budgetRank(b, profile);
      const priceA = a.price?.amountMinor ?? Number.MAX_SAFE_INTEGER;
      const priceB = b.price?.amountMinor ?? Number.MAX_SAFE_INTEGER;
      return rankA - rankB || priceA - priceB || a.productName.localeCompare(b.productName);
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
