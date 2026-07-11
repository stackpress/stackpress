# Agent File Ingestion Workflow

<!-- agent-workspace-rules:start -->
Use this workflow when importing Source Material into an Agent File.

## Destination

1. If the user does not specify a destination, use `.agents/context/` as the proposed destination.
2. Before writing to `.agents/context/`, confirm the import is Accepted Reusable Truth through explicit user direction, the source request, or the Intersection Scan.
3. Do not treat an unspecified destination by itself as permission to promote arbitrary, transient, speculative, or purely raw material into `.agents/context/`.
4. If the Intersection Scan strongly suggests the import is not Accepted Reusable Truth, explain why and ask before demoting or rerouting it.
5. Confirm the target Agent File path before writing when the destination is ambiguous.

## Preserve Source

1. Store Raw Source in `.agents/resources/` before rewriting it.
2. Create `.agents/resources/` if absent when preserving the first Raw Source.
3. Preserve all available Raw Source. Do not summarize Source Material as a substitute for retaining Raw Source.
4. Markdown Raw Source remains a Resource File, not an Agent File.
5. Record Source Provenance in the resulting Agent File or a linked Reference File.
6. If text extraction is partial or uncertain, state the limitation and link the preserved Resource File.

## Draft Agent File

1. Convert Source Material into clear markdown for future agents.
2. Keep the import detailed enough to preserve meaning, requirements, decisions, constraints, examples, and edge cases. Do not reduce it to a summary-only record.
3. Reword, label, group, and add short connective context when needed so future agents can understand how the import fits the project.
4. Separate imported claims from agent-added clarification when that distinction matters.

## Scan Intersections

Run an Intersection Scan across all Agent Files under `.agents/**/*.md`, excluding Resource Files under `.agents/resources/`. Classify matches before deciding whether to update anything.

Load [Intersection Points](../references/00002-intersection-points.md) for the starting scan list. For each relevant intersection, identify matching headings, IDs, names, links, repeated concepts, answered gaps, new gaps, open questions, duplicate facts, and conflicting claims.

## Resolve Updates

1. If the import closes previous gaps or answers open questions, update the intersecting Agent Files after confirming the affected files are in scope.
2. If the import introduces new gaps or open questions, add explicit sections for them in the new or updated Agent File.
3. If the import contradicts existing Agent Files, stop before editing those existing files. Tell the user which files intersect, what conflicts, and what updates the import would drive. Ask for confirmation before applying those updates.
4. If the import shows content in `.agents/context/` should be demoted, preserve useful material in the right Spec File, Reference File, or Resource File. If the correct destination is unclear, ask the user where to demote it before editing.
5. Do not require unrelated unresolved questions to be answered before accepting an import.
6. Create `.agents/context/index.md` if absent when the first Context File is created.
7. Update `.agents/context/index.md` when a Context File is added, renamed, split, or materially rerouted.

## Split And Validate

1. Follow the [Agent File Creation Workflow](agent-file-creation.md) after drafting.
2. Split oversized Agent Files into Reference Files when required.
3. Use Resource Links for Raw Source.
4. Use Reference Links for split supporting markdown under `.agents/references/`.
5. Run the Agent Workspace validator after ingestion and repair required issues.

## Handoff

End each ingestion pass by stating sources processed, Raw Source preserved, Agent Files created or updated, intersections or conflicts found, validation result, blocker or user decision still needed, recommended next step, and any useful alternatives.

## Reference

- [Detailed Agent Workspace folder, naming, and linking rules](../references/00001-agent-workspace-rules.md)
- [Intersection Points](../references/00002-intersection-points.md)
<!-- agent-workspace-rules:end -->
