# 331 Schema Output

Trace `schema.idea` into generated schema classes before debugging higher-level behavior. Schema output matters because it is the first generated proof that Stackpress understood a model, its fields, its defaults, and its validation rules.

**Previously:** The previous course, `Generation`, connected `schema.idea` to generated client output. This course opens one generated model schema and compares it back to the source model.

## 331.1. Where To Look

In a scaffolded app, generated Article schema output lives under `client-source/Article`. Start with the schema class and one generated column file.

```text
client-source/Article/ArticleSchema.ts
client-source/Article/columns/TitleColumn.ts
```

These files are generated output, not source files to hand-edit. They are useful because they show how Stackpress interpreted the `Article` model after generation ran.

## 331.2. The Schema Class

`ArticleSchema.ts` imports every generated column class, builds a `columns` map, builds a Zod `shape`, and exposes helper methods such as `defaults`, `assert`, `filter`, `populate`, `serialize`, and `unserialize`. This is the generated schema contract that later store, action, and UI code can rely on.

```ts
this.columns = {
  id: new IdColumn(),
  profileId: new ProfileIdColumn(),
  title: new TitleColumn(),
  slug: new SlugColumn()
};

this.shape = z.object({
  id: this.columns.id.shape,
  profileId: this.columns.profileId.shape,
  title: this.columns.title.shape,
  slug: this.columns.slug.shape
});
```

This shortened example shows the pattern without listing every Article field. The column map gives each field a generated class, and the Zod shape combines those columns into one schema-level validation shape.

## 331.3. A Column File

`TitleColumn.ts` is where the generated title field becomes a concrete column contract. It names the column, defines its Zod shape, carries its default behavior, validates input, and serializes values.

```ts
public readonly name = 'title';

public constructor() {
  this.shape = z
    .string()
    .describe('Title of the article.')
    .refine(
      (data: any) =>
        typeof data !== 'undefined' && data !== null && String(data) !== '',
      { message: 'Title is required' }
    );
}
```

This example traces back to the `title String` field and `@is.required("Title is required")` metadata in `schema.idea`. The generated column turns that idea metadata into runtime validation behavior.

## 331.4. What To Inspect

When a field behaves incorrectly, inspect whether the generated schema has the field, default, assertion message, and serialization behavior you expected. If the generated output is missing the expected meaning, the fix usually belongs in `schema.idea` or the generator source, not inside the generated file.

For example, if `TitleColumn` does not contain the required-message refinement, check whether the `title` field still has `@is.required("Title is required")` in `schema.idea`. Regenerate after fixing the source so the output can be recreated consistently.

## 331.5. Mistakes To Avoid

Generated schema output is evidence, not the first place to fix product rules.
Use it to find the mismatch, then move upstream to the idea source or
generator that produced the file.

### 331.5.1. Patch A Generated Column

```ts
// client-source/Article/columns/TitleColumn.ts
this.shape = z.string().min(1, 'Title is required');
```

This might make the current generated file look correct, but the next
generation run can overwrite it. If the title should be required, fix or
confirm the `@is.required("Title is required")` source in `schema.idea`, then
regenerate.

### 331.5.2. Debug Admin UI Before Schema Output

```text
The admin form accepts an empty title.
```

This symptom may appear in the admin page, but the first generated evidence is
the schema and column output. If `TitleColumn.ts` does not contain the expected
required refinement, the admin form is showing a schema problem rather than
creating one by itself.

### 331.5.3. Blame The Generator Before Checking Source

```idea
title String @label("Title")
```

This field has a label, but it does not show the required validator from the
earlier example. Before treating missing validation as a generator bug, confirm
that the field, attribute, default, or validator exists in `schema.idea`.

**Learning checkpoint:** Before moving on, make sure you can trace one `schema.idea` field into a generated schema class and a generated column file. You should also know why source fixes belong upstream of generated output.

**Next course:** Continue with `SQL Output`. That course follows the same generated model into store and action behavior.
