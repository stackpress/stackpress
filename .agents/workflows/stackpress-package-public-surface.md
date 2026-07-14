# Stackpress Package Public Surface Workflow

Use this workflow when adding or moving a public type, helper, function, class,
constant, or source file under `packages/*`, especially when the symbol may also
be exposed through the `stackpress` aggregate facade.

Do not use it for private file-local changes or generated-client exports. Follow
the generator procedure in the contributor reference for generated artifacts.

## Read First

1. [Extension And Contribution](../context/extension-and-contribution.md) for
   semantic ownership and source-boundary rules.
2. [Contributor Source Patterns](../references/00018-contributor-source-patterns.md)
   for exact placement and public-surface requirements.
3. [Architecture And Composition](../context/architecture-and-composition.md)
   only when aggregate eligibility is in question.
4. [Exports, Types, And Generated Contracts](../references/00014-exports-types-generated-contracts.md)
   when changing a subpath, aggregate alias, or package manifest.

## 1. Classify The Surface

Before editing, identify:

- the focused package that owns the symbol;
- whether it is a type or runtime value;
- whether it is private, subpath-only, package-root public, aggregate-domain
  public, or aggregate-root public;
- whether the target entrypoint is server-only, browser-safe, or shared.

Do not infer aggregate exposure from plugin registration, dependency presence,
or build participation. Each public layer is an explicit decision.

## 2. Update The Owning Package

| Symbol | Owning package placement |
| --- | --- |
| shared public type | define or re-export from `src/types.ts`; export with `export type` from `src/index.ts` |
| subpath-specific type | keep with its subpath; export only from that subpath unless promoted separately |
| runtime value | implement in its semantic source file; export from `src/index.ts` only when package-root public |
| generally reusable helper | use a focused root helper module when appropriate |
| niche helper | keep local to its consumers, even when small duplication is clearer |

Preserve `.js` suffixes in source imports. Never edit `cjs/` or `esm/` as the
durable source.

## 3. Update Public Subpaths

When adding or changing a direct import path:

1. Add the source entrypoint.
2. Align the owning package's `package.json` `exports` and `typesVersions`.
3. Confirm both CJS and ESM builds emit the entrypoint and declaration.

Adding a symbol to an existing barrel does not require a new manifest entry.

## 4. Propagate Through The Aggregate

Only propagate symbols deliberately selected for the `stackpress` facade. Skip
layers that are not part of the intended public surface.

For types:

```text
packages/<pkg>/src/types.ts
  -> packages/<pkg>/src/index.ts
  -> packages/stackpress/src/<domain>/types.ts
  -> packages/stackpress/src/<domain>/index.ts
  -> packages/stackpress/src/types.ts
  -> packages/stackpress/src/index.ts
```

For runtime values:

```text
packages/<pkg>/src/<source>.ts
  -> packages/<pkg>/src/index.ts
  -> packages/stackpress/src/<domain>/index.ts
  -> packages/stackpress/src/index.ts
```

The domain facade and aggregate root are separate promotion decisions. Use
explicit aliases for root-name collisions and prefer named forwarding so the
facade remains reviewable.

Add or change aggregate `package.json` entries only when exposing a new or
changed aggregate subpath.

## 5. Verify The Promised Imports

1. Build and test the owning package with Node.js 22 and Yarn.
2. Test every public import path promised by the change, including type-only
   imports where applicable.
3. If `packages/stackpress` changed, build and test the aggregate and exercise
   the affected focused and root imports.
4. If a manifest changed, verify CJS, ESM, declarations, packed contents, and a
   consumer import.
5. Apply the public export/manifest verification requirements from
   [Extension And Contribution](../context/extension-and-contribution.md#verification-matrix).
6. Confirm generated output was not edited as durable source and unrelated
   package surfaces were not broadened.

## Handoff

Report the semantic owner, selected public layers, files changed, aliases or
subpaths added, verification performed, intentionally skipped layers, and any
remaining consumer or release sequencing.
