# 500 Project Structure

Study the project layout after you have already built routes, views, data access, and generated output. Stackpress structure is easier to respect when each folder answers a problem you have already seen.

**Previously:** The previous course, `Lambda / Serverless`, showed that runtime entrypoints and deployment adapters need clear boundaries. This course brings that same boundary thinking back into the local project folder.

## 500.1. Why Structure Comes Later

Folder rules can feel arbitrary when they appear before the reader has built anything. By this point, the runtime, data, build, and deployment lessons have shown why source files, generated files, public assets, and config need different homes.

This level turns those experiences into a project map. The goal is not to memorize folder names; the goal is to know where a change belongs before editing the first file you find.

## 500.2. The First Project Map

The Stackpress scaffold skill describes a baseline app with a small set of source files and folders. It includes `package.json`, `schema.idea`, `tsconfig.json`, `uno.config.ts`, `.env.sample`, `config/*`, and `plugins/*`.

```txt
my-app/
  .env.sample
  .gitignore
  package.json
  schema.idea
  tsconfig.json
  uno.config.ts
  config/
    common.ts
    develop.ts
    build.ts
    client.ts
  plugins/
    app/
      plugin.ts
    store/
      connect.ts
      plugin.ts
      populate.ts
```

This map is intentionally small. It gives the app a place for configuration, plugin behavior, database connection work, generated-input declarations, and tooling setup without forcing every future folder to exist on day one.

## 500.3. What This Level Covers

`510 Project Anatomy` explains the baseline scaffold shape and what each major file owns. It is the first lesson in the course that recommends a concrete Stackpress project structure.

`520 Config` explains how configuration bootstraps the app and organizes runtime choices. The remaining structure pages continue through plugin layout and public assets, so the reader can connect the scaffold map to the files they are most likely to edit.

## 500.4. Source And Generated Boundaries

The most important structure rule is the boundary between source and generated output. Source files express intent, while generated files prove what Stackpress produced from that intent.

When output looks wrong, trace it back to the source. That source-first habit keeps rebuilds predictable and prevents temporary edits from becoming invisible bugs.

## 500.5. How To Use This Level

Read this level when a project starts to feel crowded. The pages help you decide whether a change belongs in schema, config, plugins, views, public assets, generated output, or deployment configuration.

You can also use it as an inspection guide during debugging. If you know which folder owns a concern, you can narrow the search before opening unrelated files.

**Learning checkpoint:** Before moving on, make sure you can describe why Stackpress separates source input, handwritten runtime code, generated output, static assets, and operational config. You should also know why generated files are inspected differently from source files.

**Next course:** Continue with `Project Anatomy`. That course explains the scaffolded project map in more detail.
