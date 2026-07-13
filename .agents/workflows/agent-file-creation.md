# Agent File Creation Workflow

<!-- agent-workspace-rules:start -->
Use this workflow when creating, revising, splitting, or linking Agent Files.

If the file is being created from Source Material, first use the [Agent File Ingestion Workflow](agent-file-ingestion.md).

## Create Or Revise

1. Confirm the target Agent File path under `.agents/`.
2. Do not use this workflow for Raw Source under `.agents/resources/`.
3. Draft the Agent File in an unprocessed state first. Do not stop mid-draft only to satisfy the line cap.
4. Put only Accepted Reusable Truth in `.agents/context/`.
5. Create `.agents/context/index.md` if absent when the first Context File is created.
6. Keep `.agents/context/index.md` as the read-first map when Context Files exist.
7. Use Resource Links for Raw Source and other Resource Files.
8. After drafting, run the split workflow if the file is over 500 lines or would be clearer under 200 lines.

## Split Oversized Agent Files

1. Identify supporting detail that can move without weakening the original file.
2. Find the next available number under `.agents/references/`, starting at `00001`.
3. Create a `.agents/references/00001-meta-title.md` style file with the next five-digit number and a task-informative lowercase hyphenated meta title.
4. Move the supporting detail into the Reference File.
5. Add a Reference Link from the original Agent File using the correct relative path.
6. Write link text that tells a future agent when to load the Reference File.
7. Repeat until every Agent File is under 500 lines.

## Validate

Run the Agent Workspace validator after creation or split repair. Treat hard errors as required fixes and warnings as review prompts.

If validation reports a zombie Reference File, switch to the [Zombie Reference File Repair Workflow](repair-zombie-reference-files.md).

## Handoff

End each Agent File creation pass by stating the Agent Files created or revised, Reference Files created or updated, validation result, blocker or user decision still needed, recommended next step, and any useful alternatives.

## Reference

- [Detailed Agent Workspace folder, naming, and linking rules](../references/00001-agent-workspace-rules.md)
<!-- agent-workspace-rules:end -->
