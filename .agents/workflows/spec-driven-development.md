# Spec Driven Development Workflow

<!-- agent-workspace-rules:start -->
Use this workflow when the user wants spec driven development work, including creating a spec, finding or resolving spec Gaps, planning research, planning Proofs, freezing a spec, or preparing implementation from `.agents/specs/*/`.

Do not use this workflow merely because a task mentions a spec file. Use it when the task is about the spec lifecycle.

## Source Of Truth

`.agents/context/` is the agent source-of-truth folder. Spec Files are planning records, evidence packets, and frozen implementation contracts; they must never be treated as the source of truth over `.agents/context/`.

If a Spec File conflicts with `.agents/context/`, record the conflict as a Gap in `decisions.md`. Resolve it with user confirmation, evidence, or context promotion before treating the spec as implementation-ready.

Do not make future specs depend on sibling specs for shared truth. Promote accepted reusable planning truth into `.agents/context/` so future specs can discover it from `.agents/context/index.md`.

## Read First

1. `.agents/AGENTS.md`
2. `.agents/TERMS.md`
3. `.agents/context/index.md`, when Context Files exist
4. `.agents/specs/manifest.md`, when it exists
5. `.agents/specs/<spec-id>/index.md`, when updating an existing spec
6. relevant Spec Files, Source Material, project files, and user instructions

Do not load unrelated spec folders unless the current spec explicitly links to them or the user asks for cross-spec review.

## Spec Folder Naming

Use `.agents/specs/00001-meta-title`.

Start with `00001`, increment for each new spec, and replace `meta-title` with a lowercase hyphenated name that helps an agent infer what the spec is about.

## 1. Setup Spec Folder

1. Choose a `<spec-id>` that follows Spec Folder Naming.
2. Create `.agents/specs/manifest.md` if it is absent. Use it only as a routing index for spec packages.
3. Create `.agents/specs/<spec-id>/index.md` as the entry point. Link each Spec File and state when to load it.
4. Create `.agents/specs/<spec-id>/brief.md`. Preserve user-defined goals as written, then add concise scope, non-goals, source material, and context links.
5. Create `.agents/specs/<spec-id>/status.md`. List the work items required before the spec can be Frozen and give each item a status and next action.
6. Do not create optional Spec Files before they are needed by the workflow.

## 2. Assumptions

1. Create or update `.agents/specs/<spec-id>/decisions.md` as the Gap and decision ledger.
2. Scan Context Files and current Spec Files to identify initial Gaps. Each Gap must be written as a question and paired with one of:
   - an assumption to verify
   - an accepted decision
   - an explicit unresolved status and owner
3. Create or update `.agents/specs/<spec-id>/research.md` for online or source research topics, status, findings, and affected Gaps.
4. Create or update `.agents/specs/<spec-id>/proofs.md` for Proofs that may be needed to answer Gaps.
5. Report the proposed research topics, Gaps, assumptions, decisions, and Proofs to the user before starting expensive research or implementation.
6. Update `research.md`, `decisions.md`, and `proofs.md` after user adjustments.

## 3. Research Loop

1. Research only the topics in `research.md` unless new evidence reveals a necessary follow-up.
2. Record sources checked, access dates when available, findings, rejected leads, and affected Gap IDs or headings.
3. When research answers a Gap, update `decisions.md` with the answer, evidence, and remaining risk.
4. When research creates a new Gap, add it to `decisions.md` as a question with an assumption, decision, or unresolved status.
5. When research proves a planned Proof unnecessary, mark it invalidated or deferred in `proofs.md` and explain why.
6. When research reveals a needed Proof, add it to `proofs.md` with expected signal, failure signal, and the Gap it addresses.
7. If research suggests new topics, report them to the user before expanding the research queue.
8. Repeat until research is complete, explicitly deferred, or blocked.
9. Update `status.md` when research is ready to Freeze.

## 4. Proof Loop

Use Proofs for technical uncertainty that cannot be resolved by reading docs, source, or existing behavior.

If no Proofs are required, record `Proofs: not required` in `status.md`. Do not create root `proofs/`, create prototype folders, or run the Proof Loop.

