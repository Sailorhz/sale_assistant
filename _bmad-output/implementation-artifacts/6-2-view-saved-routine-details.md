# Story 6.2: View Saved Routine Details

Status: done

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Added saved routine detail page under `/routines/[routineId]`.
- Page renders AM/PM steps, product options, cautions, explanations, and regeneration reminder.
- Access uses user-owned Supabase RLS.

### File List

- `routinelle/src/app/(consumer)/routines/[routineId]/page.tsx`
- `routinelle/src/components/routinelle/routine/routine-view.tsx`
- `routinelle/src/lib/supabase/generated-routines.ts`

### Change Log

- 2026-05-19: Completed Story 6.2.
