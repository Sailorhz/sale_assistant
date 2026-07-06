---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-sale_assistant.md
  - _bmad-output/planning-artifacts/product-brief-sale_assistant-distillate.md
  - _bmad-output/brainstorming/brainstorming-session-2026-05-03-210919.md
workflowType: 'prd'
documentCounts:
  productBriefs: 2
  research: 0
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: mobile_app
  secondaryProjectType: web_app
  domain: healthcare-adjacent beauty-tech cosmetic skincare guidance
  complexity: medium-high
  projectContext: greenfield
releaseMode: phased
workflow_completed: true
completed: "2026-05-11"
---

# Product Requirements Document - sale_assistant

**Author:** Long
**Date:** 2026-05-07

## Executive Summary

Routinelle is a mobile-first skincare guidance product that helps users build neutral, ingredient-aware, and locally actionable skincare routines. It serves confused skincare shoppers, especially acne-prone, sensitive-skin, and budget-conscious users who struggle to choose products from influencer advice, store recommendations, fragmented search results, and brand marketing.

The product solves a decision-quality problem: users do not only need more skincare information; they need a trustworthy system that translates skin type, concerns, sensitivity, current routine, ingredient fit, budget, local availability, and real outcomes into a routine they can confidently follow. Routinelle's first version will provide a free full routine using a short onboarding questionnaire, optional current routine entry, curated product catalog, explainable product recommendations, safety warnings, and a first outcome check-in.

Routinelle is intentionally positioned as cosmetic skincare guidance, not medical diagnosis or treatment. It must maintain clear safety boundaries, avoid disease/treatment claims, and escalate serious symptoms to professional care guidance.

### What Makes This Special

Routinelle is not designed to be the loudest skincare voice. It is designed to be the most personally relevant and explainable one.

Its differentiator is the combination of neutral recommendation logic, ingredient-based reasoning, user skin memory, routine conflict detection, and outcome-based adaptation. Unlike influencers or store assistants, Routinelle is not constrained by trends, single-store inventory, or brand sales incentives. Unlike generic AI chat, it is grounded in structured product data, local availability, and user outcome history.

The core insight is that skincare trust comes from transparent decisions and responsible limits. The product earns trust by explaining why a product fits, why another product may not fit, when a routine may be too aggressive, and when the app should stop recommending products and advise professional care.

## Project Classification

- **Project Type:** Mobile app primary, with web app or responsive web support as a likely secondary delivery option.
- **Domain:** Healthcare-adjacent beauty-tech / cosmetic skincare guidance.
- **Complexity:** Medium-high due to privacy, safety boundaries, ingredient accuracy, product data quality, and cosmetic-versus-medical claim risk.
- **Project Context:** Greenfield product.

## Success Criteria

### User Success

Routinelle succeeds for users when a confused skincare shopper can complete onboarding and receive a safe, understandable, locally buyable starter routine in under 5 minutes, without feeling medically diagnosed, judged, or upsold.

User success criteria:

- Users complete the 7-8 question onboarding in one session.
- Users receive a complete AM/PM starter routine with clear step order and frequency.
- Users understand what to use, when to use it, and why each step exists.
- Users can identify at least one recommended product that fits their concern, budget, sensitivity, or local availability.
- Users with acne-prone, sensitive, irritated, or barrier-damaged skin receive conservative guidance before strong actives.
- Users see neutral recommendations and understand that brand payments do not change personalized ranking.
- Users can skip current routine entry and still receive a complete safe starter routine.
- Users who report severe, persistent, or worsening symptoms receive conservative professional-care guidance rather than diagnosis.

### Business Success

Routinelle succeeds as a business when the free first routine creates enough trust to drive user action, repeat engagement, and willingness to pay for ongoing adaptation.

Business success criteria:

- Free first full routine is delivered as a hard trust promise.
- Users save routines or click product links, proving that recommendations drive action.
- Users return for the first 7-day check-in, proving the product is not only a one-time answer.
- Users show willingness to pay for premium adaptive features after seeing value from the free routine.
- Affiliate, retailer, or brand partnerships do not compromise recommendation neutrality.
- Recommendation firewall remains explicit in product and business rules.

### Technical Success

Routinelle succeeds technically when it produces deterministic, explainable, safe recommendations from structured user and product data.

Technical success criteria:

- Same user profile and same catalog version produce the same recommended routine.
- Every recommendation, warning, and ingredient explanation maps to a rule, source note, or catalog attribute.
- AI-generated explanations are constrained to approved product/rule metadata.
- Recommendation rules are covered by tests.
- Fixture tests cover acne-prone, sensitive, budget, minimal routine, conflicting current routine, and no-safe-match cases.
- Every displayed routine passes conflict validation before display.
- Medical language guardrails block diagnosis and treatment claims.
- Catalog ingestion validates required fields before publication.
- Routine generation completes within performance targets after onboarding submission.
- System supports a clear "no safe match" state when a confident recommendation is not available.

