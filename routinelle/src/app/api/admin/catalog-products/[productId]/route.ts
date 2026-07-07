import { apiError, apiOk } from "@/lib/api/response";
import {
  catalogProductInputToRow,
  parseCatalogProductInput,
  validateCatalogProductForSave,
  validateCatalogProductInput,
} from "@/lib/catalog/catalog-product-input";
import { isCatalogAdmin } from "@/lib/supabase/catalog-admin";
import { updateCatalogProduct } from "@/lib/supabase/catalog-products";
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("validation", "Request body must be valid JSON.", 400);
  }

  const input = parseCatalogProductInput(body);
  const saveValidation = validateCatalogProductForSave(input);

  if (saveValidation.status === "blocked") {
    return apiError(
      "validation",
      "Catalog product is missing required fields.",
      400,
      saveValidation.issues,
    );
  }

  const eligibility = validateCatalogProductInput(input);

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

    const product = await updateCatalogProduct(
      supabase,
      productId,
      catalogProductInputToRow(input),
    );

    return apiOk({ product, eligibility });
  } catch {
    return apiError("system-error", "Catalog product could not be saved.", 500);
  }
}
