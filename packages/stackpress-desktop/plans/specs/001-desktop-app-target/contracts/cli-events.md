# Contract: CLI Commands And Desktop Events

## CLI Commands

The package exposes three Stackpress terminal events with matching scripts:

```bash
stackpress desktop:dev --b config/desktop -v
stackpress desktop:build --b config/desktop -v
stackpress desktop:package --b config/desktop -v
```

## `desktop:dev`

Starts a desktop development session.

**Inputs**:

- Stackpress bootstrap path from `--b`.
- Desktop App Configuration from the resolved app config.

**Observable results**:

- Stackpress app bootstraps through normal lifecycle events.
- Local server listens on loopback.
- Electron opens a window at the configured starting route.
- Closing Electron shuts down local desktop resources.

## `desktop:build`

Builds desktop-ready output.

**Inputs**:

- Resolved Stackpress app config.
- Existing Stackpress build lifecycle.
- Desktop route rules and build settings.

**Observable results**:

- Existing Stackpress/Reactus build output is produced or reused through the
  normal build event.
- Desktop manifest, main entry, preload entry, and packaging inputs are
  written to the configured output directory.
- Errors identify configuration, route availability, metadata, or packaging
  preparation failures.

## `desktop:package`

Packages the current-platform desktop output.

**Inputs**:

- Desktop build output.
- Packaging config.

**Observable results**:

- An unsigned current-platform package artifact or equivalent artifact is
  produced, or a clear actionable failure is reported.
- Output location is printed.

## Desktop Lifecycle Events

- `desktop:config`: emitted before Electron uses final desktop config.
- `desktop:menu`: emitted before Electron menu compilation.
- `desktop:ready`: emitted after app, menu, and first window are ready.
- `desktop:update-check`: reserved app-defined event for later updater wiring.
- `desktop:update-available`: reserved app-defined event.
- `desktop:update-downloaded`: reserved app-defined event.

Event handlers must use the normal Stackpress plugin and event model. The first
milestone reserves updater events but does not require provider setup.
