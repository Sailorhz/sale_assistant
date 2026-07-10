import { test, expect } from "@playwright/test";

import { completeOnboarding, generateRoutine } from "./fixtures/onboarding-helpers";
import { readE2EState } from "./fixtures/state";

function fieldInput(page: import("@playwright/test").Page, labelText: string) {
  return page
    .locator(`label:has-text("${labelText}") input, label:has-text("${labelText}") textarea`)
    .first();
}

function fieldSelect(page: import("@playwright/test").Page, labelText: string) {
  return page.locator(`label:has-text("${labelText}") select`).first();
}

test("admin creates and publishes a product, and it surfaces in a matching recommendation", async ({
  page,
}) => {
  const state = readE2EState();
  const productName = `Admin Created Serum ${state.runId}`;

  await test.step("login as the catalog admin", async () => {
    await page.goto("/auth/login", { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', state.adminEmail);
    await page.fill('input[type="password"]', state.adminPassword);
    await page.getByRole("button", { name: /Sign in|Log in/ }).click();
    await page.waitForURL(/\/account/, { timeout: 10_000 });
  });

  await test.step("create and publish a product via the admin UI", async () => {
    await page.goto("/admin/catalog-products", { waitUntil: "networkidle" });

    await fieldInput(page, "Brand").fill("E2E Admin Flow Brand");
    await fieldInput(page, "Product").fill(productName);
    await fieldSelect(page, "Category").selectOption("serum");
    await fieldSelect(page, "Routine step").selectOption("support");
    await fieldInput(page, "INCI list").fill("Aqua, Niacinamide");
    await fieldInput(page, "Function tags").fill("blemish-support");
    await fieldInput(page, "Key ingredients").fill("Niacinamide");
    await fieldInput(page, "Verified claim").fill("Cosmetic blemish support");
    await fieldInput(page, "Price minor units").fill("1000");
    await fieldSelect(page, "Price band").selectOption("moderate");
    await fieldInput(page, "Size").fill("30");
    await fieldSelect(page, "Market").selectOption("us");
    await fieldSelect(page, "Publication status").selectOption("published");

    await page.getByRole("button", { name: "Create product" }).click();
    await expect(page.getByText("Product saved and eligible.")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(productName)).toBeVisible();
  });

  await test.step("the new product surfaces in a matching recommendation", async () => {
    await page.goto("/onboarding", { waitUntil: "networkidle" });
    await completeOnboarding(page, { concern: "Blemishes", budget: "Moderate" });
    await generateRoutine(page);

    const body = await page.innerText("body");
    expect(body).toContain(productName);
  });
});
