# Deferred Context Taxonomy

## Status

Superseded as a Phase 4 proposal. The first pass selected destination files
before the ecosystem and Stackpress source had been studied deeply enough to
discover their native intentions, patterns, and unique concepts.

The prior candidate topics remain recoverable in Git history and in
`concepts.md` as hypotheses. They are not an accepted taxonomy and must not
control the next research pass.

## Why It Was Premature

- It inferred system-wide themes from manifests, plugin entrypoints, templates,
  skills, and package READMEs without first tracing each library's internal
  abstractions, tests, examples, and deliberate tradeoffs.
- It grouped material around expected outputs such as architecture, data,
  surfaces, and contributor routing before learning which concepts the source
  itself repeats or protects.
- It described ecosystem libraries mainly by their apparent role in Stackpress,
  rather than understanding each library on its own terms first.
- It turned useful observations into named concepts too early. Phrases such as
  "product contract" and "operations console" may be valid, but the current
  evidence does not yet show whether they are central, incidental, or incomplete.

## Replacement Gate

Do not propose another `.agents/context/` file set until all research ledgers in
[Library Research Strategy](library-research-strategy.md) are complete and the
cross-library synthesis has produced a reviewable topic backlog.

A replacement taxonomy must be derived from that backlog. It should organize
accepted knowledge for retrieval, not dictate what the research is allowed to
discover.

## Required Inputs For The Next Proposal

- One completed research ledger for each ecosystem repository.
- One completed research ledger for the Stackpress repository and its packages.
- A composition map showing what Stackpress inherits, adapts, coordinates, or
  uniquely introduces.
- A pattern matrix showing repeated concepts, deliberate differences, and
  package ownership boundaries.
- A topic backlog with evidence strength, audience value, and deeper-research
  questions.
- User review of interpretations that move from technical behavior into founder,
  product, business, or brand intent.

## Promotion Boundary

No rebuilt KB facts should be promoted to `.agents/context/` during this deeper
discovery sequence. The existing reset router remains the only context file
until a later taxonomy and its accepted claims are reviewed.
