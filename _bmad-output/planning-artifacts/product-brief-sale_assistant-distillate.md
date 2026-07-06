---
title: "Product Brief Distillate: sale_assistant"
type: llm-distillate
source: "product-brief-sale_assistant.md"
created: "2026-05-07T11:04:57+0200"
purpose: "Token-efficient context for downstream PRD creation"
---

# Product Brief Distillate: Routinelle

## Product Identity

- Product name selected: **Routinelle**.
- Dropped names:
  - **SkinWise**: rejected because active skincare apps and trademark signals already exist.
  - **Skinlyst**: rejected because Skinlyst AI already exists and is close to the concept.
  - **Dermalyn**: liked initially but deprioritized because existing skin/aesthetic businesses use it.
- Positioning: **Routinelle: personalized skincare routines that learn with your skin.**
- Core promise: neutral skincare consultant that understands user skin, explains ingredients, recommends routines/products, tracks outcomes, and adapts over time.

## Strategic Thesis

- Routinelle should not compete with influencers by being louder or with retailers by selling harder.
- Routinelle should compete by being neutral, ingredient-aware, user-aware, safety-conscious, and adaptive.
- Trust is the product's main asset; recommendation transparency and commercial neutrality are central.
- The strongest moat is decision quality plus persistent skin memory, not AI novelty alone.

## Primary Users

- Primary user: confused skincare shopper who wants better skin but does not know which products, ingredients, or routines to trust.
- High-priority early segments:
  - Acne-prone users with oily or oily-combination skin and possible damaged skin barrier.
  - Sensitive-skin users who often experience redness, burning, or irritation.
  - Budget-conscious users who want effective routines and hate wasting money.
- User success: routine feels credible, affordable, locally actionable, and safe enough to try.
- First aha moment: "This app understands my skin and explains why this routine fits me."

## MVP User Flow

- Landing page promises a reliable, trusted skincare consultant.
- Show sample recommendation preview before requiring account commitment.
- User completes 7-8 question onboarding.
- User can optionally enter current routine/products.
- App outputs skin profile summary.
- App outputs morning/evening routine.
- App recommends 2-3 product options per routine step.
- App explains ingredients and why each product fits.
- App shows budget alternatives and local availability/product links.
- App displays safety warnings and patch-test guidance when relevant.
- App asks user to save routine and create account for tracking.
- App runs first 7-day check-in after routine start.

## Questionnaire Design Signals

- Questionnaire should be short, easy, and accurate enough to classify likely cosmetic skin profile.
- It should classify skin type and common concerns without claiming medical diagnosis.
- Suggested question count: 7-8 core questions, with optional advanced details later.
- Core questionnaire dimensions:
  - Safety triage symptoms.
  - Skin type: oily, oily-combination, dry, dry-combination, medium/normal, unsure.
  - Skin feel after cleansing and no product for 30 minutes.
  - Top concerns: anti-aging, hydration, acne, pores, dark spots, irritation/redness, oil control, barrier repair/sensitivity.
  - Sensitivity frequency: rarely, sometimes, often, almost always.
  - Known avoidances: fragrance, essential oils, alcohol-heavy products, retinoids, acids/AHA/BHA, benzoyl peroxide, unknown/none.
  - Current routine level: none, cleanser/moisturizer only, 3-4 steps, advanced with actives.
  - Preferred routine intensity: minimal, balanced, advanced.
  - Budget range and local market.
- Exact age, gender, precise location, photos, medical history, pregnancy status, and full product history should be optional.

## MVP Recommendation Output

- Output package:
  - Skin profile summary.
  - Morning/evening routine.
  - 2-3 product options per step.
  - Ingredient explanation for each recommendation.
  - Current routine conflict warnings.
  - Budget alternative.
  - Local availability/product links.
  - Safety warnings where relevant.
  - 7/14/30-day check-in schedule.
- Avoid too many products per step; too much choice weakens confidence.
- Recommendation tone should be professional cosmetic scientist style: precise, neutral, evidence-aware, not influencer-like.
- Explain "why this product" and "why not this product" where possible.

## Recommendation Engine

- MVP engine design: hybrid of rule-based matching, structured product database, AI-generated explanations, and manual review for edge cases.
- Rule-based matching keeps recommendations controlled and safer.
- Structured product database keeps product facts reliable.
- AI explanation makes output feel personalized and understandable.
- Manual review is for flagged profiles, unusual cases, or safety-sensitive recommendations.
- Full automation and photo-based diagnosis are out of scope for MVP.

## Product Catalog

