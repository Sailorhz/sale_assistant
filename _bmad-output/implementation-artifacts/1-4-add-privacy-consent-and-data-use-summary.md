# Story 1.4: Add Privacy Consent and Data Use Summary

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to understand what profile and routine data Routinelle uses,
so that I can decide whether to save and track my skincare routine.

## Acceptance Criteria

1. Given a user reaches a save or tracking point, when the app asks for consent to store profile/routine data, then it explains what data is collected and why it improves recommendations.
2. The consent and data-use copy makes clear that precise location, camera, and photo permissions are not required for MVP recommendations.
3. Consent state is stored for authenticated users.
4. Users can view what recommendation-related data is associated with their account.
5. Privacy copy is plain-language and GDPR-oriented.

## Tasks / Subtasks

- [x] Add privacy consent domain and storage foundation. (AC: 1, 3, 4)
  - [x] Add a Supabase migration for an authenticated user consent record, scoped to the current user and protected by RLS.
  - [x] Store consent fields for profile/routine storage, outcome tracking, consent version, timestamps, and optional withdrawal.
  - [x] Keep database naming `snake_case`; keep TypeScript/domain naming `camelCase`.
  - [x] Do not store real skin profile, routine, check-in, deletion, or photo data in this story.

- [x] Add authenticated consent API handlers. (AC: 3, 4)
  - [x] Add `GET /api/account/privacy-consent` to return the current authenticated user's consent state and data-use summary.
  - [x] Add `POST /api/account/privacy-consent` to save or update the current authenticated user's consent state.
  - [x] Use the existing server Supabase helper and `getClaims()` for authorization; do not use service-role credentials.
  - [x] Return typed JSON results with `ok`, `data`/`error`, and avoid raw stack traces.
  - [x] Return `auth-required` or `system-error` style errors for unauthenticated or missing-env cases.

- [x] Add account privacy UI. (AC: 1, 2, 4, 5)
  - [x] Add a Routinelle privacy/consent component under `src/components/routinelle/account/`.
  - [x] Display plain-language copy explaining profile inputs, generated routine, outcome/check-in data, budget/market, and why each improves recommendations.
  - [x] Display clear MVP permission boundaries: no precise location, no camera permission, no photo library permission, no photo upload required.
  - [x] Show the currently known account data summary and consent state.
  - [x] Let authenticated users grant or withdraw consent from the account page.

- [x] Integrate with the Story 1.3 account route without changing public access. (AC: 1-5)
  - [x] Render the privacy/consent section on `/account` after authentication.
  - [x] Keep `/`, `#sample-preview`, and `/auth/*` public and unchanged.
  - [x] Preserve `/account` no-env controlled setup behavior.
  - [x] Do not add signup prompts to the public preview and do not require consent before seeing the sample.

