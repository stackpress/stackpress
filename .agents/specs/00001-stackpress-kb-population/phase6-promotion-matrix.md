# Phase 6 Promotion Matrix

## Purpose

Classify completed research before context promotion. Destination names refer to
the proposed taxonomy in `phase6-taxonomy.md`.

## Promote As Accepted Technical Truth

| Claim family | Destination | Basis |
| --- | --- | --- |
| Server capability composition is the canonical technical model. | identity, architecture | DEC-010 and TOP-001 |
| Server-side-first assigns capability authority to the server. | identity, interfaces | Stackpress/view/runtime trace |
| Narrow libraries leave policy to Stackpress and application hosts. | identity, ecosystem | all seven ledgers and pattern matrix |
| Idea owns composable syntax and open metadata, not all semantics. | modeling | TOP-002 |
| Stackpress packages own metadata meaning required by their runtime contracts. | modeling, architecture | TOP-002 and transforms |
| Package-owned transforms emit the code their runtime consumers need. | modeling, contribution | TOP-003/004 |
| The generated client is executable application state. | modeling, compatibility | DEC-011 and TOP-003 |
| `config`, `listen`, `route`, and `idea` partition package installation work. | architecture, runtime | DEC-012 and TOP-004 |
| Named events form the internal capability protocol. | architecture, runtime | TOP-005 |
| Access surfaces apply distinct caller and protocol policy. | interfaces | P5-DEC-004 and TOP-009 |
| Config is executable operational policy; packages own mechanism. | runtime | P5-DEC-003 and TOP-008 |
| Revisions are schema history, not database applied-state tracking. | runtime, compatibility | P5-DEC-001 and TOP-006 |
| `migrate` writes SQL artifacts and does not update the database. | runtime | TOP-006 source trace |
| Reactus hydrates from a browser-visible serialized server snapshot. | interfaces, compatibility | P5-DEC-002 and TOP-007 |
| UI roles are field, filter, list, span, and view contracts. | modeling, interfaces | P5-DEC-006 and TOP-011 |
| Generated phrase wording is r22n-key compatibility input. | modeling, compatibility | TOP-011 |
| Portability comes from explicit adapters and preserved native resources. | ecosystem | TOP-012 and pattern matrix |
| Support claims require evidence-level qualification. | ecosystem, compatibility | P5-DEC-007 |
| Reuse includes schemas, plugins, transforms, exports, pages, scaffolds, skills. | ecosystem | P5-DEC-005 and TOP-010 |
| Compatibility must follow the complete contract chain. | compatibility | P5-DEC-008 and TOP-013 |
| Contributions route by semantic ownership and runtime consumption. | contribution | P5-DEC-009 and TOP-014 |

## Promote With Explicit Boundary Labels

| Claim | Required label |
| --- | --- |
| Stackpress implementation scope extends beyond traditional CMS operations. | Technical observation; not approved positioning. |
| Aggregate package and transform order is observable and currently contractual. | Current checkout behavior; permanence not promised. |
| Desktop is an active workspace. | Current checkout; updater lifecycle remains placeholder. |
| Sibling repositories express current design intent. | Exact checkout behavior comes from installed versions/manifests. |
| Reactus/Ingest examples show possible hosts. | Demonstrated, not automatically Stackpress-supported. |
| Generated UI uses Frui and r22n contracts. | Current generated contract, version-sensitive. |

## Keep Spec-Local

| Material | Reason |
| --- | --- |
| Raw source inventories and evidence paths | provenance, not retrieval truth |
| Phase sequencing and research tasks | one-spec workflow |
| Superseded concept names and first taxonomy | rejected planning history |
| Detailed per-file code observations | source detail unless needed by a contract |
| Artifact test execution notes | Phase 6 validation record |

## Do Not Promote As Existing Capability

- generated-client/runtime version handshake;
- event ownership or metadata namespace registry;
- database applied-migration ledger or rollback system;
- browser snapshot allowlist or formal escaping policy;
- framework-wide runtime config schemas and provenance;
- central cross-surface authorization/audit descriptor;
- maintained supported-adapter matrix;
- package discovery/compatibility registry;
- maintainer map, CODEOWNERS, or mandatory review gates.

These remain recommendations or governance gaps. Context may state that the
guarantee was not found and identify the operational risk, but it must not imply
an implementation exists.

## Conflict Checks

- The live desktop workspace supersedes stale root guidance that called desktop
  planning-only.
- Sibling `0.10.6` design intent must not overwrite consumed `0.10.5` behavior.
- "One model, many interfaces" omits config/plugins and is not canonical.
- "The schema generates the whole application" overstates generation.
- "Events secure every interface" contradicts surface-specific policy.
- "Migrations track deployment state" contradicts the SQL workflow.

## Promotion Gate

The technical claims above are accepted by recorded research decisions and are
reusable. The taxonomy shape and public/founder language still require review
before creating the full context set.