### Measurable Outcomes

P0 launch targets:

- 70%+ onboarding completion rate.
- 80%+ of completed users receive a routine in under 5 minutes.
- 60%+ of users report they understand what to buy next.
- 50%+ of users save a routine or click at least one product.
- Less than 5% of generated routines contain unresolved recommendation conflicts.
- 80%+ catalog coverage across core routine steps and target budget bands for priority user profiles.
- 100% of displayed routines pass safety and claim-guardrail checks before display.

P1 validation targets:

- 30%+ of users return for the 7-day check-in.
- 20%+ of users update routine/check-in data.
- Track rate of irritation, worsening, confusion, or unsafe-use reports after routine start.
- Track recommendation fallback rate where no safe product match is available.

## Product Scope

### MVP - Minimum Viable Product

MVP must prove one primary job: a confused shopper can get a safe, understandable, locally buyable starter routine in under 5 minutes.

MVP includes:

- Mobile-first experience, with responsive web/PWA support as an option
- Free first full routine
- Sample recommendation preview before signup
- 7-8 question onboarding
- Skin profile summary
- Complete AM/PM starter routine
- Core routine steps: cleanser, moisturizer, sunscreen, plus optional acne/support step when appropriate
- 2-3 locally buyable product options per step, or a clear "no safe match" state
- Ingredient and skin-fit explanations in plain language
- Budget-aware product options and local product links
- Structured optional current routine entry for conflict detection only
- Routine conflict warnings
- Symptom triage as conservative static guidance, not diagnosis
- Patch-test guidance
- Sensitive-skin / barrier-damaged Gentle Start routine variant
- First 7-day outcome check-in
- Rule-first recommendation engine with weighted scoring
- AI explanations constrained to approved product/rule metadata
- Curated single-market product catalog with enough coverage for core steps, priority profiles, and budget bands

### Growth Features (Post-MVP)

Growth features strengthen retention, personalization, and commercial value after the first routine works.

Post-MVP includes:

- 14/30-day outcome tracking
- Richer current-routine analysis
- Seasonal routine adjustment
- Product replacement assistant
- Product dupe finder
- New product checker: "Can I use this?"
- Ingredient conflict alerts
- Advanced sensitive-skin mode
- Optional photo progress journal
- Ingredient/product monitor
- Retailer integrations or affiliate APIs
- Broader catalog coverage
- Brand/retailer partnerships with recommendation firewall

### Vision (Future)

The future version becomes a personal skincare intelligence layer that adapts as the user's skin, budget, environment, preferences, and product options change.

Future vision includes:

- Multi-market product catalog
- Verified product data pipelines
- Stronger professional review partnerships
- Privacy-first photo progress tracking
- Long-term skin history and routine optimization
- Market monitoring for reformulations, new ingredients, and better alternatives
- Broader beauty decision support beyond skincare if the core routine product proves trusted

## User Journeys

### Journey 1: Confused Shopper Gets a Safe Starter Routine

**Persona:** Camille, 28, lives in France, has combination skin, occasional acne, and a limited skincare budget. She has tried products recommended on TikTok and from store assistants, but she is unsure what actually fits her skin.

**Opening Scene:**  
Camille is standing in a pharmacy aisle comparing cleansers, serums, and moisturizers. Product claims all sound similar. She wants a routine but does not want to waste more money.

**Rising Action:**  
She opens Routinelle, sees a sample recommendation preview, and starts the short onboarding. She answers questions about skin type, concerns, sensitivity, budget, and local market. She skips current routine entry because she wants a fast result.

**Climax:**  
Routinelle generates a complete AM/PM starter routine in under 5 minutes. It gives her cleanser, moisturizer, sunscreen, and one optional acne-support step. Each step includes 2-3 locally buyable product options or a clear explanation if no safe match is available.

**Resolution:**  
Camille saves the routine because it is clear, budget-aware, and not pushy. She understands what to buy next and why those products fit her skin.

**Requirements Revealed:**

- Sample recommendation preview
- 7-8 question onboarding
- Routine generation under 5 minutes
- AM/PM routine display
- Budget-aware product matching
- Local product links
- Product rationale in plain language
- Routine save action
- No signup required before seeing value, or signup only to save/track

### Journey 2: Sensitive Acne User Needs Conservative Guidance

**Persona:** Lea, 24, has oily-combination skin, acne on cheeks and chin, and a damaged skin barrier from trying too many actives. Products often sting or make her red.

**Opening Scene:**  
Lea wants acne improvement but is afraid that another active ingredient will worsen her skin. She has used several products together and does not know which combinations are risky.

