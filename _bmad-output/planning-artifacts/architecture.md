---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-05-13'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/product-brief-sale_assistant.md
  - _bmad-output/planning-artifacts/product-brief-sale_assistant-distillate.md
workflowType: 'architecture'
project_name: 'sale_assistant'
user_name: 'Long'
date: '2026-05-13'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The PRD defines **61 functional requirements** across these major areas:

- User onboarding and skin profile capture.
- Routine recommendation and product matching.
- Explainability and trust.
- Safety, conflict detection, and Gentle Start behavior.
- Outcome tracking and routine adaptation.
- Product catalog and recommendation governance.
- Privacy, consent, and account data.
- Analytics and commercial neutrality rules.

Architecturally, this means Routinelle needs more than a simple quiz app. It needs a structured domain model for users, skin profiles, product catalog data, recommendation rules, routine outputs, safety events, and catalog/rule versions.

The most important architectural implication is that the recommendation system must be **rule-first, deterministic, explainable, and auditable**. AI can help generate user-facing explanations, but it should be constrained by approved product/rule metadata and copy guardrails.

**Non-Functional Requirements:**

The PRD defines **36 non-functional requirements**. The most architecture-shaping ones are:

- Routine generation should complete within **2 seconds p95** after onboarding submission.
- Users should complete onboarding and receive a routine in under **5 minutes**.
- User profile, routine, reaction, and optional photo data must be protected in transit and at rest.
- GDPR-oriented privacy expectations apply for a France/EU launch.
- **100% of displayed routines must pass safety and claim guardrail checks**.
- Same profile + same catalog/rule version must produce deterministic recommendations.
- Explanations must be traceable to product attributes, rules, approved copy, or source notes.
- Catalog records must pass metadata validation before becoming recommendation-eligible.
- Recommendation ranking must remain independent from affiliate, brand, or retailer relationships.

These NFRs strongly push the architecture toward versioned data, testable rules, centralized copy/claim governance, and separation between commercial links and recommendation ranking.

**Scale & Complexity:**

- Primary domain: mobile-first consumer web/PWA with backend recommendation, catalog, analytics, and admin operations.
- Complexity level: medium-high.
- Estimated architectural components: 10-12 core components.

Likely components:

- Consumer web/PWA frontend.
- Admin/catalog management frontend.
- Backend API.
- Authentication/account service.
- Skin profile and onboarding module.
- Product catalog module.
- Recommendation engine.
- Safety/claim guardrail module.
- Explanation generation module.
- Routine/check-in module.
- Analytics/event tracking module.
- Audit/versioning layer.

### Technical Constraints & Dependencies

Key constraints from the PRD and UX:

- MVP should be mobile-first responsive web/PWA.
- Native app is post-MVP unless launch requirements change.
- No camera/photo permissions required for MVP core flow.
- No precise location required; user-selected market/country is enough.
- Product catalog starts with one market, likely France, and around 300 curated products.
- Catalog data may come from manual curation, official pages, compliant retailer feeds, affiliate APIs, or partnerships.
- Ingredient references should align with credible cosmetic sources such as CosIng/COSMILE-style references.
- Product links and availability can be stale, so stale/unavailable states must not break the journey.
- Admin/catalog operations must be separate from consumer UX.
- Commercial partnerships must not alter personalized ranking.

### Cross-Cutting Concerns Identified

The main cross-cutting concerns are:

- **Privacy and GDPR:** profile, skin concerns, reaction data, budget, market, and future photos are sensitive.
- **Safety and claim control:** the app must avoid diagnosis/treatment/cure language and escalate serious symptoms.
- **Recommendation traceability:** every recommendation, warning, and explanation should map to rules, metadata, source notes, or approved copy.
- **Catalog data quality:** incomplete or stale product data must prevent eligibility or trigger warnings.
- **Versioning and auditability:** catalog/rule versions must be preserved with generated routines.
- **Commercial neutrality:** affiliate or partner data must be separated from ranking logic.
- **Mobile performance:** onboarding and routine reveal must remain fast on mobile.
- **Accessibility:** onboarding, routine cards, warnings, and explanations need WCAG AA-oriented design.
- **Analytics:** onboarding completion, routine saves, product clicks, check-ins, fallback states, and safety events must be tracked.
- **Future expansion:** architecture should support additional markets, larger catalogs, longer outcome tracking, product replacement, and optional photo progress later.

### Architecture Implication Summary

The architecture should prioritize:

1. **A deterministic rules engine** for routine and product matching.
2. **A structured, versioned product catalog** with validation before recommendation eligibility.
3. **A safety/claim guardrail layer** that runs before any routine is displayed.
4. **Traceable explanations** generated from approved metadata, rules, and copy blocks.
5. **Separate admin and consumer surfaces** sharing the same governed backend data.
6. **Privacy-first account/profile storage** with deletion controls.
7. **Analytics designed around trust, safety, and recommendation quality**, not only clicks.

## Starter Template Evaluation

### Primary Technology Domain

The primary technology domain is:

**Full-stack mobile-first web/PWA**

Routinelle needs:

