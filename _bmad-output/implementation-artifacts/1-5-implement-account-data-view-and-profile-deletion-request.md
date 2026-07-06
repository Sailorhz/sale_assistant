# Story 1.5: Implement Account Data View and Profile Deletion Request

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authenticated user,
I want to view and delete my profile data,
so that I remain in control of sensitive skincare information.

## Acceptance Criteria

1. Given an authenticated user opens their account page, when they view account data settings, then they can see a summary of stored recommendation-related profile data.
2. Users can request deletion of profile data.
3. The deletion flow uses clear confirmation copy before deleting.
4. Deleted profile data is no longer available for recommendation history views.
5. The implementation does not include photo deletion UI unless optional photo storage is later added.

## Tasks / Subtasks

- [x] Add account data and deletion request foundation. (AC: 1, 2, 4)
  - [x] Add a Supabase migration for `profile_deletion_requests`, scoped to authenticated users and protected by RLS.
  - [x] Track requested deletion status, request timestamp, and completion timestamp for future processing.
  - [x] Keep database naming `snake_case` and TypeScript naming `camelCase`.
  - [x] Do not create fake profile, routine, check-in, or photo records.

- [x] Add authenticated account data API. (AC: 1, 2, 3, 4)
  - [x] Add `GET /api/account/profile-data` to return the authenticated user's recommendation-related account data summary.
  - [x] Add `POST /api/account/profile-data` to request profile data deletion after explicit confirmation text.
  - [x] Use `getClaims()` through the existing server Supabase helper; do not use service-role credentials.
  - [x] Return typed JSON results and no raw stack traces.
  - [x] Use `Cache-Control: no-store` for account data responses.

- [x] Add account data/deletion UI. (AC: 1, 2, 3, 5)
  - [x] Add a Routinelle account data component under `src/components/routinelle/account/`.
  - [x] Show current recommendation-related data categories: skin profile answers, saved routines, outcome/check-ins, and photo status.
  - [x] Clearly state when no profile/routine data is stored yet.
  - [x] Add deletion confirmation copy and require the user to type a clear confirmation phrase before submitting.
  - [x] Do not add photo deletion UI or photo controls.

- [x] Integrate with `/account`. (AC: 1-5)
  - [x] Render the account data/deletion section on authenticated `/account`.
  - [x] Preserve Story 1.4 privacy consent section.
  - [x] Preserve `/account` no-env setup behavior and public preview access.
  - [x] Do not implement actual recommendation history views beyond the truthful summary/foundation.

