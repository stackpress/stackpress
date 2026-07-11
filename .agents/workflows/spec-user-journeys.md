# Spec User Journeys Workflow

<!-- agent-workspace-rules:start -->
Use this optional workflow when a spec has user-facing behavior, actors, permissions, lifecycle states, integrations, or step sequencing that should be mapped before Freeze.

Do not use this workflow for every spec. For pure backend cleanup, narrow migrations, technical proofs, or refactors with no meaningful user or actor flow, record `User journeys: not applicable` in `status.md` with a reason instead of creating `journeys.md`.

`<spec-id>` follows the [Spec Folder Naming](spec-driven-development.md#spec-folder-naming) convention.

## Source Of Truth

`.agents/specs/<spec-id>/journeys.md` is a spec-local planning record, not shared source of truth. Promote accepted reusable journey behavior into `.agents/context/` only when it is stable beyond the current spec.

`.agents/specs/<spec-id>/decisions.md` remains the Gap and decision ledger. Add Gaps there when journeys expose unresolved scope, integration, actor, permission, state, or implementation questions.

## Read First

1. `.agents/AGENTS.md`
2. `.agents/TERMS.md`
3. `.agents/workflows/spec-driven-development.md`
4. `.agents/context/index.md`, when Context Files exist
5. `.agents/specs/manifest.md`, when it exists
6. `.agents/specs/<spec-id>/index.md`
7. `.agents/specs/<spec-id>/brief.md`, `decisions.md`, `status.md`, and existing `journeys.md` when they exist
8. relevant Spec Files, Context Files, Source Material, wireframes, creative designs, code, and user instructions

Do not load unrelated spec folders unless the current spec links to them or the user asks for cross-spec review.

## Applicability Gate

Before creating `journeys.md`, decide whether user journeys are useful for the current spec.

Create or update `journeys.md` when the spec includes any of:

- user-facing behavior
- multiple actors or roles
- permission boundaries
- lifecycle state changes
- handoffs between systems, users, or teams
- integration entry or exit points
- step sequencing that affects implementation or acceptance

If none apply, update `status.md` with `User journeys: not applicable` and the reason.

## Create Or Update Journeys

1. Create `.agents/specs/<spec-id>/journeys.md` only when applicable.
2. Link `journeys.md` from `.agents/specs/<spec-id>/index.md`.
3. Scan Context Files, Spec Files, Source Material, wireframes, creative designs, and code to identify journeys.
4. Record every material journey that applies to the spec, including happy paths, recovery paths, permission failures, handoffs, and out-of-scope edges that affect the spec boundary.
5. Mark each journey step as `in-scope`, `out-of-scope`, `deferred`, `external`, or `unknown`.
6. Mark each step as `implementable`, `not-implementable`, `blocked`, or `evidence-only`.
7. Add Gaps to `decisions.md` when a journey exposes unclear integration between in-scope and out-of-scope steps, missing actors, unclear ownership, unsupported code behavior, or acceptance ambiguity.

## Journey Record Shape

Use concise records that future agents can scan quickly:

- `Journey ID`
- `Actor`
- `Goal`
- `Trigger`
- `Preconditions`
- `Steps`
- `Scope notes`
- `Implementable steps`
- `Evidence links`
- `Gaps created or resolved`
- `Acceptance impact`

Use diagrams only when they clarify the flow. Text records are sufficient by default.

## Reconcile

After updating journeys:

1. Update `decisions.md` for journey-created, journey-resolved, or journey-deferred Gaps.
2. Update `status.md` with journey workflow status and next action.
3. Promote accepted reusable journey behavior into `.agents/context/` only when it should guide future specs.
4. Keep one-spec journey detail in `journeys.md`.
5. If a journey contradicts Context Files, Spec Files, wireframes, creative designs, or code, record the contradiction as a Gap before treating the journey as accepted.

## Validate And Handoff

Run the Agent Workspace validator after creating or updating Spec Files:

```bash
python .agents/scripts/validate-agent-workspace.py
```

Use `python3` instead of `python` on systems where that is the Python 3 executable.

End each journey pass by stating the spec ID, whether journeys were applicable, journeys added or changed, in-scope steps, blocked or unknown steps, new Gaps, validation result, recommended next step, and any useful alternatives.
<!-- agent-workspace-rules:end -->
