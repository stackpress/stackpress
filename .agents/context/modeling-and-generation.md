# Stackpress Modeling And Generation

## Idea's Role

Idea owns a composable declaration language:

- types, models, enums, props, attributes, plugins, and `use` imports;
- parsing, AST construction, compilation, and transform sequencing;
- open metadata that other packages may interpret.

Idea does not own the Stackpress meaning of every attribute. Stackpress-schema
normalizes Idea output into model, fieldset, column, relation, component, store,
assertion, value, and documentation helpers. SQL, view, admin, AI, and other
packages interpret the semantics required by their runtime contracts.

## Semantic Ownership

| Concern | Primary owner |
| --- | --- |
| grammar, values, imports, compiled schema | Idea |
| normalized model/column object model | stackpress-schema |
| assertions, serialization, defaults, documentation metadata | stackpress-schema |
| persistence, keys, relations, query behavior | schema store helpers and stackpress-sql |
| field/filter/list/span/view component meaning | schema component helpers and stackpress-view |
| generated admin routes and workflows | stackpress-admin |
| generated MCP model tools | stackpress-ai |

Document an attribute through its syntax, semantic owner, generated effect,
runtime consumer, fallback, and compatibility boundary.

## Generation Lifecycle

1. Parse and compose the application Idea, including package schemas.
2. Create a shared ts-morph project at the configured client output.
3. Resolve `idea`; enabled packages append their transforms.
4. Run transforms sequentially against the same project.
5. Emit TypeScript or JavaScript plus declarations and package exports.
6. Load the generated package through the configured `client` service.
7. Register generated model listeners, routes, components, scripts, and tools
   during later lifecycle phases.

The generated client is executable application state, not passive types.

## Transform Ownership

Schema, SQL, view, admin, and AI each own transforms because each package knows
the runtime contract it later consumes. Transforms intentionally cooperate on
shared files such as the generated index and package manifest.

Consequences:

- transform order matters;
- transforms must be repeatable and avoid duplicate entries;
- renamed/removed declarations must not leave stale files;
- generator and runtime changes should be made and reviewed together;
- generated output must compile and remain importable through declared exports.

Do not use generated files as the durable implementation owner.

## Generated UI Metadata

Column metadata has separate roles:

| Role | Purpose |
| --- | --- |
| `field.*` | create/update input |
| `filter.*` | search criteria |
| `list.*` | list/table formatting |
| `span.*` | compact field/value behavior |
| `view.*` | detail/read-only formatting |

Component dictionaries define each role's import, export mode, prop contract,
examples, and fixed attributes. Column and fieldset helpers select participating
columns; stackpress-view emits role-specific wrappers; stackpress-admin composes
them into generated workflows.

Current component prop precedence applies Idea-provided object values first and
fixed definition attributes second. Definition attributes therefore win on a
same-named property.

Unknown metadata remains syntactically valid but produces no component behavior
unless an owning dictionary/transform recognizes it. Missing roles are omitted.

## Frui And r22n Contracts

Generated wrappers import granular Frui components. Generated labels, actions,
errors, and interface sentences become r22n source phrases. Changing wording can
change translation keys even when no named identifier changes.

Generated UI structure does not by itself prove accessible composition. Rendered
keyboard, label, relation, validation, SSR, hydration, and screen-reader behavior
must be verified for affected components and workflows.

## Verification

For model or generator changes, check:

1. Idea parse/compile and normalized semantics;
2. clean generation;
3. repeat-generation stability;
4. rename/removal and stale-file behavior;
5. generated package exports and compilation;
6. runtime loading and lifecycle registration;
7. rendered behavior for UI changes;
8. phrase and component compatibility where affected.

## Detailed Reference

Load [Schema API Contracts](../references/00006-schema-api-contracts.md) when
documenting the normalized schema object model, semantic extension facets,
global dictionaries, generated interfaces, or revision history.

Load [Idea Language Catalog](../references/00007-idea-language-catalog.md) when
documenting `.idea` syntax, declarations, type modifiers, metadata, assertions,
`use` composition, or transformer plugins. Load
[Idea Component Catalog](../references/00016-idea-component-catalog.md) for the
complete field/view families, aliases, derived filter/list/span roles, and
component-generation boundaries.

Load [SQL API Contracts](../references/00010-sql-api-contracts.md) when tracing
model storage metadata into generated fields, relationships, stores, actions,
events, schema diffs, or migration behavior.

Load [View API Contracts](../references/00012-view-api-contracts.md) when tracing
generated field/filter/list/span/view components into Reactus entries, SSR,
hydration, layouts, or browser-visible props.
