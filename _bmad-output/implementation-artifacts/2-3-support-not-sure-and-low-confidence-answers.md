# Story 2.3: Support "Not Sure" and Low-Confidence Answers

Status: done

## Story

As a user who does not know my exact skin type or concern,
I want to choose "not sure" where appropriate,
so that I can finish onboarding without guessing.

## Acceptance Criteria

1. Given a questionnaire question may be difficult for users to answer, when the user is unsure, then they can select a "not sure" option where appropriate.
2. The app records the answer as low-confidence or unknown instead of forcing a false choice.
3. Later skin profile summary logic can clearly reflect uncertainty where relevant.
4. Validation does not block the user for optional uncertainty.
5. The onboarding flow remains public, mobile-first, local-state only, and does not require signup, Supabase env vars, persistence, analytics, photo upload, or routine generation.

## Tasks / Subtasks

- [x] Add confidence metadata to onboarding question options. (AC: 1, 2, 3)
  - [x] Update `routinelle/src/lib/domain/onboarding.ts` so selectable options can be marked as known or unknown confidence.
  - [x] Mark every `notSure` option as unknown confidence.
  - [x] Keep `none` as a known explicit answer, not an unknown answer.
  - [x] Preserve existing question order and the 8-question MVP flow.

- [x] Add reusable confidence derivation helpers. (AC: 2, 3, 4)
  - [x] Add `routinelle/src/lib/domain/onboarding-confidence.ts`.
  - [x] Derive per-question confidence from `OnboardingAnswers` and `onboardingQuestions`.
  - [x] Export a typed confidence map for later skin profile summary and recommendation logic.
  - [x] Treat unanswered required questions as `unanswered`, `notSure` selections as `unknown`, and normal/`none` selections as `answered`.
  - [x] Keep helper logic independent of React, Supabase, persistence, and recommendation generation.

- [x] Reflect uncertainty gently in the onboarding UI. (AC: 1, 2, 4, 5)
  - [x] Update `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`.
  - [x] Preserve Back/Continue state retention.
  - [x] Show a calm short message when the current answer is unknown.
  - [x] Do not add medical, diagnostic, treatment, cure, prevention, or disease-identification claims.
  - [x] Do not introduce additional screens for Story 2.3.

