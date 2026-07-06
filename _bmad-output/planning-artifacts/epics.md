---
stepsCompleted: [1, 2, 3, 4]
lastStep: 4
status: 'complete'
completedAt: '2026-05-13'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# sale_assistant - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for sale_assistant, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can view a sample skincare recommendation preview before account creation.

FR2: Users can complete a short onboarding questionnaire to provide skin type, concerns, sensitivity, budget, and local market.

FR3: Users can indicate acne-prone, sensitive, irritated, or barrier-damaged skin conditions as part of onboarding.

FR4: Users can provide optional current routine information for conflict detection.

FR5: Users can skip current routine entry and still receive a complete starter routine.

FR6: Users can review a generated skin profile summary before or alongside the routine.

FR7: Users can update their skin profile inputs after the first routine is generated.

FR8: Users can receive a complete AM/PM starter routine based on their profile.

FR9: Users can receive recommendations for core routine steps: cleanser, moisturizer, sunscreen, and optional acne/support step when appropriate.

FR10: Users can receive 2-3 product options per routine step where safe catalog matches exist.

FR11: Users can receive a clear "no safe match" state when the system cannot confidently recommend a product.

FR12: Users can receive budget-aware product recommendations.

FR13: Users can receive recommendations grounded in local market availability.

FR14: Users can save a generated routine.

FR15: Users can access saved routine details after initial generation.

FR16: Users can view plain-language explanations for why each routine step exists.

FR17: Users can view ingredient and skin-fit rationale for each recommended product in a neutral, cosmetic-science-oriented voice.

FR18: Users can view cautions or reasons why certain products or ingredient types may not fit their profile.

FR19: Users can see language explaining that recommendations are neutral and not altered by brand payment.

FR20: Users can distinguish product recommendation logic from product purchase links or affiliate relationships.

FR21: Users can view conservative, non-diagnostic safety explanations when relevant.

FR22: The system can detect known routine conflicts before displaying a routine.

FR23: The system can flag duplicate or overly aggressive active ingredient patterns.

FR24: The system can adjust recommendations for sensitive, irritated, acne-prone, or barrier-damaged profiles.

FR25: The system can provide a Gentle Start routine variant for sensitive or barrier-damaged users.

FR26: Users can receive patch-test guidance when new products or active ingredients are recommended.

FR27: Users can receive conservative professional-care guidance for severe, persistent, worsening, or high-risk symptoms.

FR28: The system can block diagnosis and treatment claims from user-facing recommendation copy.

FR29: The system can prevent display of a routine that fails safety validation.

FR30: Users can receive a 7-day check-in after routine generation.

FR31: Users can report routine adherence during check-in.

FR32: Users can report outcomes such as dryness, redness, burning, acne change, hydration, and irritation.

FR33: The system can update user profile signals based on reported outcomes.

FR34: Users can receive adjusted guidance or product alternatives based on check-in outcomes.

FR35: The system can log irritation, worsening, confusion, or unsafe-use reports as safety signals.

FR36: Admin users can create and maintain product records.

FR37: Admin users can define product category, routine step, INCI list, key ingredients, function tags, caution tags, verified claims, price, size, cost-per-unit where available, availability, and last verified date.

FR38: The system can validate required product metadata before a product becomes recommendation-eligible.

FR39: Admin users can publish, unpublish, or flag products for review.

FR40: Admin users can mark products with formula-change or data-freshness flags.

FR41: The system can exclude products from recommendations based on missing metadata, unsafe fit, or unavailable status.

FR42: The system can trace recommendations, warnings, and explanations to product attributes, rules, source notes, or approved copy blocks.

FR43: Admin users can manage recommendation rules, product tags, caution tags, and approved explanation copy.

FR44: The system can preserve catalog/rule version context for generated recommendations.

FR45: Users can create an account to save routines and track outcomes.

FR46: Users can use the first routine experience before mandatory account commitment where product flow allows.

FR47: Users can consent to collection of profile and routine data.

FR48: Users can view what personal data is used for recommendations.

FR49: Users can delete profile data.

FR50: Users can delete optional photos if photo progress is added later.

FR51: The system can keep photo progress optional and separate from core recommendation requirements.

FR52: The system can avoid requiring precise location, camera, or photo permissions for core MVP recommendations.

FR53: The system can track onboarding completion.

FR54: The system can track routine generation completion.

FR55: The system can track routine saves.

FR56: The system can track product link clicks.

FR57: The system can track 7-day check-in completion.

FR58: The system can track fallback/no-safe-match states.

FR59: The system can track safety events and professional-care guidance triggers.

FR60: The system can enforce a recommendation firewall so commercial partnerships do not alter personalized ranking.

FR61: Admin users can identify catalog coverage gaps by routine step, priority profile, budget band, and local market.

### NonFunctional Requirements

NFR1: Users should be able to complete onboarding and receive a starter routine in under 5 minutes for at least 80% of completed onboarding sessions.

NFR2: Routine generation should complete within 2 seconds p95 after onboarding submission, excluding third-party retailer redirects.

NFR3: Core mobile pages should load quickly enough to avoid onboarding abandonment on normal mobile connections.

NFR4: Admin catalog operations should support efficient entry and review of product metadata without blocking consumer recommendation flows.

NFR5: The app should remain usable on modern iOS Safari and Android Chrome mobile browsers.

NFR6: User profile data, routine data, reaction data, and optional photo data must be protected in transit and at rest.

NFR7: Access to admin/catalog tools must be restricted to authorized internal users.

NFR8: Users must be able to understand what personal data is used for recommendations.

NFR9: Users must be able to delete profile data.

NFR10: Optional photos, if added later, must be deletable and must not be required for core recommendations.

NFR11: The product must minimize sensitive data collection and avoid requiring precise location, camera, or photo permissions for MVP routine generation.

NFR12: Data collection and consent flows must support GDPR-oriented privacy expectations for a France/EU launch.

NFR13: 100% of displayed routines must pass safety and claim-guardrail checks before display.

NFR14: The system must support deterministic recommendations for the same user profile and same catalog/rule version.

NFR15: The system must support a "no safe match" state rather than forcing recommendations when confidence or safety criteria are not met.

NFR16: User-facing recommendation copy must avoid diagnosis, treatment, cure, prevention, or disease-identification claims.