- [x] Verify privacy consent behavior. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev` and confirm `/` still renders publicly.
  - [x] Confirm `/account` still shows the controlled no-env setup message when Supabase env vars are missing.
  - [x] Confirm privacy copy includes no precise location, camera, or photo requirement.
  - [x] Confirm service-role/secret key scan still returns no client-exposed secrets.
  - [x] If real Supabase env vars are unavailable, document that live consent persistence was not exercised locally.

### Review Findings

- [x] [Review][Patch] Add explicit no-store caching for user-specific privacy consent API responses [routinelle/src/app/api/account/privacy-consent/route.ts:31]
- [x] [Review][Patch] Return validation errors for malformed JSON request bodies instead of generic system errors [routinelle/src/app/api/account/privacy-consent/route.ts:90]
- [x] [Review][Patch] Render privacy/data-use copy from local constants if the API request fails [routinelle/src/components/routinelle/account/privacy-consent-panel.tsx:148]

## Dev Notes

### Scope Boundaries

- This story introduces consent/data-use transparency and a minimal storage path for authenticated users.
- It must not implement routine saving, real onboarding profile storage, check-ins, analytics, deletion request flow, photo storage, photo deletion, precise location, or camera/photo permission flows.
- Story 1.5 owns account data view depth and profile deletion request.
- Epic 6 owns saved routine and check-in workflows.
- Future photo progress must remain optional and separate from core recommendations.

### Current Repository State

- Story 1.3 is done.
- `/account` exists at `routinelle/src/app/(consumer)/account/page.tsx` and is the canonical protected account route.
- `/account` currently shows a controlled setup card when Supabase env vars are missing and a minimal signed-in placeholder when authenticated.
- Auth helpers live in `routinelle/src/lib/supabase/`.
- The app uses Next.js `16.2.6` with cache components enabled; dynamic account work must remain behind Suspense/`connection()` rather than `dynamic = "force-dynamic"`.
- No unit test framework is configured.
- Supabase migrations folder exists but only contains `.gitkeep`.

### Architecture Requirements

- User profile, routine, reaction, and optional photo data are sensitive and must be handled with privacy-by-design principles.
- Anonymous users can complete first routine flow where possible; account is required to save routines, track outcomes, and receive check-ins.
- Collect only data needed for recommendations.
- No camera/photo permission in MVP.
- No precise location in MVP; market/country selection is enough.
- Never expose service-role keys to the client.
- Supabase mapping should live in service/repository code, not product UI components.

### Implementation Guidance

- Suggested migration: `routinelle/supabase/migrations/0001_privacy_consents.sql`.
- Suggested table: `privacy_consents`.
- Suggested columns:
  - `user_id uuid primary key references auth.users(id) on delete cascade`
  - `profile_routine_storage_consent boolean not null default false`
  - `outcome_tracking_consent boolean not null default false`
  - `consent_version text not null`
  - `granted_at timestamptz`
  - `withdrawn_at timestamptz`
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
- Add RLS so users can select/insert/update only their own row.
- Do not use a service-role client. The authenticated user's cookie session should drive RLS.
- Suggested app files:
  - `src/lib/domain/privacy-consent.ts`
  - `src/lib/supabase/privacy-consent.ts`
  - `src/app/api/account/privacy-consent/route.ts`
  - `src/components/routinelle/account/privacy-consent-panel.tsx`
  - update `src/app/(consumer)/account/page.tsx`

### UX Requirements

- Copy should be short, plain, and GDPR-oriented.
- The user should understand:
  - what data Routinelle may store after consent;
  - why stored data improves recommendations;
  - that precise location, camera, and photo access are not required for MVP;
  - consent can be changed later.
- Avoid legalistic copy and avoid implying medical diagnosis.
- Keep account UI mobile-first and readable at 320px/375px.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `curl` or browser check that `/` remains public
  - `curl` or browser check that `/account` no-env setup remains controlled
  - source/content check for privacy copy and no camera/photo/precise-location language
  - `rg -n "service_role|SERVICE_ROLE|SUPABASE_SECRET|sb_secret|NEXT_PUBLIC_.*SECRET|NEXT_PUBLIC_.*SERVICE" routinelle` returns no client-exposed secrets
- If no Supabase env vars are configured, document that API persistence was compile-verified but not live-tested.

### Implementation Anti-Patterns To Avoid

- Do not require consent before the public sample preview.
- Do not add photo upload, camera permission, precise location, or native permission prompts.
- Do not implement deletion UI or data deletion logic in this story.
- Do not store raw profile or routine data in the consent table.
- Do not use service-role credentials.
- Do not add a full privacy policy page unless needed for the account consent flow.

### Previous Story Learnings

- Story 1.3 established `/account` as the canonical protected route and kept public preview unauthenticated.
- Story 1.3 showed that dynamic `/account` work must sit behind Suspense with `connection()` for Next.js 16 cache components.
- Story 1.3 added safe Supabase public env assertions and safe relative `next` handling.
- Story 1.3 live auth was not exercised locally because real Supabase env vars are not configured.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.4]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR47, FR48, FR52, NFR8, NFR11, NFR12]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Sensitive data posture]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Privacy, Consent & Account Data mapping]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Journey Patterns and MVP permission constraints]
- [Source: `_bmad-output/implementation-artifacts/1-3-configure-supabase-auth-and-session-boundary.md` - Previous Story Learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 1.3 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started at `http://localhost:3000`.
- `curl -s -o /tmp/routinelle-14-home.html -w "%{http_code}" --max-time 15 http://127.0.0.1:3000/` returned `200`.
- `rg -q "First routine before signup" /tmp/routinelle-14-home.html` confirmed public preview access.
- `curl -s -o /tmp/routinelle-14-account.html -w "%{http_code}" --max-time 15 http://127.0.0.1:3000/account` returned `200` without Supabase env vars.
- `rg -q "Account setup needed" /tmp/routinelle-14-account.html` confirmed controlled no-env account behavior was preserved.
- `curl -s -o /tmp/routinelle-14-api.html -w "%{http_code}" --max-time 15 http://127.0.0.1:3000/api/account/privacy-consent` returned `500` without Supabase env vars.
- `/tmp/routinelle-14-api.html` contained typed JSON: `{"ok":false,"error":{"code":"system-error","message":"Privacy consent is unavailable right now."}}`.
- `rg -n "precise location|camera permission|photo library|photo upload|required for MVP|Privacy and data use|recommendation data" routinelle/src/components/routinelle/account/privacy-consent-panel.tsx routinelle/src/lib/domain/privacy-consent.ts` confirmed privacy copy and MVP permission boundaries.
- `rg -n "service_role|SERVICE_ROLE|SUPABASE_SECRET|sb_secret|NEXT_PUBLIC_.*SECRET|NEXT_PUBLIC_.*SERVICE|getSession\(" routinelle` returned no matches.
- Live consent persistence was not exercised because real Supabase environment variables are not configured locally.
- Review patch verification: `npm run lint` passed.
- Review patch verification: `npm run build` passed.
- Review patch verification: `GET /api/account/privacy-consent` returned `500` with `cache-control: no-store` and typed `system-error` JSON when Supabase env vars are absent.
- Review patch verification: malformed `POST /api/account/privacy-consent` returned `400` with `cache-control: no-store` and typed `validation` JSON.
- Review patch verification: `/` returned `200` and `/account` returned `200` with the no-env setup card after patches.

