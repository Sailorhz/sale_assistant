import { test, expect } from "@playwright/test";

import { completeOnboarding, generateRoutine } from "./fixtures/onboarding-helpers";
import { readE2EState } from "./fixtures/state";

test.describe("budget-band matching on the support step", () => {
  test("low budget sees only the low-band product", async ({ page }) => {
    const state = readE2EState();
    await page.goto("/onboarding", { waitUntil: "networkidle" });
    await completeOnboarding(page, { concern: "Blemishes", budget: "Low" });
    await generateRoutine(page);

    const body = await page.innerText("body");
    expect(body).toContain(`Support Low ${state.runId}`);
    expect(body).not.toContain(`Support Moderate ${state.runId}`);
    expect(body).not.toContain(`Support Premium ${state.runId}`);
    expect(body).not.toContain(`Support Luxury ${state.runId}`);
  });

  test("moderate budget ranks the moderate product ahead of low-band backfill", async ({ page }) => {
    const state = readE2EState();
    await page.goto("/onboarding", { waitUntil: "networkidle" });
    await completeOnboarding(page, { concern: "Blemishes", budget: "Moderate" });
    await generateRoutine(page);

    const body = await page.innerText("body");
    const moderateIndex = body.indexOf(`Support Moderate ${state.runId}`);
    const lowIndex = body.indexOf(`Support Low ${state.runId}`);

    expect(moderateIndex).toBeGreaterThan(-1);
    expect(lowIndex).toBeGreaterThan(moderateIndex);
    expect(body).not.toContain(`Support Premium ${state.runId}`);
    expect(body).not.toContain(`Support Luxury ${state.runId}`);
  });

  test("premium budget surfaces both premium and luxury bands, cheapest first, ahead of low-band backfill", async ({
    page,
  }) => {
    const state = readE2EState();
    await page.goto("/onboarding", { waitUntil: "networkidle" });
    await completeOnboarding(page, { concern: "Blemishes", budget: "Premium" });
    await generateRoutine(page);

    const body = await page.innerText("body");
    const premiumIndex = body.indexOf(`Support Premium ${state.runId}`);
    const luxuryIndex = body.indexOf(`Support Luxury ${state.runId}`);
    const lowIndex = body.indexOf(`Support Low ${state.runId}`);

    expect(premiumIndex).toBeGreaterThan(-1);
    expect(luxuryIndex).toBeGreaterThan(-1);
    expect(lowIndex).toBeGreaterThan(-1);
    // Cheapest-first within the matching tier: premium (35.00) before luxury (150.00).
    expect(luxuryIndex).toBeGreaterThan(premiumIndex);
    // Low-band backfill ranks behind both matching-tier options.
    expect(lowIndex).toBeGreaterThan(luxuryIndex);
    expect(body).not.toContain(`Support Moderate ${state.runId}`);
  });
});
