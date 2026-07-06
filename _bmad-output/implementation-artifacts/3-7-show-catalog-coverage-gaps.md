# Story 3.7: Show Catalog Coverage Gaps

Status: done

## Story

As a catalog manager,
I want to identify gaps by routine step, profile, budget band, and market,
so that catalog work can prioritize the products users need most.

## Acceptance Criteria

1. Given catalog products and eligibility data exist, when an admin opens the catalog coverage view, then the system shows coverage by routine step, priority profile, budget band, and market.
2. Gaps such as no eligible sunscreen for a budget/sensitive profile are visible.
3. Coverage calculations exclude ineligible, unpublished, or stale products.
4. The coverage view helps prioritize first-market catalog completion.

## Tasks / Subtasks

- [x] Add catalog coverage calculation. (AC: 1, 2, 3)
  - [x] Add coverage domain types and deterministic calculator.
  - [x] Use existing catalog eligibility rules.
  - [x] Group coverage by routine step, priority profile, budget band, and market.

- [x] Add admin coverage API and UI. (AC: 1, 2, 4)
  - [x] Add admin API endpoint for coverage.
  - [x] Add `/admin/catalog-coverage` page.
  - [x] Show visible gaps and first-market priority view.

- [x] Verify Story 3.7 behavior and regressions. (AC: 1-4)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/admin/catalog-coverage` and `/api/admin/catalog-coverage`.
- `npm run dev` started with `next dev --webpack`.
- `HEAD /admin/catalog-products`, `/admin/catalog-governance`, and `/admin/catalog-coverage` returned `200` without Supabase env vars.
- `GET /api/admin/catalog-coverage` returned `401 auth-required` without Supabase env vars.
- Secret and medical-boundary scan over Story 3.7 files returned no matches.

### Completion Notes List

- Added deterministic coverage report grouped by first market, routine step, priority profile, and budget band.
- Coverage calculations reuse Story 3.2 eligibility rules, so unpublished, stale, unavailable, formula-change, unsafe-fit, or otherwise blocked products do not count.
- Added admin coverage API and `/admin/catalog-coverage` page showing priority gaps and coverage grid.

### File List

- `_bmad-output/implementation-artifacts/3-7-show-catalog-coverage-gaps.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/app/admin/catalog-coverage/page.tsx`
- `routinelle/src/app/api/admin/catalog-coverage/route.ts`
- `routinelle/src/components/routinelle/admin/catalog-coverage-view.tsx`
- `routinelle/src/lib/catalog/catalog-coverage.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.7 catalog coverage gaps.

### Review Findings

- Clean review - no unresolved findings.
