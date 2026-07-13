# Phase 4 Maintainer Clarifications

## Instructions

Source and tests cannot establish the intended policy for the questions below.
Answers should be recorded exactly in `decisions.md` before contributor synthesis.
No KB promotion occurs in this phase.

## Q-001: Desktop Contribution Status

Answer: It is an optional package.

Status: Resolved by user.

Current evidence: `stackpress-desktop` is a Yarn workspace with implementation,
tests, build/package scripts, plugin exports, and a blog-template consumer. Root
`AGENTS.md` calls it planning-only and omits it from the default root build.

Question: Should the contributor guide treat desktop as an active optional
package, or as an implemented but not-yet-supported contribution target?

## Q-002: Stale Package Classification

Answer: Yes, later contribution-guide work may correct stale root descriptions.

Status: Resolved by user.

Current evidence: root `AGENTS.md` describes `packages/www`, which is absent;
the current website application is `templates/website`.

Question: Should the later contribution-guide work include correcting these root
package-role descriptions, or only document the current source truth in the KB?

## Q-003: Manifest And Export Drift

Answer: Treat these as defects for later repair. The user did not identify any
as intentional pending paths.

Status: Resolved conservatively; do not repair during research.

Current evidence: multiple manifests list missing `bin.ts` files; aggregate
declares a missing binary and unmatched admin type paths; schema exports a missing
`config/typemaps` path.

Question: Should these be classified as defects to repair in a later
implementation task, or are any missing files/paths intentional pending work?

## Q-004: Generator Cleanup Rule

Answer: Outside schema's pruning behavior, a developer may purge the generated
client whenever desired. Per-generator cleanup is not enforced.

Status: Resolved by user.

Current evidence: all transforms share and modify one output tree. Schema prunes
renamed/removed generated schema files; equivalent cleanup behavior is not
uniformly present or tested across SQL, view, admin, and AI.

Question: Must every generator own removal/rename cleanup for the artifacts it
produces, or is a clean-output generation workflow the intended contract outside
schema's special pruning behavior?

## Q-005: Transform Order Stability

Answer: The current transform order is intentional.

Status: Resolved by user.

Current evidence: transforms execute in `schema.plugin` insertion order, which is
affected by aggregate/plugin loading order. SQL intentionally replaces a base
file that later transforms extend.

Question: Is current transform order an intentional contributor contract that
must be preserved, or merely an implementation detail until an explicit ordering
API is introduced?

## Q-006: Aggregate Inclusion Policy

Answer: Include the most commonly used capabilities that can apply to most web,
mobile, and desktop cases. Exclude explicit web, mobile, desktop, and AI cases.

Status: Resolved by user.

Current evidence: the aggregate plugin composes nine defaults; AI and desktop
remain optional; email is loaded indirectly by session. Source proves current
membership but not the rule for future packages.

Question: What criterion should decide whether a new package is added to
`packages/stackpress`—required for the default framework experience, broadly
useful, dependency-light, explicitly selected by you, or another rule?

## Q-007: Minimum Verification Policy

Answer: Ideally every package has tests passing above 90% coverage. Another
developer is currently adding tests for each package.

Status: Resolved by user; current repository coverage may lag the target.

Current evidence: root tests cover only server/schema/SQL, several packages have
no tests, and generator/runtime verification is uneven.

Question: Should the guide prescribe stronger minimum evidence for new changes
than the repository currently enforces? If yes, should every changed package
require tests, or should evidence remain change-class based?

## Q-008: Guide Authority

Answer: Cover both current accepted practice and the prescribed standard for new
work. `packages/stackpress-sql/src/helpers.ts` currently violates the intended
practices and another developer is fixing it; do not use it as a canonical
example.

Status: Resolved by user.

Current evidence: source contains stable patterns and real inconsistencies. A
comprehensive guide could either describe current practice faithfully or define
the preferred standard contributors should move toward.

Question: Should the guide be descriptive of current accepted patterns,
prescriptive for all new contributions, or explicitly separate "current shape"
from "required for new work"?

## Optional Failure Evidence

If available, provide the exact failed fresh-session prompts and unsatisfactory
answers. They will become retrieval fixtures, but they do not change the eight
source-derived clarification questions above.
