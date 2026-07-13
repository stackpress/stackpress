# Agent Workspace Rules Reference

<!-- agent-workspace-rules:start -->
This Reference File expands the local `.agents/AGENTS.md` contract. Keep this file under the Agent File line cap and split it into additional Reference Files if it grows past 500 lines.

## Folder Contract

`.agents/context/` is the only source-of-truth folder for agents. Add only Accepted Reusable Truth there, and route discovery through `.agents/context/index.md` when Context Files exist.

Promote accepted reusable truth into `.agents/context/` when future agents should inherit it. Demote content out of `.agents/context/` when it is not Accepted Reusable Truth, is stale or contradicted, is too narrow for shared context, or belongs in a Spec File, Reference File, or Resource File instead.

Context Demotion is not deletion. Preserve useful material in the correct lower-authority location and keep or add links when future agents need provenance. If the correct destination is unclear, ask the user where to demote the content before editing.

`.agents/references/` stores supporting detail split from Agent Files. It must stay flat. Reference Files should be loaded only when their Reference Link description matches the current task.

Reference Files may link to Context Files, Resource Files, or other Reference Files.

`.agents/resources/` stores Raw Source and other Resource Files. Resource Files may be unlinked.

`.agents/workflows/` stores repeatable Agent Workspace maintenance workflows.

`.agents/scripts/` stores deterministic helper scripts for Agent Workspace checks.

## Draft Then Split

Create Agent Files in an unprocessed state first. Do not interrupt drafting solely to satisfy the line cap. When the draft is complete, split the file if it exceeds 500 lines, and consider splitting when it exceeds 200 lines.

Move long examples, evidence, Source Provenance, detailed variants, and extended rationale into Reference Files. Keep the original Agent File focused on routing, Accepted Reusable Truth, or the workflow the agent needs immediately.

Preserve Raw Source before rewriting Source Material into Agent Files. Do not summarize Source Material as a substitute for Raw Source preservation.

## Reference File Naming

Use `.agents/references/00001-meta-title.md`.

Start with `00001`, increment for each new Reference File, and replace `meta-title` with a lowercase hyphenated name that helps an agent infer the file contents.

## Link Quality

Use the correct relative path from the linking Agent File.

Examples in non-link notation:

- From `.agents/context/product-specs.md`: `Detailed checkout constraints -> ../references/00002-checkout-constraints.md`
- From `.agents/AGENTS.md`: `Agent workspace rules -> references/00001-agent-workspace-rules.md`

The link text should explain why the file matters, not merely repeat the filename.

## Zombie Reference Repair

Every Reference File needs an inbound link from another Agent File.

When a Reference File has no owner, scan Context Files and Reference Files for matching headings, terms, IDs, and topic overlap. Add a Reference Link from the most specific owner when the match is clear. If no owner is clear, notify the user and do not delete the file without explicit approval.

## Next-Step Router

Use this router after setup and after each workflow pass. Recommend one next step, and include up to two alternatives only when they are genuinely useful.

- If no Context Files exist and the project has accepted reusable truth to seed, use the Context Initialization Workflow.
- If the user has Source Material to preserve or convert, use the Agent File Ingestion Workflow.
- If an Agent File needs drafting, splitting, or better Reference Links, use the Agent File Creation Workflow.
- If validator output reports zombie Reference Files, use the Zombie Reference File Repair Workflow.
- If bounded planning, Gaps, research, Proofs, or Freeze are needed, use the Spec Driven Development Workflow.
- If a spec has unresolved questions, fuzzy terms, or interrupted Q/A, use the Spec Grill Session Workflow.
- If a spec has user-facing behavior, actors, permissions, lifecycle states, integrations, or step sequencing, use the Spec User Journeys Workflow.
- If a Frozen spec is ready for technical planning or implementation, use the Spec Task Implementation Workflow.
- If validation passes and there is no useful follow-up, say no next step is needed.
<!-- agent-workspace-rules:end -->
