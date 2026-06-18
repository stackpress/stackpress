# Stackpress Studio

Proposal for adding a `stackpress-studio` package that provides a modern single-page GUI for authoring Stackpress idea files. Studio should make `schema.idea` and imported idea files easier to inspect, edit, validate, and organize while preserving the idea source file as the canonical artifact.

## 1. Summary

Stackpress Studio should be a first-party package named `stackpress-studio`.

The package should serve a browser-based single-page application that opens a configured idea file, resolves `use` imports, parses the resulting schema, and presents the schema as editable models, fieldsets, enums, and source files.

The design should borrow the productive parts of Cradle's historical schema builder:

 - a dense admin workbench rather than a marketing-style interface
 - schema/model lists with relation summaries
 - model metadata forms
 - field tables with inline actions
 - focused field editors for type, validation, formatting, defaults, and search/sort behavior
 - first-class fieldsets separate from database-backed models
 - enum option management for fields that reference enum types

Stackpress Studio should modernize that workflow as an SPA instead of page reloads and popup-heavy dialogs. Dialogs can still be used for destructive confirmations or focused create flows, but routine editing should happen in persistent panels and inspectors.

## 2. Goals

Studio should make it possible to:

 - Open the default `schema.idea` from a Stackpress project.
 - Configure a different default idea file.
 - Resolve and display idea files imported with `use`.
 - Create new importable idea files from Studio.
 - Add a `use` statement to the main idea file when the user explicitly links an imported file.
 - View and edit models defined in `model`.
 - View and edit fieldsets defined in `type`.
 - View and edit enums defined in `enum`.
 - Use shared field editing for both models and fieldsets.
 - Hide model-only database behavior when editing fieldsets.
 - Use enum definitions as selectable field types.
 - Validate idea syntax and Studio-level consistency before saving.
 - Preserve source text as the canonical representation.
 - Provide source editing as an escape hatch for unsupported syntax.
 - Keep changes inside the configured workspace.
 - Follow the current `specs/api/idea-reference.md` behavior.
 - Treat `packages/stackpress-schema/src/config/attributes.ts` as the source of truth for built-in resource, column, assertion, field component, and view component definitions.
 - Reuse existing Stackpress parser, transformer, server, and view conventions.

## 3. Non-Goals

The first version should not try to:

 - Replace the idea parser.
 - Replace `stackpress generate`.
 - Round-trip idea files through a lossy formatter.
 - Guarantee perfect preservation after arbitrary structured edits when the parser cannot preserve comments or unknown syntax.
 - Solve collaborative editing.
 - Add database migration execution.
 - Generate application pages directly from Studio.
 - Rebuild all Stackpress admin behavior inside Studio.
 - Support editing files outside the configured workspace.
 - Treat visual editing as the only way to author idea files.

## 4. Package Shape

Add a new workspace package:

```txt
packages/stackpress-studio/
  LICENSE
  README.md
  package.json
  bin.ts
  src/
    index.ts
    plugin.ts
    config.ts
    types.ts
    events/
      index.ts
      serve.ts
    scripts/
      index.ts
      studio.ts
    studio/
      idea-files.ts
      idea-imports.ts
      idea-parse.ts
      idea-reference.ts
      idea-write.ts
      studio-schema.ts
      studio-models.ts
      studio-fieldsets.ts
      studio-enums.ts
      studio-fields.ts
      studio-presets.ts
      workspace-paths.ts
    pages/
      app.ts
      api/
        files.ts
        schema.ts
        models.ts
        fieldsets.ts
        enums.ts
        parse.ts
        save.ts
        presets.ts
    views/
      app.tsx
      components/
        StudioApp.tsx
        StudioShell.tsx
        WorkspaceExplorer.tsx
        SchemaNavigator.tsx
        ModelIndex.tsx
        ModelEditor.tsx
        FieldsetIndex.tsx
        FieldsetEditor.tsx
        EnumIndex.tsx
        EnumEditor.tsx
        FieldTable.tsx
        FieldInspector.tsx
        RelationPanel.tsx
        SourceEditor.tsx
        DiagnosticsPanel.tsx
  public/
    styles/
      studio.css
```

