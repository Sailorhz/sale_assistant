import { apiError, apiOk } from "@/lib/api/response";
import type { CatalogProduct } from "@/lib/domain/catalog-product";
import type { RoutineVersionContext } from "@/lib/domain/version-context";
import { generateStarterRoutine } from "@/lib/recommendation/routine-generator";
import { listPublishedCatalogProducts } from "@/lib/supabase/catalog-products";
import { logSafetyEvent } from "@/lib/supabase/routine-actions";
import { createClient } from "@/lib/supabase/server";
import { getLatestPublishedRoutineVersionContext } from "@/lib/supabase/version-context";
import { hasEnvVars } from "@/lib/utils";
import { parseOnboardingAnswers } from "@/lib/validation/onboarding-schema";

function parseProducts(value: unknown): CatalogProduct[] {
  return Array.isArray(value) ? (value as CatalogProduct[]) : [];
}

function parseVersionContext(value: unknown): RoutineVersionContext {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      catalogVersionId: String(record.catalogVersionId ?? "catalog-version-local"),
      catalogVersionKey: String(record.catalogVersionKey ?? "catalog-local"),
      ruleVersionId: String(record.ruleVersionId ?? "rule-version-local"),
      ruleVersionKey: String(record.ruleVersionKey ?? "rules-local"),
    };
  }

  return {
    catalogVersionId: "catalog-version-local",
    catalogVersionKey: "catalog-local",
    ruleVersionId: "rule-version-local",
    ruleVersionKey: "rules-local",
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  const parsedProfile = parseOnboardingAnswers(body.profile);

  if (!parsedProfile.ok) {
    return apiError(
      "validation",
      parsedProfile.errors[0]?.message ?? "Profile answers are incomplete.",
      400,
      parsedProfile.errors,
    );
  }

  try {
    const supabase = hasEnvVars ? await createClient() : null;

    // The client-supplied catalog path is a local-dev convenience only.
    // In production the catalog must come from the database, never the
    // request body — enforce that explicitly rather than relying on
    // env vars happening to be set.
    if (!supabase && process.env.NODE_ENV === "production") {
      return apiError(
        "catalog-unavailable",
        "Routine generation is temporarily unavailable.",
        503,
      );
    }

    const products = supabase
      ? await listPublishedCatalogProducts(supabase)
      : parseProducts(body.products);
    const versionContext = supabase
      ? await getLatestPublishedRoutineVersionContext(supabase)
      : parseVersionContext(body.versionContext);

    if (!versionContext) {
      return apiError(
        "catalog-unavailable",
        "Published catalog and rule versions are required before routines can be generated.",
        503,
      );
    }

    const routine = generateStarterRoutine({
      profile: parsedProfile.answers,
      products,
      versionContext,
    });

    if (routine.state === "safety-blocked" && supabase) {
      const { data } = await supabase.auth.getClaims();
      const userId = data?.claims?.sub ?? null;

      await logSafetyEvent(supabase, {
        userId,
        routineId: null,
        productId: null,
        category: "onboarding_professional_care",
        severity: "high",
        context: { variant: routine.variant },
      }).catch((error) => {
        console.error("Failed to log safety event for onboarding", error);
      });
    }

    return apiOk({ routine });
  } catch {
    return apiError("system-error", "Routine could not be generated.", 500);
  }
}
