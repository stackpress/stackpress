# Stackpress Skills

These skills are a portable Stackpress workflow for agent tools such as Codex,
Claude Code, Cursor, OpenCode, or similar environments that support
`SKILL.md`-style skill folders.

They are designed to help an agent turn a plain-English product request into a
working Stackpress app through discovery, scaffolding, schema authoring,
generation, plugin work, and verification.

## Included Skills

- `stackpress-router`
  - routes Stackpress tasks to the right specialist skill
- `stackpress-ai`
  - alias for `stackpress-router`
- `stackpress-app-discovery`
  - turns a vague app request into a buildable app brief
- `stackpress-app-coordinator`
  - manages the full Stackpress workflow and skill handoffs
- `stackpress-workflow-router`
  - coordinates concurrent multi-plugin Stackpress development workflows
- `stackpress-app-scaffold`
  - creates the baseline Stackpress app files from the embedded scaffold
- `stackpress-idea-authoring`
  - drafts and refines `schema.idea`
- `stackpress-plugin-router`
  - decides whether work belongs in schema, runtime, generation, or route/view
- `stackpress-plugin-scaffold`
  - scaffolds Stackpress plugin structure and wiring
- `stackpress-plugin-pages-events`
  - implements Stackpress plugin page and event handlers
- `stackpress-plugin-views`
  - implements handwritten Stackpress plugin pages and route/view pairing
- `stackpress-plugin-idea-generator`
  - implements generation plugins through `idea` and `transform/`
- `stackpress-app-verification`
  - verifies each workflow phase before advancing

## Recommended Workflow

For unclear Stackpress tasks, start with `stackpress-router` or its
`stackpress-ai` alias. It should choose the narrowest specialist skill instead
of replacing the specialist workflow.

For general app builds, the intended order is:

1. `stackpress-app-discovery`
2. `stackpress-app-coordinator`
3. `stackpress-app-scaffold`
4. `stackpress-idea-authoring`
5. run `stackpress generate`
6. `stackpress-plugin-router`
7. `stackpress-plugin-scaffold`, `stackpress-plugin-pages-events`,
   `stackpress-plugin-views`, and/or
   `stackpress-plugin-idea-generator`
8. `stackpress-app-verification`

Use `stackpress-workflow-router` before this sequence only when the task
explicitly involves developing, sequencing, or coordinating multiple local
plugins at the same time. The workflow router should inspect local contracts
first, then choose or present possible multi-plugin workflows.

## Folder Structure

Each skill follows the same basic pattern:

```text
skill-name/
  SKILL.md
  agents/openai.yaml            # optional OpenAI/Codex UI metadata
  references/                   # optional reference material
  assets/                       # optional templates or bundled files
```

Important:

- `SKILL.md` is the source of truth
- `agents/openai.yaml` is optional convenience metadata for OpenAI/Codex-style
  environments
- other tools may ignore `agents/openai.yaml`, so do not rely on it for core
  behavior

## Installation

These skills are portable because the workflow instructions live in each
`SKILL.md` file.

### Option 1: Copy Into Another Skill Directory

Copy one or more skill folders from this `skills/` directory into the target
tool's skill directory.

Examples:

- Claude Code: copy into the environment's configured skills directory
- Codex: copy into the environment's configured skills directory
- Cursor / OpenCode: copy into whatever folder your agent setup uses for local
  reusable skills or prompt modules

If your tool supports nested skill folders, copy the whole folder for each
skill, not just `SKILL.md`, so bundled `references/`, `assets/`, and metadata
come with it.

### Option 2: Symlink the Skill Folders

If your environment supports local symlinks, you can symlink these skill
folders into your agent's skill directory instead of copying them.

This is useful if you want changes in this repo to be reflected immediately in
the installed skill set.

## Usage

How you invoke a skill depends on the client, but the basic pattern is:

- ask the agent to use the skill by name
- or place the skill in the environment's skill directory so the agent can
  discover it automatically

Example requests:

- "Use `stackpress-router` to decide which Stackpress skill should handle this
  task."
- "Use `stackpress-ai` to route this Stackpress request."
- "Use `stackpress-app-discovery` to turn this product idea into a Stackpress
  app brief."
- "Use `stackpress-workflow-router` to coordinate developing multiple
  Stackpress plugins at the same time."
- "Use `stackpress-app-coordinator` to build this app in phases."
- "Use `stackpress-plugin-router` to decide whether this feature belongs in
  schema, runtime, or generation."
- "Use `stackpress-plugin-views` to implement this custom Stackpress page and
  its route/view pairing."

## Portability Notes

These skills are written to be agent-neutral:

- they do not require Codex-specific response channels
- they do not require Claude-specific syntax
- they avoid client-specific behavior in the main skill instructions

That said, your agent still needs:

- access to the repository or working project
- permission to read and write files
- access to shell commands if it will run generation, installs, or verification

## Scaffold Skill Note

`stackpress-app-scaffold` includes an embedded scaffold snapshot in its
`assets/template/` folder.

That snapshot is self-contained on purpose so the skill does not depend on
repo-specific folders like `templates/` existing in the target environment.

## Updating Skills

If you change a skill:

- update `SKILL.md` first
- update any related `references/` or `assets/`
- keep the folder self-contained
- treat `agents/openai.yaml` as secondary metadata, not the primary
  documentation

## Goal

These skills exist to support this high-level flow:

1. describe an app in plain English
2. clarify the requirements
3. scaffold the app
4. model the domain in `schema.idea`
5. generate Stackpress output
6. add runtime or generation plugins where needed
7. verify the app phase-by-phase

That is the intended system-level use of this skill set.
