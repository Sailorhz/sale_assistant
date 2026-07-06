---
title: "Product Brief: sale_assistant"
status: "complete"
created: "2026-05-06T17:37:43+0200"
updated: "2026-05-06T19:01:07+0200"
inputs:
  - "_bmad-output/brainstorming/brainstorming-session-2026-05-03-210919.md"
---

# Product Brief: Routinelle

_Working assumption: France is the initial market assumption for planning._

## Executive Summary

Routinelle is a neutral skincare consultant for consumers who want credible, personalized product and routine advice without sales pressure, influencer hype, or confusing ingredient research. The product helps users understand their skin profile, identify routine conflicts, and choose locally available products that fit their concerns, budget, sensitivity, and outcome history.

The initial product will launch as a mobile or web app for one European market, with France as the working assumption. It will provide a free first full routine to build trust: a short questionnaire, skin profile summary, morning and evening routine, 2-3 product options per step, ingredient explanations, budget alternatives, safety warnings, and a first 7-day check-in. The app does not diagnose or treat medical conditions; it provides cosmetic skincare guidance and escalates serious symptoms to professional care.

The long-term opportunity is to become a personal skincare analyst: a product that remembers each user's skin, monitors real outcomes, adapts routines over time, and watches the product market for better alternatives.

## The Problem

Skincare shoppers are overwhelmed by contradictory advice. A customer with acne, dark spots, irritation, or sensitive skin may consult TikTok, Google, Reddit, store assistants, product pages, or dermatologists, but each option has limitations. Influencer advice is entertaining but not personalized. Store assistants can be helpful but may be constrained by sales KPIs, one-store inventory, and incomplete ingredient knowledge. Search results are fragmented, and dermatologists are essential for medical issues but not always accessible for daily cosmetic product decisions.

The result is wasted money, product overload, damaged skin barriers, and low trust. Users often buy products that conflict with their current routine, are too aggressive for their sensitivity level, or do not match their budget or local availability. When a product causes irritation or fails to work, there is usually no structured follow-up to learn from the result.

## The Solution

Routinelle gives users a neutral, explainable skincare routine based on structured profile data and verified product information. The MVP begins with a 7-8 question onboarding flow covering skin type, top concerns, sensitivity, current routine, budget, local market, and safety triage. Users can optionally enter current products so the app can detect conflicts before recommending replacements.

The app then produces a personalized routine with concise explanations written in a professional cosmetic scientist style. For each recommendation, it explains why the product fits the user's skin profile, which ingredients matter, what cautions apply, and which lower-cost or locally available alternatives exist. After the first routine, Routinelle follows up through 7/14/30-day outcome tracking so future recommendations improve based on real user response.

## What Makes This Different

Routinelle is not trying to be the loudest skincare voice. It is designed to be the most personally relevant and explainable one.

- **Neutral recommendation logic:** Products are ranked by skin fit, ingredients, budget, availability, and outcomes, not brand payments.
- **Ingredient-based reasoning:** Recommendations explain active ingredients, routine role, possible irritants, and product tradeoffs.
- **Skin memory:** The app remembers questionnaire answers, preferences, sensitivities, reactions, and outcome history.
- **Routine conflict detection:** Users can identify risky combinations, such as too many exfoliants or aggressive acne actives layered onto a damaged barrier.
- **Safety and recovery:** The app uses symptom triage, patch-test guidance, sensitive-skin slow-start logic, and recovery mode for bad reactions.
- **Local product practicality:** A curated catalog of about 300 products for one market makes advice immediately actionable.

## Who This Serves

The primary user is a confused skincare shopper who wants better skin but does not know which products or ingredients to trust. Early focus should include acne-prone users, sensitive-skin users, and budget-conscious buyers because these groups feel the cost of wrong recommendations most acutely.

Success for the user means receiving a routine that feels credible, affordable, locally actionable, and safe enough to try. The first "aha" moment should be: "This app understands my skin and explains why this routine fits me."

