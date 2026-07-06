# Story 1.2: Build Mobile-First Public Shell and Sample Recommendation Preview

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a first-time visitor,
I want to view a trustworthy sample skincare recommendation preview before creating an account,
so that I can judge Routinelle's value before sharing personal skin data or signing up.

## Acceptance Criteria

1. Given a visitor opens Routinelle on mobile, when the public home page loads, then they see a clear skincare-guidance promise and an entry point to view a sample recommendation preview or start a routine.
2. The sample preview is visible before account creation or account commitment.
3. The sample preview clearly shows sample AM/PM routine steps such as cleanse, hydrate, protect, and optional support.
4. The sample preview includes at least one sample product-fit rationale or ingredient-fit explanation in Routinelle's neutral cosmetic-science voice.
5. The sample preview includes a neutrality cue explaining that recommendations are based on skin profile, routine role, ingredient fit, budget, and availability rather than brand payment.
6. The sample preview is clearly labeled as an example and does not imply it is personalized to the visitor.
7. The page is mobile-first and usable at 320px width.
8. The UI uses Tailwind/shadcn primitives and the Routinelle visual foundation.
9. The design avoids marketplace-style navigation before the first routine.
10. No signup is required before seeing the sample recommendation preview.

## Tasks / Subtasks

- [x] Replace the foundation-only home page with the Story 1.2 public shell. (AC: 1, 7, 8, 9, 10)
  - [x] Update `routinelle/src/app/page.tsx` to present the Routinelle promise, cosmetic guidance boundary, and clear primary actions.
  - [x] Include an entry point to view the sample preview on the same page without requiring auth or Supabase env vars.
  - [x] Include a "start routine" entry point that is visually available but does not implement the full onboarding flow.
  - [x] Keep the page mobile-first, responsive, and usable at 320px width.
  - [x] Avoid top-level marketplace navigation, brand/category menus, sale language, product grid browsing, or affiliate-style CTAs.

- [x] Build reusable Routinelle public-shell components. (AC: 2, 3, 4, 5, 6, 8)
  - [x] Add product-specific components under `routinelle/src/components/routinelle/` for the public shell and sample preview.
  - [x] Use existing shadcn primitives from `routinelle/src/components/ui/` where useful; do not put Routinelle-specific logic into `components/ui/`.
  - [x] Model the sample preview as static display data local to the public shell or a small local module; do not call Supabase, APIs, or recommendation services.
  - [x] Clearly label the preview as an example and not personalized.

- [x] Create the sample AM/PM routine preview content. (AC: 2, 3, 4, 5, 6)
  - [x] Show an AM routine with at least cleanse, hydrate, and protect steps.
  - [x] Show a PM routine with at least cleanse and hydrate steps, plus one optional support step.
  - [x] Include at least one neutral product-fit or ingredient-fit rationale in cosmetic-science language.
  - [x] Include a neutrality cue: recommendations are based on skin profile, routine role, ingredient fit, budget, and availability, not brand payment.
  - [x] Do not imply the sample is personalized or generated from the visitor's skin data.
  - [x] Keep all copy non-medical and avoid diagnosis or treatment claims.

- [x] Preserve Story 1.1 foundation and auth boundaries. (AC: 2, 9, 10)
  - [x] Do not require login, signup, Supabase configuration, cookies, or account state for the public shell or preview.
  - [x] Do not add public pages under protected routes.
  - [x] Do not undo Story 1.1 review fixes: pinned dependencies, webpack dev script, auth proxy scope, safe auth redirects, README, or env handling.
  - [x] Do not implement real onboarding, routine generation, catalog lookup, product ranking, save routine, product clicks, check-in, analytics, or account workflows.

