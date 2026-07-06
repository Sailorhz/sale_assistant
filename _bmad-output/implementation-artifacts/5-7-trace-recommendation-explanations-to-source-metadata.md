# Story 5.7: Trace Recommendation Explanations to Source Metadata

Status: done

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Explanation trace references include product IDs, approved copy keys, rule IDs, source labels, and catalog/rule version IDs.
- Trace refs are internal-audience data and are not shown by default in the consumer UI.

### File List

- `routinelle/src/lib/domain/explanation.ts`
- `routinelle/src/lib/explanations/rationale-builder.ts`

### Change Log

- 2026-05-19: Completed Story 5.7.