The package should follow existing Stackpress package conventions:

 - build to `cjs` and `esm`
 - expose `./plugin`, `./events`, `./scripts`, `./types`, and `.`
 - register routes during the `route` lifecycle
 - serve the SPA through Stackpress view routing
 - keep filesystem and parser logic out of React components
 - keep public config and API response types in `src/types.ts`

Suggested root script:

```json
{
  "scripts": {
    "studio": "yarn --cwd packages/stackpress-studio"
  }
}
```

## 5. CLI Surface

Studio should provide a command that starts a Stackpress server and opens the SPA.

Suggested commands:

```bash
stackpress-studio --idea schema.idea --host 127.0.0.1 --port 3001
stackpress-studio --b config/studio -v
```

If Studio is later aggregated into `stackpress`, the command can become:

```bash
stackpress studio --idea schema.idea --host 127.0.0.1 --port 3001
```

The separate package and binary should come first so the package can be proven without changing the main Stackpress CLI surface.

## 6. Config Shape

Add a `studio` config namespace.

Example:

```ts
studio: {
  idea: 'schema.idea',
  workspace: process.cwd(),
  host: '127.0.0.1',
  port: 3001,
  open: true,
  imports: {
    allowCreate: true,
    defaultDirectory: 'ideas'
  },
  source: {
    autosave: false,
    preserveUnknownSyntax: true
  }
}
```

The default idea path should resolve in this order:

 1. CLI `--idea`
 2. `studio.idea`
 3. `cli.idea`
 4. `<cwd>/schema.idea`

The default workspace should resolve in this order:

 1. `studio.workspace`
 2. `server.cwd`
 3. current working directory

All reads and writes must stay inside the resolved workspace.

## 7. Runtime Model

Studio should use the normal Stackpress server runtime.

Startup flow:

 1. The CLI loads Studio config.
 2. Studio bootstraps a Stackpress HTTP server.
 3. Studio registers one SPA page route and JSON API routes.
 4. Studio resolves the configured idea file path.
 5. Studio starts the server on the configured host and port.
 6. If `studio.open` is true, Studio opens the browser to `/studio`.
 7. The browser SPA loads schema state from the JSON API.

The server owns:

 - filesystem access
 - workspace boundary checks
 - idea file reads and writes
 - import graph resolution
 - parser integration
 - diagnostics
 - schema reference data

The SPA owns:

 - selected section
 - selected file
 - selected model
 - selected fieldset
 - selected enum
 - source or visual mode
 - dirty state
 - draft edit state
 - inline validation display
 - panel layout

## 8. SPA Information Architecture

Studio should render one server route:

```txt
/studio
```

The SPA should own internal navigation states:

```txt
files
models
models/:name
fieldsets
fieldsets/:name
enums
enums/:name
source
diagnostics
```

The app should not depend on real server routes for each internal section. This keeps navigation fast and avoids reproducing Cradle's page-per-operation workflow.

### 8.1. Primary Layout

Use a workbench layout:

 - top bar for current idea file, save/reload actions, parse status, and server state
 - left rail for primary sections
 - secondary explorer for files, models, fieldsets, and enums
 - main editor area for selected resource
 - right task drawer for selected model, fieldset, enum, field, enum option, relation, diagnostics, or reference help

The interface should be dense, quiet, and optimized for repeated schema editing.

Cradle's editable schema flow should inform the interaction pattern more than the visual style:

 - selecting a model opens a right-side task drawer over the model index
 - locked resources show the same information but disable direct mutation and only allow safe copy-style actions
 - editable resources expose a sticky footer with publish/save, copy, and remove actions
 - the model drawer uses tabs for Content, Fields, and Relations
 - the Content tab edits resource metadata such as singular label, plural label, keyword, group, icon, description, and display suggestion
 - the Fields tab contains a dense draggable field table with row copy/remove actions
 - clicking a field opens a nested field editor state with a back affordance and sticky Save action
 - adding a field can use the same field editor as an inline or nested drawer state, but it must not be a disconnected page
 - the Relations tab contains repeatable relation rows, but Studio must follow Stackpress idea relation semantics rather than copying Cradle's legacy cardinality model literally

