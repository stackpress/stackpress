# 233 JSON Fields

JSON fields store flexible data inside one column. They are useful when the app
needs to keep small nested values, but those values do not need their own table
or first-class column yet.

**Previously:** `Transactions` showed how to protect grouped writes. Here, the
focus shifts to flexible data shapes: when a JSON column is useful, how to read
inside one, and why JSON queries need dialect-aware verification.

## 233.1. Operation Goal

The goal is to query nested data without hand-writing a different SQL fragment
for every database. A JSON column can hold values like metadata, preferences,
external references, or search hints where the exact keys may vary by row.

Think of a JSON column as a labeled drawer inside a row. The row still has
normal columns around it, but the drawer can hold a small object with nested
keys that only some records need.

## 233.2. Store Flexible Data

Imagine an `article` table with a `data` column. If that column uses JSONB in
PostgreSQL, one row could store a nested SEO title like this. This gives the
query examples a concrete shape without requiring a schema-authoring lesson
first.

```json
{
  "seo": {
    "title": "Nature Show"
  }
}
```

This value belongs in JSON when it is supporting metadata instead of the main
article title. The app can still query it, but the model is saying that the
value is part of a flexible data object rather than one of the row's central
fields.

The same pattern can hold optional external references:

```json
{
  "sources": {
    "originalUrl": "https://example.com/nature-show"
  },
  "flags": ["featured", "editorial"]
}
```

This example shows why JSON fields are useful for integration data and optional
tags. The shape can grow when the integration needs another key, while the core
table stays focused on the columns the app uses every day.

## 233.3. Query A Nested Value

Use a JSON path selector when the query needs to compare a nested value. The
selector names the table and column before the colon, then names the JSON path
after the colon.

```ts
const articles = await engine.select('*')
  .from('article')
  .where('article.data:seo.title = ?', [ 'Nature Show' ]);
```

This query reads the `seo.title` value inside the `data` JSON column. The
placeholder still keeps the input bound safely, so the title value is data
rather than string-concatenated SQL.

The same selector shape can be used with a different key:

```ts
const articles = await engine.select('*')
  .from('article')
  .where('article.data:sources.originalUrl = ?', [
    'https://example.com/nature-show'
  ]);
```

This example filters by a nested external reference. The important part is that
the path describes where the value lives, while the placeholder array supplies
the value being compared.

## 233.4. Use JSON Helper Filters

Inquire also supports JSON-specific helper filters. Use `whereJson()` when you
want the builder to receive the JSON selector and comparison pieces directly.

```ts
const articles = await engine.select('*')
  .from('article')
  .whereJson('=', ['data:seo.title', '?'], 'Nature Show');
```

This version expresses the same kind of nested comparison through a JSON helper.
The selector still points at `data:seo.title`, but the helper keeps the JSON
operation explicit at the builder level.

Use `whereJsonContains()` when the JSON value is an array or object and the
query needs a containment check:

```ts
const articles = await engine.select('*')
  .from('article')
  .whereJsonContains('data:flags', 'featured');
```

This query asks whether the `flags` value contains `featured`. Containment is
more database-sensitive than simple equality, so this is the kind of query you
should verify against the database your app actually runs.

## 233.5. Inspect Dialect Behavior

JSON storage changes with the database dialect. The Inquire dialect docs map a
generic JSON field to different database types, so the same app-level intent can
produce different database-level behavior.

```text
MySQL: json -> JSON
PostgreSQL: json -> JSONB
SQLite: json -> TEXT
```

This matters because JSON operators are not identical across database families.
Stackpress and Inquire can help translate builder calls, but JSON filtering is
still a place where the emitted SQL deserves inspection.

After adding a JSON query, inspect the SQL that reaches the database:

```bash
stackpress query
```

This command gives you a direct way to confirm whether the JSON path and bound
values are behaving as expected. The practical check is simple: the query should
find the row with the nested value and should not require unsafe string
concatenation.

## 233.6. Common Mistakes

JSON field mistakes usually come from treating flexibility as a substitute for
modeling. A JSON field is useful, but it should not hide values that the app
regularly sorts, filters, validates, or secures.

### 233.6.1. Hide Core Fields In JSON

```json
{
  "status": "PUBLISHED"
}
```

This is a poor shape when `status` controls publishing behavior across the app.
Keep important product state in normal columns so filters, validation, and
permissions are easier to inspect.

### 233.6.2. Concatenate JSON Query Values

```ts
const title = 'Nature Show';
await engine.select('*')
  .from('article')
  .where(`article.data:seo.title = '${title}'`);
```

This mixes the value into the SQL string. Use a placeholder and a value array
instead, because the title is user or app data and should stay bound as data.

### 233.6.3. Assume JSON Type Is The Same Everywhere

```text
json -> JSONB
json -> JSON
json -> TEXT
```

The same generic JSON field can become different database types by dialect.
Verify JSON filters against the configured database instead of assuming every
database uses the same JSON operators.

### 233.6.4. Query Deep JSON Before Checking The Shape

```ts
await engine.select('*')
  .from('article')
  .where('article.data:reporting.primaryCategory = ?', [ 'travel' ]);
```

This can be a valid query when the value is optional metadata. If
`primaryCategory` becomes central to search, reporting, or permissions, promote
it to a normal column instead of hiding important behavior in JSON.

**Learning checkpoint:** Before moving on, make sure you can explain when a
JSON column is appropriate, how `article.data:seo.title` points into a nested
value, and why the database dialect matters for JSON filters.

**Next course:** Continue with `Idea`. That course introduces the source model
that later schema-change and generation lessons depend on.
