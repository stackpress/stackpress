# TOP-011: Generated UI Metadata Pipeline

## Finding

Stackpress UI generation interprets Idea column metadata through a component
dictionary. Distinct `field`, `filter`, `list`, `span`, and `view` roles select
Frui imports, props, generated wrappers, and admin composition. Labels and fixed
interface copy become r22n source phrases at generation time.

## Metadata Roles

| Role | Purpose | Typical generated consumer |
| --- | --- | --- |
| `field.*` | editing and create/update input | form field and control |
| `filter.*` | search criteria input | filter field and control |
| `list.*` | tabular/list result formatting | list format component |
| `span.*` | compact field/value input or display | span control |
| `view.*` | detail/read-only formatting | view format component |

The roles are intentionally separate: one column can edit, filter, list, and
display differently.

## Interpretation Pipeline

1. Idea parses attributes as open data.
2. `defineBuiltIn()` registers attribute grammar, assertions, and component
   definitions in Stackpress schema dictionaries.
3. `AttributeComponent` resolves kind, component import, default attributes, and
   declared attribute values.
4. Column/fieldset helpers select columns participating in each UI role.
5. stackpress-view generates role-specific wrappers and granular exports.
6. stackpress-admin composes wrappers into generated CRUD pages and routes.
7. Reactus renders pages; Frui supplies behavior; r22n translates source phrases.

## Component Definition Contract

A definition contains:

- metadata name and role;
- import module, export name, and default/named import mode;
- documented prop types and examples;
- fixed attributes applied to the component.

The current `props` merge applies Idea-provided object values first and
definition attributes second. Fixed definition attributes therefore override
same-named values supplied in the Idea attribute.

Virtual components are detected when import source equals component name. Their
transforms implement formatting logic without emitting an external import.

## Fallback And Omission Behavior

- A role is omitted when no matching component attribute is present.
- Unknown attributes remain Idea metadata but are not generated as components
  unless registered in the dictionary.
- Column names derive readable labels when explicit labels are absent.
- Model labels/plurals fall back to name transformations in admin output.
- Relations and fieldsets receive specialized generators rather than ordinary
  scalar wrappers.

These fallbacks are distributed across schema helpers and transforms; no single
formal fallback registry was found.

## Translation Contract

Generated controls and pages call r22n with field labels, model labels, actions,
errors, and fixed sentences. Because r22n uses source phrases as keys and
fallbacks, changing generated wording can invalidate existing translation maps
without changing a named identifier.

## Accessibility Boundary

Frui components and generated controls provide the concrete HTML behavior, but
metadata selection alone does not prove accessible composition. Custom
components, labels, relation widgets, validation messages, and generated admin
flows require rendered accessibility verification.

## Extension Guidance

1. Define a stable metadata namespace and role.
2. Register component syntax, import identity, props, and fixed attributes.
3. Add generation in stackpress-view or the package owning the runtime consumer.
4. Add admin composition only when the component belongs in generated workflows.
5. Verify generated imports, props precedence, omission, translation phrases,
   SSR, hydration, interaction, and accessibility.

## Evidence Anchors

- `packages/stackpress-schema/src/config/attributes.ts` and `definitions.ts`
- `packages/stackpress-schema/src/attribute/AttributeComponent.ts`
- `packages/stackpress-schema/src/{column,fieldset}/*Component.ts`
- `packages/stackpress-view/src/transform/`
- `packages/stackpress-admin/src/transform/`
- Frui exports/components and r22n phrase runtime

## Resolution

Evidence strength: strong for the pipeline and current precedence. Carry a
formal fallback registry, custom registration API, phrase stability, and rendered
accessibility matrix into compatibility and governance work.