The Studio SPA should still avoid Cradle's page-per-operation and popup-heavy feel. Drawers, stacked panes, and inline editors should provide the same fast editing rhythm while keeping the current resource context visible.

### 8.2. Primary Sections

The left rail should include:

```txt
Files
Models
Fieldsets
Enums
Source
Diagnostics
```

Later sections can include:

```txt
Props
Plugins
Reference
```

Models, fieldsets, and enums should be available in the first complete version.

## 9. Idea Files And Imports

Idea files can import other idea files with `use`.

Studio should treat the configured idea file as the main file and imported files as part of the editable workspace graph.

For each file, Studio should track:

 - absolute path
 - workspace-relative path
 - whether it is the main file
 - whether it is imported by another file
 - import parent paths
 - missing or readable state
 - dirty state
 - parse state
 - models declared in the file
 - fieldsets declared in the file
 - enums declared in the file

Creating a new idea file should be explicit:

 1. User chooses "New idea file".
 2. Studio creates it under `studio.imports.defaultDirectory`.
 3. Studio opens it as an unlinked file.
 4. User can choose "Import into main idea".
 5. Studio adds a `use "..."` statement to the main file.

Studio should not silently edit the main idea file just because a new file was created.

## 10. Source Canonical Model

The idea file source must remain canonical.

Structured editing should produce source patches, not a separate schema database. This matters because idea files can contain comments, ordering, imports, plugin-specific syntax, and future syntax that Studio may not fully understand.

Studio should support two modes:

 - **Visual mode:** edits known models, fieldsets, enums, and fields through forms and tables.
 - **Source mode:** edits the raw idea file.

When a file contains syntax Studio cannot safely transform visually, Studio should still allow source editing and show a diagnostic explaining which visual actions are unavailable.

## 11. Schema Resource Model

The parser exposes schema resources under the current `SchemaConfig` shape:

 - `model`
 - `type`
 - `enum`
 - `prop`
 - `plugin`

Studio should prioritize:

 1. models
 2. fieldsets
 3. enums
 4. source files
 5. diagnostics

Props and plugins can be visible in source/reference views before full visual editing is added.

## 12. Attribute Definitions Source Of Truth

Studio should not hard-code possible model, fieldset, and column attributes from prose docs alone.

The source of truth for built-in attribute definitions is:

```txt
packages/stackpress-schema/src/config/attributes.ts
```

That file exports:

 - `schema` for resource-level attributes used by models and schema-like resources
 - `column` for column/field attributes
 - `assert` for validation/assertion attributes
 - `field` for field component attributes
 - `view` for view component attributes
 - `list` derived from `view` with `view.` names rewritten to `list.`
 - `filter` derived from `field` with `field.` names rewritten to `filter.`
 - `span` derived from `field` with `field.` names rewritten to `span.`

Studio's reference service should load these dictionaries directly when possible. If browser payload size or package-boundary constraints require a copied reference map, the copied map must be generated or checked against `attributes.ts`.

The current `specs/api/idea-reference.md` should remain useful for human explanation, but `attributes.ts` should decide which controls Studio shows, what arguments each control accepts, and which attributes are flags, methods, assertions, or components.

### 12.1. Resource-Level Attribute Definitions

These definitions come from the exported `schema` dictionary in `attributes.ts`.

| Attribute | Kind | Arguments | Description |
| --- | --- | --- | --- |
| `@display(...)` | method | `template: string` | String representation of each row in a model using row variables. |
| `@icon(...)` | method | `icon: string` | Icon representation of a model. Uses Font Awesome-style names. |
| `@labels(...)` | method | `singular: string`, `plural: string` | Display labels for a model field/resource. |
| `@query(...)` | method | `...selectors: string[]` | Default query columns to return when fetching rows from the model. |