### Completion Notes List

- Added `privacy_consents` Supabase migration with user-scoped RLS policies for select, insert, and update.
- Added privacy consent domain constants, data-use summary copy, MVP permission boundaries, and mapping helpers.
- Added authenticated `GET` and `POST` handlers at `/api/account/privacy-consent` using the existing server Supabase helper and `getClaims()`.
- Added `PrivacyConsentPanel` under `src/components/routinelle/account/` with plain-language consent copy, data-use summary, permission boundaries, current consent state, and grant/withdraw controls.
- Integrated the privacy panel into the authenticated `/account` route while preserving the no-env setup card and public preview access.
- Did not add real profile/routine storage, check-ins, deletion flow, photo upload/storage, precise location, camera/photo permissions, analytics, service-role credentials, or signup prompts on the public preview.
- Code review patches added no-store privacy API responses, malformed JSON validation, and local privacy-copy fallbacks for the account panel.

### File List

- `_bmad-output/implementation-artifacts/1-4-add-privacy-consent-and-data-use-summary.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0001_privacy_consents.sql`
- `routinelle/src/app/(consumer)/account/page.tsx`
- `routinelle/src/app/api/account/privacy-consent/route.ts`
- `routinelle/src/components/routinelle/account/privacy-consent-panel.tsx`
- `routinelle/src/lib/domain/privacy-consent.ts`
- `routinelle/src/lib/supabase/privacy-consent.ts`

### Change Log

- 2026-05-15: Added privacy consent/data-use summary foundation, authenticated consent API, account privacy UI, and Supabase consent migration; marked Story 1.4 ready for review.
- 2026-05-15: Addressed Story 1.4 code review patches and marked Story 1.4 done.
