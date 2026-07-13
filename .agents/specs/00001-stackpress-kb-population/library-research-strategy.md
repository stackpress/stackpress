# Library Research Strategy

## Objective

Discover the intentions, recurring patterns, protected invariants, unusual
concepts, and operational consequences encoded across the Stackpress ecosystem.
Study each library on its own terms before interpreting how Stackpress combines
them. Finish with the Stackpress repository, then prepare a source-backed backlog
of topics worth deeper exploration.

This evidence-led pass does not begin with a fixed KB taxonomy or assume the
first-pass concept cards are correct.

## Source Authority
Use the complete local sibling repositories as the primary research sources:

| Research unit | Local repository | Relationship to Stackpress |
| --- | --- | --- |
| Primitives | `../lib` | Shared low-level types and utilities. |
| Language and generation | `../idea` | Idea language, parser, transformer, tooling, and examples. |
| Runtime | `../ingest` | Server, events, routing, plugins, terminal, and request/response model. |
| Persistence | `../inquire` | SQL representation, builders, dialects, engines, and schema operations. |
| Rendering | `../reactus` | React template runtime, build, development, and rendering behavior. |
| UI | `../frui` | React component primitives and UI composition conventions. |
| Translation | `../r22n` | React translation state, lookup, interpolation, and integration model. |
| Composition | `.` | Stackpress packages, aggregate package, templates, CLI, skills, and tests. |

Installed packages verify the exact version consumed by this checkout. They do
not replace sibling repositories for design-intent research. Existing docs are
output examples and terminology cross-checks, not the research frame.

## Research Order
1. Study `lib` to identify the primitive vocabulary and implementation habits
   reused by later libraries.
2. Study `idea` to understand the language model, parsing boundaries,
   transformation philosophy, and generated-artifact contract.
3. Study `ingest` to understand runtime composition, event semantics, routing,
   plugins, terminal behavior, and server/serverless portability.
4. Study `inquire` to understand how data operations are represented and why
   the library draws its boundaries where it does.
5. Study `reactus` to understand rendering as runtime infrastructure, including
   development and build behavior.
6. Study `frui` to understand its component philosophy, composition patterns,
   styling assumptions, and deliberate limits.
7. Study `r22n` to understand its translation mental model, runtime contracts,
   and deliberate simplicity or constraints.
8. Study Stackpress last to trace how it composes, extends, constrains, or
   departs from those foundations across every active package.
9. Synthesize the ledgers into a topic backlog. Only after review should a new
   context taxonomy be proposed.

The order is directional, not historical. Earlier ledgers may be amended when
later source reveals a stronger relationship.

## Per-Library Inspection Passes

Apply the same passes to every ecosystem repository so conclusions are
comparable without forcing the libraries into identical categories.

### Pass A: Repository Shape

- Read repository instructions, manifests, exports, scripts, dependencies,
  README, examples, and package boundaries.
- Inventory source, tests, fixtures, generated artifacts, specifications, and tooling.
- Record what is public, internal, generated, adapter-specific, or experimental.

### Pass B: Native Vocabulary

- Extract names repeated in APIs, types, tests, filenames, events, and examples.
- Define terms from behavior, not only README descriptions.
- Note concepts that use familiar names in an unusual way.
- Record naming symmetry, paired operations, and intentional absences.

### Pass C: Behavioral Traces

- Trace at least three workflows: normal, extension/composition, and failure or
  boundary, from public entrypoint to result where the source supports them.
- Use tests to identify invariants and behaviors the maintainers protect.
- Run focused proofs only when static reading leaves material ambiguity.

### Pass D: Design Intent

For each important abstraction, ask what recurring problem it removes; why it
lives at this layer; what it makes easy, difficult, or impossible; what it
excludes; which tradeoffs appear in types, defaults, errors, and extension
points; and what would become inconsistent if it changed casually.

Label answers as direct source fact, evidence-backed interpretation, or open
question. Do not convert inferred founder intent into fact.

### Pass E: Operational And Audience Meaning

- Explain what the design means for application developers and contributors.
- Identify operational workflows, debugging routes, and failure boundaries.
- Identify concepts useful for teaching, diagrams, articles, documentation,
  messaging, or contributor onboarding.