- Consumer mobile-first onboarding and routine UI.
- Backend recommendation and safety logic.
- Product catalog database.
- Admin/catalog management.
- User accounts for saved routines and check-ins.
- GDPR-oriented data handling.
- Future PWA/native expansion path.

### Starter Options Considered

**Option 1: Official Next.js Starter**

Source checked: Next.js `create-next-app` docs  
https://nextjs.org/docs/app/api-reference/cli/create-next-app

This gives:

- Next.js App Router.
- TypeScript by default.
- Tailwind CSS by default.
- ESLint or Biome.
- Turbopack.
- `src/` directory option.
- Good deployment path on Vercel or container platforms.

Strengths:

- Cleanest official foundation.
- Flexible.
- Good for mobile-first responsive UI.
- Good match for the UX design system direction.

Limitations:

- Auth, database, and admin data patterns must be added separately.

**Option 2: Next.js + Supabase Starter**

Source checked: Supabase Next.js docs  
https://supabase.com/docs/guides/auth/quickstarts/nextjs  
https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

Supabase's Next.js template is preconfigured with:

- Next.js.
- TypeScript.
- Tailwind CSS.
- Cookie-based auth.
- Supabase integration.

Strengths:

- Strong MVP fit for auth, PostgreSQL, row-level security, and data deletion needs.
- Reduces backend setup work.
- Good for catalog/admin data and account-based routine saving.
- PostgreSQL supports versioned catalog/rule data and auditability.

Limitations:

- Recommendation engine logic still needs to be designed carefully in app/server modules.
- Supabase use must be governed carefully for GDPR/data privacy expectations.

**Option 3: Create T3 App**

Source checked: Create T3 App docs  
https://create.t3.gg/en/installation

T3 can scaffold:

- Next.js.
- TypeScript.
- Tailwind.
- tRPC.
- Prisma or Drizzle.
- NextAuth.

Strengths:

- Strong full-stack type safety.
- Good if the development team already likes tRPC/Prisma/Drizzle.
- Good long-term structure for a complex app.

Limitations:

- More stack decisions upfront.
- More moving parts for an MVP founder workflow.
- Not necessary unless the team specifically wants tRPC.

**Option 4: shadcn/ui Next.js Setup**

Source checked: shadcn/ui docs  
https://ui.shadcn.com/docs/installation/next

This is not a full app starter by itself, but it is a strong UI component foundation after Next.js setup.

Strengths:

- Fits the UX spec: Tailwind + custom component layer.
- Components are copied into the codebase and can be customized.
- Good for forms, cards, dialogs, badges, alerts, and admin UI.

Limitations:

- Does not solve backend, database, or auth.

### Selected Starter: Next.js + Supabase + shadcn/ui

**Rationale for Selection:**

I recommend using the **Next.js with Supabase starter** as the base, then adding **shadcn/ui** for the component system.

This is the best fit because Routinelle needs both:

- a polished mobile-first UI, and
- structured backend data for user profiles, routines, catalog governance, safety events, and audit/versioning.

This choice supports the MVP without overcomplicating the stack.

### Initialization Command

```bash
npx create-next-app@latest routinelle -e with-supabase
cd routinelle
npx shadcn@latest init
```

Alternative using pnpm:

