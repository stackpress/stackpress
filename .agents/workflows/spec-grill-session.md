# Spec Grill Session Workflow

<!-- agent-workspace-rules:start -->
Use this optional workflow when a spec needs one-question-at-a-time clarification, pressure testing, contradiction checks, or a resumable record of exact user answers.

Do not use this workflow to replace the Spec Driven Development workflow. Use it as a companion loop for `.agents/specs/<spec-id>/` work.

`<spec-id>` follows the [Spec Folder Naming](spec-driven-development.md#spec-folder-naming) convention.

## Source Of Truth

`.agents/specs/<spec-id>/questions.md` is the lossless resumable question ledger. Preserve exact questions, exact user answers, partial answers, follow-up links, evidence-resolved answers, and status.

`.agents/specs/<spec-id>/decisions.md` remains the canonical Gap and decision ledger. Summarize accepted answers there only after preserving the exact record in `questions.md`.

Do not treat an agent recommendation as accepted unless the user explicitly accepts it or project evidence resolves the question.

## Read First

1. `.agents/AGENTS.md`
2. `.agents/TERMS.md`
3. `.agents/workflows/spec-driven-development.md`
4. `.agents/context/index.md`, when Context Files exist
5. `.agents/specs/manifest.md`, when it exists
6. `.agents/specs/<spec-id>/index.md`
7. `.agents/specs/<spec-id>/decisions.md`, `questions.md`, and `status.md` when they exist
8. relevant Spec Files, Context Files, Source Material, wireframes, creative designs, code, and user instructions

Do not load unrelated spec folders unless the current spec links to them or the user asks for cross-spec review.

## Prepare Or Resume

1. Select one `<spec-id>` before asking questions.
2. Create `.agents/specs/<spec-id>/questions.md` only when the first question record is needed. Link it from `.agents/specs/<spec-id>/index.md`.
3. Create or update `decisions.md` before queueing questions.
4. Scan all relevant Spec Files and Context Files. Add new Gaps to `decisions.md` when a material unknown is found.
5. Review existing `questions.md` and `decisions.md` before asking anything. Do not ask a question already answered, evidence-resolved, accepted, deferred, or superseded.
6. Build the open question queue from unresolved Gaps, partial answers, contradictions, fuzzy terms, code/spec mismatches, and scenario boundaries.
7. Try to resolve each queued question from Context Files, Spec Files, Source Material, existing wireframes, creative designs, and code before asking the user.
8. When evidence resolves a question, record it in `questions.md` as `evidence-resolved`, update `decisions.md`, and do not ask it unless the evidence conflicts or needs user approval.

## Question Ledger

Record each material question in `questions.md` with these fields or equivalent headings:

- `Status`: `queued`, `asked`, `answered-by-user`, `partial`, `evidence-resolved`, `accepted-decision`, `deferred`, `blocked`, or `superseded`.
- `Source`: `gap`, `context`, `spec`, `code`, `wireframe`, `creative`, `source-material`, `user`, or `agent`.
- `Question`: exact question text.
- `Agent default`: optional proposed default, marked `not accepted` until the user accepts it.
- `User answer`: exact user answer, preserved verbatim.
- `Evidence answer`: evidence-resolved answer with links or file paths.
- `Follow-up`: linked follow-up question when the answer is partial.
- `Decision update`: link or heading for the related `decisions.md` Gap or decision.

Do not paraphrase inside `User answer`. If interpretation is needed, add a separate normalized note and keep the verbatim answer intact.

## Ask Questions

Ask one question at a time. Wait for the user to answer before asking the next question.

Lead with the neutral question. If a recommendation is useful, label it as `Suggested default, not accepted unless you choose it` and explain the reason briefly. Do not phrase the question to steer the user toward the default.

For each answer:

1. Confirm whether the answer applies to the question.
2. Preserve the exact answer in `questions.md`.
3. If the answer is complete, update the related Gap or decision in `decisions.md`.
4. If the answer is partial, record the partial answer, create a sharper follow-up, link the follow-up in `questions.md`, and ask it next when appropriate.
5. If the answer does not apply, record no accepted decision, rephrase the same question in simpler concrete terms, and ask again.
6. If the answer reveals a new Gap, add it to `decisions.md` and add the follow-up question to the queue.

## Challenge And Reconcile

During every answer review:

- Challenge term conflicts against `.agents/TERMS.md`, Context Files, and local project language.
- Sharpen fuzzy or overloaded language by proposing a precise canonical term.
- Stress-test domain relationships with concrete edge-case scenarios.
- Cross-reference code when the user describes existing behavior. Surface contradictions immediately.
- Update stale or contradicted `questions.md`, `decisions.md`, and `status.md` records so interrupted sessions resume from the real current state.

## Freeze Grill Pass

Freeze the grill pass in `status.md` when all material queued questions are answered, evidence-resolved, deferred, blocked with owner, or superseded.

Freezing the grill pass does not freeze the whole spec unless the Spec Driven Development workflow Freeze criteria are also met.

## Validate And Handoff

Run the Agent Workspace validator after creating or updating Spec Files:

```bash
python .agents/scripts/validate-agent-workspace.py
```

Use `python3` instead of `python` on systems where that is the Python 3 executable.

End each grill pass by stating the spec ID, current question counts by status, decisions updated, new Gaps found, remaining next question if any, validation result, recommended next step, and any useful alternatives.
<!-- agent-workspace-rules:end -->
