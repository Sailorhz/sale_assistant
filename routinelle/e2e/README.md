# E2E test suite

Real end-to-end tests driven by Playwright against a locally built-and-started
copy of the app (`next build && next start`), talking to the **dev** Supabase
project (never production).

## Running locally

1. Add `E2E_SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (see `.env.example`) --
   the service-role key for the dev project referenced by
   `NEXT_PUBLIC_SUPABASE_URL` in the same file. Get it from Supabase dashboard
   → Project Settings → API → service_role key.
2. Add `E2E_SIGNUP_EMAIL_BASE` to `.env.local` -- a real mailbox (e.g.
   `you@gmail.com`). Supabase rejects `@example.com`/other reserved test
   domains for real signups, so `consumer-journey.spec.ts` plus-addresses this
   mailbox instead (`you+e2e-<runid>@gmail.com`). Confirmation happens via the
   service-role admin API, not a clicked email link, so nothing is ever
   actually sent -- the address just needs to look like a real domain to
   Supabase's validator.
3. `npx playwright install --with-deps chromium` (one-time browser install).
4. `npm run test:e2e`

## What each spec covers

- `auth-guards.spec.ts` -- unauthenticated visitors get redirected to login.
- `consumer-journey.spec.ts` -- real signup form → login → onboarding →
  routine generation → save → view saved routine → check-in (happy path and
  the serious-symptom safety-escalation path).
- `admin-flow.spec.ts` -- catalog admin creates and publishes a product
  through the real admin UI, and it correctly surfaces in a matching
  recommendation.
- `budget-matching.spec.ts` -- low/moderate/premium budget selections rank
  and filter products by price band correctly, including that "premium"
  surfaces both the premium and luxury tiers ahead of low-band backfill.

## How fixtures work

`global-setup.ts` seeds, once per run: a catalog admin user, a published
`catalog_versions`/`rule_versions` pair, and a handful of catalog products
(one per routine step, plus extra price-band coverage on the support step for
the budget-matching spec) -- all named with a random run ID
(`e2e-catalog-<runId>`, `Cleanser <runId>`, etc.) so concurrent or repeated
runs never collide. `global-teardown.ts` deletes all of it afterward, in the
FK-safe order (routines referencing the test versions first, then the
versions/products, then the admin user).

The consumer-journey spec creates and deletes its own test user (via the real
signup form, confirmed through the service-role admin API since there's no
inbox in CI) rather than reusing a pre-seeded one, since exercising the actual
signup UI is the point of that spec.

If a run crashes before teardown, look for `E2E Test Brand` products,
`e2e-catalog-*`/`e2e-rules-*` versions, `e2e-admin-*@example.com` users, and
`<E2E_SIGNUP_EMAIL_BASE local part>+e2e-*@<domain>` consumer users in the dev
project and remove them by hand.