- [x] Verify account data/deletion behavior. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/` still renders publicly.
  - [x] Confirm `/account` still shows controlled no-env setup when Supabase env vars are missing.
  - [x] Confirm account data copy includes no photo deletion UI.
  - [x] Confirm malformed deletion requests return validation JSON, and account API responses use `Cache-Control: no-store`.
  - [x] Confirm service-role/secret scan returns no client-exposed secrets.
  - [x] If real Supabase env vars are unavailable, document that live deletion persistence was compile-verified but not exercised locally.

### Review Findings

- [x] [Review][Patch] Make duplicate deletion requests idempotent under concurrent POSTs. [`routinelle/src/lib/supabase/profile-deletion.ts:57`]

## Dev Notes

### Scope Boundaries

- This story adds account data transparency and a profile deletion request path.
- It must not implement real profile/routine tables, recommendation history views, photo storage, photo deletion UI, admin processing, or hard-delete workflows for data tables that do not yet exist.
- Since profile/routine storage is not implemented yet, the summary should be truthful: no saved profile/routine data exists yet.
- Story 1.4 owns consent storage and privacy/data-use copy.
- Later profile/routine stories must honor any deletion request state before showing recommendation history.

### Current Repository State

- Story 1.4 is done.
- `/account` renders account summary plus `PrivacyConsentPanel`.
- Consent foundation exists:
  - `supabase/migrations/0001_privacy_consents.sql`
  - `src/lib/domain/privacy-consent.ts`
  - `src/lib/supabase/privacy-consent.ts`
  - `src/app/api/account/privacy-consent/route.ts`
  - `src/components/routinelle/account/privacy-consent-panel.tsx`
- No real skin profile, routine, outcome, check-in, or photo tables exist.
- Next.js cache components are enabled; dynamic account work must stay behind Suspense/`connection()`.

### Architecture Requirements

- User profile, routine, reaction, and optional photo data are sensitive personal data.
- Profile deletion and data export/delete pathways must be supported for GDPR-oriented expectations.
- Never expose service-role keys to the client.
- Supabase access belongs in `lib/supabase/`; UI should call API routes, not Supabase directly.
- Account page remains under `src/app/(consumer)/account/page.tsx`.

### Implementation Guidance

- Suggested migration: `routinelle/supabase/migrations/0002_profile_deletion_requests.sql`.
- Suggested table: `profile_deletion_requests`.
- Suggested columns:
  - `id uuid primary key default gen_random_uuid()`
  - `user_id uuid not null references auth.users(id) on delete cascade`
  - `status text not null default 'requested'`
  - `requested_at timestamptz not null default now()`
  - `completed_at timestamptz`
  - `request_note text`
- Add RLS so users can select and insert their own deletion requests.
- Suggested app files:
  - `src/lib/domain/account-data.ts`
  - `src/lib/supabase/profile-deletion.ts`
  - `src/app/api/account/profile-data/route.ts`
  - `src/components/routinelle/account/account-data-panel.tsx`
  - update `src/app/(consumer)/account/page.tsx`

### UX Requirements

- Confirmation copy should be explicit and calm.
- Recommended confirmation phrase: `DELETE PROFILE DATA`.
- Explain that profile/routine/check-in data is not stored yet if that is the current truth.
- Explain that photos are not part of MVP storage, without presenting photo deletion controls.
- Avoid medical diagnosis or treatment language.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `curl` or browser check that `/` remains public
  - `curl` or browser check that `/account` no-env setup remains controlled
  - API malformed POST returns validation JSON with `Cache-Control: no-store`
  - source/content check confirms no photo deletion UI
  - `rg -n "service_role|SERVICE_ROLE|SUPABASE_SECRET|sb_secret|NEXT_PUBLIC_.*SECRET|NEXT_PUBLIC_.*SERVICE" routinelle` returns no client-exposed secrets
- If no Supabase env vars are configured, document that live deletion persistence was not exercised.

### Implementation Anti-Patterns To Avoid

- Do not create fake user profile/routine rows to demonstrate deletion.
- Do not build photo deletion UI.
- Do not add service-role credentials.
- Do not expose raw Supabase errors or stack traces.
- Do not require account/deletion flow before the public sample preview.

### Previous Story Learnings

- Story 1.4 added consent APIs with `Cache-Control: no-store` and typed error responses.
- Story 1.4 uses client panels under `components/routinelle/account/` that call account API routes.
- Story 1.4 preserves no-env `/account` behavior and public preview access.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.5]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR48, FR49, NFR8, NFR9]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Privacy/account data]
- [Source: `_bmad-output/implementation-artifacts/1-4-add-privacy-consent-and-data-use-summary.md` - Previous Story Learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 1.4 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started successfully on `http://localhost:3000`.
- `curl -i http://localhost:3000/` returned `200 OK` and public preview content.
- `curl -i http://localhost:3000/account` returned `200 OK` with controlled no-env setup copy.
- `curl -i http://localhost:3000/api/account/profile-data` returned typed `500 system-error` with `Cache-Control: no-store` because Supabase env vars are not configured locally.
- Malformed `POST /api/account/profile-data` returned typed `400 validation` with `Cache-Control: no-store`.
- Service-role/secret scan found no matches.
- Source check confirmed photo content is limited to MVP not-stored status copy and no photo controls were added.
- Post-review `npm run lint` passed after idempotency patch.
- Post-review `npm run build` passed after idempotency patch.

### Completion Notes List

- Added `profile_deletion_requests` migration with RLS select/insert policies for authenticated user-owned requests.
- Added account data domain summary and Supabase deletion request helpers without creating fake profile, routine, check-in, or photo records.
- Added authenticated `GET`/`POST /api/account/profile-data` with explicit `DELETE PROFILE DATA` confirmation, typed JSON errors, and `no-store` headers.
- Added `AccountDataPanel` to display recommendation-related data categories, truthful no-data status, photo not-stored status, and profile deletion request flow.
- Integrated the account data section into authenticated `/account` while preserving Story 1.4 privacy consent and no-env behavior.
- Code review patch applied: duplicate concurrent deletion requests now re-read the existing open deletion request instead of returning a false 500 from the partial unique index.
- Live deletion persistence was compile-verified but not exercised locally because Supabase env vars are not configured.

### File List

- `_bmad-output/implementation-artifacts/1-5-implement-account-data-view-and-profile-deletion-request.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0002_profile_deletion_requests.sql`
- `routinelle/src/app/(consumer)/account/page.tsx`
- `routinelle/src/app/api/account/profile-data/route.ts`
- `routinelle/src/components/routinelle/account/account-data-panel.tsx`
- `routinelle/src/lib/domain/account-data.ts`
- `routinelle/src/lib/supabase/profile-deletion.ts`

## Change Log

- 2026-05-15: Implemented account data view and profile deletion request foundation. Story moved to review.
- 2026-05-15: Applied code review idempotency patch and moved story to done.
