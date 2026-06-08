# 341 ts-morph Plugins

Generate or modify TypeScript safely inside a Stackpress idea generator.
`ts-morph` lets a generator work with TypeScript source files as code
structure instead of assembling large files through fragile strings.

**Previously:** The previous course, `Idea Plugin Authoring`, explained when
generator work is appropriate and how a plugin registers its `transform/`
folder. This page focuses on the TypeScript editing tool used after the
transform has a generated client directory to write into.

## 341.1. Why String-Building Gets Fragile

Generated TypeScript usually needs imports, exports, functions, constants,
types, classes, and sometimes package export updates. Building all of that with
long strings makes formatting, duplicate imports, syntax mistakes, and repeated
generation harder to control.

`ts-morph` gives the generator a structured way to create and patch files. It
can still accept statement strings for function bodies, but imports, exports,
classes, variables, types, and interfaces can be added as source-file
structures.

> NOTICE: Idea has no official relationship with `ts-morph`. Stackpress uses
> it because it is practical for generator work, not because it is required by
> the Idea language itself.

## 341.2. The Common Mindset

The common Stackpress pattern is to get or create a source file, inspect
existing imports or exports, add declarations if missing, and patch text only
when structure helpers are not enough. That order matters because repeated
generation should not keep adding the same import, export, or function every
time the command runs.

```ts
import { loadProjectFile } from 'stackpress-schema/transform/helpers';

const source = loadProjectFile(directory, 'index.ts');
const hasImport = source.getImportDeclaration(
  declaration => declaration.getModuleSpecifierValue() === './tools.js'
);

if (!hasImport) {
  source.addImportDeclaration({
    defaultImport: 'tools',
    moduleSpecifier: './tools.js'
  });
}
```

This example patches a generated `index.ts` file without blindly rewriting it.
The generator first checks whether `./tools.js` is already imported, then adds
the import only when it is missing.

When a file belongs completely to your generator, full rewrite is reasonable.
When a file is shared by several generated features, patch only the piece you
own.

## 341.3. Creating And Rewriting Files

When a file is fully owned by the generator, it is reasonable to clear and
regenerate it. The `stackpress-ai` transform uses this pattern for generated
tool files and registries.

```ts
import { loadProjectFile } from 'stackpress-schema/transform/helpers';
const filepath = model.name.toPathName('%s/tools/index.ts');
const source = loadProjectFile(directory, filepath);
source.replaceWithText('');

source.addExportDeclaration({
  namedExports: [ 'create', 'detail', 'search', 'update' ]
});
```

This example shows the full-rewrite case. Because the generator owns the
per-model tools index, it can clear the previous output and rebuild the export
surface deterministically.

For a completely new file outside the Stackpress helper path, `ts-morph` can
also create a source file from a `Project`:

```ts
import { Project } from 'ts-morph';

const project = new Project();
const source = project.createSourceFile('newFile.ts', null, {
  overwrite: true
});
```

This example is useful for understanding the underlying `ts-morph` shape. In a
Stackpress transform, prefer `props.directory` and local helper functions
because Stackpress already resolved the generated client package directory for
the current generation run.

## 341.4. Adding Imports

Imports are one of the first places string-building creates duplicate output.
Use `addImportDeclaration()` for value imports, type imports, and default
imports.

```ts
source.addImportDeclaration({
  moduleSpecifier: 'react',
  namedImports: [ 'useState', 'useEffect' ]
});
```

This example generates a named value import from `react`. It is the structured
version of writing `import { useState, useEffect } from 'react';` by hand.

Type imports use the same method with `isTypeOnly`:

```ts
source.addImportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: 'stackpress/server',
  namedImports: [ 'Server', 'Request', 'Response' ]
});
```

This example generates an `import type` statement. Use this when the generated
file only needs TypeScript types and should not add runtime imports.

Default imports use `defaultImport`:

```ts
source.addImportDeclaration({
  moduleSpecifier: 'react',
  defaultImport: 'React'
});
```

This creates a default import. In generator code, combine this with
`getImportDeclaration()` when the target file might already have the import.

## 341.5. Adding Functions And Statements

Generated code often needs a stable function that runtime code can call later.
The `stackpress-ai` generator creates `listen()` functions that register
generated tool handlers with an emitter.

```ts
source.addFunction({
  isExported: true,
  name: 'listen',
  parameters: [{
    name: 'emitter',
    type: 'Record<string, any> & { on: (event: string, listener: Function) => any }'
  }],
  statements: 'return;'
});
```

This example creates a real exported function instead of pasting a whole
function string into a file. The body is shortened for teaching, but the shape
shows how a generator can define an importable runtime surface.

Statements can still be strings when the function body is easier to express as
code. `ts-morph` will place the statements inside the generated function and
you can still run a formatter afterward.

