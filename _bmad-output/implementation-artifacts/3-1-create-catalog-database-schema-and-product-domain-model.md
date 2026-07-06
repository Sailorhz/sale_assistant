# Story 3.1: Create Catalog Database Schema and Product Domain Model

Status: done

## Story

As a catalog manager,
I want product records to have structured skincare metadata,
so that recommendations can be based on reliable product facts.

## Acceptance Criteria

1. Given the Supabase project is configured, when catalog schema migrations are applied, then the database supports catalog product records with brand, product name, category, routine step, INCI list, key ingredients, function tags, caution tags, verified claims, price, size, cost-per-unit where available, availability, market, and last verified date.
2. Formula-change and data-freshness fields are supported.
3. Database naming follows `snake_case` conventions.
4. TypeScript domain models expose `camelCase` fields.
5. Product records can represent at least the first-market catalog structure.

## Tasks / Subtasks

- [x] Add catalog product database migration. (AC: 1, 2, 3, 5)
  - [x] Add `routinelle/supabase/migrations/0004_catalog_products.sql`.
  - [x] Create `catalog_products` table with `snake_case` columns.
  - [x] Include required product identity, category, routine step, INCI, key ingredients, function tags, caution tags, verified claims, price, size, cost-per-unit, availability, market, last verified date, formula-change, and freshness metadata.
  - [x] Enable RLS and avoid public read/write policies until admin access rules are implemented.
  - [x] Add indexes for market, routine step, availability, verification, and freshness workflows.

- [x] Add TypeScript domain model and database mapper. (AC: 3, 4, 5)
  - [x] Add `routinelle/src/lib/domain/catalog-product.ts` with camelCase product types.
  - [x] Add `routinelle/src/lib/catalog/catalog-product.ts` with snake_case row types and mapper functions.
  - [x] Keep catalog validation/eligibility rules out of this story; Story 3.2 owns those.

- [x] Verify Story 3.1 behavior and regressions. (AC: 1-5)
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.
  - [x] Confirm schema uses `snake_case` and TypeScript models use `camelCase`.
  - [x] Document that migrations were statically reviewed but not applied to a live Supabase database if no database is configured.

## Dev Notes

### Scope Boundaries

- Story 3.1 creates the catalog data structure and TypeScript representation only.
- Do not build admin screens, admin APIs, product validation rules, publish/unpublish workflow, recommendation matching, no-safe-match handling, catalog coverage dashboards, analytics, or rule version persistence.
- Do not add service-role keys or broad public catalog policies.

### Product And Architecture Requirements

- Catalog records must support neutral product facts: brand, product name, category, routine step, INCI list, key ingredients, function tags, caution tags, verified claims, price, size, cost-per-unit, availability, market, and last verified date.
- Catalog data must support drift governance: formula-change flags, freshness status, freshness notes, and re-verification dates.
- Database fields must be `snake_case`.
- App/domain fields must be `camelCase`.
- Catalog logic belongs in `lib/catalog/`; domain types belong in `lib/domain/`.

### Suggested Technical Shape

- Use a single `catalog_products` table for the first-market MVP foundation.
- Use constrained text values for product category, routine step, market, availability, formula status, and data freshness state.
- Use text arrays for INCI, key ingredients, function tags, and caution tags.
- Use JSONB for verified claims so future evidence/source metadata can be represented without schema churn.
- Use integer minor units for price and cost-per-unit values to avoid floating point currency issues.
- Enable RLS now; later admin stories can add role-aware policies.

### Previous Story Intelligence

- Story 2.6 added `skin_profiles` and kept RLS conservative.
- Existing Supabase migrations use `public.*` tables, `snake_case`, RLS, and timestamp triggers.
- Existing codebase has no test framework configured; use lint/build and static checks.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.1]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR36, FR37, FR40; catalog drift and data requirements]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Product Catalog & Recommendation Governance module paths]
- [Source: `_bmad-output/implementation-artifacts/2-6-allow-profile-input-updates-after-first-routine.md` - recent migration and RLS conventions]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 2.6 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- SQL naming scan for camelCase in `0004_catalog_products.sql` returned no matches.
- Secret scan for service-role/client-exposed secret patterns returned no matches.
- Catalog-file scan for medical wording and secret patterns returned no matches after using `active` instead of `treatment` as the product-category value.
- Migration was statically reviewed but not applied to a live Supabase database because no configured Supabase database is available in this environment.

### Completion Notes List

- Added `catalog_products` migration with required catalog product metadata, first-market support, price/size/cost-per-unit fields, availability, verification, formula-change, and data-freshness governance fields.
- Enabled RLS on `catalog_products` without adding public read/write policies; admin access policy work remains for later Epic 3 stories.
- Added camelCase catalog product domain model and a snake_case database row mapper in `lib/catalog/`.
- Kept validation, eligibility, admin UI, publish/unpublish, and recommendation matching out of Story 3.1 scope.

### File List

- `_bmad-output/implementation-artifacts/3-1-create-catalog-database-schema-and-product-domain-model.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/supabase/migrations/0004_catalog_products.sql`
- `routinelle/src/lib/domain/catalog-product.ts`
- `routinelle/src/lib/catalog/catalog-product.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.1 catalog schema and domain model.

### Review Findings

- [x] [Review][Patch] Initial product-category vocabulary used `treatment`, which could blur the cosmetic/medical boundary. Replaced it with `active` in the SQL constraint and TypeScript union.
