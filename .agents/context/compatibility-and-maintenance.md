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
- generation prunes stale schema files and avoids some duplicate exports;
- generated packages declare granular exports and generated tests;
- revisions preserve changed schema snapshots;
- clear field renames can preserve database columns;
- ambiguous rename candidates fail before destructive SQL unless explicitly
  forced in the live-upgrade path;
- package tests, template workflows, and skill installer tests cover selected
  contracts.

These checks do not form a universal compatibility handshake.

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
- stale-file, rename, and removal behavior;
- generated package compile/import;
- package tarball and exports;
- supported adapter/connector combinations;
- SSR, hydration, interaction, and browser snapshot safety;
- authorization/error behavior across affected surfaces;
- scaffold and skill acceptance against current package APIs;
- template or end-to-end flow when shared behavior changes.

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
