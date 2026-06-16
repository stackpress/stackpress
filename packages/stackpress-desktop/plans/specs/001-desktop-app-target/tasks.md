# Tasks: Stackpress Desktop Application Target

**Input**: Design documents from `packages/stackpress-desktop/plans/specs/001-desktop-app-target/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Required. This feature changes executable behavior, public contracts, generated output, security-sensitive navigation paths, packaging behavior, and user-visible workflows.

**Organization**: Tasks are grouped by independently demonstrable user story. Shared setup and foundational tasks block story implementation; each story includes verification and implementation work needed to prove that story independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the desktop workspace package and wire it into the monorepo without implementing story behavior.

- [ ] T001 Add root workspace scripts `desktop` and `build:desktop` in `package.json` following `plan.md` Project Structure and existing package shortcuts.
- [ ] T002 Create `packages/stackpress-desktop/package.json` with CJS/ESM exports for `.`, `./plugin`, `./events`, `./scripts`, and `./types` per `plan.md` Project Structure.
- [ ] T003 [P] Create `packages/stackpress-desktop/LICENSE` and `packages/stackpress-desktop/README.md` with initial package purpose and command summary from `contracts/cli-events.md`.
- [ ] T004 [P] Create `packages/stackpress-desktop/tsconfig.json`, `packages/stackpress-desktop/tsconfig.cjs.json`, and `packages/stackpress-desktop/tsconfig.esm.json` matching neighboring package conventions in `packages/stackpress-view/`.
- [ ] T005 Create empty source barrel files `packages/stackpress-desktop/src/index.ts`, `packages/stackpress-desktop/src/events/index.ts`, and `packages/stackpress-desktop/src/scripts/index.ts` matching the export layout in `plan.md`.
- [ ] T006 Add `packages/stackpress-desktop/tests/` with package test wiring in `packages/stackpress-desktop/package.json` using the monorepo TypeScript test convention from `packages/stackpress-server/package.json`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared contracts that every story depends on: config normalization, route matching, manifest shape, plugin registration, and script/event boundaries.

**Critical**: No user story work can begin until this phase is complete.

- [ ] T007 [P] Define `DesktopConfig`, `DesktopRouteRule`, `DesktopMenuContribution`, `DesktopPlugin`, `DesktopBuildManifest`, `DesktopBuildOutput`, and `DesktopPackageArtifact` in `packages/stackpress-desktop/src/types.ts` from `contracts/config.md`, `contracts/manifest.md`, `contracts/plugin-menu.md`, and `data-model.md`.
- [ ] T008 [P] Add failing config normalization tests in `packages/stackpress-desktop/tests/config.test.ts` for defaults, required metadata, unsupported `runtime: 'protocol'`, starting-route availability, and Electron security defaults from `contracts/config.md`.
- [ ] T009 [P] Add failing route rule tests in `packages/stackpress-desktop/tests/routeRules.test.ts` for allow-all, exact path, trailing `/**` wildcard, method matching, invalid wildcard forms, and default-blocked behavior from `contracts/config.md`.
- [ ] T010 [P] Add failing manifest contract tests in `packages/stackpress-desktop/tests/manifest.test.ts` for `schemaVersion`, app metadata, runtime, window, route mode, files, packaging output, and blocked route exclusion from `contracts/manifest.md`.
- [ ] T011 [P] Add failing menu registry tests in `packages/stackpress-desktop/tests/MenuRegistry.test.ts` for group targeting, deterministic sort, duplicate ids, event items, and disabled update placeholder from `contracts/plugin-menu.md`.
- [ ] T012 Implement `normalizeDesktopConfig` and config validation in `packages/stackpress-desktop/src/config.ts` per `data-model.md` Desktop App Configuration and `contracts/config.md`.
- [ ] T013 Implement route rule parsing and matching in `packages/stackpress-desktop/src/routeRules.ts` per `data-model.md` Desktop Route Rule and `research.md` Route Filtering Uses Allowlist Rules.
- [ ] T014 Implement manifest assembly helpers in `packages/stackpress-desktop/src/manifest.ts` per `data-model.md` Desktop Build Output and `contracts/manifest.md`.
- [ ] T015 Implement deterministic menu collection in `packages/stackpress-desktop/src/MenuRegistry.ts` per `data-model.md` Desktop Menu Contribution and `contracts/plugin-menu.md`.
- [ ] T016 Implement desktop plugin registration in `packages/stackpress-desktop/src/plugin.ts` for `desktop:config`, `desktop:menu`, `desktop:ready`, reserved update events, and the `desktop` plugin value per `contracts/plugin-menu.md` and `contracts/cli-events.md`.
- [ ] T017 Export config, route, manifest, menu, plugin, and type APIs from `packages/stackpress-desktop/src/index.ts`, `packages/stackpress-desktop/src/events/index.ts`, and `packages/stackpress-desktop/src/scripts/index.ts`.
- [ ] T018 Run `yarn desktop test` and record foundational compile or expected failure notes in `packages/stackpress-desktop/README.md` against public contract files in `packages/stackpress-desktop/src/`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Run Existing App as Desktop App (Priority: P1) MVP

**Goal**: A configured Stackpress app can start a desktop development session, open Electron at the configured route, preserve allowed app behavior, and shut down local resources cleanly.

**Independent Test**: Configure `templates/blog` for desktop use, run `yarn blog desktop:dev`, confirm Electron opens the configured route, allowed pages/services/sessions/local data/generated screens work, and closing Electron shuts down local resources.

### Verification for User Story 1

- [ ] T019 [P] [US1] Add failing runtime tests in `packages/stackpress-desktop/tests/runtime.test.ts` for loopback host, ephemeral port support, configured open route, and shutdown behavior from `contracts/cli-events.md`.
- [ ] T020 [P] [US1] Add failing script/event tests in `packages/stackpress-desktop/tests/dev-event.test.ts` for `desktop:dev` bootstrap inputs and observable results from `contracts/cli-events.md`.
- [ ] T021 [P] [US1] Add blog desktop dev validation notes in `templates/blog/README.md` referencing `quickstart.md` sections 2 and 3.

### Implementation for User Story 1

- [ ] T022 [US1] Implement local HTTP runtime start and shutdown orchestration in `packages/stackpress-desktop/src/runtime.ts` per `research.md` Use Electron Local HTTP Mode First.
- [ ] T023 [US1] Implement Electron main/preload template generation in `packages/stackpress-desktop/src/scripts/main.ts` and `packages/stackpress-desktop/src/scripts/preload.ts` with `contextIsolation: true` and `nodeIntegration: false` per `research.md` Conservative Electron Security Defaults.
- [ ] T024 [US1] Implement `desktop:dev` event handler in `packages/stackpress-desktop/src/events/dev.ts` using normal Stackpress bootstrap, local server startup, Electron window open, and cleanup per `contracts/cli-events.md`.
- [ ] T025 [US1] Implement `desktop:dev` script entrypoint in `packages/stackpress-desktop/src/scripts/dev.ts` and export it from `packages/stackpress-desktop/src/scripts/index.ts`.
- [ ] T026 [US1] Add desktop config fixture in `templates/blog/config/desktop.ts` with app metadata, `runtime: 'http'`, loopback server defaults, starting route, and window settings from `contracts/config.md`.
- [ ] T027 [US1] Add `desktop:dev` script to `templates/blog/package.json` that runs `stackpress desktop:dev --b config/desktop -v` per `contracts/cli-events.md`.
- [ ] T028 [US1] Verify `yarn blog desktop:dev` follows `quickstart.md` section 3 and records any manual Electron validation limits in `packages/stackpress-desktop/README.md`.

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Control Desktop Route Availability (Priority: P2)

**Goal**: Desktop route rules allow all routes by default, allow exact and trailing wildcard matches when configured, and block all other routes at build time and runtime.

**Independent Test**: Verify the blog desktop target with allow-all, exact allowlist, and wildcard allowlist configurations; blocked routes are excluded from desktop-ready output and cannot be opened while running.

### Verification for User Story 2

- [ ] T029 [P] [US2] Extend `packages/stackpress-desktop/tests/routeRules.test.ts` with registered-route filtering cases for allow-all, exact allowlist, wildcard allowlist, method-specific rules, and no-match summaries from `data-model.md`.
- [ ] T030 [P] [US2] Add failing runtime guard tests in `packages/stackpress-desktop/tests/runtime-route-guard.test.ts` for direct blocked-route access and clear safe blocked results from `spec.md` FR-014 and FR-015.
- [ ] T031 [P] [US2] Add blog route filtering fixtures in `templates/blog/config/desktop.routes-exact.ts` and `templates/blog/config/desktop.routes-wildcard.ts` for `quickstart.md` section 4.

### Implementation for User Story 2

- [ ] T032 [US2] Implement route metadata collection and filtering integration in `packages/stackpress-desktop/src/routeRules.ts` using Ingest route metadata named in `research.md` Build Desktop Output By Composing Existing Build.
- [ ] T033 [US2] Integrate route filtering into `packages/stackpress-desktop/src/manifest.ts` so `routes.mode`, `routes.rules`, and `routes.allowed` follow `contracts/manifest.md`.
- [ ] T034 [US2] Add runtime route guard middleware or request handling in `packages/stackpress-desktop/src/runtime.ts` so direct blocked-route attempts return a clear safe result per `spec.md` FR-014 and FR-015.
- [ ] T035 [US2] Ensure configured `server.open` validation in `packages/stackpress-desktop/src/config.ts` rejects missing or blocked starting routes per `data-model.md` Desktop App Configuration.
- [ ] T036 [US2] Verify allow-all, exact allowlist, wildcard allowlist, method matching, and admin exclusion behavior with `yarn desktop test` and record results in `packages/stackpress-desktop/README.md` per `quickstart.md` section 4.

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Build and Package Desktop Output (Priority: P3)

**Goal**: A configured app can build desktop-ready output with manifest metadata and package current-platform output or receive a clear actionable failure.

**Independent Test**: Run `yarn blog desktop:build`, inspect manifest and output paths, then run `yarn blog desktop:package` and confirm artifact path or actionable failure.

### Verification for User Story 3

- [ ] T037 [P] [US3] Add failing build event tests in `packages/stackpress-desktop/tests/build-event.test.ts` for composing the existing Stackpress build lifecycle and writing manifest/main/preload/package inputs per `contracts/cli-events.md`.
- [ ] T038 [P] [US3] Add failing package event tests in `packages/stackpress-desktop/tests/package-event.test.ts` for current-platform artifact success, output location reporting, and actionable failure messages per `data-model.md` Desktop Package Artifact.
- [ ] T039 [P] [US3] Extend `packages/stackpress-desktop/tests/manifest.test.ts` to verify route availability information and packaging inputs are enough for `desktop:package` without rediscovering metadata per `contracts/manifest.md`.

### Implementation for User Story 3

- [ ] T040 [US3] Implement `desktop:build` event handler in `packages/stackpress-desktop/src/events/build.ts` that composes the existing `build` lifecycle from `packages/stackpress-view/src/events/build.ts` per `research.md`.
- [ ] T041 [US3] Implement desktop build artifact writing in `packages/stackpress-desktop/src/scripts/build.ts` for manifest, Electron main entry, preload entry, and packaging inputs per `contracts/manifest.md`.
- [ ] T042 [US3] Implement `desktop:package` event handler in `packages/stackpress-desktop/src/events/package.ts` using electron-builder as the first adapter per `research.md` Use Electron-Builder As The First Packaging Adapter.
- [ ] T043 [US3] Implement `desktop:package` script entrypoint in `packages/stackpress-desktop/src/scripts/package.ts` with output path and actionable failure reporting per `contracts/cli-events.md`.
- [ ] T044 [US3] Add `desktop:build` and `desktop:package` scripts to `templates/blog/package.json` using `stackpress desktop:build --b config/desktop -v` and `stackpress desktop:package --b config/desktop -v`.
- [ ] T045 [US3] Verify `yarn blog desktop:build` and `yarn blog desktop:package` against `quickstart.md` sections 6 and 7 and document unsigned artifact limits in `packages/stackpress-desktop/README.md`.

**Checkpoint**: User Stories 1, 2, and 3 all work independently.

---

## Phase 6: User Story 4 - Extend Desktop Behavior Through Plugins (Priority: P4)

**Goal**: App and plugin authors can contribute desktop config and menu items before desktop initialization without replacing the full desktop setup.

**Independent Test**: Add a local blog plugin menu/config contribution, confirm it affects desktop config before startup, appears in deterministic menu order, and triggers app-defined behavior.

### Verification for User Story 4

- [ ] T046 [P] [US4] Extend `packages/stackpress-desktop/tests/MenuRegistry.test.ts` with nested submenu, role, enabled state, priority tie-break, and update placeholder cases from `contracts/plugin-menu.md`.
- [ ] T047 [P] [US4] Add plugin lifecycle tests in `packages/stackpress-desktop/tests/plugin.test.ts` for `desktop:config`, `desktop:menu`, late contribution failure, and app-defined event dispatch from `data-model.md` Desktop Plugin Contribution.
- [ ] T048 [P] [US4] Add blog plugin contribution fixture in `templates/blog/plugins/app/plugin.ts` that targets a common menu group and emits an app-defined desktop event per `quickstart.md` section 5.

### Implementation for User Story 4

- [ ] T049 [US4] Finalize menu compilation from `packages/stackpress-desktop/src/MenuRegistry.ts` into Electron menu templates in `packages/stackpress-desktop/src/runtime.ts` per `contracts/plugin-menu.md`.
- [ ] T050 [US4] Implement event-backed menu item dispatch in `packages/stackpress-desktop/src/plugin.ts` so menu items with `event` trigger app-defined desktop behavior through Stackpress per `contracts/plugin-menu.md`.
- [ ] T051 [US4] Enforce contribution timing in `packages/stackpress-desktop/src/plugin.ts` so late `desktop:config` or `desktop:menu` contributions fail clearly per `data-model.md`.
- [ ] T052 [US4] Add disabled update placeholder wiring in `packages/stackpress-desktop/src/MenuRegistry.ts` and reserved update events in `packages/stackpress-desktop/src/plugin.ts` per `spec.md` FR-026.
- [ ] T053 [US4] Verify blog menu contribution behavior with `yarn blog desktop:dev` and `quickstart.md` section 5.

**Checkpoint**: User Stories 1 through 4 are independently demonstrable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Complete package integration, security hardening, docs, performance evidence, and constitution validation across all stories.

- [ ] T054 [P] Add desktop package aggregation exports to `packages/stackpress/package.json` and `packages/stackpress/src/index.ts` if needed for the public import surface described in `plan.md`.
- [ ] T055 [P] Add desktop package dependencies and devDependencies in `packages/stackpress-desktop/package.json` for Electron, electron-builder, TypeScript, and test tools with dependency rationale from `research.md`.
- [ ] T056 [P] Add external navigation tests in `packages/stackpress-desktop/tests/security.test.ts` for default blocking, allowed external open behavior, and explicit native capability exposure per `spec.md` FR-027 through FR-029.
- [ ] T057 Implement external navigation and native capability safeguards in `packages/stackpress-desktop/src/runtime.ts` and `packages/stackpress-desktop/src/scripts/preload.ts` per `research.md` Conservative Electron Security Defaults.
- [ ] T058 [P] Add local data path tests in `packages/stackpress-desktop/tests/config.test.ts` for desktop-specific local data path support without changing normal app behavior per `spec.md` FR-030.
- [ ] T059 Update `packages/stackpress-desktop/README.md` with config reference, commands, route rules, menu contribution examples, packaging limits, and troubleshooting guidance from `contracts/` and `quickstart.md`.
- [ ] T060 Update `templates/blog/README.md` with the complete desktop workflow and expected validation evidence from `quickstart.md`.
- [ ] T061 Run `yarn desktop build` and `yarn desktop test` from the repository root and resolve compile or test failures in `packages/stackpress-desktop/README.md` or `packages/stackpress-desktop/src/`.
- [ ] T062 Run `yarn blog generate`, `yarn blog generate:client`, and `yarn blog push` from the repository root and record fixture preparation notes in `templates/blog/README.md` per `quickstart.md` section 2.
- [ ] T063 Run `yarn blog desktop:dev`, `yarn blog desktop:build`, and `yarn blog desktop:package` from the repository root and record runtime, build, and packaging evidence in `packages/stackpress-desktop/README.md`.
- [ ] T064 Verify SC-001 timing by measuring the blog desktop development startup path and recording whether it completes under 5 minutes after setup in `packages/stackpress-desktop/README.md`.
- [ ] T065 Verify user-facing failures for missing metadata, blocked starting route, unsupported protocol runtime, stale output, and packaging failure expose clear next actions without stack traces as the only guidance in `packages/stackpress-desktop/tests/error-messages.test.ts`.
- [ ] T066 Confirm no unresolved placeholders, stale paths, or sample template text remain in `packages/stackpress-desktop/plans/specs/001-desktop-app-target/`, `packages/stackpress-desktop/README.md`, and `templates/blog/README.md`.
- [ ] T067 Re-check the Constitution Alignment sections in `packages/stackpress-desktop/plans/specs/001-desktop-app-target/spec.md` and `packages/stackpress-desktop/plans/specs/001-desktop-app-target/plan.md` against completed runtime evidence.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; runtime blocking integrates with US1 runtime but remains independently testable through route rule tests and route guard validation.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; build output can be implemented before full US1 runtime, but final package verification depends on US1 runtime and US2 route filtering.
- **User Story 4 (Phase 6)**: Depends on Foundational completion; menu runtime verification depends on US1 runtime.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 Run Existing App as Desktop App**: First MVP increment.
- **US2 Control Desktop Route Availability**: Can proceed after foundation; final runtime guard verification uses US1 runtime.
- **US3 Build and Package Desktop Output**: Can proceed after foundation; final manifest verification uses US2 route filtering.
- **US4 Extend Desktop Behavior Through Plugins**: Can proceed after foundation; final menu verification uses US1 runtime.

### Within Each User Story

- Verification tasks should be written first and fail before implementation when automated.
- Equivalent manual validation should be defined before implementation where Electron runtime automation is not practical.
- Contract and data model helpers should be implemented before event/script integration.
- Runtime integration should be validated before package or template documentation updates.

---

## Parallel Opportunities

- T003 and T004 can run in parallel after T002 is scoped.
- T007 through T011 can run in parallel because they touch separate foundational files.
- T019 through T021 can run in parallel for US1 verification.
- T029 through T031 can run in parallel for US2 verification.
- T037 through T039 can run in parallel for US3 verification.
- T046 through T048 can run in parallel for US4 verification.
- T054 through T058 can run in parallel during polish after relevant story files exist.

## Parallel Example: User Story 2

```bash
Task: "T029 Extend packages/stackpress-desktop/tests/routeRules.test.ts"
Task: "T030 Add packages/stackpress-desktop/tests/runtime-route-guard.test.ts"
Task: "T031 Add templates/blog/config/desktop.routes-exact.ts and templates/blog/config/desktop.routes-wildcard.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T037 Add packages/stackpress-desktop/tests/build-event.test.ts"
Task: "T038 Add packages/stackpress-desktop/tests/package-event.test.ts"
Task: "T039 Extend packages/stackpress-desktop/tests/manifest.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational contracts and helpers.
3. Complete Phase 3: User Story 1 runtime and blog desktop dev proof.
4. Stop and validate `yarn blog desktop:dev` against `quickstart.md` section 3.

### Incremental Delivery

1. Add US1 for local desktop runtime.
2. Add US2 for route filtering and blocked-route safety.
3. Add US3 for build/package output.
4. Add US4 for plugin and menu contributions.
5. Complete Phase 7 for security, docs, performance, and constitution evidence.

### Validation Commands

```bash
yarn desktop build
yarn desktop test
yarn blog generate
yarn blog generate:client
yarn blog push
yarn blog desktop:dev
yarn blog desktop:build
yarn blog desktop:package
```

## Notes

- `[P]` tasks use different files and can run in parallel after their prerequisites are met.
- `[US#]` labels map each task to the corresponding user story in `spec.md`.
- Every implementation task names the target file and the design artifact that supplies its contract.
- Do not mark a story complete until its independent test and checkpoint pass.
