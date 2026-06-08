# 332 SQL Output

Inspect generated stores and actions before writing custom SQL for common model behavior. SQL output matters because Stackpress turns schema meaning into table creation, selectors, relations, and event-style data operations.

**Previously:** The previous course, `Schema Output`, showed how a model becomes generated schema and column classes. This course follows the same `Article` model into generated database-facing code.

## 332.1. Where To Look

A scaffolded app generates Article store, action, and event files under `client-source`. These are the first files to inspect when a generated data operation is unclear.

```text
client-source/Article/ArticleStore.ts
client-source/Article/ArticleActions.ts
client-source/Article/events/search.ts
```

The store owns table and query-building behavior. The actions class owns higher-level operations such as create, update, delete, find, and count, while event files expose those operations through Stackpress handlers.

## 332.2. Store Output

`ArticleStore.ts` extends `ArticleSchema`, sets the table name to `article`, and builds SQL schema details from the idea model. In the generated `create()` method, source fields become SQL fields, keys, and relations.

```ts
schema.addField('title', {
  type: 'VARCHAR',
  length: 255,
  nullable: false,
  comment: 'Title of the article.'
});
schema.addUniqueKey('article_slug_unique', 'slug');
schema.addForeignKey('article_profile_id_foreign', {
  table: 'profile',
  foreign: 'id',
  local: 'profile_id',
  delete: 'CASCADE',
  update: 'RESTRICT'
});
```

This example shows three kinds of generated SQL meaning. `title` becomes a non-null text column, `slug` becomes a unique key, and the `profile` relation becomes a foreign key from `article.profile_id` to `profile.id`.

## 332.3. Action Output

`ArticleActions.ts` wraps store behavior in model-level operations. The generated `create()` method filters input, populates defaults, serializes values, validates required input, checks unique fields, inserts the row, and returns an unserialized result.

```ts
const filtered = this.store.filter(input);
const populated = this.store.populate(filtered);
const serialized = this.store.serialize(populated);
const errors = this.store.assert(sanitized, true) || {};
```

This shortened example shows why generated actions are a better first stop than raw SQL for normal CRUD work. They reuse the generated schema rules instead of asking every route to repeat filtering, defaults, serialization, and validation by hand.

## 332.4. Event Output

`Article/events/search.ts` exposes generated search behavior as a Stackpress action. It gets the database engine from the app context, creates `ArticleActions`, calls `findAll()` and `count()`, then writes rows into the response.

```ts
const engine = ctx.plugin<DatabasePlugin>('database');
const actions = new ArticleActions(engine, seed);
const results = await actions.findAll(req.data());
const total = await actions.count(req.data());
res.rows(results, total);
```

This example explains the route/event path junior developers usually touch. The event does not write SQL directly; it delegates to generated actions, which delegate to generated store behavior.

## 332.5. Mistakes To Avoid

Generated SQL output already carries a lot of schema meaning. Before writing a
custom query, inspect whether the generated store, action, or event already
does the common operation safely.

### 332.5.1. Bypass Generated Actions Too Early

```ts
await engine.insert('article').values(req.data());
```

This skips the generated action path that filters input, populates defaults,
serializes values, validates fields, and handles dialect-specific return
behavior. Use generated actions first when the model already has them.

### 332.5.2. Debug Search Only In The Route

```ts
await ctx.emit('article-search', req, res);
```

This line is only the handoff. If the search result is wrong, inspect the
generated event, `ArticleActions.findAll()`, store selectors, and relation map
so you can see where query behavior is actually produced.

### 332.5.3. Patch Generated Store Output

```ts
schema.addUniqueKey('article_title_unique', 'title');
```

Adding this by hand changes one generated file, not the source that will be
used next time. If a field, relation, unique key, or default is wrong, fix the
idea source or generator and regenerate the SQL output.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between generated store, action, and event files. You should also be able to trace one `Article` field into SQL field output and one search event into generated action behavior.

**Next course:** Continue with `View Output`. That course follows schema metadata into generated UI components and admin views.
