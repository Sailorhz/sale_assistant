# Story 1.1: Initialize Routinelle App Foundation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a product team,
I want the Routinelle application initialized with the approved starter stack,
so that all future stories build on the same technical foundation.

## Acceptance Criteria

1. Given the architecture specifies Next.js, TypeScript, Supabase, Tailwind CSS, and shadcn/ui, when the project is initialized, then the app uses the selected starter stack and follows the architecture project structure.
2. The baseline folders exist for consumer routes, admin routes, UI components, domain logic, validation, Supabase utilities, and tests.
3. `.env.example` documents required environment variables without exposing secrets.
4. The app can run locally with a visible Routinelle landing shell.

## Tasks / Subtasks

- [x] Scaffold the Routinelle Next.js app foundation. (AC: 1)
  - [x] Create the app under `routinelle/` from the project root, matching the architecture's top-level app directory.
  - [x] Use the Supabase `with-supabase` Next.js starter or equivalent output: Next.js App Router, TypeScript, Tailwind CSS, and cookie-based Supabase auth foundation.
  - [x] Ensure the app uses `src/` structure and the `@/*` alias points to `./src/*`.
  - [x] Initialize shadcn/ui in the app and commit the generated `components.json` and UI utility setup.

- [x] Create the architecture-aligned baseline directory structure. (AC: 1, 2)
  - [x] Create route groups and route folders: `src/app/(consumer)`, `src/app/admin`, and `src/app/api`.
  - [x] Create component folders: `src/components/ui` and `src/components/routinelle`.
  - [x] Create domain/service folders: `src/lib/domain`, `src/lib/recommendation`, `src/lib/safety`, `src/lib/catalog`, `src/lib/explanations`, `src/lib/analytics`, `src/lib/supabase`, and `src/lib/validation`.
  - [x] Create `src/tests/fixtures`, `src/tests/recommendation`, `src/tests/safety`, `src/tests/catalog`, and `src/tests/e2e`.
  - [x] Create `supabase/migrations` and `supabase/seed`.
  - [x] Add lightweight placeholder files such as `.gitkeep` only where needed to preserve empty directories.

- [x] Add environment documentation without secrets. (AC: 3)
  - [x] Ensure `.env.local` is ignored.
  - [x] Ensure `.env.example` documents Supabase URL/key placeholders and any future environment categories without real values.
  - [x] Use current Supabase public env names: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
  - [x] Do not expose service-role, secret, or admin keys in client-accessible variables.

- [x] Provide a visible local landing shell. (AC: 4)
  - [x] Implement `src/app/page.tsx` as a simple Routinelle landing shell that confirms the app runs.
  - [x] Keep this shell intentionally minimal; Story 1.2 owns the full public shell and sample recommendation preview.
  - [x] Use Tailwind styling and, if installed, a minimal shadcn/ui component to prove UI setup.
  - [x] Keep copy cosmetic-skincare oriented and non-medical.

- [x] Add baseline development verification. (AC: 1, 4)
  - [x] Verify install succeeds with the selected package manager.
  - [x] Verify the development server starts locally.
  - [x] Verify `lint` and `build` scripts exist and run, or document any generated-starter limitation directly in the completion notes.
  - [x] If a CI workflow is added, keep it minimal: install, lint, build.

### Review Findings

- [x] [Review][Patch] Align Next.js package versions and avoid open-ended `latest` dependencies [routinelle/package.json:14]
- [x] [Review][Patch] Prevent auth proxy from redirecting future API routes to HTML login pages [routinelle/src/lib/supabase/proxy.ts:50]
- [x] [Review][Patch] Scope auth proxy protection so future public consumer routes do not redirect to login [routinelle/src/lib/supabase/proxy.ts:50]
- [x] [Review][Patch] Do not silently bypass route protection when Supabase env vars are missing outside development [routinelle/src/lib/supabase/proxy.ts:12]
- [x] [Review][Patch] Route signup email confirmation through the OTP exchange endpoint [routinelle/src/components/sign-up-form.tsx:46]
- [x] [Review][Patch] Sanitize auth confirmation `next` redirects to same-origin relative paths [routinelle/src/app/auth/confirm/route.ts:10]
- [x] [Review][Patch] Guard browser Supabase client creation when public env vars are missing [routinelle/src/lib/supabase/client.ts:3]
- [x] [Review][Patch] Declare the Node engine expected by the Next.js 16 app foundation [routinelle/package.json:1]
- [x] [Review][Patch] Add or remove the shadcn hooks alias so future generated blocks do not import a missing path [routinelle/components.json:18]
- [x] [Review][Patch] Replace generated Supabase starter README with Routinelle setup instructions [routinelle/README.md:1]
- [x] [Review][Patch] Remove generated Supabase starter branding from protected layout before it leaks into later account routes [routinelle/src/app/protected/layout.tsx:20]

