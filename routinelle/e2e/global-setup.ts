import {
  createConfirmedUser,
  createE2EAdminClient,
  grantCatalogAdmin,
} from "./fixtures/admin-client";
import { writeE2EState, type E2EState } from "./fixtures/state";

const CLAIM_SOURCE = "E2E Test Suite";

function claim(text: string) {
  return [{ claim: text, sourceName: CLAIM_SOURCE, verifiedAt: new Date().toISOString() }];
}

/**
 * Base structural fields shared by every E2E test product -- only the
 * step/band-specific fields are supplied per-product below.
 */
function baseProduct(overrides: Record<string, unknown>) {
  return {
    inci_list: ["Aqua"],
    key_ingredients: [],
    function_tags: ["e2e-test"],
    caution_tags: [],
    verified_claims: claim("Cosmetic test product for automated E2E verification"),
    price_currency: "EUR",
    size_value: 50,
    size_unit: "ml",
    // Deliberately not "france" -- the shared dev project already has other
    // (non-E2E) test/leftover catalog content in that market, which would
    // compete with these fixtures in the top-3 ranking. "us" is unused by
    // any real content as of writing, keeping these fixtures isolated.
    market: "us",
    availability_status: "available",
    last_verified_at: new Date().toISOString(),
    formula_status: "stable",
    data_freshness_status: "current",
    publication_status: "published",
    retailer_name: "E2E Test Retailer",
    product_url: "https://example.test/e2e-product",
    source_url: "https://example.test/e2e-source",
    ...overrides,
  };
}

async function globalSetup() {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const admin = createE2EAdminClient();

  const state: E2EState = {
    runId,
    adminEmail: `e2e-admin-${runId}@example.com`,
    adminPassword: "E2eSuiteAdmin!2026Test",
    catalogVersionKey: `e2e-catalog-${runId}`,
    ruleVersionKey: `e2e-rules-${runId}`,
  };

  // Write state immediately, before creating anything -- if a later step
  // throws, global-teardown can still find this file and clean up whatever
  // was actually created, instead of leaking fixtures with no record of
  // their runId/version keys to search for.
  writeE2EState(state);

  const adminUser = await createConfirmedUser(admin, state.adminEmail, state.adminPassword);
  await grantCatalogAdmin(admin, adminUser.id);

  const { error: cvError } = await admin
    .from("catalog_versions")
    .insert({
      version_key: state.catalogVersionKey,
      status: "published",
      summary: "E2E suite catalog version (temporary, deleted by global teardown).",
    })
    .select()
    .single();
  if (cvError) throw cvError;

  const { error: rvError } = await admin
    .from("rule_versions")
    .insert({
      version_key: state.ruleVersionKey,
      status: "published",
      summary: "E2E suite rule version (temporary, deleted by global teardown).",
    })
    .select()
    .single();
  if (rvError) throw rvError;

  const products = [
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Cleanser ${runId}`,
      product_category: "cleanser",
      routine_step: "cleanse",
      price_amount_minor: 900,
      price_band: "low",
    }),
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Moisturizer ${runId}`,
      product_category: "moisturizer",
      routine_step: "hydrate",
      price_amount_minor: 1200,
      price_band: "low",
    }),
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Sunscreen ${runId}`,
      product_category: "sunscreen",
      routine_step: "protect",
      price_amount_minor: 1300,
      price_band: "low",
    }),
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Support Low ${runId}`,
      product_category: "serum",
      routine_step: "support",
      price_amount_minor: 800,
      price_band: "low",
    }),
    // Extra price-band coverage on the support step, for the budget-matching spec.
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Support Moderate ${runId}`,
      product_category: "serum",
      routine_step: "support",
      price_amount_minor: 1800,
      price_band: "moderate",
    }),
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Support Premium ${runId}`,
      product_category: "serum",
      routine_step: "support",
      price_amount_minor: 3500,
      price_band: "premium",
    }),
    baseProduct({
      brand_name: "E2E Test Brand",
      product_name: `Support Luxury ${runId}`,
      product_category: "serum",
      routine_step: "support",
      price_amount_minor: 15000,
      price_band: "luxury",
    }),
  ];

  const { error: productsError } = await admin.from("catalog_products").insert(products);
  if (productsError) throw productsError;

  console.log(`[e2e global-setup] seeded fixtures for run ${runId}`);
}

export default globalSetup;
