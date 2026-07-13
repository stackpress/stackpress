# Phase 7 KB Promotion Proposal

## Status

Review first. Do not edit accepted KB files until the user approves this map.

## Promotion Goal

Make a cold agent reliably choose exact contribution locations, understand all
execution phases, preserve generator/aggregate contracts, avoid known defects,
and select the accepted verification target without loading this spec.

## Proposed Context Updates

### `context/extension-and-contribution.md`

Own the compact contributor decision system:

- current accepted shape versus requirements for new work;
- semantic-owner classification before exact paths;
- event adapter plus `src/scripts/` mechanism pattern;
- page plus view plus `route` pairing;
- default aggregate inclusion criterion and optional target exclusions;
- package tests passing above 90% coverage as the target;
- load guidance for the detailed contributor source-pattern reference.

Repair targets: RET-005, RET-006, RET-007, RET-009.

### `context/modeling-and-generation.md`

Own generation-specific accepted rules:

- seven-phase distinction where generation intersects compilation/runtime;
- intentional transform ordering;
- package-owned transform and runtime-consumer pairing;
- repeat generation stability;
- schema's pruning guarantee versus non-universal cleanup elsewhere;
- generated-client purge as an allowed developer recovery path.

Repair target: RET-001.

### `context/architecture-and-composition.md`

Own aggregate architecture:

- include commonly used cross-environment defaults;
- keep explicit web, mobile, desktop, and AI packages optional;
- distinguish plugin composition, dependencies, facade exports, and build
  participation;
- preserve intentional aggregate/transform order.

RET-004 already passed; this makes the maintainer criterion explicit.

### `context/compatibility-and-maintenance.md`

Own current exceptions and drift boundaries:

- test coverage is incomplete even though new work targets above 90%;
- manifest/export missing paths are defects for later repair;
- `stackpress-sql/src/helpers.ts` is a current noncanonical violation pending
  separate repair and must not be copied;
- stale generated output outside schema may require client purge rather than an
  assumed per-generator cleanup guarantee.

Repair targets: RET-001 and RET-008.

### `context/index.md`

Adjust load descriptions only if needed so contribution questions route first to
extension/contribution and generator questions also route to modeling/generation.
Do not redesign the accepted eight-domain taxonomy.

## Proposed Detailed Reference

Create `references/00018-contributor-source-patterns.md`, linked from
`context/extension-and-contribution.md`, containing:

- package anatomy classes;
- seven execution phases;
- exact source-placement matrix;
- plugin/lifecycle rules;
- event/script and page/view pair recipes;
- generator recipe and generated/runtime chain;
- aggregate decision checklist;
- public exports/CJS/ESM/types checklist;
- current-versus-new-work labels;
- package test/coverage and contract verification matrix;
- known exceptions that must not be copied;
- concise current source anchors.

This reference addresses exactness without pushing context files over their
compact mental-model role.

## Existing Reference Updates

### `references/00009-cli-and-plugin-contracts.md`

Revise statements that currently call aggregate/transform order merely
compatibility-sensitive checkout behavior. Preserve current mechanics while
recording the maintainer decision that order is intentional. Link to the new
contributor reference for source placement rather than duplicating it.

### `references/00015-operational-examples.md`

Add or tighten load guidance only if a short end-to-end example is needed after
the new reference exists. Do not duplicate the full placement matrix.

## Deliberately Excluded Work

- Do not repair source or package manifests during KB promotion.
- Do not edit `stackpress-sql/src/helpers.ts`; another developer owns that repair.
- Do not invent mobile/web packages or an ordering API.
- Do not claim root tests enforce every package's coverage target today.
- Do not require universal per-generator stale cleanup.
- Do not reopen the frozen KB-population spec.

## Related Later Implementation Work

Route separately after this spec:

- correct stale root `AGENTS.md` descriptions for desktop and absent `packages/www`;
- repair missing manifest/export paths;
- reconcile root build/test orchestration with the evolving package test suite;
- refresh the temporary SQL helpers exception after its external repair lands.

## Validation And Rerun Gate

After accepted promotion:

1. run the Agent Workspace validator;
2. check every new reference has a task-informative inbound Context Link;
3. rerun failed fixtures RET-001, RET-005, RET-006, RET-007, RET-008, and RET-009
   in new isolated sessions;
4. require all applicable rubric dimensions;
5. repair only the smallest owning KB layer and rerun again;
6. run all nine fixtures after any router/taxonomy change;
7. propose Freeze only after all fixtures pass or the user explicitly accepts a
   remaining failure.
