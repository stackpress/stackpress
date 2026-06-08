# Builder Classes

Stackpress re-exports Inquire builder classes from `stackpress/sql`: `Select`,
`Insert`, `Update`, `Delete`, `Create`, and `Alter`. Most app code reaches
these through `Engine` methods, but the classes are exported for advanced
query-building and type-aware integration.

## Import

```ts
import { Select, Insert, Update, Delete, Create, Alter } from 'stackpress/sql';
```

## Common Builder Pattern

Builders collect SQL intent before the active dialect and connection turn that
intent into a database request.

```ts
const rows = await engine.select([ 'article.id', 'article.title' ])
  .from('article')
  .where('article.status = ?', [ 'PUBLISHED' ])
  .order('article.published', 'desc')
  .limit(10);
```

This example shows the common read path. `from` chooses the table, `where`
adds a predicate with bound values, `order` sorts rows, and `limit` restricts
the result count.

## Builder Inventory

| Class | Use It For | Typical Starting Point |
| --- | --- | --- |
| `Select` | Reading rows. | `engine.select(columns)` |
| `Insert` | Creating rows. | `engine.insert(table)` |
| `Update` | Updating rows. | `engine.update(table)` |
| `Delete` | Removing rows. | `engine.delete(table)` |
| `Create` | Creating tables. | Migration/generation code. |
| `Alter` | Changing tables. | Migration/generation code. |

## Returns

Builder chains usually return the builder until awaited or converted to a
query request. When awaited with an engine attached, the builder resolves to
the driver result for that operation.

## Related

 - [Engine](./Engine.md)
 - [SQL Module](../sql.md)