```bash
pnpm create next-app@latest routinelle --example with-supabase
cd routinelle
pnpm dlx shadcn@latest init
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**

- TypeScript.
- React.
- Next.js App Router.
- Server-side routes and server components where appropriate.

**Styling Solution:**

- Tailwind CSS.
- shadcn/ui component foundation.
- Custom Routinelle component layer for questionnaire, routine cards, product cards, safety panels, and check-ins.

**Build Tooling:**

- Next.js build pipeline.
- Turbopack/dev tooling via current Next.js defaults.
- Deployable to Vercel initially, with later portability if needed.

**Database & Auth Foundation:**

- Supabase Auth for accounts.
- Supabase PostgreSQL for structured data.
- Row-level security potential for user-owned profile/routine data.
- Admin data can be separated with roles and policies.

**Testing Framework:**

The starter does not fully solve the testing strategy. Architecture should add:

- Unit tests for recommendation rules.
- Fixture tests for skin profiles and catalog cases.
- Safety/claim guardrail tests.
- Catalog validation tests.
- E2E tests for onboarding, routine generation, check-in, and safety escalation.

**Code Organization:**

Recommended structure should separate:

- `app/` routes and screens.
- `components/` shared UI and Routinelle custom components.
- `lib/domain/` domain models and validation.
- `lib/recommendation/` deterministic recommendation rules.
- `lib/safety/` safety and claim guardrails.
- `lib/catalog/` product catalog services.
- `lib/explanations/` approved copy and constrained explanation generation.
- `lib/analytics/` event tracking.
- `supabase/` migrations and database schema.

**Development Experience:**

- Fast local dev server.
- Typed frontend/backend code.
- Tailwind/shadcn component workflow.
- Supabase local or hosted development path.
- Clear first implementation story: initialize app, configure Supabase, add shadcn, and set baseline project structure.

### Starter Decision Summary

Use:

**Next.js + Supabase + shadcn/ui**

Do not start with:

- Native app.
- Full marketplace stack.
- Generic AI chatbot starter.
- T3 unless the implementation team strongly prefers tRPC/Prisma/Drizzle.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions**

- Use **Next.js App Router + TypeScript** for the full-stack web/PWA.
- Use **Supabase PostgreSQL + Supabase Auth** for MVP auth and database.
- Implement a **server-side deterministic recommendation engine**.
- Implement a **safety/claim guardrail layer before routine display**.
- Store **catalog/rule versions** with every generated routine.
- Keep **commercial data separate from ranking logic**.

**Important Decisions**

- Use shadcn/ui + Tailwind for UI primitives.
- Use PostgreSQL row-level security for user-owned data.
- Use server-side analytics events for key product signals.
- Add rule, catalog, and safety fixture tests from the first implementation phase.

**Deferred Decisions**

- Native app: post-MVP.
- Photo progress journal: post-MVP unless reprioritized.
- Multi-market catalog: post-MVP.
- Retailer API integrations: not required for MVP recommendation generation.
- Advanced AI personalization: after deterministic rule engine is trusted.

### Data Architecture

**Database:** Supabase PostgreSQL.

Rationale:

- Strong fit for structured catalog data.
- Supports relational product, ingredient, routine, profile, and event models.
- Supports JSON fields where flexible rule metadata is useful.
- Enables row-level security for user-owned data.
- PostgreSQL gives a clear path to versioning, audit trails, and future scale.

**Core data domains:**

- Users and consent records.
- Skin profiles and questionnaire answers.
- Product catalog.
- Ingredient/function/caution tags.
- Recommendation rules and rule versions.
- Generated routines.
- Routine steps and product options.
- Safety events.
- Check-in outcomes.
- Product clicks and analytics events.
- Admin audit logs.

**Validation strategy:**

- Use schema validation at API boundaries.
- Use database constraints for required catalog fields.
- Product records cannot become recommendation-eligible until required metadata passes validation.
- Recommendation outputs must pass safety and claim checks before persistence/display.

**Migration approach:**

- Use Supabase migrations from the start.
- Treat schema changes as versioned implementation artifacts.
- Seed initial catalog/rules through controlled scripts or admin import workflows.

**Caching strategy:**

- Cache public/static catalog reference reads where useful.
- Do not cache user-specific routines without preserving catalog/rule version context.
- Recommendation generation should be fast enough for MVP without complex distributed caching.

### Authentication & Security

**Authentication:** Supabase Auth.

**Authorization:**

- Anonymous users can complete first routine flow where possible.
- Account required to save routines, track outcomes, and receive check-ins.
- Admin/catalog access requires explicit admin role.
- Row-level security protects user profile, routine, and check-in data.

**Security rules:**

- Never expose service-role keys to the client.
- Recommendation generation and safety checks run server-side.
- Admin mutations require role checks.
- Profile deletion and data export/delete pathways must be supported for GDPR-oriented expectations.

**Sensitive data posture:**

- Collect only data needed for recommendations.
- No camera/photo permission in MVP.
- No precise location in MVP; market/country selection is enough.
- Store safety events carefully because they may include sensitive symptom information.

### API & Communication Patterns

**API style:** Next.js server actions / route handlers for application operations.

Use server-side endpoints for:

- Submit onboarding.
- Generate routine.
- Save routine.
- Product click tracking.
- Submit 7-day check-in.
- Report bad reaction.
- Admin catalog CRUD.
- Admin publish/unpublish/validate product.

**Recommendation boundary:**

- Client submits structured profile inputs.
- Server normalizes profile.
- Recommendation engine selects routine/product options.
- Safety layer validates output.
- Explanation layer attaches approved rationale.
- Routine is persisted with catalog/rule version.
- Client receives display-ready structured routine.

**Error handling:**

- Use typed error categories: validation, safety-blocked, no-safe-match, unavailable-product, auth-required, permission-denied, system-error.
- Safety-blocked and no-safe-match are normal product states, not crashes.

**Rate limiting:**

- Apply basic rate limiting to routine generation, check-in submission, auth-sensitive routes, and admin mutation routes.
- Stronger limits can be added post-MVP if abuse appears.

### Frontend Architecture

**Framework:** Next.js App Router + React + TypeScript.

**UI foundation:** Tailwind + shadcn/ui.

**State management:**

- Prefer server state from route/server responses.
- Use local component state for questionnaire flow.
- Avoid global state unless a repeated cross-route need appears.
- Persist routine/check-in state server-side after account/save.

**Component organization:**

- `components/ui/` for shadcn primitives.
- `components/routinelle/` for domain components.
- `app/` for route-level screens.
- `lib/domain/` for shared types and validation.
- `lib/recommendation/` for deterministic rules.
- `lib/safety/` for guardrails.
- `lib/catalog/` for catalog access.
- `lib/explanations/` for approved copy and explanation helpers.
- `lib/analytics/` for event tracking.

**Performance decisions:**

- Mobile-first pages.
- Keep onboarding screens lightweight.
- Generate routine server-side within p95 target.
- Lazy-load admin-only code separately from consumer flow.
- Use progressive disclosure for ingredient explanations.

### Infrastructure & Deployment

**Initial hosting:** Vercel for Next.js + Supabase hosted backend.

Rationale:

- Fits Next.js well.
- Fast MVP deployment.
- Good preview deployment workflow.
- Supabase handles PostgreSQL/Auth/storage foundation.

**Runtime:** Node.js Active LTS. Current Node guidance says production apps should use Active or Maintenance LTS; Node 24 is current LTS as of May 2026.

**Environment strategy:**

- Local development.
- Staging Supabase project.
- Production Supabase project.
- Separate environment variables for Supabase URL/keys, analytics, and future AI provider credentials.

**Monitoring/logging:**

- Track server errors, recommendation failures, safety-blocked events, no-safe-match rates, and catalog validation failures.
- Analytics should focus on onboarding completion, time-to-routine, saves, product clicks, check-ins, fallback states, and safety events.

### Decision Impact Analysis

**Implementation Sequence**

1. Initialize Next.js + Supabase + shadcn/ui.
2. Define database schema and migrations.
3. Build domain validation types.
4. Build catalog metadata model and admin validation.
5. Build deterministic recommendation engine.
6. Build safety/claim guardrail layer.
7. Build onboarding-to-routine flow.
8. Build routine save and account flow.
9. Build 7-day check-in.
10. Add analytics and audit events.

**Cross-Component Dependencies**

- Recommendation engine depends on validated catalog data.
- Routine display depends on safety guardrail pass.
- Explanation UI depends on approved copy/rule metadata.
- Check-ins update user profile signals used by later recommendations.
- Product click analytics must not affect ranking unless explicitly modeled as aggregate product-quality signals later.
- Admin catalog changes must create traceable catalog/rule version changes.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical conflict points identified:** 9 areas where AI agents could make incompatible choices:

1. Database/table naming.
2. TypeScript/domain model naming.
3. API/server action response formats.
4. Validation ownership.
5. Recommendation and safety pipeline order.
6. Error handling.
7. UI component organization.
8. Analytics event naming.
9. Admin vs consumer access boundaries.

### Naming Patterns

**Database Naming Conventions**

Use PostgreSQL-friendly `snake_case`.

Rules:

- Tables: plural `snake_case`
  - `skin_profiles`
  - `catalog_products`
  - `generated_routines`
  - `routine_steps`
  - `safety_events`
- Columns: `snake_case`
  - `user_id`
  - `catalog_version_id`
  - `rule_version_id`
  - `created_at`
  - `last_verified_at`
- Primary keys: `id`
- Foreign keys: `{singular_table_name}_id`
  - `product_id`
  - `routine_id`
  - `profile_id`
- Indexes: `idx_{table}_{columns}`
  - `idx_catalog_products_market_status`
- Unique constraints: `uniq_{table}_{columns}`

**API Naming Conventions**

Use route paths with lowercase kebab-case or resource names.

Examples:

- `/api/onboarding/submit`
- `/api/routines/generate`
- `/api/routines/save`
- `/api/check-ins/submit`
- `/api/safety-events/report`
- `/api/admin/catalog-products`

Query parameters should use `camelCase` in app-facing APIs:

- `routineId`
- `productId`
- `marketCode`

**Code Naming Conventions**

Use TypeScript/React conventions:

- Components: `PascalCase`
  - `RoutineStepCard`
  - `ProductRecommendationCard`
  - `SafetyEscalationPanel`
- Component files: `PascalCase.tsx`
  - `RoutineStepCard.tsx`
- Utility/domain files: `kebab-case.ts`
  - `recommendation-engine.ts`
  - `safety-guardrails.ts`
- Functions and variables: `camelCase`
  - `generateRoutine`
  - `validateCatalogProduct`
  - `userProfile`
- Types/interfaces: `PascalCase`
  - `SkinProfile`
  - `GeneratedRoutine`
  - `SafetyEvent`
- Enums/unions: string literal unions preferred for domain states.

### Structure Patterns

**Project Organization**

Recommended structure:

```text
src/
  app/
    (consumer)/
    admin/
    api/
  components/
    ui/
    routinelle/
  lib/
    analytics/
    catalog/
    domain/
    explanations/
    recommendation/
    safety/
    supabase/
    validation/
  tests/
    fixtures/
    recommendation/
    safety/
    catalog/
