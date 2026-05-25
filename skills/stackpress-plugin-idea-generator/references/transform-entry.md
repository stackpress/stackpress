# Transform Entry Reference

This reference focuses on the `transform/` side of a Stackpress generation
plugin.

The `idea` hook is only the registration step. The real generator work starts
in `transform/index.ts`.

## Required File

The only required file inside `transform/` is:

```text
transform/
  index.ts
```

Everything else is optional and should be added only when the generator needs
more structure.

## Purpose Of `transform/index.ts`

`transform/index.ts` is the entrypoint Stackpress will call during
`stackpress generate` after the plugin has registered its transform path.

This file usually does four things:

 - rebuild the schema helper from the raw schema payload
 - get the generated client directory
 - call feature-specific generator helpers
 - patch the generated package surface if new entrypoints were added

## Standard Entry Pattern

The simplest useful shape looks like this:

```ts
import type { ClientPluginProps } from 'stackpress/schema/types';
import { Schema } from 'stackpress/schema';

export default async function generate(props: ClientPluginProps) {
  const schema = Schema.make(props.schema);
  const directory = props.directory;
}
```

This is the main transform boundary to remember:

 - `Schema.make(props.schema)` gives you a usable schema helper
 - `props.directory` gives you the generated client directory

Once those two are available, the rest of the generator is mostly file
creation, file patching, and model iteration. When those files are TypeScript,
use `ts-morph` as the default editing tool.

## Accessing The Schema

Use this pattern:

```ts
const schema = Schema.make(props.schema);
```

Why:

 - `props.schema` is the raw generation payload
 - `Schema.make(...)` reconstructs the higher-level helper API
 - the helper gives you access to models and their metadata in a way that is
   much easier to work with than the raw payload

Typical follow-up usage:

```ts
for (const model of schema.models.values()) {
  // generate per-model files
}
```

## Accessing The Client Directory

Use this pattern:

```ts
const directory = props.directory;
```

Why:

 - Stackpress already resolved the client output directory for the current
   generation run
 - `directory` is a `ts-morph` `Directory`, so it can be used directly by
   helper functions that load or create source files

Treat `directory` as the root of the generated client package you are editing.

## Common Entry Responsibilities

`transform/index.ts` usually coordinates helpers instead of holding every line
of generation logic itself.

Typical flow:

```ts
import type { ClientPluginProps } from 'stackpress-schema/types';
import Schema from 'stackpress-schema/Schema';
import generatePackage from './package.js';
import generateFeature from './feature.js';

export default async function generate(props: ClientPluginProps) {
  const schema = Schema.make(props.schema);
  const directory = props.directory;

  generateFeature(directory, schema);
  generatePackage(directory, schema);
}
```

Good helper boundaries:

 - one helper for per-model files
 - one helper for root registries
 - one helper for package export patching

Do not let `transform/index.ts` turn into one giant file unless the generator
is truly tiny.

## Patching Existing Generated Files

Generators often need to extend files that already exist in the generated
client package.

A common example is patching the root `index.ts`:

```ts
import { loadProjectFile } from 'stackpress-schema/transform/helpers';

const source = loadProjectFile(directory, 'index.ts');
```

From there, the generator can:

 - inspect imports
 - add imports if missing
 - inspect exports
 - add exports if missing

This is safer than rewriting the entire file when only one new entrypoint needs
to be exposed.

## When To Split Helpers

Split the transform into helper files when:

 - you generate multiple file categories
 - you generate per-model output
 - you patch `package.json`
 - you patch root registries
 - you need separate logic for multiple operations or file families

Good examples in this repo include patterns from:

 - `packages/stackpress-sql/src/transform/events`
 - `packages/stackpress-admin/src/transform/pages`
 - `packages/stackpress-ai/src/transform`

## What Not To Put Here

Avoid these in `transform/index.ts`:

 - runtime event registration
 - request/response logic
 - server transport logic
 - logic that belongs in `listen`, `route`, or `config`

Keep the transform focused on generated artifacts.

## Generation Command Reminder

Transforms run through the normal Stackpress generation command:

```bash
npx stackpress generate --b [config/file] -v
```

The config used by `--b` needs to include client generation settings if the
transform is expected to write generated client output.

This reference does not define the full client config shape. It only assumes:

 - the project has a config file intended for generation
 - that config exposes a valid client output location
 - the transform writes into the directory Stackpress passes through
   `props.directory`
