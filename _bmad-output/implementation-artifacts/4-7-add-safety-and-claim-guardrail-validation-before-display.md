# Story 4.7: Add Safety and Claim Guardrail Validation Before Display

Status: done

## Story

As a user, I want only safe, non-diagnostic routine guidance displayed, so that Routinelle protects me from unsafe or overclaimed recommendations.

## Acceptance Criteria

1. Safety layer blocks diagnosis, treatment, cure, prevention, or disease-identification wording.
2. Routines that fail safety validation are not displayed as normal recommendations.
3. Severe or high-risk symptom signals trigger professional-care guidance state.
4. Safety-blocked is returned as a typed state with approved reason copy.
5. Guardrails have focused fixture coverage.

## Tasks / Subtasks

- [x] Add claim guardrail patterns.
- [x] Add high-risk signal safety-blocked routine state.
- [x] Integrate guardrail validation before API return.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- Guardrail scan found only intentional blocked-term regex entries in `claim-guardrails.ts`.

### Completion Notes List

- Added pre-display safety guardrail layer.
- Serious symptom signals now return safety-blocked state with conservative professional-care guidance copy.

### File List

- `routinelle/src/lib/safety/claim-guardrails.ts`
- `routinelle/src/lib/recommendation/routine-generator.ts`

### Change Log

- 2026-05-19: Completed Story 4.7 safety and claim guardrails.

### Review Findings

- Clean review - no unresolved findings.
