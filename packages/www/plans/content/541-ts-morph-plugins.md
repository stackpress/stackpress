# 541 ts-morph Plugins

Generate or modify TypeScript safely inside a Stackpress idea generator. Keep that role in mind as the lesson moves into the concrete shape.

**Previously:** The previous lesson, `534 Client Output`, gave you the setup this page builds on. Here, the focus shifts to `ts-morph Plugins` so you can place the next Stackpress surface in the course path.

## 541.1. When To Use Ts Morph

String-building TypeScript gets fragile quickly. When a generator needs imports, exports, functions, and real syntax, `ts-morph` lets the plugin edit TypeScript as code instead of text.

## 541.2. Generator Workflow

Inside a generator transform, use `ts-morph` to create or patch files:

```ts
import { Project } from 'ts-morph';

const project = new Project();
const source = project.createSourceFile('tools.ts', '', {
  overwrite: true
});

source.addExportDeclaration({
  namedExports: ['tools']
});
```

Write output to the configured generated directory. The nearby example or check shows the project detail affected by this idea.

## 541.3. Transform Source

`ts-morph` gave the generator an API for creating TypeScript structure. That is safer than assembling large files with unstructured strings.

## 541.4. Inspect Output

This part of the ts-morph Plugins workflow is easier to follow when the smaller pieces are compared together. The subsections cover Transform, Project, Export Surface, so the reader can see how each piece changes the local decision.

### 541.4.1. Transform

A transform runs during generation and writes output from schema input. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 541.4.2. Project

The `ts-morph` project manages TypeScript source files being created or edited. The local example shows why that choice matters in an app.

### 541.4.3. Export Surface

Generated files should export what runtime or client code needs to import later. Compare the concrete details to see the practical meaning.

## 541.5. Common Failures

This part of the ts-morph Plugins workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add Imports, Patch Exports, Keep Runtime Out, so the reader can see how each piece changes the local decision.

### 541.5.1. Add Imports

Use structured import declarations instead of pasting import strings. The examples stay practical by tying the idea to something you can run, change, or verify.

### 541.5.2. Patch Exports

When generating a new file, update the generated package root or index exports intentionally. That is why this detail appears in the lesson before reference material.

### 541.5.3. Keep Runtime Out

Do not register server routes or listeners inside transform code. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 541.6. Next Step

The important part is the reason behind ts-morph Plugins: it gives the app a clearer way to organize one kind of behavior. The same idea shows up through inspectable project surfaces.

Read `542 Custom Generators` for the end-to-end generator structure. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `542 Custom Generators`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
