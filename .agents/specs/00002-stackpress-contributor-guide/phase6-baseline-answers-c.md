# Phase 6 Baseline Answers C

## RET-007

No. Adding the class to `packages/stackpress-schema/src/index.ts` only exposes it
from the package root in source. Confirm the intended access surface:

- Root import: ensure both CJS and ESM builds produce the export, then test an
  actual import.
- New subpath import: also add the subpath to `package.json`'s `exports` and
  `typesVersions`.

Because another package consumes it, run the narrow schema tests/build plus the
affected consumer path. The accepted guidance explicitly says source presence
alone does not prove importability.

## RET-008

Do not copy it merely because it is convenient. Route the behavior by semantic
ownership:

- If the helper is SQL-specific, consume the public `stackpress-sql` export or
  keep the caller dependent on that package.
- If it is genuinely shared foundation behavior, move/expose it through the
  package that owns that primitive and update callers.
- If it is internal or transform-specific, treat that as a signal to reassess
  the design rather than duplicating it.

In this checkout, `stackpress-sql/src/helpers.ts` already has a public
`./helpers` export, while some internals such as `./transform/helpers.js` are
separate implementation details.

## RET-009

No. Root `yarn test` currently aliases `yarn test:core`, which runs only server,
schema, and SQL tests; it does not run `stackpress-api`'s test suite. Run the API
workspace tests (`yarn api test`) and add the smallest convincing proof for the
changed API contract—typically authentication, validation, event invocation,
and status/error mapping, plus any affected template or end-to-end path. Fresh
evidence must exercise the changed surface.