Secondary stakeholders include skincare brands and retailers whose products are genuinely suitable for users, but partnerships must not influence personalized routine ranking. Dermatologists or skincare professionals can also contribute by reviewing escalation rules, questionnaire logic, and educational content.

## MVP Scope

The MVP should include:

- Free first full routine
- Sample recommendation preview before signup
- 7-8 question onboarding questionnaire
- Optional current routine entry
- Skin profile summary
- Morning/evening routine
- 2-3 product options per routine step
- Ingredient and skin-fit explanations
- Budget alternatives and local product links
- Current routine conflict warnings
- Symptom triage and no-diagnosis positioning
- Patch-test guidance and sensitive-skin slow-start mode
- Skin Recovery Mode for bad reactions
- First 7-day outcome check-in
- Hybrid recommendation engine: rule-based matching, structured product database, AI-generated explanation, and manual review for flagged edge cases
- Curated catalog of about 300 products for one market

Explicitly out of scope for the first version:

- AI medical diagnosis
- Automated disease detection from photos
- Claims to cure acne, eczema, allergy, or other medical conditions
- Paid manipulation of personalized recommendations
- Large multi-country product catalog
- Full marketplace functionality
- Mandatory full-face photo upload

## Data and Operations

The first product catalog should combine ingredient knowledge with product-specific facts. Ingredient references can draw from sources such as CosIng and COSMILE Europe, while product records should include brand, product name, INCI list, routine step, key actives, function tags, caution tags, price, size, cost per ml, local availability, claims, links, and last verified date.

The catalog can start with manual expert-in-the-loop curation. A 6-month verification cadence is reasonable for stable products, with faster review triggered by user reports, high-click products, formula-change signals, or sensitive-skin risk.

## Privacy and Trust

Skin data is sensitive, especially when it includes face photos, age, gender, location, budget, symptoms, and product reactions. The MVP should collect only the data needed for recommendations, make photos optional, allow cropped-area progress photos instead of full-face photos, and give users clear deletion controls for profile data and images.

The onboarding experience should explain what data is collected, why it improves recommendations, what is optional, and how users can delete it. The product should make a clear promise not to sell personal skin data. Privacy can become a competitive advantage because users are more likely to share skincare details when control and purpose are obvious.

## Business Model

The first full routine should be free to prove value. Monetization should focus on ongoing adaptation and decision support after trust is earned.

Potential premium features include 14/30-day tracking, monthly routine optimization, product dupe finder, new product checker, ingredient conflict alerts, seasonal routine adjustments, product replacement assistant, advanced sensitive-skin mode, optional photo progress journal, and ingredient/product market monitoring.

Business revenue can include affiliate links, retailer partnerships, product catalog services, sampling campaigns, or clearly labeled sponsored education content. A recommendation firewall is non-negotiable: commercial payments must not change personalized routine ranking.

## Success Criteria

Early success should be measured by signals of trust, usefulness, and commercial intent:

- Questionnaire completion rate
- Routine save rate
- Product link click-through rate
- 7-day check-in completion rate
- Percentage of users reporting that the routine was clear, useful, and credible
- Percentage of users who return for routine adjustment
- Number of bad-reaction cases safely routed through recovery or escalation
- Premium conversion after the free first routine

The first commercial signal is product clicks, but the strongest product-quality signals are saved routines and completed follow-up check-ins.

## Vision

If successful, Routinelle becomes a personal skincare intelligence layer: a trusted system that understands each user's skin history, learns from outcomes, compares products neutrally, tracks ingredient and formulation changes, and helps users adapt their routine as their skin, budget, season, and environment change.

In 2-3 years, the product can expand from a single-market skincare advisor into a broader beauty decision platform with verified product data, retailer integrations, professional review partnerships, privacy-first progress tracking, and premium ongoing skin routine optimization.
