# Detailed Evidence: `@stackpress/idea`

Owner: [Research Ledger: idea](research-idea.md).

Load when: Verifying Idea syntax, compilation, merge rules, plugin execution,
language-tooling behavior, or Stackpress generator discovery.

Skip when: The synthesized patterns and topic candidates in the owner ledger are
enough for the current task.

## Repository And Public Packages

- Workspace roles: `../idea/AGENTS.md`; root `package.json`; root `README.md`.
- Parser package and granular exports: `../idea/packages/idea-parser/package.json`.
- Transformer package and exports: `../idea/packages/idea-transformer/package.json`.
- Aggregate CLI package: `../idea/packages/idea/package.json` and
  `src/index.ts:1-57`.
- Working plugin example: `../idea/example/my.idea:1-54` and
  `../idea/example/src/make-enums.ts:1-89`.
- VS Code surface: `../idea/language/package.json`.

## Trace A: Source To Schema

1. `SchemaTree` composes declaration-specific trees over one lexer. Evidence:
   `../idea/packages/idea-parser/src/trees/SchemaTree.ts:21-98`.
2. Lexer definitions are ordered reader functions; tokens retain start/end
   positions and parsing failures carry positions. Evidence:
   `../idea/packages/idea-parser/src/Lexer.ts:6-183` and `src/definitions.ts`.
3. Type/model trees encode columns and attributes; `?`, `[]`, and `!` are
   normalized into required, multiple, and mutable properties. Evidence:
   `../idea/packages/idea-parser/src/trees/TypeTree.ts:14-280` and
   `ModelTree.ts:13-139`.
4. Compiler converts AST objects into schema config and columns into ordered
   arrays. Evidence: `../idea/packages/idea-parser/src/Compiler.ts:25-308`.
5. `parse()` returns schema config; `final()` resolves references and removes
   `use` and `prop`. Evidence: `../idea/packages/idea-parser/src/index.ts:55-60`;
   `Compiler.ts:65-86`.
6. Parser tests compare AST and compiled fixtures. Evidence:
   `../idea/packages/idea-parser/tests/Schema.test.ts:30-54` and fixture files.

## Trace B: Composition

1. Transformer reads `.idea` or JSON and caches the result. Evidence:
   `../idea/packages/idea-transformer/src/Transformer.ts:10-57`, `:123-130`.
2. Recursive `use` entries resolve through the injected `FileLoader`. Evidence:
   `../idea/packages/idea-transformer/src/Transformer.ts:58-72`.
3. Props/enums merge with local precedence. Models/types use mutability-aware
   merge rules. Evidence: `Transformer.ts:73-120`, `:170-214`.
4. `!` sets `mutable: false` on local model/type declarations. Evidence:
   `../idea/packages/idea-parser/src/trees/TypeTree.ts:186-279` and
   `ModelTree.ts:36-129`.
5. Transformer tests assert imported sections, column order, local attribute
   precedence, and final replacement. Evidence:
   `../idea/packages/idea-transformer/tests/Transformer.test.ts:15-112` and
   `tests/*.idea` fixtures.

## Trace C: Plugin Execution

1. Plugin declarations compile module name to arbitrary config. Evidence:
   `../idea/packages/idea-parser/src/Compiler.ts:147-161`.
2. Transformer requires a plugin map, resolves common JS/TS module extensions,
   imports default functions, and awaits them sequentially. Evidence:
   `../idea/packages/idea-transformer/src/Transformer.ts:132-168`.
3. Plugin props include config, full schema, transformer, cwd, and typed extras.
   Evidence: `../idea/packages/idea-transformer/src/types.ts:20-29`.
4. CLI maps `idea transform` to the transformer with default `schema.idea` and
   `--input`/`-i` overrides. Evidence:
   `../idea/packages/idea-transformer/src/Terminal.ts:10-47` and
   `../idea/packages/idea/src/bin.ts:1-9`.
5. Example plugin generates enums through ts-morph. Evidence:
   `../idea/example/src/make-enums.ts:9-89`.

## Trace D: Editor Tooling

- Extension promises highlighting, formatting, completion, definitions, and
  diagnostics. Evidence: `../idea/language/package.json` and client tests.
- Project model resolves import graphs, caches documents/symbols/diagnostics,
  classifies completion context, and resolves definitions. Evidence:
  `../idea/language/server/src/core/project.ts`.
- Attribute registry is explicitly curated for stable completion rather than
  inferred from open files. Evidence:
  `../idea/language/server/src/core/attribute-registry.ts:10-45`.
- Language tests cover diagnostics, completion, and definitions across local and
  package imports. Evidence: `../idea/language/client/src/test/*.test.ts` and
  `testFixture/`.

## Stackpress Intersection Anchors

- Generation entry: `packages/stackpress-schema/src/events/generate.ts:15-44`.
- Transformer creation and two-step discovery/execution:
  `packages/stackpress-schema/src/scripts/generate.ts:11-63`, `:96-105`.
- Schema generator registration: `packages/stackpress-schema/src/plugin.ts:14-50`.
- Additional `idea` registrations:
  `packages/stackpress-sql/src/plugin.ts`, `packages/stackpress-view/src/plugin.ts`,
  `packages/stackpress-admin/src/plugin.ts`, and `packages/stackpress-ai/src/plugin.ts`.
- Default package composition order: `packages/stackpress/src/plugin.ts:14-24`.
- Reusable package schemas: `packages/*/schema.idea`, package manifests, and
  template `schema.idea` files using package imports.

## Confidence Notes

- Grammar, representations, merges, plugin props, and execution order are source facts.
- "Semantic coordination format," "layered configuration," and "editor profile"
  are evidence-backed interpretations, not accepted founder language.
- Stackpress generator-discovery conclusions are strongly source-backed but stay
  provisional until all package transforms are traced in the final pass.

