---
name: stackpress-app-scaffold
description: Use when an agent needs to create a new Stackpress app in an empty folder from a fixed baseline scaffold, especially before idea authoring, generation, or plugin work.
---

# Stackpress App Scaffold

Create a new Stackpress app from this skill's embedded scaffold snapshot.

This skill is app-level bootstrap only. It does not install dependencies, run
generation, verify builds, or author project-specific business logic.

## Use This Skill For

- starting a new Stackpress app from an empty folder
- creating the baseline project files before `stackpress-idea-authoring`
- reproducing the fixed baseline app shape bundled with this skill

## Do Not Use This Skill For

- creating or extending individual plugins in an existing app
- writing or revising `schema.idea` for the user's domain
- running `install`, `generate`, `build`, or runtime verification commands
- inventing app-specific logic beyond the baseline scaffold

Use `stackpress-plugin-scaffold` for plugin work after the app exists.

## Core Workflow

1. Confirm the target directory is empty or effectively empty.
2. Copy every file from `assets/template/` into the target directory.
3. Apply only the supported placeholder replacements.
4. Preserve the scaffold structure as-is unless the user explicitly asks for a
   baseline change.
5. Stop after writing files.

## Bundled Scaffold

The scaffold lives entirely inside this skill:

- `assets/template/.env.sample`
- `assets/template/.gitignore`
- `assets/template/package.json`
- `assets/template/schema.idea`
- `assets/template/tsconfig.json`
- `assets/template/uno.config.ts`
- `assets/template/config/*`
- `assets/template/plugins/*`

Do not rely on sibling repository folders such as `templates/`, `packages/`, or
`specs/`. This skill must remain portable.

## Supported Customization

Only replace these values during scaffold:

- `__STACKPRESS_APP_NAME__`
- `__STACKPRESS_PACKAGE_NAME__`
- `__STACKPRESS_BRAND_NAME__`
- `__STACKPRESS_PORT__`

If the user does not give all four values:

- derive `package name` from the app name in lowercase kebab-case
- default `brand name` to the app name
- default `port` to `3000`

Do not introduce extra configuration knobs in v1.

## Placeholder Locations

The baseline scaffold uses placeholders in a few known places:

- `package.json` for package name
- `config/common.ts` for brand name, generated client package/module, and port
- `plugins/store/populate.ts` for the example application name

Keep replacements narrow and mechanical. Do not rewrite unrelated content.

## Empty Folder Rule

This skill assumes a new project directory.

If the folder already contains project files:

- stop and ask before mixing scaffold files into the existing contents
- do not overwrite user files silently

## Output Contract

After this skill finishes, the target directory should contain a Stackpress app
baseline with the same structure as the embedded scaffold snapshot and only the
four supported substitutions applied.

The next steps belong to a coordinator or router skill, typically:

1. dependency install
2. `stackpress-idea-authoring`
3. `stackpress generate`
4. plugin and runtime work
5. verification

## Common Mistakes

- referencing repository paths outside the skill folder
- installing dependencies inside this skill
- editing the scaffold into a domain-specific app too early
- adding unsupported customization fields
- overwriting non-empty target directories without asking