- [x] Verify the public shell behavior and responsive constraints. (AC: 1-10)
  - [x] Run dependency install using the current project convention if needed: `npm --cache /private/tmp/routinelle-npm-cache ci --legacy-peer-deps`.
  - [x] Run `npm run lint`.
  - [x] Run `npm run build`.
  - [x] Run `npm run dev` and confirm the page renders at `http://localhost:3000` without Supabase env vars.
  - [x] Verify page content includes the Routinelle promise, sample/example label, AM/PM routine steps, ingredient/product-fit rationale, and neutrality cue.
  - [x] Verify at 320px width that text and controls do not overlap or require horizontal scrolling; use browser/manual inspection or an available screenshot tool if present.

## Dev Notes

### Scope Boundaries

- This story is a public, unauthenticated marketing/product-value shell plus static sample recommendation preview.
- This story must not implement the real questionnaire, skin profile capture, recommendation engine, product catalog matching, safety engine, routine persistence, account creation flow changes, product click tracking, check-in reminders, or analytics.
- The sample preview is a trust-building example only. It should show output quality and explanation style without claiming personalization.
- Story 2.1 owns the real onboarding questionnaire.
- Epic 4 owns deterministic routine generation.
- Epic 5 owns full explanation and trust mechanics.
- Story 1.3 owns Supabase auth/session boundary behavior beyond the starter foundation.

### Current Repository State

- Story 1.1 is complete and the app exists under `routinelle/`.
- The current public page is `routinelle/src/app/page.tsx`; it is a minimal foundation shell and should be replaced or refactored for this story.
- Product-specific components should live under `routinelle/src/components/routinelle/`.
- Generic shadcn components already available include `button`, `card`, `badge`, `checkbox`, `dropdown-menu`, `input`, and `label`.
- The app uses Next.js `16.2.6`, React `^19.0.0`, Tailwind CSS, shadcn/ui, and Supabase client utilities.
- `npm run dev` intentionally uses `next dev --webpack` because Story 1.1 found a local Next 16 Turbopack dev panic while compiling the auth proxy. Do not remove that workaround in this story.

### Previous Story Learnings

- Keep public routes unauthenticated. Story 1.1 review patched the auth proxy so only `/protected` and `/admin` are protected; do not broaden that logic.
- Keep the public shell independent from Supabase env vars. Visitors must see the sample preview even when `.env.local` is not configured.
- Avoid generated starter branding. Use Routinelle copy and visual language consistently.
- Do not add open-ended dependency ranges. If a new dependency is required, halt for approval; this story should be implementable with the existing stack.
- `npm audit` currently reports 2 moderate vulnerabilities in generated dependencies; do not run `npm audit fix --force` as part of this story.

### UX Requirements

- The UX spec says the first experience should prove value before asking for account creation or data commitment.
- Routinelle should feel like a calm clinical skincare consultant that gives fast, practical routine guidance.
- The page should communicate:
  - cosmetic skincare guidance, not medical diagnosis;
  - first routine is available before account commitment;
  - recommendations are based on skin needs and ingredient/product fit, not brand KPI or payment.
- Use a soft neutral foundation with restrained clinical-skincare accents. The existing colors in `src/app/page.tsx` can be reused or refined if the page stays calm, professional, and readable.
- Keep routine clarity before product browsing. Do not create a marketplace-style product grid or category navigation.
- Design for 375px first and verify 320px small mobile. Text must not overflow buttons/cards or overlap adjacent content.

### Suggested Content Shape

Use static sample content similar to this, but refine copy as needed:

- Example profile context: "Sample profile: oily-combination skin, hydration need, visible pores, cautious with irritation."
- AM routine:
  - Cleanse: gentle low-foam cleanser.
  - Hydrate: lightweight humectant serum or gel cream.
  - Protect: broad-spectrum daily sunscreen.
- PM routine:
  - Cleanse: remove sunscreen and daily residue.
  - Hydrate: barrier-supporting moisturizer.
  - Optional support: calming niacinamide or panthenol-focused step, introduced gradually.
