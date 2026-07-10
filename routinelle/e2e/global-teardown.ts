import { createE2EAdminClient, deleteUserByEmail } from "./fixtures/admin-client";
import { clearE2EState, readE2EState } from "./fixtures/state";

async function globalTeardown() {
  let state;

  try {
    state = readE2EState();
  } catch {
    // No state file -- global setup never completed, nothing to clean up.
    return;
  }

  const admin = createE2EAdminClient();

  const { data: versions } = await admin
    .from("catalog_versions")
    .select("id")
    .eq("version_key", state.catalogVersionKey);
  const { data: ruleVersions } = await admin
    .from("rule_versions")
    .select("id")
    .eq("version_key", state.ruleVersionKey);

  const catalogVersionIds = (versions ?? []).map((row) => row.id);
  const ruleVersionIds = (ruleVersions ?? []).map((row) => row.id);

  // generated_routines.catalog_version_id/rule_version_id are NOT NULL with
  // no cascade, and its user_id is "on delete set null" (not cascade) -- so
  // deleting the test users below would leave orphaned routine rows that
  // still reference these versions, blocking version deletion. Must delete
  // routines first, explicitly.
  if (catalogVersionIds.length > 0) {
    await admin.from("generated_routines").delete().in("catalog_version_id", catalogVersionIds);
  }
  if (ruleVersionIds.length > 0) {
    await admin.from("generated_routines").delete().in("rule_version_id", ruleVersionIds);
  }

  const { error: productsDeleteError } = await admin
    .from("catalog_products")
    .delete()
    .ilike("product_name", `%${state.runId}%`);
  if (productsDeleteError) {
    console.error("[e2e global-teardown] failed to delete test products:", productsDeleteError);
  }

  if (catalogVersionIds.length > 0) {
    const { error } = await admin.from("catalog_versions").delete().in("id", catalogVersionIds);
    if (error) console.error("[e2e global-teardown] failed to delete catalog_versions:", error);
  }
  if (ruleVersionIds.length > 0) {
    const { error } = await admin.from("rule_versions").delete().in("id", ruleVersionIds);
    if (error) console.error("[e2e global-teardown] failed to delete rule_versions:", error);
  }

  // Cascades catalog_admins, routine_check_ins, skin_profiles, privacy_consents, etc.
  // Consumer test users are created and cleaned up by their own spec files.
  await deleteUserByEmail(admin, state.adminEmail);

  clearE2EState();

  console.log(`[e2e global-teardown] cleaned up fixtures for run ${state.runId}`);
}

export default globalTeardown;
