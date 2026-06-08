# 430 Schema Changes

Schema changes are how the data model evolves after the app already has
generated code and local data. The safe habit is to change the source, rerun
generation, push the database change, and inspect the result.

**Previously:** `JSON Fields` showed how flexible field shapes appear in
generated output. Here, the focus shifts to the workflow for changing any model
or field without hand-editing generated files.

## 430.1. When Schema Changes

A schema change starts when the source model changes. In Stackpress, the normal
source files are `schema.idea`, config files, and local plugins, while
generation produces build output, generated app output, `.build`,
`client-source`, and local database state.

This matters because generated files are evidence, not the primary source of
truth. If a generated type or store looks wrong, go back to the model source
and generation path before patching output by hand.

## 430.2. Edit The Source

For a field change, edit `schema.idea` first. The exact field depends on the
feature, but the pattern is the same: make the model change in source before
touching generated output.

```text
summary Text?
        @label("Summary")
        @field.textarea
        @view.text
```

This example adds an optional text field. Optional fields are usually safer for
existing data because old rows can still be readable before every record has a
summary value.

After editing the source, rerun generation:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
```

The first command runs the main app generation pass. The second command runs
the client-oriented generation pass, which can write readable TypeScript into
a folder such as `client-source`.

## 430.3. Generate Or Push

Once generated schema state is current, push the structure change to the local
database:

```bash
stackpress push --b config -v
```

`push` creates or updates database structure from the current generated schema
state. Use it after model, field, or relation changes that need the local
database to match the generated app.

Then inspect the database:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

This command checks the configured database directly. It helps you confirm
that existing rows are still readable after the schema change.

## 430.4. Inspect The Diff

At the lower SQL layer, Inquire can compare two schema builders and produce an
alter plan:

```ts
const alter = engine.diff(from, to);
const statements = alter.query();
```

This is the same idea as "compare the old shape to the new shape." The
generated statements are useful when the app already knows both schema shapes
and needs SQL for the active dialect. Stackpress uses that idea when it
compares generated schema revisions during upgrade work.

Stackpress SQL upgrade code uses revision history to build that comparison:

```ts
const from = await revisions.last(-1);
const to = await revisions.last();
const queries: QueryObject[] = [];

for (const schema of current) {
  const before = previous.find(from => from.build().table === name);
  if (!before) {
    schema.engine = database;
    queries.push(...schema.query());
    continue;
  }
  queries.push(...database.diff(before, schema).query());
}
```

This code compares the previous generated schema revision to the current one.
New tables become create queries, and changed tables become diff-generated
alter queries.

When there are schema queries to run, the upgrade script executes them inside a
transaction:

```ts
await database.transaction(async connection => {
  for (const query of queries) {
    terminal?.verbose && terminal.control.info(query.query);
    await connection.query(query);
  }
});
```

The transaction matters because a schema upgrade can contain several SQL
statements. If one statement fails, the database should not be left with only
part of the intended upgrade applied.

## 430.5. Common Failures

Schema-change failures usually come from skipping one layer of the workflow.
The source, generated output, and database need to agree before a data feature
is ready.

### 430.5.1. Edit Generated Output First

```text
client-source/Article/types.ts
```

Generated files can help you inspect what happened, but they should not be the
first place you fix a model mistake. Change `schema.idea`, regenerate, and then
inspect generated output again.

### 430.5.2. Add A Required Field Without A Plan

```text
summary Text
        @label("Summary")
```

A required field can be correct, but existing rows may not have a value yet.
Add optional fields first or provide a default/backfill plan before making the
field required.

### 430.5.3. Push Without Inspecting Generated Output

```bash
stackpress push --b config -v
```

`push` applies the current generated schema state to the database. Inspect the
generated schema, types, or client output first when the change is risky, so
you do not push a shape you did not mean to generate.

## 430.6. Next Step

Schema changes connect modeling, generated output, and database state inside
the build path. The same discipline applies to deployment: know the source,
inspect the generated result, and verify the runtime behavior.

**Learning checkpoint:** Before moving on, make sure you can explain the order:
edit `schema.idea`, run generation, inspect generated output, push database
structure, and query the database to verify.

**Next course:** Continue with `Vercel`. That course moves from local build and
schema-change workflow to a provider-specific adapter example.
