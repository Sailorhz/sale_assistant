import { ok, type ApiResult } from "@/lib/api/result";
import type { GeneratedRoutine } from "@/lib/domain/routine";

export function routineToApiResult(
  routine: GeneratedRoutine,
): ApiResult<GeneratedRoutine> {
  return ok(routine);
}

export const sampleRoutineContract: GeneratedRoutine = {
  id: "sample-routine-contract",
  profileHash: "sample-profile",
  variant: "standard",
  state: "ready",
  versionContext: {
    catalogVersionId: "catalog-version-sample",
    catalogVersionKey: "catalog-v1",
    ruleVersionId: "rule-version-sample",
    ruleVersionKey: "rules-v1",
  },
  generatedAt: "2026-05-19T00:00:00.000Z",
  conflicts: [],
  safetyMessages: [],
  sections: [
    {
      id: "am",
      title: "AM",
      steps: [
        {
          id: "am-cleanse",
          role: "cleanser",
          routineStep: "cleanse",
          title: "Cleanse",
          timeOfUse: "am",
          frequency: "Daily",
          state: "recommended",
          productOptions: [],
          noSafeMatchReason: null,
          cautions: [],
          explanationRefs: [{ key: "cleanse-basic", label: "Cleanse" }],
          conflictRefs: [],
        },
      ],
    },
    {
      id: "pm",
      title: "PM",
      steps: [],
    },
  ],
};
