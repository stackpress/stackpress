# 742 Admin Views

Admin views are generated React screens for the admin workflows. They read
server props, use the shared admin layout, import generated field and format
components, and render the visible search, create, update, detail, remove, and
restore pages.

## 742.1. What You Are Looking For

When you inspect admin views, you are looking for how schema metadata becomes
visible UI. The page handler may have loaded data, but the view decides which
labels, tables, forms, buttons, breadcrumbs, and formatted values the user
sees.

For Article, generated views live under:

```txt
client-source/Article/admin/views
```

This folder contains React view files such as `search.tsx`, `create.tsx`, and
`detail.tsx`. Those files are generated output, so they should be inspected as
evidence before you decide which source should change.

## 742.2. Search View

The generated Article search view imports Frui table controls, admin client
helpers, generated list formatters, and generated filter controls. That mix
shows how many source decisions meet on one screen.

```tsx
import Table from 'frui/Table';
import { filter, order, paginate } from 'stackpress-admin/client';
import IdListFormat from '../../components/list/IdListFormat.js';
import ProfileIdListFormat from '../../components/list/ProfileIdListFormat.js';
import { ProfileIdFilterFieldControl } from '../../components/filter/ProfileIdFilterField.js';
```

This example shows three layers at once. Frui provides the table, the admin
client provides browser helpers for query-string changes, and generated Article
components format or filter specific fields.

The table body uses generated list components for each visible field:

```tsx
<Table.Col noWrap addClassName="results-value left">
  <TitleListFormat data={row} value={row.title} />
</Table.Col>
```

This line is the visible effect of list metadata. The view does not render
`row.title` directly; it uses the generated list formatter for the field.

## 742.3. Create View

The create view imports generated form field controls. The form also reads the
CSRF token from config and submits with `method="post"`.

```tsx
const { config } = useServer();
const tokenKey = config.path('csrf.name', 'csrf');
const token = config.path('csrf.token', '');

return (
  <form method="post">
    <input type="hidden" name={tokenKey} value={token} />
    <TitleFormFieldControl
      className="control"
      name="title"
      value={input.title}
      error={errors.title?.toString()}
      required
    />
  </form>
);
```

This example connects the view to the page handler from the previous lesson.
The view includes the CSRF field and form controls, while the page handler
validates the token and resolves `article-create`.

## 742.4. Detail View

The detail view uses generated view formatters instead of form field controls.
It also builds actions and relation tabs based on permissions and the current
record.

```tsx
<ProfileIdViewFormat data={results} value={results.profileId} />
```

This formatter hides the raw profile ID behind display metadata. In the
generated Article output, the related profile name can be rendered from the
extended result data instead of showing an ID to the user.

Detail pages also link to related tabs when permission checks allow them:

```tsx
can({
  method: 'GET',
  route: `${base}/article/detail/${results.id}/comments/search`
})
```

This check explains why some related admin tabs may appear or disappear. The
view is not only rendering schema fields; it is also respecting session
permissions for generated admin routes.

## 742.5. Fix The Source

When an admin view looks wrong, identify which layer produced the wrong part
of the screen. A label problem, input problem, display problem, and permission
problem usually point to different sources.

### 742.5.1. Fix A Bad Label

```idea
title String
      @label("Title")
```

Generated admin views translate and render labels from metadata such as
`@label`. If the label is wrong across generated views, fix the idea metadata
and regenerate instead of editing each generated view.

### 742.5.2. Fix A Bad Input

```tsx
<BannerFormFieldControl
  className="control"
  name="banner"
  value={input.banner}
  error={errors.banner?.toString()}
/>
```

This form control came from the generated field component for `banner`. If the
input type is wrong, trace back to the `@field.*` metadata that selected the
component.

### 742.5.3. Fix A Bad Display

```tsx
<BannerListFormat data={row} value={row.banner} />
```

This list formatter came from list display metadata. If the list view should
show a different format, change the `@list.*` metadata and inspect the
regenerated formatter.

## 742.6. Mistakes To Avoid

Admin view mistakes usually come from reading generated React as if it were
handwritten application code. It is React, but it is also a report about what
generation understood from schema and config.

### 742.6.1. Patch One Generated View For A Schema Problem

```tsx
<Table.Head>{_('Better Title')}</Table.Head>
```

Changing one generated heading may seem quick, but regeneration can replace
that edit. If the heading should always be different, change the field label
or generator source that created it.

### 742.6.2. Remove Permission Checks To See A Button

```tsx
{can({ method: 'GET', route: `${base}/article/create` }) ? ... : null}
```

A missing button may mean the session does not have permission for that route.
Do not remove the check just to make the UI appear; inspect the session access
rules and generated route path first.

### 742.6.3. Confuse List And Detail Formatters

```tsx
<BannerListFormat data={row} value={row.banner} />
```

List formatters are designed for dense search results, while view formatters
are designed for detail screens. If the same field looks different in search
and detail, inspect both `@list.*` and `@view.*` before assuming the output is
inconsistent.

## 742.7. Reference Pointers

Use `packages/stackpress-admin/src/transform/views` for generation rules and
`client-source/Article/admin/views` for concrete generated
views. Pair those files with `schema.idea` so every visible
field can be traced back to its metadata.

**Learning checkpoint:** You should now be able to read a generated admin view
as evidence of labels, field controls, display formatters, permissions, and
layout. The next lesson looks at the browser-safe admin client helpers that
support these views.

**Next course:** Continue with `Admin Client`. That lesson explains the shared
client helpers used by generated admin screens.