NFR17: Recommendation explanations must be traceable to product attributes, rules, approved copy, or source notes.

NFR18: Safety events such as irritation, worsening symptoms, confusion, or unsafe-use reports must be logged for review.

NFR19: Consumer-facing MVP screens should follow WCAG 2.1 AA-oriented design practices where feasible.

NFR20: Onboarding, routine cards, warnings, and product explanations must be readable on mobile screens without relying only on color to convey meaning.

NFR21: Safety and warning language must be written in clear, calm, plain language.

NFR22: Recommendation copy must use a neutral, precise, cosmetic-science-oriented voice and avoid influencer-style hype or sales pressure.

NFR23: Interactive controls must be usable on touch screens and support common mobile accessibility patterns.

NFR24: The MVP architecture should support expansion from one curated market catalog to additional markets without redesigning core profile, product, or recommendation models.

NFR25: The product catalog model should support at least 300 curated products for the first market and expansion to larger catalogs later.

NFR26: Recommendation logic should support additional skin concerns, budget bands, and product categories without requiring a full system rewrite.

NFR27: Analytics should support cohort tracking for onboarding, routine saves, product clicks, check-ins, fallback states, and safety events.

NFR28: Product records must pass required metadata validation before becoming recommendation-eligible.

NFR29: Product catalog data must include last verified date, verified claim fields, cost-per-unit where available, and formula-change or freshness flags.

NFR30: Product links and local availability data must be able to handle stale or unavailable products without breaking the user journey.

NFR31: External retailer or affiliate integrations must not be required for the MVP to generate a routine.

NFR32: Recommendation ranking must remain independent from affiliate, brand, or retailer commercial relationships.

NFR33: Admin users should be able to update product metadata, tags, availability, and rule inputs without requiring app redeployment where feasible.

NFR34: Recommendation rules, catalog versions, and explanation copy should be auditable.

NFR35: Claim-guardrail copy should be centrally managed so unsafe wording can be corrected consistently.

NFR36: The system should support testing of recommendation rules, fixture profiles, catalog validation, and claim-language checks.

### Additional Requirements

AR1: Initialize the implementation with the selected starter stack: Next.js App Router, TypeScript, Supabase, Tailwind CSS, and shadcn/ui.

AR2: Use Supabase PostgreSQL and Supabase Auth as the MVP data/auth foundation.

AR3: Use Next.js route handlers or server actions for application operations including onboarding submission, routine generation, routine save, product click tracking, check-in submission, safety-event reporting, and admin catalog operations.

AR4: Implement the recommendation engine server-side; UI components must not contain recommendation business logic.

AR5: Implement a deterministic recommendation pipeline: validate input, normalize profile, load eligible catalog, load active rule version, generate candidates, score options, run conflict checks, run safety/claim guardrails, attach approved explanations, persist routine with versions, and return display-ready data.

AR6: Implement safety and claim guardrails as a mandatory pre-display step for every generated routine.

AR7: Preserve catalog version and rule version context on every generated routine.

AR8: Keep affiliate, retailer, and commercial metadata separate from personalized ranking logic.

AR9: Use PostgreSQL `snake_case` table/column naming and TypeScript `camelCase` domain models.

AR10: Use standard API result wrappers with `{ ok: true, data, meta }` and `{ ok: false, error, meta }`.

AR11: Use typed error codes including `VALIDATION_ERROR`, `AUTH_REQUIRED`, `PERMISSION_DENIED`, `NO_SAFE_MATCH`, `SAFETY_BLOCKED`, `CATALOG_UNAVAILABLE`, `PRODUCT_UNAVAILABLE`, `RATE_LIMITED`, and `SYSTEM_ERROR`.

AR12: Keep raw Supabase access inside repository/service code, not inside UI components.

AR13: Implement admin/catalog routes separately from consumer routes and protect admin mutations with authorization checks.

AR14: Implement Supabase migrations from the start, including baseline schema, catalog schema, recommendation schema, and RLS policies.

AR15: Use focused tests for recommendation rules, safety guardrails, catalog validation, and core E2E flows.

AR16: Create initial project structure aligned to architecture: `src/app`, `src/components/ui`, `src/components/routinelle`, `src/lib/domain`, `src/lib/recommendation`, `src/lib/safety`, `src/lib/catalog`, `src/lib/explanations`, `src/lib/analytics`, `src/lib/supabase`, `src/lib/validation`, and `supabase/migrations`.

AR17: Implement analytics events with lowercase dot-separated names and avoid sending sensitive free-text symptom details.

AR18: Use separate local, staging, and production Supabase environments.

AR19: Deploy initial Next.js application to Vercel with Supabase hosted backend unless later architectural changes are approved.

AR20: Treat detailed database schema, exact scoring rules, catalog validation rules, and safety copy blocks as implementation stories that refine the validated architecture.

### UX Design Requirements

UX-DR1: Implement a mobile-first responsive web/PWA experience optimized for modern iOS Safari and Android Chrome.

UX-DR2: Implement sample recommendation preview before account creation or account commitment.

UX-DR3: Implement a 7-8 question onboarding flow with one major question per screen and visible progress.

UX-DR4: Include `not sure` options where users may not know their skin type, concern, sensitivity, or product details.

UX-DR5: Allow users to skip current routine entry without blocking routine generation.

UX-DR6: Implement single-choice cards, multi-select chips, progress indicator, back/continue actions, and concise helper text for questionnaire screens.

UX-DR7: Implement Skin Profile Summary showing skin type, concerns, sensitivity level, budget, market, and routine risk flags.

UX-DR8: Implement AM/PM routine display with clear routine step order, product role labels, frequency labels, and mobile-scannable cards.

UX-DR9: Implement Routine Step Card with recommended, optional, caution, no-safe-match, and already-owned states.

UX-DR10: Implement Product Recommendation Card with brand, product name, category, price band, availability, fit badges, key ingredients, and retailer CTA.

UX-DR11: Implement Fit Badge variants such as barrier-friendly, low irritation risk, budget fit, locally available, acne-prone fit, hydration support, and caution/avoid.

UX-DR12: Implement expandable Ingredient Rationale Panel with collapsed summary and expanded plain-language explanation.

UX-DR13: Implement Routine Conflict Warning with mild caution, strong caution, and block-recommendation variants.