Studio controls derived from this dictionary:

 - model metadata form
 - fieldset metadata form when the parser accepts resource attributes on `type`
 - reference panel descriptions
 - argument editors
 - validation for required arguments

### 12.2. Column Attribute Definitions

These definitions come from the exported `column` dictionary in `attributes.ts`.

| Attribute | Kind | Arguments | Studio Scope | Description |
| --- | --- | --- | --- | --- |
| `@active` | flag | none | model-only | Active field used for delete/restore behavior instead of physical deletion. |
| `@default(...)` | method | `value: string | number | boolean` | model and fieldset | Default value applied when creating a row if no value is provided. |
| `@description(...)` | method | `description: string` | model and fieldset | Internal column documentation. |
| `@examples(...)` | method | `...examples: string | number | boolean | array | object` | model and fieldset | Example values for docs or metadata-aware tooling. |
| `@encrypted` | flag | none | model and fieldset | Reversibly encrypts the column value. |
| `@generated` | flag | none | model and fieldset | Marks the value as generated and bypasses user-input validation. |
| `@hashed` | flag | none | model and fieldset | One-way hashes the column value. |
| `@id` | flag | none | model-only | Marks a model identifier. Multiple IDs form a composite identifier. |
| `@searchable` | flag | none | model-only | Marks a column as participating in search behavior and database optimization. |
| `@sortable` | flag | none | model-only | Marks a column as participating in sort behavior and database optimization. |
| `@label(...)` | method | `label: string` | model and fieldset | Display label for the column. |
| `@min(...)` | method | `value: number` | model and fieldset | Minimum numeric value. Also influences database type decisions. |
| `@max(...)` | method | `value: number` | model and fieldset | Maximum numeric value. Also influences database type decisions. |
| `@step(...)` | method | `value: number` | model and fieldset | Incremental numeric step. Also influences database type decisions. |
| `@relation(...)` | method | `{ local: string, foreign: string, name?: string }` | model-only | Relation mapping between local and foreign model columns. |
| `@timestamp` | flag | none | model-only | Automatically updates a timestamp when a row changes. |
| `@unique` | flag | none | model-only | Ensures no duplicate value can be added for this model column. |

Studio should derive the default column attribute picker from this table and the actual exported dictionary.

Model-only scope is a Studio authoring rule based on current model/store behavior and the user's fieldset requirement. If the parser accepts one of these attributes syntactically on a fieldset column, Studio should still avoid presenting it as a normal fieldset control unless Stackpress later gives it fieldset semantics.

### 12.3. Assertion Attribute Definitions

These definitions come from the exported `assert` dictionary in `attributes.ts`.

Assertions available to Studio:

```txt
required
ne
notempty
unique
eq
neq
option
regex
pattern
date
future
past
present
gt
ge
gte
lt
le
lte
ceq
cgt
cge
cgte
clt
cle
clte
weq
wgt
wge
wgte
wlt
wle
wlte
lowercase
uppercase
slug
cc
color
email
hex
price
url
string
boolean
number
float
integer
object
```

Studio should show assertion controls from the dictionary metadata:

 - `type` decides whether an assertion can be a flag, method, or both
 - `args` drives the argument editor
 - `data.name` drives the generated assertion name
 - `data.message` drives the default diagnostic/help text

The alias definitions in `attributes.ts` must also be available:

| Alias | Canonical Definition |
| --- | --- |
| `notempty` | `ne` |
| `pattern` | `regex` |
| `gte` | `ge` |
| `lte` | `le` |
| `cgte` | `cge` |
| `clte` | `cle` |
| `wgte` | `wge` |
| `wlte` | `wle` |

### 12.4. Field Component Definitions

These definitions come from the exported `field` dictionary in `attributes.ts`.

Field components available to Studio:

