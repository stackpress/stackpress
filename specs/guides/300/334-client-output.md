# 334 Client Output

Use generated client-facing TypeScript as an inspection map, not as a place to patch source by hand. Client output matters because Stackpress packages generated models, events, admin routes, tools, scripts, and exports into a readable folder that other runtime code can load.

**Previously:** The previous course, `View Output`, inspected generated files for one model and its admin UI. This course looks at the wider `client-source` package surface.

## 334.1. Where To Look

A scaffolded app's generated client package lives at `client-source`. The root files show the package-level exports, while each model folder contains model-specific generated output.

```text
client-source/index.ts
client-source/package.json
client-source/Article/index.ts
client-source/tools.ts
```

These files help you answer practical debugging questions. You can check whether a model is exported, whether events are reachable, whether admin route modules exist, and whether generated tools have package exports.

## 334.2. Root Client Exports

The root `index.ts` imports each model package and exposes them through a `model` object. It also exports generated scripts, config, and tools.

```ts
import ArticleModel from './Article/index.js';
import * as scripts from './scripts.js';
import config from './config.js';
import tools from './tools.js';

export const model = {
  article: ArticleModel
};

export { scripts, config };
export { tools };
```

This shortened example shows why the client output is useful for inspection. If runtime code expects the generated article model but it is missing from the root model map, the problem is visible before you chase route behavior.

## 334.3. Model Package Exports

`Article/index.ts` exports the generated schema, store, actions, columns, events, event listener, and admin route registrar. It also provides a default factory object with the same surfaces.

```ts
export {
  ArticleSchema,
  ArticleActions,
  ArticleStore,
  columns,
  events,
  listen,
  admin
};
```

This example shows the model-level package surface. A developer can inspect this file to learn which generated surfaces exist before importing or wiring them elsewhere.

## 334.4. Package Export Map

The generated `package.json` includes an `exports` map and `typesVersions` map. The exports map exposes root files, model folders, columns, events, admin pages, admin views, and tools.

```json
{
  "exports": {
    ".": "./index.js",
    "./Article": "./Article/index.js",
    "./Article/events": "./Article/events/index.js",
    "./Article/admin/routes": "./Article/admin/routes.js",
    "./tools": "./tools.js"
  }
}
```

This shortened example explains why package output matters. Generating `Article/index.ts` is not enough if the package map does not expose the path that runtime code or debugging code needs.

## 334.5. Mistakes To Avoid

Client output looks like a package, but it is still generated evidence. Inspect
it to understand exports and loading behavior, then fix the source that
produced the package.

### 334.5.1. Patch `client-source` As Source

```ts
// client-source/index.ts
export { default as Article } from './Article/index.js';
```

This may add the export you wanted today, but it does not fix the generation
rule that writes the client package. If generated package output is wrong, fix
`schema.idea`, config, or the generator that produced it.

### 334.5.2. Assume Existing Files Are Importable

```ts
import search from './client-source/Article/admin/pages/search.js';
```

The file may exist, but runtime code that imports through the generated package
surface depends on `package.json` exports. Check the export map before treating
an import failure as a missing-file problem.

### 334.5.3. Inspect One Model Folder Only

```text
client-source/Article/index.ts
client-source/index.ts
client-source/package.json
```

The model folder can be correct while the root client package is missing the
model or export path. Inspect the model file, root `index.ts`, and package
exports together when runtime loading is the problem.

**Learning checkpoint:** Before moving on, make sure you can explain what the generated client package exports, how a model folder exposes its schema/store/actions/events/admin surfaces, and why package exports are part of generated-output verification.

**Next course:** Continue with `Idea Plugin Authoring`. That course explains how advanced generator plugins can create or patch generated TypeScript output.
