import { apiError, apiOk } from "@/lib/api/response";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import {
  createCatalogTag,
  listCatalogTags,
  type CatalogTagInsert,
} from "@/lib/supabase/catalog-governance";
import { createClient } from "@/lib/supabase/server";
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
      return apiError("permission-denied", "Catalog admin access is required.", 403);
    }

    return apiOk({ tags: await listCatalogTags(supabase) });
  } catch {
    return apiError("system-error", "Catalog tags are unavailable.", 500);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  const row: CatalogTagInsert = {
    tag_type: String(body.tagType ?? ""),
    slug: String(body.slug ?? ""),
    label: String(body.label ?? ""),
    description: stringOrNull(body.description),
    status: String(body.status ?? "active") as CatalogTagInsert["status"],
    version_key: stringOrNull(body.versionKey),
  } as CatalogTagInsert;

  if (!row.slug || !row.label) {
    return apiError("validation", "Tag slug and label are required.", 400);
  }

  try {
    const { supabase, isAdmin } = await getAdminContext();

    if (!supabase) {
      return apiError("auth-required", "Supabase is not configured.", 401);
    }

    if (!isAdmin) {
      return apiError("permission-denied", "Catalog admin access is required.", 403);
    }

    return apiOk({ tag: await createCatalogTag(supabase, row) }, 201);
  } catch {
    return apiError("system-error", "Catalog tag could not be saved.", 500);
  }
}
