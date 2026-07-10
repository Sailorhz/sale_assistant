import type { Page } from "@playwright/test";

export async function clickAnswer(page: Page, text: string) {
  const button = page
    .locator('[role="radiogroup"] button, [role="group"] button', { hasText: text })
    .first();
  await button.click();
}

export async function continueOnboarding(page: Page) {
  await page.getByRole("button", { name: /Continue|Review profile/ }).click();
}

export type OnboardingProfile = {
  skinType?: string;
  concern?: string;
  sensitivity?: string;
  budget?: string;
  market?: string;
};

const DEFAULTS: Required<OnboardingProfile> = {
  skinType: "Balanced / medium",
  concern: "Blemishes",
  sensitivity: "Rarely",
  budget: "Moderate",
  // Matches global-setup.ts's fixtures, which deliberately use "us" to stay
  // isolated from other (non-E2E) content in the shared dev project's
  // "france" market.
  market: "US",
};

/**
 * Answers every onboarding question with a neutral default, skipping the
 * signal questions (acne/oiliness, irritation/barrier, serious symptoms,
 * current routine) with "None of these" / "Skip for now" so the resulting
 * profile stays a plain, non-safety-blocked, non-gentle-start case unless
 * the caller overrides sensitivity to trigger that path deliberately.
 */
export async function completeOnboarding(page: Page, overrides: OnboardingProfile = {}) {
  const profile = { ...DEFAULTS, ...overrides };
  const answers = [
    profile.skinType,
    profile.concern,
    profile.sensitivity,
    "None of these",
    "None of these",
    "None of these",
    "Skip for now",
    profile.budget,
    profile.market,
  ];

  for (const answer of answers) {
    await clickAnswer(page, answer);
    await continueOnboarding(page);
    await page.waitForTimeout(250);
  }
}

export async function generateRoutine(page: Page) {
  const genButton = page.getByRole("button", { name: /Generate my routine/ });
  await genButton.waitFor({ timeout: 10_000 });
  await genButton.click();
  await page
    .getByText(/Your starter routine|professional care/i)
    .waitFor({ timeout: 20_000 });
}
