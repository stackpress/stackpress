# Spec Task Implementation Workflow

<!-- agent-workspace-rules:start -->
Use this workflow when the user wants to plan or implement technical work from a Frozen `.agents/specs/<spec-id>/` package.

Do not use this workflow before Freeze unless the user explicitly asks to draft an implementation plan early. If new planning gaps appear during implementation, record the reopen need in the spec and ask before changing Frozen Spec Files.

## Read First

1. `.agents/AGENTS.md`
2. `.agents/TERMS.md`
3. `.agents/context/index.md`, when Context Files exist
4. `.agents/specs/manifest.md`, when it exists
5. `.agents/specs/<spec-id>/index.md`
6. `.agents/specs/<spec-id>/brief.md`
7. `.agents/specs/<spec-id>/status.md`
8. relevant spec records, task files, project files, and user instructions

Do not load unrelated spec folders unless the current spec explicitly links to them or the user asks for cross-spec implementation planning.

## Status Model

Track spec implementation status in `.agents/specs/<spec-id>/status.md`:

- `proposed`: agent has made a task plan and is waiting for the user to finalize it.
- `accepted`: implementation plan is accepted.
- `completed`: implementation is completed.

Track task status in `.agents/specs/<spec-id>/tasks/status.md`:

- `proposed`: agent has proposed a task.
- `open`: user approved and task is opened to be worked on.
- `started`: task has been started.
- `verified`: task has been verified.
- `accepted`: user has accepted the task implementation.

Do not invent additional status values unless the user asks for them. When work cannot continue, keep the task at its current status and record the blocker and next action in the task file.

## 1. Propose Implementation Plan

1. Confirm the spec is Frozen or that the user wants an early implementation plan.
2. Create `.agents/specs/<spec-id>/tasks/` if it is absent.
3. Create or update `.agents/specs/<spec-id>/tasks/sprint.md`.
4. Add or update an implementation status tracker in `.agents/specs/<spec-id>/status.md` with status `proposed`.
5. Draft a maintainability-first implementation process in `tasks/sprint.md`.
6. Include task summaries, ordering rationale, verification process, and acceptance criteria.
7. Report the proposed plan to the user and ask for adjustments before creating final task files.

Use this planning rubric to design the sequence. Omit, merge, or rename layers that do not apply to the actual technical implementation, but state the reason in `tasks/sprint.md`. For each applicable layer, define planned outputs, relevant examples, verification process, and acceptance criteria.

1. Determine or create a reusable foundation layer.
   - Examples: templating, state management, resources, assets, icons, shared utilities, data contracts, interfaces, model types, or configuration.
   - Verification: unit tests where applicable.
   - Acceptance: code review, or explicit user abstention from review.
2. Determine or create a temporary placeholder layer.
   - Examples: text examples, sample images, sample code, fixtures, fake endpoints, mocked providers, test doubles, or scaffold data.
   - Verification: none unless placeholders affect runtime behavior, tests, or user-visible outputs.
   - Acceptance: none unless placeholders are user-visible or change expected behavior.
3. Determine or create reusable front end components or reusable technical units.
   - Examples: accordions, alerts, badges, breadcrumbs, buttons, cards, dialogs, popovers, form fields, heroes, loaders, notifiers, pagination, tables, tabs, trees, tooltips, command surfaces, service modules, domain modules, or adapters.
   - Verification: where applicable, unit tests, browser inspection, screenshots, recordings, contract tests, or sample command output.
   - Acceptance: sample front end views with all relevant components, or equivalent sample outputs proving the reusable units work.
4. Determine or create reusable front end layouts or composition structures.
   - Examples: header, footer, left or right asides, menus, grids, panels, routing shells, orchestration boundaries, integration shells, or module composition.
   - Verification: where applicable, unit tests, browser inspection, screenshots, recordings, integration tests, or shell-level smoke tests.
   - Acceptance: sample front end views with all relevant layouts, or equivalent sample outputs proving the composition works.
5. Determine or create event, action, and workflow handling.
   - Examples: clicks, hover states, drag and drop, keyboard events, game controller events, state transitions, commands, jobs, queue handlers, webhooks, or domain workflows.
   - Verification: where applicable, unit tests, functional tests, browser inspection, screenshots, recordings, contract tests, or workflow smoke tests.
   - Acceptance: sample front end views with all interaction points, or equivalent sample outputs proving the actions and workflows work.
