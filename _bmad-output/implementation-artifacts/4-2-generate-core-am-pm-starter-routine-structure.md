# Story 4.2: Generate Core AM/PM Starter Routine Structure

Status: done

## Story

As a user, I want Routinelle to generate a simple AM/PM starter routine, so that I know what to use and when.

## Acceptance Criteria

1. Validated skin profile input creates a complete AM/PM starter routine.
2. Steps include cleanser, moisturizer, sunscreen, and optional support step when appropriate.
3. Each step includes role, time of use, and frequency.
4. Routine is returned through the standard API result wrapper.
5. Generation follows the architecture pipeline order.

## Tasks / Subtasks

- [x] Add deterministic routine generator.
- [x] Add `/api/routines/generate` endpoint using onboarding schema validation.
- [x] Add fixture coverage for generated AM/PM structure.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- Routine generation API builds as `/api/routines/generate`.

### Completion Notes List

- Added AM/PM starter routine generation with cleanse, hydrate, protect, and optional support steps.
- API validates profile answers through the existing onboarding schema.

### File List

- `routinelle/src/lib/recommendation/routine-generator.ts`
- `routinelle/src/app/api/routines/generate/route.ts`
- `routinelle/src/tests/recommendation/routine-generator.test.ts`

### Change Log

- 2026-05-19: Completed Story 4.2 core AM/PM starter routine generation.

### Review Findings

- Clean review - no unresolved findings.