- Example rationale: "Niacinamide can support the look of uneven tone and oiliness, while panthenol and glycerin help support hydration and barrier comfort. For irritation-prone skin, Routinelle would start gently rather than stacking strong actives."
- Neutrality cue: "Example recommendations are ranked by routine role, ingredient fit, budget, and local availability, not by brand payment."

### Technical Guidance

- Prefer a server component for `src/app/page.tsx` unless a specific interaction requires client state.
- Simple anchor links to a sample preview section are acceptable for this story.
- If adding a "Start routine" control before onboarding exists, use a non-breaking placeholder such as a link to a future route with disabled/coming-soon copy, or link to the preview section while clearly indicating onboarding comes next. Do not build the Story 2.1 flow.
- Use semantic HTML landmarks and headings.
- Avoid client-only effects unless necessary.
- Do not call Supabase from React components in this story.
- Do not add API routes for the sample preview.

### Testing Requirements

- Minimum required verification:
  - `npm run lint` passes.
  - `npm run build` passes.
  - `npm run dev` starts.
  - `curl` or browser check confirms the public page includes the sample/example label, AM/PM routine content, rationale, and neutrality cue.
  - Manual or screenshot inspection confirms 320px usability.
- No unit test framework is currently configured. Do not add a new test dependency without explicit approval.
- If an existing screenshot/browser tool is available, capture desktop and mobile views to check that no text overlaps and the preview is visible without signup.

### Implementation Anti-Patterns To Avoid

- Do not implement a product marketplace homepage.
- Do not show real brand/product recommendations unless backed by catalog governance in later epics.
- Do not imply the visitor has received a personalized recommendation before answering the questionnaire.
- Do not include medical diagnosis language or treatment claims.
- Do not add signup gates, modals, or account prompts before the sample preview.
- Do not create global state for static preview content.
- Do not modify auth proxy behavior unless required to preserve public access.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.2]
- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 1 objective and FR1/FR46 coverage]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Executive Summary and Core User Experience]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Experience Mechanics]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - User Journey Flow: First Routine Generation]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Component Boundaries]
- [Source: `_bmad-output/implementation-artifacts/1-1-initialize-routinelle-app-foundation.md` - Previous Story Learnings]

## Project Context Reference

No `project-context.md` file was found in the repository during story creation. Use the planning artifacts and Story 1.1 completion notes above as the authoritative project context.

## Story Completion Status

Context analysis completed - ready for development.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm --cache /private/tmp/routinelle-npm-cache ci --legacy-peer-deps` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run dev` started the public app at `http://localhost:3000`.
- `curl -s --max-time 15 http://localhost:3000 | rg -n "First routine before signup|Sample preview|AM routine|PM routine|Neutrality cue|not by brand payment|Niacinamide|not a personalized recommendation"` confirmed required public preview content.
- 320px usability checked by responsive class/source inspection; no screenshot/browser tool was configured for this run.

### Completion Notes List

- Replaced the foundation-only home page with a mobile-first Routinelle public shell.
- Added static AM/PM sample recommendation preview content with example labeling, profile context, routine steps, ingredient-fit rationale, and neutrality cue.
- Built product-specific public components under `src/components/routinelle/` using existing Tailwind/shadcn primitives.
- Kept the preview unauthenticated and static: no Supabase calls, API routes, auth gates, onboarding, catalog, recommendation engine, analytics, or account workflows were added.
- Preserved Story 1.1 foundation fixes including pinned dependencies, webpack dev script, auth proxy scope, safe auth/env handling, and starter branding cleanup.

### File List

- `_bmad-output/implementation-artifacts/1-2-build-mobile-first-public-shell-and-sample-recommendation-preview.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `routinelle/src/app/page.tsx`
- `routinelle/src/components/routinelle/public-shell.tsx`
- `routinelle/src/components/routinelle/sample-routine-preview.tsx`

### Change Log

- 2026-05-15: Built mobile-first public shell and static sample recommendation preview; marked Story 1.2 ready for review.