supabase/
  migrations/
  seed/
```

Rules:

- UI components must not contain recommendation business logic.
- Recommendation logic belongs in `lib/recommendation/`.
- Safety and claim validation belongs in `lib/safety/`.
- Catalog access belongs in `lib/catalog/`.
- Shared domain types belong in `lib/domain/`.
- Validation schemas belong in `lib/validation/`.
- Supabase client/server utilities belong in `lib/supabase/`.
- Admin routes live under `app/admin/`.
- Consumer routes live under `app/(consumer)/`.

**Test Organization**

Use focused test folders for business-critical logic:

- Recommendation rule tests: `tests/recommendation/`
- Safety guardrail tests: `tests/safety/`
- Catalog validation tests: `tests/catalog/`
- Shared fixtures: `tests/fixtures/`

UI component tests may be co-located only when they test local UI behavior.

### Format Patterns

**API Response Formats**

Use a consistent result wrapper.

Success:

```ts
{
  ok: true,
  data: T,
  meta?: {
    requestId?: string;
    catalogVersionId?: string;
    ruleVersionId?: string;
  }
}
```

Failure:

```ts
{
  ok: false,
  error: {
    code: string;
    message: string;
    details?: unknown;
  },
  meta?: {
    requestId?: string;
  }
}
```

Rules:

- Do not return raw thrown errors to the client.
- Do not expose internal stack traces.
- Safety-blocked and no-safe-match are expected product states, not generic system errors.

**Data Exchange Formats**

- Client/domain TypeScript uses `camelCase`.
- Database uses `snake_case`.
- Supabase mapping should be handled in repository/service functions, not scattered through UI components.
- Dates in API responses use ISO 8601 strings.
- Money fields store integer minor units where possible, plus currency code.
- Market uses uppercase ISO-style code where appropriate, e.g. `FR`.

### Communication Patterns

**Analytics Event Naming**

Use lowercase dot-separated names:

- `onboarding.started`
- `onboarding.completed`
- `routine.generated`
- `routine.saved`
- `product.clicked`
- `check_in.completed`
- `recommendation.no_safe_match`
- `safety.professional_care_shown`
- `catalog.product_published`

Event payloads must include only necessary data.

Rules:

- Do not send sensitive free-text symptom detail to analytics.
- Use IDs, categories, and severity levels rather than personal content.
- Product clicks must not directly change recommendation ranking.

**State Management Patterns**

- Onboarding flow uses local component state until submitted.
- Generated routine is server-created and persisted only when saved/account-linked.
- Check-in state is form-local until submitted.
- Admin catalog forms use server validation before publish eligibility.
- Avoid global state unless needed across multiple route groups.

### Process Patterns

**Recommendation Pipeline Pattern**

All routine generation must follow this order:

1. Validate onboarding input.
2. Normalize skin profile.
3. Load eligible catalog products for market.
4. Load active recommendation rule version.
5. Generate candidate routine.
6. Score product options.
7. Run conflict checks.
8. Run safety and claim guardrails.
9. Attach approved explanations.
10. Persist routine with `catalogVersionId` and `ruleVersionId`.
11. Return display-ready routine.

Agents must not bypass safety checks or explanation constraints.

**Error Handling Patterns**

Use typed error codes:

- `VALIDATION_ERROR`
- `AUTH_REQUIRED`
- `PERMISSION_DENIED`
- `NO_SAFE_MATCH`
- `SAFETY_BLOCKED`
- `CATALOG_UNAVAILABLE`
- `PRODUCT_UNAVAILABLE`
- `RATE_LIMITED`
- `SYSTEM_ERROR`

User-facing messages should be calm and non-technical. Developer logs can contain internal detail, but sensitive user data should be minimized.

**Loading State Patterns**

Use domain-specific loading messages:

- "Checking your skin profile"
- "Matching routine steps"
- "Reviewing irritation risk"
- "Preparing your routine"

Avoid fake certainty or medical language.

### Enforcement Guidelines

**All AI Agents MUST:**

- Keep business logic out of React components.
- Use database `snake_case` and TypeScript `camelCase`.
- Use the standard API response wrapper.
- Run recommendation output through safety/claim guardrails before display.
- Preserve catalog/rule version context on generated routines.
- Keep admin/catalog mutation logic behind admin authorization checks.
- Use approved error codes.
- Keep commercial/affiliate data separate from ranking logic.
- Add or update tests when changing recommendation, safety, or catalog validation behavior.

**Pattern Enforcement**

- Architecture violations should be flagged in code review.
- New domain states require updates to domain types and tests.
- New recommendation rules require fixture coverage.
- New safety/caution copy must use approved copy blocks or guardrail-reviewed text.
- Any exception to these patterns must be documented in the architecture file before implementation.

### Pattern Examples

**Good Example**

```ts
const result = await generateRoutine({
  profileInput,
  marketCode: "FR",
});

