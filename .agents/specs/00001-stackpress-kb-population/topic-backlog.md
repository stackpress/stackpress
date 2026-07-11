# Deeper Topic Backlog

## Purpose

Prioritized research topics derived after all ecosystem and Stackpress ledgers.
This backlog selects what to investigate before proposing a KB taxonomy.

Priority considers centrality to Stackpress, distinctiveness, reuse across the
requested artifact types, evidence strength, and unresolved risk.

## Priority Summary

| Priority | Topic | Why now |
| --- | --- | --- |
| P0 | TOP-001 Capability-centered operating model | Unifies the whole framework explanation. |
| P0 | TOP-002 Idea metadata and semantic ownership | Prevents parser, framework, and plugin claims from being conflated. |
| P0 | TOP-003 Generated client lifecycle contract | Central runtime dependency and major drift risk. |
| P0 | TOP-004 Lifecycle events and package ownership | Required for architecture and contributor guidance. |
| P0 | TOP-005 Event capability bus and governance | Connects every operational/access surface. |
| P1 | TOP-006 Data reconciliation lifecycle | Explains Inquire versus Stackpress SQL and operations. |
| P1 | TOP-007 Host-routed React and server props | Explains view architecture and hydration boundaries. |
| P1 | TOP-008 Configuration as operational policy | Explains how applications assemble behavior. |
| P1 | TOP-009 Access-surface adapters | Explains admin/API/MCP/CLI/views without duplicating domain logic. |
| P1 | TOP-010 Package-style reuse and distribution | Covers schemas, plugins, views, exports, CLI, and skills. |
| P2 | TOP-011 Generated UI metadata pipeline | Connects Idea, Stackpress view/admin, Frui, and r22n. |
| P2 | TOP-012 Portability through explicit adapters | Cross-library architecture and deployment story. |
| P2 | TOP-013 Compatibility and drift model | Needed for maintenance and versioning guidance. |
| P2 | TOP-014 Contributor decision system | Converts architecture into safe volunteer routing. |

## Topic Records

### TOP-001: Capability-Centered Operating Model

Sources: all libraries; Stackpress aggregate, server, templates. Relationship:
Stackpress-coordinated. Observation: model/config become server capabilities;
surfaces adapt those capabilities. Implications: primary architecture, teaching,
business explanation, and diagrams. Artifacts: canonical flow, overview article,
system diagram. Questions: where capability boundaries differ from events and
which claims extend beyond CMS. Evidence: strong. Recommended: first.

### TOP-002: Idea Metadata And Semantic Ownership

Sources: Idea parser/transformer/editor; schema, SQL, view, admin, AI. Relationship:
Idea-inherited plus Stackpress conventions. Observation: grammar carries open
metadata while packages own meanings. Implications: accurate schema docs,
extension teaching, namespace governance. Artifacts: semantic ownership matrix,
attribute lifecycle diagram, authoring guide. Questions: stable namespaces,
cross-package contracts, provenance. Evidence: strong. Recommended: first wave.

### TOP-003: Generated Client Lifecycle Contract

Sources: Idea, schema generation, all transforms, client loader, generated output.
Relationship: Stackpress-unique workflow. Observation: generated output returns as
an executable package during runtime boot. Implications: core architecture,
debugging, compatibility, contribution. Artifacts: generation/runtime sequence,
contract reference, troubleshooting guide. Questions: version handshake, stale
output detection, safe extension points. Evidence: strong. Recommended: first wave.

### TOP-004: Lifecycle Events And Package Ownership

Sources: Ingest, aggregate plugin, every package plugin. Relationship:
Stackpress-coordinated. Observation: `config`, `listen`, `route`, and `idea`
partition responsibilities. Implications: contributor routing and package design.
Artifacts: lifecycle timeline, ownership table, plugin lesson. Questions: ordering
dependencies and phase invariants. Evidence: strong. Recommended: first wave.

### TOP-005: Event Capability Bus And Governance

Sources: lib, Ingest, server, generated models, session, API, AI, templates.
Relationship: extended inherited pattern. Observation: one event namespace powers
CLI, domain operations, routes, APIs, MCP, and orchestration. Implications:
operability, extensibility, naming, security. Artifacts: event taxonomy, call-flow
diagram, naming guide. Questions: public/private events, collisions, authorization,
observability. Evidence: strong. Recommended: first wave.

### TOP-006: Data Reconciliation Lifecycle

