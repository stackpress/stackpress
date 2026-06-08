# 412 Client Source

`client-source` is readable generated TypeScript. It gives you a clear way to
inspect what Stackpress generated without treating that output as hand-authored
application code.

**Previously:** `Generated Artifacts` introduced generated output as
inspectable evidence. Here, the focus narrows to the generated TypeScript
folder used by a scaffolded app.

## 412.1. What You Are Looking For

Use `client-source` when you need to answer a generation question. It can show
the generated schema classes, stores, actions, events, tools, package exports,
admin routes, and reusable model components.

The point is not to memorize every generated file. The point is to know where
to inspect when a model, field, event, or generated route does not match what
you expected.

## 412.2. Where Client Source Lives

A scaffolded app config points client generation to a readable folder:

```ts
client: {
  ...common.client,
  lang: 'ts',
  module: 'client-source',
  package: 'client-source',
  build: path.join(common.cwd, 'client-source')
}
```

This config says the generated client package is named `client-source`, is
written as TypeScript, and is built into `client-source`. That is why the
folder exists in a scaffolded app as inspectable output.

Regenerate it with:

```bash
stackpress generate --b config/develop -v
stackpress generate --b config/client -v
```

The scaffolded app's package script names the first command `generate`, while
`generate:client` runs the client-oriented generation pass. Use the package
scripts when you are working inside the app, and use the raw commands when you
need to see the exact bootstrap path.

## 412.3. Inspect Generated Types

Start with the model type when a field shape looks wrong:

```ts
export type Article = {
  id: string;
  profileId: string;
  title: string;
  slug: string;
  keywords: string[];
  tags: string[];
  references: Record<string, ScalarInput> | null;
};
```

This generated type reflects the Article model from `schema.idea`. If
`references` should not be nullable or `keywords` should not be an array, the
fix belongs in the idea source or generator rules, not in this generated type.

Then inspect the generated model entrypoint:

```ts
import ArticleSchema from './ArticleSchema.js';
import ArticleStore from './ArticleStore.js';
import ArticleActions from './ArticleActions.js';
import listen from './events/index.js';
import admin from './admin/routes.js';
```

This file shows which generated surfaces exist for the model. It is a fast way
to check whether schema, store, action, event, and admin output were produced.

## 412.4. Expected Evidence

The root `client-source/index.ts` exports all generated model entrypoints:

```ts
export const model = {
  profile: ProfileModel,
  category: CategoryModel,
  catalog: CatalogModel,
  article: ArticleModel,
  comment: CommentModel,
  application: ApplicationModel,
  session: SessionModel,
  auth: AuthModel
};
```

This file answers a simple question: did the generated client package include
the model at all? If `article` is missing here, inspect the source model and
generation pass before debugging Article routes.

The generated package file exposes import paths:

```json
{
  "name": "client-source",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./Article": "./Article/index.js",
    "./Article/*": "./Article/*.js",
    "./Article/events": "./Article/events/index.js"
  }
}
```

This output explains why generated files can be imported by package-style
paths. If an import path fails, check the package exports before assuming the
model code itself is missing.

## 412.5. Fix The Source

When `client-source` looks wrong, use the source-first loop:

```bash
stackpress generate --b config/develop -v
stackpress generate --b config/client -v
```

Regeneration answers whether the output was simply stale. If the same mistake
appears again, inspect `schema.idea`, `config/client.ts`, or the generator that
produced the file.

Do not patch generated TypeScript as the main fix:

```text
client-source/Article/types.ts
```

Editing this file may appear to work for a moment, but the next generation pass
can overwrite it. Change the source model or generator, then let Stackpress
produce the client output again.

## 412.6. Next Step

`client-source` is one inspection window into generation. Use it when you need
readable TypeScript evidence, and use broader generated artifact checks when
the issue involves `.build`, database state, or build output.

**Learning checkpoint:** Before moving on, make sure you can find
`config/client.ts`, `client-source/index.ts`, a model `types.ts`, and a model
event file, then explain which source file you would change if the output is
wrong.

**Next course:** Continue with `Local Production`. That page moves from
generated output inspection to running production-like behavior locally.