## Dev Notes

### Scope Boundaries

- This story is foundation only.
- Do not implement real onboarding, sample recommendation preview, authentication UX, admin catalog workflows, recommendation logic, safety logic, product data, or Supabase schema beyond generated starter basics.
- Story 1.2 owns the public shell and sample recommendation preview.
- Story 1.3 owns Supabase auth/session behavior.
- Epic 3 owns catalog schema and product governance.
- Epic 4 owns recommendation domain models and routine persistence.

### Current Repository State

- The current repository contains planning and implementation artifacts, not the application code.
- Create the app in `routinelle/` under the project root to match the architecture document's project tree.
- Existing untracked `_bmad-output/` artifacts are planning outputs; do not delete or reorganize them.
- No prior implementation story exists, so there are no previous-story code patterns to preserve.

### Technical Requirements

- Use Next.js App Router with TypeScript.
- Use Supabase Auth/PostgreSQL foundation via the Supabase Next.js starter.
- Use Tailwind CSS.
- Initialize shadcn/ui as the UI primitive foundation.
- Keep raw Supabase access inside `src/lib/supabase/`, not UI components.
- Use `src/components/ui/` for shadcn primitives and `src/components/routinelle/` for product-specific components.
- Use database `snake_case` and TypeScript `camelCase` conventions in any placeholder models or examples.
- Do not add recommendation business logic to React components.

### Architecture Compliance

Follow the architecture's selected starter and structure:

```bash
npx create-next-app@latest routinelle -e with-supabase
cd routinelle
npx shadcn@latest init
```

If the generated Supabase starter does not create the exact `src/` layout, adjust the generated app to match the architecture tree before marking the story complete.

The expected top-level app structure is:

```text
routinelle/
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json
├── .env.example
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── tests/
└── supabase/
    ├── migrations/
    └── seed/
```

### Library / Framework Requirements

- Supabase's current Next.js quickstart documents the `with-supabase` template as preconfigured with cookie-based Auth, TypeScript, and Tailwind CSS. It also documents `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for `.env.local`.
- Supabase notes that older `anon` and `service_role` keys work until the end of 2026, but recommends publishable and secret keys for new projects. Use publishable-key naming in `.env.example`; do not place secret/service-role keys in client variables.
- Next.js `create-next-app` supports TypeScript, Tailwind CSS, App Router, `src/` directory, npm selection, and `@/*` import alias options. Use these options when the Supabase starter needs explicit alignment with the architecture.
- shadcn/ui's current Next.js docs support initializing shadcn in an existing Next.js project with `npx shadcn@latest init` or package-manager equivalents, and note that `--src-dir` maps the `@/*` alias to `./src/*`.

### File Structure Requirements

Create these directories now if missing:

```text
routinelle/src/app/(consumer)
routinelle/src/app/admin
routinelle/src/app/api
routinelle/src/components/ui
routinelle/src/components/routinelle
routinelle/src/lib/analytics
routinelle/src/lib/catalog
routinelle/src/lib/domain
routinelle/src/lib/explanations
routinelle/src/lib/recommendation
routinelle/src/lib/safety
routinelle/src/lib/supabase
routinelle/src/lib/validation
routinelle/src/tests/fixtures
routinelle/src/tests/recommendation
routinelle/src/tests/safety
routinelle/src/tests/catalog
routinelle/src/tests/e2e
routinelle/supabase/migrations
routinelle/supabase/seed
```

Use `.gitkeep` only for empty directories that would otherwise not be tracked. Do not create placeholder implementation files that imply completed domain behavior.

