# Story 1.3: Configure Supabase Auth and Session Boundary

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want account creation and login to be available only when needed,
so that I can save and track my routine without being forced to sign up too early.

## Acceptance Criteria

1. Given Supabase Auth is configured, when a user chooses to create an account or sign in, then the app supports account authentication through the approved Supabase flow.
2. Authenticated session utilities are available server-side and client-side through `lib/supabase/` helpers.
3. Protected account routes require an authenticated user.
4. Anonymous users can still access public and pre-save routine flow entry points.
5. Service-role credentials are never exposed to the client.

## Tasks / Subtasks

- [x] Harden Supabase auth utility boundaries. (AC: 1, 2, 5)
  - [x] Review `routinelle/src/lib/supabase/client.ts`, `server.ts`, and `proxy.ts`; keep all raw Supabase client creation inside `src/lib/supabase/`.
  - [x] Add or refine a shared server-safe environment guard so auth-dependent server code fails with a controlled Routinelle message when public Supabase env vars are missing, instead of throwing an unhandled runtime error.
  - [x] Keep client-side Supabase creation guarded by `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - [x] Do not add service-role, secret, or admin credentials to client-accessible variables or public code paths.
  - [x] Do not introduce `NEXT_PUBLIC_` variables for any secret/server-only key.

- [x] Establish the protected consumer account boundary. (AC: 2, 3, 4)
  - [x] Add the canonical protected account route at `routinelle/src/app/(consumer)/account/page.tsx`.
  - [x] Require an authenticated Supabase session before rendering the account page; redirect anonymous users to `/auth/login` with a safe relative `next=/account` value.
  - [x] Keep the account page intentionally minimal: show that the user is signed in and that routine saving/tracking will live here later.
  - [x] Do not implement save routine, check-in, profile data view, consent, deletion, analytics, or routine persistence in this story.
  - [x] Remove or neutralize generated starter protected-page/tutorial content so future users are not sent to `/protected` as the product account destination.

- [x] Align auth redirects and forms with Routinelle account flow. (AC: 1, 3, 4)
  - [x] Update login success redirect from `/protected` to the safe `next` path when provided, defaulting to `/account`.
  - [x] Update signup email confirmation redirect to `/auth/confirm?next=/account` or a validated safe relative `next` path.
  - [x] Keep `/auth/confirm` using `verifyOtp` and the existing same-origin relative-path sanitization.
  - [x] Ensure logout redirects to a public route or `/auth/login` without breaking access to `/`.
  - [x] Use Routinelle copy where auth pages currently expose generic starter language, but do not add signup prompts to the public sample preview.

- [x] Preserve public and pre-save access. (AC: 3, 4)
  - [x] Keep `/`, `#sample-preview`, `/auth/*`, and future pre-save consumer flow entry points public.
  - [x] Keep route protection scoped to authenticated surfaces such as `/account`, `/protected` if retained, and `/admin`; do not broaden protection to all consumer routes.
  - [x] Continue using Next.js 16 `proxy.ts` plus `src/lib/supabase/proxy.ts`; do not add a second `middleware.ts`.
  - [x] If `/protected` remains, either redirect it to `/account` or keep it as an internal auth smoke route with no starter/tutorial UI.
  - [x] Do not modify Story 1.2 public shell or sample recommendation preview except where link targets are intentionally aligned to future flow.

