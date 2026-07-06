import { evaluateCatalogProductEligibility } from "@/lib/catalog/catalog-product-validation";
import type {
  CatalogAvailabilityStatus,
  CatalogDataFreshnessStatus,
  CatalogFormulaStatus,
  CatalogMarket,
  CatalogPriceBand,
  CatalogProduct,
  CatalogProductCategory,
  CatalogPublicationStatus,
  CatalogRoutineStep,
  CatalogSizeUnit,
  CatalogVerifiedClaim,
} from "@/lib/domain/catalog-product";
import type { CatalogProductMutationRow } from "@/lib/supabase/catalog-products";

export type CatalogProductInput = {
  brandName: string;
  productName: string;
  productCategory: CatalogProductCategory;
  routineStep: CatalogRoutineStep;
  inciList: string[];
  keyIngredients: string[];
  functionTags: string[];
  cautionTags: string[];
  verifiedClaims: CatalogVerifiedClaim[];
  priceAmountMinor: number | null;
  priceCurrency: string | null;
  priceBand: CatalogPriceBand;
  sizeValue: number | null;
  sizeUnit: CatalogSizeUnit | null;
  costPerUnitAmountMinor: number | null;
  costPerUnitUnit: CatalogSizeUnit | null;
  market: CatalogMarket;
  availabilityStatus: CatalogAvailabilityStatus;
  retailerName: string | null;
  productUrl: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: string;
  nextReviewAt: string | null;
  formulaStatus: CatalogFormulaStatus;
  formulaChangedAt: string | null;
  dataFreshnessStatus: CatalogDataFreshnessStatus;
  dataFreshnessNotes: string | null;
  publicationStatus: CatalogPublicationStatus;
  reviewReason: string | null;
};

function nullableString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullableNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function verifiedClaims(value: unknown): CatalogVerifiedClaim[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => {
      return typeof item === "object" && item !== null && !Array.isArray(item);
    })
    .map((item) => ({
      claim: requiredString(item.claim),
      sourceName: nullableString(item.sourceName) ?? undefined,
      sourceUrl: nullableString(item.sourceUrl) ?? undefined,
      verifiedAt: nullableString(item.verifiedAt) ?? undefined,
    }))
    .filter((item) => item.claim.length > 0);
}

export function parseCatalogProductInput(value: unknown): CatalogProductInput {
  const input =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    brandName: requiredString(input.brandName),
    productName: requiredString(input.productName),
    productCategory: requiredString(input.productCategory) as CatalogProductCategory,
    routineStep: requiredString(input.routineStep) as CatalogRoutineStep,
    inciList: stringArray(input.inciList),
    keyIngredients: stringArray(input.keyIngredients),
    functionTags: stringArray(input.functionTags),
    cautionTags: stringArray(input.cautionTags),
    verifiedClaims: verifiedClaims(input.verifiedClaims),
    priceAmountMinor: nullableNumber(input.priceAmountMinor),
    priceCurrency: nullableString(input.priceCurrency),
    priceBand: requiredString(input.priceBand) as CatalogPriceBand,
    sizeValue: nullableNumber(input.sizeValue),
    sizeUnit: nullableString(input.sizeUnit) as CatalogSizeUnit | null,
    costPerUnitAmountMinor: nullableNumber(input.costPerUnitAmountMinor),
    costPerUnitUnit: nullableString(input.costPerUnitUnit) as CatalogSizeUnit | null,
    market: requiredString(input.market) as CatalogMarket,
    availabilityStatus: requiredString(
      input.availabilityStatus,
    ) as CatalogAvailabilityStatus,
    retailerName: nullableString(input.retailerName),
    productUrl: nullableString(input.productUrl),
    sourceUrl: nullableString(input.sourceUrl),
    lastVerifiedAt: requiredString(input.lastVerifiedAt),
    nextReviewAt: nullableString(input.nextReviewAt),
    formulaStatus: requiredString(input.formulaStatus) as CatalogFormulaStatus,
    formulaChangedAt: nullableString(input.formulaChangedAt),
    dataFreshnessStatus: requiredString(
      input.dataFreshnessStatus,
    ) as CatalogDataFreshnessStatus,
    dataFreshnessNotes: nullableString(input.dataFreshnessNotes),
    publicationStatus: requiredString(
      input.publicationStatus,
    ) as CatalogPublicationStatus,
    reviewReason: nullableString(input.reviewReason),
  };
}

