# Feature Specification: Stackpress Desktop Application Target

**Feature Branch**: `001-desktop-app-target`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Create Stackpress Desktop, a first-class desktop
application target for existing Stackpress apps."

## Clarifications

### Session 2026-06-15

- Q: Should the first milestone support only trailing path group wildcards such
  as `/admin/**`, or should it support additional wildcard forms? → A: Support
  only trailing path group wildcards.
- Q: What packaging result counts as acceptable for the first milestone? → A:
  An unsigned current-platform app package or equivalent current-platform
  package artifact is acceptable if its output location and usability limits are
  clear.
- Q: What update-related behavior must be visible in the first milestone if
  provider setup is excluded? → A: Show a disabled update placeholder in the
  desktop menu and reserve app-defined update events for later provider wiring.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Existing App as Desktop App (Priority: P1)

A Stackpress app author can configure an existing app for desktop use, start a
desktop development session, and see the app open in a desktop window at the
configured starting route. Existing allowed app behavior continues to work in
the desktop session without requiring a desktop-only rewrite.

**Why this priority**: This proves the core value of Stackpress Desktop: app
authors can reuse an existing app and validate it as a desktop experience.

**Independent Test**: Configure the example blog app for desktop use, start a
desktop development session, confirm the configured starting page opens in a
desktop window, and verify public pages, allowed service behavior, sessions,
local data, and generated views continue to work.

**Acceptance Scenarios**:

1. **Given** an existing Stackpress app with desktop settings, **When** the app
   author starts a desktop development session, **Then** the app opens in a
   desktop window at the configured starting route.
2. **Given** the desktop window is open, **When** the author navigates to an
   allowed route, **Then** the route behaves the same as it does in the normal
   app experience.
3. **Given** a desktop session is running, **When** the author closes the app,
   **Then** local desktop resources shut down cleanly.

---

### User Story 2 - Control Desktop Route Availability (Priority: P2)

A Stackpress app author can choose which app routes are available in a desktop
target. If no restrictions are configured, all registered routes are available.
If restrictions are configured, only matching routes are available and all
other routes are blocked from the desktop target.

**Why this priority**: Desktop apps often need a smaller public surface than the
normal app. Route control lets authors ship a safe desktop target without
exposing screens that should remain web-only or admin-only.

**Independent Test**: Verify the example blog app in three configurations:
allow-all by default, exact route allowlist, and wildcard route allowlist.
Confirm blocked routes are excluded from desktop-ready output and cannot be
opened while the desktop app is running.

**Acceptance Scenarios**:

1. **Given** no route restrictions are configured, **When** the author builds
   or runs the desktop target, **Then** all registered routes are available.
2. **Given** route restrictions are configured, **When** a route matches an
   allowed exact path or wildcard path group, **Then** that route is available
   in the desktop target.
3. **Given** route restrictions are configured, **When** a route does not match
   any allowed rule, **Then** that route is blocked with a clear, safe result.
4. **Given** admin screens are not allowlisted, **When** the author verifies the
   public desktop build, **Then** admin screens are unavailable.

---

### User Story 3 - Build and Package Desktop Output (Priority: P3)

A Stackpress app author can produce desktop-ready output for an existing app and
package it for the current operating system. The build output includes required
app metadata, desktop route information, starting window behavior, and the
files needed for packaging.

**Why this priority**: A desktop target is not useful unless authors can move
from local validation to distributable output.

**Independent Test**: Build desktop-ready output for the example blog app,
confirm the output location and desktop metadata summary are present, then run
packaging for the current platform and confirm either a usable artifact or a
clear actionable failure.

**Acceptance Scenarios**:

1. **Given** a desktop-configured app, **When** the author builds desktop-ready
   output, **Then** the output includes required app metadata, route
   availability information, starting window behavior, and packaging inputs.
2. **Given** route restrictions exist, **When** desktop-ready output is built,
   **Then** the output reflects the allowed route surface.
3. **Given** desktop-ready output exists, **When** the author packages the app
   for the current operating system, **Then** the author receives a usable
   package artifact or a clear actionable failure.

---

### User Story 4 - Extend Desktop Behavior Through Plugins (Priority: P4)

A Stackpress plugin author can contribute desktop configuration and menu items
without replacing the full desktop setup. Contributions can target common menu
groups, appear in predictable order, and trigger app-defined desktop behavior.

