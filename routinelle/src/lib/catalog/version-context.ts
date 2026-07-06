import type {
  GovernanceVersion,
  GovernanceVersionStatus,
} from "@/lib/domain/version-context";

export type GovernanceVersionRow = {
  id: string;
  version_key: string;
  status: GovernanceVersionStatus;
  summary: string;
  internal_notes: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapGovernanceVersionRow(
  row: GovernanceVersionRow,
): GovernanceVersion {
  return {
    id: row.id,
    versionKey: row.version_key,
    status: row.status,
    summary: row.summary,
    internalNotes: row.internal_notes,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
