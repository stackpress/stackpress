# Research

## Research Objective

Discover Stackpress's business, operational, architectural, and contribution
model from source evidence, not from the existing docs taxonomy alone.

## Research Direction

The first pass was too shallow to support a context taxonomy. Continue with the
evidence-led sequence in [Library Research Strategy](library-research-strategy.md):
study every ecosystem library independently, study Stackpress last, then produce
a topic backlog for deeper exploration.

The candidate concept families below are hypotheses only. They must not limit
what the source can reveal.

## Source Inventory Plan

### Local Stackpress Repository

Inventory these areas first:

- `packages/`: package boundaries, plugins, events, transforms, config types,
  naming, dependency direction, test surfaces, and generated output patterns.
- `templates/`: how Stackpress expects real apps to be structured and operated.
- `bin/`: distribution and first-run CLI intentions.
- `skills/`: agent-facing workflows, generation plugin guidance, app scaffold
  assumptions, and contribution patterns.
- `docs/`: examples of current documentation output and terminology reuse.

### Ecosystem Libraries

Treat these as in scope because Stackpress combines them into its operating
model:

- `@stackpress/lib`: shared data, event, router, terminal, filesystem,
  exception, reflection, queue, and status primitives.
- `@stackpress/idea-parser` and `@stackpress/idea-transformer`: idea-file
  grammar, schema parsing, and transform pipeline.
- `@stackpress/ingest`: event-driven server/runtime, request/response/router,
  plugin, HTTP, and WHATWG foundations.
- `@stackpress/inquire`: typed SQL builders, engine, dialects, query helpers,
  and migration/diff foundations.
- `reactus`: React template engine, development/build/preview rendering,
  Vite integration, virtual server/resource behavior.
- `frui`: UI primitives used by Stackpress view/admin surfaces.
- `r22n`: translation/i18n layer used by Stackpress view/language surfaces.

Complete sibling repositories exist at `../lib`, `../idea`, `../ingest`,
`../inquire`, `../reactus`, `../frui`, and `../r22n`. Use those repositories for
design-intent research. Use installed copies in `node_modules/` to verify the
exact consumed version and live GitHub only when current public framing matters.

## Extraction Dimensions

For each source area, extract:

- What problem it solves.
- What design principle it encodes.
- What operational workflow it enables.
- Which package or library owns the concept.
- Which concepts are unique to Stackpress versus inherited from ecosystem
  libraries.
- How the concept should be explained to a new developer.
- How the concept should be positioned to a buyer, adopter, volunteer, or
  technical reader.
- What diagrams it naturally supports.
- What source evidence supports the interpretation.

## Initial Candidate Concept Families

These are first-pass hypotheses to confirm, revise, split, rename, or reject:

- Idea-to-reality: declarative idea files become schema, SQL, actions, views,
  admin, APIs, MCP tools, and app code.
- Server-side first: app behavior starts from server/runtime events before
  client surfaces.
- Event-driven framework core: commands, routes, plugins, generation, database
  flows, MCP, desktop, and rendering are event-shaped.
- Plugin separation: package responsibilities are intentionally split by
  lifecycle and transform ownership.
- Generated client as contract: generated code is a bridge between idea files,
  runtime plugins, database models, views, and tooling.
- Configuration over scattered glue: app behavior is controlled through config
  modules and package lifecycle registration.
- SQL as lifecycle, not just queries: schema changes, migrations, seed data,
  stores, actions, and query helpers share one operational layer.
- React rendering as server-aware template infrastructure: Reactus plus view
  helpers make React work inside Stackpress server flows.
- Admin/API/MCP as generated or configured access surfaces over the same model.
- Contributor model: contributors should route changes by package ownership,
  lifecycle hook, and transform boundary.

## Phase 1 Deliverable

Produce a source inventory file in this spec that lists each source group, why
it matters, what questions it can answer, and whether it is ready for Phase 2
concept extraction.

Do not promote to context during Phase 1 unless a fact is already accepted,
stable, reusable, and clearly source-backed.

Status: First-pass inventory recorded in [Source Inventory](source-inventory.md).

## Phase 2 Deliverable

Produce source-backed concept cards that identify Stackpress design principles,
operational patterns, mental models, contribution boundaries, artifact uses,
evidence anchors, and promotion cautions.

Status: First-pass concept extraction recorded in
[Concept Extraction](concepts.md). The concepts are intentionally written as
reviewable interpretations, not promoted context truth.

## Revised Phase 3 Outcome

The first context taxonomy proposal was superseded because it was created before
deep library research. [Deferred Context Taxonomy](context-taxonomy.md) records
the correction and the gate for any replacement.

## Phase 4 Deliverable

Produce one evidence ledger per ecosystem repository, one final Stackpress
ledger, a composition map, a cross-library pattern matrix, dispositions for the
first-pass concept cards, and a prioritized topic backlog.

Status: Complete first pass. All seven ecosystem ledgers, the final Stackpress
ledger, [Composition Map](composition-map.md), [Pattern Matrix](pattern-matrix.md),
[Concept Dispositions](concept-dispositions.md), and
[Topic Backlog](topic-backlog.md) are recorded.
