# Story 2.5: Generate and Display Skin Profile Summary

Status: done

## Story

As a user,
I want to review what Routinelle understood about my skin,
so that I can trust or correct the profile before relying on recommendations.

## Acceptance Criteria

1. Given the user completes onboarding, when the profile summary is displayed, then it shows skin type, concerns, sensitivity level, budget, market, and routine risk flags.
2. The summary uses "based on your answers" language rather than absolute claims.
3. The summary includes edit actions for relevant profile inputs.
4. The summary remains readable on mobile screens.
5. The summary does not require account creation to view.

## Tasks / Subtasks

- [x] Add derived skin profile summary domain helper. (AC: 1, 2)
  - [x] Add `routinelle/src/lib/domain/skin-profile-summary.ts`.
  - [x] Derive display-ready summary sections from `OnboardingAnswers`.
  - [x] Include skin type, concerns, sensitivity level, budget, market, current routine context, uncertainty, and routine risk flags.
  - [x] Use confidence metadata from Story 2.3 for unknown/not-sure answers.
  - [x] Do not create recommendations, product matching, conflict detection output, or persistence.

- [x] Display summary after onboarding completion. (AC: 1, 2, 4, 5)
  - [x] Update `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`.
  - [x] Show summary only after the final valid onboarding action.
  - [x] Use "Based on your answers" language.
  - [x] Keep summary public and local-state only.
  - [x] Keep mobile-readable layout with clear sections and no nested cards.

- [x] Add edit actions for relevant inputs. (AC: 3)
  - [x] Add edit actions for skin type, concerns, sensitivity, budget, market, current routine, and key risk signal inputs.
  - [x] Edit actions should return to the relevant questionnaire screen without losing previous answers.
  - [x] Editing should reset completion state until the user reviews again.

- [x] Verify Story 2.5 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/onboarding` renders without Supabase env vars.
  - [x] Confirm completing onboarding can show the profile summary without account creation.
  - [x] Confirm edit actions return to relevant questions and preserve answers.
  - [x] Confirm source copy avoids unsafe medical claim language.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] If browser/axe automation is unavailable, document that viewport/accessibility automation was not run.

## Dev Notes

### Scope Boundaries

- Story 2.5 displays a local skin profile summary only.
- Do not build routine generation, product matching, catalog lookup, conflict warnings, routine persistence, account saving, analytics, photo upload, or safety escalation.
- Do not call Supabase from onboarding UI. `/onboarding` must continue to work without configured Supabase env vars.
- Do not require account creation before viewing the summary.

### Product And UX Requirements

- Summary should show what Routinelle understood, not make absolute claims.
- Use "Based on your answers" language.
- Include routine risk flags without implying diagnosis.
- Include edit actions so users can correct inputs before recommendations.
- Keep mobile layout readable and concise.

### Suggested Technical Shape

- Add `SkinProfileSummaryItem` and `RoutineRiskFlag` display models.
- Derive labels from `onboardingQuestions` option metadata instead of duplicating labels where practical.
- Use `getOnboardingQuestionConfidence` to label unknown values.
- Suggested risk flags:
  - sensitivity/gentle-start consideration when sensitivity is often/currently uncomfortable or irritation/barrier signals are present
  - blemish/oiliness support context when acne/oiliness signals are present
  - serious-symptom caution context when serious symptom signals other than `none` are selected
  - active-stacking context when current routine includes exfoliant, retinoid, blemish active, or vitamin C/brightening
  - no-current-routine context when current routine is skipped or unknown
- Risk flags are profile context for later logic, not final warnings or recommendations.

### Previous Story Intelligence

- Story 2.4 added conditional current routine entry and visible question filtering.
- Story 2.3 added confidence metadata and `onboarding-confidence.ts`.
- Preserve public/no-env behavior, accessible question labels, completion feedback, and local-only onboarding state.
- The repo has no unit test framework or browser/axe automation configured; document this limitation if it remains true.

### Architecture Requirements

- Use Next.js App Router and React local component state for questionnaire flow.
- Keep reusable summary derivation in `lib/domain/`.
- Keep UI under `components/routinelle/onboarding/`.
- Use existing Tailwind/shadcn primitives and Routinelle palette.
- UI components must not call Supabase directly.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `/onboarding` returns `200` without Supabase env vars
  - local source scan for unsafe medical claim language
  - service-role/secret scan
- If no browser/axe tooling exists, document that limitation rather than implying automated viewport/accessibility coverage.

### Implementation Anti-Patterns To Avoid

- Do not display AM/PM routine or products.
- Do not output conflict explanations or final safety warnings.
- Do not phrase summary as a diagnosis or certain classification.
- Do not add account, database, analytics, or photo requirements.
- Do not make the summary a large form-heavy page.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.5]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR6]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Skin Profile Summary component]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - domain/component organization]
- [Source: `_bmad-output/implementation-artifacts/2-4-add-optional-current-routine-entry-and-skip-path.md` - previous story implementation and learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 2.4 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/onboarding` as a static route.
- `npm run dev` started with `next dev --webpack`.
- `HEAD /onboarding` returned `200` without Supabase env vars.
- `GET /onboarding` returned `200`; the initial skip-capable onboarding path rendered.
- Source scan for unsafe medical claim language, photo/camera scope, and direct Supabase calls returned no matches in the onboarding path.
- Service-role/client-exposed secret pattern scan returned no matches.
- Review patch added a default "no extra routine flags" summary state and displays current product types when current routine basics are provided.
- Browser/axe automation is not configured in the repository, so automated viewport/accessibility checks were not run.

### Completion Notes List

- Added a local domain helper that derives display-ready skin profile summary rows and routine risk flags from `OnboardingAnswers`.
- Added the completed-onboarding profile summary view with "Based on your answers" language and unknown-answer confidence labeling.
- Added edit actions that return users to the relevant questionnaire step while preserving previous answers and resetting completion state.
- Kept the summary public, local-state only, and free of account, Supabase, analytics, photo, product matching, or routine generation requirements.

### File List

- `_bmad-output/implementation-artifacts/2-5-generate-and-display-skin-profile-summary.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`
- `routinelle/src/lib/domain/skin-profile-summary.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 2.5 skin profile summary.

### Review Findings

- [x] [Review][Patch] Summary risk flags could be empty and current product types were not displayed when current routine basics were added. Fixed by adding a default routine flag and including current product types in the summary when applicable.
