# Research Ledger: `frui`

## Scope And Status

Research unit: complete sibling repository `../frui`, version `0.2.9`. Public
exports, component families, helpers, styles, tests, docs app, and Stackpress
generation/usage were inspected.

## Native Purpose

Source fact: FRUI means Free React UI and describes itself as “just React
components”: no layouts, grids, themes, style engine, or design system.

Interpretation: Frui is a vocabulary of inspectable UI behaviors and data
presentation controls that applications may compose and style without accepting
a product-wide visual architecture.

## Native Vocabulary

| Family | Behavioral role |
| --- | --- |
| Base | Interaction/container primitives such as Button, Dialog, Table, Tabs. |
| Form | Input, control, fieldset, file, metadata, editor, and selection widgets. |
| View | Display formatters for common scalar and structured values. |
| Tool | Conditional/scope/composition helpers. |
| Slots | Named child-component roles discovered from React children. |
| Style tools | Typed prop-to-class/style transformations. |
| Data | Country, currency, language, and color option sets. |

## Behavioral Conclusions

### Components Are Granular Import Contracts

The package exposes root families and granular component subpaths, with matching
CJS/ESM/types and standalone CSS. Evidence: `../frui/package.json` exports;
`../frui/src/index.ts`; family index files.

Interpretation: Consumers and generators can depend on narrow, tree-shakable,
stable component names instead of importing a monolithic framework.

### Composition Uses Children And Slots Instead Of A Layout System

Components such as Table, Card, Tabs, Dropdown, Fieldset, Scope, and When inspect
typed child roles and contexts. Helpers normalize children, find named component
types, and derive slot styles. Evidence: `../frui/src/base/*.tsx`;
`src/form/Fieldset.tsx`; `src/tool/*.tsx`; `src/helpers/*`; matching tests.

Interpretation: Frui offers local composition protocols without claiming page
layout or application-shell ownership.

### Form And View Families Are Deliberately Symmetric

Form components edit recurring data shapes; view components render many of the
same shapes. Examples include rating, metadata, country, currency, images,
lists, dates, phone, and code. Evidence: `src/form/`, `src/view/`, docs and tests.

Interpretation: The library is particularly suited to metadata-driven systems
that need to map a field type to both edit and display behavior.

### Styling Is Optional Infrastructure

Components accept normal React props/classes; bundled CSS supplies defaults;
helpers and UnoCSS support convert typed style props into classes. This does not
become a theme engine. Evidence: `styles/`, `frui.css`, `src/unocss.ts`,
`src/helpers/tools/*` and tests.

Interpretation: Frui separates behavioral component reuse from mandatory visual
identity, allowing Stackpress or applications to own branding and layout.

## Repeated Patterns And Invariants

- `P-FRUI-01`: Narrow subpath exports make individual components generator-safe
  contracts. Confidence: source fact.
- `P-FRUI-02`: Base, form, and view families separate interaction, editing, and
  presentation. Confidence: source fact.
- `P-FRUI-03`: Typed slots/context compose compound controls without global
  layout ownership. Confidence: strong interpretation.
- `P-FRUI-04`: Native input props and ordinary React children remain available;
  wrappers do not replace React's model. Confidence: source fact.
- `P-FRUI-05`: Tests focus on rendered behavior and interaction for each small
  component. Confidence: source fact.

## Deliberate Tradeoffs And Exclusions

- No application layouts, responsive grid, theme system, design tokens, or brand.
- Visual consistency depends on optional CSS and host conventions.
- Some advanced controls bring focused dependencies, but the package does not
  hide them behind a larger form framework.
- Components do not own server data fetching, validation policy, or persistence.
- Broad component coverage increases the granular export compatibility surface.

## Unique Or Surprising Concepts

- “No design system” is an intentional adoption feature, not a missing roadmap.
- Form/view symmetry creates a natural target for generated field metadata.
- Compound components use slots while remaining plain React components.
- Data option sets live beside controls but are not application localization.

## Stackpress Intersections

- `stackpress-view` generators map Idea `field`, `list`, and `view` metadata to
  Frui form/view components.
- `stackpress-admin` generates pages using granular Frui imports such as Button,
  Bread, Table, Pager, Alert, FieldControl, and input components.
- Handwritten session/auth views use the same components as generated admin UI.
- Templates opt into `frui/frui.css`; Stackpress layouts, theme context, and
  brand config remain outside Frui.

## Potential Deeper Topics

- `FRUI-T01`: Form/view symmetry as a generation target.
- `FRUI-T02`: Component primitives without design-system commitment.
- `FRUI-T03`: Granular exports as generated-code contracts.
- `FRUI-T04`: Slots and contexts as local composition protocols.
- `FRUI-T05`: Stackpress ownership of layout, theme, and brand above Frui.

## Open Questions

- Which granular exports are guaranteed stable for generated Stackpress code?
- How are accessibility and browser behavior verified across generated usage?
- Which Idea attributes map directly to Frui versus Stackpress wrappers?
- Should Frui CSS be optional for every Stackpress surface?