```ts
source.addFunction({
  isExported: true,
  name: 'CreateHead',
  statements: `
    const { _ } = useLanguage();
    return (
      <HTMLHead>
        <title>{_('Create ${model.singular}')}</title>
      </HTMLHead>
    );`
});
```

This example is common in view-oriented generators. The function declaration is
structured, while the JSX body stays readable as statement code.

## 341.6. Adding Constants, Objects, And Types

Generator output often needs exported constants or registries. Use
`addVariableStatement()` when the generated file should export a value.

```ts
import { VariableDeclarationKind } from 'ts-morph';

source.addVariableStatement({
  isExported: true,
  declarationKind: VariableDeclarationKind.Const,
  declarations: [{
    name: 'config',
    initializer: JSON.stringify(tool, null, 2)
  }]
});
```

This example generates an exported constant. The initializer can be a string of
TypeScript code, so use `JSON.stringify(...)` only when the value should be a
plain serializable object.

When a file should re-export existing values, use `addExportDeclaration()`:

```ts
source.addExportDeclaration({
  namedExports: [ 'ComponentA', 'ComponentB', 'ComponentC' ]
});
```

This generates an export declaration without creating new variables first. It
is useful for index files that collect generated components, tools, or helper
modules.

Types use `addTypeAlias()` or `addInterface()`:

```ts
source.addTypeAlias({
  name: 'ToolConfig',
  isExported: true,
  type: '{ name: string; event: string }'
});

source.addInterface({
  name: 'ToolRegistry',
  isExported: true,
  properties: [
    { name: 'listen', type: '(emitter: unknown) => void' }
  ]
});
```

This example gives generated runtime surfaces names that other files can
import. Use type aliases for compact shapes and interfaces when the generated
surface is object-like and easier to read as named properties.

## 341.7. Adding Classes

Some generators produce classes instead of plain functions. `addClass()` gives
the file a class declaration, and class methods can be added with
`addMethod()`.

```ts
const schemaClass = source.addClass({
  name: 'ArticleSchema',
  isDefaultExport: true
});

schemaClass.addMethod({
  name: 'fields',
  returnType: 'string[]',
  statements: "return [ 'id', 'title', 'status' ];"
});
```

This example creates a default-exported class with one method. Use
`isExported` for named exports and `isDefaultExport` when the generated file's
main value should be the default import.

## 341.8. Patching Package Exports

Generated files are only useful to runtime code if they can be imported.
Stackpress generators commonly patch generated package metadata so the new
files are exposed intentionally.

```ts
import {
  loadPackageJsonNest,
  savePackageJsonNest
} from 'stackpress-schema/transform/helpers';

const packageJson = loadPackageJsonNest(directory.getPath());
packageJson.set('exports', './tools', './tools.js');
packageJson.set('typesVersions', '*', './tools', [ './tools.d.ts' ]);
savePackageJsonNest(directory.getPath(), packageJson);
```

This example updates the generated package surface. The important point is that
generating `tools.ts` is not enough; the package must also expose `./tools` and
its type output so runtime or debugging code can import it.

## 341.9. Mistakes To Avoid

`ts-morph` is useful because it lets generation behave repeatably. The most
common mistakes are the ones that make the next generation run add duplicates,
erase shared output, or mix runtime work into transform code.

### 341.9.1. Paste Imports As Raw Strings

```ts
source.insertText(0, "import tools from './tools.js';\n");
```

This can duplicate the import every time generation runs, and it can drift from
the file's formatting. Use `getImportDeclaration()` plus
`addImportDeclaration()` when the generator can express the change as
TypeScript structure.

### 341.9.2. Fully Rewrite Shared Files

```ts
const source = loadProjectFile(directory, 'index.ts');
source.replaceWithText('');
```

This is safe only when the generator fully owns the file. Root files such as
`index.ts` are often shared package surfaces, so patching one import or export
is safer than erasing work produced by another generator.

### 341.9.3. Register Runtime Listeners In The Transform

```ts
ctx.on('listen', () => {
  generated.tools.listen(ctx);
});
```

This belongs in runtime plugin code, not transform code. The transform should
generate files during `stackpress generate`; runtime should later load the
generated client surface and call the generated listener or registry.

## 341.10. How To Verify It

Run the generation command for the project config you are testing, then inspect
the generated files. The smallest useful proof is that the expected file
exists, the imports and exports are not duplicated, and the generated package
exposes the entrypoint runtime code needs.

If the generated behavior is missing at runtime, inspect both sides. Generation
may have written the file correctly while runtime imports a different client
package, skips the generated registry, or cannot see the package export.

**Learning checkpoint:** Before moving on, make sure you can explain why `ts-morph` is safer than string-building for generated TypeScript. You should also know when to fully rewrite a generated file and when to patch an existing one.

**Next course:** Continue with `Custom Generators`. That course puts the transform entry, schema helper, output directory, package exports, and runtime reconnection into one workflow.