- [x] Verify auth/session boundary behavior. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev` and confirm `/` still renders without requiring Supabase env vars.
  - [x] Confirm anonymous access to `/` and the sample preview is not redirected to login.
  - [x] Confirm anonymous access to `/account` redirects to `/auth/login` or shows a controlled configuration message when Supabase env vars are missing.
  - [x] Confirm auth form code still compiles with the current Supabase client helpers and safe redirect handling.
  - [x] Use `rg` to verify no service-role or secret Supabase key is exposed through `NEXT_PUBLIC_` or committed env files.

## Dev Notes

### Scope Boundaries

- This story configures the authentication/session boundary only.
- It must not implement real onboarding, routine generation, routine saving, check-ins, consent storage, account data export/deletion, profile storage, RLS policies, product clicks, analytics, or admin role management.
- Story 1.4 owns privacy consent and data-use summary.
- Story 1.5 owns account data view and profile deletion request.
- Epic 6 owns saved routine and check-in workflows.
- Epic 3 owns catalog/admin governance and future admin authorization details.

### Current Repository State

- The app lives under `routinelle/`.
- Next.js version is `16.2.6`; the app uses `proxy.ts` at the app root, not `src/middleware.ts`.
- `npm run dev` intentionally uses `next dev --webpack`; do not remove this Story 1.1 workaround.
- Supabase dependencies are pinned: `@supabase/ssr` `0.10.3` and `@supabase/supabase-js` `2.105.4`.
- Public Supabase env vars are documented in `routinelle/.env.example` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Existing auth pages live under `routinelle/src/app/auth/`.
- Existing auth forms live in `routinelle/src/components/login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `update-password-form.tsx`, and `logout-button.tsx`.
- Existing protected starter route lives under `routinelle/src/app/protected/`; it still contains generic tutorial content and should not become the product account destination.

### Architecture Requirements

- Supabase Auth is the selected authentication system.
- Anonymous users can complete the first routine flow where possible; account is required only to save routines, track outcomes, and receive check-ins.
- Service-role credentials must never be exposed to the client.
- Raw Supabase access belongs in `src/lib/supabase/`; UI components should not scatter Supabase database access.
- Components must not receive raw database rows; later account/routine features should map database rows through repository/service functions.
- Consumer routes belong under `src/app/(consumer)/`; admin routes belong under `src/app/admin/`.
- Admin/catalog surfaces must remain protected, but admin role checks beyond basic authentication are out of scope until admin/catalog stories.

### Existing Code To Preserve

- `routinelle/src/lib/supabase/proxy.ts` already scopes protected path prefixes to `/protected` and `/admin`. Extend this carefully for `/account`; do not protect `/` or all consumer routes.
- `routinelle/src/lib/supabase/proxy.ts` returns a controlled 500 JSON response for protected paths without Supabase env vars outside development. Preserve the no-env public route behavior.
- `routinelle/src/app/auth/confirm/route.ts` already verifies OTP through `supabase.auth.verifyOtp()` and sanitizes `next` so only same-origin relative paths are allowed. Preserve this behavior.
- `routinelle/src/components/sign-up-form.tsx` already routes confirmation through `/auth/confirm`; update the `next` destination, not the OTP exchange pattern.
- `routinelle/src/components/login-form.tsx` and `update-password-form.tsx` still redirect to `/protected`; align them to `/account` or a sanitized relative `next`.
- `routinelle/src/components/auth-button.tsx` calls the server Supabase helper and displays starter-style sign-in/sign-up actions; if reused, keep it server-safe and Routinelle-oriented.
- Story 1.2 public shell is static, unauthenticated, and has no Supabase/API calls. Preserve that trust-first boundary.

### UX Requirements

- Do not introduce an early account wall. Users must still see the public shell and sample recommendation preview before any signup requirement.
- Auth should feel like an optional save/track step, not a forced prerequisite for judging the product.
- Auth copy should be calm and Routinelle-specific. Avoid generated Supabase tutorial phrasing.
- Keep mobile-first constraints: auth forms and account shell must be readable at 320px and 375px widths.
- Keep copy cosmetic and non-medical; the account page should not imply diagnosis or treatment.

### Latest Technical Notes