export function catalogProductInputToRow(
  input: CatalogProductInput,
): CatalogProductMutationRow {
  return {
    brand_name: input.brandName,
    product_name: input.productName,
    product_category: input.productCategory,
    routine_step: input.routineStep,
    inci_list: input.inciList,
    key_ingredients: input.keyIngredients,
    function_tags: input.functionTags,
    caution_tags: input.cautionTags,
    verified_claims: input.verifiedClaims,
    price_amount_minor: input.priceAmountMinor,
    price_currency: input.priceCurrency,
    price_band: input.priceBand,
    size_value: input.sizeValue,
    size_unit: input.sizeUnit,
    cost_per_unit_amount_minor: input.costPerUnitAmountMinor,
    cost_per_unit_unit: input.costPerUnitUnit,
    market: input.market,
    availability_status: input.availabilityStatus,
    retailer_name: input.retailerName,
    product_url: input.productUrl,
    source_url: input.sourceUrl,
    last_verified_at: input.lastVerifiedAt,
    next_review_at: input.nextReviewAt,
    formula_status: input.formulaStatus,
    formula_changed_at: input.formulaChangedAt,
    data_freshness_status: input.dataFreshnessStatus,
    data_freshness_notes: input.dataFreshnessNotes,
    publication_status: input.publicationStatus,
    review_reason: input.reviewReason,
  };
}

export function catalogProductInputToProduct(
  input: CatalogProductInput,
): CatalogProduct {
  const now = new Date().toISOString();

  return {
    id: "pending",
    brandName: input.brandName,
    productName: input.productName,
    productCategory: input.productCategory,
    routineStep: input.routineStep,
    inciList: input.inciList,
    keyIngredients: input.keyIngredients,
    functionTags: input.functionTags,
    cautionTags: input.cautionTags,
    verifiedClaims: input.verifiedClaims,
    price:
      input.priceAmountMinor !== null && input.priceCurrency
        ? { amountMinor: input.priceAmountMinor, currency: input.priceCurrency }
        : null,
    priceBand: input.priceBand,
    size:
      input.sizeValue !== null && input.sizeUnit
        ? { value: input.sizeValue, unit: input.sizeUnit }
        : null,
    costPerUnit:
      input.costPerUnitAmountMinor !== null &&
      input.priceCurrency &&
      input.costPerUnitUnit
        ? {
            amountMinor: input.costPerUnitAmountMinor,
            currency: input.priceCurrency,
            unit: input.costPerUnitUnit,
          }
        : null,
    market: input.market,
    availabilityStatus: input.availabilityStatus,
    retailerName: input.retailerName,
    productUrl: input.productUrl,
    sourceUrl: input.sourceUrl,
    lastVerifiedAt: input.lastVerifiedAt,
    nextReviewAt: input.nextReviewAt,
    formulaStatus: input.formulaStatus,
    formulaChangedAt: input.formulaChangedAt,
    dataFreshnessStatus: input.dataFreshnessStatus,
    dataFreshnessNotes: input.dataFreshnessNotes,
    publicationStatus: input.publicationStatus,
    publishedAt: null,
    unpublishedAt: null,
    reviewFlaggedAt: null,
    reviewReason: input.reviewReason,
    createdAt: now,
    updatedAt: now,
  };
}

export function validateCatalogProductInput(input: CatalogProductInput) {
  return evaluateCatalogProductEligibility(catalogProductInputToProduct(input));
}

export function catalogProductToInput(product: CatalogProduct): CatalogProductInput {
  return {
    brandName: product.brandName,
    productName: product.productName,
    productCategory: product.productCategory,
    routineStep: product.routineStep,
    inciList: product.inciList,
    keyIngredients: product.keyIngredients,
    functionTags: product.functionTags,
    cautionTags: product.cautionTags,
    verifiedClaims: product.verifiedClaims,
    priceAmountMinor: product.price?.amountMinor ?? null,
    priceCurrency: product.price?.currency ?? null,
    priceBand: product.priceBand,
    sizeValue: product.size?.value ?? null,
    sizeUnit: product.size?.unit ?? null,
    costPerUnitAmountMinor: product.costPerUnit?.amountMinor ?? null,
    costPerUnitUnit: product.costPerUnit?.unit ?? null,
    market: product.market,
    availabilityStatus: product.availabilityStatus,
    retailerName: product.retailerName,
    productUrl: product.productUrl,
    sourceUrl: product.sourceUrl,
    lastVerifiedAt: product.lastVerifiedAt,
    nextReviewAt: product.nextReviewAt,
    formulaStatus: product.formulaStatus,
    formulaChangedAt: product.formulaChangedAt,
    dataFreshnessStatus: product.dataFreshnessStatus,
    dataFreshnessNotes: product.dataFreshnessNotes,
    publicationStatus: product.publicationStatus,
    reviewReason: product.reviewReason,
  };
}