- Keep marketing implications separate from accepted product claims.

### Pass F: Stackpress Intersection Preview

- Record where Stackpress imports, wraps, configures, extends, generates for, or
  exposes the library.
- Distinguish inherited concepts from Stackpress-specific coordination.
- Record apparent mismatches or adaptations for later confirmation during the
  final Stackpress pass.

## Research Ledger Template

Create one ledger per research unit. Each ledger should contain scope and source
anchors; native purpose; public entrypoints and extension points; vocabulary;
behavioral traces; repeated patterns and invariants; deliberate boundaries and
tradeoffs; unique concepts; operational and failure paths; provisional
Stackpress intersections; potential topics and artifacts; and open questions,
contradictions, or proof needs.

Every substantial note needs file-level evidence. Add stable line anchors where
useful, and prefer independent anchors before naming a system-wide pattern.

## Stackpress Final Pass

After all seven ecosystem ledgers are complete, inspect Stackpress in layers:

1. Root distribution: manifest, dependency-free CLI, workspace scripts, skills,
   repository instructions, and public package surface.
2. Aggregate composition: plugin order, re-exports, dependency direction, and
   default configuration.
3. Core packages: server, schema, SQL, and view.
4. Operational packages: CSRF, email, language, and AI.
5. Access-surface packages: session, API, and admin.
6. Application and planned targets: `www`, templates, desktop, and studio,
   preserving the distinction between active and planning-only code.
7. End-to-end examples: trace representative template workflows from idea and
   config through generation, runtime, persistence, rendering, and access.
8. Tests and generated output: identify invariants, ownership boundaries, and
   contracts that package entrypoints alone do not reveal.

For every Stackpress-level concept, classify the relationship to ecosystem
foundations:

- Inherited unchanged.
- Adapted or constrained.
- Coordinated across libraries.
- Exposed as a higher-level workflow.
- Unique to Stackpress.
- Unclear and requiring deeper proof.

## Pattern Discovery Rules

- A repeated implementation shape is a candidate pattern, not automatically an
  intention. Confirm it through tests, public APIs, examples, or recurrence.
- A unique concept may appear only once if it defines a major boundary or
  unlocks a distinctive workflow. Explain why it matters.
- Negative space is evidence: missing abstractions, rejected conveniences, and
  intentionally thin wrappers can reveal design philosophy.
- Differences between sibling libraries may be deliberate. Record them before
  normalizing terminology.
- Generated code is evidence about contracts and ownership, even when the output
  itself is disposable.
- Templates show intended integration, but one template does not establish a
  universal rule.
- Existing concept cards C-001 through C-012 are test prompts. Each must be
  confirmed, revised, split, renamed, or rejected.

## Topic Backlog Method

The output is a backlog of topics to explore deeper, not the KB taxonomy. Each
topic record should include:

- Topic ID and neutral working title.
- Source libraries and Stackpress packages involved.
- Observation and why it appears intentional.
- Evidence anchors and confidence level.
- Whether the concept is inherited, coordinated, adapted, or Stackpress-unique.
- Business, operational, architectural, teaching, contributor, and messaging
  implications where supported.
- Candidate artifacts: documentation, article, diagram, lesson, marketing
  message, troubleshooting guide, or contribution guide.
- Questions and behavioral proofs needed before promotion.
- Recommended priority based on distinctiveness, centrality, reuse value, and
  evidence strength.

Cluster topics only after records exist. Expected clusters may emerge, but no
cluster from the first taxonomy is mandatory.

## Completion Gates

This strategy is complete when:

- All seven ecosystem ledgers and the Stackpress ledger are complete.
- Each ledger includes source traces, tests or examples where available, design
  interpretations, boundaries, Stackpress intersections, and open questions.
- The composition and pattern matrices distinguish inherited behavior from
  Stackpress-specific intent.
- Every first-pass concept card has a disposition.
- A prioritized topic backlog is ready for user review.
- No new context taxonomy or promoted KB content has been created prematurely.

After user review, deeper investigations can begin. The KB taxonomy comes only
after those investigations produce accepted reusable truth.