UX-DR14: Implement Gentle Start Banner explaining why a conservative routine is recommended for sensitive or barrier-risk users.

UX-DR15: Implement No Safe Match State that explains why no product was recommended and gives the user a clear next action.

UX-DR16: Implement Safety Escalation Panel for serious symptoms with conservative non-diagnostic professional-care guidance.

UX-DR17: Implement 7-Day Check-In Card/Form capturing routine adherence, dryness, redness, burning, acne change, hydration, irritation, and suspected product discomfort.

UX-DR18: Implement Outcome Summary and Updated Recommendation Notice after check-in submission.

UX-DR19: Implement Neutrality Statement near recommendation results explaining that recommendations are based on profile, routine role, ingredient fit, budget, and availability rather than brand payments.

UX-DR20: Implement product explanations using progressive disclosure: routine first, explanation second, deeper science third.

UX-DR21: Implement feedback levels for success, info, caution, and serious/stop recommendation; do not use red for mild caution.

UX-DR22: Implement primary/secondary/destructive button hierarchy with one primary action per screen.

UX-DR23: Mark external retailer/product links clearly and prevent product click CTAs from overpowering save routine or safety guidance.

UX-DR24: Implement loading messages for routine generation such as checking profile, matching steps, reviewing irritation risk, and preparing routine.

UX-DR25: Implement empty/fallback states for no safe match, unavailable product, incomplete catalog, and missing answer.

UX-DR26: Implement search/filter support for product selection by budget, availability, routine step, skin concern, sensitivity, ingredient preference, natural/bio, cruelty-free, dermatologist-tested, and brand.

UX-DR27: Implement mobile breakpoints and layout behavior: single-column below 768px, two-column product/routine layouts from tablet upward only when clarity improves.

UX-DR28: Ensure the app remains usable at 320px width and is designed first for 375px mobile width.

UX-DR29: Use accessible form controls, labels, visible focus states, keyboard navigation, and screen-reader labels for badges, warnings, product links, and progress indicators.

UX-DR30: Meet WCAG AA-oriented contrast and touch-target expectations: readable text, non-color-only warnings, and minimum 44x44px tap targets.

UX-DR31: Keep serious symptom guidance plain-text readable and non-diagnostic.

UX-DR32: Avoid requiring camera/photo permissions in MVP onboarding or core routine generation.

UX-DR33: Use Tailwind CSS plus shadcn/ui primitives and a custom Routinelle component layer.

UX-DR34: Apply visual foundation: soft neutral base, restrained sage/botanical primary, mineral blue secondary, amber caution, and controlled red only for serious states.

UX-DR35: Use cards only for routine steps, product options, alerts, and check-in blocks; avoid nested card layouts.

UX-DR36: Keep onboarding and routine reveal free from marketplace-style navigation before the first routine.

### FR Coverage Map

FR1: Epic 1 - sample recommendation preview before account creation
FR2: Epic 2 - short onboarding questionnaire
FR3: Epic 2 - acne/sensitive/irritated/barrier-damaged profile inputs
FR4: Epic 2 - optional current routine entry
FR5: Epic 2 - skip current routine entry
FR6: Epic 2 - skin profile summary
FR7: Epic 2 - update profile inputs
FR8: Epic 4 - complete AM/PM routine
FR9: Epic 4 - core routine step recommendations
FR10: Epic 4 - 2-3 product options per step
FR11: Epic 4 - no-safe-match state
FR12: Epic 4 - budget-aware recommendations
FR13: Epic 4 - local market recommendations
FR14: Epic 6 - save generated routine
FR15: Epic 6 - access saved routine details
FR16: Epic 5 - explanation for routine steps
FR17: Epic 5 - ingredient and skin-fit rationale
FR18: Epic 5 - cautions and misfit reasons
FR19: Epic 5 - neutrality language
FR20: Epic 5 - distinguish recommendation logic from links
FR21: Epic 5 - conservative safety explanations
FR22: Epic 4 - routine conflict detection
FR23: Epic 4 - duplicate/aggressive active flags
FR24: Epic 4 - sensitive/acne/barrier-adjusted recommendations
FR25: Epic 4 - Gentle Start routine variant
FR26: Epic 4 - patch-test guidance
FR27: Epic 4 - professional-care guidance trigger
FR28: Epic 4 - block diagnosis/treatment claims
FR29: Epic 4 - prevent unsafe routine display
FR30: Epic 6 - 7-day check-in
FR31: Epic 6 - adherence reporting
FR32: Epic 6 - outcome reporting
FR33: Epic 6 - update profile signals from outcomes
FR34: Epic 6 - adjusted guidance/product alternatives
FR35: Epic 7 - safety signal logging
FR36: Epic 3 - create and maintain product records
FR37: Epic 3 - product metadata fields
FR38: Epic 3 - metadata validation before eligibility
FR39: Epic 3 - publish/unpublish/flag products
FR40: Epic 3 - formula-change/data-freshness flags
FR41: Epic 3 - exclude ineligible products
FR42: Epic 5 - trace recommendations/explanations to attributes/rules/copy
FR43: Epic 3 - manage rules, tags, caution tags, approved copy
FR44: Epic 3 - preserve catalog/rule version context
FR45: Epic 1 - account creation
FR46: Epic 1 - first routine before mandatory account commitment
FR47: Epic 1 - consent to profile/routine data collection
FR48: Epic 1 - view data used for recommendations
FR49: Epic 1 - delete profile data
FR50: Epic 1 - delete optional photos if later added
FR51: Epic 1 - photo progress optional/separate
FR52: Epic 1 - avoid precise location/camera/photo permissions for MVP
FR53: Epic 7 - onboarding completion tracking
FR54: Epic 7 - routine generation tracking
FR55: Epic 7 - routine save tracking
FR56: Epic 7 - product link click tracking
FR57: Epic 7 - check-in completion tracking
FR58: Epic 7 - fallback/no-safe-match tracking
FR59: Epic 7 - safety/professional-care trigger tracking
FR60: Epic 5 - recommendation firewall
FR61: Epic 3 - catalog coverage gaps

## Epic List

### Epic 1: MVP Foundation, Auth, and Privacy-Safe Shell

Users can access a working Routinelle web/PWA shell, see the product promise, use the first routine flow before forced signup, and create an account only when saving/tracking is needed.