**Rising Action:**  
She completes onboarding and indicates acne, oiliness, irritation, and frequent burning/redness. Routinelle recognizes a sensitive or barrier-damaged profile and shifts into a Gentle Start approach.

**Climax:**  
Instead of recommending a strong acne routine, Routinelle recommends a conservative starter routine focused on cleansing, hydration, barrier support, sunscreen, and cautious acne support only if appropriate. It warns against over-exfoliation and explains patch testing.

**Resolution:**  
Lea feels protected rather than judged. She understands that calming the barrier first can make later acne care safer. She accepts the routine and receives a 7-day check-in.

**Requirements Revealed:**

- Sensitivity and irritation detection
- Gentle Start routine variant
- Conservative active recommendation rules
- Routine conflict warnings
- Patch-test guidance
- Non-medical safety language
- 7-day check-in
- Clear professional-care escalation for severe/persistent symptoms

### Journey 3: Returning User Updates Routine After Real Outcome

**Persona:** Camille returns after 7 days. She followed most of the routine but one product made her skin feel tight.

**Opening Scene:**  
Camille receives a reminder to complete her 7-day check-in. She is not sure if the tightness is normal or a sign to stop something.

**Rising Action:**  
The app asks simple outcome questions: dryness, redness, burning, acne change, hydration, and whether she used each step. Camille reports mild tightness but no severe symptoms.

**Climax:**  
Routinelle updates her profile and suggests a gentler moisturizer alternative. It explains that the routine should be simplified if discomfort increases, and it avoids making medical claims.

**Resolution:**  
Camille trusts the app more because it adapts based on real experience. She returns later for routine adjustment.

**Requirements Revealed:**

- 7-day check-in flow
- Outcome capture
- Routine adherence capture
- Profile update from outcomes
- Product replacement suggestion
- Safe fallback state
- Reminder/notification support
- Retention loop for 14/30-day tracking later

### Journey 4: Product Catalog Manager Maintains Trustworthy Data

**Persona:** Nora is the internal operations user responsible for maintaining product data and recommendation quality.

**Opening Scene:**  
Nora needs to add a new moisturizer to the French catalog. The product has an INCI list, price, claims, and retailer links.

**Rising Action:**  
She enters structured product fields: brand, product name, category, routine step, key ingredients, function tags, caution tags, price band, availability, and last verified date. The system validates required fields before the product can be used in recommendations.

**Climax:**  
The product is flagged as suitable for barrier support but not as a primary acne treatment. It becomes eligible for certain sensitive-skin routines only after required metadata is complete.

**Resolution:**  
Nora can update product metadata without redeploying the app. Users receive recommendations grounded in complete catalog attributes.

**Requirements Revealed:**

- Admin/catalog management interface
- Required product metadata validation
- Product function tags
- Caution/avoid flags
- Market availability fields
- Last verified date
- Formula-change flag
- Publish/unpublish controls
- Audit trail for product metadata changes

### Journey 5: Support/Safety Case Handles Bad Reaction

**Persona:** Lea reports that a product caused strong redness and persistent burning.

**Opening Scene:**  
After starting a routine, Lea opens the check-in and reports worsening irritation.

**Rising Action:**  
Routinelle asks severity questions without diagnosing. It checks whether symptoms are mild, moderate, severe, persistent, spreading, painful, swollen, or near sensitive areas such as eyes or lips.

**Climax:**  
Because the reaction is persistent and strong, the app stops normal product recommendation and provides conservative professional-care guidance. It records the event as a safety signal and avoids recommending the suspected product type in future routines.

**Resolution:**  
The app protects Lea rather than pushing more products. The case becomes a trust-preserving recovery moment.

**Requirements Revealed:**

- Bad-reaction reporting
- Severity classification
- Conservative symptom guidance
- Stop-recommendation condition
- Professional-care escalation copy
- Safety event logging
- Profile update based on reaction
- Future recommendation exclusions
- Support/admin visibility into safety events

### Journey Requirements Summary

The journeys reveal the following capability areas:

- Lightweight onboarding and skin profile capture
- Fast routine generation
- AM/PM starter routine display
- Rule-first recommendation engine
- Product catalog matching
- Budget and local availability matching
- Ingredient and skin-fit explanation
- Routine save and product click tracking
- Sensitive-skin Gentle Start variant
- Conflict validation and active-use warnings
- Conservative symptom triage
- Outcome tracking and profile updates
- Safe product fallback and "no safe match" states
- Catalog/admin operations
- Product metadata validation and governance
- Safety event handling and escalation
- Privacy-aware user data handling

## Domain-Specific Requirements

### Compliance & Regulatory

