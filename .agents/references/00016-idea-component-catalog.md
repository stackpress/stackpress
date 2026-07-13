# Idea Component Catalog

Use this reference for Stackpress-recognized `field.*`, `filter.*`, `span.*`,
`view.*`, and `list.*` metadata. Core Idea syntax and non-component attributes
are in [Idea Language Catalog](./00007-idea-language-catalog.md).

## Component Contract

A component attribute definition records:

- metadata name and role kind;
- imported component name, module, and default/named mode;
- accepted props with types, requirement, descriptions, and examples;
- fixed attributes applied by the definition.

Idea method arguments become props by definition order. Generated component
props apply Idea-provided object values first and fixed definition attributes
second, so fixed attributes win collisions. A flag uses defaults. Missing roles
are omitted rather than synthesized.

## Field Components

`field.*` describes create/update input behavior:

| Group | Names |
| --- | --- |
| common input | `checkbox`, `code`, `color`, `country`, `currency`, `date`, `datetime`, `email`, `file`, `image`, `input`, `integer`, `json`, `markdown`, `mask`, `metadata`, `number`, `password`, `phone`, `price`, `radio`, `rating`, `select`, `slider`, `slug`, `small`, `suggest`, `switch`, `tags`, `textarea`, `editor`, `time`, `url` |
| collection | `datelist`, `datetimelist`, `filelist`, `imagelist`, `numberlist`, `stringlist`, `textlist`, `timelist` |
| structural | `fieldset`, `relation` |

Notable role-specific signatures:

- `field.relation(id, search, template)` connects a relationship selector to
  an ID, search URL, and display template;
- `field.fieldset` groups nested fields using a generated local component;
- controls expose only their registered props; common examples include
  `className`, `style`, labels/placeholders, option lists, bounds, and control
  behavior, but these are definition-specific rather than universal.

Field aliases:

```text
taglist->tags; string->input; text->textarea; float->number;
boolean->switch; object/hash->json; strings/texts->stringlist;
dates->datelist; datetimes->datetimelist; times->timelist;
integerlist/integers/floatlist/floats/numbers->numberlist
```

## View Components

`view.*` describes detail/read-only formatting:

| Group | Names |
| --- | --- |
| text/format | `capitalize`, `chars`, `comma`, `country`, `currency`, `date`, `email`, `formula`, `line`, `lowercase`, `number`, `phone`, `price`, `relative`, `text`, `transform`, `uppercase`, `words`, `yesno` |
| rich/media | `carousel`, `code`, `color`, `film`, `html`, `image`, `json`, `markdown`, `metadata`, `rating`, `tags` |
| collections/layout | `list`, `ol`, `spread`, `tabular`, `ul`, `overflow`, `fieldset`, `template` |
| relation/link | `link`, `rel` |

`view.template(template)` renders custom template content. `view.fieldset`
groups nested output. Relation/link views are display adapters; they do not
define data integrity or authorization.

View aliases:

```text
table->tabular; taglist->tags; clip->overflow; string->text;
float/integer->number; boolean->yesno; datetime->date;
object/hash->json; strings/texts/dates/datetimes/times/integers/floats/
numbers/stringlist/textlist/datelist/datetimelist/timelist/integerlist/
floatlist/numberlist->list
```

## Derived Families

`filter` is mechanically derived from the complete field registry by replacing
`field.` with `filter.`. `span` is derived the same way with `span.`. `list` is
derived from the complete view registry by replacing `view.` with `list.`.

Consequences:

- all field aliases and special fields also exist as filter/span names;
- all view aliases and special views also exist as list names;
- derived entries preserve component imports, prop definitions, and fixed
  attributes of their source entry;
- the role prefix changes generator placement, not the underlying component.

## Selection Semantics

The schema lens selects at most the relevant registered component per role on a
column. Fieldset lenses collect participating columns into role-specific lists.
Generated Stackpress view wrappers import granular Frui components, while
fieldset/relation/template entries may resolve to generated local components.

Component metadata describes generation intent, not rendered quality. Verify
labels, keyboard behavior, accessibility, SSR/hydration, relation loading,
validation display, and responsive composition in the generated application.

## Source Anchors And Authority

Checkout anchors: `packages/stackpress-schema/src/config/attributes.ts`,
`config/definitions.ts`, attribute/column/fieldset component lenses, and
`packages/stackpress-view/src/transform/`. The registry is source authority;
Frui owns the imported component runtime. Existing docs are parity benchmarks.
