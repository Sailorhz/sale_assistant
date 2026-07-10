import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is required to run the E2E suite (set it in .env.local for local runs, or as a GitHub Actions secret in CI).`,
    );
  }

  return value;
}

/**
 * Service-role client for E2E test setup/teardown only. Never imported by
 * application code or bundled client-side -- this key must only ever exist
 * in .env.e2e.local (gitignored) or CI secrets, scoped to the dev/test
 * Supabase project, never production.
 */
export function createE2EAdminClient() {
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requiredEnv("E2E_SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type E2ESupabaseAdmin = ReturnType<typeof createE2EAdminClient>;

export async function findUserByEmail(admin: E2ESupabaseAdmin, email: string) {
  let page = 1;

  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;

    const found = data.users.find((user) => user.email === email);
    if (found) return found;
    if (data.users.length < 200) return null;

    page += 1;
  }
}

export async function createConfirmedUser(
  admin: E2ESupabaseAdmin,
  email: string,
  password: string,
) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw error;

  return data.user;
}

export async function grantCatalogAdmin(admin: E2ESupabaseAdmin, userId: string) {
  const { error } = await admin
    .from("catalog_admins")
    .insert({ user_id: userId, note: "e2e-suite" });

  if (error) throw error;
}

export async function deleteUserByEmail(admin: E2ESupabaseAdmin, email: string) {
  const user = await findUserByEmail(admin, email);
  if (!user) return;

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;
}