- Routinelle must be positioned as **cosmetic skincare guidance**, not medical diagnosis, disease treatment, or dermatologist replacement.
- The product must avoid claims that it diagnoses, cures, treats, mitigates, or prevents acne, eczema, allergy, rosacea, infection, or other medical conditions.
- The product must use conservative language for serious symptoms: pause recommendations and advise professional care when symptoms are severe, persistent, spreading, painful, swollen, blistering, infected-looking, or near eyes/lips.
- Any photo feature in MVP or later phases must be positioned as **progress journaling**, not automated disease or condition diagnosis.
- Ingredient explanations should be grounded in product metadata and recognized cosmetic ingredient references such as CosIng/COSMILE-style sources.
- Product claims such as dermatologist-tested, cruelty-free, bio/natural, fragrance-free, or sensitive-skin suitable must be represented as structured fields only when supported by product data, brand claims, or catalog verification.
- Routinelle must maintain a recommendation firewall: brand payments, affiliate relationships, or retailer partnerships must not alter personalized recommendation ranking.

### Technical Constraints

- User skin profile data, symptoms, reactions, budget, location, routine history, and photos are sensitive personal data and must be handled with privacy-by-design principles.
- The app must collect only data needed for recommendation quality and make high-sensitivity inputs optional where possible.
- Photos must be optional, deletable, and not required for core recommendations.
- Users must be able to delete profile data and photos.
- The system must distinguish between:
  - **Routine safety:** ingredient conflicts, duplicate actives, over-exfoliation, sensitivity flags.
  - **Symptom triage:** conservative guidance to seek professional care when risk indicators appear.
- AI-generated explanation must be constrained to approved product/rule metadata and must not invent medical advice.
- Every recommendation, warning, and ingredient explanation should be traceable to a product attribute, rule, source note, or approved copy block.
- The recommendation engine must support a safe fallback state: "no safe match" or "cannot confidently recommend," rather than forcing a product.

### Integration Requirements

- Ingredient reference data should use credible cosmetic ingredient references, with CosIng as an EU-oriented source for ingredient naming/functions and limitations.
- Product catalog data should include INCI, category, routine step, function tags, caution tags, price, size, cost-per-unit where available, price band, availability, verified claims, last verified date, and formula-change flag.
- Local product availability should rely on compliant sources: manual curation, official product pages, affiliate feeds/APIs, retailer partnerships, or approved data feeds.
- Retailer/product links must be clearly distinguished from recommendation logic so users understand that purchase availability does not equal paid ranking.
- Admin/catalog tools must support product updates, publish/unpublish status, verification dates, and auditability for changes affecting recommendations.

### Risk Mitigations

- **Medical boundary risk:** use no-diagnosis wording, static professional-care escalation guidance, and claim-guardrail tests.
- **Privacy risk:** minimize collection, provide explicit consent for sensitive data/photos, support deletion, and make privacy language clear in onboarding.
- **Recommendation liability risk:** require safety validation before routine display, conflict checks, patch-test guidance, and conservative active introduction.
- **Catalog drift risk:** track last verified date, formula-change flags, user reports, and refresh high-click or high-risk products more often than the baseline 6-month review.
- **Explainability risk:** keep explanations short, traceable, and cosmetic-focused; avoid unsupported "clinically proven" or "non-irritating" claims.
- **Commercial trust risk:** disclose affiliate/partner relationships and maintain recommendation ranking independence.
- **No-safe-match risk:** treat "no safe match available" as a valid user-protective outcome rather than a failure.

## Innovation & Novel Patterns

### Detected Innovation Areas

Routinelle's innovation is not a new mobile interaction pattern. It is a new combination of trust, recommendation quality, and skincare safety boundaries.

Key innovation areas:

- **Neutral recommendation firewall:** Personalized ranking is based on skin fit, ingredients, budget, local availability, and outcomes, not commercial payments.
- **Rule-first explainable skincare routine engine:** The app generates routines through controlled matching logic, then explains product fit in plain language.
- **Outcome-aware adaptation:** The app learns from 7-day check-ins and future follow-ups instead of treating the first questionnaire as permanent truth.
- **Gentle Start for sensitive/barrier-damaged users:** The app can deliberately recommend slower, simpler routines instead of maximizing active ingredients.
- **Safe fallback as product behavior:** "No safe match" or "seek professional care" is treated as a valid output, not a failure.
- **Local-market actionability:** Recommendations are grounded in a curated product catalog with availability and budget context for one market.

### Market Context & Competitive Landscape

Routinelle competes against multiple existing alternatives:

- Influencers and TikTok trends: strong discovery, weak personalization and neutrality.
- Store assistants: face-to-face help, but often limited by inventory and sales incentives.
- Search/Reddit/communities: broad information, inconsistent reliability.
- Generic AI chat: flexible advice, but not grounded in verified local product catalog and user outcome history.
- Existing skincare apps: some provide AI skin analysis or routines, but many risk leaning into photo diagnosis, generic advice, or insufficient commercial neutrality.