**FRs covered:** FR1, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52

### Epic 2: Skin Onboarding and Profile Capture

Users can complete a short, mobile-first questionnaire that captures skin type, concerns, sensitivity, budget, market, and optional current routine information without feeling medically diagnosed.

**FRs covered:** FR2, FR3, FR4, FR5, FR6, FR7

### Epic 3: Catalog Governance and Product Eligibility

Admin users can create, validate, publish, unpublish, and govern product/catalog/rule data so only complete, eligible, traceable products can be used in recommendations.

**FRs covered:** FR36, FR37, FR38, FR39, FR40, FR41, FR43, FR44, FR61

### Epic 4: Safe Routine Recommendation Engine

Users can receive a deterministic AM/PM starter routine with product options, budget/local matching, no-safe-match handling, conflict detection, Gentle Start logic, and mandatory safety validation before display.

**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR13, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29

### Epic 5: Explainability, Trust, and Commercial Neutrality

Users can understand why each routine step and product was recommended, see ingredient/skin-fit rationale, cautions, safety explanations, and clear neutrality language separating recommendations from product links.

**FRs covered:** FR16, FR17, FR18, FR19, FR20, FR21, FR42, FR60

### Epic 6: Routine Save, Product Actions, and Outcome Check-In

Users can save a generated routine, return to it later, click product links, complete a 7-day check-in, report adherence/outcomes, and receive adjusted guidance or safer product alternatives.

**FRs covered:** FR14, FR15, FR30, FR31, FR32, FR33, FR34

### Epic 7: Safety Events and Product Analytics

The system can track onboarding, routine generation, saves, product clicks, check-ins, fallback/no-safe-match states, and safety/professional-care triggers without compromising recommendation neutrality or privacy.

**FRs covered:** FR35, FR53, FR54, FR55, FR56, FR57, FR58, FR59

## Epic 1: MVP Foundation, Auth, and Privacy-Safe Shell

Users can access a working Routinelle web/PWA shell, see the product promise, use the first routine flow before forced signup, and create an account only when saving/tracking is needed.

### Story 1.1: Initialize Routinelle App Foundation

As a product team,
I want the Routinelle application initialized with the approved starter stack,
So that all future stories build on the same technical foundation.

**Acceptance Criteria:**

**Given** the architecture specifies Next.js, TypeScript, Supabase, Tailwind CSS, and shadcn/ui
**When** the project is initialized
**Then** the app uses the selected starter stack and follows the architecture project structure
**And** the baseline folders exist for consumer routes, admin routes, UI components, domain logic, validation, Supabase utilities, and tests
**And** `.env.example` documents required environment variables without exposing secrets
**And** the app can run locally with a visible Routinelle landing shell

### Story 1.2: Build Mobile-First Public Shell and Sample Recommendation Preview

As a first-time visitor,
I want to view a trustworthy sample skincare recommendation preview before creating an account,
So that I can judge Routinelle's value before sharing personal skin data or signing up.

**Acceptance Criteria:**

**Given** a visitor opens Routinelle on mobile
**When** the public home page loads
**Then** they see a clear skincare-guidance promise and an entry point to view a sample recommendation preview or start a routine
**And** the sample preview is visible before account creation or account commitment
**And** the sample preview clearly shows sample AM/PM routine steps such as cleanse, hydrate, protect, and optional support
**And** the sample preview includes at least one sample product-fit rationale or ingredient-fit explanation in Routinelle's neutral cosmetic-science voice
**And** the sample preview includes a neutrality cue explaining that recommendations are based on skin profile, routine role, ingredient fit, budget, and availability rather than brand payment
**And** the sample preview is clearly labeled as an example and does not imply it is personalized to the visitor
**And** the page is mobile-first and usable at 320px width
**And** the UI uses Tailwind/shadcn primitives and the Routinelle visual foundation
**And** the design avoids marketplace-style navigation before the first routine
**And** no signup is required before seeing the sample recommendation preview

### Story 1.3: Configure Supabase Auth and Session Boundary

As a user,
I want account creation and login to be available only when needed,
So that I can save and track my routine without being forced to sign up too early.

**Acceptance Criteria:**

**Given** Supabase Auth is configured
**When** a user chooses to create an account or sign in
**Then** the app supports account authentication through the approved Supabase flow
**And** authenticated session utilities are available server-side and client-side through `lib/supabase/` helpers
**And** protected account routes require an authenticated user
**And** anonymous users can still access public and pre-save routine flow entry points
**And** service-role credentials are never exposed to the client

### Story 1.4: Add Privacy Consent and Data Use Summary

As a user,
I want to understand what profile and routine data Routinelle uses,
So that I can decide whether to save and track my skincare routine.

**Acceptance Criteria:**

**Given** a user reaches a save or tracking point
**When** the app asks for consent to store profile/routine data
**Then** it explains what data is collected and why it improves recommendations
**And** it makes clear that precise location, camera, and photo permissions are not required for MVP recommendations
**And** consent state is stored for authenticated users
**And** users can view what recommendation-related data is associated with their account
**And** privacy copy is plain-language and GDPR-oriented

### Story 1.5: Implement Account Data View and Profile Deletion Request

As an authenticated user,
I want to view and delete my profile data,
So that I remain in control of sensitive skincare information.

**Acceptance Criteria:**

**Given** an authenticated user opens their account page
**When** they view account data settings
**Then** they can see a summary of stored recommendation-related profile data
**And** they can request deletion of profile data
**And** the deletion flow uses clear confirmation copy before deleting
**And** deleted profile data is no longer available for recommendation history views
**And** the implementation does not include photo deletion UI unless optional photo storage is later added

### Story 1.6: Establish Baseline Accessibility and Responsive Standards

As a mobile user,
I want Routinelle's shell and foundational controls to be accessible and readable,
So that I can use the product comfortably on common mobile devices.

**Acceptance Criteria:**

**Given** the public shell, account shell, and shared UI primitives are implemented
**When** they are viewed on mobile and desktop breakpoints
**Then** core layouts are responsive and usable at 320px and 375px widths
**And** touch targets meet minimum 44x44px expectations where practical
**And** forms and controls have labels and visible focus states
**And** warnings or statuses do not rely on color alone
**And** the foundation supports WCAG AA-oriented contrast expectations