```txt
checkbox
code
color
country
currency
date
datelist
datetime
datetimelist
email
file
filelist
image
imagelist
input
integer
json
markdown
mask
metadata
number
numberlist
password
phone
price
radio
rating
select
slider
slug
small
stringlist
suggest
switch
tags
textarea
editor
textlist
time
timelist
url
```

Studio should use each field component definition for:

 - field component picker
 - component prop editor
 - import/component help text
 - type-specific presets

### 12.5. View, List, Filter, And Span Definitions

These definitions come from the exported `view`, `list`, `filter`, and `span` dictionaries in `attributes.ts`.

View components available to Studio:

```txt
capitalize
carousel
chars
code
color
comma
country
currency
date
email
formula
html
image
json
film
line
link
list
lowercase
markdown
metadata
number
ol
phone
price
rating
rel
relative
spread
tabular
tags
time
overflow
text
transform
ul
uppercase
words
yesno
```

Derived dictionaries:

 - `list` uses the same definitions as `view`, with names rewritten from `view.*` to `list.*`.
 - `filter` uses the same definitions as `field`, with names rewritten from `field.*` to `filter.*`.
 - `span` uses the same definitions as `field`, with names rewritten from `field.*` to `span.*`.

Studio should not maintain separate hand-authored catalogs for these derived families. It should reproduce the same mapping rule as `attributes.ts` or import the derived exports directly.

## 13. Models

Models correspond to `model` in idea files.

`Model` extends `Fieldset` in the current schema package and adds store behavior. Studio should reflect that relationship by reusing most field editing controls while exposing model-only database and admin concepts.

Model editor sections:

 - identity
 - display metadata
 - fields
 - relations and model references
 - query/search/sort behavior
 - source preview

Identity controls:

 - model name
 - singular label through `@labels(...)`
 - plural label through `@labels(...)`
 - icon through `@icon(...)`
 - display template through `@display(...)`
 - default query columns through `@query(...)`

Field table columns:

 - action
 - field name
 - label
 - type
 - required
 - multiple
 - default
 - id
 - active
 - searchable
 - sortable
 - generated
 - encrypted
 - hashed
 - assertion count
 - source file

Model-only behavior:

 - `@id`
 - `@active`
 - `@searchable`
 - `@sortable`
 - relation and model-reference summaries
 - store-oriented diagnostics

Models should use Cradle's table-first editing pattern, but the modern UI should avoid popup-heavy routine edits. Selecting a field should open a persistent inspector.

## 14. Fieldsets

Fieldsets correspond to `type` in idea files.

Fieldsets are reusable structured types. They should be edited separately from models because they do not represent database-backed resources.

Fieldset editor sections:

 - identity
 - fields
 - assertions
 - components
 - document/value behavior where supported
 - source preview

Fieldset controls:

 - fieldset name
 - columns
 - type references
 - fieldset-level attributes that are supported by the current idea reference

Fieldsets should not expose:

 - relations
 - searchable controls
 - sortable controls
 - filterable-style database controls
 - active/delete semantics
 - store/admin/database-only summaries

The shared field editor should still allow column behavior that applies to both models and fieldsets, such as:

 - name
 - type
 - required
 - multiple
 - label
 - description
 - examples
 - default when valid
 - assertions
 - components
 - nested fieldset references
 - enum-backed types

## 15. Enums

Enums correspond to `enum` in idea files.

Enums should be first-class resources in Studio because the schema package stores them separately on `Schema.enums`, and column types can reference them.

Enum editor sections:

 - enum name
 - options table
 - usage summary
 - source preview

Option table columns:

 - action
 - key
 - value
 - usage count

Expected behavior:

 - Create a new enum.
 - Rename an enum when it is safe to update references.
 - Add, edit, reorder, and remove enum options.
 - Show fields that currently use the enum.
 - Warn before removing an option used as a default value.
 - Warn before deleting an enum referenced by a model or fieldset field.
 - Offer enum types in the field type picker.

