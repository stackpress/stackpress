# Task 00002: Remove Manifest Drift

## Task Summary

Remove confirmed non-resolving file, bin, export, and type declarations from the
affected package manifests without changing implementation or public working
surfaces.

## Implementation Steps

1. Remove aggregate bin and stale file/type entries.
2. Remove API/email/view stale `bin.ts` file entries.
3. Remove schema typemap runtime/type mappings.
4. Verify JSON, builds, packs, imports, CLI ownership, diff scope, and Agent
   Workspace consistency.

## Verification Process

- parse edited manifests;
- build affected packages in dependency order;
- inspect dry-run package contents;
- verify representative imports and server-owned CLI;
- run `git diff --check` and Agent Workspace validation;
- confirm separately owned SQL-helper and coverage work is untouched.

## Acceptance Criteria

Acceptance: not applicable. This task has no meaningful non-code visual artifact;
its completion is established by technical validation.

## Implementation Notes

Implemented on 2026-07-12 after sprint approval. Removed only the approved
non-resolving bin, file-list, admin type, and schema typemap declarations.

## Verification Notes

JSON parsing passed. Schema, email, view, API, and aggregate builds passed. All
five dry-run packs passed with no forbidden missing targets. Representative CJS
and ESM imports passed. The workspace `stackpress` command points to
`packages/stackpress-server/bin.ts`. `git diff --check` and Agent Workspace
validation pass. SQL helpers and coverage work were untouched.

## Acceptance Notes

Not applicable under the user-approved sprint policy. Closed after technical
validation on 2026-07-12.
