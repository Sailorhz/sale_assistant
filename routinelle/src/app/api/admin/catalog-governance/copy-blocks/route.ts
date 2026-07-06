import { apiError, apiOk } from "@/lib/api/response";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import {
  createApprovedCopyBlock,
  listApprovedCopyBlocks,
  type ApprovedCopyBlockInsert,
} from "@/lib/supabase/catalog-governance";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
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
      return apiError("permission-denied", "Catalog admin access is required.", 403);
    }

    return apiOk({ copyBlocks: await listApprovedCopyBlocks(supabase) });
  } catch {
    return apiError("system-error", "Approved copy is unavailable.", 500);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  const row: ApprovedCopyBlockInsert = {
    copy_key: String(body.copyKey ?? ""),
    copy_type: String(body.copyType ?? ""),
    title: String(body.title ?? ""),
    body: String(body.body ?? ""),
    allowed_contexts: stringArray(body.allowedContexts),
    claim_scope: String(
      body.claimScope ?? "cosmetic",
    ) as ApprovedCopyBlockInsert["claim_scope"],
    status: String(body.status ?? "draft") as ApprovedCopyBlockInsert["status"],
    version_key: stringOrNull(body.versionKey),
  } as ApprovedCopyBlockInsert;

  if (!row.copy_key || !row.title || !row.body) {
    return apiError("validation", "Copy key, title, and body are required.", 400);
  }

  try {
    const { supabase, isAdmin } = await getAdminContext();

    if (!supabase) {
      return apiError("auth-required", "Supabase is not configured.", 401);
    }

    if (!isAdmin) {
      return apiError("permission-denied", "Catalog admin access is required.", 403);
    }

    return apiOk(
      { copyBlock: await createApprovedCopyBlock(supabase, row) },
      201,
    );
  } catch {
    return apiError("system-error", "Approved copy could not be saved.", 500);
  }
}
