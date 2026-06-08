# 743 Admin Client

Admin client code is the browser-safe support layer used by generated admin
views. It exports the admin layout, query-string helpers, CSV import helpers,
and types that generated React screens can import without pulling in
server-only code.

## 743.1. What You Are Looking For

When you inspect admin client code, you are looking for shared browser behavior
rather than model-specific page logic. Search views need helpers for filters,
ordering, pagination, layout, and import uploads, and those helpers live in the
admin client surface.

The package entrypoint is:

```txt
packages/stackpress-admin/src/client/index.ts
```

This file is the supported browser-safe export surface for admin client code.
Generated views import from `stackpress-admin/client` instead of reaching into
server transforms or page handlers.

## 743.2. Browser-Safe Exports

The admin client index exports layout, helper functions, import utilities, and
types. It also carries a note that these exports need to stay client/browser
safe.

```ts
import LayoutAdmin from './LayoutAdmin.js';
import {
  ErrorWithErrors,
  csvToFormData,
  batchImportSend,
  batchAndSend
} from './import.js';
import { filter, order, paginate } from './helpers.js';

export {
  filter,
  order,
  paginate,
  LayoutAdmin,
  ErrorWithErrors,
  csvToFormData,
  batchImportSend,
  batchAndSend
};
```

This example explains why generated views can import a compact client surface.
The admin client package gathers helpers that are safe for browser-facing
React code.

## 743.3. LayoutAdmin

`LayoutAdmin` wraps admin pages with `LayoutPanel` and passes the configured
admin menu into the shared layout. It also unloads server flash messages and
shows response errors as notifications.

```tsx
return (
  <LayoutPanel
    menu={menu}
    data={data}
    session={session}
    request={request}
    response={response}
  >
    {children}
  </LayoutPanel>
);
```

This example shows why generated admin views do not each build their own app
frame. The layout uses the shared Stackpress panel and feeds it the admin menu
from server-provided data.

## 743.4. Search Helpers

Search helpers update the current browser URL instead of calling server code
directly. They are small, but they explain how generated search views turn
table clicks into new query strings.

```ts
export function order(name: string) {
  const url = new URL(window.location.href);
  const search = url.searchParams;
  const sort = search.get(name) || '';
  const direction = sort === ''
    ? 'desc'
    : sort === 'desc'
    ? 'asc'
    : '';
  if (direction.length > 0) {
    search.set(name, direction);
  } else {
    search.delete(name);
  }
  window.location.href = url.href;
}
```

This helper cycles a sort parameter through descending, ascending, and absent.
The generated search view can call `order('sort[created]')`, then let the page
reload with the updated query string.

## 743.5. Import Helpers

Generated search views use admin client import helpers when the user uploads a
CSV file. The Article search view calls `batchAndSend('import?json', token,
file, notify)` and reloads after a successful import.

```ts
batchAndSend('import?json', token, file, notify).then((success) => {
  if (success) {
    flash('success', 'File imported successfully');
    window.location.reload();
  }
});
```

This example shows the browser-side half of import. The helper parses the file,
sends form data to the generated import page, reports row errors through
notifications, and lets the view decide what to do after success.

## 743.6. Generated Package Exports

The admin transform also updates package exports for generated admin modules.
That lets runtime and view code import generated admin pages, views, and routes
through predictable package paths.

```ts
packageJson.set('exports', `./${admin}/pages/*`, `./${admin}/pages/*.js`);
packageJson.set('exports', `./${admin}/views/*`, `./${admin}/views/*.js`);
packageJson.set('exports', `./${admin}/routes`, `./${admin}/routes.js`);
```

This example is a generation-time detail, not a browser helper. It matters
because missing exports can make a generated admin module exist on disk but
fail when another part of the app tries to import it.

## 743.7. Mistakes To Avoid

Admin client mistakes usually come from crossing the browser/server boundary.
Generated views can use browser-safe client helpers, but they should not import
server-only route handlers or transform code.

### 743.7.1. Import From Generated Page Handlers In A View

```tsx
import searchPage from '../pages/search.js';
```

A page handler is server-side route logic, not browser UI support. Use
`stackpress-admin/client` for browser helpers and keep generated page handlers
on the server route side.

### 743.7.2. Manually Build Query Strings In Every View

```tsx
window.location.href = `?sort[created]=desc`;
```

This works once, but it duplicates behavior that the admin client already
centralizes. Use `filter`, `order`, and `paginate` so generated search views
share one query-string behavior.

### 743.7.3. Treat Import As A Server-Only Feature

```tsx
<input type="file" />
```

The input alone does not parse CSV, send batched form data, or report row
errors. Use the admin import helpers when the generated view needs the full
browser-side import flow.

## 743.8. Reference Pointers

Use `packages/stackpress-admin/src/client` for shared browser-safe admin
helpers. Use `packages/stackpress-admin/src/transform/package.ts` for generated
package export rules, and inspect `client-source/Article/admin`
to see how generated views import the client surface.

**Learning checkpoint:** You should now be able to separate admin page
handlers from admin client helpers. The key rule is that generated views import
browser-safe helpers, while route handlers and transforms stay on the server or
generation side.

**Next course:** Continue with `Import / Export`. That lesson returns to
Studio planning, so keep the implementation boundary clear as you read it.
