# Implementation Plan: Stackpress Desktop Application Target

**Branch**: `001-desktop-app-target` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `packages/stackpress-desktop/plans/specs/001-desktop-app-target/spec.md`

**Note**: This plan is grounded in the feature spec, the project constitution,
and the existing Stackpress desktop proposal in
`packages/stackpress-desktop/plans/README.md`.

## Summary

Create `stackpress-desktop` as a first-class desktop application target for
existing Stackpress apps. The first milestone uses Electron in local HTTP mode:
Electron owns the native shell, window, menus, lifecycle, preload boundary, and
current-platform packaging, while Stackpress remains the owner of routing,
events, page/API handlers, sessions, generated views, local data behavior, and
plugins. The initial implementation is split into narrow phases: package
skeleton, local HTTP runtime, build manifest composition, route filtering,
menu/plugin contributions, blog template proof, and current-platform packaging.

## Technical Context

**Language/Version**: TypeScript 5.9.x on Node.js 22, matching the Stackpress
package conventions visible in `packages/*`.

**Primary Dependencies**: Stackpress/Ingest plugin and terminal lifecycle,
`stackpress-server`, `stackpress-view`, Reactus/Vite build output, Electron for
the desktop shell, and electron-builder as the first current-platform packaging
adapter.

**Storage**: Existing Stackpress app storage remains app-owned. Desktop mode
adds explicit local data path resolution so packaged apps can use desktop-safe
runtime paths without changing normal non-desktop app behavior.

**Testing**: Package-level TypeScript tests following existing Stackpress
package patterns, route matcher/manifest contract tests, menu registry tests,
blog template end-to-end smoke checks, and manual or automated Electron
runtime verification for window startup, blocked routes, external navigation,
shutdown, and packaging output.

**Target Platform**: Desktop apps for the current developer operating system in
the first milestone, with package outputs limited to unsigned current-platform
artifacts or clear actionable failures.

**Project Type**: TypeScript framework package plus CLI events, Electron
runtime adapter, build/packaging artifact generator, and blog template proof.

**Performance Goals**: A configured app author can start the blog desktop
development session in under 5 minutes after setup; the configured route opens
on the first attempt; route allow/deny checks run deterministically without
network access beyond the loopback server; packaging reports an artifact
location or actionable failure without leaving ambiguous partial output.

**Constraints**: First runtime is local HTTP on `127.0.0.1` with an ephemeral
port by default; custom protocol runtime, signing, notarization, full updater
provider setup, crash reporting, plugin exclusion, and cross-platform parity
are reserved for later work. Electron renderer defaults must keep
`contextIsolation` enabled and `nodeIntegration` disabled.

**Scale/Scope**: One new active workspace package under
`packages/stackpress-desktop`, one blog template configuration proof, three
desktop commands, one manifest format, one route rule model, common desktop menu
groups, and current-platform packaging.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Runtime-verified architecture**: Identify the real execution behavior that
  will validate component boundaries, workflows, public interfaces, and
  generated artifacts. Document any new abstraction and the boundary it earns.
- **Status**: Pass. Runtime validation is the center of the plan: Electron
  starts a local Stackpress server, opens a BrowserWindow at the configured
  route, enforces route rules at build time and runtime, compiles menus from
  plugin contributions, shuts down local resources, and attempts
  current-platform packaging.
- **Maintainable implementation**: Replace generic template options with real
  project paths, local conventions, selected approach, ownership boundaries,
  and any unsafe shortcut or dependency that needs explicit justification.
- **Status**: Pass. The implementation target is
  `packages/stackpress-desktop`, following existing package export and CJS/ESM
  build conventions. Stackpress owns app behavior; Electron owns native shell
  concerns; `stackpress-desktop` owns the adapter, manifest, route guard, and
  menu registry.
- **Behavior-first verification**: Identify required tests or equivalent
  validation for behavior, contracts, integrations, generated output,
  security-sensitive paths, user-visible workflows, and documentation/template
  consistency.
- **Status**: Pass. Verification is specified through package tests, blog
  template proof, manifest assertions, route filtering cases, external
  navigation checks, menu contribution checks, packaging output checks, and
  quickstart scenarios.
- **User experience consistency**: State how user-facing behavior will be
  checked for clear hierarchy, predictable navigation, meaningful labels,
  resilient error states, accessibility, and rendered or target-environment
  correctness when applicable.
- **Status**: Pass. App authors receive predictable `desktop:dev`,
  `desktop:build`, and `desktop:package` commands, clear blocked-route results,
  clear packaging output or failure messages, and a disabled update placeholder
  instead of hidden updater behavior.
- **Performance and simplicity budgets**: Define measurable performance goals
  or mark them not applicable. Document added complexity, operational cost,
  dependencies, and rejected simpler alternatives.
- **Status**: Pass. Electron is justified because the feature requires a native
  desktop shell. Local HTTP mode is selected over custom protocol mode because
  it preserves existing Stackpress routing and session behavior with fewer
  adapter risks. Signing, notarization, updater providers, plugin exclusion,
  and protocol mode are deliberately deferred.

### Post-Design Recheck

Phase 0 and Phase 1 artifacts preserve the gate decisions. No constitution
violations are introduced by the data model, contracts, or quickstart.

### Post-Implementation Recheck

Phase 7 evidence preserves the constitution gates: package tests cover config,
route filtering, manifest output, menu/plugin behavior, external navigation,
local data paths, packaging failures, and user-facing error messages; the blog
fixture has generated output, pushed local data, desktop build output, and
current-platform package output under `.build/releases`; and documentation now
records the desktop commands, route rules, menu contribution model, security
defaults, packaging limits, and troubleshooting path.

## Project Structure

### Documentation (this feature)

```text
packages/stackpress-desktop/plans/specs/001-desktop-app-target/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
.
├── packages/
│   ├── stackpress-desktop/
│   │   ├── LICENSE
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── plugin.ts
│   │   │   ├── MenuRegistry.ts
│   │   │   ├── routeRules.ts
│   │   │   ├── manifest.ts
│   │   │   ├── runtime.ts
│   │   │   ├── types.ts
│   │   │   ├── events/
│   │   │   │   ├── build.ts
│   │   │   │   ├── dev.ts
│   │   │   │   ├── package.ts
│   │   │   │   └── index.ts
│   │   │   └── scripts/
│   │   │       ├── build.ts
│   │   │       ├── dev.ts
│   │   │       ├── package.ts
│   │   │       ├── main.ts
│   │   │       ├── preload.ts
│   │   │       └── index.ts
│   │   ├── tests/
│   │   │   ├── routeRules.test.ts
│   │   │   ├── manifest.test.ts
│   │   │   ├── MenuRegistry.test.ts
│   │   │   └── config.test.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.cjs.json
│   │   └── tsconfig.esm.json
│   ├── stackpress/
│   │   └── package.json          # aggregate exports may add desktop paths
│   └── stackpress-view/
│       └── src/events/build.ts   # composed, not duplicated
└── templates/
    └── blog/
        ├── config/desktop.ts
        ├── package.json
        └── plugins/app/plugin.ts # desktop menu contribution proof
```

**Structure Decision**: Implement a new `stackpress-desktop` package in the
Stackpress monorepo under `packages/stackpress-desktop`. Keep the desktop
package focused on the adapter boundary and use `templates/blog` as the
acceptance fixture. Do not duplicate `stackpress-view` build internals; compose
the existing build event and add desktop artifacts afterward.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
