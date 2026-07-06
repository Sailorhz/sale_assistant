# Story 2.6: Allow Profile Input Updates After First Routine

Status: done

## Story

As a user,
I want to update my skin profile answers after receiving a routine,
so that I can correct mistakes or reflect skin changes.

## Acceptance Criteria

1. Given a user has completed onboarding and reached a profile or routine view, when they choose to edit profile answers, then they can update supported skin profile inputs.
2. Updated values are validated using the same onboarding schema.
3. If the user is authenticated, updated profile data is stored with the user account.
4. If the user is anonymous, updates remain available for the current flow.
5. The app clearly indicates when a routine should be regenerated after profile changes.

## Tasks / Subtasks

- [x] Add profile-update persistence boundary. (AC: 2, 3, 4)
  - [x] Add Supabase schema support for account-linked skin profile answers.
  - [x] Add a server-side helper to upsert validated skin profile answers for an authenticated user.
  - [x] Add an API route that accepts structured onboarding answers and validates them with the onboarding schema.
  - [x] Return `auth-required` for anonymous users so the client can keep changes local.

- [x] Extend onboarding summary into profile-update flow. (AC: 1, 4, 5)
  - [x] Keep existing summary edit actions as the supported input-update surface.
  - [x] Preserve previous answers when users edit and return to summary.
  - [x] Track when answers changed after the first completed profile review.
  - [x] Show a clear routine-regeneration notice after profile changes.
  - [x] Do not build routine generation, product matching, or saved routine views in this story.

- [x] Verify Story 2.6 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/onboarding` renders without Supabase env vars.
  - [x] Confirm anonymous profile updates remain available in the current flow.
  - [x] Confirm API validation rejects incomplete or malformed answers.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] Confirm copy avoids unsafe medical claim language.
  - [x] If browser/axe automation is unavailable, document that limitation.

## Dev Notes

### Scope Boundaries

- Story 2.6 adds a profile-update boundary after the profile summary exists.
- Routine generation is not implemented yet, so this story must not create AM/PM routines, product matching, routine persistence, conflict output, check-ins, photos, analytics, or final safety warnings.
- Anonymous users must continue without account creation; their updates stay in local component state for the current flow.
- Authenticated persistence should use user-scoped Supabase access only. Do not add service-role keys or client-side Supabase calls from onboarding UI.

### Product And UX Requirements

- Supported profile inputs are the existing onboarding questions from Stories 2.1-2.5.
- The update surface should feel like editing a profile, not restarting onboarding from scratch.
- After a completed profile has changed, the UI must clearly say a routine should be regenerated before relying on an earlier routine.
- Use conservative language: "based on your answers", "profile changed", "regenerate routine", not diagnosis or treatment claims.

### Suggested Technical Shape

- Reuse `validateOnboardingAnswers` and add a parser/validator for API input if needed.
- Add `skin_profiles` with `user_id` primary key, `answers` JSONB, `profile_summary` JSONB, `routine_regeneration_required`, `profile_version`, and timestamps.
- Add `lib/supabase/skin-profile.ts` for persistence.
- Add `src/app/api/profile/skin-profile/route.ts` for authenticated upsert.
- In the client flow, call the API after completion; handle `auth-required` as the anonymous current-flow state.

### Previous Story Intelligence

- Story 2.5 added `buildSkinProfileSummary` and edit actions from summary rows/risk flags back into the questionnaire.
- Story 2.4 added conditional current routine details; hidden questions should remain validation-safe.
- Story 2.3 added unknown-confidence metadata.
- `/onboarding` must keep rendering without Supabase env vars.

### Architecture Requirements

- Keep reusable domain and validation logic under `lib/domain/` and `lib/validation/`.
- Keep persistence helpers under `lib/supabase/`.
- Keep UI changes in `components/routinelle/onboarding/`.
- Use server-side Supabase clients only from API/server code.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `/onboarding` returns `200` without Supabase env vars
  - local API validation smoke check for malformed payload
  - source scan for unsafe medical copy and service-role/secret patterns
- If no browser/axe tooling exists, document that limitation.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.6]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR7]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Skin Questionnaire Step and Skin Profile Summary]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - onboarding/profile module and server-side persistence boundary]
- [Source: `_bmad-output/implementation-artifacts/2-5-generate-and-display-skin-profile-summary.md` - previous story implementation and learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 2.5 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/api/profile/skin-profile` as a dynamic route and `/onboarding` as a static route.
- `npm run dev` started with `next dev --webpack`.
- `HEAD /onboarding` returned `200` without Supabase env vars.
- `PUT /api/profile/skin-profile` with malformed profile answers returned `400` validation.
- `PUT /api/profile/skin-profile` with valid anonymous profile answers returned `401 auth-required`, preserving current-flow local updates.
- Valid anonymous profile update with hidden `currentRoutineProductTypes` omitted normalized through the onboarding schema and returned `401 auth-required`.
- Service-role/client-exposed secret pattern scan returned no matches.
- Source scan found only existing safe copy for no-photo scope and non-diagnostic language; no new medical/photo scope was introduced.
- Browser/axe automation is not configured in the repository, so automated viewport/accessibility checks were not run.

### Completion Notes List

- Added `skin_profiles` Supabase migration with RLS, account-scoped read/insert/update policies, profile summary JSON, regeneration flag, versioning, and timestamps.
- Added validated `PUT /api/profile/skin-profile` boundary that stores authenticated profile updates and returns `auth-required` for anonymous users.
- Extended onboarding summary edits so users can update supported profile inputs, preserve answers, and see when the routine should be regenerated after profile changes.
- Kept routine generation, product matching, saved routine views, analytics, photos, and final safety-warning flows out of Story 2.6 scope.

### File List

- `_bmad-output/implementation-artifacts/2-6-allow-profile-input-updates-after-first-routine.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/app/api/profile/skin-profile/route.ts`
- `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`
- `routinelle/src/lib/supabase/skin-profile.ts`
- `routinelle/src/lib/validation/onboarding-schema.ts`
- `routinelle/supabase/migrations/0003_skin_profiles.sql`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 2.6 profile update flow.

### Review Findings

- [x] [Review][Patch] API parser initially required hidden multi-answer fields even when schema visibility made them optional. Fixed by normalizing omitted multi-answer fields before running `validateOnboardingAnswers`.