if (!result.ok) {
  return toApiError(result.error);
}
```

**Good Example**

```ts
type RoutineGenerationState =
  | "input_validated"
  | "candidate_generated"
  | "safety_checked"
  | "ready_to_display"
  | "no_safe_match"
  | "safety_blocked";
```

**Anti-Patterns**

- Calling Supabase directly from a product card component.
- Returning `{ error: "failed" }` without a typed error code.
- Showing a routine before safety validation.
- Letting affiliate commission influence product ranking.
- Storing catalog version only as display text.
- Using AI-generated skincare claims without approved metadata.
- Creating ad hoc table names like `SkinProfiles` or `routineVersion`.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
routinelle/
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json
├── .env.example
├── .env.local
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── icons/
│   └── images/
├── src/
│   ├── middleware.ts
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (consumer)/
│   │   │   ├── layout.tsx
│   │   │   ├── onboarding/
│   │   │   │   └── page.tsx
│   │   │   ├── routine/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [routineId]/
│   │   │   │       └── page.tsx
│   │   │   ├── check-in/
│   │   │   │   └── [routineId]/
│   │   │   │       └── page.tsx
│   │   │   ├── safety/
│   │   │   │   └── report/
│   │   │   │       └── page.tsx
│   │   │   └── account/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── catalog-products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [productId]/
│   │   │   │       └── page.tsx
│   │   │   ├── rules/
│   │   │   │   └── page.tsx
│   │   │   ├── safety-events/
│   │   │   │   └── page.tsx
│   │   │   └── catalog-coverage/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── onboarding/
│   │   │   │   └── submit/
│   │   │   │       └── route.ts
│   │   │   ├── routines/
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts
│   │   │   │   └── save/
│   │   │   │       └── route.ts
│   │   │   ├── check-ins/
│   │   │   │   └── submit/
│   │   │   │       └── route.ts
│   │   │   ├── product-clicks/
│   │   │   │   └── route.ts
│   │   │   ├── safety-events/
│   │   │   │   └── report/
│   │   │   │       └── route.ts
│   │   │   └── admin/
│   │   │       ├── catalog-products/
│   │   │       │   └── route.ts
│   │   │       ├── catalog-products/
│   │   │       │   └── [productId]/
│   │   │       │       └── route.ts
│   │   │       └── rules/
│   │   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   └── routinelle/
│   │       ├── onboarding/
│   │       │   ├── SkinQuestionnaireStep.tsx
│   │       │   └── SkinProfileSummary.tsx
│   │       ├── routine/
│   │       │   ├── RoutineStepCard.tsx
│   │       │   ├── ProductRecommendationCard.tsx
│   │       │   ├── IngredientRationalePanel.tsx
│   │       │   ├── FitBadge.tsx
│   │       │   └── NoSafeMatchState.tsx
│   │       ├── safety/
│   │       │   ├── GentleStartBanner.tsx
│   │       │   ├── RoutineConflictWarning.tsx
│   │       │   └── SafetyEscalationPanel.tsx
│   │       ├── check-in/
│   │       │   ├── CheckInForm.tsx
│   │       │   └── OutcomeSummary.tsx
│   │       └── trust/
│   │           └── NeutralityStatement.tsx
│   ├── lib/
│   │   ├── analytics/
│   │   │   ├── event-names.ts
│   │   │   └── track-event.ts
│   │   ├── catalog/
│   │   │   ├── catalog-repository.ts
│   │   │   ├── catalog-validation.ts
│   │   │   └── product-eligibility.ts
│   │   ├── domain/
│   │   │   ├── api-result.ts
│   │   │   ├── catalog.ts
│   │   │   ├── check-in.ts
│   │   │   ├── recommendation.ts
│   │   │   ├── routine.ts
│   │   │   ├── safety.ts
│   │   │   └── skin-profile.ts
│   │   ├── explanations/
│   │   │   ├── approved-copy.ts
│   │   │   └── explanation-builder.ts
│   │   ├── recommendation/
│   │   │   ├── recommendation-engine.ts
│   │   │   ├── scoring.ts
│   │   │   ├── routine-builder.ts
│   │   │   └── conflict-checks.ts
│   │   ├── safety/
│   │   │   ├── claim-guardrails.ts
│   │   │   ├── safety-guardrails.ts
│   │   │   └── symptom-triage.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── admin.ts
│   │   ├── validation/
│   │   │   ├── onboarding-schema.ts
│   │   │   ├── catalog-product-schema.ts
│   │   │   ├── check-in-schema.ts
│   │   │   └── safety-event-schema.ts
│   │   └── utils.ts
│   └── tests/
│       ├── fixtures/
│       │   ├── catalog-products.ts
│       │   ├── skin-profiles.ts
│       │   └── routines.ts
│       ├── recommendation/
│       │   └── recommendation-engine.test.ts
│       ├── safety/
│       │   └── safety-guardrails.test.ts
│       ├── catalog/
│       │   └── catalog-validation.test.ts
│       └── e2e/
│           ├── onboarding-to-routine.spec.ts
│           ├── check-in.spec.ts
│           └── safety-escalation.spec.ts
└── supabase/
    ├── config.toml
    ├── migrations/
    │   ├── 0001_initial_schema.sql
    │   ├── 0002_catalog_schema.sql
    │   ├── 0003_recommendation_schema.sql
    │   └── 0004_rls_policies.sql
    └── seed/
        ├── seed-catalog.sql
        └── seed-rules.sql
```

