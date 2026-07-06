# Story 3.3: Build Admin Product Create and Edit Workflow

Status: done

## Story

As an authorized catalog manager,
I want to create and edit product records through an admin interface,
so that the catalog can be maintained without app redeployment.

## Acceptance Criteria

1. Given an authenticated admin user opens the catalog admin area, when they create or edit a catalog product, then the UI allows structured entry of product metadata required by the schema.
2. Non-admin users cannot access catalog mutation screens or APIs.
3. Validation feedback is shown before publish eligibility.
4. Successful changes are persisted through admin APIs.
5. Admin UI remains separate from consumer product recommendation UI.

## Tasks / Subtasks

- [x] Add admin authorization foundation for catalog maintenance. (AC: 2)
  - [x] Add catalog admin membership schema and RLS policies.
  - [x] Add server-side admin auth helper.
  - [x] Keep mutation access denied for anonymous and non-admin users.

- [x] Add catalog product admin APIs. (AC: 2, 3, 4)
  - [x] Add list/create API under `src/app/api/admin/catalog-products/`.
  - [x] Add update API for existing catalog products.
  - [x] Use Story 3.2 validation/eligibility rules for feedback.
  - [x] Return standard API result wrapper responses.

- [x] Add separate admin UI for create/edit workflow. (AC: 1, 3, 5)
  - [x] Add `src/app/admin/catalog-products/page.tsx`.
  - [x] Add structured form controls for core required metadata.
  - [x] Show validation/eligibility feedback.
  - [x] Keep admin UI separate from consumer recommendation UI.

- [x] Verify Story 3.3 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Confirm admin routes build.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] Document that live Supabase admin authorization was not exercised if no database is configured.

## Dev Notes

### Scope Boundaries

- Story 3.3 creates and edits catalog product records only.
- Do not add publish/unpublish controls, freshness controls, tag/copy management, versioning, coverage dashboards, or recommendation matching.
- Do not use service-role keys.

### Architecture Requirements

- Admin pages: `src/app/admin/catalog-products/`
- Admin APIs: `src/app/api/admin/catalog-products/`
- Catalog logic: `lib/catalog/`
- Validation: Story 3.2 catalog validation rules
- Persistence: Supabase server client and RLS

### Previous Story Intelligence

- Story 3.1 created `catalog_products` with RLS but no broad policies.
- Story 3.2 created validation and API result wrapper utilities.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed after removing an unused import warning.
- `npm run build` passed and emitted `/admin/catalog-products`, `/api/admin/catalog-products`, and `/api/admin/catalog-products/[productId]`.
- Secret and medical-boundary scan over new admin/catalog files returned no matches.
- Live Supabase admin authorization was not exercised because no configured Supabase database is available in this environment.

### Completion Notes List

- Added `catalog_admins` migration, admin membership helper, and RLS policies for admin-only catalog product access.
- Added admin list/create/update catalog product APIs with Story 3.2 eligibility feedback and standard API result responses.
- Added separate `/admin/catalog-products` UI for structured catalog product create/edit work.
- Kept publish/unpublish controls, freshness controls, rule/copy management, versioning, and coverage dashboards out of Story 3.3 scope.

### File List

- `_bmad-output/implementation-artifacts/3-3-build-admin-product-create-and-edit-workflow.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0005_catalog_admin_access.sql`
- `routinelle/src/app/admin/catalog-products/page.tsx`
- `routinelle/src/app/api/admin/catalog-products/route.ts`
- `routinelle/src/app/api/admin/catalog-products/[productId]/route.ts`
- `routinelle/src/components/routinelle/admin/catalog-products-admin.tsx`
- `routinelle/src/lib/api/response.ts`
- `routinelle/src/lib/catalog/catalog-product-input.ts`
- `routinelle/src/lib/supabase/catalog-admin.ts`
- `routinelle/src/lib/supabase/catalog-products.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.3 admin product create/edit workflow.

### Review Findings

- [x] [Review][Patch] Removed unused type import in catalog product input parser.
