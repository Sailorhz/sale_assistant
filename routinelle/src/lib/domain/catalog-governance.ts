export type CatalogTagType = "function" | "caution" | "routine_step";
export type CatalogGovernanceStatus = "active" | "inactive" | "review";

export type CatalogTag = {
  id: string;
  tagType: CatalogTagType;
  slug: string;
  label: string;
  description: string | null;
  status: CatalogGovernanceStatus;
  versionKey: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApprovedCopyType =
  | "routine_explanation"
  | "ingredient_rationale"
  | "caution"
  | "neutrality"
  | "no_safe_match";

export type ApprovedCopyClaimScope = "cosmetic" | "safety" | "commercial";
export type ApprovedCopyStatus = "draft" | "approved" | "archived";

export type ApprovedCopyBlock = {
  id: string;
  copyKey: string;
  copyType: ApprovedCopyType;
  title: string;
  body: string;
  allowedContexts: string[];
  claimScope: ApprovedCopyClaimScope;
  status: ApprovedCopyStatus;
  versionKey: string | null;
  createdAt: string;
  updatedAt: string;
};