6. Develop the primary outputs using the reusable layers.
   - Examples: front end screens/pages, API behavior, CLI behavior, background jobs, integrations, reports, exports, or automation flows.
   - Verification: where applicable, unit tests, functional tests, browser inspection, screenshots, recordings, integration tests, or end-to-end smoke tests.
   - Acceptance: actual front end views or equivalent primary outputs that match the Frozen spec.
7. Develop placeholders for external systems, back end endpoints, storage, providers, or expensive dependencies, and connect them to the primary outputs.
   - Examples: endpoint placeholders, repository stubs, storage adapters, payment/provider fakes, service mocks, or fixture-backed integrations.
   - Verification: where applicable, unit tests, functional tests, browser inspection, screenshots, recordings, contract tests, or integration smoke tests.
   - Acceptance: the same accepted outputs from layer 6 continue to work against placeholders.
8. Replace placeholders one by one with actual logic while deprecating the placeholder layer.
   - Examples: real endpoints, real persistence, real provider integrations, real validation, real permissions, or real background processing.
   - Verification: where applicable, unit tests, functional tests, browser inspection, screenshots, recordings, contract tests, integration tests, or end-to-end smoke tests.
   - Acceptance: the same accepted outputs from layer 6 continue to work with real logic.
9. Refactor code for maintainable boundaries.
   - Examples: abstraction, reusability, separation of responsibility, plugin patterns, event-driven boundaries, model layers, database layers, provider adapters, naming, and testability.
   - Verification: where applicable, unit tests, functional tests, browser inspection, screenshots, recordings, integration tests, static checks, or focused code review.
   - Acceptance: the same accepted outputs from layer 6 continue to work after refactor.

## 2. Accept Implementation Plan

When the user accepts the plan:

1. Update `.agents/specs/<spec-id>/status.md` implementation status to `accepted`.
2. Create `.agents/specs/<spec-id>/tasks/status.md`.
3. Add every accepted task to `tasks/status.md` with status `open`.
4. Create a task file for each accepted task, such as `.agents/specs/<spec-id>/tasks/00001-meta-title.md`.
5. Keep task numbers stable once the user has accepted the plan.

Each task file must include:

- task summary
- implementation steps
- verification process
- acceptance criteria
- implementation notes
- verification notes
- acceptance notes

Do not create empty placeholder task files for tasks that are not part of the accepted plan.

## 3. Implement Tasks

For each task:

1. Update `tasks/status.md` task status to `started`.
2. Follow the implementation steps in the task file.
3. Record implementation notes in the task file.
4. Run the task verification process.
5. If verification fails, fix the issue or ask the user when a decision is needed, then repeat verification.
6. When verification passes, update `tasks/status.md` task status to `verified`.
7. Report the acceptance criteria and verification result to the user.
8. When the user accepts the implementation, update `tasks/status.md` task status to `accepted`.

Keep the task at `started` until verification passes. Do not mark a task `accepted` without user acceptance.

## 4. Side Quests

A side quest is implementation work discovered while completing another task and needed to satisfy use cases, verification, integration, maintainability, or user rejection handling.

When a side quest appears:

1. Record it in a separate task file such as `.agents/specs/<spec-id>/tasks/00001A-quest-title.md`.
2. Add it to `tasks/status.md`.
3. Use status `proposed` when the agent is suggesting the side quest and user review is useful.
4. Move it to `open` when the user approves it.
5. If the side quest is plainly required and there is no meaningful alternative, record why it was added and proceed according to the task workflow.

Use the parent task number plus letters for side quests. Keep each side quest scoped to the discovered work and link it back to the parent task in its task file.

## 5. Complete Implementation

When every task and side quest is `accepted`:

1. Update `.agents/specs/<spec-id>/status.md` implementation status to `completed`.
2. Run a context promotion review for implementation-discovered facts that are accepted, reusable, and useful beyond this spec.
3. Update `.agents/context/index.md` if context promotion changes Context Files.
4. Run the Agent Workspace validator.

## Handoff

End each implementation pass by stating the spec ID, implementation status, current task statuses, files changed, verification performed, user acceptance still needed, context promotion performed or skipped, validation result, recommended next step, and any useful alternatives.
<!-- agent-workspace-rules:end -->