### Architectural Boundaries

**API Boundaries**

Consumer APIs:

- `/api/onboarding/submit`
- `/api/routines/generate`
- `/api/routines/save`
- `/api/check-ins/submit`
- `/api/product-clicks`
- `/api/safety-events/report`

Admin APIs:

- `/api/admin/catalog-products`
- `/api/admin/catalog-products/[productId]`
- `/api/admin/rules`

Rules:

- Consumer APIs must not allow catalog mutation.
- Admin APIs must require admin authorization.
- Routine generation must only return routines that passed safety/claim guardrails.
- Product click tracking must not influence ranking directly.

**Component Boundaries**

- `components/ui/`: generic shadcn primitives only.
- `components/routinelle/`: product-specific UI components.
- Components must not call Supabase directly.
- Components receive data from route/page-level loaders or client API calls.
- Business logic stays in `lib/`.

**Service Boundaries**

- `lib/recommendation/`: routine generation, scoring, conflict detection.
- `lib/safety/`: safety, symptom triage, claim guardrails.
- `lib/catalog/`: product data access, eligibility, validation.
- `lib/explanations/`: approved copy and explanation assembly.
- `lib/analytics/`: event naming and dispatch.
- `lib/supabase/`: database clients and Supabase helpers.

**Data Boundaries**

