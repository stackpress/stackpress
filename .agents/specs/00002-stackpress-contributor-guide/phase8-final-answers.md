# Phase 8 Normalized Final Answers

## RET-001

Treat one audit helper per model as model-derived output. Put durable generation
under the runtime owner's `packages/<pkg>/src/transform/`, register its absolute
path from that package's `src/plugin.ts` `idea` listener, patch generated exports
and `typesVersions`, and load/register generated audit capabilities during
`listen` after the client loader exists during `config`. Add it to the aggregate
only if it is a broadly applicable default; otherwise applications load it
explicitly. Verify clean/repeat generation, promised cleanup or purge/clean
regeneration, generated compile/import, startup registration and invocation,
access-surface policy, package tests above 90% coverage, and affected integration.

## RET-002

Package compilation emits framework CJS/ESM/declarations. Idea generation
creates one shared project and runs intentional ordered transforms to emit the
application client. Plugin bootstrap discovers/calls plugins, then lifecycle
initialization resolves `config`, `listen`, and `route`. Reactus build separately
produces configured view/deployment artifacts. Request runtime normalizes the
host request, resolves method/path actions and capabilities, creates response
state, performs SSR where applicable, dispatches the native response, and later
hydrates browser state.

## RET-003

A reusable framework generator belongs in the runtime consumer's
`src/transform/`; an app plugin transform is valid only for truly app-owned
output. Moving package generation to a root helper or app loses automatic
package contribution, intentional ordering, packaged path resolution,
co-versioned producer/consumer review, shared-file/export cooperation, portable
installation behavior, and standard verification.

## RET-004

An explicit mobile integration stays optional and outside default aggregate
composition. Default packages must be commonly applicable across web, mobile,
and desktop. Plugin membership, dependency, facade export, and root-build
participation remain separate decisions. Verify target behavior, package
exports/imports, plugin loading, and tests above 90% coverage.

## RET-005

Classify ownership first. App-specific code uses
`plugins/<name>/pages/<page>.ts`, `views/<page>.tsx`, and `plugin.ts`; reusable
session behavior uses the corresponding `packages/stackpress-session/src/session/`
locations. Register GET/POST import and view handlers during `route`; keep
authorization, validation, event calls, response/status, and redirects in the
page and presentation in the view. Verify auth, CSRF, validation, events,
redirects, SSR/hydration/accessibility, and app suite or package tests above 90%.

## RET-006

Put reusable mechanism in `src/scripts/<operation>.ts`, the Ingest boundary in
`src/events/<operation>.ts`, and register during `listen` from `src/plugin.ts`.
The event adapts request, policy, plugin lookup, status, and errors; the script
owns reusable logic. Verify direct mechanism, CLI and plugin invocation,
lifecycle registration, imports, status/errors, and changed packages above 90%.

## RET-007

No. `src/index.ts` is only the source-root step. Build CJS, ESM, and declarations;
align `exports` and `typesVersions` for any new subpath; declare the consumer
dependency; test actual imports; and run exporting and consuming package suites
above 90%. Aggregate facade forwarding is a separate intentional decision.

## RET-008

No. `packages/stackpress-sql/src/helpers.ts` is an explicit current violation
pending repair, not canonical guidance. Choose placement by semantic ownership
and use the accepted source lane.

## RET-009

No. Root `yarn test` covers server, schema, and SQL, not API. Run the API package
suite above 90% coverage and add access-surface proof for authentication,
validation, event invocation, status/error mapping, and affected integration.
