# 04. First Schema Generation

This tutorial introduces `schema.idea` and generation without introducing SQL yet.

## 1. Overview

In this step you will:

 - add `schema.idea`
 - define one `Article` model
 - add client config with `lang: 'ts'`
 - add `stackpress-schema` to the plugin list last
 - add a `generate` script to `package.json` last
 - run generation

The visible goal is generated schema output for the new `Article` model.

## 2. Setting Up / Coding

Create `schema.idea`:

```ts
model Article {
  id      String @id @default("cuid()")
  title   String @is.required("Title is required")
  slug    String @unique
  active  Boolean @default(true)
}
```

Expand `config.ts` so it includes the exact client generation settings:

```ts
import path from 'node:path';
import { server as http } from 'stackpress/http';

export const config = {
  client: {
    //whether to compiler client in `js` or `ts`
    lang: 'ts',
    //used by `stackpress/client` to `import()`
    //the generated client code to memory
    module: 'client-source',
    //name of the client package used in package.json
    package: 'client-source',
    //where to store the generated client code
    build: path.join(process.cwd(), 'client-source')
  },
  server: {
    mode: 'development'
  }
};

export default async function bootstrap() {
  const server = http();
  server.config.set(config);
  await server.bootstrap();
  await server.resolve('listen');
  await server.resolve('route');
  return server;
}
```

Now update `package.json` last:

```json
{
  "plugins": [
    "./plugin",
    "stackpress-server",
    "stackpress-view",
    "stackpress-schema"
  ],
  "scripts": {
    "develop": "stackpress develop --b config -v",
    "generate": "stackpress generate --b config -v"
  }
}
```

Command guide:

 - adding `stackpress-schema` to the plugin list turns on schema processing
 - `stackpress generate --b config -v` runs generation through your single `config.ts` bootstrap
 - the script is added last because you now have both the schema file and the config needed to make generation meaningful

## 3. Viewing Results

Run:

```bash
npm run generate
```

Command guide:

 - `npm run generate` asks Stackpress to read `schema.idea` and generate schema-facing output
 - at this stage you are not creating tables or populating data yet

Success means Stackpress generates schema-facing output for `Article`. At this stage, the important result is that Stackpress now knows how to produce the article column classes and the schema class from `schema.idea`.

## 4. What Was Learned

You introduced the first schema-first layer without adding persistence yet.

This step added:

 - `schema.idea` as the source of truth
 - one real model
 - schema generation through `stackpress-schema`
 - a generation script in `package.json`
 - a `client` config that writes readable TypeScript into `client-source`

The app is still not storing data, but it now has a generated schema model to build on.