- Supabase's SSR guidance says Supabase Auth for SSR stores sessions in cookies and uses `@supabase/ssr` to support client/server access. It recommends separate browser and server clients and a Proxy to refresh auth tokens. [Source: Supabase Docs, Server-Side Rendering: https://supabase.com/docs/guides/auth/server-side]
- Supabase's Next.js SSR client guidance uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, recommends publishable keys for new projects, and notes that older `anon`/`service_role` keys work until the end of 2026 but should be migrated for new projects. [Source: Supabase Docs, Creating a Supabase client for SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client]
- Supabase's SSR guide warns not to trust `getSession()` in server code for authorization and recommends `getClaims()` for protecting pages and user data. [Source: Supabase Docs, Creating a Supabase client for SSR]
- Next.js 16 renamed Middleware to Proxy; the project should keep a single `proxy.ts` entry point and may delegate logic into modules such as `src/lib/supabase/proxy.ts`. [Source: Next.js Docs, Proxy: https://nextjs.org/docs/app/getting-started/proxy]

### File Structure Requirements

Likely files to update:

```text
routinelle/proxy.ts
routinelle/src/lib/supabase/client.ts
routinelle/src/lib/supabase/server.ts
routinelle/src/lib/supabase/proxy.ts
routinelle/src/lib/utils.ts
routinelle/src/app/(consumer)/account/page.tsx
routinelle/src/app/protected/page.tsx
routinelle/src/app/protected/layout.tsx
routinelle/src/app/auth/confirm/route.ts
routinelle/src/app/auth/login/page.tsx
routinelle/src/app/auth/sign-up/page.tsx
routinelle/src/components/login-form.tsx
routinelle/src/components/sign-up-form.tsx
routinelle/src/components/logout-button.tsx
routinelle/src/components/auth-button.tsx
```

Do not create:

```text
routinelle/src/middleware.ts
routinelle/.env.local
client-visible service-role env vars
new recommendation/routine persistence modules
```

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `curl` or browser check that `/` renders without Supabase env vars
  - `curl` or browser check that `/account` does not expose protected content to anonymous users
  - `rg -n "service_role|SERVICE_ROLE|SUPABASE_SECRET|sb_secret|NEXT_PUBLIC_.*SECRET|NEXT_PUBLIC_.*SERVICE" routinelle` returns no client-exposed secrets
- No unit test framework is configured. Do not add test dependencies without approval.
- If a browser/screenshot tool is available, inspect auth pages at 320px and 375px for overflow. If unavailable, document source-level responsive review only.
- Full Supabase email/password authentication may require real Supabase project env vars; if unavailable locally, verify compile-time behavior and no-env/public-route behavior, and document that live auth was not exercised.

### Implementation Anti-Patterns To Avoid

- Do not protect the public homepage, sample preview, or future pre-save onboarding route.
- Do not use `/protected` as the product account destination if it still contains starter tutorial content.
- Do not call Supabase directly from routine/product UI components.
- Do not rely on `supabase.auth.getSession()` in server code for authorization decisions.
- Do not add service-role or secret keys to `.env.example` as usable client variables.
- Do not expose stack traces or raw thrown errors to users when Supabase env vars are missing.
- Do not add account prompts to the first-viewport public shell.
- Do not implement admin roles or RLS policies in this story.

### Previous Story Learnings

- Story 1.1 review patched auth proxy scope, safe confirmation redirects, guarded browser client creation, pinned dependencies, and the webpack dev script. Preserve those fixes.
- Story 1.1 found that missing Supabase env vars must not block public pages, but protected paths should not silently bypass protection outside development.
- Story 1.1 found that signup confirmation must go through `/auth/confirm` for OTP exchange, and `next` redirects must remain same-origin relative paths.
- Story 1.2 proved the public shell and sample preview are static and unauthenticated. Do not add Supabase dependencies to those components.
- Story 1.2 code review found no acceptance-criteria issues; maintain the completed public flow.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.3]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR45, FR46, NFR6, NFR7, NFR12]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Component Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Privacy, Consent & Account Data mapping]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - User Journey Flow and Journey Patterns]
- [Source: `_bmad-output/implementation-artifacts/1-1-initialize-routinelle-app-foundation.md` - Previous Story Learnings and Review Findings]
- [Source: `_bmad-output/implementation-artifacts/1-2-build-mobile-first-public-shell-and-sample-recommendation-preview.md` - Public shell/auth boundary learnings]
- [Source: Supabase Docs, Server-Side Rendering: https://supabase.com/docs/guides/auth/server-side]
- [Source: Supabase Docs, Creating a Supabase client for SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client]
- [Source: Next.js Docs, Proxy: https://nextjs.org/docs/app/getting-started/proxy]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 1.1/1.2 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed after moving dynamic `/account` work behind a Suspense boundary compatible with Next.js 16 cache components.
- `npm run dev` started at `http://localhost:3000`.
- `curl -s -o /tmp/routinelle-home.html -w "%{http_code}" --max-time 15 http://127.0.0.1:3000/` returned `200`.
- `rg -q "First routine before signup" /tmp/routinelle-home.html` confirmed public preview access.
- `curl -s -o /tmp/routinelle-account.html -w "%{http_code}" --max-time 15 http://127.0.0.1:3000/account` returned `200` without Supabase env vars.
- `rg -q "Account setup needed" /tmp/routinelle-account.html` confirmed controlled no-env account behavior.
- `curl -s -o /tmp/routinelle-protected.html -w "%{http_code} %{redirect_url}" --max-time 15 http://127.0.0.1:3000/protected` returned `307 http://127.0.0.1:3000/account`.
- `curl -s -o /tmp/routinelle-login.html -w "%{http_code}" --max-time 15 "http://127.0.0.1:3000/auth/login?next=/account"` returned `200`.
- `rg -q "Sign in to Routinelle" /tmp/routinelle-login.html` confirmed Routinelle auth copy renders.
- `rg -n "service_role|SERVICE_ROLE|SUPABASE_SECRET|sb_secret|NEXT_PUBLIC_.*SECRET|NEXT_PUBLIC_.*SERVICE|getSession\(" routinelle` returned no matches.
- Live Supabase email/password authentication was not exercised because no real Supabase environment variables are configured locally.

### Completion Notes List

- Added `/account` as the canonical protected consumer account surface with a minimal signed-in account placeholder and a controlled no-env setup message.
- Extended the Supabase proxy protected path prefixes to include `/account` and added safe `next` redirect propagation to `/auth/login`.
- Centralized safe relative `next` handling and Supabase public env assertion helpers in `src/lib/utils.ts`.
- Updated login, signup, password update, logout, and auth button redirects/copy to target the Routinelle account flow instead of the generated `/protected` starter destination.
- Preserved `/`, `#sample-preview`, and `/auth/*` as public/pre-save surfaces; Story 1.2 public shell remains static and unauthenticated.
- Replaced `/protected` starter tutorial behavior with a redirect to `/account`.
- Did not add service-role keys, secret env vars, onboarding, routine saving, check-ins, consent, data deletion, analytics, RLS policies, or admin roles.

### File List

- `_bmad-output/implementation-artifacts/1-3-configure-supabase-auth-and-session-boundary.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/app/(consumer)/account/page.tsx`
- `routinelle/src/app/auth/confirm/route.ts`
- `routinelle/src/app/auth/login/page.tsx`
- `routinelle/src/app/auth/sign-up/page.tsx`
- `routinelle/src/app/protected/page.tsx`
- `routinelle/src/components/auth-button.tsx`
- `routinelle/src/components/forgot-password-form.tsx`
- `routinelle/src/components/login-form.tsx`
- `routinelle/src/components/logout-button.tsx`
- `routinelle/src/components/sign-up-form.tsx`
- `routinelle/src/components/update-password-form.tsx`
- `routinelle/src/lib/supabase/client.ts`
- `routinelle/src/lib/supabase/proxy.ts`
- `routinelle/src/lib/supabase/server.ts`
- `routinelle/src/lib/utils.ts`

### Change Log

- 2026-05-15: Implemented Supabase auth/session boundary, canonical `/account` route, safe auth redirects, and no-env/public-route verification; marked Story 1.3 ready for review.
