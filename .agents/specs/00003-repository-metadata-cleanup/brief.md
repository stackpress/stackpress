# Brief

## User Goal

Perform the recommended narrow repository-maintenance work after completing the
Stackpress contributor KB:

1. Correct stale root `AGENTS.md` package-role descriptions.
2. Audit and repair confirmed package manifest/export drift.

## In Scope

- Describe `stackpress-desktop` as an active optional workspace/package.
- Remove or replace the absent `packages/www` description with current website
  application truth.
- Preserve `stackpress-studio` as planning-only while it has no manifest.
- Repair manifest declarations that point to files/subpaths absent from source
  and both build trees:
  - missing `bin.ts` file-list entries;
  - aggregate `stackpress` bin declaration;
  - aggregate admin `typesVersions` entries;
  - schema `config/typemaps` exports and type mappings.
- Verify JSON validity, workspace builds, package pack contents, public imports,
  runtime CLI availability, and Agent Workspace consistency.

## Non-Goals

- Do not edit `packages/stackpress-sql/src/helpers.ts` or related placement work.
- Do not modify package test coverage or root test orchestration; another
  developer owns that work.
- Do not add replacement files merely to satisfy stale declarations unless
  current source/history proves the files are intended contracts.
- Do not change plugin composition, transform ordering, package versions, or
  published API beyond removing non-resolving declarations.
- Do not commit, push, or open a pull request without a separate user request.

## Source Material

- root `AGENTS.md` and `package.json`;
- `yarn workspaces info`;
- affected package manifests and tracked source/build trees;
- `packages/stackpress-server/bin.ts` and root CLI delegation;
- templates and package dependency graph;
- local Git history for introduction/removal evidence;
- accepted contributor and compatibility context.

## Completion Criteria

- Root package-role guidance matches current workspace/source truth.
- No affected manifest declares the confirmed missing files or subpaths.
- Runtime CLI remains available through the intended package chain.
- Affected builds, pack checks, imports, and deterministic workspace validation
  pass.
- Temporary SQL-helper and coverage exceptions remain untouched.
