# Stackpress GitHub Release Workflow

Use this workflow to draft, review, and publish synchronized GitHub releases for
the coordinated Stackpress release set, especially when GitHub Releases have
fallen behind package versions.

This workflow manages GitHub releases only. It does not publish packages, change
package versions, push commits, rewrite tags, or create release branches.

## Read First

1. [Compatibility And Maintenance](../context/compatibility-and-maintenance.md)
   for the authoritative release set and compatibility boundaries.
2. The `AGENTS.md` in every local sibling repository that will be inspected.
3. Current remote manifests and GitHub release state; do not rely on stale local
   tags when public release state can be checked directly.

## Release Set And Version Sources

Use this order throughout the workflow:

| Repository | Coordinated manifests |
| --- | --- |
| `stackpress/lib` | `package.json` |
| `stackpress/idea` | `packages/idea/package.json`, `packages/idea-parser/package.json`, `packages/idea-transformer/package.json` |
| `stackpress/ingest` | `ingest/package.json` |
| `stackpress/inquire` | `packages/inquire*/package.json` |
| `stackpress/reactus` | `reactus/package.json` |
| `stackpress/stackpress` | root `package.json` and active `packages/*/package.json` |

Exclude examples, templates, documentation helpers, generated `cjs`/`esm`
manifests, planning-only directories, and the Idea language extension.

## 1. Establish The Target

1. Read the intended version from the coordinated manifests on each remote
   default branch.
2. Require every coordinated manifest to contain the same exact version.
3. Use that version as the stable tag without a `v` prefix.
4. Record each default branch and target commit SHA.
5. Stop on any version mismatch, missing manifest, local-only unpublished
   version change, or target tag/release collision.

Do not repair a mismatch as part of release catch-up unless the user separately
authorizes the version changes and their commits.

## 2. Establish Each Comparison Boundary

For each repository, query GitHub's latest published stable release. Use the
published release rather than the newest tag because stray, prerelease, or
unpublished tags must not silently change the notes boundary.

```bash
gh api repos/stackpress/<repo>/releases/latest --jq .tag_name
```

Record the previous release, target version, default-branch SHA, compare URL,
and commit count. If no prior published release exists, report that the notes
cover the repository's full history and ask before continuing.

## 3. Generate Repository-Specific Notes

Generate notes independently for all six repositories. The version is shared;
the change summaries are not.

```bash
gh api --method POST repos/stackpress/<repo>/releases/generate-notes \
  -f tag_name=<version> \
  -f target_commitish=<default-branch> \
  -f previous_tag_name=<previous-release>
```

Use GitHub's output as a baseline, then review the complete comparison and add
material direct-to-branch changes that generated notes omit. Keep user-facing
features, fixes, migration notes, and breaking changes above maintenance-only
details. Preserve pull-request and contributor links.

If a repository has no user-facing changes, state that plainly. Do not omit it
from the release set merely because another repository contains the primary
change.

## 4. Review Gate

Before any release mutation, present:

- one boundary table covering all six repositories;
- the six complete release-note drafts;
- version, tag style, target branch, and target SHA;
- any existing tags, prereleases, ambiguous boundaries, or empty comparisons;
- the exact `gh release` operations proposed.

Obtain explicit user approval to create drafts or publish releases. Approval of
release notes alone is not approval to publish.

## 5. Create Draft Releases

After approval, create drafts first so the full coordinated set can be checked
before publication:

```bash
gh release create <version> \
  --repo stackpress/<repo> \
  --target <default-branch> \
  --title <version> \
  --notes-file <repo-notes-file> \
  --draft
```

Create drafts in release-set order. Verify every draft's version, target, title,
notes, draft state, and prerelease state. If any draft fails, stop and report
the partial set; do not delete drafts, tags, or published releases automatically.

## 6. Publish The Coordinated Set

Publishing requires a second explicit approval after draft verification. Publish
in release-set order:

```bash
gh release edit <version> \
  --repo stackpress/<repo> \
  --draft=false \
  --latest
```

After each publication, verify the release URL, tag, target commit, and published
state. A partial failure must stop the sequence and be reported immediately.
Never move or delete an already published tag as automatic recovery.

## 7. Closeout

Report:

- the shared released version;
- all six release URLs and target SHAs;
- the previous-to-current comparison used for each repository;
- any repository with no user-facing changes;
- partial drafts, publication failures, or follow-up corrections;
- confirmation that package publication and source pushes were not performed.

If only drafts were requested, state clearly that no release was published.
