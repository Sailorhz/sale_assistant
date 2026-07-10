import { test, expect } from "@playwright/test";

test.describe("unauthenticated redirects", () => {
  for (const path of ["/account", "/protected", "/admin/catalog-products"]) {
    test(`${path} redirects to /auth/login`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/\/auth\/login\?next=/);
    });
  }
});
