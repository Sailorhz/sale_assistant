import type {
  CatalogAvailabilityStatus,
  CatalogCostPerUnit,
  CatalogDataFreshnessStatus,
  CatalogFormulaStatus,
  CatalogMarket,
  CatalogMoneyAmount,
  CatalogPriceBand,
  CatalogProduct,
  CatalogProductCategory,
  CatalogPublicationStatus,
  CatalogProductSize,
  CatalogRoutineStep,
  CatalogSizeUnit,
  CatalogVerifiedClaim,
} from "@/lib/domain/catalog-product";

export type CatalogProductRow = {
  id: string;
  brand_name: string;
  product_name: string;
  product_category: CatalogProductCategory;
  routine_step: CatalogRoutineStep;
  inci_list: string[];
  key_ingredients: string[];
  function_tags: string[];
  caution_tags: string[];
  verified_claims: CatalogVerifiedClaim[];
  price_amount_minor: number | null;
  price_currency: string | null;
  price_band: CatalogPriceBand;
  size_value: number | null;
  size_unit: CatalogSizeUnit | null;
  cost_per_unit_amount_minor: number | null;
  cost_per_unit_unit: CatalogSizeUnit | null;
  market: CatalogMarket;
  availability_status: CatalogAvailabilityStatus;
  retailer_name: string | null;
  product_url: string | null;
  source_url: string | null;
  last_verified_at: string;
  next_review_at: string | null;
  formula_status: CatalogFormulaStatus;
  formula_changed_at: string | null;
  data_freshness_status: CatalogDataFreshnessStatus;
  data_freshness_notes: string | null;
  publication_status: CatalogPublicationStatus;
  published_at: string | null;
  unpublished_at: string | null;
  review_flagged_at: string | null;
  review_reason: string | null;
  created_at: string;
  updated_at: string;
};

function mapPrice(row: CatalogProductRow): CatalogMoneyAmount | null {
  if (row.price_amount_minor === null || row.price_currency === null) {
    return null;
  }

  return {
    amountMinor: row.price_amount_minor,
    currency: row.price_currency,
  };
}

function mapSize(row: CatalogProductRow): CatalogProductSize | null {
  if (row.size_value === null || row.size_unit === null) {
    return null;
  }

  return {
    value: row.size_value,
    unit: row.size_unit,
  };
}

function mapCostPerUnit(row: CatalogProductRow): CatalogCostPerUnit | null {
  if (
    row.cost_per_unit_amount_minor === null ||
    row.price_currency === null ||
    row.cost_per_unit_unit === null
  ) {
    return null;
  }

  return {
    amountMinor: row.cost_per_unit_amount_minor,
    currency: row.price_currency,
    unit: row.cost_per_unit_unit,
  };
}

export function mapCatalogProductRow(row: CatalogProductRow): CatalogProduct {
  return {
    id: row.id,
    brandName: row.brand_name,
    productName: row.product_name,
    productCategory: row.product_category,
    routineStep: row.routine_step,
    inciList: row.inci_list,
    keyIngredients: row.key_ingredients,
    functionTags: row.function_tags,
    cautionTags: row.caution_tags,
    verifiedClaims: row.verified_claims,
    price: mapPrice(row),
    priceBand: row.price_band,
    size: mapSize(row),
    costPerUnit: mapCostPerUnit(row),
    market: row.market,
    availabilityStatus: row.availability_status,
    retailerName: row.retailer_name,
    productUrl: row.product_url,
    sourceUrl: row.source_url,
    lastVerifiedAt: row.last_verified_at,
    nextReviewAt: row.next_review_at,
    formulaStatus: row.formula_status,
    formulaChangedAt: row.formula_changed_at,
    dataFreshnessStatus: row.data_freshness_status,
    dataFreshnessNotes: row.data_freshness_notes,
    publicationStatus: row.publication_status,
    publishedAt: row.published_at,
    unpublishedAt: row.unpublished_at,
    reviewFlaggedAt: row.review_flagged_at,
    reviewReason: row.review_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
