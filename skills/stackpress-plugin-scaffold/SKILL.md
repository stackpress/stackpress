---
name: stackpress-plugin-scaffold
description: Scaffold or extend a Stackpress plugin inside a Stackpress project. Use when an agent needs to create a new plugin under the project's `plugins/` folder, decide the correct plugin shape, wire `plugin.ts` lifecycle handlers (`config`, `listen`, `route`, `idea`), add browser-safe exports, contribute code generation through `transform/`, or register the plugin in the app's custom `package.json.plugins` array.
---

# Stackpress Plugin Scaffold

Scaffold Stackpress plugins using the project's normal plugin shape instead of
inventing a new structure.

## Core Workflow

1. Confirm the project root and check for a `plugins/` folder.
2. If `plugins/` does not exist, ask the user where to create the plugin.
3. Create `plugins/<plugin-name>/plugin.ts` first.
4. Add only the extra folders and files the plugin actually needs.
5. Choose the correct lifecycle hook:
   - `config` for config reads and shared service registration
   - `listen` for event listeners
   - `route` for routes and view bindings
   - `idea` for generation-time transforms
6. Keep browser-facing code browser safe.
7. Register the plugin in the app's top-level `package.json.plugins` array.
8. Add or update scripts only after the plugin files and config exist.
9. Run the smallest relevant verification commands for the plugin type.

## Default Location

- Put project-local plugins under `plugins/` at the project root.
- Treat `plugin.ts` as the only required file.

## Default Plugin Shape

Use the detailed shape guide in:

- `references/plugin-scaffold.md`

The short version is:

- `components/` for reusable React components and layouts
- `events/` for server event handlers
- `pages/` for server route handlers
- `transform/` for generation-time code emission
- `views/` for browser-served React pages
- `client.ts` for browser-safe reusable exports
- `index.ts` for reusable exports intended for other plugins
- `plugin.ts` for the Stackpress entry file
- `types.ts` for shared TypeScript types

Only create the folders the plugin really needs.

## Plugin Entry File

Start every plugin with this entry shape:

```ts
import type { Server } from 'stackpress/server';

export default function plugin(server: Server) {}
```

When the plugin needs lifecycle hooks, add them explicitly instead of mixing all
behavior together without structure.

## Generation Plugins

If the plugin contributes to generation, use `idea` and a `transform/` folder.

This skill only covers the plugin-level shape and when generation belongs in
the plugin.

Use `stackpress-plugin-idea-generator` when the task moves into:

- implementing `transform/index.ts`
- inspecting schema models in the transform
- generating client files
- patching generated package exports
- reconnecting generated artifacts back into runtime

Read the detailed shape guide in:

- `references/plugin-scaffold.md`

In particular:

- use the `idea` hook to attach the transform path into `schema.plugin[...]`
- keep generation-time logic in `transform/`
- do not move generation logic into runtime listeners if it belongs in the
  normal transform pipeline

## Browser-Safe Rule

When working in `components/`, `views/`, or `client.ts`:

- do not import server-only modules
- do not leak Node-only dependencies into browser-facing files
- keep shared browser-facing exports isolated from server runtime code

## Package Registration Rule

Stackpress uses a custom top-level `plugins` array in `package.json`.

This is not a standard npm key.

To register a local plugin:

- add the plugin entry module to `package.json.plugins`
- use a relative module path
- omit the file extension

Example:

```json
{
  "plugins": [
    "./plugins/my-plugin/plugin"
  ]
}
```

If the plugin is not in `package.json.plugins`, Stackpress will not load it.

## Verification

Choose verification based on plugin role:

- app plugin: run the dev server and test routes/views
- store plugin: test registration plus database commands when relevant
- generator plugin: run generation and inspect emitted output. Use
  `stackpress-plugin-idea-generator` for the deeper transform implementation
  and generated-output checks
- integration plugin: verify bootstrap and runtime listener registration

## Common Mistakes

- assume `plugins/` exists without checking
- create every optional folder by default
- put generation logic in runtime hooks instead of `idea`
- import server-only code into browser-facing files
- edit `package.json` before the files exist
- forget to register the plugin in `package.json.plugins`
