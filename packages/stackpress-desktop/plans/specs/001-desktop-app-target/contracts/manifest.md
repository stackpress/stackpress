# Contract: Desktop Build Manifest

## Purpose

The manifest is the inspectable build artifact that connects Stackpress output
to Electron packaging.

## Default Location

`./.build/desktop/manifest.json`, unless overridden by desktop config.

## Shape

```json
{
  "schemaVersion": 1,
  "app": {
    "id": "io.stackpress.blog",
    "name": "Stackpress Blog",
    "version": "1.0.0"
  },
  "runtime": {
    "mode": "http",
    "host": "127.0.0.1",
    "open": "/"
  },
  "window": {
    "width": 1200,
    "height": 800,
    "title": "Stackpress Blog"
  },
  "routes": {
    "mode": "allow-all",
    "rules": [],
    "allowed": []
  },
  "files": {
    "main": ".build/desktop/main.js",
    "preload": ".build/desktop/preload.js",
    "assets": ".build/public"
  },
  "package": {
    "tool": "electron-builder",
    "output": ".build/releases"
  }
}
```

## Required Behavior

- `routes.mode` is `allow-all` when no rules exist and `allowlist` when one or
  more rules exist.
- `routes.allowed` reflects the desktop route surface after filtering.
- The manifest must not list blocked routes as available.
- The same route rule evaluator must be used for manifest generation and
  runtime request guarding.
- Build output must include enough file paths for `desktop:package` to run
  without rediscovering app metadata.
