# Story 4.6: Implement Gentle Start Recommendation Variant

Status: done

## Story

As a sensitive or barrier-risk user, I want Routinelle to recommend a conservative Gentle Start routine, so that I can protect my skin before adding stronger actives.

## Acceptance Criteria

1. Sensitive, irritated, acne/barrier-risk profiles can select Gentle Start.
2. Variant prioritizes cleanse, hydrate, protect, and barrier support.
3. Strong actives are limited or delayed.
4. Patch-test and slow-start guidance flags are available for display.
5. Gentle Start has fixture coverage.

## Tasks / Subtasks

- [x] Add Gentle Start selector.
- [x] Suppress optional support actives when Gentle Start is selected.
- [x] Add slow-start and patch-test safety messages.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Gentle Start now triggers from sensitivity, discomfort, irritation/barrier signals, and blemish plus redness combinations.
- The generated routine exposes `variant: "gentle-start"` and safety messages for UI display.

### File List

- `routinelle/src/lib/recommendation/gentle-start.ts`
- `routinelle/src/lib/recommendation/routine-generator.ts`

### Change Log

- 2026-05-19: Completed Story 4.6 Gentle Start variant.

### Review Findings

- Clean review - no unresolved findings.
