# Story 2.2: Capture Acne, Sensitivity, Irritation, and Barrier Risk Signals

Status: done

## Story

As a user with acne-prone or sensitive skin,
I want to report irritation and barrier-risk signals safely,
so that Routinelle can avoid overly aggressive recommendations.

## Acceptance Criteria

1. Given a user reaches skin concern and sensitivity questions, when they select acne, oiliness, irritation, redness, burning, or barrier-damaged signals, then the profile stores these as cosmetic guidance signals.
2. The UI explains that Routinelle does not diagnose medical conditions.
3. Serious symptom options are clearly worded and readable.
4. Captured acne, sensitivity, irritation, barrier-risk, and serious-symptom signals are available to later recommendation and safety logic.
5. The onboarding flow remains public, mobile-first, local-state only, and does not require signup, Supabase env vars, or photo upload.

## Tasks / Subtasks

- [x] Extend onboarding domain model for guidance signals. (AC: 1, 3, 4)
  - [x] Update `routinelle/src/lib/domain/skin-profile.ts` with typed `camelCase` signal unions.
  - [x] Add structured fields to `OnboardingAnswers` for cosmetic guidance signals and serious-symptom signals.
  - [x] Keep acne/oiliness, irritation/redness/burning, barrier-risk, and serious-symptom values separate enough for later recommendation/safety logic.
  - [x] Do not store open-ended medical free text.

- [x] Extend question definitions for Story 2.2. (AC: 1, 2, 3, 5)
  - [x] Update `routinelle/src/lib/domain/onboarding.ts` with 2-3 short additional screens or equivalent conditional screens.
  - [x] Keep one major question per screen and stay near the MVP target of 7-8 onboarding questions.
  - [x] Use multi-select chips for acne/oiliness and irritation/barrier-risk signals.
  - [x] Include `none` and/or `notSure` options where appropriate.
  - [x] Include calm non-diagnostic helper copy: Routinelle uses these answers for cosmetic routine caution, not diagnosis.
  - [x] Avoid disease/treatment/cure/prevention claims.

- [x] Update validation for the expanded local flow. (AC: 1, 3, 4)
  - [x] Update `routinelle/src/lib/validation/onboarding-schema.ts` to validate the new required Story 2.2 screens.
  - [x] Preserve typed validation results and user-safe messages.
  - [x] Do not block users for uncertainty when `notSure`, `none`, or equivalent safe options are selected.
  - [x] Keep validation independent of Supabase and recommendation generation.

- [x] Update the onboarding UI behavior. (AC: 1-5)
  - [x] Update `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`.
  - [x] Preserve back/continue state retention across all old and new questions.
  - [x] Ensure multi-select behavior handles exclusive options such as `none` or `notSure`.
  - [x] Keep touch targets at least 44px high where practical and preserve visible focus states.
  - [x] Keep the custom radio group label fix from Story 2.1.
  - [x] Keep the final completion state visible after the last action.

