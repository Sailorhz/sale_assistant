# Story 3.4: Add Publish, Unpublish, Review, and Freshness Controls

Status: done

## Story

As a catalog manager,
I want to control product publication and freshness state,
so that only reviewed and current products are eligible for recommendations.

## Acceptance Criteria

1. Given a product exists in the catalog, when an admin changes its status, then the product can be published, unpublished, or flagged for review.
2. Formula-change and data-freshness flags can be set.
3. Unpublished or flagged products are excluded from recommendation eligibility unless explicitly allowed by rules.
4. Product status changes are stored with timestamps.
5. The admin interface shows product eligibility status clearly.

## Tasks / Subtasks

- [x] Add publication and review status persistence. (AC: 1, 4)
  - [x] Add migration fields for publication status and status timestamps.
  - [x] Preserve existing catalog product records with safe defaults.
  - [x] Add database trigger logic for publish/unpublish/review timestamps.

- [x] Extend catalog domain and eligibility rules. (AC: 2, 3)
  - [x] Add publication status fields to domain models and row mappers.
  - [x] Block non-published and review-flagged products from default eligibility.
  - [x] Keep formula-change and data-freshness flags integrated with validation.

- [x] Extend admin UI controls. (AC: 1, 2, 5)
  - [x] Add status, formula, and freshness controls to the admin editor.
  - [x] Show eligibility status clearly in the admin UI.

- [x] Verify Story 3.4 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Confirm admin routes build.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed and admin catalog routes still build.
- Secret and medical-boundary scan over Story 3.4 catalog files returned no matches.

### Completion Notes List

- Added publication status, review reason, and publication/review timestamps to catalog products.
- Added database trigger logic to set publish, unpublish, and review timestamps on status transitions.
- Extended catalog domain models, row mappers, input parsing, and eligibility rules for publication status.
- Added admin UI controls for publication status, formula status, data freshness, and review reason.

### File List

- `_bmad-output/implementation-artifacts/3-4-add-publish-unpublish-review-and-freshness-controls.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0006_catalog_product_publication_status.sql`
- `routinelle/src/lib/domain/catalog-product.ts`
- `routinelle/src/lib/catalog/catalog-product.ts`
- `routinelle/src/lib/catalog/catalog-product-input.ts`
- `routinelle/src/lib/catalog/catalog-product-validation.ts`
- `routinelle/src/lib/supabase/catalog-products.ts`
- `routinelle/src/components/routinelle/admin/catalog-products-admin.tsx`
- `routinelle/src/tests/catalog/catalog-product-validation.test.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.4 publish/unpublish/review/freshness controls.

### Review Findings

- [x] [Review][Patch] Product mutation rows initially included status timestamp fields that could clear existing timestamp metadata. Fixed by excluding status timestamps from mutation payloads and letting the database trigger own them.