## Epic 2: Skin Onboarding and Profile Capture

Users can complete a short, mobile-first questionnaire that captures skin type, concerns, sensitivity, budget, market, and optional current routine information without feeling medically diagnosed.

### Story 2.1: Build Onboarding Questionnaire Flow

As a skincare shopper,
I want to answer a short guided questionnaire,
So that Routinelle can understand my skin profile without a long medical-style form.

**Acceptance Criteria:**

**Given** a user starts onboarding
**When** the questionnaire loads
**Then** it presents one major question per screen with visible progress
**And** it captures skin type, main concerns, sensitivity, budget, and local market
**And** questions use mobile-friendly single-choice cards and multi-select chips
**And** users can navigate back and continue without losing entered answers
**And** the flow avoids medical diagnosis language

### Story 2.2: Capture Acne, Sensitivity, Irritation, and Barrier Risk Signals

As a user with acne-prone or sensitive skin,
I want to report irritation and barrier-risk signals safely,
So that Routinelle can avoid overly aggressive recommendations.

**Acceptance Criteria:**

**Given** a user reaches skin concern and sensitivity questions
**When** they select acne, oiliness, irritation, redness, burning, or barrier-damaged signals
**Then** the profile stores these as cosmetic guidance signals
**And** the UI explains that Routinelle does not diagnose medical conditions
**And** serious symptom options are clearly worded and readable
**And** the captured signals are available to later recommendation and safety logic

### Story 2.3: Support "Not Sure" and Low-Confidence Answers

As a user who does not know my exact skin type or concern,
I want to choose "not sure" where appropriate,
So that I can finish onboarding without guessing.

**Acceptance Criteria:**

**Given** a questionnaire question may be difficult for users to answer
**When** the user is unsure
**Then** they can select a "not sure" option
**And** the app records the answer as low-confidence or unknown instead of forcing a false choice
**And** later profile summary clearly reflects uncertainty where relevant
**And** validation does not block the user for optional uncertainty

### Story 2.4: Add Optional Current Routine Entry and Skip Path

As a user,
I want to optionally enter my current routine or skip it,
So that I can either get conflict detection or move quickly to my first routine.

**Acceptance Criteria:**

**Given** the user reaches current routine entry
**When** they choose to add current routine information
**Then** the app captures structured current product/routine details for conflict detection
**And** the entry avoids open-ended medical free text as the primary path
**And** when the user chooses to skip
**Then** onboarding continues without penalty
**And** the later recommendation flow can still produce a starter routine

### Story 2.5: Generate and Display Skin Profile Summary

As a user,
I want to review what Routinelle understood about my skin,
So that I can trust or correct the profile before relying on recommendations.

**Acceptance Criteria:**

**Given** the user completes onboarding
**When** the profile summary is displayed
**Then** it shows skin type, concerns, sensitivity level, budget, market, and routine risk flags
**And** it uses "based on your answers" language rather than absolute claims
**And** it includes edit actions for relevant profile inputs
**And** it remains readable on mobile screens
**And** it does not require account creation to view the summary

### Story 2.6: Allow Profile Input Updates After First Routine

As a user,
I want to update my skin profile answers after receiving a routine,
So that I can correct mistakes or reflect skin changes.

**Acceptance Criteria:**

**Given** a user has completed onboarding and reached a profile or routine view
**When** they choose to edit profile answers
**Then** they can update supported skin profile inputs
**And** updated values are validated using the same onboarding schema
**And** if the user is authenticated, updated profile data is stored with the user account
**And** if the user is anonymous, updates remain available for the current flow
**And** the app clearly indicates when a routine should be regenerated after profile changes

## Epic 3: Catalog Governance and Product Eligibility

Admin users can create, validate, publish, unpublish, and govern product/catalog/rule data so only complete, eligible, traceable products can be used in recommendations.

### Story 3.1: Create Catalog Database Schema and Product Domain Model

As a catalog manager,
I want product records to have structured skincare metadata,
So that recommendations can be based on reliable product facts.

**Acceptance Criteria:**

**Given** the Supabase project is configured
**When** catalog schema migrations are applied
**Then** the database supports catalog product records with brand, product name, category, routine step, INCI list, key ingredients, function tags, caution tags, verified claims, price, size, cost-per-unit where available, availability, market, and last verified date
**And** formula-change and data-freshness fields are supported
**And** database naming follows `snake_case` conventions
**And** TypeScript domain models expose `camelCase` fields
**And** product records can represent at least the first-market catalog structure

### Story 3.2: Build Catalog Product Validation and Eligibility Rules

As a catalog manager,
I want incomplete or unsafe product records blocked from recommendation eligibility,
So that users only receive recommendations grounded in usable catalog data.

**Acceptance Criteria:**

**Given** a product record is created or updated
**When** the product is evaluated for recommendation eligibility
**Then** required metadata fields are validated
**And** missing required fields prevent the product from becoming recommendation-eligible
**And** unavailable, stale, unsafe-fit, or missing-metadata products can be excluded from recommendations
**And** validation errors are returned through the standard API result wrapper
**And** catalog validation has focused test coverage

### Story 3.3: Build Admin Product Create and Edit Workflow

As an authorized catalog manager,
I want to create and edit product records through an admin interface,
So that the catalog can be maintained without app redeployment.

**Acceptance Criteria:**

**Given** an authenticated admin user opens the catalog admin area
**When** they create or edit a catalog product
**Then** the UI allows structured entry of product metadata required by the schema
**And** non-admin users cannot access catalog mutation screens or APIs
**And** validation feedback is shown before publish eligibility
**And** successful changes are persisted through admin APIs
**And** admin UI remains separate from consumer product recommendation UI

### Story 3.4: Add Publish, Unpublish, Review, and Freshness Controls

As a catalog manager,
I want to control product publication and freshness state,
So that only reviewed and current products are eligible for recommendations.

**Acceptance Criteria:**

**Given** a product exists in the catalog
**When** an admin changes its status
**Then** the product can be published, unpublished, or flagged for review
**And** formula-change and data-freshness flags can be set
**And** unpublished or flagged products are excluded from recommendation eligibility unless explicitly allowed by rules
**And** product status changes are stored with timestamps
**And** the admin interface shows product eligibility status clearly