Enum-backed field behavior:

 - The field type picker should show built-in types, fieldsets, models where applicable, and enums.
 - When a field uses an enum type, the inspector should show the enum's options.
 - Default value controls should offer enum options.
 - Assertions should reflect that enum types already constrain values.

## 16. Shared Field Editing

Models and fieldsets should share a `FieldTable` and `FieldInspector`.

The shared field inspector should include:

 - identity section
 - type section
 - attributes section
 - assertions section
 - components section
 - source preview section

Identity:

 - field name
 - display label through `@label(...)`

Type:

 - built-in type
 - enum type
 - fieldset type
 - model type where current idea semantics permit it
 - required
 - multiple

Attributes:

 - `@default(...)`
 - `@description(...)`
 - `@examples(...)`
 - `@generated`
 - `@encrypted`
 - `@hashed`

Model-only attributes:

 - `@id`
 - `@active`
 - `@searchable`
 - `@sortable`

Assertions:

 - built-in type assertion summary
 - explicit assertions from `idea-reference.md`
 - assertion arguments
 - assertion message when supported

Components:

 - field component family
 - view component family
 - component props where supported by the reference metadata

The inspector should use persistent panels and inline repeatable rows instead of Cradle-style modal stacks.

## 17. Presets

Studio should provide presets for common patterns.

Fieldset-safe presets:

 - text field
 - long text/detail field
 - number field
 - integer field
 - float field
 - boolean field
 - date field
 - datetime field
 - time field
 - object/hash/json field
 - enum-backed field
 - nested fieldset field

Model presets:

 - id field
 - title/name field
 - slug field
 - active field
 - created timestamp
 - updated timestamp
 - searchable text field
 - sortable date field
 - enum status field
 - model reference field where current idea semantics support it

Preset output should be source snippets that are easy to inspect before saving.

## 18. Diagnostics

Studio diagnostics should combine parser errors with Studio-level checks.

Parser diagnostics:

 - syntax errors
 - invalid idea structure
 - parser exceptions

File diagnostics:

 - missing imported file
 - unreadable imported file
 - duplicate imports
 - import outside workspace
 - write outside workspace

Schema diagnostics:

 - duplicate model names
 - duplicate fieldset names
 - duplicate enum names
 - unknown field type
 - enum reference missing
 - fieldset reference missing
 - invalid attribute scope
 - invalid model-only attribute on a fieldset field
 - default value not present in enum options
 - model deletion would leave references
 - fieldset deletion would leave references
 - enum deletion would leave references

Diagnostics should include:

 - severity
 - message
 - file path
 - resource type
 - resource name
 - line and column when available
 - suggested action when available

## 19. API Routes

Studio should expose JSON APIs under `/studio/api`.

Suggested routes:

```txt
GET  /studio/api/schema
GET  /studio/api/files
GET  /studio/api/models
GET  /studio/api/fieldsets
GET  /studio/api/enums
GET  /studio/api/presets
POST /studio/api/parse
POST /studio/api/save
POST /studio/api/files
```

`GET /studio/api/schema` should return the parsed workspace state:

```ts
type StudioSchemaResponse = {
  mainFile: string,
  files: StudioIdeaFile[],
  models: StudioModel[],
  fieldsets: StudioFieldset[],
  enums: StudioEnum[],
  diagnostics: StudioDiagnostic[]
};
```

`POST /studio/api/save` should accept source changes and structured patches only when they can be applied safely:

```ts
type StudioSaveRequest = {
  file: string,
  source?: string,
  patch?: StudioPatch
};
```

The first implementation can support source saves first, then structured patches for known operations.

## 20. Source Patching Strategy

Structured editing should start with conservative source operations.

Safe V1 operations:

 - append a new enum
 - append a new fieldset
 - append a new model
 - append a new field to a model or fieldset
 - append a new enum option
 - add a `use` statement
 - replace the full source of a file from Source mode

Higher-risk operations should require stronger parser location support:

 - rename model
 - rename fieldset
 - rename enum
 - reorder fields
 - remove fields
 - remove enum options
 - move resources between files
 - update attributes in-place

