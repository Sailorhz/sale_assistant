import { evaluateCatalogProductEligibility } from "@/lib/catalog/catalog-product-validation";
import type { CatalogProduct } from "@/lib/domain/catalog-product";
import type {
  RoutineProductOption,
  RoutineStepRole,
  RoutineTextureMismatchReason,
} from "@/lib/domain/routine";
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

/**
 * Texture tags a product can carry in functionTags -- a small, deliberately
 * narrow vocabulary (not a full texture taxonomy) covering just the mismatch
 * this exists to catch: a rich cream reaching oily skin, or a very light gel
 * reaching dry skin, with nothing in between forced to declare either way.
 */
const RICH_TEXTURE_TAG = "rich-texture";
const LIGHTWEIGHT_TEXTURE_TAG = "lightweight-texture";

function isOilyLeaning(skinType: OnboardingAnswers["skinType"]) {
  return skinType === "oily" || skinType === "oilyCombination";
}

function isDryLeaning(skinType: OnboardingAnswers["skinType"]) {
  return skinType === "dry" || skinType === "dryCombination";
}

/**
 * Mirrors budgetRank's philosophy: never exclude a texture-mismatched
 * product outright (it may be the only eligible option for the step), only
 * rank it behind better-suited options and let the caller explain why it's
 * there. Returns null when there's no mismatch to explain.
 */
function textureMismatchReason(
  product: CatalogProduct,
  profile: OnboardingAnswers,
): RoutineTextureMismatchReason | null {
  if (isOilyLeaning(profile.skinType) && product.functionTags.includes(RICH_TEXTURE_TAG)) {
    return "richer-than-typical-for-oily-skin";
  }

  if (isDryLeaning(profile.skinType) && product.functionTags.includes(LIGHTWEIGHT_TEXTURE_TAG)) {
    return "lighter-than-typical-for-dry-skin";
  }

  return null;
}

function textureRank(product: CatalogProduct, profile: OnboardingAnswers) {
  return textureMismatchReason(product, profile) ? 1 : 0;
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
      const textureRankA = textureRank(a, profile);
      const textureRankB = textureRank(b, profile);
      const budgetRankA = budgetRank(a, profile);
      const budgetRankB = budgetRank(b, profile);
      const priceA = a.price?.amountMinor ?? Number.MAX_SAFE_INTEGER;
      const priceB = b.price?.amountMinor ?? Number.MAX_SAFE_INTEGER;
      return (
        textureRankA - textureRankB ||
        budgetRankA - budgetRankB ||
        priceA - priceB ||
        a.productName.localeCompare(b.productName)
      );
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
      isBudgetBackfill: budgetRank(product, profile) === 1,
      textureMismatchReason: textureMismatchReason(product, profile),
    }));
}