- Database schema uses `snake_case`.
- TypeScript domain models use `camelCase`.
- Mapping between database rows and domain models happens in repository/service code.
- UI components do not receive raw database rows.
- Generated routines store catalog/rule version IDs.

### Requirements to Structure Mapping

**User Onboarding & Profile Capture**

- Pages: `src/app/(consumer)/onboarding/page.tsx`
- Components: `components/routinelle/onboarding/`
- Validation: `lib/validation/onboarding-schema.ts`
- Domain: `lib/domain/skin-profile.ts`
- API: `src/app/api/onboarding/submit/route.ts`

**Routine Recommendation**

- API: `src/app/api/routines/generate/route.ts`
- Engine: `lib/recommendation/`
- Safety: `lib/safety/`
- Catalog: `lib/catalog/`
- Components: `components/routinelle/routine/`
- Tests: `tests/recommendation/`, `tests/safety/`

**Explainability & Trust**

- Components: `IngredientRationalePanel.tsx`, `NeutralityStatement.tsx`
- Explanation logic: `lib/explanations/`
- Safety copy: `lib/safety/claim-guardrails.ts`
- Domain: `lib/domain/recommendation.ts`

**Safety, Conflict Detection & Gentle Start**

- Components: `components/routinelle/safety/`
- Safety logic: `lib/safety/`
- Conflict checks: `lib/recommendation/conflict-checks.ts`
- API: `src/app/api/safety-events/report/route.ts`
- Tests: `tests/safety/`

**Outcome Tracking & Routine Adaptation**

- Page: `src/app/(consumer)/check-in/[routineId]/page.tsx`
- Components: `components/routinelle/check-in/`
- API: `src/app/api/check-ins/submit/route.ts`
- Validation: `lib/validation/check-in-schema.ts`
- Domain: `lib/domain/check-in.ts`

**Product Catalog & Recommendation Governance**

- Admin pages: `src/app/admin/catalog-products/`
- Admin APIs: `src/app/api/admin/catalog-products/`
- Catalog logic: `lib/catalog/`
- Validation: `lib/validation/catalog-product-schema.ts`
- Migrations: `supabase/migrations/`
- Tests: `tests/catalog/`

**Privacy, Consent & Account Data**

- Auth/session helpers: `lib/supabase/`
- Middleware: `src/middleware.ts`
- Account page: `src/app/(consumer)/account/page.tsx`
- RLS policies: `supabase/migrations/0004_rls_policies.sql`

**Analytics & Business Rules**

- Analytics: `lib/analytics/`
- Product click API: `src/app/api/product-clicks/route.ts`
- Commercial neutrality enforcement: recommendation engine must not read affiliate commission fields for ranking.

### Integration Points

**Internal Communication**

- Pages call server APIs or server actions.
- APIs call validation schemas, then domain services.
- Recommendation service calls catalog repository, safety service, and explanation builder.
- Admin routes call catalog validation before publish eligibility.

**External Integrations**

- Supabase Auth.
- Supabase PostgreSQL.
- Future affiliate/product links.
- Future AI explanation provider, constrained by approved metadata.
- Future analytics provider.
- Future retailer/catalog data feeds.

**Data Flow**

Routine generation flow:

```text
Questionnaire input
→ validation
→ normalized skin profile
→ eligible catalog products
→ recommendation rules
→ candidate routine
→ conflict checks
→ safety/claim guardrails
→ approved explanations
→ generated routine persisted with versions
→ display-ready routine returned
```

### File Organization Patterns

**Configuration Files**

- Root-level config for Next.js, TypeScript, ESLint, Tailwind/shadcn.
- `.env.example` documents required environment variables.
- `.env.local` is local only and not committed.
- Supabase config and migrations live under `supabase/`.

**Source Organization**

- Route UI lives in `src/app/`.
- Reusable UI lives in `src/components/`.
- Domain logic lives in `src/lib/`.
- Tests live in `src/tests/` unless local UI tests are intentionally co-located.

**Test Organization**

- Business logic tests are grouped by domain.
- E2E tests cover user-critical flows.
- Shared test fixtures are centralized.

**Asset Organization**

- Static images and icons live under `public/`.
- Product images should be URL-backed from catalog metadata where possible.
- Do not store user photos in MVP.

### Development Workflow Integration

**Development Server Structure**

- Next.js handles consumer, admin, and API routes in one app.
- Supabase local/hosted environment provides auth and database.
- Admin and consumer route groups are separated.

**Build Process Structure**

- Next.js builds the application.
- TypeScript validates shared domain code.
- Tests validate recommendation, safety, and catalog logic.
- E2E tests validate critical user journeys.

**Deployment Structure**

- Vercel deploys the Next.js app.
- Supabase hosts auth/database.
- Staging and production use separate Supabase projects.
- Migrations must be applied before features depending on new schema are released.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

