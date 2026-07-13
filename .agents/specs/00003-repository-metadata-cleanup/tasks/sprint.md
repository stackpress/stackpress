# Proposed Implementation Sprint

## Status

Accepted by the user on 2026-07-12.

## Scope Shape

This is metadata/documentation maintenance. It needs no reusable foundation,
placeholder, frontend, interaction, integration-stub, or refactor layers. Two
ordered primary-output tasks are sufficient because the edits are independent
but share final packaging and workspace validation.

## Acceptance Policy

Acceptance is reserved for something the user can visually review as a human.
Code diffs, JSON inspection, command output, automated tests, builds, and pack or
import checks are validation evidence, not acceptance criteria.

When a task has no meaningful rendered or user-facing artifact, state
`Acceptance: not applicable` rather than relabeling technical validation as
human acceptance.

## Task 1: Correct Root Package Roles

Planned output:

- update root `AGENTS.md` to describe `stackpress-desktop` as active optional;
- remove the absent `packages/www` application entry;
- describe `templates/website` as the current private website application;
- preserve `stackpress-studio` as planning-only.

Verification:

- compare statements with root workspaces and `yarn workspaces info`;
- confirm referenced directories/manifests exist or are explicitly planning-only;
- run Agent Workspace validation because accepted context currently records the
  stale-guidance exception.

Human acceptance artifact:

- provide a rendered Markdown preview of the revised repository-layout/package-
  roles section, showing the final wording as a contributor would read it;
- the user visually reviews whether desktop, website, and studio roles are clear
  and whether the wording avoids implying desktop is part of the default
  aggregate/build.

Acceptance criterion:

- the user approves the rendered documentation wording.

## Task 2: Remove Non-Resolving Manifest Declarations

Planned output:

- remove aggregate `bin` and stale `bin.ts` file-list entry;
- remove API/email/view stale `bin.ts` file-list entries;
- remove aggregate admin `typesVersions` entries;
- remove schema `config/typemaps` runtime export and type mapping.

Verification:

1. parse all edited JSON;
2. run affected package builds in dependency order;
3. run affected package dry-run pack checks and confirm removed targets are gone;
4. verify aggregate/server CLI ownership and representative CJS/ESM imports;
5. run `git diff --check`;
6. rerun Agent Workspace validation;
7. confirm SQL helpers and package test-coverage work remain untouched.

Validation completion:

- no edited manifest points to a missing target;
- package builds and pack inspections pass;
- the runtime CLI remains server-owned and available;
- no unrelated public surface or implementation changes.

Acceptance: not applicable. Manifest cleanup has no meaningful non-code visual
artifact for human review; its completion is established by validation only.

## Ordering Rationale

Correct package-role guidance first so review language matches the package model
used to assess manifest ownership. Apply all manifest removals together so build,
pack, and import verification observes one coherent metadata state.

## Closeout

After both tasks verify, review whether compatibility context can remove the
generic missing-manifest exception. Keep the SQL helpers and coverage exceptions
until their separately owned repairs are verified. Task 1 remains `verified`
until the user approves its rendered Markdown artifact. Task 2 has no acceptance
artifact and records acceptance as not applicable. No commit or push is implied.
