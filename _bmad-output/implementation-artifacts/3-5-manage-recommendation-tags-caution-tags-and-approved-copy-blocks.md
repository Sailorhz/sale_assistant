# Story 3.5: Manage Recommendation Tags, Caution Tags, and Approved Copy Blocks

Status: done

## Story

As a catalog or rules manager,
I want to manage product tags, caution tags, recommendation rule inputs, and approved explanation copy,
so that recommendations and explanations remain consistent and claim-safe.

## Acceptance Criteria

1. Given an authorized admin user opens rule/copy management, when they manage tags or approved copy blocks, then the system supports function tags, caution tags, routine-step tags, and explanation copy references.
2. Changes are stored in a way that recommendation and explanation modules can consume.
3. Approved copy is separated from free-form user-facing claims.
4. Non-admin users cannot mutate these records.
5. Changes can be associated with a rule or catalog version where applicable.

## Tasks / Subtasks

- [x] Add governance storage for tags and approved copy. (AC: 1, 2, 3, 5)
  - [x] Add tables for catalog/routine tags and approved copy blocks.
  - [x] Keep approved copy separate from product verified claims.
  - [x] Include optional version association fields.
  - [x] Protect records with admin-only RLS policies.

- [x] Add admin APIs for governance records. (AC: 2, 4)
  - [x] Add admin tag create/list API.
  - [x] Add approved copy block create/list API.
  - [x] Use standard API result responses and admin authorization.

- [x] Add admin governance UI. (AC: 1, 3)
  - [x] Add separate `/admin/catalog-governance` page.
  - [x] Provide structured controls for tag and copy block creation.
  - [x] Keep copy blocks separate from product forms.

- [x] Verify Story 3.5 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/admin/catalog-governance` plus governance admin APIs.
- Secret and medical-boundary scan over Story 3.5 files returned no matches.

### Completion Notes List

- Added admin-protected `catalog_tags` and `approved_copy_blocks` governance tables.
- Added typed domain/mapper/persistence helpers for tags and approved copy blocks.
- Added admin list/create APIs for governance tags and copy blocks.
- Added separate `/admin/catalog-governance` UI so approved copy is managed separately from product verified claims.

### File List

- `_bmad-output/implementation-artifacts/3-5-manage-recommendation-tags-caution-tags-and-approved-copy-blocks.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0007_catalog_governance_records.sql`
- `routinelle/src/app/admin/catalog-governance/page.tsx`
- `routinelle/src/app/api/admin/catalog-governance/tags/route.ts`
- `routinelle/src/app/api/admin/catalog-governance/copy-blocks/route.ts`
- `routinelle/src/components/routinelle/admin/catalog-governance-admin.tsx`
- `routinelle/src/lib/domain/catalog-governance.ts`
- `routinelle/src/lib/catalog/catalog-governance.ts`
- `routinelle/src/lib/supabase/catalog-governance.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.5 governance tags and approved copy management.

### Review Findings

- Clean review - no unresolved findings.
