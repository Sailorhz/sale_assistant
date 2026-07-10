import { test, expect } from "@playwright/test";

import { createE2EAdminClient, deleteUserByEmail, findUserByEmail } from "./fixtures/admin-client";
import { completeOnboarding, generateRoutine } from "./fixtures/onboarding-helpers";
import { readE2EState } from "./fixtures/state";

function buildTestEmail(runId: string) {
  const base = process.env.E2E_SIGNUP_EMAIL_BASE;
  if (!base) {
    throw new Error(
      "E2E_SIGNUP_EMAIL_BASE is required (e.g. yourname@gmail.com) -- Supabase rejects " +
        "reserved/example domains for real signups, so this spec plus-addresses a real " +
        "mailbox instead. Set it in .env.local for local runs or as a CI secret.",
    );
  }

  const [localPart, domain] = base.split("@");
  return `${localPart}+e2e-${runId}@${domain}`;
}

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const email = buildTestEmail(runId);
const password = "E2eSuiteConsumer!2026Test";

test.describe.serial("consumer journey", () => {
  test.afterAll(async () => {
    const admin = createE2EAdminClient();
    await deleteUserByEmail(admin, email);
  });

  test("signup, login, onboarding, save, and check in", async ({ page }) => {
    const state = readE2EState();

    await test.step("real signup form creates the account", async () => {
      await page.goto("/auth/sign-up", { waitUntil: "networkidle" });
      await page.fill('input[type="email"]', email);
      const passwordInputs = page.locator('input[type="password"]');
      await passwordInputs.nth(0).fill(password);
      await passwordInputs.nth(1).fill(password);
      await page.getByRole("button", { name: /Sign up|Create account/i }).click();
      await page.waitForTimeout(1500);
    });

    await test.step("confirm the email (no inbox in CI, same as a clicked confirmation link)", async () => {
      const admin = createE2EAdminClient();
      const user = await findUserByEmail(admin, email);
      expect(user, `signup should have created a user for ${email}`).not.toBeNull();
      const { error } = await admin.auth.admin.updateUserById(user!.id, { email_confirm: true });
      expect(error).toBeNull();
    });

    await test.step("login with the confirmed account", async () => {
      await page.goto("/auth/login", { waitUntil: "networkidle" });
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.getByRole("button", { name: /Sign in|Log in/ }).click();
      await page.waitForURL(/\/account/, { timeout: 10_000 });
    });

    await test.step("onboarding generates a routine with real recommendations", async () => {
      await page.goto("/onboarding", { waitUntil: "networkidle" });
      await completeOnboarding(page, { concern: "Blemishes", budget: "Moderate" });
      await generateRoutine(page);

      const body = await page.innerText("body");
      expect(body).toContain(`Cleanser ${state.runId}`);
      expect(body).toContain(`Moisturizer ${state.runId}`);
      expect(body).toContain(`Sunscreen ${state.runId}`);
      expect(body).not.toContain("no-eligible-product");
    });

    await test.step("save routine and view the saved page", async () => {
      await page.getByRole("button", { name: /Save this routine/ }).click();
      await page.waitForURL(/\/routines\/[0-9a-f-]+/, { timeout: 15_000 });

      // The saved-routine page briefly renders a loading fallback before the
      // server component resolves -- wait past it rather than racing it.
      await expect(page.getByText("7-day check-in")).toBeVisible({ timeout: 10_000 });
    });

    await test.step("happy-path check-in shows adjusted guidance", async () => {
      await page.getByRole("button", { name: /Submit simple check-in/ }).click();
      await expect(
        page.getByText(/Continue the routine and reassess at the next check-in/),
      ).toBeVisible({ timeout: 10_000 });
    });

    await test.step("serious-symptom check-in triggers professional-care messaging", async () => {
      const selects = page.locator("select");
      await selects.nth(1).selectOption("strong"); // Redness
      await page.getByText("Symptoms are persistent or worsening").click();
      await page.getByRole("button", { name: /Submit simple check-in/ }).click();

      await expect(
        page.getByText(/Pause routine changes and seek professional care/),
      ).toBeVisible({ timeout: 10_000 });
    });
  });
});
