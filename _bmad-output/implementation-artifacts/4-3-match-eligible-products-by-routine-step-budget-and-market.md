# Story 4.3: Match Eligible Products by Routine Step, Budget, and Market

Status: done

## Story

As a user, I want product options that match my routine step, budget, and local market, so that the recommendation is actionable.

## Acceptance Criteria

1. Product matching selects up to 2-3 suitable options per step.
2. Product options respect routine step, skin profile, budget band, and local availability.
3. Unavailable or recommendation-ineligible products are excluded.
4. Commercial metadata does not influence ranking.
5. Product matching has fixture coverage.

## Tasks / Subtasks

- [x] Add deterministic product matching helper.
- [x] Use Epic 3 eligibility rules before products can match.
- [x] Rank by price and product name only, not commercial metadata.
- [x] Add fixture coverage through generated routine fixtures.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Added market, budget, routine-step, skin-fit, and eligibility filtering.
- Product options include source product IDs and update timestamps for auditability.

### File List

- `routinelle/src/lib/recommendation/product-matching.ts`
- `routinelle/src/lib/recommendation/routine-generator.ts`
- `routinelle/src/tests/recommendation/routine-generator.test.ts`

### Change Log

- 2026-05-19: Completed Story 4.3 product matching.

### Review Findings

- Clean review - no unresolved findings.
