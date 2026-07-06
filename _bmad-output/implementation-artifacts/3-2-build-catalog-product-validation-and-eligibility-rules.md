# Story 3.2: Build Catalog Product Validation and Eligibility Rules

Status: done

## Story

As a catalog manager,
I want incomplete or unsafe product records blocked from recommendation eligibility,
so that users only receive recommendations grounded in usable catalog data.

## Acceptance Criteria

1. Given a product record is created or updated, when the product is evaluated for recommendation eligibility, then required metadata fields are validated.
2. Missing required fields prevent the product from becoming recommendation-eligible.
3. Unavailable, stale, unsafe-fit, or missing-metadata products can be excluded from recommendations.
4. Validation errors are returned through the standard API result wrapper.
5. Catalog validation has focused test coverage.

## Tasks / Subtasks

- [x] Add catalog validation and eligibility domain rules. (AC: 1, 2, 3)
  - [x] Add structured validation issue and eligibility result types.
  - [x] Validate required metadata fields from Story 3.1.
  - [x] Block unavailable, stale, formula-change, unsafe-fit, and missing-metadata products from eligibility.
  - [x] Keep validation deterministic and side-effect free.

- [x] Add standard API result wrapper support for catalog validation. (AC: 4)
  - [x] Add shared API result helper or catalog-specific wrapper.
  - [x] Return validation issues in a stable, typed shape usable by admin APIs.

- [x] Add focused validation coverage and verification. (AC: 5)
  - [x] Add focused catalog validation test fixtures.
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run available catalog validation tests or document no runnable test framework if unavailable.
  - [x] Confirm no service-role/client-exposed secret patterns are introduced.

## Dev Notes

### Scope Boundaries

- Story 3.2 owns validation and eligibility logic only.
- Do not build admin UI, admin mutation APIs, publish/unpublish controls, recommendation matching, coverage dashboards, or versioning in this story.
- Do not make eligibility depend on a live Supabase connection.

### Product And Architecture Requirements

- Missing required metadata must block recommendation eligibility.
- Unavailable, stale, unsafe-fit, or missing-metadata products must be excludable from recommendations.
- Validation output should be stable enough for admin UI and APIs in later stories.
- Catalog logic belongs in `lib/catalog/`.

### Previous Story Intelligence

- Story 3.1 added `CatalogProduct`, `CatalogProductRow`, and `mapCatalogProductRow`.
- Existing repo has no runnable unit test framework configured in `package.json`.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.2]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR38, FR41; NFR28-NFR30]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - catalog validation path]
- [Source: `_bmad-output/implementation-artifacts/3-1-create-catalog-database-schema-and-product-domain-model.md`]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and completed Story 3.1 notes above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm run lint` passed.
- `npm run build` passed.
- Secret and medical-boundary scan over new catalog validation/API/test files returned no matches.
- No runnable unit test framework is configured in `package.json`; focused TypeScript catalog validation fixtures were added and covered by lint/build type checks.

### Completion Notes List

- Added deterministic catalog metadata validation and recommendation eligibility rules.
- Added shared `ApiResult` wrapper usable by later admin APIs.
- Added focused catalog validation fixtures for eligible, missing metadata, unavailable, stale, and unsafe-fit cases.
- Kept admin UI, mutation APIs, publish controls, and recommendation matching out of Story 3.2 scope.

### File List

- `_bmad-output/implementation-artifacts/3-2-build-catalog-product-validation-and-eligibility-rules.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/lib/api/result.ts`
- `routinelle/src/lib/catalog/catalog-product-validation.ts`
- `routinelle/src/tests/catalog/catalog-product-validation.test.ts`

### Change Log

- 2026-05-19: Created, implemented, reviewed, and completed Story 3.2 catalog validation and eligibility rules.

### Review Findings

- Clean review - no unresolved findings.
