# Phase 7 Decisions And Freeze Gaps

## Accepted Decisions

### P7-DEC-001: Use trigger-based maintenance

Decision: Review the KB when a source or decision change can alter a promoted
contract, not merely because time passed or files changed.

Status: Accepted for the project workflow.

### P7-DEC-002: Scale refresh depth to contract impact

Decision: Use narrow refreshes for one contract and at most two context domains;
use broad refreshes for architecture, taxonomy, generated-client shape, aggregate
ordering, or changes spanning more than two domains.

Status: Accepted for the project workflow.

### P7-DEC-003: Keep authority claim-specific

Decision: Founder decisions own public positioning; current checkout evidence
owns exact behavior; sibling repositories own design intent; deployed state
requires direct evidence.

Status: Accepted for the project workflow.

### P7-DEC-004: Select artifact regressions by context domain

Decision: Run affected artifact tests after narrow changes and all six after
taxonomy, broad architecture, identity, or multi-domain changes.

Status: Accepted for the project workflow.

## Freeze Gaps

### P7-GAP-001: Founder positioning

Question: Should the spec Freeze with CMS category, lead promise, and branded
technical terminology explicitly unresolved?

Current state: Technical context labels these as founder decisions and does not
invent answers.

Decision: Defer public category, lead promise, and branded terminology. Keep the
technical model available for truthful explanation without treating it as final
marketing language.

Status: Accepted by user instruction; not a Freeze blocker.

### P7-GAP-002: Proposed governance systems

Question: May the spec Freeze while registries, compatibility handshakes,
database applied-state tracking, support matrices, and formal review ownership
remain future governance rather than current capability?

Current state: Context records their absence and operational risk; no
implementation is claimed or required by the KB population goal.

Decision: Defer these systems as future governance outside this KB population
spec. Their current absence and risks remain documented without implying they
are implemented.

Status: Accepted by user instruction; not a Freeze blocker.

### P7-GAP-003: Proof disposition

Question: Are additional runtime Proofs required for the KB population spec?

Finding: Static source, existing tests, generated output, and context-only
artifact validation resolved the targeted technical claims. No unresolved claim
requires a new prototype to populate the KB.

Status: Accepted by user instruction; Proofs not required.
