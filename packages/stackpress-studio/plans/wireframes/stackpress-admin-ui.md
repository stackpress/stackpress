# Stackpress Admin UI

This document describes the Stackpress-specific admin UI and UX decisions for Stackpress Studio. It builds on the reusable right mobile panel pattern described in `plans/stackpress-studio/right-mobile-panel.md`.

Stackpress Studio is a GUI for `.idea` files. It should feel like a modern successor to the older Cradle schema admin while mapping to Stackpress idea semantics instead of copying Cradle literally.

## Source Of Truth

The UI should be driven by Stackpress idea and schema definitions:

- `specs/api/idea-reference.md` for idea file behavior and syntax
- `packages/stackpress-schema/src/config/attributes.ts` for model, type, and column attributes
- `packages/stackpress-schema/src/Model.ts` for model behavior
- `packages/stackpress-schema/src/Fieldset.ts` for type/fieldset behavior

Cradle is a UX reference, not a data model source of truth.

Local Cradle references:

- `packages/stackpress-studio/plans/cradle/admin.js` - legacy App Panel UI behavior
- `packages/stackpress-studio/plans/cradle/admin.css` - right sidebar and mobile view layout behavior
- `packages/stackpress-studio/plans/cradle/*.png` - historical schema admin screenshots

## Product Shape

Stackpress Studio is an SPA-style workbench.

The main page includes:

- topbar with Stackpress Studio identity, Reload, and Save Changes
- left sidebar with idea files and Studio sections
- main index scoped to the active idea file
- right mobile panel for create/update/nested editing tasks

The drawer must be closed on initial load. The user should start at an index screen, not inside an open editor.

## Active File Scope

Idea files can `use` other idea files. Studio must treat files as first-class workspace resources.

Clicking an idea file in the sidebar should:

- set it as the active file
- open the Models view for that file
- update the section counts for that file
- scope Models, Fieldsets, Enums, and Source to that file

Adding a file should:

- create a new `.idea` file
- automatically add a `use` statement to the main schema file
- make the new file visible in the sidebar

When the active file changes, table columns do not need a File column because the whole screen is already scoped to one file.

## Studio Sections

### Models

Models are the Studio equivalent of Cradle schemas.

The Models view should show:

- active file name as the eyebrow
- `+ Add Model`
- search input
- Active and Inactive filters
- model index table

The model table should show:

- Model
- Description
- Relations

It should not show File or Status columns when scoped to the active file.

Locked models should show a lock icon near the model name. A locked model can open for inspection, but mutating controls should be disabled, hidden, or clearly unavailable.

Clicking a model opens a right mobile panel.

Model editor tabs:

- Content
- Fields
- Relations

Content fields:

- Singular Name
- Plural Name
- Keyword
- Icon
- Description
- Display
- Query

The labels should be human-readable. Do not render `@display` or `@query` as form labels in the UI.

### Fields

Fields are idea columns. They map to Cradle fields conceptually, but use Stackpress idea attributes.

The Fields tab should show compact draggable field rows with:

- drag handle
- field name and keyword
- type
- validation summary
- format summary
- indexed/search/filter hints when applicable
- copy/remove controls

Clicking a field pushes an Update Field screen. Add Field pushes the same editor with empty defaults.

Field editor elements:

- Label
- Keyword
- Type
- Add Attribute key/value rows for component props
- Validation
- List Format
- Detail Format
- Default
- index/search/filter toggles when applicable

Type, Validation, List Format, and Detail Format should behave as option-driven controls. Selecting an option can reveal additional inputs required by that option.

Examples:

- `Characters Greater Than` reveals the value input required by that validator.
- `Image Carousel` reveals the fields required for that display component.

Rows should support reorder gestures. Save should update the parent UI and return to the Fields tab.

### Relations

Relations should follow idea relation semantics rather than Cradle cardinality literally.

Relation rows should use this one-line structure:

```text
Local Model . Local Column -> Foreign Model . Foreign Column : Relation Name
```

The relation name is optional.

Rows should stay on one line. If the drawer is too narrow, use horizontal scroll. Do not wrap relation rows into tall multi-line blocks.

