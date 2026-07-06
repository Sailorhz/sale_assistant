# Story 4.1: Define Display-Ready Routine Contract and Persistence Foundation

Status: done

## Story

As an internal product operator, I want generated routines to have a structured display-ready contract and persistence foundation, so that every routine can be rendered, tested, audited, and safely reused by later recommendation stories.

## Acceptance Criteria

1. Typed routine, section, step, product option, and recommendation state models are defined.
2. Contract supports AM/PM sections, step role, time of use, frequency, product options, no-safe-match, safety-blocked, caution, and explanation references.
3. Generated routine persistence stores catalog version ID and rule version ID references.
4. Database fields use `snake_case` and TypeScript models use `camelCase`.
5. Schema changes are implemented through Supabase migrations.
6. Fixture/contract coverage verifies serializable display-ready routines returned through the standard API result wrapper.

## Tasks / Subtasks

- [x] Add display-ready routine domain contract.
- [x] Add sample routine contract and API result wrapper helper.
- [x] Add generated routine persistence migration with catalog/rule version references.
- [x] Add routine UI component that renders the display-ready contract.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- `/api/routines/generate` emitted as a dynamic route.
- Guardrail scan found only intentional blocked-term regex entries in `claim-guardrails.ts`.

### Completion Notes List

- Added `GeneratedRoutine`, `RoutineSection`, `RoutineStep`, `RoutineProductOption`, conflict, safety, and version-context types.
- Added `generated_routines` migration with `snake_case` fields and catalog/rule version foreign keys.
- Added fixture-ready routine contract and display component.

### File List

- `routinelle/src/lib/domain/routine.ts`
- `routinelle/src/lib/recommendation/routine-contract.ts`
- `routinelle/supabase/migrations/0009_generated_routines.sql`
- `routinelle/src/components/routinelle/routine/routine-view.tsx`
- `routinelle/src/tests/recommendation/routine-generator.test.ts`

### Change Log

- 2026-05-19: Completed Story 4.1 routine contract and persistence foundation.

### Review Findings

- Clean review - no unresolved findings.
