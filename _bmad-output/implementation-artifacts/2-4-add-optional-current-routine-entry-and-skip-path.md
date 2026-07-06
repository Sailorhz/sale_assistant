# Story 2.4: Add Optional Current Routine Entry and Skip Path

Status: done

## Story

As a user,
I want to optionally enter my current routine or skip it,
so that I can either get conflict detection or move quickly to my first routine.

## Acceptance Criteria

1. Given the user reaches current routine entry, when they choose to add current routine information, then the app captures structured current product/routine details for conflict detection.
2. Current routine entry avoids open-ended medical free text as the primary path.
3. When the user chooses to skip, onboarding continues without penalty.
4. Later recommendation flow can still produce a starter routine after skip.
5. The flow remains public, mobile-first, local-state only, and does not require signup, Supabase env vars, persistence, analytics, photo upload, or routine generation.

## Tasks / Subtasks

- [x] Add structured current routine domain fields. (AC: 1, 2, 4)
  - [x] Update `routinelle/src/lib/domain/skin-profile.ts` with typed current routine choice and product type values.
  - [x] Add `currentRoutineChoice` and `currentRoutineProductTypes` to `OnboardingAnswers`.
  - [x] Keep values structured and `camelCase`.
  - [x] Do not add open-ended product names, medical free text, or ingredient analysis in this story.

- [x] Add optional current routine question definitions. (AC: 1, 2, 3, 4)
  - [x] Update `routinelle/src/lib/domain/onboarding.ts`.
  - [x] Add a single-choice screen asking whether the user wants to add current routine basics or skip.
  - [x] Add a structured multi-select product type screen that appears only when the user chooses to add basics.
  - [x] Use product type chips such as cleanser, moisturizer, sunscreen, exfoliant, retinoid, blemish active, vitamin C/brightening, and other cosmetic product.
  - [x] Keep skip copy non-judgmental and clear that a starter routine can still be created later.

- [x] Update validation and conditional flow behavior. (AC: 1, 3, 4)
  - [x] Update `routinelle/src/lib/validation/onboarding-schema.ts` so current routine product types are required only when the user chooses to add current routine basics.
  - [x] Ensure choosing skip is valid and does not block onboarding.
  - [x] Ensure stale selected product types are cleared if the user changes from add basics to skip.
  - [x] Preserve `notSure`, `none`, and confidence behavior from Story 2.3.

- [x] Update onboarding UI for conditional current routine entry. (AC: 1-5)
  - [x] Update `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`.
  - [x] Build visible question list from answers so the product type screen appears only when needed.
  - [x] Preserve Back/Continue state retention and completion feedback.
  - [x] Preserve accessible labels, focus states, and 44px touch targets.
  - [x] Do not add product recommendations, conflict warnings, or a skin profile summary in this story.