### Story 3.5: Manage Recommendation Tags, Caution Tags, and Approved Copy Blocks

As a catalog or rules manager,
I want to manage product tags, caution tags, recommendation rule inputs, and approved explanation copy,
So that recommendations and explanations remain consistent and claim-safe.

**Acceptance Criteria:**

**Given** an authorized admin user opens rule/copy management
**When** they manage tags or approved copy blocks
**Then** the system supports function tags, caution tags, routine-step tags, and explanation copy references
**And** changes are stored in a way that recommendation and explanation modules can consume
**And** approved copy is separated from free-form user-facing claims
**And** non-admin users cannot mutate these records
**And** changes can be associated with a rule or catalog version where applicable

### Story 3.6: Preserve Catalog and Rule Version Context

As an internal operator,
I want catalog and rule changes versioned,
So that generated recommendations can be traced back to the data and rules used.

**Acceptance Criteria:**

**Given** catalog products or recommendation rules change
**When** a versioned catalog or rule state is published
**Then** the system preserves a catalog version ID and rule version ID
**And** generated routines can later reference the exact catalog/rule version used
**And** version identifiers are available to recommendation and explanation services
**And** versioning supports auditability without exposing internal details to consumers

### Story 3.7: Show Catalog Coverage Gaps

As a catalog manager,
I want to identify gaps by routine step, profile, budget band, and market,
So that catalog work can prioritize the products users need most.

**Acceptance Criteria:**

**Given** catalog products and eligibility data exist
**When** an admin opens the catalog coverage view
**Then** the system shows coverage by routine step, priority profile, budget band, and market
**And** gaps such as no eligible sunscreen for a budget/sensitive profile are visible
**And** coverage calculations exclude ineligible, unpublished, or stale products
**And** the coverage view helps prioritize first-market catalog completion

## Epic 4: Safe Routine Recommendation Engine

Users can receive a deterministic AM/PM starter routine with product options, budget/local matching, no-safe-match handling, conflict detection, Gentle Start logic, and mandatory safety validation before display.

### Story 4.1: Define Display-Ready Routine Contract and Persistence Foundation

As an internal product operator,
I want generated routines to have a structured display-ready contract and persistence foundation,
So that every routine can be rendered, tested, audited, and safely reused by later recommendation stories.

**Acceptance Criteria:**

**Given** onboarding profile and eligible catalog models exist
**When** the routine contract and persistence foundation are implemented
**Then** the system defines typed routine, routine section, routine step, product option, and recommendation state models that can be returned to the UI as display-ready data
**And** the contract supports AM/PM routine sections, step role, time of use, frequency, product options, no-safe-match state, safety-blocked state, caution state, and explanation references
**And** generated routine persistence stores catalog version ID and rule version ID references needed for auditability and deterministic replay
**And** database fields use `snake_case` while TypeScript models use `camelCase`
**And** schema changes are implemented through Supabase migrations
**And** fixture or contract tests verify that a sample generated routine can be serialized, persisted, returned through the standard API result wrapper, and rendered by routine UI components without raw database rows

### Story 4.2: Generate Core AM/PM Starter Routine Structure

As a user,
I want Routinelle to generate a simple AM/PM starter routine,
So that I know what to use and when.

**Acceptance Criteria:**

**Given** a validated skin profile is submitted
**When** routine generation runs
**Then** the system creates a complete AM/PM starter routine
**And** routine steps include cleanser, moisturizer, sunscreen, and optional acne/support step when appropriate
**And** each step includes step role, time of use, and frequency
**And** the routine can be returned through the standard API result wrapper
**And** routine generation follows the architecture pipeline order

### Story 4.3: Match Eligible Products by Routine Step, Budget, and Market

As a user,
I want product options that match my routine step, budget, and local market,
So that the recommendation is actionable.

**Acceptance Criteria:**

**Given** eligible catalog products exist for the selected market
**When** a routine step needs product options
**Then** the engine selects up to 2-3 suitable product options per routine step
**And** product options respect routine step, skin profile, budget band, and local availability
**And** unavailable or recommendation-ineligible products are excluded
**And** affiliate or commercial metadata does not influence ranking
**And** product matching has fixture test coverage

### Story 4.4: Implement No-Safe-Match and Catalog Gap Handling

As a user,
I want a clear no-safe-match result when Routinelle cannot confidently recommend a product,
So that I am not pushed toward an unsafe or unsuitable option.

**Acceptance Criteria:**

**Given** no eligible product matches a required routine step safely
**When** recommendation generation completes
**Then** the routine includes a no-safe-match state for that step instead of forcing a product
**And** the API response treats no-safe-match as an expected recommendation state, not a system error
**And** the no-safe-match state includes a reason code usable by the UI
**And** fallback/no-safe-match states preserve catalog/rule version context
**And** no-safe-match behavior is covered by tests

### Story 4.5: Detect Routine Conflicts and Over-Aggressive Active Patterns

As a user with current routine information or sensitivity signals,
I want Routinelle to detect routine conflicts,
So that I avoid product combinations that may be too aggressive.

**Acceptance Criteria:**

**Given** the user profile includes current routine details or sensitivity risk signals
**When** the recommendation engine evaluates the routine
**Then** it flags duplicate actives, too many exfoliants, harsh cleanser plus active conflicts, and barrier-risk active patterns where rules apply
**And** conflict results can be attached to routine steps
**And** strong conflicts can block display or trigger no-safe-match/safety states
**And** conflict checks are testable independently of UI components

### Story 4.6: Implement Gentle Start Recommendation Variant

As a sensitive or barrier-risk user,
I want Routinelle to recommend a conservative Gentle Start routine,
So that I can protect my skin before adding stronger actives.

**Acceptance Criteria:**

**Given** a profile indicates sensitivity, irritation, acne-prone barrier risk, or frequent burning/redness
**When** routine generation runs
**Then** the engine can select a Gentle Start routine variant
**And** the variant prioritizes cleanse, hydrate, protect, and barrier support
**And** strong actives are limited, delayed, or excluded when safety rules require it
**And** patch-test and slow-start guidance flags are available for display
**And** Gentle Start selection is covered by fixture tests

### Story 4.7: Add Safety and Claim Guardrail Validation Before Display