### Fieldsets

Fieldsets map to idea `type` definitions.

Fieldsets are similar to models, but omit model-only database behavior.

The Fieldsets view should show:

- active file name as the eyebrow
- `+ Add Fieldset`
- search input
- Active and Inactive filters
- fieldset index table

The fieldset table should show:

- Fieldset
- Description
- Fields

It should not show File or Status columns when scoped to the active file.

Fieldset editor tabs:

- Content
- Fields

Fieldsets should not show:

- Relations
- searchable/sortable/filter database options
- relation-specific controls

### Enums

Enums are first-class option sets.

The Enums view should show:

- active file name as the eyebrow
- `+ Add Enum`
- search input
- enum index table

The enum table should show:

- Enum
- Values
- Used By

It should not show File or Status columns when scoped to the active file.

Enum editing should support:

- adding an enum
- updating an enum
- adding options
- updating options
- reordering options
- removing options
- seeing where an enum is used

### Source

Source explains the active idea file and import graph.

The Source view should show:

- active file name as the eyebrow
- search input
- import graph
- source snippets or definitions

It should not show a redundant active-file pill beside search.

The Import Graph should scroll horizontally like other table-like views when content is wide.

## Icon Picker

The Icon field should be a compact field until clicked. Do not show the icon list by default.

Clicking the Icon field should open a Select Icon picker screen using Font Awesome Free icons.

The picker should:

- stay grayscale in wireframes
- keep icons compact
- show the current icon value
- show the selected icon preview aligned to the right side of the input
- update the parent Icon field after Save

The picker should not explode the drawer width or create a visual gap between the parent panel and nested screen.

## Right Mobile Panel Behavior

Stackpress Studio uses the general right mobile panel pattern.

Important Studio rules:

- Initial load opens with the drawer closed.
- Clicking `+ Add Model` opens Add Model.
- Clicking model rows opens Update Model.
- Clicking tabs switches within the current resource screen.
- Clicking a field pushes a focused field editor.
- Clicking icon pushes a focused icon picker.
- Save in a nested screen returns to the parent screen.
- Back returns to the previous panel screen.
- Closing the top-level screen returns to the index.

Utility screens such as fields, enum options, relations, icon picker, copy/remove, and source-file screens should hide model tabs unless the nested item truly needs separate sections.

## Cradle Similarities

Studio should function similarly to Cradle in these ways:

- the index loads first
- clicking a resource opens a right-side panel
- the index remains visible while editing
- nested editors move through the panel instead of opening centered popups
- field creation and field update share the same editor structure
- validator and format selections reveal dependent inputs
- drag reorder gives visible feedback
- save updates the parent UI and returns to the previous panel screen

## Intentional Differences From Cradle

Studio should differ from Cradle where idea semantics require it:

- Models replace Cradle Schemas as the primary resource name.
- Fieldsets map to idea `type` definitions.
- Enums are first-class resources.
- Source and imported idea files are first-class resources.
- Relations follow idea local/foreign model-column semantics.
- The UI should not carry over Cradle's jQuery implementation.
- The wireframes should stay grayscale until creative design is approved.
- Stackpress idea attributes are the real source of possible fields and options.

## AI Guidance

When generating Stackpress Studio UI, preserve these rules:

- Do not call models "schemas" in the primary UI.
- Do not open the right drawer by default.
- Do not convert panel tasks into centered modals.
- Do not show picker option lists until the user clicks the field.
- Do not show File or Status columns on active-file-scoped tables.
- Do not show model-only database controls in Fieldsets.
- Do not wrap relation rows; use horizontal scroll.
- Do not use color-heavy creative styling in wireframes.
- Do not invent field/type/column attributes outside `attributes.ts`.
- Keep idea files and imports visible as first-class workspace concerns.

## Wireframe Reference

The current clickable wireframes are in:

- `plans/stackpress-studio/wireframes/v2/index.html`
- `plans/stackpress-studio/wireframes/v2/script.js`
- `plans/stackpress-studio/wireframes/v2/styles.css`

The v2 wireframes are the current review target. Earlier wireframe and creative folders are historical references unless explicitly revived.
