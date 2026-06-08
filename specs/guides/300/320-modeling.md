# 320 Modeling

Turn product language into Stackpress idea declarations. Modeling is where a feature stops being only a sentence and becomes entities, fields, fixed values, metadata, and relationships that generation can inspect.

**Previously:** The previous course, `Plugins`, separated idea-generation configuration from runtime plugins. This course returns to the app schema and starts the model-building path.

## 320.1. Why Modeling Matters

Most app features begin as human language: authors write articles, comments belong to articles, products have prices, and accounts have roles. Modeling is the step where those ideas become structured declarations in `schema.idea`.

Good modeling makes generated output easier to trust. If the source names entities, fields, states, and relationships clearly, generated schema, SQL, admin pages, view components, and client output are easier to inspect.

## 320.2. From Product Sentence To Schema Shape

Start with a product sentence:

```text
Authors write articles, and each article has a publish status.
```

This sentence already suggests several modeling pieces. `Article` is a model, the author connection is a relation, and publish status is a fixed set of values that can become an enum.

```idea
enum PublishStatus {
  DRAFT "DRAFT"
  REVIEW "REVIEW"
  PUBLISHED "PUBLISHED"
  ARCHIVED "ARCHIVED"
}

model Article
  @labels("Article" "Articles")
  @display("{{title}}")
{
  title  String @label("Title") @is.required("Title is required")
  status PublishStatus @default("DRAFT")
}
```

This example keeps the model small so the mapping is visible. The product sentence names the concept, and the idea declarations give Stackpress a source shape to generate from.

## 320.3. What This Group Covers

`321 Models` teaches entities. `322 Fields`, `323 Enums`, and `324 Types` cover the data pieces that describe those entities.

`325 Props`, `326 Attributes`, and `327 Relations` then add metadata and connections. Props still carry the main source limitation in this group because parser support is confirmed, but concrete generated-output behavior needs a stronger Stackpress source before it should be taught as a normal reusable field workflow.

## 320.4. How To Inspect Modeling Work

After changing a model, inspect the generated surface closest to the change. A new field should show up in generated schema and possibly generated form/list/view files, while a relation should show up in generated store relation behavior.

If the output surprises you, return to the idea declaration first. The reliable fix is usually to correct `schema.idea`, regenerate, and inspect the generated output again.

## 320.5. Mistakes To Avoid

Modeling mistakes usually start before code generation. If the product idea is
unclear, generated output can only make that uncertainty larger and harder to
debug.

### 320.5.1. Start From Generated Output

```ts
export type Article = {
  title: string;
  status: string;
};
```

This generated-looking shape is not the best starting point for modeling. Start
with the product rule first, then write `schema.idea` so generation can produce
schema, SQL, view, and client output from a clear source.

### 320.5.2. Model Everything As A String

```idea
model Article {
  title  String
  status String
}
```

This works as a loose data shape, but it hides the fact that `status` probably
has a fixed set of allowed values. A source-backed enum such as
`PublishStatus` gives generated output a clearer rule than an unrestricted
string.

### 320.5.3. Hide Product Uncertainty In The Schema

```idea
model Subscription {
  billingMode String
}
```

This field may be fine, but it also may be hiding an unfinished product
decision. If the app has not decided whether billing modes are fixed values,
external provider values, or separate records, mark the question before
generation starts treating the field as stable source truth.

**Learning checkpoint:** Before moving on, make sure you can turn one product sentence into likely models, fields, enums, attributes, or relations. You should also know why source clarity matters before generation.

**Next course:** Continue with `Models`. That course starts the modeling details with one entity at a time.