- [x] Verify Story 2.2 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev`.
  - [x] Confirm `/onboarding` renders without Supabase env vars.
  - [x] Confirm old Story 2.1 answers still work with Back/Continue.
  - [x] Confirm newly captured signals are present in the local `OnboardingAnswers` structure.
  - [x] Confirm source copy avoids diagnosis/treatment/cure/prevention claims except the required boundary statement that Routinelle does not diagnose medical conditions.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] If browser/axe automation is unavailable, document that viewport/accessibility automation was not run.

### Review Findings

- [x] [Review][Patch] Generic validation copy tells users to select "not sure" on screens where no "not sure" option exists [routinelle/src/lib/validation/onboarding-schema.ts:38]

## Dev Notes

### Scope Boundaries

- Story 2.2 extends the questionnaire/profile signal capture only.
- Do not build recommendation generation, product matching, catalog lookup, routine persistence, account saving, analytics, photo upload, or a full safety escalation panel.
- Do not implement current routine entry; that belongs to Story 2.4.
- Do not implement skin profile summary; that belongs to Story 2.5.
- Do not call Supabase from onboarding UI. `/onboarding` must continue to work without configured Supabase env vars.
- The first routine remains free and accessible before account commitment.

### Required Signal Shape

Use typed, structured values that future recommendation and safety logic can consume. Exact names may be adjusted to fit existing code style, but keep `camelCase` and keep the concepts separate.

Recommended additions in `skin-profile.ts`:

- `AcneOilinessSignal`
  - `frequentBlemishes`
  - `cloggedPores`
  - `excessShine`
  - `postBlemishMarks`
  - `none`
  - `notSure`
- `IrritationBarrierSignal`
  - `redness`
  - `stingingOrBurning`
  - `tightOrDry`
  - `flakingOrRough`
  - `recentStrongActives`
  - `none`
  - `notSure`
- `SeriousSymptomSignal`
  - `swelling`
  - `painfulOrSpreading`
  - `nearEyesOrLips`
  - `persistentOrWorsening`
  - `none`

Recommended `OnboardingAnswers` additions:

- `acneOilinessSignals: AcneOilinessSignal[]`
- `irritationBarrierSignals: IrritationBarrierSignal[]`
- `seriousSymptomSignals: SeriousSymptomSignal[]`

Keep `none` and `notSure` mutually exclusive with other options in each multi-select question. For `seriousSymptomSignals`, `none` should be the safe default option but still require explicit selection if that screen is shown.

### Suggested Question Set Extension

Story 2.1 currently has 5 screens:

1. Skin type.
2. Concerns.
3. Sensitivity tendency.
4. Budget.
5. Local market.

Story 2.2 should add 2-3 screens so the MVP stays near the UX target of 7-8 short questions:

6. Acne and oiliness details: "Which acne or oiliness patterns should Routinelle consider?"
   - Chips: frequent blemishes, clogged pores, excess shine, marks after blemishes, none, not sure.
7. Irritation and barrier comfort: "Which comfort signals happen with your skin?"
   - Chips: redness, stinging or burning, tight or dry feeling, flaking or rough texture, recent strong actives felt too much, none, not sure.
8. Serious symptoms boundary: "Any signs that need extra caution?"
   - Cards or chips: swelling, painful or spreading discomfort, around eyes or lips, getting worse or not settling, none of these.

Helper copy should stay calm and non-diagnostic. Example: "Routinelle uses this only to keep cosmetic routine guidance cautious. It does not diagnose medical conditions."

### Product And UX Requirements

- Epic 2 objective: users complete a short, mobile-first questionnaire that captures skin type, concerns, sensitivity, budget, market, and optional current routine information without feeling medically diagnosed.
- PRD requires users to indicate acne-prone, sensitive, irritated, or barrier-damaged skin as part of onboarding.
- UX requires 7-8 short questions, one decision per screen, visible progress, `not sure` options, and simple mobile controls.
- Serious symptom wording must be plain, readable, calm, and non-diagnostic.
- Do not ask for photos in MVP onboarding.

### Architecture Requirements

- Use Next.js App Router and React local component state for questionnaire flow.
- Page path remains `routinelle/src/app/(consumer)/onboarding/page.tsx`.
- Component path remains `routinelle/src/components/routinelle/onboarding/`.
- Domain path remains `routinelle/src/lib/domain/`.
- Validation path remains `routinelle/src/lib/validation/onboarding-schema.ts`.
- Use string literal unions for domain states.
- Keep business logic out of React components where practical; place reusable signal selection helpers in domain/validation if complexity grows.
- UI components must not call Supabase directly.
- Use existing Tailwind/shadcn primitives and existing Routinelle palette.

### Existing Code To Preserve

- `OnboardingFlow` already provides local state, progress, Back/Continue, completion feedback, and accessible custom radio group labelling.
- `toggleMulti` currently assumes only `concerns` is multi-select. Story 2.2 will likely need a generic multi-select helper keyed by the current question id.
- `isSelected` already supports array answers, but type narrowing may need to be strengthened as more array fields are added.
- `getAnswerCount` already counts any array answer with length > 0.
- Validation currently checks only answer presence. Extend it carefully so `none` and `notSure` count as valid answers.

### Previous Story Intelligence

- Story 2.1 review found and fixed two issues: final action needed visible feedback, and custom radio groups needed programmatic labels. Preserve both.
- Story 2.1 verification passed `npm run lint` and `npm run build`.
- The repo has no browser/axe automation configured; document this limitation if it remains true.
- Public and onboarding routes must continue to work without Supabase env vars.
- Source scans should allow the required phrase "does not diagnose medical conditions" but should still reject treatment/cure/prevention/disease-identification wording elsewhere.

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`
  - `/onboarding` returns `200` without Supabase env vars
  - source scan for unsafe diagnosis/treatment/cure/prevention claims in onboarding copy, allowing only the required non-diagnosis boundary statement
  - service-role/secret scan
