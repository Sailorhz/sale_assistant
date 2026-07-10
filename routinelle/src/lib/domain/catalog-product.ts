export type CatalogProductCategory =
  | "cleanser"
  | "moisturizer"
  | "sunscreen"
  | "serum"
  | "active"
  | "exfoliant"
  | "toner"
  | "mask"
  | "other";

export type CatalogRoutineStep =
  | "cleanse"
  | "hydrate"
  | "protect"
  | "support"
  | "optional";

export type CatalogMarket = "france" | "eu" | "uk" | "us" | "other";

export type CatalogAvailabilityStatus =
  | "available"
  | "limited"
  | "unavailable"
  | "unknown";

export type CatalogPriceBand = "low" | "moderate" | "premium" | "luxury" | "unknown";

export type CatalogSizeUnit = "ml" | "g" | "oz" | "unit";

export type CatalogFormulaStatus =
  | "stable"
  | "changed"
  | "suspected_change"
  | "unknown";

export type CatalogDataFreshnessStatus =
  | "current"
  | "review_due"
  | "stale"
  | "needs_review";

export type CatalogPublicationStatus =
  | "draft"
  | "published"
  | "unpublished"
  | "review";

export type CatalogVerifiedClaim = {
  claim: string;
  sourceName?: string;
  sourceUrl?: string;
  verifiedAt?: string;
};

export type CatalogMoneyAmount = {
  amountMinor: number;
  currency: string;
};

export type CatalogProductSize = {
  value: number;
  unit: CatalogSizeUnit;
};

export type CatalogCostPerUnit = {
  amountMinor: number;
  currency: string;
  unit: CatalogSizeUnit;
};

export type CatalogProduct = {
  id: string;
  brandName: string;
  productName: string;
  productCategory: CatalogProductCategory;
  routineStep: CatalogRoutineStep;
  inciList: string[];
  keyIngredients: string[];
  functionTags: string[];
  cautionTags: string[];
  verifiedClaims: CatalogVerifiedClaim[];
  price: CatalogMoneyAmount | null;
  priceBand: CatalogPriceBand;
  size: CatalogProductSize | null;
  costPerUnit: CatalogCostPerUnit | null;
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
  publishedAt: string | null;
  unpublishedAt: string | null;
  reviewFlaggedAt: string | null;
  reviewReason: string | null;
  createdAt: string;
  updatedAt: string;
};
