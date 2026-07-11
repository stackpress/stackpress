# Phase 5 Decisions And Gaps

## Purpose

Record deep-investigation decisions without expanding the baseline decision
ledger beyond the preferred Agent File size. Load `decisions.md` first for scope,
promotion, and research-source decisions.

## Accepted Research Decisions

### P5-DEC-001: Separate schema history from database applied state

Decision: Describe revisions as generated schema history and migrations as
history-derived SQL artifacts. Do not claim either records live database state.

Reason: `Revisions` stores changed generated configs; `migrate` writes files;
neither tracks execution against a database.

Status: Adopted as technical research truth.

### P5-DEC-002: Describe React props as a serialized server snapshot

Decision: Explain Stackpress/Reactus rendering as host-routed SSR and hydration
from a browser-visible, serializable snapshot, not as a live server object model.

Reason: stackpress-view converts request, response, session, and data into plain
props; Reactus embeds JSON and hydrates the selected page with those props.

Status: Adopted as technical research truth.

### P5-DEC-003: Treat configuration as executable operational policy

Decision: Describe config as typed TypeScript composition that selects package
and environment policy while package lifecycle handlers own mechanisms.

Reason: templates build variants through imports, environment values, and object
spreads; packages consume their own nested sections during lifecycle phases.

Status: Adopted as technical research truth.

### P5-DEC-004: Keep authorization surface-specific

Decision: Explain named events as the shared internal invocation protocol while
assigning authentication, authorization, input validation, and protocol mapping
to each access adapter.

Reason: pages/session, configured API, MCP, CLI, desktop, and direct plugins have
different caller and policy models despite resolving shared events.

Status: Adopted as technical research truth.

### P5-DEC-005: Treat package-style reuse as architectural distribution

Decision: Include schemas, plugins, transforms, generated clients, granular
exports, page entries, scaffolds, and skills in Stackpress's distribution model.

Reason: source and manifests intentionally make all of these independently
loadable or copyable units with distinct owners and consumers.

Status: Adopted as technical research truth.

### P5-DEC-006: Treat UI metadata as role-specific generation contracts

Decision: Preserve separate field, filter, list, span, and view semantics, with
component definitions and phrase text treated as compatibility-sensitive input.

Reason: Schema dictionaries and transforms generate distinct Frui wrappers and
r22n phrases for each role.

Status: Adopted as technical research truth.

### P5-DEC-007: Describe portability by evidence level

Decision: Distinguish architectural, implemented, tested, demonstrated, and
supported adapter claims instead of using one blanket portability label.

Reason: Ecosystem adapters and examples cover more combinations than this
Stackpress checkout directly tests or promises.

Status: Adopted as technical research truth.

### P5-DEC-008: Use a contract-chain compatibility model

Decision: Diagnose drift across declaration, transform, generated artifact,
runtime consumer, config, adapter, surface, and workflow contracts.

Reason: Generated code embeds imports and assumptions from multiple packages, so
individual package compilation cannot prove application compatibility.

Status: Adopted as technical research truth.

### P5-DEC-009: Route contributions by ownership and consumption

Decision: Select the semantic owner first, then trace generated ownership,
runtime consumption, lifecycle phase, access surface, and required evidence.

Reason: File location alone cannot safely route cross-package Stackpress changes.

Status: Adopted as technical research truth.

## Open Gaps

### P5-GAP-001: Database deployment authority

Question: What should record migration application, target identity, rollback,
and recovery when revision history alone is insufficient?

Status: Deferred as future governance by user acceptance at Freeze.

### P5-GAP-002: Browser snapshot safety contract

Question: Which request/session fields are permitted, how are hostile values
escaped, and what serialization failures must be caught before rendering?

Status: Deferred as future governance by user acceptance at Freeze.

### P5-GAP-003: Configuration validation and provenance

Question: Should config gain runtime schemas, unknown-key checks, secret
classification, layer provenance, and environment comparison?

Status: Deferred as future governance by user acceptance at Freeze.

### P5-GAP-004: Cross-surface policy consistency

Question: Should one descriptor coordinate event contracts, caller propagation,
authorization, error mapping, and audit requirements across adapters?

Status: Deferred as future governance by user acceptance at Freeze.

### P5-GAP-005: Ecosystem discovery and compatibility

Question: How should packages declare shipped units, metadata/event namespaces,
lifecycle dependencies, generated contracts, and supported versions?

Status: Deferred as future governance by user acceptance at Freeze.

## Final Disposition

TOP-011 through TOP-014 clarified these gaps but did not reveal implemented
framework-wide governance. Carry them into Phase 6 as explicitly unresolved
policy/design inputs. Do not promote proposed registries, handshakes, support
matrices, or review gates as existing Stackpress capabilities.