**Why this priority**: Stackpress apps rely on plugin composition. Desktop
support must preserve that extension model so plugins can participate in the
desktop experience safely.

**Independent Test**: Add a local plugin contribution to the example blog app,
confirm the contribution affects desktop configuration before startup, and
confirm the contributed menu item appears in the expected group and triggers the
intended app-defined behavior.

**Acceptance Scenarios**:

1. **Given** a plugin contributes desktop configuration, **When** the desktop
   app starts, **Then** the contribution is applied before the desktop
   experience is initialized.
2. **Given** a plugin contributes a menu item, **When** the desktop menu is
   shown, **Then** the item appears in the targeted menu group in predictable
   order.
3. **Given** a contributed menu item triggers app-defined behavior, **When** the
   user selects the item, **Then** the app receives the intended desktop event
   or action.

---

### Edge Cases

- The configured starting route is missing or blocked.
- The app contains route restrictions that match no registered routes.
- A blocked route is opened directly instead of through normal navigation.
- Desktop-ready output exists but is stale compared with the current app
  settings.
- Required app metadata is missing or invalid.
- Packaging cannot complete on the current operating system.
- A plugin contributes duplicate or conflicting menu items.
- A plugin contributes desktop configuration too late to affect startup.
- A local data path differs from the development path.
- External navigation is attempted from inside the desktop app.
- Update-related menu behavior is enabled even though full provider setup is
  outside the first milestone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: App authors MUST be able to mark an existing Stackpress app as
  desktop-capable without rewriting the app into a separate desktop-only
  frontend.
- **FR-002**: App authors MUST be able to configure the desktop app name,
  version, starting route, and initial window behavior.
- **FR-003**: App authors MUST be able to start a desktop development session
  for a configured app.
- **FR-004**: The desktop development session MUST open a desktop window at the
  configured starting route.
- **FR-005**: The desktop app MUST preserve allowed page behavior, service
  behavior, sessions, generated screens, local data access, and app plugin
  behavior from the existing Stackpress app.
- **FR-006**: The desktop app MUST shut down local desktop resources cleanly
  when the desktop app exits.
- **FR-007**: App authors MUST be able to define which routes are available in
  the desktop target.
- **FR-008**: If no route restrictions are configured, the desktop target MUST
  allow all registered routes by default.
- **FR-009**: If one or more route restrictions are configured, the desktop
  target MUST allow only matching routes.
- **FR-010**: Route restrictions MUST support exact path matches.
- **FR-011**: Route restrictions MUST support trailing path group wildcards
  only, such as `/admin/**`.
- **FR-012**: Route restrictions MUST support matching either a specific
  request method or all request methods.
- **FR-013**: Route restrictions MUST be reflected in desktop-ready build
  output.
- **FR-014**: Route restrictions MUST also be enforced while the desktop app is
  running, including navigation or direct access attempts.
- **FR-015**: Blocked routes MUST return a clear, safe result that explains the
  route is unavailable in the desktop target.
- **FR-016**: App authors MUST be able to build desktop-ready output for a
  configured app.
- **FR-017**: Desktop-ready output MUST include required app metadata, route
  availability information, starting window behavior, and packaging inputs.
- **FR-018**: Build failures MUST identify whether the problem is app
  configuration, route availability, missing metadata, or packaging
  preparation.
- **FR-019**: App authors MUST be able to package the desktop-ready output for
  the current operating system.
- **FR-020**: Packaging MUST produce either an unsigned current-platform app
  package, an equivalent current-platform package artifact, or a clear
  actionable failure with an output location or next step.
- **FR-021**: Plugin authors MUST be able to contribute desktop configuration
  before the desktop experience is initialized.
- **FR-022**: Plugin authors MUST be able to contribute desktop menu items
  without replacing the full menu.
- **FR-023**: Menu contributions MUST support common desktop menu groups such as
  app, file, edit, view, window, and help.
- **FR-024**: Menu contributions MUST appear in predictable order.
- **FR-025**: Menu items MUST be able to trigger app-defined desktop behavior.
- **FR-026**: The desktop target MUST show a disabled update placeholder in the
  desktop menu and reserve app-defined update events without requiring full
  updater provider setup in this milestone.
- **FR-027**: The desktop app MUST block unexpected external navigation by
  default.
- **FR-028**: Allowed external links MUST open outside the desktop app.
- **FR-029**: Desktop-native capabilities MUST be exposed only through explicit
  app-controlled paths.