Routinelle's differentiator is not "AI skincare" by itself. The differentiator is **trusted decision support**: explainable routines, conservative safety behavior, product data governance, and commercial neutrality.

### Validation Approach

Innovation should be validated through user behavior, not only user opinion.

Validation methods:

- Test whether users complete onboarding and trust the first routine enough to save or click products.
- Test whether users understand why products were recommended.
- Test whether sensitive/acne-prone users feel protected rather than alarmed.
- Test whether users return for the 7-day check-in.
- Test whether users value "no paid ranking influence" as part of trust.
- Test whether "no safe match" states preserve trust instead of frustrating users.
- Test whether outcome tracking improves perceived personalization.

### Risk Mitigation

Innovation risks and fallbacks:

- **Risk:** Neutrality is hard to prove.  
  **Mitigation:** Show recommendation reasons and maintain visible recommendation firewall language.

- **Risk:** AI explanations may overclaim.  
  **Mitigation:** Constrain explanations to approved product/rule metadata and test against diagnosis/treatment language.

- **Risk:** Outcome learning becomes too complex too early.  
  **Mitigation:** Start with 7-day check-in and simple profile updates; defer advanced adaptation.

- **Risk:** Local catalog is incomplete.  
  **Mitigation:** Launch with one market and prioritize coverage by routine step, profile, and budget band.

- **Risk:** Safety flows feel scary or medical.  
  **Mitigation:** Use calm, conservative wording: pause, simplify, patch test, seek professional care if severe/persistent.

## Mobile App Specific Requirements

### Project-Type Overview

Routinelle is a mobile-first consumer skincare guidance product. The first version should prioritize a fast, trustworthy onboarding-to-routine experience on mobile screens, with responsive web/PWA support as the preferred MVP delivery model unless native app distribution is required for launch.

The product must support a short, low-friction user flow: sample preview, 7-8 question onboarding, routine generation, product explanation, save routine, product click, and 7-day check-in.

### Technical Architecture Considerations

- The MVP should be designed as mobile-first responsive web or PWA, with architecture that can later support native mobile apps.
- Recommendation logic should remain server-side or centrally controlled so rules, product metadata, and claim guardrails can be updated consistently.
- AI-generated explanations must be constrained by approved product/rule metadata and should not run as unconstrained client-side generation.
- Catalog operations should be separated from consumer app UX through an internal admin workflow.
- The system must support versioned catalog data so recommendation output can be traced to a specific catalog/rule state.
- The user profile and routine history model should support future mobile app features such as push reminders, progress photos, and offline routine viewing.

### Platform Requirements

- MVP must support mobile web viewport sizes as first-class.
- MVP should support modern iOS Safari and Android Chrome.
- Responsive desktop support is useful for admin/catalog operations but not the primary consumer experience.
- If packaged as a PWA, it should support installable home-screen behavior where feasible.
- Native app launch is post-MVP unless app-store distribution, push notifications, or camera/photo progress become launch-critical.

### Device Permissions

MVP should minimize permissions.

- No camera permission required for core recommendations.
- No photo library permission required for MVP core flow.
- No precise location permission required; user-selected country/market is enough.
- Push notification permission should be optional and requested only after the user has saved a routine or opted into check-ins.
- If photo progress journal is added later, request photo/camera access only at the moment of use and explain purpose clearly.

### Offline Mode

- Full offline recommendation generation is not required for MVP.
- Users should be able to view a saved routine if previously loaded, if technically feasible.
- Product availability, product links, and catalog-backed recommendations require network access.
- Offline failure states should be clear and non-alarming: "Reconnect to refresh product availability or generate a new routine."

### Push / Reminder Strategy

MVP reminders should support skincare adherence, not general wellness coaching.

- Routine reminder: morning/evening skincare.
- Sunscreen reminder, if user opts in.
- 7-day check-in reminder after routine creation.
- Later: 14/30-day tracking, seasonal adjustment, product replacement reminders.
- Notification opt-in should happen after value is shown, not during first onboarding.

### Store Compliance

If distributed through App Store or Google Play:

- App metadata must avoid medical diagnosis/treatment wording.
- Screenshots and descriptions must position the product as cosmetic skincare guidance.
- Claims around acne, irritation, allergy, or disease must be conservative and non-diagnostic.
- If photo progress is added, store listing must avoid implying automated disease detection.
- Privacy nutrition labels / data safety declarations must reflect collection of skin profile, routine data, product interactions, and optional photos if applicable.
- The app must provide account/data deletion pathways where required by platform and privacy expectations.

### Implementation Considerations