Sources: Inquire, schema revisions, SQL events/transforms, adapters, templates.
Relationship: Stackpress layer above Inquire. Observation: diff/build/query
primitives become generate, migrate, push, populate, purge, install, and upgrade.
Implications: operations and safety. Artifacts: state-transition diagram,
operator guide, architecture article. Questions: destructive gates, rollback,
dialect limits, revision authority. Evidence: strong. Recommended: second wave.

### TOP-007: Host-Routed React And Server Props

Sources: Ingest view router, Reactus, stackpress-view, layouts/providers.
Relationship: Stackpress adapter. Observation: server routes choose React entries;
serialized props bridge server capability state to hydration. Implications: view
teaching, security, browser/server boundaries. Artifacts: render sequence, view
contract, debugging guide. Questions: serialization, errors, module safety, cache.
Evidence: strong. Recommended: second wave.

### TOP-008: Configuration As Operational Policy

Sources: Ingest config stores, template config, package config handlers.
Relationship: Stackpress coordination. Observation: typed modules select adapters,
access, population, routes, tools, brand, locale, and output while plugins own
mechanism. Implications: operations, adoption, teaching. Artifacts: policy map,
configuration mental model, environment guide. Questions: validation, layering,
secrets, environment drift. Evidence: strong. Recommended: second wave.

### TOP-009: Access-Surface Adapters

Sources: admin, API, AI/MCP, session, view, server CLI. Relationship:
Stackpress-specific adapters. Observation: external workflows resolve shared
events and status responses. Implications: product breadth and security model.
Artifacts: comparative diagram, surface-building guide, article. Questions:
authorization consistency, error mapping, generated versus configured exposure.
Evidence: strong. Recommended: second wave.

### TOP-010: Package-Style Reuse And Distribution

Sources: Idea `use`, Ingest plugins, Reactus entries, package schemas, root CLI,
skills. Relationship: ecosystem-wide pattern. Observation: code, schema, routes,
pages, generators, and workflows are distributable units. Implications: ecosystem,
volunteers, adoption, marketing. Artifacts: reuse map, package author guide,
ecosystem article. Questions: compatibility policy and discovery. Evidence: strong.

### TOP-011: Generated UI Metadata Pipeline

Sources: Idea attributes, view/admin transforms, Frui, r22n, generated clients.
Relationship: Stackpress coordination. Observation: field/list/view metadata
selects edit/display components and translated copy. Implications: teaching,
extension, UI consistency. Artifacts: metadata-to-component diagram and cookbook.
Questions: fallback rules, accessibility, custom component registration, phrase
stability. Evidence: moderate-strong.

### TOP-012: Portability Through Explicit Adapters

Sources: lib boundaries, Ingest HTTP/WHATWG, Inquire drivers, Reactus hosts.
Relationship: inherited ecosystem principle. Observation: native resources remain
available while edge adapters normalize application behavior. Implications:
deployment and architecture messaging. Artifacts: adapter-layer diagram and
deployment article. Questions: actively supported combinations and test matrix.
Evidence: strong.

### TOP-013: Compatibility And Drift Model

Sources: granular exports, generated imports, schema revisions, client loader,
package versions. Relationship: cross-cutting risk. Observation: schema, config,
generated package, runtime packages, phrases, and component exports can drift.
Implications: maintenance and releases. Artifacts: compatibility contract,
diagnostic checklist, CI proposal. Questions: version metadata and automated
checks, including sibling `0.10.6` versus consumed `0.10.5` boundaries. Evidence:
strong problem signal; solution open.

### TOP-014: Contributor Decision System

Sources: package ownership, skills, tests, lifecycle/transform maps. Relationship:
Stackpress-specific operationalization. Observation: safe change routing depends
on lifecycle, runtime consumer, generated owner, and surface. Implications:
volunteer onboarding. Artifacts: decision tree, contribution map, verification
matrix. Questions: maintainer ownership and review gates. Evidence: strong.

## Recommended Investigation Sequence

1. Investigate TOP-001 through TOP-005 together as the core architecture set.
2. Investigate TOP-006 through TOP-010 as operational and surface workflows.
3. Investigate TOP-011 through TOP-014 as extension, portability, maintenance,
   and contributor systems.
4. Review founder/product language after technical investigations, then propose
   the KB taxonomy from accepted topic records.

## Investigation Progress

- TOP-001 through TOP-005: complete first deep pass in `core-architecture.md`
  and the corresponding topic records.
- TOP-006 through TOP-010: complete first deep pass in
  `operational-workflows.md` and the corresponding topic records.
- TOP-011 through TOP-014: complete first deep pass in
  `extension-maintenance-system.md` and the corresponding topic records.
- All fourteen topics: ready for founder-language review and Phase 6 taxonomy.