### Testing Requirements

- For this story, minimum verification is:
  - dependency install succeeds,
  - local dev server starts,
  - app renders a visible Routinelle landing shell,
  - lint runs,
  - build runs or any starter-generated blocker is documented.
- Do not write fake unit tests for unimplemented recommendation, safety, or catalog behavior.
- If adding a CI workflow, keep it aligned with the available scripts in `package.json`.

### Implementation Anti-Patterns To Avoid

- Do not initialize the app directly in the repository root; use `routinelle/`.
- Do not commit `.env.local` or real Supabase credentials.
- Do not expose service-role or secret keys to the client.
- Do not create a custom design system instead of shadcn/ui + Tailwind foundation.
- Do not implement Story 1.2 preview content beyond a minimal landing shell.
- Do not build recommendation, catalog, safety, or admin behavior early.
- Do not call Supabase from UI components outside `src/lib/supabase/` helper boundaries.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Starter Template Evaluation]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Implementation Patterns & Consistency Rules]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Executive Summary and Core User Experience]
- [Source: Next.js Docs, "create-next-app": https://nextjs.org/docs/app/api-reference/cli/create-next-app]
- [Source: Supabase Docs, "Use Supabase with Next.js": https://supabase.com/docs/guides/getting-started/quickstarts/nextjs]
- [Source: shadcn/ui Docs, "Next.js": https://ui.shadcn.com/docs/installation/next]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts above as the authoritative project context.

## Story Completion Status

Ultimate context engine analysis completed - comprehensive developer guide created.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npx create-next-app@latest routinelle -e with-supabase --use-npm` downloaded the Supabase starter but initial install failed on npm peer dependency resolution.
- `npm --cache /private/tmp/routinelle-npm-cache install --legacy-peer-deps` installed dependencies successfully after the home npm cache showed permission errors.
- `npm run lint` initially failed on generated Tailwind `require()` usage; fixed by using an ESM import.
- `npm run build` initially failed on Google Fonts network access; fixed by removing the generated `next/font/google` dependency from the root layout.
- `npm --cache /private/tmp/routinelle-npm-cache ci --legacy-peer-deps` verified clean lockfile install.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started at `http://localhost:3000`.
- `curl -s http://localhost:3000 | rg -n "Routinelle|Foundation ready|Cleanse"` confirmed visible landing shell content.
- Review patch verification: `npm --cache /private/tmp/routinelle-npm-cache ci --legacy-peer-deps`, `npm run lint`, `npm run build`, `npm run dev`, and `curl -s --max-time 15 http://localhost:3000 | rg -n "Routinelle|Foundation ready|Cleanse"` passed after patches.

### Completion Notes List

- Created the `routinelle/` Next.js App Router app from the Supabase starter with TypeScript, Tailwind CSS, shadcn/ui components, and Supabase SSR utilities.
- Moved generated app code into the required `src/` layout and updated `@/*` to resolve to `./src/*`.
- Added architecture baseline folders for consumer routes, admin routes, API routes, product components, domain/service libraries, validation, tests, and Supabase migrations/seed.
- Replaced the starter home page with a minimal Routinelle landing shell using Tailwind and shadcn/ui while avoiding Story 1.2 preview scope.
- Documented public Supabase environment variables in `.env.example` without secrets; `.env.local` remains ignored.
- CI workflow was not added in this story; local install, lint, build, dev server, and HTML content checks passed.
- `npm audit` reports 2 moderate vulnerabilities in the generated dependency tree; not auto-fixed because npm recommends a breaking `--force` path.
- Code review patches applied: pinned dependency versions, aligned Next ESLint config, added Node engine, scoped auth proxy protection, hardened Supabase env handling, sanitized auth confirmation redirects, routed signup confirmations through `/auth/confirm`, added the shadcn hooks path, replaced starter README content, and removed starter branding from protected routes.
- `npm run dev` uses `next dev --webpack` because Next 16 Turbopack dev panicked while compiling the auth proxy in this local environment; production `npm run build` still passes through the standard Next build pipeline.

### Change Log

- 2026-05-14: Initialized Routinelle app foundation and marked Story 1.1 ready for review.
- 2026-05-14: Applied all code review patch findings and marked Story 1.1 done.

### File List

- `_bmad-output/implementation-artifacts/1-1-initialize-routinelle-app-foundation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/.env.example`
- `routinelle/.gitignore`
- `routinelle/README.md`
- `routinelle/components.json`
- `routinelle/eslint.config.mjs`
- `routinelle/next-env.d.ts`
- `routinelle/next.config.ts`
- `routinelle/package-lock.json`
- `routinelle/package.json`
- `routinelle/postcss.config.mjs`
- `routinelle/proxy.ts`
- `routinelle/src/app/(consumer)/.gitkeep`
- `routinelle/src/app/admin/.gitkeep`
- `routinelle/src/app/api/.gitkeep`
- `routinelle/src/app/auth/confirm/route.ts`
- `routinelle/src/app/auth/error/page.tsx`
- `routinelle/src/app/auth/forgot-password/page.tsx`
- `routinelle/src/app/auth/login/page.tsx`
- `routinelle/src/app/auth/sign-up-success/page.tsx`
- `routinelle/src/app/auth/sign-up/page.tsx`
- `routinelle/src/app/auth/update-password/page.tsx`
- `routinelle/src/app/favicon.ico`
- `routinelle/src/app/globals.css`
- `routinelle/src/app/layout.tsx`
- `routinelle/src/app/opengraph-image.png`
- `routinelle/src/app/page.tsx`
- `routinelle/src/app/protected/layout.tsx`
- `routinelle/src/app/protected/page.tsx`
- `routinelle/src/app/twitter-image.png`
- `routinelle/src/components/auth-button.tsx`
- `routinelle/src/components/deploy-button.tsx`
- `routinelle/src/components/env-var-warning.tsx`
- `routinelle/src/components/forgot-password-form.tsx`
- `routinelle/src/components/hero.tsx`
- `routinelle/src/components/login-form.tsx`
- `routinelle/src/components/logout-button.tsx`
- `routinelle/src/components/next-logo.tsx`
- `routinelle/src/components/routinelle/.gitkeep`
- `routinelle/src/components/sign-up-form.tsx`
- `routinelle/src/components/supabase-logo.tsx`
- `routinelle/src/components/theme-switcher.tsx` (deleted)
- `routinelle/src/components/tutorial/code-block.tsx`
- `routinelle/src/components/tutorial/connect-supabase-steps.tsx`
- `routinelle/src/components/tutorial/fetch-data-steps.tsx`
- `routinelle/src/components/tutorial/sign-up-user-steps.tsx`
- `routinelle/src/components/tutorial/tutorial-step.tsx`
- `routinelle/src/components/ui/badge.tsx`
- `routinelle/src/components/ui/button.tsx`
- `routinelle/src/components/ui/card.tsx`
- `routinelle/src/components/ui/checkbox.tsx`
- `routinelle/src/components/ui/dropdown-menu.tsx`
- `routinelle/src/components/ui/input.tsx`
- `routinelle/src/components/ui/label.tsx`
- `routinelle/src/components/update-password-form.tsx`
- `routinelle/src/hooks/.gitkeep`
- `routinelle/src/lib/analytics/.gitkeep`
- `routinelle/src/lib/catalog/.gitkeep`
- `routinelle/src/lib/domain/.gitkeep`
- `routinelle/src/lib/explanations/.gitkeep`
- `routinelle/src/lib/recommendation/.gitkeep`
- `routinelle/src/lib/safety/.gitkeep`
- `routinelle/src/lib/supabase/client.ts`
- `routinelle/src/lib/supabase/proxy.ts`
- `routinelle/src/lib/supabase/server.ts`
- `routinelle/src/lib/utils.ts`
- `routinelle/src/lib/validation/.gitkeep`
- `routinelle/src/tests/catalog/.gitkeep`
- `routinelle/src/tests/e2e/.gitkeep`
- `routinelle/src/tests/fixtures/.gitkeep`
- `routinelle/src/tests/recommendation/.gitkeep`
- `routinelle/src/tests/safety/.gitkeep`
- `routinelle/supabase/migrations/.gitkeep`
- `routinelle/supabase/seed/.gitkeep`
- `routinelle/tailwind.config.ts`
- `routinelle/tsconfig.json`