- Current routine entry should be structured search/selection, not open free text as the primary MVP path.
- No-safe-match state must be implemented as a normal recommendation outcome.
- Product catalog publication should validate required metadata before products are eligible for recommendation.
- Safety and claim guardrails should be testable independently of the UI.
- Analytics should track onboarding completion, time-to-routine, save/click actions, check-in return, fallback/no-match states, and safety events.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Trust-first problem-solving MVP.

The MVP should prove that users trust Routinelle enough to act on a free starter routine. It should not try to prove every future capability at once. The fastest path to validated learning is to deliver one high-quality journey: onboarding -> skin profile -> safe AM/PM starter routine -> product explanation -> save/click -> 7-day check-in.

**Resource Requirements:**  
MVP requires at minimum:

- Product owner / PM for scope and rules governance
- UX/UI designer for mobile-first onboarding and routine experience
- Full-stack engineer or small product engineering team
- Product/catalog operations owner for ingredient/product metadata
- Cosmetic science or skincare expert reviewer for rules, copy, and safety boundaries
- Optional legal/privacy support for GDPR, claims, and data handling review

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

- Confused shopper gets a safe starter routine.
- Sensitive/acne-prone user receives conservative Gentle Start guidance.
- Returning user completes first 7-day outcome check-in.
- Product catalog manager maintains structured product data.
- Safety/support flow handles bad reactions conservatively.

**Must-Have Capabilities:**

- Mobile-first responsive web/PWA experience
- Sample recommendation preview before signup
- 7-8 question onboarding
- Skin profile summary
- Complete AM/PM starter routine
- Core routine steps: cleanser, moisturizer, sunscreen, optional acne/support step
- 2-3 locally buyable product options per step, or "no safe match"
- Budget-aware recommendations
- Ingredient and skin-fit explanations in plain language
- Rule-first recommendation engine with weighted scoring
- AI explanations constrained to approved product/rule metadata
- Curated single-market catalog with coverage across core steps, priority profiles, and budget bands
- Structured product metadata validation
- Routine conflict validation before display
- Sensitive-skin / barrier-damaged Gentle Start routine variant
- Conservative symptom triage copy, not diagnosis
- Patch-test guidance
- Routine save
- Product click tracking
- First 7-day outcome check-in
- Privacy controls for user profile data
- Recommendation firewall language and business rule

**Explicit MVP Simplifications:**

- Current routine entry is optional and structured; it supports conflict detection only, not deep optimization.
- Skin Recovery Mode is simplified into Gentle Start / Reset guidance, not a separate complex workflow.
- Symptom triage is conservative static guidance, not decision-tree medical assessment.
- Photo progress tracking is out of MVP unless explicitly reprioritized.
- Native app launch is out of MVP unless app-store distribution becomes a hard launch requirement.
- Multi-market catalog is out of MVP.
- General wellness habit coaching is out of MVP.

### Post-MVP Features

**Phase 2 (Post-MVP Growth):**

- 14/30-day outcome tracking
- Richer current-routine analysis
- Seasonal routine adjustment
- Product replacement assistant
- Product dupe finder
- New product checker: "Can I use this?"
- Ingredient conflict alerts
- Advanced sensitive-skin mode
- Optional photo progress journal
- Ingredient/product monitor
- Retailer integrations or affiliate APIs
- Broader catalog coverage
- Brand/retailer partnerships with recommendation firewall

**Phase 3 (Expansion):**

- Multi-market product catalog
- Verified product data pipelines
- Professional review partnerships
- Long-term skin history and routine optimization
- Privacy-first photo progress tracking
- Market monitoring for reformulations, new ingredients, and better alternatives
- Native mobile apps if validated by retention/reminder/photo needs
- Broader beauty decision support beyond skincare if core skincare trust is proven

### Risk Mitigation Strategy

**Technical Risks:**

- Risk: recommendation quality depends on catalog completeness.  
  Mitigation: require metadata validation before products are eligible for recommendation; measure catalog coverage by routine step/profile/budget, not only product count.

- Risk: AI explanations may overclaim.  
  Mitigation: constrain AI output to approved product/rule metadata and run claim-guardrail tests.

- Risk: recommendation behavior is hard to debug.  
  Mitigation: deterministic rule-first engine, versioned catalog/rules, traceable explanation sources.

- Risk: current routine analysis becomes too complex.  
  Mitigation: keep current routine entry structured and optional in MVP.

**Market Risks:**

- Risk: users may not trust another skincare app.  
  Mitigation: free full first routine, visible neutral recommendation logic, no paid ranking influence, clear ingredient rationale.

- Risk: users may not act on recommendations.  
  Mitigation: optimize for routine save, product click, and "I understand what to buy next" metrics.

- Risk: local availability may disappoint users.  
  Mitigation: start with one market and prioritize locally buyable options per required step.

**Resource Risks:**