As a user,
I want only safe, non-diagnostic routine guidance displayed,
So that Routinelle protects me from unsafe or overclaimed recommendations.

**Acceptance Criteria:**

**Given** a candidate routine has been generated
**When** the safety/claim guardrail layer runs
**Then** the system blocks diagnosis, treatment, cure, prevention, or disease-identification wording from user-facing recommendation copy
**And** routines that fail safety validation are not displayed
**And** severe or high-risk symptom signals trigger professional-care guidance state instead of normal product recommendation
**And** safety-blocked is returned as a typed state with an approved user-facing reason
**And** safety/claim guardrails have focused tests

### Story 4.8: Persist Generated Routine With Catalog and Rule Version Context

As an internal operator,
I want generated routines to preserve the catalog and rule versions used,
So that recommendations are auditable and reproducible.

**Acceptance Criteria:**

**Given** a routine passes recommendation and safety validation
**When** it is generated or saved for display
**Then** the system stores catalog version ID and rule version ID with the generated routine
**And** routine steps and product options reference their source product attributes or eligibility state
**And** the same profile and same catalog/rule version can reproduce the same recommendation result
**And** version context is not lost when the routine is later saved by a user

## Epic 5: Explainability, Trust, and Commercial Neutrality

Users can understand why each routine step and product was recommended, see ingredient/skin-fit rationale, cautions, safety explanations, and clear neutrality language separating recommendations from product links.

### Story 5.1: Build Approved Explanation Copy and Rationale Builder

As a user,
I want recommendations explained in clear, approved skincare language,
So that I understand the routine without unsafe or exaggerated claims.

**Acceptance Criteria:**

**Given** a generated routine has steps and product options
**When** the explanation builder runs
**Then** it attaches approved rationale for routine steps, product fit, ingredient function, and caution notes
**And** explanations are generated from product attributes, rules, source notes, or approved copy blocks
**And** explanation output avoids diagnosis, treatment, cure, prevention, or disease-identification claims
**And** unsafe copy is blocked by claim guardrails
**And** explanation logic has focused tests

### Story 5.2: Display Routine Step Explanations

As a user,
I want to understand why each routine step exists,
So that I know what to use and when.

**Acceptance Criteria:**

**Given** a routine is displayed
**When** the user views AM/PM routine steps
**Then** each step includes a plain-language explanation for its purpose
**And** explanations are concise on the default view
**And** deeper detail is available through progressive disclosure
**And** explanations remain readable on mobile screens
**And** routine explanations use neutral, cosmetic-science-oriented language

### Story 5.3: Display Ingredient and Skin-Fit Rationale for Product Options

As a user,
I want to see why a recommended product fits my skin profile,
So that I can make a confident product decision.

**Acceptance Criteria:**

**Given** product options are displayed for a routine step
**When** the user expands a product rationale panel
**Then** they see ingredient/function rationale, skin-profile fit, budget/availability fit, and caution notes where relevant
**And** Fit Badges such as barrier-friendly, low irritation risk, budget fit, locally available, acne-prone fit, hydration support, or caution/avoid are shown when supported by data
**And** product rationale distinguishes product fit from product marketing claims
**And** product cards clearly mark external retailer/product links

### Story 5.4: Show Cautions, Misfit Reasons, and Conflict Explanations

As a user,
I want to understand why certain products or ingredient types may not fit me,
So that I can avoid unsuitable choices.

**Acceptance Criteria:**

**Given** the recommendation engine identifies caution, conflict, or misfit reasons
**When** the routine or product explanation is displayed
**Then** the UI shows the relevant caution in calm, non-judgmental language
**And** mild caution, strong caution, and block-recommendation states are visually and textually distinct
**And** mild cautions do not use serious red styling
**And** cautions do not rely on color alone
**And** conflict explanations avoid blaming the user for their current routine

### Story 5.5: Display Gentle Start and Safety Guidance Explanations

As a sensitive or irritated user,
I want to understand why Routinelle recommends a calmer routine,
So that I feel protected instead of disappointed.

**Acceptance Criteria:**

**Given** a routine uses Gentle Start or safety guidance
**When** the routine is displayed
**Then** the UI explains why the routine is conservative
**And** patch-test and slow-start guidance is shown where applicable
**And** serious symptom guidance is plain-text readable and non-diagnostic
**And** the safety explanation does not overclaim that products are guaranteed non-irritating
**And** users can understand when professional-care guidance is recommended

### Story 5.6: Add Recommendation Neutrality and Commercial Firewall Messaging

As a user,
I want to know that recommendations are not changed by brand payment,
So that I can trust Routinelle's product choices.

**Acceptance Criteria:**

**Given** product recommendations or product links are displayed
**When** the user views the recommendation result
**Then** the UI includes a neutrality statement explaining that recommendations are based on profile, routine role, ingredient fit, budget, and availability
**And** the system separates recommendation logic from retailer/product links or affiliate relationships
**And** commercial metadata is not used in personalized ranking
**And** sponsored or partner content, if introduced later, must be clearly separated from personalized recommendations
**And** neutrality messaging is visible without overwhelming the routine view

### Story 5.7: Trace Recommendation Explanations to Source Metadata

As an internal reviewer,
I want recommendations and explanations to be traceable to product attributes, rules, source notes, or approved copy,
So that recommendation quality and claims can be audited.

**Acceptance Criteria:**

**Given** a recommendation explanation is produced
**When** the explanation is stored or returned
**Then** it includes internal trace references to product attributes, rule IDs, source notes, approved copy IDs, or catalog/rule version context
**And** trace data is available to internal/admin review where appropriate
**And** consumers do not see confusing internal trace IDs by default
**And** traceability is preserved for saved routines

## Epic 6: Routine Save, Product Actions, and Outcome Check-In

Users can save a generated routine, return to it later, click product links, complete a 7-day check-in, report adherence/outcomes, and receive adjusted guidance or safer product alternatives.

### Story 6.1: Save Generated Routine to User Account

As a user,
I want to save my generated routine,
So that I can return to it and follow it later.

**Acceptance Criteria:**

**Given** a routine has been generated and passed safety validation
**When** the user chooses to save the routine
**Then** authenticated users can save it to their account
**And** anonymous users are prompted to create or sign in to an account only at the save point
**And** saved routine data preserves routine steps, product options, explanations, and catalog/rule version context
**And** the save action uses the standard API result wrapper
**And** routine save tracking can be emitted without exposing sensitive free-text data