- [x] Verify Story 2.4 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/onboarding` renders without Supabase env vars.
  - [x] Confirm skip path reaches completion without product type selection.
  - [x] Confirm add-basics path requires at least one structured current product type.
  - [x] Confirm changing from add-basics to skip clears selected current product types.
  - [x] Confirm source copy avoids unsafe medical claim language.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] If browser/axe automation is unavailable, document that viewport/accessibility automation was not run.

### Review Findings

Clean review - no patch findings.

## Dev Notes

### Scope Boundaries

- Story 2.4 captures optional structured current routine context only.
- Do not build conflict detection logic; later recommendation/conflict stories own that.
- Do not implement skin profile summary; that belongs to Story 2.5.
- Do not build recommendation generation, product matching, catalog lookup, routine persistence, account saving, analytics, photo upload, or safety escalation.
- Do not call Supabase from onboarding UI. `/onboarding` must continue to work without configured Supabase env vars.

### Product And UX Requirements

- Current routine entry must be optional and skippable without penalty.
- Entry should be structured search/selection style, not open free text as the primary MVP path.
- Copy should avoid implying the user's existing routine is wrong.
- Keep the interaction lightweight and mobile-first.
- The app should be able to later use this information for duplicate active, over-exfoliation, and routine conflict checks.

### Suggested Technical Shape

- Add `CurrentRoutineChoice = "addBasics" | "skip" | "notSure"`.
- Add `CurrentRoutineProductType` union:
  - `cleanser`
  - `moisturizer`
  - `sunscreen`
  - `exfoliant`
  - `retinoid`
  - `blemishActive`
  - `vitaminCBrightening`
  - `other`
- Add `currentRoutineChoice: CurrentRoutineChoice | null`.
- Add `currentRoutineProductTypes: CurrentRoutineProductType[]`.
- Add `showWhen?: (answers: OnboardingAnswers) => boolean` to `OnboardingQuestion` or equivalent filtering helper.
- `currentRoutineProductTypes` should show only when `currentRoutineChoice === "addBasics"`.
- Choosing `skip` or `notSure` should clear `currentRoutineProductTypes`.

### Previous Story Intelligence

- Story 2.3 added option-level confidence metadata and `onboarding-confidence.ts`.
- Story 2.3 split local market `other` from `notSure`; preserve that distinction.
- Story 2.2 added generic multi-select behavior for multiple answer arrays; extend it rather than reintroducing concern-specific logic.
- Story 2.1/2.2/2.3 public/no-env behavior must remain intact.
- The repo has no unit test framework or browser/axe automation configured; document this limitation if it remains true.

### Architecture Requirements

- Use Next.js App Router and React local component state for questionnaire flow.
- Keep reusable domain logic in `lib/domain/`.
- Keep validation in `lib/validation/onboarding-schema.ts`.
- Keep UI under `components/routinelle/onboarding/`.
- Use string literal unions for domain states.
- UI components must not call Supabase directly.
- Use existing Tailwind/shadcn primitives and Routinelle palette.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `/onboarding` returns `200` without Supabase env vars
  - local source scan for unsafe medical claim language
  - service-role/secret scan
- If no test runner exists, validate conditional behavior through source review, TypeScript build, and runtime route check.

### Implementation Anti-Patterns To Avoid

- Do not add open-ended product or symptom text fields.
- Do not ask for brand/product names in this story.
- Do not build conflict explanations or warnings in this story.
- Do not block onboarding when the user skips current routine entry.
- Do not make current routine entry feel required for a starter routine.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.4]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR4, FR5, conflict-detection scope and optional structured routine entry]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - optional current routine entry, skip path, non-judgmental copy]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - domain/validation/component organization]
- [Source: `_bmad-output/implementation-artifacts/2-3-support-not-sure-and-low-confidence-answers.md` - previous story implementation and review learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 2.3 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/onboarding` as a static route.
- `npm run dev` started successfully on port 3000.
- Runtime check: `HEAD /onboarding` returned `200` without Supabase env vars.
- Runtime check: `GET /onboarding` returned `200`; initial skip-capable path rendered 9 visible questions.
- Source check confirmed `currentRoutineProductTypes` is conditionally visible only when `currentRoutineChoice === "addBasics"`.
- Source check confirmed choosing `skip` or `notSure` clears stale `currentRoutineProductTypes`.
- Source check confirmed hidden conditional questions are skipped by validation.
- Source scan for unsafe `treatment`, `cure`, `prevention`, `disease`, `camera`, `photo`, direct Supabase access, and query calls in onboarding files returned no matches.
- Service-role and client-exposed secret pattern scan returned no matches.
- Browser viewport and axe automation are not configured in this repository, so automated viewport/accessibility coverage was not run.

### Completion Notes List

- Added typed current routine fields to the onboarding answer model.
- Added optional current routine choice screen with add-basics, skip, and not-sure paths.
- Added structured product type chips behind a conditional add-basics path.
- Updated validation to ignore hidden conditional questions and require product types only on the add-basics path.
- Updated onboarding progress and answered count to reflect the currently visible question list.
- Preserved local-only public onboarding behavior with no Supabase, auth gate, persistence, analytics, photo capture, routine generation, catalog lookup, conflict warnings, or profile summary.

### File List

- `_bmad-output/implementation-artifacts/2-4-add-optional-current-routine-entry-and-skip-path.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`
- `routinelle/src/lib/domain/onboarding.ts`
- `routinelle/src/lib/domain/skin-profile.ts`
- `routinelle/src/lib/validation/onboarding-schema.ts`

## Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 2.4 optional current routine entry.
