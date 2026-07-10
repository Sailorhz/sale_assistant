import { evaluateCatalogProductEligibility } from "@/lib/catalog/catalog-product-validation";
import type {
  CatalogMarket,
  CatalogPriceBand,
  CatalogProduct,
  CatalogRoutineStep,
} from "@/lib/domain/catalog-product";

export type CatalogPriorityProfile = "general" | "sensitive" | "blemish-prone";

export type CatalogCoverageCell = {
  market: CatalogMarket;
  routineStep: CatalogRoutineStep;
  priorityProfile: CatalogPriorityProfile;
  priceBand: Exclude<CatalogPriceBand, "unknown">;
  eligibleCount: number;
  hasGap: boolean;
};

export type CatalogCoverageReport = {
  cells: CatalogCoverageCell[];
  gaps: CatalogCoverageCell[];
};

const firstMarket: CatalogMarket = "france";
const routineSteps: CatalogRoutineStep[] = ["cleanse", "hydrate", "protect", "support"];
const priorityProfiles: CatalogPriorityProfile[] = [
  "general",
  "sensitive",
  "blemish-prone",
];
const priceBands: Array<Exclude<CatalogPriceBand, "unknown">> = [
  "low",
  "moderate",
  "premium",
  "luxury",
];

function fitsPriorityProfile(
  product: CatalogProduct,
  priorityProfile: CatalogPriorityProfile,
) {
  if (priorityProfile === "general") {
    return true;
  }

  if (priorityProfile === "sensitive") {
    return !product.cautionTags.some((tag) =>
      ["avoid-sensitive", "strong-active", "fragrance-heavy"].includes(tag),
    );
  }

  return product.functionTags.some((tag) =>
    ["blemish", "blemish-support", "oiliness", "pores"].includes(tag),
  );
}

export function buildCatalogCoverageReport(
  products: CatalogProduct[],
): CatalogCoverageReport {
  const eligibleProducts = products.filter(
    (product) => evaluateCatalogProductEligibility(product).status === "eligible",
  );
  const cells = routineSteps.flatMap((routineStep) =>
    priorityProfiles.flatMap((priorityProfile) =>
      priceBands.map((priceBand) => {
        const eligibleCount = eligibleProducts.filter((product) => {
          return (
            product.market === firstMarket &&
            product.routineStep === routineStep &&
            product.priceBand === priceBand &&
            fitsPriorityProfile(product, priorityProfile)
          );
        }).length;

        return {
          market: firstMarket,
          routineStep,
          priorityProfile,
          priceBand,
          eligibleCount,
          hasGap: eligibleCount === 0,
        };
      }),
    ),
  );

  return {
    cells,
    gaps: cells.filter((cell) => cell.hasGap),
  };
}
