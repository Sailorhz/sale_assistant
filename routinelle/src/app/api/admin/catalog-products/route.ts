import { apiError, apiOk } from "@/lib/api/response";
import {
  catalogProductInputToRow,
  parseCatalogProductInput,
  validateCatalogProductInput,
} from "@/lib/catalog/catalog-product-input";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import {
  createCatalogProduct,
  listCatalogProducts,
} from "@/lib/supabase/catalog-products";
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

  return {
    supabase,
    isAdmin: await isCatalogAdmin(supabase, userId),
  };
}

export async function GET() {
  try {
    const { supabase, isAdmin } = await getAdminContext();

    if (!supabase) {
      return apiError(
        "auth-required",
        "Supabase must be configured before catalog admin is available.",
        401,
      );
    }

    if (!isAdmin) {
      return apiError(
        "permission-denied",
        "Catalog admin access is required.",
        403,
      );
    }

    return apiOk({ products: await listCatalogProducts(supabase) });
  } catch {
    return apiError("system-error", "Catalog products are unavailable.", 500);
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  const input = parseCatalogProductInput(body);
  const eligibility = validateCatalogProductInput(input);

  if (eligibility.status === "blocked") {
    return apiError(
      "validation",
      "Catalog product is not recommendation-eligible.",
      400,
      eligibility.issues,
    );
  }

  try {
    const { supabase, isAdmin } = await getAdminContext();

    if (!supabase) {
      return apiError(
        "auth-required",
        "Supabase must be configured before catalog admin is available.",
        401,
      );
    }

    if (!isAdmin) {
      return apiError(
        "permission-denied",
        "Catalog admin access is required.",
        403,
      );
    }

    const product = await createCatalogProduct(
      supabase,
      catalogProductInputToRow(input),
    );

    return apiOk({ product, eligibility }, 201);
  } catch {
    return apiError("system-error", "Catalog product could not be saved.", 500);
  }
}
