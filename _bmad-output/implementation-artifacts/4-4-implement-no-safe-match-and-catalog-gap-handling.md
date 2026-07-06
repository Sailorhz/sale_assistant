# Story 4.4: Implement No-Safe-Match and Catalog Gap Handling

Status: done

## Story

As a user, I want a clear no-safe-match result when Routinelle cannot confidently recommend a product, so that I am not pushed toward an unsafe or unsuitable option.

## Acceptance Criteria

1. Missing eligible products produce no-safe-match state instead of forced products.
2. API treats no-safe-match as expected recommendation state, not system error.
3. No-safe-match includes a UI-usable reason code.
4. Fallback states preserve catalog/rule version context.
5. Behavior has fixture coverage.

## Tasks / Subtasks

- [x] Add no-safe-match state and reason codes to routine contract.
- [x] Generate no-safe-match steps when matching returns no products.
- [x] Preserve version context on fallback results.
- [x] Add fixture coverage through no-product routine fixture.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Routine generation now returns typed no-safe-match states with `no-eligible-product` reason.
- No-safe-match remains an API success path.

### File List

- `routinelle/src/lib/domain/routine.ts`
- `routinelle/src/lib/recommendation/routine-generator.ts`
- `routinelle/src/components/routinelle/routine/routine-view.tsx`
- `routinelle/src/tests/recommendation/routine-generator.test.ts`

### Change Log

- 2026-05-19: Completed Story 4.4 no-safe-match handling.

### Review Findings

- Clean review - no unresolved findings.
