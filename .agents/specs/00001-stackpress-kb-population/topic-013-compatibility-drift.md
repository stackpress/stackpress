# TOP-013: Compatibility And Drift Model

## Finding

Stackpress compatibility is a chain across source declarations, generated
artifacts, runtime packages, configuration, adapters, and access surfaces. Drift
can occur even when each individual package compiles because generated output
embeds imports, names, phrases, and assumptions from several owners.

## Drift Surfaces

| Surface | Drift example | Current signal |
| --- | --- | --- |
| Idea/schema | changed metadata, merge semantics, or model names | generation diff and revisions |
| Transform/runtime | generated shape no longer matches consumer | compile/runtime import failure |
| Transform order | later transform assumes missing earlier output | generation failure or malformed package |
| Package exports | generated granular import removed/renamed | compile/module resolution failure |
| Component contract | Frui prop/export behavior changes | compile or rendered regression |
| Phrase contract | generated wording changes r22n keys | untranslated fallback text |
| Config/runtime | module/path/feature policy mismatches | bootstrap or feature failure |
| Database | revisions differ from applied schema | query or migration failure |
| View snapshot | props cease to serialize or expose too much | render/security failure |
| Adapter | host/dialect behavior differs | target-specific failure |
| Surface policy | API/MCP/page mappings diverge | authorization/contract inconsistency |
| Workflow | skills/scaffold assume old layout or commands | contributor-generated drift |

## Version Authority

- sibling repositories represent current design intent;
- this monorepo's manifests and installed dependencies represent exact checkout
  behavior;
- generated client output represents the result of one generation environment;
- deployed database and runtime state require separate evidence;
- live remote repositories are relevant for public framing and remote drift, not
  as automatic authority over a local checkout.

The observed sibling `0.10.6` versus consumed `0.10.5` boundary demonstrates why
these authorities must not be collapsed.

## Missing Handshakes

No universal generated manifest currently records:

- Stackpress and ecosystem versions used for generation;
- ordered transforms and their versions;
- Idea/schema source digest;
- generated contract version;
- config identity or relevant policy digest;
- expected database revision/applied migration;
- supported host, connector, and view combinations.

Desktop has its own app/version/generated metadata, showing that targeted
handshakes are possible, but it is not a framework-wide client contract.

## Proposed Compatibility Record

Research recommendation for future design, not an implemented feature:

```text
generated contract version
schema source and digest
ordered transform package versions
runtime package compatibility range
generated timestamp and output mode
adapter/connector identities
latest revision identity
```

Runtime checks should distinguish hard incompatibility, stale output, unverified
state, and acceptable version-range differences.

## Diagnostic Order

1. Identify the failing surface and current bootstrap.
2. Compare Idea source with generated config and revision history.
3. Confirm generated package path, exports, and importability.
4. Compare transform/runtime/foundation package versions.
5. Verify lifecycle registration and event/route/tool exposure.
6. Check config path, environment values, and adapter identity.
7. Check database applied state independently from revision files.
8. Run the narrow target proof, then the affected integration workflow.

## CI And Release Recommendations

- clean generation and repeat-generation stability;
- stale-file removal and rename/removal tests;
- generated package compile and import smoke test;
- package tarball/export verification;
- adapter and connector matrix selected by supported combinations;
- SSR/hydration and browser snapshot safety tests;
- API/MCP/page authorization contract comparisons;
- scaffold and skill acceptance tests against the current package surface;
- generated manifest compatibility check when such metadata exists.

## Evidence Anchors

- package manifests and granular exports across all ecosystem libraries
- Stackpress generated package transforms and client loader
- schema revisions and SQL reconciliation workflows
- Reactus/Frui/r22n generated dependencies
- template config variants, root CLI, skills, and desktop manifest

## Resolution

Evidence strength: strong for the drift model; automated handshake design remains
open. Adopt the authority hierarchy, diagnostic order, and no-blanket-support
rule. Treat the proposed compatibility record as future governance/design input.

