---
status: approved
createdAt: 2026-05-13
approvedAt: 2026-05-13
project: sale_assistant
changeScope: minor
sourceReport: _bmad-output/planning-artifacts/implementation-readiness-report-2026-05-13.md
affectedArtifacts:
  - _bmad-output/planning-artifacts/epics.md
---

# Sprint Change Proposal - Routinelle Epic Readiness Corrections

## 1. Issue Summary

The implementation readiness check found that the planning set is close to implementation-ready, but two epic/story issues should be corrected before sprint execution.

### Trigger

The trigger was the 2026-05-13 implementation readiness report.

### Core Problem

Two stories in `_bmad-output/planning-artifacts/epics.md` need targeted correction:

1. **Story 1.2 does not fully guarantee FR1.**
   - FR1 requires users to view a sample skincare recommendation preview before account creation.
   - Story 1.2 currently requires an entry point to preview or start a routine, but not the preview itself.

2. **Story 4.1 reads as a technical schema/model task.**
   - The story is needed, but its current framing is too technical for BMad story quality standards.
   - It should be reframed as an enabling implementation story with a concrete display-ready routine contract output.

### Evidence

From readiness report:

- FR coverage: 61/61 functional requirements covered.
- Critical violations: none.
- Major issues: two story-quality issues.
- Overall readiness status: NEEDS WORK.

## 2. Impact Analysis

### Epic Impact

**Epic 1: MVP Foundation, Auth, and Privacy-Safe Shell**

- Impact: Story 1.2 needs stronger acceptance criteria.
- Epic scope remains valid.
- No epic sequencing change required.

**Epic 4: Safe Routine Recommendation Engine**

- Impact: Story 4.1 needs clearer user/operator value and concrete testable output.
- Epic scope remains valid.
- No epic sequencing change required.

### Story Impact

Affected stories:

- Story 1.2: Update title, user story wording, and acceptance criteria.
- Story 4.1: Update title, user story wording, and acceptance criteria.

No stories are added, removed, or renumbered.

### Artifact Conflicts

**PRD**

- No PRD change required.
- PRD already includes FR1 and routine contract expectations.

**UX Design**

- No UX change required.
- UX already specifies sample recommendation preview and preview-before-commitment patterns.

**Architecture**

- No architecture change required.
- Architecture already supports display-ready routine contracts, recommendation domain models, API result wrappers, Supabase migrations, and version context.

### Technical Impact

No technical architecture change. These edits improve implementation clarity and acceptance criteria only.

## 3. Recommended Approach

### Selected Path

**Option 1: Direct Adjustment**

Modify the two existing stories inside the current epic structure.

### Rationale

- The issue is local to story quality, not product strategy.
- FR coverage remains complete.
- PRD, UX, and architecture are aligned.
- No rollback, MVP review, new epic, or sequencing change is needed.

### Effort Estimate

Low.

### Risk Level

Low.

### Timeline Impact

None expected. This should improve implementation speed by reducing ambiguity before story creation and development.

## 4. Detailed Change Proposals

### Change 1: Strengthen Story 1.2

**Artifact:** `_bmad-output/planning-artifacts/epics.md`

**Story:** Story 1.2

**Section:** Title, user story, and acceptance criteria

#### OLD

```markdown
### Story 1.2: Build Mobile-First Public App Shell and Sample Preview Entry

As a first-time visitor,
I want to see a trustworthy Routinelle landing shell and sample recommendation preview entry,
So that I understand the app's value before creating an account.

**Acceptance Criteria:**

**Given** a visitor opens Routinelle on mobile
**When** the public home page loads
**Then** they see a clear skincare-guidance promise and an entry point to preview or start a routine
**And** the page is mobile-first and usable at 320px width
**And** the UI uses Tailwind/shadcn primitives and the Routinelle visual foundation
**And** the design avoids marketplace-style navigation before the first routine
**And** no signup is required before seeing the initial value proposition
```

#### NEW

```markdown
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
```

#### Rationale

This closes the FR1 implementation gap. A developer can no longer satisfy the story with only a preview button or generic landing content.

### Change 2: Reframe Story 4.1

**Artifact:** `_bmad-output/planning-artifacts/epics.md`

**Story:** Story 4.1

**Section:** Title, user story, and acceptance criteria

#### OLD

