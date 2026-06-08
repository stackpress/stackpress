# 740 Generated Admin

Generated admin output is the place where Stackpress turns schema metadata
into usable management screens. Studio is planned as a workbench for inspecting
and editing idea source, while generated admin is already a concrete output
surface you can inspect in generated client output.

## 740.1. Current Status

The Studio plan treats admin output as related evidence, not as the first
Studio implementation target. That distinction still matters, but the admin
generator itself has confirmed sources in `packages/stackpress-admin` and
generated output in `client-source`.

In practice, this group should teach admin as a source-to-output inspection
path. Studio may eventually make that inspection easier, but generated admin
routes, pages, and views are already real artifacts.

## 740.2. Why Admin Output Matters

Admin output shows whether Stackpress understood the model metadata the way you
intended. Labels become table headers and form labels, `@field.*` metadata
becomes form controls, `@list.*` metadata becomes search-result formatting,
and `@view.*` metadata becomes detail-page formatting.

That makes admin output useful for junior developers because it gives them
something visible to inspect. If a field looks wrong in admin, the likely fix
is usually in the idea source, not in the generated admin file.

## 740.3. The Generation Chain

The admin plugin connects runtime route registration and generation. At
runtime, it asks the client plugin for generated models and calls each model's
admin route function when one exists.

```ts
const client = ctx.plugin<ClientPlugin>('client');
const { model: models } = await client(true) || {};

for (const model of Object.values(models)) {
  typeof model.admin === 'function' && model.admin(ctx);
}
```

This example explains why generated admin output has to be present before the
runtime can register model admin routes. The route functions come from
generated client output, and the plugin wires them into the server.

During generation, the admin transform emits model routes, page handlers,
views, model registration, and package exports:

```ts
generateRoutes(directory, model);
generatePages(directory, model);
generateViews(directory, model);
generateModel(directory, model);
```

These generator calls describe the admin file families this section covers.
The next lessons separate route/page handlers, React views, and browser-facing
client helpers so each piece is easier to inspect.

## 740.4. What This Group Covers

`741 Admin Pages` follows generated routes and page handlers. It explains how
URLs such as `/admin/article/search` map to generated page modules and model
events.

`742 Admin Views` inspects generated React views. It shows how search, create,
and detail screens import Frui, Stackpress admin layout, generated field
controls, and generated list/view formatters.

`743 Admin Client` looks at the browser-safe admin surface. It explains
`LayoutAdmin`, search helpers such as `filter`, `order`, and `paginate`, import
helpers, and package exports that make generated admin modules importable.

## 740.5. Inspect Safely

When admin output looks wrong, follow the chain backward. Start with the
visible page, inspect the generated view or page handler, then return to the
idea metadata or config that generated it.

Do not edit generated admin output as the long-term fix. Generated files are
evidence and debugging aids, but stable changes should happen in schema,
config, generator source, or a supported customization point.

**Learning checkpoint:** You should now understand generated admin as a real
output surface that sits beside Studio planning. The important habit is to use
admin output as evidence, then fix the source that generated it.

**Next course:** Continue with `Admin Pages`. That lesson starts with the
route and page-handler layer before moving into React views.