- Launch with approximately **300 curated products for one market**.
- Working first market assumption: France.
- Product categories should cover cleanser, moisturizer, sunscreen, acne treatment, hydrating serum, calming/barrier products, exfoliants, brightening/dark spot products, anti-aging products, sensitive-skin options, and budget/mid/premium tiers.
- Product data fields:
  - Brand.
  - Product name.
  - Product category.
  - Routine step: cleanse, treat, hydrate, protect.
  - Full INCI ingredient list.
  - Key active ingredients.
  - Function tags: hydrating, calming, exfoliating, brightening, oil control, barrier repair, anti-aging, acne support, sunscreen, sensitive-skin suitable.
  - Suitable skin types.
  - Suitable concerns.
  - Avoid/caution tags: fragrance, essential oils, strong acids, retinoid, alcohol-heavy, comedogenic risk, strong active.
  - Sensitive-skin suitability.
  - Dermatologist-tested claim.
  - Bio/natural claim.
  - Cruelty-free claim.
  - Price.
  - Size.
  - Cost per ml.
  - Local retailers/availability.
  - Affiliate/product link.
  - Last verified date.
  - Formula-change flag.
- Ingredient knowledge sources discussed: CosIng and COSMILE Europe.
- Retail/product availability sources discussed: parapharmacy platforms, Sephora, Nocibe, Marionnaud, official product pages, affiliate APIs, partnerships, manual curation.
- Product data refresh: every 6 months for stable catalog data; faster review triggered by user reports, high-click products, formula-change signals, brand announcements, sensitive-skin complaints, or availability changes.

## Safety and Escalation

- Product should remain in cosmetic skincare guidance, not medical diagnosis/treatment.
- Avoid claims:
  - Diagnoses acne/rosacea/eczema/allergy.
  - Replaces a dermatologist.
  - Cures acne or any medical condition.
  - Upload a photo and identify disease.
  - Guaranteed non-irritating.
  - Clinically proven unless supported for exact claim.
  - Safe for everyone.
- Safer wording:
  - Cosmetic skincare guidance.
  - Helps build a routine based on your skin profile.
  - Explains ingredients and possible irritation risks.
  - Tracks self-reported results.
  - Not a medical diagnosis.
  - See a dermatologist for severe, painful, spreading, swollen, bleeding, infected-looking, or persistent symptoms.
- Safety package:
  - Symptom triage.
  - No medical diagnosis wording.
  - Ingredient caution warnings.
  - Routine conflict detection.
  - Patch-test guidance.
  - Slow-start sensitive-skin mode.
  - Skin Recovery Mode.
  - Dermatologist escalation.
  - Flagged-case manual review.
- Escalation symptoms:
  - Severe burning or pain.
  - Swelling.
  - Open wounds, blisters, or oozing.
  - Rash spreading quickly.
  - Fever or feeling ill with skin symptoms.
  - Symptoms around eyes, lips, mouth, or genital area.
  - Persistent or serious irritation.

## Skin Recovery Mode

- Triggered when user reports irritation, worsening skin, side effect, or disappointment.
- Recovery Mode flow:
  - Ask what happened: burning, redness, itching, swelling, breakout, dryness.
  - Ask when it started.
  - Identify newest product or highest-risk active.
  - Classify severity: mild, moderate, severe.
  - For mild reaction: pause newest active, simplify routine, keep gentle cleanser/moisturizer/sunscreen, recommend patch testing, update profile.
  - For moderate reaction: stop suspected product, switch to barrier recovery, avoid actives temporarily, monitor, suggest professional advice if persistent.
  - For severe reaction: stop normal recommendations and advise dermatologist/medical care.
- Communication tone: non-defensive, safety-first, no blame.
- Sample tone: "Skin can react differently even to well-matched products. Let's protect your skin first, pause the likely trigger, and update your profile so future recommendations are safer."

## Routine Conflict Detector

- Users can enter current products.
- App detects conflicts and overload:
  - Too many exfoliating acids.
  - Harsh cleanser plus retinoid.
  - Benzoyl peroxide layered too aggressively.
  - Acne actives introduced while barrier is damaged.
  - No barrier-repair moisturizer in acne routine.
  - Sensitive user trying strong anti-aging actives too early.
- Conflict detector builds trust because it explains what is wrong with current routine before recommending new products.

## Sensitive Skin Mode

- Prioritize dermatologist-tested, low-irritation, fragrance-free, barrier-supporting products where supported by product claims/data.
- Avoid strong anti-aging actives too early.
- Use slow progression:
  - First: hydration and barrier support.
  - Then: gentle brightening if tolerated.
  - Later: low-strength retinoid, peptide, or stronger active if tolerated.