```markdown
### Story 4.1: Build Recommendation Domain Models and Routine Schema

As a product system,
I want structured routine, routine step, product option, and recommendation state models,
So that generated routines can be deterministic, displayable, and testable.

**Acceptance Criteria:**

**Given** onboarding profile and eligible catalog models exist
**When** recommendation domain types and persistence schema are created
**Then** the system supports generated routines, AM/PM routine sections, routine steps, product options, recommendation states, and catalog/rule version references
**And** routine records can represent no-safe-match and safety-blocked states
**And** database fields use `snake_case` while TypeScript models use `camelCase`
**And** schema changes are implemented through Supabase migrations
```

#### NEW

```markdown
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
**And** database fields use `snake_case` while TypeScript domain models use `camelCase`
**And** schema changes are implemented through Supabase migrations
**And** fixture or contract tests verify that a sample generated routine can be serialized, persisted, returned through the standard API result wrapper, and rendered by routine UI components without raw database rows
```

#### Rationale

This keeps the necessary schema/model work but gives it a concrete implementation output: a display-ready routine contract that can be tested and used by later routine generation stories.

## 5. Checklist Results

### Section 1: Understand the Trigger and Context

- [x] 1.1 Triggering story identified: Story 1.2 and Story 4.1.
- [x] 1.2 Core problem defined: readiness report found story-quality gaps, not product-scope gaps.
- [x] 1.3 Evidence gathered: readiness report findings and affected story text.

### Section 2: Epic Impact Assessment

- [x] 2.1 Current affected epics can still be completed as planned.
- [x] 2.2 Required changes are story-level modifications inside Epic 1 and Epic 4.
- [x] 2.3 Remaining epics are not affected.
- [x] 2.4 No future epics are invalidated and no new epics are needed.
- [x] 2.5 Epic order and priority do not need to change.

### Section 3: Artifact Conflict and Impact Analysis

- [x] 3.1 PRD has no conflict and needs no modification.
- [x] 3.2 Architecture has no conflict and needs no modification.
- [x] 3.3 UX specification has no conflict and needs no modification.
- [N/A] 3.4 No secondary deployment, CI/CD, or infrastructure artifacts exist yet.

### Section 4: Path Forward Evaluation

- [x] 4.1 Direct Adjustment: viable, low effort, low risk.
- [N/A] 4.2 Potential Rollback: not applicable because no implementation has started.
- [N/A] 4.3 PRD MVP Review: not needed because MVP scope remains valid.
- [x] 4.4 Recommended path: Direct Adjustment.

### Section 5: Sprint Change Proposal Components

- [x] 5.1 Issue summary created.
- [x] 5.2 Epic impact and artifact adjustment needs documented.
- [x] 5.3 Recommended path documented.
- [x] 5.4 PRD MVP impact: none.
- [x] 5.5 Agent handoff: developer or Codex can apply the story edits after approval.

### Section 6: Final Review and Handoff

- [x] 6.1 Checklist completion reviewed.
- [x] 6.2 Proposal checked for consistency.
- [x] 6.3 User approval received.
- [N/A] 6.4 No sprint-status.yaml update required because no sprint plan exists and no stories are added, removed, or renumbered.
- [x] 6.5 Next steps confirmed: edits applied to epics and readiness should be rerun.

## 6. Implementation Handoff

### Scope Classification

Minor.

### Handoff Recipient

Developer agent or Codex can apply the edits directly to `_bmad-output/planning-artifacts/epics.md`.

### Success Criteria

- Story 1.2 explicitly requires a visible sample recommendation preview before account creation.
- Story 4.1 is reframed as an enabling story with a display-ready routine contract and persistence foundation.
- No FR coverage map changes are needed.
- No PRD, UX, or architecture changes are needed.
- Implementation readiness can be rerun and should move from NEEDS WORK to READY if no new issues are found.

## 7. Approval Request

Approve this proposal to apply the two edits to `_bmad-output/planning-artifacts/epics.md`.

Approval options:

- `yes`: approve and apply the edits.
- `edit`: request changes to the proposal before applying.
- `no`: stop the correction.

## 8. Approval and Execution Log

User approved the proposal on 2026-05-13.

Applied changes:

- Updated Story 1.2 in `_bmad-output/planning-artifacts/epics.md`.
- Updated Story 4.1 in `_bmad-output/planning-artifacts/epics.md`.

No PRD, UX, Architecture, FR coverage map, or sprint-status updates were required.