- [x] Verify Story 2.3 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/onboarding` renders without Supabase env vars.
  - [x] Confirm `notSure` answers are accepted by validation.
  - [x] Confirm confidence helpers classify `notSure` as `unknown`, `none` as `answered`, and empty answers as `unanswered`.
  - [x] Confirm source copy avoids unsafe medical claim language.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] If browser/axe automation is unavailable, document that viewport/accessibility automation was not run.

### Review Findings

- [x] [Review][Patch] Local market option conflated `other` and `not sure`, so uncertainty would be recorded as a confident other-market answer [routinelle/src/lib/domain/onboarding.ts:200]

## Dev Notes

### Scope Boundaries

- Story 2.3 formalizes uncertainty handling only.
- Do not add more onboarding questions.
- Do not implement current routine entry; that belongs to Story 2.4.
- Do not implement skin profile summary UI; that belongs to Story 2.5. This story must provide the typed helper that Story 2.5 can use.
- Do not build recommendation generation, product matching, catalog lookup, routine persistence, account saving, analytics, photo upload, or safety escalation.
- Do not call Supabase from onboarding UI. `/onboarding` must continue to work without configured Supabase env vars.

### Product And UX Requirements

- Users should not be forced to guess when they do not know their skin type, concern, sensitivity, or product details.
- `not sure` answers should reduce abandonment and cognitive pressure.
- `not sure` must be treated as uncertainty/unknown, not as a false confident skin profile signal.
- Validation must accept uncertainty where the UI offers it.
- Profile summary later must be able to display uncertainty clearly where relevant.

### Architecture Requirements

- Use TypeScript string literal unions for domain states.
- Keep confidence derivation in `lib/domain/`, not inside React components.
- Keep validation in `lib/validation/onboarding-schema.ts`.
- Keep UI under `components/routinelle/onboarding/`.
- Use existing Tailwind/shadcn primitives and Routinelle palette.
- UI components must not call Supabase directly.

### Existing Code To Preserve

- Story 2.2 expanded onboarding to 8 screens.
- `notSure` currently appears on skin type, concerns, sensitivity, acne/oiliness, irritation/barrier, and budget.
- `none` currently appears on acne/oiliness, irritation/barrier, and serious symptom caution screens and should remain a known explicit answer.
- `validateOnboardingQuestion` already accepts any selected option, including `notSure`.
- `toggleMulti` already keeps `none` and `notSure` mutually exclusive where configured.
- Preserve Story 2.1 and 2.2 accessibility fixes, completion feedback, public/no-env behavior, and non-diagnostic copy.

### Suggested Technical Shape

- Add `confidence?: "answered" | "unknown"` to `OnboardingOption`.
- Default missing confidence to `answered`.
- Add `OnboardingQuestionConfidence = "unanswered" | "answered" | "unknown"`.
- Add `OnboardingConfidenceMap = Record<OnboardingQuestionId, OnboardingQuestionConfidence>`.
- Add helpers:
  - `getOnboardingQuestionConfidence(answers, question)`
  - `getOnboardingConfidenceMap(answers)`
  - optionally `hasUnknownOnboardingAnswers(answers)`
- For array answers, return `unknown` only when the selected option metadata is unknown. Because exclusive selection clears other selections, a `notSure` array should be the only selected value when present.

### Previous Story Intelligence

- Story 2.2 code review found validation copy needed to match actual fallback options. Preserve the question-aware validation approach.
- Story 2.2 verification passed `npm run lint` and `npm run build` after review patch.
- The repo has no unit test framework or browser/axe automation configured; document this limitation if it remains true.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `/onboarding` returns `200` without Supabase env vars
  - local source scan for unsafe medical claim language
  - service-role/secret scan
- If no test runner exists, validate confidence helper behavior through TypeScript build and targeted source review, and document the limitation.

### Implementation Anti-Patterns To Avoid

- Do not treat `none` as unknown.
- Do not add duplicate low-confidence fields to local state if they can be derived safely from typed answer metadata.
- Do not add more screens or ask users to explain uncertainty in free text.
- Do not block progression when the user chooses `not sure`.
- Do not display a routine, product advice, or skin profile summary in this story.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.3]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - `not sure` answers reduce abandonment and cognitive pressure]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - domain/validation/component organization]
- [Source: `_bmad-output/implementation-artifacts/2-2-capture-acne-sensitivity-irritation-and-barrier-risk-signals.md` - previous story implementation and review learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 2.2 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/onboarding` as a static route.
- `npm run lint` passed after code review patch.
- `npm run build` passed after code review patch.
- `npm run dev` started successfully on port 3000.
- Runtime check: `HEAD /onboarding` returned `200` without Supabase env vars.
- Runtime check: `GET /onboarding` returned `200` and preserved the 8-question onboarding flow.
- Source scan for unsafe `treatment`, `cure`, `prevention`, `disease`, `camera`, `photo`, direct Supabase access, and query calls in onboarding/confidence files returned no matches.
- Service-role and client-exposed secret pattern scan returned no matches.
- Source check confirmed `notSure` options are marked `confidence: "unknown"`, `none` remains a normal answered option, and the confidence helper returns `unanswered`, `answered`, or `unknown`.
- Code review patch split local market `Other market` from `Not sure` and marked the new market `notSure` option as unknown.
- Source scans for unsafe copy and service-role/client-exposed secret patterns returned no matches after code review patch.
- Browser viewport and axe automation are not configured in this repository, so automated viewport/accessibility coverage was not run.

### Completion Notes List

- Added option-level confidence metadata and marked all `notSure` options as unknown.
- Split the local market fallback into a known `other` answer and an unknown `notSure` answer.
- Added `onboarding-confidence.ts` with reusable typed helpers for per-question confidence, full confidence maps, and unknown-answer detection.
- Added a calm onboarding message when the current selected answer is unknown, without adding screens or changing validation flow.
- Preserved public local-only onboarding behavior with no Supabase, auth gate, persistence, analytics, photo capture, routine generation, catalog lookup, or safety escalation.

### File List

- `_bmad-output/implementation-artifacts/2-3-support-not-sure-and-low-confidence-answers.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`
- `routinelle/src/lib/domain/onboarding.ts`
- `routinelle/src/lib/domain/onboarding-confidence.ts`
- `routinelle/src/lib/domain/skin-profile.ts`

## Change Log

- 2026-05-19: Created and implemented Story 2.3 confidence metadata and moved story to review.
- 2026-05-19: Applied Story 2.3 code review patch for local market uncertainty.
