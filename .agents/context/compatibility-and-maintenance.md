# Stackpress Compatibility And Maintenance

## Contract-Chain Compatibility

Compatibility crosses:

```text
declaration/config -> semantic owner -> transform/runtime producer
-> generated artifact -> runtime consumer -> adapter/surface -> verification
```

An individual package can compile while the application contract is stale.
Generated output embeds names, imports, exports, phrases, metadata semantics, and
ordering assumptions from several owners.

## Authority Hierarchy

- Complete sibling repositories describe current ecosystem design intent.
- This monorepo's manifests and installed dependencies describe exact checkout
  behavior.
- Generated client output describes one generation environment and moment.
- Revision files describe generated schema history.
- A deployed runtime and database require direct evidence of their actual state.
- Remote repositories matter for public framing and upstream drift, not as an
  automatic replacement for local truth.

Some sibling libraries may be newer than versions consumed by this checkout.
Do not merge those authorities into one version claim.

## Coordinated Release Set

The following GitHub repositories form one Stackpress release set and are
released together at the exact same version:

- `stackpress/lib`;
- `stackpress/idea`;
- `stackpress/ingest`;
- `stackpress/inquire`;
- `stackpress/reactus`;
- `stackpress/stackpress`.

Use the version string itself as the canonical stable Git tag, without a `v`
prefix. Each repository needs release notes derived from its own previous
published stable release, even though the target version is shared. A release
catch-up does not itself authorize package publication, version changes, or
rewriting existing tags.

The coordinated version applies to publishable framework packages, not examples,
templates, documentation helpers, or the Idea language extension. Validate the
release manifests named in the
[Stackpress GitHub Release Workflow](../workflows/stackpress-github-release.md)
before drafting or publishing releases.

Source provenance: [project-owner release policy](../resources/2026-07-14-coordinated-github-release-policy.md).

## Drift Surfaces

| Surface | Typical failure |
| --- | --- |
| Idea/schema | changed metadata, merge semantics, or model names |
| transform/runtime | emitted shape no longer matches consumer |
| transform order | later transform assumes missing earlier output |
| package export | generated granular import is missing or renamed |
| component contract | Frui props or behavior change |
| phrase contract | generated r22n source phrase changes |
| config/runtime | module, path, feature, or environment mismatch |
| database | revision history differs from applied schema |
| view snapshot | props fail serialization or expose unsafe data |
| adapter | host or dialect behavior differs |
| surface policy | API, MCP, page, and CLI contracts diverge |
| workflow | scaffold or skill assumes old structure/commands |

## Current Safety Signals

- nullable generated-client loading allows pre-generation bootstrap paths;
- schema generation prunes stale schema/model/column files and generation avoids
  some duplicate exports;
- generated packages declare granular exports and generated tests;
- revisions preserve changed schema snapshots;
- clear field renames can preserve database columns;
- ambiguous rename candidates block the live-upgrade path unless explicitly
  forced, while migration generation writes reviewable raw SQL;
- package tests, template workflows, and skill installer tests cover selected
  contracts.

These checks do not form a universal compatibility handshake.

## Current Exceptions And Enforcement Gaps

- Per-generator rename/removal cleanup is not universally enforced outside
  stackpress-schema; purge and clean regeneration are allowed recovery paths.
- Every changed package should pass tests above 90% coverage for new work, but
  current package coverage and root orchestration do not yet enforce that target.
- Root `yarn test` currently exercises server, schema, and SQL only.

## Missing Current Guarantees

Do not claim the framework currently provides:

- generated-client/runtime version metadata or automatic stale detection;
- transform dependency declarations independent of order;
- database applied-migration identity or rollback management;
- a global event/metadata namespace registry;
- a browser-prop allowlist or complete snapshot security policy;
- framework-wide runtime config validation/provenance;
- one authorization/audit descriptor across all surfaces;
- a maintained supported-adapter matrix;
- a package compatibility/discovery registry;
- formal maintainer/review ownership for every public contract.

## Diagnostic Order

1. Identify the failing surface and active bootstrap.
2. Compare Idea source, generated config, and revision history.
3. Confirm generated package path, exports, and importability.
4. Compare transform, runtime, and foundation package versions.
5. Verify lifecycle registration and event/route/tool exposure.
6. Check config values, environment, output paths, and adapter identity.
7. Inspect database applied state independently from revision files.
8. Run the narrow target proof, then affected integration workflows.

## Release And Change Verification

Choose checks according to the affected contract:

- clean and repeat generation;
- promised stale-file, rename, and removal behavior, or clean regeneration where
  the generator does not promise cleanup;
- generated package compile/import;
- package tarball and exports;
- supported adapter/connector combinations;
- SSR, hydration, interaction, and browser snapshot safety;
- authorization/error behavior across affected surfaces;
- scaffold and skill acceptance against current package APIs;
- template or end-to-end flow when shared behavior changes.
- owning package tests passing above 90% coverage for new contributions.

Use "architectural," "implemented," "tested," "demonstrated," and "supported"
precisely. Do not upgrade an example or export into a support promise.

## KB Maintenance Rule

Use the [Stackpress KB Maintenance Workflow](../workflows/stackpress-kb-maintenance.md)
for the complete trigger, authority, impact, regression, and closeout procedure.

Load [Exports, Types, And Generated Contracts](../references/00014-exports-types-generated-contracts.md)
when checking package subpaths, type/value export drift, packed assets,
generated-client shape, transform cooperation, loader compatibility, or CSS preset changes.

When source changes a promoted contract:

1. identify affected context files through the contract chain;
2. verify current source and behavior at the owning layer;
3. update accepted truth and boundary labels;
4. preserve unresolved proposals outside context;
5. rerun deterministic Agent Workspace validation;
6. rerun affected artifact retrieval tests;
7. regenerate affected document records from context plus linked references
   before comparing them with public docs.
