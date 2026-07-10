import { test, expect } from "@playwright/test";

test.describe("unauthenticated redirects", () => {
  for (const path of ["/account", "/protected", "/admin/catalog-products"]) {
    test(`${path} redirects to /auth/login`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/\/auth\/login\?next=/);
    });
  }
});

test.describe("legal pages stay public", () => {
  for (const path of ["/privacy", "/terms"]) {
    test(`${path} is reachable without signing in`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }
});
