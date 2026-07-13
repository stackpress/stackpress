# Zombie Reference File Repair Workflow

<!-- agent-workspace-rules:start -->
Use this workflow when a Reference File under `.agents/references/` has no inbound link from another Agent File.

## Repair Steps

1. List Reference Files with no inbound link from another Agent File.
2. For each zombie, scan Context Files and Reference Files for matching headings, terms, IDs, and topic overlap.
3. If a clear owner exists, add a descriptive Reference Link from that owner to the zombie Reference File.
4. If multiple owners are plausible, load [Reference Recovery Points](../references/00003-reference-recovery-points.md) and prefer the most specific Context File or Reference File.
5. If no owner can be found, notify the user and ask whether to link, rewrite, move, or remove the file.
6. Do not delete zombie Reference Files without explicit user approval.

## Reference Recovery Points

Load [Reference Recovery Points](../references/00003-reference-recovery-points.md) when choosing the inbound owner for a zombie Reference File.

## Validate

Run the Agent Workspace validator after repair. Continue until no zombie Reference File errors remain or until user input is required.

## Handoff

End each zombie Reference File repair pass by stating zombie Reference Files repaired, unresolved owner decisions, validation result, blocker or user decision still needed, recommended next step, and any useful alternatives.

## Reference

- [Detailed zombie Reference File and link ownership rules](../references/00001-agent-workspace-rules.md)
- [Reference Recovery Points](../references/00003-reference-recovery-points.md)
<!-- agent-workspace-rules:end -->