- **FR-030**: Desktop-specific local data paths MUST be supported without
  changing normal non-desktop app behavior.
- **FR-031**: The bundled blog example MUST be configurable and verifiable as a
  working desktop app.
- **FR-032**: The bundled blog example MUST prove public pages, allowed service
  behavior, sessions, local data, generated screens, route exclusion, and plugin
  menu contribution.

### Key Entities *(include if feature involves data)*

- **Desktop App Configuration**: Defines the desktop app's identity, starting
  route, window behavior, route availability, security expectations, local data
  behavior, menu behavior, update placeholders, build output, and packaging
  expectations.
- **Desktop Route Rule**: Represents one route availability rule with a path
  pattern and method scope. Rules determine whether routes are available in the
  desktop target.
- **Desktop Build Output**: Represents desktop-ready app output, including app
  metadata, allowed route information, starting behavior, output summary,
  and packaging inputs.
- **Desktop Package Artifact**: Represents the packaged app output for the
  current operating system.
- **Desktop Menu Contribution**: Represents a menu item contributed by the app
  or a plugin, including target group, order, label, and intended app-defined
  behavior.
- **Desktop Plugin Contribution**: Represents configuration or menu behavior
  contributed before the desktop experience is initialized.
- **Example Blog App Proof**: Represents the acceptance fixture used to prove
  the first milestone end to end.

## Constitution Alignment *(mandatory)*

- **Runtime evidence**: The feature is validated through real desktop sessions,
  desktop-ready build output, route filtering behavior, packaging attempts, and
  the example blog app proof.
- **Maintainability**: The existing app remains the source of truth for routes,
  views, sessions, local data, and plugin behavior. New desktop behavior is
  required to preserve clear ownership between app authors, plugin authors, and
  desktop target configuration.
- **Verification expectation**: Completion requires independent verification of
  desktop development, route filtering, build output, packaging, plugin menu
  contribution, local data behavior, security-sensitive navigation behavior,
  and documentation or example consistency.
- **User experience consistency**: App authors must receive predictable commands
  and clear failures. Desktop users must see allowed app behavior in a desktop
  window, receive safe blocked-route results, and use consistent menu behavior.
- **Performance and simplicity**: The first milestone proves one desktop
  operating mode, current-platform packaging, and route filtering before
  broader operating-mode, updater, signing, notarization, or multi-platform
  packaging work.

### Implementation Evidence Recheck

The completed Phase 7 evidence remains aligned with the constitution:
`stackpress-desktop` tests cover contracts, runtime guards, menu/plugin
behavior, security-sensitive navigation, desktop local data paths, packaging,
and clear error messages; the blog fixture has generated client/server output,
local database preparation, desktop-ready build output, and current-platform
package output; and docs record the app-author workflow and first-milestone
limits.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A Stackpress app author can start a desktop development session
  for the example blog app in under 5 minutes after setup.
- **SC-002**: The example blog app opens in a desktop window and displays the
  configured starting page on the first attempt.
- **SC-003**: At least three route-filtering cases are verified: allow-all by
  default, exact route allowlist, and wildcard route allowlist.
- **SC-004**: A blocked route is prevented both from desktop-ready output and
  from access while the desktop app is running in 100% of tested blocked-route
  cases.
- **SC-005**: Public blog pages, allowed service behavior, sessions, local data,
  generated screens, and plugin menu contribution are all verified in the
  example blog app.
- **SC-006**: App authors can produce desktop-ready build output with route
  availability information and a clear output location.
- **SC-007**: App authors can package the current-platform desktop output and
  receive either an unsigned app package, an equivalent package artifact, or a
  clear actionable failure.
- **SC-008**: 90% of first-time app authors following the desktop workflow can
  identify the development, build, and package actions without reading internal
  implementation details.
- **SC-009**: User-facing failures explain the problem and next action without
  exposing internal stack details as the only guidance.

## Assumptions

- The first milestone proves one desktop operating mode and reserves future
  desktop operating options without implementing them.
- The existing app remains the source of truth for routes, views, sessions,
  service behavior, plugins, and local data behavior.
- Route filtering is the first mechanism for limiting the desktop app surface.
- Plugin exclusion, full updater provider configuration, signing,
  notarization, crash reporting, alternate desktop operating modes, and full
  cross-platform packaging parity are future features.
- The example blog app is the acceptance proof for the first milestone.
- Packaging for the current operating system is sufficient for this first
  milestone.
