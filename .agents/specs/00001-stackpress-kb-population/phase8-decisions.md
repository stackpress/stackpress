# Phase 8 Decisions And Gaps

## Accepted Decisions

### P8-DEC-001: Reopen the Frozen spec

Decision: Reopen the spec because the promoted KB passed outline-level retrieval
but did not satisfy document-level parity.

Status: Accepted by explicit user instruction.

### P8-DEC-002: Preserve context plus detailed references

Decision: Keep the eight-file context taxonomy and add context-linked flat
Reference Files for catalogs, signatures, examples, and provenance.

Reason: Expanding every Context File into an API encyclopedia would weaken
routing, while leaving detail only in specs makes it non-authoritative for future
agents.

Status: Accepted for Phase 8 execution.

### P8-DEC-003: Use docs as a benchmark, not source truth

Decision: Inventory every current document for expected knowledge, populate the
KB from source evidence, then compare generated output against docs afterward.

Status: Accepted for Phase 8 execution.

### P8-DEC-004: Require document-level parity

Decision: A routed outline is insufficient. Each benchmark must be generatable
with purpose, exports, signatures, behavior, examples, boundaries, and related
routing from context plus references alone.

Status: Accepted for Phase 8 execution.

## Open Gaps

### P8-GAP-001: Reference granularity

Question: Will the planned twelve references remain below Agent File caps while
preserving enough detail for all 47 documents?

Assumption: Split further only when a populated file exceeds 500 lines or is
materially clearer below 200 lines.

Resolution: Split the Idea component registry into REF-016 because its derived
role families and aliases are independently useful and keeping them inside the
language contract would weaken retrieval. Continue splitting only for a clear
knowledge boundary or the Agent File cap.

Status: Resolved for the Idea domain; monitor remaining domains.

### P8-GAP-002: Stale benchmark documents

Question: Which existing docs conflict with current source or checkout versions?

Assumption: Classify conflicts during parity review; update the KB from source
and report docs drift rather than copying it.

Resolution: The parity review classified CLI, config, SQLite naming, and the
aggregate view-client distinction as benchmark drift or incompleteness. The Idea
config-key mismatch remains an explicit source conflict. No benchmark content
was promoted over current source evidence.

Status: Resolved for Phase 8.

### P8-GAP-003: Full-document test volume

Question: Must all 47 pages be regenerated verbatim?

Decision: Generate equivalent structured content for all 47 and full prose for
representative high-depth pages in each domain. Verbatim reproduction is not the
goal.

Status: Accepted for Phase 8 execution.

### P8-GAP-004: Idea config key conflict

Finding: `TerminalConfig` documents `terminal.idea`, while the current generate
event reads `cli.idea` before request-level `input`/`i` overrides.

Decision: Preserve the conflict in REF-009 and use request `-i` as the
unambiguous documented override. Do not silently choose one config key during
parity generation.

Status: Source conflict open for implementation/docs reconciliation outside the
KB population task.

### P8-GAP-005: Aggregate package identity metadata

Finding: The current `stackpress` package description says “Incept is a content
management framework,” while accepted context identifies Stackpress and founder
positioning remains intentionally deferred.

Decision: Treat the package description as stale artifact metadata. Do not use
it as identity or marketing authority; retain the technical package manifest as
authority only for exports, packed files, versions, and dependency contracts.

Status: Drift recorded for later package metadata correction.

### P8-DEC-005: Accept document-level parity

Decision: Accept the 47 structured generation records and eight representative
prose drafts as document-level parity evidence. The initial session-example
error was corrected from the already-present KB signature and did not require a
knowledge repair.

Status: Accepted by completed Phase 8 validation.