If the parser does not expose enough location data, Studio can still support these operations by switching the user to Source mode with a generated snippet.

## 21. Visual Design Direction

Studio should feel like a modern schema workbench.

Design principles:

 - dense but readable
 - table-first for lists
 - persistent inspectors for focused editing
 - minimal page reloads
 - no decorative hero sections
 - no oversized cards
 - icon buttons for common actions
 - restrained color palette
 - clear dirty and diagnostic states
 - responsive enough for laptop and desktop use

The Cradle screenshots provide useful structural patterns, but Studio should avoid copying the old visual style directly.

## 22. Milestones

### Milestone 1: Read-Only Studio

Deliver:

 - package scaffold
 - CLI server command
 - SPA route
 - configured idea file loading
 - import graph loading
 - model list
 - fieldset list
 - enum list
 - source viewer
 - diagnostics panel

Verification:

```bash
yarn studio build
yarn studio dev --idea templates/blog/schema.idea
```

### Milestone 2: Source Editing

Deliver:

 - source editor
 - parse-on-change
 - safe save
 - reload from disk
 - dirty state
 - file diagnostics

Verification:

 - edit `schema.idea`
 - save
 - reload
 - run existing generation command against the edited file

### Milestone 3: Visual Create Flows

Deliver:

 - create model
 - create fieldset
 - create enum
 - create importable idea file
 - import created idea file into main file
 - append field to model
 - append field to fieldset
 - append enum option

Verification:

 - created resources appear in source
 - parser accepts saved output
 - models, fieldsets, and enums refresh after save

### Milestone 4: Field Inspector

Deliver:

 - shared field inspector
 - built-in type picker
 - enum type picker
 - fieldset type picker
 - required/multiple controls
 - label/default/description/examples controls
 - model-only attributes
 - fieldset-safe attribute filtering

Verification:

 - model fields expose database controls
 - fieldset fields hide database controls
 - enum fields expose enum defaults
 - invalid combinations produce diagnostics

### Milestone 5: Structured Updates

Deliver:

 - edit existing model metadata
 - edit existing fieldset metadata
 - edit existing enum options
 - edit existing field attributes
 - remove resources with reference warnings
 - rename resources with reference updates where safe

Verification:

 - source remains parseable
 - references update correctly
 - unsafe operations are blocked with clear diagnostics

## 23. Testing Strategy

Add focused tests for the service layer before broad browser tests.

Test areas:

 - default idea path resolution
 - workspace boundary checks
 - import graph resolution
 - missing import diagnostics
 - model extraction
 - fieldset extraction
 - enum extraction
 - enum usage detection
 - field type classification
 - model-only attribute filtering
 - fieldset-safe attribute filtering
 - source save behavior
 - create imported idea file behavior

Browser tests can come after Milestone 1 or 2 and should verify:

 - Studio loads
 - left navigation works
 - models render
 - fieldsets render
 - enums render
 - source editor renders
 - diagnostics render
 - save button reflects dirty state

## 24. Open Questions

The following should be settled during implementation:

 - Whether the first source editor uses Monaco or a lightweight textarea.
 - Whether Studio should open the system browser automatically by default.
 - Whether the first structured patcher should depend on parser source locations or conservative append-only transforms.
 - How much of `prop` and `plugin` should be visually editable in the first release.
 - Whether Studio should be aggregated into the main `stackpress` package after the standalone package is proven.

## 25. Recommended First Version

The recommended first useful version is:

 - standalone `stackpress-studio` package
 - SPA at `/studio`
 - configurable default idea file
 - import graph viewer
 - read-only model, fieldset, and enum workbench
 - source editor with safe save
 - create flows for model, fieldset, enum, and imported idea file
 - shared field inspector for new fields
 - diagnostics panel

This version would already be useful for understanding and editing idea files while keeping risk low. Richer in-place structured editing can be added once source patching is reliable.
