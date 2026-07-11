# Decisions

## Accepted Decisions

### DEC-001: Purge the previous context files

Decision: The previous `.agents/context/` package-reference files should be
purged and the KB should start over.

Reason: They mirrored docs/package references too literally and did not capture
business, operational, architectural, teaching, marketing, and contributor
intent.

Status: Accepted by user instruction.

### DEC-002: Use a spec-first rebuild

Decision: Rebuild the KB through this phased spec before promoting new context.

Reason: The work is research-heavy, includes external ecosystem libraries, and
requires separating source evidence from interpretation.

Status: Accepted for this workflow pass.

### DEC-003: Treat docs as output examples, not the primary source taxonomy

Decision: Existing `docs/` can guide writing style and terminology, but should
not define the KB shape by itself.

Reason: The user clarified that the goal is to discover the intent and
operating model behind the code.

Status: Accepted by user instruction.

### DEC-004: Include ecosystem libraries in the KB scope

Decision: The KB should include the roles of `@stackpress/lib`,
`@stackpress/idea-*`, `@stackpress/ingest`, `@stackpress/inquire`, `reactus`,
`frui`, and `r22n`.

Reason: Stackpress mainly combines those libraries to work, so its operating
model cannot be explained well without them.

Status: Accepted by user instruction.

### DEC-005: Treat Phase 2 concepts as reviewable interpretations

Decision: The Phase 2 concept cards can drive the context taxonomy proposal,
but they are not accepted reusable context truth by themselves.

Reason: Several concepts combine direct source facts with interpretive product,
architecture, contributor, and positioning language.

Status: Accepted for this spec phase.

### DEC-006: Research ecosystem libraries before Stackpress synthesis

Decision: Study each complete sibling library repository independently, then
finish with the Stackpress source and prepare a topic backlog for deeper study.

Reason: Understanding each library on its own terms is necessary to distinguish
inherited ideas from Stackpress adaptations, coordination patterns, and unique
concepts.

Status: Accepted by user instruction.

### DEC-007: Supersede the first context taxonomy

Decision: The nine-file taxonomy in `context-taxonomy.md` is not the Phase 4
promotion plan. A replacement taxonomy must wait until library ledgers,
Stackpress synthesis, and topic exploration are complete.

Reason: The first proposal organized initial observations before the source had
been researched deeply enough to discover its intended concepts.

Status: Accepted by user correction.

### DEC-008: Complete the remaining research sequence in one pass

Decision: Finish all ecosystem ledgers, Stackpress synthesis, composition map,
pattern matrix, concept dispositions, and topic backlog before returning to
phase-by-phase approval.

Reason: The user approved the research direction and asked to complete the rest
of the source research including Stackpress.

Status: Accepted by user instruction.

### DEC-009: Separate design-intent and consumed-version authority

Decision: Use complete sibling repositories for current design-intent research,
but use installed packages and this monorepo's manifests for claims about exact
behavior in the current Stackpress checkout.

Reason: Some sibling packages are at `0.10.6` while this checkout consumes
`0.10.5`; collapsing them would hide compatibility drift.

Status: Adopted for this research pass.

### DEC-010: Use server capability composition as the P0 technical model

Decision: Explain Stackpress technically as a server-capability composition
framework in which Idea declarations, configuration, plugins, and generated code
install capabilities that access surfaces adapt for callers.

Reason: The complete P0 trace shows that no single model or generator creates the
application alone. Named server capabilities are the common runtime dependency
across CLI, pages, API, MCP, desktop, and plugin orchestration.

Status: Adopted as research synthesis. Public product positioning still requires
founder review.

### DEC-011: Treat the generated client as executable application state

Decision: Describe generated client output as a loadable runtime package and
require generator/runtime changes to be reasoned about as one contract.

Reason: SQL, admin, and AI load generated registries during lifecycle phases;
generated output contains listeners, stores, actions, routes, components, and
tools rather than passive declarations alone.

Status: Adopted as technical research truth.

### DEC-012: Treat lifecycle events as package installation boundaries

Decision: Use `config`, `listen`, `route`, and `idea` to explain responsibility
and contributor routing, while distinguishing bootstrap phases from ordinary
domain events.

Reason: Every active package contributes at the phase where its services,
operations, routes, or transforms become meaningful.

Status: Adopted as technical research truth.

## Open Gaps

### GAP-001: How much founder/product narrative should be inferred from code?

Question: When source code implies product philosophy, should it be promoted as
accepted truth or kept as source-backed interpretation until user confirmation?

Assumption: Promote only conservative, source-backed observations; route strong
brand/product claims through user confirmation.

Status: Resolved for the KB: conservative technical interpretations promoted;
founder/public positioning explicitly deferred by user acceptance.

### GAP-003: What artifact tests prove the KB is robust enough?

Question: Which generated sample artifacts should validate the KB before Freeze?

Assumption: At minimum, test one documentation page outline, one article angle,
one architecture diagram outline, one teaching outline, one marketing message
set, and one contributor onboarding note.

Status: Resolved by proposal-level and context-only validation across all six
artifact families.

### GAP-004: Which concept phrases should become project language?

Question: Should phrases such as "model-to-surfaces framework",
"product contract", "operations console", and "one model, many interfaces" be
promoted as Stackpress language, or kept as internal explanatory scaffolding?

Assumption: Keep them as working phrases until the user accepts, rejects, or
renames them.

Status: Resolved for technical vocabulary; public category, promise, and branded
terminology explicitly deferred by user acceptance.

### GAP-005: What taxonomy emerges from completed research?

Question: After library ledgers, Stackpress synthesis, and deeper topic studies,
which accepted concepts should own the final context files?

Assumption: Do not preserve the first nine-file proposal by default. Derive the
replacement from the reviewed topic backlog and retrieval needs.

Status: Resolved by the accepted, promoted, and validated eight-file taxonomy.

### GAP-007: Is lifecycle and transform ordering a public compatibility contract?

Question: Which current aggregate order and transform dependencies are promised
to package authors rather than being implementation details?

Assumption: Document current order exactly for contributors, but avoid promising
permanent public ordering until compatibility policy is defined.

Status: Current ordering documented; permanent public ordering policy deferred
as future governance by user acceptance.

### GAP-008: What governance metadata should events and attributes require?

Question: Should Stackpress maintain formal registries for event ownership,
visibility, stability, authorization, and Idea attribute namespaces?

Assumption: Recommend contract records in research, but do not claim a registry
exists or prescribe implementation before the operational topic waves.

Status: Formal registries deferred as future governance by user acceptance.
