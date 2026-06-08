# 511 Source Of Truth

A Stackpress project has two kinds of files: the files that describe what the
app should be, and the files Stackpress creates from those descriptions. The
first group is the source of truth. The second group is evidence you can
inspect when you want to understand what generation produced.

The difference matters because generated code can look like the place to fix a
bug. It has TypeScript types, store classes, routes, and package files, so it
feels real enough to edit. The safer habit is to treat generated output like a
printed receipt: useful for checking what happened, but not the place where you
change the order.

**Previously:** `Project Anatomy` introduced the recommended app folders. This
lesson turns that map into a decision rule: when something changes, decide
which authored file owns the change before touching generated output.

## 511.1. The Decision

The decision is whether a change belongs in authored source or generated
output. Authored source is the file you maintain because it describes product
intent, runtime behavior, config, or static assets. Generated output is the file
Stackpress can recreate after generation runs again.

Use this question when you are unsure: "If I delete the generated folders and
run the Stackpress commands again, where should this change come from?" That
answer points you away from temporary output and back toward the owning source
file. If the answer is a schema field, a config option, a plugin route, or an
asset, that is the source file to edit.

## 511.2. Recommended Default

Start with a source-first rule. Edit the file that explains the intent, then
regenerate or rerun the app so generated files can catch up.

| Product change | Edit this first | Inspect this after |
| --- | --- | --- |
| Add or change a model field | `schema.idea` | `client-source/<Model>/types.ts`, schema, store, and admin output |
| Change generated admin labels or field UI | `schema.idea` attributes | generated admin views and field components |
| Change runtime mode, client output, assets path, or database paths | `config/*` | `.build`, `client-source`, generated package target, or running server behavior |
| Change a local route or view registration | `plugins/*/plugin.ts` and local page/view files | browser route behavior and route logs |
| Change page copy, layout, or route-specific rendering | `plugins/*/views/*` or local page handlers | rendered page output |
| Change a static image, stylesheet, or favicon | `public/*` | browser asset URL and rendered page output |

This table is not a full reference. It is the first decision map a junior
developer should reach for when a generated file looks wrong or a local page
does not match the app they intended to build.

## 511.3. Source Files

Source files are the blueprints Stackpress reads or the handwritten files your
app owns directly. In a scaffolded app, those surfaces include `schema.idea`,
`config/common.ts`, `config/develop.ts`, `config/build.ts`,
`config/client.ts`, `plugins/app/plugin.ts`, `plugins/store/plugin.ts`, and
files under `public`.

The schema is a good first example because one product idea fans out into many
generated files. Look at this confirmed field from a scaffolded app, where the
source file defines both the type and the generated admin behavior.

```idea
status      PublishStatus
            @label("Status")
            @default("DRAFT")
            @field.select({ options [ "DRAFT" "REVIEW" "PUBLISHED" "ARCHIVED" ] })
            @is.required("Status is required")
            @list.string @view.string
```

This example says the article status must use the `PublishStatus` enum and
should default to `DRAFT`. It also describes form, list, and detail-view
behavior, so generated output can build several surfaces from one source
decision.

Config is another source surface because it chooses how the app runs and where
output should go. A scaffolded app uses `config/client.ts` to send readable
client output into a local inspection folder, and that config choice controls
where the next generation pass writes files.

```ts
client: {
  ...common.client,
  lang: 'ts',
  module: 'client-source',
  package: 'client-source',
  build: path.join(common.cwd, 'client-source')
}
```

This example changes the generated client target for the client generation
pass. If `client-source` is missing or points to the wrong place, the lasting
fix belongs in this config shape, not in the generated folder itself.

## 511.4. Generated Files

Generated files are useful because they show what Stackpress understood from
your source. They are not useless, and they are not fake. They are just not the
best place to make a lasting product change.

In a scaffolded app, the `status` field appears in
`client-source/Article/types.ts` after generation:

```ts
export type Article = {
  id: string;
  profileId: string;
  title: string;
  slug: string;
  banner: string | null;
  contents: string | null;
  status: PublishStatus;
};
```

This example is generated evidence. It confirms that Stackpress turned the
schema enum field into a `PublishStatus` TypeScript property, but editing this
type directly would only patch the receipt. The next generation pass can
replace it because the source still lives in `schema.idea`.

The same rule applies to `.build`. The scaffolded config stores revision history in
`.build/revisions` and database migration paths under `.build`, so those files
help you inspect generation and database state. They do not replace the schema,
config, or plugin files that produced the state.

## 511.5. Tradeoffs

The source-first rule is slower than editing whatever file is already open. It
asks you to trace the problem before changing it, which can feel like extra
work during a bug fix. The payoff is that your fix survives the next generation
run and other developers can find the intent in the expected place.

### 511.5.1. Add A Field

When a product needs a new article field, start in `schema.idea`. That is where
the product meaning, type, validation, admin field, and display metadata can
stay together.

```idea
status      PublishStatus
            @label("Status")
            @default("DRAFT")
            @field.select({ options [ "DRAFT" "REVIEW" "PUBLISHED" "ARCHIVED" ] })
```

This example gives `Article` a `status` field backed by the `PublishStatus`
enum. The field metadata also explains how the generated admin form should show
the value, so generated output can update consistently after generation.

### 511.5.2. Change A Route

When a product needs a new local route, start in the plugin that owns app
routes. In a scaffolded app, `plugins/app/plugin.ts` registers route handlers
and view routes during the `route` lifecycle.

```ts
server.import.get('/articles/:slug', () => import('./pages/article.js'));
server.view.get('/articles/:slug', '@/plugins/app/views/article');
```

This example connects one URL to two authored surfaces. The page handler loads
route data, and the view route points Reactus at the view module that renders
the page. If `/articles/:slug` is wrong, edit the plugin registration or the
related page/view source instead of generated output.

### 511.5.3. Change Branding

When a product needs a different logo or favicon, start with config and public
assets. A scaffolded app keeps brand paths in `config/common.ts` and the files
themselves under `public`.

```ts
export const brand = {
  name: 'Stackpress',
  logo: '/logo.png',
  icon: '/icon.png',
  favicon: '/favicon.ico'
};
```

This example tells the app which public asset URLs represent the brand. If the
logo needs to change, replace the public asset or change the config path so the
running app and generated surfaces read the same source decision.

## 511.6. Next Step

The habit to keep is simple: edit intent, then inspect output. Generated files
are there to help you see what Stackpress produced, not to become a second
unofficial source tree.

Read `512 Generated Output` next. That lesson shows how to inspect generated
folders safely and how to trace wrong output back to the source file that
should change.

**Learning checkpoint:** You should be able to explain why editing
`client-source/Article/types.ts` is different from editing `schema.idea`. You
should also be able to name the source file you would check first for a model
field, a route, a config change, and a public asset.