- Avoid overclaiming "dermatologist proven non-irritating"; use safer labels like dermatologist-tested, suitable for sensitive skin, fragrance-free, low-irritation profile, patch-test recommended, avoids common irritants based on profile.

## Acne User Logic

- Acne users may have damaged barrier from over-treatment.
- App should support "barrier-first acne plan":
  - Week 1: calm irritation and repair barrier.
  - Week 2: introduce acne active slowly.
  - Week 3: check acne, oiliness, dryness, irritation.
  - Week 4: adjust routine based on results.
- This avoids common aggressive acne routines that worsen irritation.

## Budget User Logic

- Budget core routine: cleanse, hydrate, protect, then add one targeted active only if needed and affordable.
- Explain price vs quality through:
  - Ingredient value.
  - Ingredient percentage when meaningful.
  - Formulation quality and stability.
  - Brand reliability.
  - Cost per use.
  - Replacement priority.
- Suggested principle: spend more on sunscreen if texture affects daily use; save on cleanser because it washes off quickly; choose simple moisturizer for barrier repair.
- Budget value proposition: app saves money by stopping wrong purchases.

## Outcome Tracking

- Outcome tracking is core differentiator.
- Check-in cadence:
  - Day 1-3: burning, redness, itching, swelling, dryness.
  - Day 7: tolerance and early issues.
  - Day 14: early improvement in hydration, acne, oiliness, irritation.
  - Day 30: visible outcome review.
- Track:
  - Improvement or worsening.
  - Side effects.
  - Irritation.
  - Dryness.
  - Acne changes.
  - Hydration.
  - Dark spots/brightness.
  - Oiliness.
  - Texture.
- Profile updates based on outcomes:
  - Avoid fragrance-heavy products.
  - Possible sensitivity to strong acids.
  - Hydration improved with ceramide moisturizer.
  - Acne worsened after heavy oil-based product.
  - Retinoid should be introduced more slowly.
- Retention value: app learns from real skin response, not just first questionnaire.

## Photo Tracking

- MVP should not rely on automated AI photo diagnosis.
- Photo feature can be Phase 1.5 as optional "Photo Progress Journal".
- Users can upload Day 0, Day 14, Day 30 photos.
- App can show side-by-side comparison.
- User self-rates visible changes.
- App should state that recommendations are based on questionnaire, product history, and self-reported outcomes, not diagnostic image analysis.
- Photos should be optional and deletable.
- Cropped skin-area photos should be allowed.

## Reminders and Lifestyle

- General lifestyle coaching should not be core MVP because it risks broadening product into wellness habit tracker.
- MVP reminders should be "reminders that help skincare work":
  - Morning/evening routine reminder.
  - Sunscreen reminder.
  - Product check-in reminder.
  - 7/14/30-day review reminder.
  - Optional water/sleep reminder later.
- Sport/diet coaching should wait unless directly tied to a specific skin goal.

## Privacy and GDPR Signals

- Privacy is a competitive advantage because skin data is personal.
- Required MVP data:
  - Skin type.
  - Main skin concerns.
  - Sensitivity/irritation level.
  - Current routine or no routine.
  - Budget range.
  - Country/local market.
- Optional data:
  - Face photos.
  - Exact age; use age range instead.
  - Gender.
  - Precise city.
  - Medical history.
  - Pregnancy status.
  - Full product history.
  - Account creation before preview.
- Privacy controls:
  - Clear consent before photo upload.
  - Delete photos anytime.
  - Delete account/profile data anytime.
  - Allow progress tracking without photos.
  - Explain what data is used for recommendations.
  - Never sell personal skin data.
  - Separate personal recommendation data from anonymous product analytics.
  - Simple privacy summary in onboarding.

## Monetization

- First full routine should be free to build trust.
- Free:
  - Questionnaire.
  - Full first routine.
  - Basic ingredient explanations.
  - Limited product options.
  - Safety warnings.
  - First 7-day check-in.
- Premium:
  - Ongoing routine optimization.
  - 14/30-day progress tracking.
  - Current routine conflict detector.
  - Product dupe finder.
  - New product checker: "Can I use this?"
  - Ingredient conflict alerts.
  - Seasonal routine adjustments.
  - Product replacement assistant.
  - Advanced sensitive-skin mode.
  - Photo progress journal.
  - Ingredient/product monitor.
- Business revenue:
  - Affiliate links.
  - Retailer partnerships.
  - Brand catalog listing/data services.
  - Sampling campaigns.
  - Clearly labeled sponsored education content.
