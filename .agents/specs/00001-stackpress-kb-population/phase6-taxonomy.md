# Phase 6 Context Taxonomy Proposal

## Status

Reviewable replacement for the superseded taxonomy. This proposal is derived
from all fourteen deep topic records and retrieval tests. It does not authorize
context promotion by itself.

## Design Rules

- Organize by durable questions future agents ask, not source packages.
- Keep documentation, articles, diagrams, marketing, teaching, and contribution
  as outputs assembled from context rather than taxonomy owners.
- Put technical facts and conservative interpretations in context; keep raw
  evidence, open governance, and founder-only positioning in the spec.
- Name ecosystem owners inside topic files instead of creating one file per repo.
- Keep each proposed Context File below 200 lines when practical.

## Proposed Context Files

### `identity-and-principles.md`

Load when: explaining what Stackpress is, why it is structured this way, what it
does not claim, or preparing product, teaching, and brand foundations.

Owns:

- technical identity as server-capability composition;
- server-side-first as capability authority;
- narrow cores, host-owned policy, inspectable intent, explicit adapters;
- product boundaries: CMS wording, broader implementation scope, no-code and
  automatic-security non-claims;
- technical language versus founder-approved public language labels.

Sources: core architecture, pattern matrix, concept dispositions, TOP-001.

### `architecture-and-composition.md`

Load when: describing system structure, package relationships, lifecycle flow,
or producing architecture diagrams.

Owns:

- ecosystem composition and ownership boundaries;
- declaration to generated client to bootstrap to capability flow;
- lifecycle phases as package installation boundaries;
- event capability bus and access-adapter boundary;
- inherited, adapted, coordinated, and Stackpress-specific classifications.

Sources: composition map, core architecture, TOP-004, TOP-005.

### `modeling-and-generation.md`

Load when: explaining Idea, schema metadata, generated code, generated UI, or
adding model-driven capabilities.

Owns:

- Idea grammar/open metadata versus package-owned semantics;
- semantic ownership and namespace boundary;
- package-owned transforms and ordered shared project mutation;
- generated client as executable application state;
- field/filter/list/span/view metadata pipeline, Frui imports, r22n phrases;
- generation extension and verification rules.

Sources: TOP-002, TOP-003, TOP-011, Idea/schema/view/admin research.

### `runtime-and-operations.md`

Load when: explaining bootstrap, configuration, events, commands, sessions, or
database operations.

Owns:

- config as executable operational policy;
- lifecycle and capability registration;
- event classes and command/event equivalence;
- data reconciliation states and command semantics;
- transaction, destructive-operation, revision, migration, and population
  boundaries;
- database applied-state non-claim.

Sources: TOP-004 through TOP-006, TOP-008, operational workflows.

### `interfaces-and-experience.md`

Load when: explaining pages, admin, API, MCP, CLI, desktop, React rendering, UI,
localization, or surface security.

Owns:

- access surfaces as adapters over server capabilities;
- caller/protocol/authorization differences by surface;
- host-routed React and browser-visible serialized server snapshot;
- generated admin and UI roles;
- Frui, r22n, Reactus, session, CSRF, and view responsibilities;
- generated exposure versus configured exposure.

Sources: TOP-007, TOP-009, TOP-011, access and view research.

### `ecosystem-and-portability.md`

Load when: locating library ownership, selecting adapters, discussing deployment,
or explaining package-style distribution.

Owns:

- native role of lib, Idea, Ingest, Inquire, Reactus, Frui, and r22n;
- Stackpress relationship to each library;
- explicit server, database, rendering, AI, and desktop adapters;
- architectural/implemented/tested/demonstrated/supported vocabulary;
- schemas, plugins, transforms, exports, page entries, scaffolds, and skills as
  distribution units.

Sources: seven ledgers, composition map, TOP-010, TOP-012.

### `extension-and-contribution.md`

Load when: designing an extension, routing a change, teaching contributors, or
choosing verification evidence.

Owns:

- ownership-first decision tree;
- schema, generation, config, runtime, route/view, and adapter lanes;
- lifecycle placement rules;
- transform/runtime pairing;
- change procedure and contract-scaled verification matrix;
- mixed-feature decomposition and agent skill routing.

Sources: TOP-014, skills, extension-maintenance synthesis.

### `compatibility-and-maintenance.md`

Load when: diagnosing drift, upgrading packages, reviewing generated output,
planning releases, or maintaining the KB.

Owns:

- source/design/checkout/generated/deployed authority hierarchy;
- drift surfaces and diagnostic order;
- generated imports, exports, phrases, config, schema, database, and adapter
  compatibility boundaries;
- current safety checks and missing guarantees;
- explicit unresolved-governance labels;
- future evidence needed before support or compatibility claims.

Sources: TOP-003, TOP-006 through TOP-014, Phase 5 decisions.

## Router Strategy

`.agents/context/index.md` should remain a short read-first router. Each link
should use the `Load when:` sentence above and state that Context Files contain
accepted reusable truth while evidence and unresolved policy remain in the KB
population spec.

## Why This Is Not The First Taxonomy

- It begins from source-discovered contract chains and retrieval questions.
- It does not treat architecture, data, interfaces, or contribution as merely
  expected document sections; each owns accepted operational contracts.
- Ecosystem libraries are represented by native ownership and intersections,
  not reduced to dependency summaries.
- Compatibility and maintenance are first-class because generation makes them
  runtime concerns.
- Marketing has no standalone truth file; it must draw from accepted identity,
  principles, evidence, and explicit founder language.

## Promotion Order

1. Identity and architecture foundations.
2. Modeling/generation and runtime/operations.
3. Interfaces and ecosystem/portability.
4. Extension/contribution and compatibility/maintenance.
5. Rewrite the context router after all destination files exist.
6. Run deterministic validation and six artifact tests against context alone.

