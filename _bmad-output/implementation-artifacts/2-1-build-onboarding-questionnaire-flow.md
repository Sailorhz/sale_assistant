# Story 2.1: Build Onboarding Questionnaire Flow

Status: done

## Story

As a skincare shopper,
I want to answer a short guided questionnaire,
so that Routinelle can understand my skin profile without a long medical-style form.

## Acceptance Criteria

1. Given a user starts onboarding, when the questionnaire loads, then it presents one major question per screen with visible progress.
2. The flow captures skin type, main concerns, sensitivity, budget, and local market.
3. Questions use mobile-friendly single-choice cards and multi-select chips.
4. Users can navigate back and continue without losing entered answers.
5. The flow avoids medical diagnosis language.

## Tasks / Subtasks

- [x] Add onboarding domain model and question definitions. (AC: 1, 2, 5)
  - [x] Add `src/lib/domain/skin-profile.ts` with typed onboarding answer values using `camelCase`.
  - [x] Add `src/lib/domain/onboarding.ts` or equivalent for question definitions and option metadata.
  - [x] Include questions for skin type, main concerns, sensitivity, budget, and local market.
  - [x] Keep answers structured; do not use open-ended medical free text as the primary path.
  - [x] Include "not sure" where users may not know, in alignment with Epic 2 requirements.

- [x] Add onboarding validation foundation. (AC: 2, 4, 5)
  - [x] Add `src/lib/validation/onboarding-schema.ts` with local validation helpers.
  - [x] Validate only the minimum required answers for Story 2.1.
  - [x] Return typed validation results that the UI can display without stack traces.
  - [x] Avoid diagnosis or treatment language in validation messages.

- [x] Build mobile-first onboarding UI components. (AC: 1, 3, 4, 5)
  - [x] Add components under `src/components/routinelle/onboarding/`.
  - [x] Implement one-question-per-screen layout with visible progress.
  - [x] Implement keyboard-selectable single-choice cards.
  - [x] Implement keyboard-selectable multi-select chips.
  - [x] Implement Back and Continue actions that preserve local answer state.
  - [x] Use shared UI primitives from Epic 1; do not create a second design system.
  - [x] Keep touch targets aligned with the Story 1.6 accessibility baseline.

- [x] Add onboarding route and public entry path. (AC: 1, 4, 5)
  - [x] Add `src/app/(consumer)/onboarding/page.tsx`.
  - [x] Update public shell "Start my routine" entry point to route to `/onboarding`.
  - [x] Preserve public sample preview access before account creation.
  - [x] Do not require signup, login, Supabase env vars, or account consent to start onboarding.
  - [x] Do not submit to recommendation generation yet; Story 2.1 owns questionnaire flow only.

- [x] Verify onboarding behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/` still renders publicly.
  - [x] Confirm `/onboarding` renders without Supabase env vars.
  - [x] Confirm `/account` no-env setup still renders.
  - [x] Confirm source contains no medical diagnosis/treatment claims in onboarding copy.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] If browser/axe automation is unavailable, document that viewport/accessibility automation was not run.

### Review Findings

- [x] [Review][Patch] Final "Review answers" action validates but produces no visible state change [routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx:102]
- [x] [Review][Patch] Custom radio group is not programmatically labelled by the visible question text [routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx:176]

## Dev Notes

### Scope Boundaries

- This story builds the questionnaire flow only.
- Do not build routine generation, product matching, catalog lookup, routine persistence, account saving, analytics, current routine entry, skin profile summary, or safety escalation logic in this story.
- Serious symptom and barrier-risk details are expanded in Story 2.2.
- Current routine entry and skip path are expanded in Story 2.4.
- Skin profile summary is expanded in Story 2.5.
- The first routine remains free and accessible before account commitment.

### Product And UX Requirements

- Epic 2 objective: users complete a short, mobile-first questionnaire that captures skin type, concerns, sensitivity, budget, market, and optional current routine information without feeling medically diagnosed.
- Story 2.1 requires one major question per screen, visible progress, mobile-friendly single-choice cards and multi-select chips, back/continue navigation, and non-medical language.
- UX guidance says onboarding should feel short, relevant, respectful, and not like medical intake.
- Questionnaire design should use:
  - single-choice cards for skin type and budget
  - multi-select chips for concerns and preferences
  - visible progress
  - back/continue actions
  - concise helper text
  - "not sure" where appropriate
- Do not ask for photos in MVP onboarding.

### Suggested MVP Question Set For Story 2.1

Keep this first pass focused and extensible:

1. Skin type: oily, oily-combination, balanced/medium, dry-combination, dry, not sure.
2. Main concerns: hydration, acne or blemishes, pores/oiliness, dark spots/uneven tone, early aging support, irritation/redness, not sure.
3. Sensitivity tendency: rarely sensitive, sometimes sensitive, often sensitive, currently uncomfortable/irritated, not sure.
4. Budget: low, moderate, flexible, not sure.
5. Local market: France, other EU, UK, US, other/not sure.

Do not over-model medical symptoms in Story 2.1; leave deeper acne/irritation/barrier-risk branching to Story 2.2.

### Architecture Requirements

- Use Next.js App Router and React local component state for questionnaire flow.
- Page path: `src/app/(consumer)/onboarding/page.tsx`.
- Component path: `src/components/routinelle/onboarding/`.
- Domain path: `src/lib/domain/`.
- Validation path: `src/lib/validation/onboarding-schema.ts`.
- Keep raw Supabase access out of onboarding UI. This story should not need Supabase.
- Keep public route unauthenticated and independent of Supabase env vars.
- Use the existing Routinelle palette and shared UI primitives.

### Current Repository State

- Public shell entry point currently links "Start my routine" to `#sample-preview`; this story should route it to `/onboarding`.
- `PublicShell` already provides `main-content`, skip link support, and mobile-first layout.
- Shared primitives already have Story 1.6 accessibility improvements:
  - Button `min-h-11`
  - Input `min-h-11`
  - Checkbox `h-11 w-11`
  - visible focus rings
