# Task 00001: Correct Root Package Roles

## Task Summary

Correct the root contributor description of website, desktop, and studio package
roles using current workspace/source truth.

## Implementation Steps

1. Replace the absent `packages/www` application entry with
   `templates/website`.
2. Move desktop out of planning-only wording and describe it as active optional,
   separately built, and outside default aggregate composition.
3. Preserve studio as planning-only with no active workspace manifest.
4. Keep wording concise and consistent with the surrounding layout guide.

## Verification Process

- compare paths and classifications with workspaces and manifests;
- confirm desktop source/build/plugin/template evidence;
- run Agent Workspace validation and `git diff --check`.

## Acceptance Criteria

Provide the revised section as rendered Markdown. The user visually approves its
clarity and package-role wording.

## Implementation Notes

Implemented on 2026-07-12 after sprint approval. Replaced the absent website
package entry, promoted desktop to active optional wording, and retained studio
as planning-only.

## Verification Notes

Verified against Yarn workspace resolution and current paths. `git diff --check`
and Agent Workspace validation pass.

## Acceptance Notes

User approved the rendered package-role wording on 2026-07-12.
