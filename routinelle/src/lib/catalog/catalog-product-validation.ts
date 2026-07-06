import type { ApiResult } from "@/lib/api/result";
import { err, ok } from "@/lib/api/result";
import type { CatalogProduct } from "@/lib/domain/catalog-product";

export type CatalogValidationSeverity = "error" | "warning";

export type CatalogValidationIssueCode =
  | "missing-required-metadata"
  | "unpublished-product"
  | "review-flagged-product"
  | "unavailable-product"
  | "stale-product-data"
  | "formula-change-review"
  | "unsafe-fit-caution";

export type CatalogValidationIssue = {
  code: CatalogValidationIssueCode;
  field: keyof CatalogProduct | "price.currency" | "costPerUnit.currency";
  message: string;
  severity: CatalogValidationSeverity;
};

export type CatalogEligibilityStatus = "eligible" | "blocked";

export type CatalogEligibilityResult = {
  status: CatalogEligibilityStatus;
  issues: CatalogValidationIssue[];
};

const unsafeCautionTags = new Set([
  "avoid-sensitive",
  "strong-active",
  "fragrance-heavy",
  "essential-oils",
]);

function isBlank(value: string | null | undefined) {
  return value === null || value === undefined || value.trim().length === 0;
}

function hasItems(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

function issue(
  code: CatalogValidationIssueCode,
  field: CatalogValidationIssue["field"],
  message: string,
  severity: CatalogValidationSeverity = "error",
): CatalogValidationIssue {
  return { code, field, message, severity };
}

export function validateCatalogProductMetadata(
  product: CatalogProduct,
): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];

  if (isBlank(product.brandName)) {
    issues.push(
      issue("missing-required-metadata", "brandName", "Brand name is required."),
    );
  }

  if (isBlank(product.productName)) {
    issues.push(
      issue(
        "missing-required-metadata",
        "productName",
        "Product name is required.",
      ),
    );
  }

  if (!hasItems(product.inciList)) {
    issues.push(
      issue(
        "missing-required-metadata",
        "inciList",
        "INCI list must include at least one ingredient.",
      ),
    );
  }

  if (!hasItems(product.functionTags)) {
    issues.push(
      issue(
        "missing-required-metadata",
        "functionTags",
        "At least one function tag is required.",
      ),
    );
  }

  if (product.verifiedClaims.length === 0) {
    issues.push(
      issue(
        "missing-required-metadata",
        "verifiedClaims",
        "At least one verified claim or source note is required.",
      ),
    );
  }

  if (product.price && isBlank(product.price.currency)) {
    issues.push(
      issue(
        "missing-required-metadata",
        "price.currency",
        "Price currency is required when price is provided.",
      ),
    );
  }

  if (product.costPerUnit && isBlank(product.costPerUnit.currency)) {
    issues.push(
      issue(
        "missing-required-metadata",
        "costPerUnit.currency",
        "Cost-per-unit currency is required when cost-per-unit is provided.",
      ),
    );
  }

  if (isBlank(product.lastVerifiedAt)) {
    issues.push(
      issue(
        "missing-required-metadata",
        "lastVerifiedAt",
        "Last verified date is required.",
      ),
    );
  }

  return issues;
}

export function evaluateCatalogProductEligibility(
  product: CatalogProduct,
): CatalogEligibilityResult {
  const issues = validateCatalogProductMetadata(product);

  if (product.availabilityStatus !== "available") {
    issues.push(
      issue(
        "unavailable-product",
        "availabilityStatus",
        "Only available products can be recommendation-eligible.",
      ),
    );
  }

  if (product.publicationStatus !== "published") {
    issues.push(
      issue(
        product.publicationStatus === "review"
          ? "review-flagged-product"
          : "unpublished-product",
        "publicationStatus",
        "Only published products can be recommendation-eligible by default.",
      ),
    );
  }

  if (
    product.dataFreshnessStatus === "stale" ||
    product.dataFreshnessStatus === "needs_review"
  ) {
    issues.push(
      issue(
        "stale-product-data",
        "dataFreshnessStatus",
        "Stale or review-needed product data is blocked from recommendations.",
      ),
    );
  }

  if (
    product.formulaStatus === "changed" ||
    product.formulaStatus === "suspected_change"
  ) {
    issues.push(
      issue(
        "formula-change-review",
        "formulaStatus",
        "Formula changes require review before recommendation eligibility.",
      ),
    );
  }

  if (product.cautionTags.some((tag) => unsafeCautionTags.has(tag))) {
    issues.push(
      issue(
        "unsafe-fit-caution",
        "cautionTags",
        "High-caution tags block default recommendation eligibility.",
      ),
    );
  }

  return {
    status: issues.some((item) => item.severity === "error")
      ? "blocked"
      : "eligible",
    issues,
  };
}

export function catalogEligibilityApiResult(
  product: CatalogProduct,
): ApiResult<CatalogEligibilityResult> {
  const eligibility = evaluateCatalogProductEligibility(product);

  if (eligibility.status === "blocked") {
    return err(
      "validation",
      "Catalog product is not recommendation-eligible.",
      eligibility.issues,
    );
  }

  return ok(eligibility);
}
