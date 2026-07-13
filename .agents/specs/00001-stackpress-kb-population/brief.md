# Brief

## User Goal

Rebuild `.agents/context/` from scratch into a robust Stackpress knowledge base
that understands the business, operational, architectural, educational,
marketing, and contribution intent behind the code.

The KB should be able to support:

- Documentation and API explanations.
- Articles and narrative content.
- Diagrams and architecture maps.
- Stackpress brand and marketing messages.
- Teaching developers how Stackpress works.
- Helping volunteers contribute to the source code.
- Future use cases that need the operating model, not just file references.

## Clarification From User

The previous KB took `docs/` too literally. Existing docs may be useful as
examples of output, but the rebuilt KB should discover the intent behind the
code and itemize Stackpress patterns and unique concepts.

Assume Stackpress was intentionally designed line by line. Treat source code,
package boundaries, naming, event flows, generated outputs, and related
libraries as evidence of product and operational intent.

## In Scope

Local Stackpress sources:

- `packages/`
- `templates/`
- `bin/`
- `skills/` when relevant to Stackpress generation/contribution workflows
- existing `docs/` as output examples and source-backed cross-checks, not as
  the primary taxonomy

Stackpress ecosystem libraries:

- `@stackpress/lib`
- `@stackpress/idea-parser`
- `@stackpress/idea-transformer`
- `@stackpress/ingest`
- `@stackpress/inquire`
- `reactus`
- `frui`
- `r22n`

Use the complete local sibling repositories first for design-intent research.
Use installed copies to verify the exact dependency versions consumed here, and
live GitHub only when current upstream framing matters.

## Non-Goals

- Do not recreate API reference docs as context files.
- Do not promote raw source inventories into `.agents/context/`.
- Do not make marketing claims that are not supported by source, user intent,
  or an explicit decision.
- Do not treat external repo README descriptions as enough to explain how
  Stackpress uses those libraries.
- Do not create a context taxonomy until the ecosystem ledgers, final Stackpress
  synthesis, and deeper topic investigations produce accepted concepts.

## Desired KB Capability

The final KB must retrieve accepted knowledge well enough to explain Stackpress
to technical and non-technical audiences, trace its operation, teach its mental
models, support contributors, and generate credible documentation, articles,
diagrams, and messaging. Its file shape must emerge from the research rather
than from this list of outputs.