The main decisions work together:

- Next.js App Router supports consumer UI, admin UI, and API routes in one product.
- Supabase Auth and PostgreSQL fit the account, profile, catalog, routine, check-in, and audit requirements.
- Tailwind + shadcn/ui aligns with the UX spec's themeable design-system direction.
- Server-side recommendation logic supports deterministic, traceable, safety-checked output.
- Versioned catalog/rule references support auditability and repeatability.

No direct contradictions found.

**Pattern Consistency:**

The implementation patterns support the architectural decisions:

- Database `snake_case` and TypeScript `camelCase` are clearly separated.
- API response wrappers are standardized.
- Recommendation pipeline order is explicit.
- Safety/claim guardrails are mandatory before routine display.
- Admin and consumer boundaries are separated.

**Structure Alignment:**

The project structure supports the architecture:

- Consumer flows live under `src/app/(consumer)/`.
- Admin catalog operations live under `src/app/admin/`.
- Business logic is separated under `src/lib/`.
- Tests are grouped around high-risk domains: recommendation, safety, and catalog validation.
- Supabase migrations and seed files have a clear home.

### Requirements Coverage Validation ✅

**Feature Coverage:**

All major feature areas from the PRD have architecture support:

- Onboarding and skin profile capture.
- AM/PM routine generation.
- Product catalog matching.
- Ingredient and skin-fit explanation.
- Routine conflict detection.
- Gentle Start and safety escalation.
- 7-day check-in.
- Catalog/admin governance.
- Privacy/account data.
- Analytics and commercial neutrality.

**Functional Requirements Coverage:**

The 61 FRs are covered at architecture level through:

- Consumer routes and APIs.
- Recommendation engine.
- Catalog module.
- Safety module.
- Explanation module.
- Admin catalog module.
- Supabase Auth/RLS.
- Analytics events.
- Versioned catalog/rule persistence.

**Non-Functional Requirements Coverage:**

NFRs are mostly covered:

- Performance: server-side recommendation and lightweight mobile UI support the p95 routine-generation target.
- Security/privacy: Supabase Auth, RLS, no service role exposure, deletion controls.
- Safety: mandatory guardrail layer.
- Determinism: rule-first engine and versioned catalog/rules.
- Traceability: generated routines store catalog/rule versions.
- Accessibility: UX spec and shadcn/Tailwind structure support WCAG AA-oriented implementation.
- Scalability: one-market MVP can expand to more markets through catalog/rule models.

### Implementation Readiness Validation ✅

**Decision Completeness:**

Core decisions are complete enough for implementation planning:

- Stack selected.
- Database/auth selected.
- API style selected.
- Recommendation pipeline selected.
- Project structure selected.
- Naming and response patterns selected.
- Deployment direction selected.

**Structure Completeness:**

The project tree is specific enough for AI agents to implement consistently.

**Pattern Completeness:**

The key conflict points are addressed:

- Naming.
- API formats.
- Error codes.
- Business logic placement.
- Recommendation pipeline.
- Analytics event naming.
- Admin/consumer separation.

### Gap Analysis Results

**Critical Gaps**

No critical architecture gaps found.

**Important Gaps**

- Detailed database schema is not yet specified field-by-field.
- Exact recommendation scoring rules are not yet specified.
- Exact product catalog validation requirements need schema-level definition.
- Exact safety/claim copy blocks need implementation detail.
- Epics and stories are not yet created, so implementation sequencing is not fully locked.

**Nice-to-Have Gaps**

- CI/CD details can be expanded later.
- Observability provider choice can be made later.
- Analytics provider choice can be made later.
- AI explanation provider choice can be deferred until explanation implementation.
- Admin audit-log detail can be refined during schema design.

### Validation Issues Addressed

No blocking issues found.

The main caution is that implementation must not start broadly from the architecture alone. The next workflow should create epics and stories so each implementation task has clear scope, acceptance criteria, and file ownership.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

Within the architecture workflow, the document is ready. For the broader BMad implementation process, the project still needs epics and stories before development work starts.

**Confidence Level:** High

**Key Strengths:**

- Trust, safety, and neutrality are reflected directly in architecture.
- Recommendation logic is deterministic and auditable.
- Safety guardrails are not optional UI behavior.
- Catalog governance is treated as a first-class system.
- Admin and consumer boundaries are clean.
- The stack is practical for MVP and future expansion.

**Areas for Future Enhancement:**

- Detailed database schema.
- Rule/scoring specification.
- CI/CD and observability details.
- Data retention policy details.
- Multi-market catalog expansion pattern.
- Optional photo progress architecture.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow this architecture exactly unless the architecture document is updated.
- Keep recommendation logic server-side.
- Do not display routines before safety/claim validation.
- Keep commercial metadata separate from ranking.
- Use the documented project structure.
- Use the documented naming and API response patterns.
- Add tests for recommendation, safety, and catalog validation changes.

**First Implementation Priority:**

Initialize the starter stack:

```bash
npx create-next-app@latest routinelle -e with-supabase
cd routinelle
npx shadcn@latest init
```

Then create the baseline project structure and Supabase schema/migration foundation.
