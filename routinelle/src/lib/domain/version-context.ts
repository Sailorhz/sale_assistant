export type GovernanceVersionStatus = "draft" | "published" | "archived";

export type GovernanceVersion = {
  id: string;
  versionKey: string;
  status: GovernanceVersionStatus;
  summary: string;
  internalNotes: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoutineVersionContext = {
  catalogVersionId: string;
  catalogVersionKey: string;
  ruleVersionId: string;
  ruleVersionKey: string;
};

export function buildRoutineVersionContext(
  catalogVersion: GovernanceVersion,
  ruleVersion: GovernanceVersion,
): RoutineVersionContext {
  return {
    catalogVersionId: catalogVersion.id,
    catalogVersionKey: catalogVersion.versionKey,
    ruleVersionId: ruleVersion.id,
    ruleVersionKey: ruleVersion.versionKey,
  };
}