- Risk: catalog creation and maintenance is labor-intensive.  
  Mitigation: start with one market, curated coverage, manual expert-in-the-loop operations, and clear metadata schema.

- Risk: safety/cosmetic claim review slows launch.  
  Mitigation: keep scope cosmetic, avoid diagnosis/treatment claims, use approved copy blocks, defer higher-risk features like automated photo analysis.

- Risk: MVP scope expands into wellness, marketplace, or medical product.  
  Mitigation: keep MVP centered on one job: safe, understandable, locally buyable starter routine.

## Functional Requirements

This section is the capability contract for downstream UX, architecture, epic, and story work. Capabilities not listed here are out of scope unless explicitly added later.

### User Onboarding & Profile Capture

- FR1: Users can view a sample skincare recommendation preview before account creation.
- FR2: Users can complete a short onboarding questionnaire to provide skin type, concerns, sensitivity, budget, and local market.
- FR3: Users can indicate acne-prone, sensitive, irritated, or barrier-damaged skin conditions as part of onboarding.
- FR4: Users can provide optional current routine information for conflict detection.
- FR5: Users can skip current routine entry and still receive a complete starter routine.
- FR6: Users can review a generated skin profile summary before or alongside the routine.
- FR7: Users can update their skin profile inputs after the first routine is generated.

### Routine Recommendation

- FR8: Users can receive a complete AM/PM starter routine based on their profile.
- FR9: Users can receive recommendations for core routine steps: cleanser, moisturizer, sunscreen, and optional acne/support step when appropriate.
- FR10: Users can receive 2-3 product options per routine step where safe catalog matches exist.
- FR11: Users can receive a clear "no safe match" state when the system cannot confidently recommend a product.
- FR12: Users can receive budget-aware product recommendations.
- FR13: Users can receive recommendations grounded in local market availability.
- FR14: Users can save a generated routine.
- FR15: Users can access saved routine details after initial generation.

### Explainability & Trust

- FR16: Users can view plain-language explanations for why each routine step exists.
- FR17: Users can view ingredient and skin-fit rationale for each recommended product in a neutral, cosmetic-science-oriented voice.
- FR18: Users can view cautions or reasons why certain products or ingredient types may not fit their profile.
- FR19: Users can see language explaining that recommendations are neutral and not altered by brand payment.
- FR20: Users can distinguish product recommendation logic from product purchase links or affiliate relationships.
- FR21: Users can view conservative, non-diagnostic safety explanations when relevant.

### Safety, Conflict Detection & Gentle Start

- FR22: The system can detect known routine conflicts before displaying a routine.
- FR23: The system can flag duplicate or overly aggressive active ingredient patterns.
- FR24: The system can adjust recommendations for sensitive, irritated, acne-prone, or barrier-damaged profiles.
- FR25: The system can provide a Gentle Start routine variant for sensitive or barrier-damaged users.
- FR26: Users can receive patch-test guidance when new products or active ingredients are recommended.
- FR27: Users can receive conservative professional-care guidance for severe, persistent, worsening, or high-risk symptoms.
- FR28: The system can block diagnosis and treatment claims from user-facing recommendation copy.
- FR29: The system can prevent display of a routine that fails safety validation.

### Outcome Tracking & Routine Adaptation

- FR30: Users can receive a 7-day check-in after routine generation.
- FR31: Users can report routine adherence during check-in.
- FR32: Users can report outcomes such as dryness, redness, burning, acne change, hydration, and irritation.
- FR33: The system can update user profile signals based on reported outcomes.
- FR34: Users can receive adjusted guidance or product alternatives based on check-in outcomes.
- FR35: The system can log irritation, worsening, confusion, or unsafe-use reports as safety signals.

### Product Catalog & Recommendation Governance

- FR36: Admin users can create and maintain product records.
- FR37: Admin users can define product category, routine step, INCI list, key ingredients, function tags, caution tags, verified claims, price, size, cost-per-unit where available, availability, and last verified date.
- FR38: The system can validate required product metadata before a product becomes recommendation-eligible.
- FR39: Admin users can publish, unpublish, or flag products for review.
- FR40: Admin users can mark products with formula-change or data-freshness flags.
- FR41: The system can exclude products from recommendations based on missing metadata, unsafe fit, or unavailable status.
- FR42: The system can trace recommendations, warnings, and explanations to product attributes, rules, source notes, or approved copy blocks.
- FR43: Admin users can manage recommendation rules, product tags, caution tags, and approved explanation copy.
- FR44: The system can preserve catalog/rule version context for generated recommendations.

### Privacy, Consent & Account Data

