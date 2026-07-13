# Phase 5 Verification Guide

## Accepted Target

Every package should have passing tests above 90% coverage. Current repository
coverage is incomplete and another developer is addressing it. The guide must
state both the target and current limitation rather than claiming enforcement
that does not yet exist.

Coverage does not replace contract-specific evidence.

## Verification Matrix

| Change class | Required evidence for new work |
| --- | --- |
| package source | owning package build plus passing tests above 90% coverage |
| plugin/lifecycle | bootstrap plus expected phase registration and disabled/configured behavior |
| event/script | direct mechanism test plus event request/response/status/error adaptation |
| public export | CJS and ESM build, declaration resolution, package export and consumer import |
| Idea/schema | parse/compile plus expected normalized semantics |
| transform | clean generation and repeat-generation stability |
| generated/runtime pair | generated compile/import plus later lifecycle registration/reachability |
| page/view | route pairing, SSR, hydration, interaction, snapshot/accessibility evidence as affected |
| API/MCP/access | auth, validation, event mapping, status/error mapping, transport response |
| adapter/target | native integration and target-specific behavior/tests |
| aggregate package | default composition/order, facade exports, build, pack, import, representative template |
| template/config | configured workflow and relevant end-to-end operation |
| scaffold/skill | clean install/copy and current command acceptance |

## Generator Verification

For every generator change:

1. generate from a clean output;
2. generate again and check stability/no unintended duplication;
3. inspect emitted files and generated package export/type maps;
4. compile or emit the generated package;
5. import through declared consumer paths;
6. prove runtime loading and listener/route/tool/component registration;
7. verify rendered behavior for generated UI;
8. check phrase/component/public contract compatibility where affected.

Rename/removal cleanup is required only where the owning generator promises it.
Schema pruning must keep working. Elsewhere, record stale behavior honestly and
use generated-client purge when a clean rebuild is needed.

## Change Impact

After narrow verification, inspect:

- manifest exports and `typesVersions` for public surface changes;
- aggregate forwarding only when the facade intentionally exposes the contract;
- aggregate plugin only when default cross-environment composition changes;
- templates when they are the maintained integration consumer;
- skills/scaffolds when contributor or generated structure changes;
- docs and KB when reusable accepted behavior or contributor routing changes;
- sibling libraries when a foundation contract, not Stackpress adaptation,
  changed.

Do not make unrelated legacy repairs part of the contribution. Record known
manifest/export defects and the current SQL helpers violation separately.

## Root Command Caveat

Root `yarn test` currently covers only server, schema, and SQL. Passing it does
not prove other changed packages. Run the owning workspace's test and coverage
command directly until root orchestration covers every package.

Root `yarn build` excludes desktop, which uses `build:desktop`. Optional-package
verification must use its explicit command and representative consumer.

## Closeout Evidence

Report:

- semantic owner and exact source locations changed;
- execution phases and callers affected;
- generated producer/runtime consumer pairs;
- public, aggregate, template, skill, scaffold, doc, and KB impact;
- package build/test/coverage result;
- contract-specific checks and representative integration result;
- known limitations, deferred repairs, and compatibility risk.

Source presence alone never proves generation, wiring, importability, runtime
reachability, rendering, or coverage.
