import { apiError, apiOk } from "@/lib/api/response";
import { buildCatalogCoverageReport } from "@/lib/catalog/catalog-coverage";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import { listCatalogProducts } from "@/lib/supabase/catalog-products";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

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

    const products = await listCatalogProducts(supabase);
    return apiOk({ coverage: buildCatalogCoverageReport(products) });
  } catch {
    return apiError("system-error", "Catalog coverage is unavailable.", 500);
  }
}
