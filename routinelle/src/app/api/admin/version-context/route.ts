import { apiError, apiOk } from "@/lib/api/response";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import { createClient } from "@/lib/supabase/server";
import {
  createCatalogVersion,
  createRuleVersion,
  listCatalogVersions,
  listRuleVersions,
  type GovernanceVersionInsert,
} from "@/lib/supabase/version-context";
import { hasEnvVars } from "@/lib/utils";

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function getAdminContext() {
  if (!hasEnvVars) {
    return { supabase: null, isAdmin: false };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return { supabase, isAdmin: false };
  }

  return { supabase, isAdmin: await isCatalogAdmin(supabase, userId) };
}

export async function GET() {
  try {
    const { supabase, isAdmin } = await getAdminContext();

    if (!supabase) {
      return apiError("auth-required", "Supabase is not configured.", 401);
    }

    if (!isAdmin) {
      return apiError(
        "permission-denied",
        "Catalog admin access is required.",
        403,
      );
    }

    const [catalogVersions, ruleVersions] = await Promise.all([
      listCatalogVersions(supabase),
      listRuleVersions(supabase),
    ]);

    return apiOk({ catalogVersions, ruleVersions });
  } catch {
    return apiError("system-error", "Version context is unavailable.", 500);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  const versionType = body.versionType;
  const row: GovernanceVersionInsert = {
    version_key: String(body.versionKey ?? ""),
    status: String(body.status ?? "draft") as GovernanceVersionInsert["status"],
    summary: String(body.summary ?? ""),
    internal_notes: stringOrNull(body.internalNotes),
  };

  if (
    (versionType !== "catalog" && versionType !== "rule") ||
    !row.version_key ||
    !row.summary
  ) {
    return apiError(
      "validation",
      "Version type, version key, and summary are required.",
      400,
    );
  }

  try {
    const { supabase, isAdmin } = await getAdminContext();

    if (!supabase) {
      return apiError("auth-required", "Supabase is not configured.", 401);
    }

    if (!isAdmin) {
      return apiError(
        "permission-denied",
        "Catalog admin access is required.",
        403,
      );
    }

    const version =
      versionType === "catalog"
        ? await createCatalogVersion(supabase, row)
        : await createRuleVersion(supabase, row);

    return apiOk({ version }, 201);
  } catch {
    return apiError("system-error", "Version context could not be saved.", 500);
  }
}