### Story 6.2: View Saved Routine Details

As a returning user,
I want to access my saved routine details,
So that I know what to use in the morning and evening.

**Acceptance Criteria:**

**Given** an authenticated user has saved a routine
**When** they open the routine detail page
**Then** they can view AM/PM routine steps, product options, cautions, and explanations
**And** only the routine owner can access the saved routine
**And** unavailable or stale product links do not break the routine view
**And** the routine remains readable on mobile screens
**And** the page indicates when the user may need to refresh or regenerate recommendations

### Story 6.3: Track Product Link Clicks Without Affecting Ranking

As a user,
I want to open product links from my routine,
So that I can buy or inspect recommended products locally.

**Acceptance Criteria:**

**Given** product options include retailer/product links
**When** the user clicks a product link
**Then** the click is tracked as a product action event
**And** the external link is clearly marked before or during the action
**And** product click tracking does not alter personalized ranking logic
**And** stale or unavailable product link states show a clear fallback message
**And** event payloads avoid sensitive profile or symptom free text

### Story 6.4: Create 7-Day Check-In Flow

As a user following a routine,
I want a simple 7-day check-in,
So that Routinelle can learn how my skin responded.

**Acceptance Criteria:**

**Given** a user has generated or saved a routine
**When** the 7-day check-in is available
**Then** the user can open a check-in form linked to the routine
**And** the form captures adherence by routine step
**And** the form captures dryness, redness, burning, acne change, hydration, irritation, and suspected product discomfort
**And** the form uses accessible inputs and clear, non-diagnostic language
**And** the user can submit the check-in through the standard API result wrapper

### Story 6.5: Update Profile Signals From Check-In Outcomes

As a returning user,
I want Routinelle to remember how my skin responded,
So that future recommendations become safer and more relevant.

**Acceptance Criteria:**

**Given** a check-in has been submitted
**When** outcomes are processed
**Then** the system updates profile signals based on adherence, improvement, discomfort, or irritation outcomes
**And** mild outcomes are separated from severe or persistent symptoms
**And** updated signals can influence future recommendation rules
**And** the user can see a concise outcome summary
**And** sensitive outcome data is protected under user-owned data access controls

### Story 6.6: Suggest Adjusted Guidance or Product Alternative After Check-In

As a user who reports discomfort or poor fit,
I want adjusted guidance or a gentler product alternative,
So that I know how to continue safely.

**Acceptance Criteria:**

**Given** a user reports mild tightness, dryness, irritation, or product discomfort without severe symptoms
**When** the check-in is processed
**Then** the app can suggest simplified guidance or a gentler product alternative where safe matches exist
**And** if no safe alternative exists, the app shows a no-safe-match or conservative fallback state
**And** the guidance avoids medical diagnosis or treatment claims
**And** the adjusted guidance is clearly linked to the reported outcome
**And** the user is told to seek professional care if symptoms are serious, persistent, or worsening

## Epic 7: Safety Events and Product Analytics

The system can track onboarding, routine generation, saves, product clicks, check-ins, fallback/no-safe-match states, and safety/professional-care triggers without compromising recommendation neutrality or privacy.

### Story 7.1: Implement Privacy-Safe Analytics Event Framework

As a product team,
I want a consistent analytics event framework,
So that Routinelle can measure trust, conversion, and safety signals without exposing sensitive user content.

**Acceptance Criteria:**

**Given** analytics events are emitted from product flows
**When** events are tracked
**Then** event names use lowercase dot-separated naming
**And** supported events include onboarding, routine generation, routine save, product click, check-in, no-safe-match, and safety/professional-care triggers
**And** event payloads avoid sensitive free-text symptom details
**And** analytics events use the standard API result/error handling pattern where applicable
**And** product analytics does not alter personalized recommendation ranking

### Story 7.2: Track Onboarding and Routine Generation Completion

As a product team,
I want to track onboarding and routine generation completion,
So that we can measure whether users reach the first useful routine.

**Acceptance Criteria:**

**Given** a user starts and completes onboarding
**When** onboarding state changes
**Then** the system can track onboarding started and completed events
**And** when routine generation completes
**Then** the system can track routine generated, no-safe-match, safety-blocked, and generation failure states
**And** timing data can support time-to-routine measurement without storing unnecessary personal details
**And** analytics remains separate from recommendation logic

### Story 7.3: Track Routine Saves, Product Clicks, and Check-In Completion

As a product team,
I want to track saves, product clicks, and check-ins,
So that we can understand whether users trust and act on recommendations.

**Acceptance Criteria:**

**Given** a user saves a routine, clicks a product, or completes a check-in
**When** the action occurs
**Then** the system emits the appropriate routine saved, product clicked, or check-in completed event
**And** product clicked events include product/routine identifiers but not sensitive profile free text
**And** check-in events avoid sending detailed symptom descriptions
**And** tracking failures do not block the user's core action
**And** product click events do not affect personalized ranking

### Story 7.4: Log Safety Events and Professional-Care Guidance Triggers

As an internal safety reviewer,
I want safety events and professional-care triggers logged,
So that Routinelle can monitor bad reactions and unsafe-use reports.

**Acceptance Criteria:**

**Given** a user reports irritation, worsening, unsafe use, or serious symptoms
**When** safety logic triggers professional-care guidance or safety-blocked state
**Then** the system logs a safety event with severity/category data
**And** the log avoids unnecessary sensitive free-text content
**And** safety events can be associated with routine/product context where available
**And** safety event logging does not display normal product recommendations for serious symptoms
**And** safety event logging has focused test coverage

### Story 7.5: Display Admin Safety and Analytics Review Views

As an internal operator,
I want to review safety events and product analytics signals,
So that the team can improve catalog quality and safety rules.

**Acceptance Criteria:**

**Given** analytics and safety events exist
**When** an authorized admin opens review views
**Then** they can see aggregated onboarding, routine generation, save, click, check-in, fallback, and safety-event signals
**And** safety event views are restricted to authorized internal users
**And** personal/sensitive details are minimized in review views
**And** no dashboard control can directly change personalized recommendation ranking
**And** review views help identify quality issues such as high no-safe-match rates or repeated safety triggers
