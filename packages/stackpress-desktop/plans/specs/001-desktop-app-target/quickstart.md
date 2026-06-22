# Quickstart: Validate Stackpress Desktop

This guide validates the first milestone after implementation tasks are
complete. It uses the blog template as the acceptance fixture.

## Prerequisites

- Node.js 22.
- Yarn.
- Dependencies installed from the Stackpress monorepo root.

## 1. Build The Desktop Package

From the Stackpress monorepo root:

```bash
yarn install
yarn desktop build
```

Expected result:

- `packages/stackpress-desktop` builds CJS and ESM output.
- Public exports include `.`, `./plugin`, `./events`, `./scripts`, and
  `./types`.

## 2. Prepare The Blog Template

From the Stackpress monorepo root:

```bash
yarn blog generate
yarn blog generate:client
yarn blog push
```

Expected result:

- Blog generated output and local data are ready.
- Existing non-desktop blog commands remain unchanged.

## 3. Start Desktop Development

```bash
yarn blog desktop:dev
```

Expected result:

- Electron opens a desktop window.
- The configured starting route loads on the first attempt.
- Public blog pages, allowed services, sessions, generated screens, and local
  data behavior work through the desktop window.
- Closing the app shuts down the local desktop resources.

## 4. Verify Route Filtering

Run the blog desktop target in these configurations:

- No route rules: all registered routes are available.
- Exact route allowlist: only the configured exact routes are available.
- Wildcard route allowlist: trailing path group wildcards such as
  `/articles/**` are available.

Expected result:

- Blocked routes are absent from desktop build output when possible.
- Blocked routes cannot be opened directly while the desktop app is running.
- A blocked route returns a clear safe result.
- Admin screens are unavailable when `/admin` or `/admin/**` are not
  allowlisted.

## 5. Verify Menu And Plugin Contributions

Add a local blog plugin contribution that targets a common menu group and
triggers an app-defined event.

Expected result:

- The contribution is applied before menu compilation.
- The menu item appears in deterministic order.
- Selecting the item triggers the intended Stackpress desktop event.
- The update menu placeholder is visible but disabled when provider setup is
  not configured.

## 6. Build Desktop Output

```bash
yarn blog desktop:build
```

Expected result:

- Desktop-ready output is written under the configured build directory.
- `manifest.json` includes app metadata, starting route, route availability,
  Electron entry paths, and packaging inputs.
- Failures identify whether the problem is configuration, route availability,
  missing metadata, or packaging preparation.

## 7. Package Current Platform Output

```bash
yarn blog desktop:package
```

Expected result:

- An unsigned current-platform package artifact or equivalent artifact is
  created, or the command prints a clear actionable failure.
- The output location or next step is visible to the app author.

## 8. Regression Checks

Run package tests and template checks:

```bash
yarn desktop test
yarn blog test
```

Expected result:

- Route rule tests cover allow-all, exact matches, trailing wildcard matches,
  method matches, and default-blocked behavior.
- Manifest tests verify route availability and required metadata.
- Menu registry tests verify duplicate handling and deterministic ordering.
- Existing blog tests continue to pass.