- FR45: Users can create an account to save routines and track outcomes.
- FR46: Users can use the first routine experience before mandatory account commitment where product flow allows.
- FR47: Users can consent to collection of profile and routine data.
- FR48: Users can view what personal data is used for recommendations.
- FR49: Users can delete profile data.
- FR50: Users can delete optional photos if photo progress is added later.
- FR51: The system can keep photo progress optional and separate from core recommendation requirements.
- FR52: The system can avoid requiring precise location, camera, or photo permissions for core MVP recommendations.

### Analytics & Business Rules

- FR53: The system can track onboarding completion.
- FR54: The system can track routine generation completion.
- FR55: The system can track routine saves.
- FR56: The system can track product link clicks.
- FR57: The system can track 7-day check-in completion.
- FR58: The system can track fallback/no-safe-match states.
- FR59: The system can track safety events and professional-care guidance triggers.
- FR60: The system can enforce a recommendation firewall so commercial partnerships do not alter personalized ranking.
- FR61: Admin users can identify catalog coverage gaps by routine step, priority profile, budget band, and local market.

## Non-Functional Requirements

### Performance

- NFR1: Users should be able to complete onboarding and receive a starter routine in under 5 minutes for at least 80% of completed onboarding sessions.
- NFR2: Routine generation should complete within 2 seconds p95 after onboarding submission, excluding third-party retailer redirects.
- NFR3: Core mobile pages should load quickly enough to avoid onboarding abandonment on normal mobile connections.
- NFR4: Admin catalog operations should support efficient entry and review of product metadata without blocking consumer recommendation flows.
- NFR5: The app should remain usable on modern iOS Safari and Android Chrome mobile browsers.

### Security & Privacy

- NFR6: User profile data, routine data, reaction data, and optional photo data must be protected in transit and at rest.
- NFR7: Access to admin/catalog tools must be restricted to authorized internal users.
- NFR8: Users must be able to understand what personal data is used for recommendations.
- NFR9: Users must be able to delete profile data.
- NFR10: Optional photos, if added later, must be deletable and must not be required for core recommendations.
- NFR11: The product must minimize sensitive data collection and avoid requiring precise location, camera, or photo permissions for MVP routine generation.
- NFR12: Data collection and consent flows must support GDPR-oriented privacy expectations for a France/EU launch.

### Reliability, Safety & Guardrails

- NFR13: 100% of displayed routines must pass safety and claim-guardrail checks before display.
- NFR14: The system must support deterministic recommendations for the same user profile and same catalog/rule version.
- NFR15: The system must support a "no safe match" state rather than forcing recommendations when confidence or safety criteria are not met.
- NFR16: User-facing recommendation copy must avoid diagnosis, treatment, cure, prevention, or disease-identification claims.
- NFR17: Recommendation explanations must be traceable to product attributes, rules, approved copy, or source notes.
- NFR18: Safety events such as irritation, worsening symptoms, confusion, or unsafe-use reports must be logged for review.

### Accessibility

- NFR19: Consumer-facing MVP screens should follow WCAG 2.1 AA-oriented design practices where feasible.
- NFR20: Onboarding, routine cards, warnings, and product explanations must be readable on mobile screens without relying only on color to convey meaning.
- NFR21: Safety and warning language must be written in clear, calm, plain language.
- NFR22: Recommendation copy must use a neutral, precise, cosmetic-science-oriented voice and avoid influencer-style hype or sales pressure.
- NFR23: Interactive controls must be usable on touch screens and support common mobile accessibility patterns.

### Scalability

- NFR24: The MVP architecture should support expansion from one curated market catalog to additional markets without redesigning core profile, product, or recommendation models.
- NFR25: The product catalog model should support at least 300 curated products for the first market and expansion to larger catalogs later.
- NFR26: Recommendation logic should support additional skin concerns, budget bands, and product categories without requiring a full system rewrite.
- NFR27: Analytics should support cohort tracking for onboarding, routine saves, product clicks, check-ins, fallback states, and safety events.

### Integration & Data Quality

- NFR28: Product records must pass required metadata validation before becoming recommendation-eligible.
- NFR29: Product catalog data must include last verified date, verified claim fields, cost-per-unit where available, and formula-change or freshness flags.
- NFR30: Product links and local availability data must be able to handle stale or unavailable products without breaking the user journey.
- NFR31: External retailer or affiliate integrations must not be required for the MVP to generate a routine.
- NFR32: Recommendation ranking must remain independent from affiliate, brand, or retailer commercial relationships.

### Maintainability & Governance

- NFR33: Admin users should be able to update product metadata, tags, availability, and rule inputs without requiring app redeployment where feasible.
- NFR34: Recommendation rules, catalog versions, and explanation copy should be auditable.
- NFR35: Claim-guardrail copy should be centrally managed so unsafe wording can be corrected consistently.
- NFR36: The system should support testing of recommendation rules, fixture profiles, catalog validation, and claim-language checks.