1. Create root `proofs/` if it is absent when the first Proof needs prototyping.
2. Keep `.agents/specs/<spec-id>/proofs.md` as the required Proof queue and result ledger.
3. For each planned Proof, record the Gap question, hypothesis, expected proof signal, failure signal, scope, non-goals, and prototype path in `proofs.md`.
4. Prototype each Proof under root `proofs/<proof-slug>/`. Keep prototype implementation artifacts outside `.agents/`.
5. After each Proof, record the result in `.agents/specs/<spec-id>/proofs.md` as proved, failed, inconclusive, deferred, or invalidated. Include evidence, commands or checks run, and what remains unknown.
6. Address answered Gaps in `decisions.md` based on proof results. Add new Gaps as questions when proof results expose new unknowns.
7. If proof results suggest new Proofs, report the proposed Proofs to the user, ask for adjustments, update `proofs.md`, and repeat the prototype loop.
8. Promote only accepted reusable Proof learning into `.agents/context/`; leave disposable prototype details in `proofs/` and spec-local records.
9. Freeze Proofs in `.agents/specs/<spec-id>/status.md` when required Proofs are proved, failed with an accepted fallback, invalidated, deferred, or explicitly accepted as unresolved by the user.

## Optional Planning Loops

Use optional companion workflows any time during spec planning, in any order, and as many times as needed:

- [Spec Grill Session Workflow](spec-grill-session.md): use when unresolved Gaps, fuzzy terms, interrupted Q/A, or decision ambiguity need one-question-at-a-time clarification.
- [Spec User Journeys Workflow](spec-user-journeys.md): use when the spec has user-facing behavior, actors, permissions, lifecycle states, integrations, or step sequencing that should be mapped before Freeze.

These loops are not required for every spec. When a loop is invoked, update the spec `index.md`, `decisions.md`, and `status.md` with the result. When a loop is not applicable but its absence affects Freeze readiness, record `not applicable` in `status.md` with a reason.

## Context Promotion And Demotion

Run a context promotion review at research closeout, after accepted Proofs, at spec Freeze, and after implementation closeout.

Promote an item into `.agents/context/` only when it is accepted or Frozen, reusable beyond the current spec, and useful for future agents before opening spec details.

Promote accepted reusable:

- product goals, constraints, terms, and non-goals
- decisions that future specs must inherit
- proven technical learning and rejected assumptions
- stable user-facing behavior or workflow rules
- implementation-discovered facts after they are verified

Do not promote:

- open Gaps
- temporary assumptions
- raw research notes
- one-spec tasks or checklists
- implementation sequencing
- disposable Proof details
- stale or contradicted claims

When promotion changes `.agents/context/`, update `.agents/context/index.md`. If provenance is long or external, put it in `.agents/references/` and link from Context Files with useful load guidance.

Demote content out of `.agents/context/` when it is not Accepted Reusable Truth, is stale or contradicted, is too narrow for shared context, or belongs in a Spec File, Reference File, or Resource File instead. Preserve useful material in the right lower-authority location. If the correct demotion destination is unclear, ask the user where to demote it before editing.

## Freeze

A spec can be Frozen only when:

- `brief.md` states the accepted scope and user goals
- `status.md` shows no unresolved freeze blockers
- `decisions.md` has every material Gap answered, accepted, deferred, or explicitly unresolved with user approval
- required research is complete or explicitly deferred
- Proofs are marked not required in `status.md`, or required Proofs are recorded in `proofs.md` and Frozen in `status.md`
- reusable accepted truth has been promoted or deliberately left spec-local
- the spec does not conflict with `.agents/context/`

After Freeze, do not change Frozen Spec Files unless the user explicitly permits reopening them. If new evidence appears, record the need to reopen, the affected files, and the reason before editing.

## Implementation Planning

After Freeze, use [Spec Task Implementation Workflow](spec-task-implementation.md) when the user wants to plan or implement technical tasks from `.agents/specs/<spec-id>/`.

Implementation planning belongs under `.agents/specs/<spec-id>/tasks/`. Keep implementation sequencing, task status, verification notes, and user acceptance records out of `.agents/context/` unless implementation reveals accepted reusable truth that future specs should inherit.

## Validate

Run the Agent Workspace validator after creating, splitting, freezing, or promoting Spec Files:

```bash
python .agents/scripts/validate-agent-workspace.py
```

Use `python3` instead of `python` on systems where that is the Python 3 executable.

## Handoff

End each SDD pass by stating the spec ID, current freeze status, open Gaps, research status, Proof status, context promotion performed or skipped, files changed, validation result, recommended next step, and any useful alternatives.
<!-- agent-workspace-rules:end -->
