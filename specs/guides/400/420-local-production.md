# 420 Local Production

Local production checks help you catch problems that development mode can hide.
The goal is to build the app with production-oriented config, serve it locally,
and inspect routes, assets, and data before choosing a deployment target.

**Previously:** `Client Source` showed how to inspect generated TypeScript.
Here, the focus shifts to running production-style output on your machine.

## 420.1. When To Use Local Production

Use a local production check after generation and before deployment. It is
especially useful when the change touches view rendering, assets, build output,
database access, or config split between development and production.

Development mode is built for fast feedback. Production-style checks are built
for verifying the app after build steps and production config have changed the
runtime assumptions.

## 420.2. Build

A scaffolded app has a build script:

```json
{
  "scripts": {
    "build": "stackpress build --b config/build -v"
  }
}
```

This runs the build-oriented application flow through `config/build`. Use the
package script in a scaffolded app, or run the command directly when you want
to see the exact bootstrap module.

The build config sets production mode and output paths for the view layer:

```ts
export const config: Config = {
  server: {
    ...common.server,
    mode: 'production',
    build: common.build
  },
  view: {
    ...common.view,
    engine: {
      assetPath: path.join(common.assets, 'assets'),
      clientPath: path.join(common.assets, 'client'),
      pagePath: path.join(common.cwd, '.build/views')
    }
  }
};
```

This config tells the build where to write assets, client scripts, and page
scripts. It also makes the server mode production, which changes how view
runtime behavior is wired.

## 420.3. Run Production Locally

After building, serve the app with a production-oriented bootstrap:

```bash
stackpress serve --b config/build -v
```

The CLI reference describes `serve` as the command that serves built
application output. In the server event, `serve` reads `server.host` and
`server.port`, falling back to `127.0.0.1` and `3000`.

A scaffolded app currently lists a `preview` script that points at
`config/preview`, but that file is not present in the checked scaffold:

```json
{
  "preview": "dotenv -e .env -- stackpress serve --b config/preview -v"
}
```

Do not treat that script as a confirmed working preview path until the matching
config file exists. For the current source, use `config/build` as the confirmed
production-style bootstrap.

## 420.4. Verify Routes And Assets

Start with route checks. Open the home page and one content page, then confirm
that the response renders HTML instead of only proving the server started.

Next, inspect asset paths. The build config writes assets and client scripts to
configured folders, so missing CSS, images, or client scripts usually point to
a build path, public asset, or view engine configuration issue.

Then check data access:

```bash
stackpress query "SELECT * FROM article" --b config/build -v
```

This verifies that the production-style config can still reach the configured
database. A successful build does not prove the runtime database connection is
correct.

## 420.5. Common Failures

Local production failures usually come from assuming development and production
use the same runtime assumptions. Build paths, asset serving, and database
configuration deserve their own checks.

### 420.5.1. Trust Build Success Alone

```bash
stackpress build --b config/build -v
```

Build success means the build flow completed. It does not prove that pages
render, assets load, or the database connection works after serving the app.

### 420.5.2. Serve A Missing Preview Config

```bash
stackpress serve --b config/preview -v
```

This can be valid only when `config/preview.ts` exists. In the checked scaffold
it does not, so the confirmed local production command is
`stackpress serve --b config/build -v`.

### 420.5.3. Debug Views Before Checking Assets

```text
assets
client
.build/views
```

If a production page renders without styles or client behavior, inspect the
build output paths before rewriting the React view. The problem may be a
missing emitted asset rather than a component bug.

## 420.6. Next Step

Local production is a rehearsal step. It proves that the app can run with
production-oriented config before you add provider-specific deployment rules.

**Learning checkpoint:** Before moving on, make sure you can run the build
command, serve with `config/build`, and check one rendered route, one asset
path, and one database query.

**Next course:** Continue with `Schema Changes`. That page applies the same
source-to-output discipline to database shape before provider-specific adapter
examples.