- Recommendation firewall: brand payments must not change personalized routine ranking.
- User-facing trust statement: recommendations are ranked by skin fit, ingredients, budget, availability, and outcome history; brand payments do not change personalized routine.

## Signup and Onboarding

- Do not require signup before first routine preview if possible.
- Recommended flow: questionnaire -> routine preview -> signup to save, track, shop, or receive reminders.
- Sample recommendation preview should demonstrate:
  - Skin profile summary.
  - Recommended routine.
  - Product reason card.
  - Ingredient explanation.
  - Irritation warning.
  - Budget alternative.
- First-screen promise options:
  - "Your trusted skincare consultant for personalized routines, ingredient explanations, and smarter product choices."
  - "A neutral skincare consultant that understands your skin, explains every ingredient, and helps you choose products with confidence."

## Retention and Premium Use

- Return triggers:
  - Season changed.
  - Skin condition improved and user wants to perfect skin.
  - Environment changed.
  - Life situation changed.
  - Budget changed.
  - Curiosity about other products or brands.
  - Product finished, discontinued, expensive, or unavailable.
- Returning features:
  - Seasonal routine adjustment.
  - Skin goal progression.
  - Monthly routine check-up.
  - Product replacement assistant.
  - New product curiosity checker.
  - Ingredient conflict alerts.
  - Life change mode.
  - Progress journal.
- Premium promise: "Your personal skincare analyst that keeps watching the market, your skin changes, and your routine performance."

## Brand and Retailer Partnerships

- Brands can pay to be present, but not to be recommended.
- Acceptable:
  - Product catalog listing fees.
  - Verified ingredient data submission.
  - Sampling campaigns clearly labeled.
  - Affiliate commission after neutral recommendation.
  - Retailer availability integration.
  - Sponsored education content clearly labeled.
  - Aggregate brand analytics, not personal user data.
- Not acceptable:
  - Paid placement inside personalized routines.
  - "Recommended for you" because a brand paid.
  - Hiding better products.
  - Pushing unsuitable products.
  - Changing ranking logic for commercial reasons.

## Competitors and Alternatives

- Alternatives:
  - TikTok/influencers: strong influence and trends, weak personalization/reliability.
  - Google: too much fragmented information.
  - Reddit/community: opinions but inconsistent expertise.
  - Sephora/store assistant: face-to-face help but limited catalog and sales incentives.
  - Dermatologist: medical authority but not always accessible for everyday cosmetic product choice.
  - ChatGPT: flexible advice but not connected to verified local product catalog and outcome history.
  - Existing apps such as SkinWise/Skinlyst/Skin Bliss indicate crowded interest in AI skincare guidance.
- Routinelle should avoid competing on:
  - Entertainment.
  - Medical diagnosis.
  - Face-to-face emotional reassurance.
  - Marketplace breadth too early.
  - Brand hype.
  - Perfect AI photo analysis.

## Success Metrics

- Primary product metrics:
  - Completed questionnaires.
  - Saved routines.
  - 7-day check-ins completed.
  - Users reporting recommendations were helpful/credible.
- Commercial metrics:
  - Product link click-through rate.
  - Premium conversion after free routine.
  - Product alternative/dupe feature usage later.
- Retention metrics:
  - 14/30-day check-in completion.
  - Return for seasonal or life-change routine updates.
  - New product checker usage.
- Safety metrics:
  - Bad-reaction cases routed through Skin Recovery Mode.
  - Serious symptoms escalated to professional care guidance.

## Explicit Out of Scope for MVP

- AI medical diagnosis.
- Automated disease detection from photos.
- Claims to cure acne, eczema, allergy, or medical conditions.
- Replacing dermatologists.
- Paid manipulation of personalized routine ranking.
- Large multi-country product catalog.
- Full marketplace functionality.
- Mandatory full-face photo upload.
- General wellness habit tracker as core product.
- Barcode/photo scan of every product unless later prioritized.

## Open Questions for PRD

- Confirm first market: France remains the working assumption.
- Confirm platform: mobile app, web app, or responsive web-first MVP.
- Confirm whether account creation is required to save routine only or before product links.
- Decide whether current routine conflict detector is free or premium in MVP.
- Decide exact premium paywall after free first routine.
- Define which product retailers and parapharmacy sources are available for legal/terms-compliant data collection.
- Decide if dermatologist/skincare professional review is required before launch or can be advisory.
- Confirm language support for MVP: French only, English only, or bilingual.
- Confirm whether local product catalog includes pharmacy brands, Sephora/Nocibe/Marionnaud, organic/bio retailers, or all.
