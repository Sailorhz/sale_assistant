import type {
  ApprovedCopyBlock,
  ApprovedCopyClaimScope,
  ApprovedCopyStatus,
  ApprovedCopyType,
  CatalogGovernanceStatus,
  CatalogTag,
  CatalogTagType,
} from "@/lib/domain/catalog-governance";

export type CatalogTagRow = {
  id: string;
  tag_type: CatalogTagType;
  slug: string;
  label: string;
  description: string | null;
  status: CatalogGovernanceStatus;
  version_key: string | null;
  created_at: string;
  updated_at: string;
};

export type ApprovedCopyBlockRow = {
  id: string;
  copy_key: string;
  copy_type: ApprovedCopyType;
  title: string;
  body: string;
  allowed_contexts: string[];
  claim_scope: ApprovedCopyClaimScope;
  status: ApprovedCopyStatus;
  version_key: string | null;
  created_at: string;
  updated_at: string;
};

export function mapCatalogTagRow(row: CatalogTagRow): CatalogTag {
  return {
    id: row.id,
    tagType: row.tag_type,
    slug: row.slug,
    label: row.label,
    description: row.description,
    status: row.status,
    versionKey: row.version_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapApprovedCopyBlockRow(
  row: ApprovedCopyBlockRow,
): ApprovedCopyBlock {
  return {
    id: row.id,
    copyKey: row.copy_key,
    copyType: row.copy_type,
    title: row.title,
    body: row.body,
    allowedContexts: row.allowed_contexts,
    claimScope: row.claim_scope,
    status: row.status,
    versionKey: row.version_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
