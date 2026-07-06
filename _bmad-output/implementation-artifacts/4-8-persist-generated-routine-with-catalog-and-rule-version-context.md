# Story 4.8: Persist Generated Routine With Catalog and Rule Version Context

Status: done

## Story

As an internal operator, I want generated routines to preserve the catalog and rule versions used, so that recommendations are auditable and reproducible.

## Acceptance Criteria

1. Passing routines can be stored with catalog version ID and rule version ID.
2. Routine steps and product options reference source product attributes or eligibility state.
3. Same profile and same catalog/rule version can reproduce deterministic recommendation result.
4. Version context is preserved when later saved by a user.

## Tasks / Subtasks

- [x] Add generated routine persistence helper.
- [x] Persist routine payload and catalog/rule version IDs.
- [x] Preserve product option IDs and source update timestamps.
- [x] Keep generation deterministic for same profile/catalog/rules.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Added Supabase helper to persist generated routines with version context.
- Deterministic generator uses profile hash and stable product sorting.
- Product options preserve source product IDs and updated timestamps.

### File List

- `routinelle/src/lib/supabase/generated-routines.ts`
- `routinelle/supabase/migrations/0009_generated_routines.sql`
- `routinelle/src/lib/recommendation/routine-generator.ts`

### Change Log

- 2026-05-19: Completed Story 4.8 generated routine persistence with version context.

### Review Findings

- Clean review - no unresolved findings.
