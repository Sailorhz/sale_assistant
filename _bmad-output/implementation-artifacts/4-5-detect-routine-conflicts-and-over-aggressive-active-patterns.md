# Story 4.5: Detect Routine Conflicts and Over-Aggressive Active Patterns

Status: done

## Story

As a user with current routine information or sensitivity signals, I want Routinelle to detect routine conflicts, so that I avoid product combinations that may be too aggressive.

## Acceptance Criteria

1. Conflict checks flag duplicate actives, too many actives, and barrier-risk active patterns.
2. Conflict results can attach to routine steps.
3. Strong conflicts can trigger caution states.
4. Conflict checks are testable independently of UI.

## Tasks / Subtasks

- [x] Add conflict domain model.
- [x] Add independent conflict-check helper.
- [x] Attach step-level conflict refs and caution messages during generation.
- [x] Verify with `npm run lint` and `npm run build`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.

### Completion Notes List

- Added duplicate-active, too-many-actives, current-routine, and barrier-risk active pattern checks.
- Conflict logic is independent of UI components.

### File List

- `routinelle/src/lib/domain/routine.ts`
- `routinelle/src/lib/recommendation/conflict-checks.ts`
- `routinelle/src/lib/recommendation/routine-generator.ts`

### Change Log

- 2026-05-19: Completed Story 4.5 conflict checks.
- 2026-07-07: Removed the barrier-risk-active-pattern check. It required a `support`
  step to exist, but every profile condition that sets `barrierRisk` is a subset of
  `shouldUseGentleStart`'s trigger conditions (gentle-start.ts), and gentle-start always
  drops the support step. The check was therefore unreachable dead code — AC #1's
  "barrier-risk active patterns" clause was never actually deliverable through
  `generateStarterRoutine`. Gentle-start's own routine-level safety messaging covers the
  intended case instead. Added a regression test asserting gentle-start profiles never
  produce a support step, plus a dedicated conflict-checks.test.ts covering the two
  remaining checks (previously untested in isolation).

### Review Findings

- Clean review - no unresolved findings.
- 2026-07-07 follow-up review: found and removed the unreachable barrier-risk-active-pattern
  check (see Change Log). AC #1 now reads as fulfilled by duplicate-active and
  too-many-actives only; barrier-risk profiles are handled via the gentle-start variant.
