# Story 5.6: Add Recommendation Neutrality and Commercial Firewall Messaging

Status: done

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Added neutrality statement explaining that ranking is based on profile fit, routine role, ingredient facts, budget, and availability.
- Product links are marked external and remain separate from ranking logic.
- Product matching does not use commercial metadata.

### File List

- `routinelle/src/lib/explanations/rationale-builder.ts`
- `routinelle/src/lib/recommendation/product-matching.ts`
- `routinelle/src/components/routinelle/routine/routine-view.tsx`

### Change Log

- 2026-05-19: Completed Story 5.6.