- No unit test framework is currently configured. If the implementation adds non-trivial signal derivation helpers, consider adding focused tests only if a test runner already exists or is introduced intentionally.

### Implementation Anti-Patterns To Avoid

- Do not turn this into a medical intake form.
- Do not ask users to describe symptoms in open-ended text.
- Do not use disease names as selectable answers.
- Do not display a routine, product advice, or safety escalation decision in this story.
- Do not add photo, camera, precise location, auth, persistence, or analytics requirements.
- Do not remove Story 2.1 functionality while adding the new screens.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.2]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR2, FR3, FR21, FR24, FR25, FR27, FR28; NFR11, NFR16, NFR19-NFR23]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Questionnaire Interaction, Safety without fear, Skin Questionnaire Step, mobile/accessibility requirements]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture, Structure Patterns, Requirements to Structure Mapping, Enforcement Guidelines]
- [Source: `_bmad-output/implementation-artifacts/2-1-build-onboarding-questionnaire-flow.md` - previous story implementation and review learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 2.1 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/onboarding` as a static route.
- `npm run lint` passed after review patch.
- `npm run build` passed after review patch.
- `npm run dev` started successfully on port 3000.
- Runtime check: `HEAD /onboarding` returned `200` without Supabase env vars.
- Runtime check: `GET /onboarding` returned `200` and rendered an 8-question flow.
- Source scan for unsafe `treatment`, `cure`, `prevention`, `disease`, `camera`, `photo`, direct Supabase access, and query calls in onboarding files returned no matches.
- Source scan confirmed the required non-diagnosis boundary statement and the new local answer fields: `acneOilinessSignals`, `irritationBarrierSignals`, and `seriousSymptomSignals`.
- Service-role and client-exposed secret pattern scan returned no matches.
- Browser viewport and axe automation are not configured in this repository, so automated viewport/accessibility coverage was not run.

### Completion Notes List

- Added typed cosmetic guidance signal unions and structured local onboarding answer fields for acne/oiliness, irritation/barrier comfort, and serious-symptom caution signals.
- Extended the questionnaire from 5 to 8 one-screen questions with calm non-diagnostic helper copy and readable serious-symptom options.
- Generalized multi-select chip behavior so `concerns`, `acneOilinessSignals`, `irritationBarrierSignals`, and `seriousSymptomSignals` preserve state and support exclusive `none` or `notSure` options.
- Preserved Story 2.1 accessibility and completion-feedback fixes.
- Kept Story 2.2 scoped to local public questionnaire capture only: no Supabase, auth gate, persistence, analytics, photo capture, routine generation, catalog lookup, or safety escalation panel.
- Applied code review patch so validation messages match each question's available fallback options.

### File List

- `_bmad-output/implementation-artifacts/2-2-capture-acne-sensitivity-irritation-and-barrier-risk-signals.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/components/routinelle/onboarding/onboarding-flow.tsx`
- `routinelle/src/lib/domain/onboarding.ts`
- `routinelle/src/lib/domain/skin-profile.ts`

## Change Log

- 2026-05-19: Implemented Story 2.2 signal capture and moved story to review.
- 2026-05-19: Applied Story 2.2 code review patch.
