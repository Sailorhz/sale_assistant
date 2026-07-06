# Story 3.6: Preserve Catalog and Rule Version Context

Status: done

## Story

As an internal operator,
I want catalog and rule changes versioned,
so that generated recommendations can be traced back to the data and rules used.

## Acceptance Criteria

1. Given catalog products or recommendation rules change, when a versioned catalog or rule state is published, then the system preserves a catalog version ID and rule version ID.
2. Generated routines can later reference the exact catalog/rule version used.
3. Version identifiers are available to recommendation and explanation services.
4. Versioning supports auditability without exposing internal details to consumers.

## Tasks / Subtasks

- [x] Add catalog and rule version storage. (AC: 1, 4)
  - [x] Add version tables for catalog and rules.
  - [x] Include status, notes, and publish timestamps.
  - [x] Protect version records with catalog admin RLS.

- [x] Add TypeScript version context model. (AC: 2, 3)
  - [x] Add domain model for recommendation version context.
  - [x] Add helpers to build routine-safe version references.
  - [x] Keep internal notes separate from consumer-facing version references.

- [x] Add admin version APIs. (AC: 1, 3)
  - [x] Add admin endpoint to create/list catalog and rule versions.
  - [x] Use standard API result wrappers and admin authorization.

- [x] Verify Story 3.6 behavior and regressions. (AC: 1-4)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and emitted `/api/admin/version-context`.
- Secret and medical-boundary scan over Story 3.6 files returned no matches.

### Completion Notes List

- Added admin-protected catalog and rule version tables with status, internal notes, and publish timestamps.
- Added routine-safe version context domain model that excludes internal notes from generated routine references.
- Added admin API to list/create catalog and rule versions.
- Kept generated routine persistence out of Story 3.6 scope; Epic 4/6 can consume the version context.

### File List

- `_bmad-output/implementation-artifacts/3-6-preserve-catalog-and-rule-version-context.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0008_catalog_rule_versions.sql`
- `routinelle/src/app/api/admin/version-context/route.ts`
- `routinelle/src/lib/domain/version-context.ts`
- `routinelle/src/lib/catalog/version-context.ts`
- `routinelle/src/lib/supabase/version-context.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.6 catalog/rule version context.

### Review Findings

- Clean review - no unresolved findings.
