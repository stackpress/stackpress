# 300 Build And Deploy

Use this course to connect local development with production-ready output.
Readers should understand which commands rebuild which artifacts and how the
runtime shape changes by deployment target.

## 300 Build And Deploy

The deployment path starts before hosting. The reader needs to know how
generation, build output, database state, and runtime adapters fit together.

**Checkpoint**

The reader can build the app and identify the runtime target.

## 310 Generate And Build

The core workflow commands are:

- `generate`
- `generate:client`
- `push`
- `populate`
- `build`
- `serve`

Do not turn this page into a CLI flag list. Teach which command to run after
which kind of change.

**Course work**

- rerun generation after schema changes
- regenerate client output for inspection
- push database changes
- build the app

## 311 Generated Artifacts

Generated artifacts are useful because they are inspectable, reproducible, and
disposable.

Teach the distinction between source-of-truth files and generated output.

**Checkpoint**

The reader can delete or rebuild generated output without losing source work.

## 312 Client Source

`client_source` is generated TypeScript for inspection. It is not a folder the
developer should hand-edit.

**Course work**

- inspect generated schema, store, action, and view-facing output
- trace a generated result back to `schema.idea` or config

## 320 Local Production

Before deploying, the reader should run a production-like local build.

**Course work**

- build the app
- serve built output locally
- verify the main route and one data-backed page

## 330 Vercel

Teach the recommended Vercel shape at a high level:

- build command
- output expectations
- runtime handler shape
- environment variables

## 340 Netlify

Teach the recommended Netlify shape at a high level:

- build command
- runtime handler shape
- environment variables
- verification route

## 350 Lambda / Serverless

Serverless deployment needs clearer runtime boundaries. The reader should know
what code handles requests, what artifacts are packaged, and where environment
configuration lives.

**Checkpoint**

The reader can describe how a Stackpress app becomes a serverless handler.

## Related Reference

- CLI reference
- Config reference
- WHATWG reference
- Server reference