- No browser/axe test framework is configured.
- No real Supabase env vars are configured locally.

### Previous Epic Learnings

- Preserve public value before signup; onboarding must not require account creation.
- Preserve controlled no-env behavior; public/onboarding paths must work without Supabase env vars.
- Use typed domain/validation helpers before UI state grows.
- Keep user-specific API responses uncached when account APIs are later introduced.
- Future profile/routine storage must honor privacy consent and deletion request state.
- Code review should pay attention to mobile overflow, keyboard interaction, validation clarity, and accidental medical claims.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `/` public page still returns `200`
  - `/onboarding` returns `200` without Supabase env vars
  - `/account` no-env fallback still returns `200`
  - source scan for medical diagnosis/treatment wording in onboarding files
  - service-role/secret scan
- If no browser/axe tooling exists, document that limitation rather than implying automated viewport/accessibility coverage.

### Implementation Anti-Patterns To Avoid

- Do not use a long one-page form.
- Do not use medical diagnostic wording such as "diagnose", "condition", "disease", or "treatment" in user-facing questionnaire copy.
- Do not ask for photos or camera permission.
- Do not require account login before questionnaire start.
- Do not call Supabase directly from onboarding UI.
- Do not create recommendation/routine output in this story.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2 and Story 2.1]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR2, FR3, NFR1, NFR3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture and Requirements to Structure Mapping]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Questionnaire Interaction and Skin Questionnaire Step]
- [Source: `_bmad-output/implementation-artifacts/epic-1-retro-2026-05-15.md` - Epic 1 lessons and Epic 2 preparation]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts, Epic 1 retrospective, and completed Epic 1 story notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` initially failed because the onboarding shell used a raw `<a href="/">`; fixed by switching to `next/link`.
- `npm run lint` passed.
- Source scan for medical/camera/photo/Supabase direct access in onboarding files returned no matches.
- Service-role and client-exposed secret pattern scan returned no matches.
- `npm run build` passed and emitted `/onboarding` as a static route.
- `npm run lint` passed after review patches.
- `npm run build` passed after review patches.
- `npm run dev` started successfully.
- Runtime check: `/` returned `200` and exposed the `/onboarding` entry point.
- Runtime check: `/onboarding` returned `200` without Supabase env vars.
- Runtime check: `/account` returned `200` with the controlled no-env fallback.
- Browser viewport and axe automation are not configured in this repository, so automated viewport/accessibility coverage was not run.

### Completion Notes List

- Added typed onboarding answer values and question definitions for skin type, concerns, sensitivity, budget, and local market.
- Added local validation helpers with typed results and non-medical validation copy.
- Added a mobile-first one-question onboarding flow with progress, keyboard-selectable radio cards, multi-select chips, Back/Continue state preservation, and max-three concern selection.
- Added the public `/onboarding` route and connected the public "Start my routine" CTA to it.
- Kept the story within questionnaire scope: no Supabase access, no persistence, no account gate, no routine generation, no catalog lookup, no analytics, and no photo capture.
- Applied code review patches for final completion feedback and accessible custom radio group labelling.

### File List

- `_bmad-output/implementation-artifacts/2-1-build-onboarding-questionnaire-flow.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/app/(consumer)/onboarding/page.tsx`
- `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`
- `routinelle/src/components/routinelle/public-shell.tsx`
- `routinelle/src/lib/domain/onboarding.ts`
- `routinelle/src/lib/domain/skin-profile.ts`
- `routinelle/src/lib/validation/onboarding-schema.ts`

## Change Log

- 2026-05-15: Implemented Story 2.1 onboarding questionnaire flow and moved story to review.
- 2026-05-19: Applied Story 2.1 code review patches and moved story to done.
