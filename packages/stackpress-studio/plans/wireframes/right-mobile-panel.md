# Right Mobile Panel UI

This document describes a reusable UI pattern: a desktop page with a right-side mobile app panel for task workflows. Use this pattern when a desktop interface needs rich editing flows without interrupting the main page with popup dialogs.

## Summary

The page starts as a desktop workbench. The main page gives the user context, navigation, search, filters, and index tables. Editing happens in a right-side panel that behaves like a small mobile app attached to the page.

The shortest description is:

> The main page orients; the right mobile panel performs tasks.

This is not a standard modal. It is not a single static drawer. It is a mobile-style screen stack mounted to the right side of a desktop interface.

## When To Use It

Use a right mobile panel when:

- the user needs to keep a list or index visible while editing one item
- an edit flow has nested tasks such as field editors, pickers, confirmations, or option forms
- popup dialogs would create too much context switching
- the product is an operational tool, admin console, editor, or workflow app
- the same UI should adapt from desktop to mobile without redesigning the task flow

Avoid this pattern when:

- the page is mostly marketing content
- the task is a simple one-field confirmation
- the editor needs the full desktop canvas
- the user must compare multiple wide records side-by-side while editing

## Mental Model

Think of the interface as two apps sharing one workspace.

The desktop app is for orientation:

- navigation
- active context
- search and filters
- index tables
- global actions

The right mobile app is for action:

- create or update one resource
- move through nested screens
- choose options
- confirm decisions
- publish local changes back to the page state

The desktop page should remain understandable when the panel is open. The user should always know which list, record, or context the panel came from.

## Layout

A typical layout has these regions:

- Topbar: product identity and global actions.
- Sidebar: workspace or section navigation.
- Main area: active index, table, graph, board, or detail surface.
- Right mobile panel: task stack for creating, editing, selecting, or confirming.

The right mobile panel should have:

- fixed header
- optional tab row
- independently scrolling body
- fixed footer actions
- consistent back or close affordance

On wide screens, dock the panel to the right. On narrow screens, let it occupy the full viewport width.

## Screen Stack

The panel should be modeled as a stack of screens.

When the stack is empty:

- the panel is closed
- the main page is fully visible
- initial page load should not open the panel automatically

When a top-level task opens:

- push one screen onto the stack
- slide the panel in from the right
- keep the desktop page visible behind or beside it

When a nested task opens:

- push another screen onto the stack
- animate the new screen as moving deeper into the panel
- do not open a new browser page
- do not use a centered modal

When Back, Cancel, Save, or Done finishes a nested task:

- pop the current screen
- return to the previous screen
- preserve parent tab and scroll state when practical

When the final screen closes:

- pop the last screen
- slide the panel out
- return to the main page

## Screen Types

### Resource Screen

A resource screen creates or updates one top-level item.

Examples:

- Add User
- Update Customer
- Create Project
- Edit Workflow

Resource screens can have tabs when the resource has separate concerns.

### Nested Editor

A nested editor changes one child item inside a parent resource.

Examples:

- Update Address
- Add Rule
- Edit Permission
- Copy Record
- Remove Record

Nested editors should usually hide the parent resource tabs. They are focused mobile screens, not full pages.

### Picker Screen

A picker screen selects from a dense option set.

Examples:

- icon picker
- component picker
- validator picker
- status picker
- template picker

Pickers should open only after the related field is clicked. Do not keep large option lists permanently expanded inside the parent form.

### Sheet

A sheet is a temporary screen that slides up inside or over the panel.

Use sheets for:

- short confirmations
- temporary choices
- compact preview details
- actions that should feel lighter than pushing a full screen

Use push screens for deeper edits. Use sheets for transient decisions.

## Animation Language

Animations should explain hierarchy.

- Slide in from right: open the first task panel from the desktop page.
- Push left: move deeper into the panel stack.
- Slide right: go back to the previous panel screen.
- Slide up: open a temporary mobile sheet.
- Slide down: dismiss a temporary mobile sheet.

Keep animations fast and functional. Motion should clarify state, not decorate the UI.

## Accessibility

The panel should be accessible as a task region.

Recommended rules:

- move focus into the panel when it opens
- return focus to the triggering control when the final screen closes
- trap focus only when the panel blocks interaction with the underlying page
- keep each screen title programmatically available
- expose Back, Close, Save, Cancel, and destructive actions as real buttons
- use escape to close a sheet or pop a safe screen when appropriate
- avoid relying on animation alone to communicate state

## CSS Skeleton

This CSS is intentionally minimal. It shows the layout and stack mechanics, not a final visual design.

```css
:root {
  --panel-width: min(560px, 100vw);
  --line: #d0d0d0;
  --surface: #ffffff;
  --muted-surface: #f3f3f3;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: 52px minmax(0, 1fr);
}

.topbar {
  grid-column: 1 / -1;
  border-bottom: 1px solid var(--line);
}

.sidebar {
  border-right: 1px solid var(--line);
  overflow: auto;
}

.main {
  min-width: 0;
  overflow: auto;
}

.mobile-panel {
  position: fixed;
  top: 52px;
  right: 0;
  bottom: 0;
  width: var(--panel-width);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  background: var(--surface);
  border-left: 1px solid var(--line);
  transform: translateX(100%);
  transition: transform 180ms ease;
  z-index: 20;
}

.has-panel .mobile-panel {
  transform: translateX(0);
}

.panel-header,
.panel-tabs,
.panel-footer {
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.panel-footer {
  border-top: 1px solid var(--line);
  border-bottom: 0;
}

.panel-body {
  min-height: 0;
  overflow: auto;
}

.panel-screen {
  min-height: 100%;
}

.panel-screen.is-entering {
  animation: push-in 180ms ease both;
}

.panel-screen.is-leaving {
  animation: pop-out 180ms ease both;
}

.panel-sheet {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 70%;
  background: var(--surface);
  border-top: 1px solid var(--line);
  transform: translateY(100%);
  transition: transform 180ms ease;
  z-index: 2;
}

.panel-sheet.is-open {
  transform: translateY(0);
}

@keyframes push-in {
  from {
    opacity: 0.8;
    transform: translateX(32px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pop-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0.8;
    transform: translateX(32px);
  }
}

@media (max-width: 760px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .mobile-panel {
    top: 0;
    width: 100vw;
    border-left: 0;
  }
}
```

## JavaScript Skeleton

This example uses plain JavaScript to show the logic. A framework implementation should keep the same concepts: a screen stack, push/pop/replace operations, and screen renderers.

```js
const panel = document.querySelector('[data-panel]');
const app = document.querySelector('[data-app]');

const stack = [];

function createScreen(options) {
  return {
    id: options.id || crypto.randomUUID(),
    title: options.title,
    subtitle: options.subtitle || '',
    tabs: options.tabs || [],
    activeTab: options.activeTab || null,
    renderBody: options.renderBody,
    renderFooter: options.renderFooter || (() => ''),
    onBack: options.onBack || null
  };
}

function pushScreen(screen) {
  stack.push(screen);
  renderPanel('push');
}

function popScreen() {
  const current = stack[stack.length - 1];

  if (current && typeof current.onBack === 'function') {
    const handled = current.onBack(current);
    if (handled) return;
  }

  stack.pop();
  renderPanel('pop');
}

function replaceScreen(screen) {
  stack[stack.length - 1] = screen;
  renderPanel('replace');
}

function reloadScreen() {
  renderPanel('reload');
}

function closePanel() {
  stack.length = 0;
  renderPanel('close');
}

function renderPanel(direction) {
  const current = stack[stack.length - 1];
  app.classList.toggle('has-panel', Boolean(current));

  if (!current) {
    panel.innerHTML = '';
    return;
  }

  panel.innerHTML = `
    <header class="panel-header">
      <button type="button" data-panel-back>${stack.length > 1 ? 'Back' : 'Close'}</button>
      <div>
        <h2>${escapeHtml(current.title)}</h2>
        <p>${escapeHtml(current.subtitle)}</p>
      </div>
    </header>
    ${renderTabs(current)}
    <section class="panel-body">
      <div class="panel-screen is-${direction === 'pop' ? 'leaving' : 'entering'}">
        ${current.renderBody(current)}
      </div>
    </section>
    <footer class="panel-footer">
      ${current.renderFooter(current)}
    </footer>
  `;
}

function renderTabs(screen) {
  if (!screen.tabs.length) return '';

  return `
    <nav class="panel-tabs">
      ${screen.tabs.map(tab => `
        <button
          type="button"
          data-panel-tab="${escapeHtml(tab.id)}"
          class="${tab.id === screen.activeTab ? 'is-active' : ''}"
        >
          ${escapeHtml(tab.label)}
        </button>
      `).join('')}
    </nav>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('click', event => {
  const back = event.target.closest('[data-panel-back]');
  if (back) {
    popScreen();
    return;
  }

  const tab = event.target.closest('[data-panel-tab]');
  if (tab && stack.length) {
    const current = stack[stack.length - 1];
    current.activeTab = tab.dataset.panelTab;
    reloadScreen();
  }
});
```

Example screen usage:

```js
function openUpdateUser(user) {
  pushScreen(createScreen({
    id: `user:${user.id}`,
    title: `Update ${user.name}`,
    subtitle: 'User profile',
    tabs: [
      { id: 'details', label: 'Details' },
      { id: 'permissions', label: 'Permissions' }
    ],
    activeTab: 'details',
    renderBody(screen) {
      if (screen.activeTab === 'permissions') {
        return `<button type="button" data-action="add-permission">Add Permission</button>`;
      }

      return `<label>Name <input value="${escapeHtml(user.name)}"></label>`;
    },
    renderFooter() {
      return `<button type="button" data-action="save-user">Save</button>`;
    }
  }));
}

document.addEventListener('click', event => {
  const addPermission = event.target.closest('[data-action="add-permission"]');
  if (!addPermission) return;

  pushScreen(createScreen({
    title: 'Add Permission',
    subtitle: 'Nested editor',
    renderBody() {
      return `<label>Permission <input placeholder="admin.users.write"></label>`;
    },
    renderFooter() {
      return `
        <button type="button" data-panel-back>Cancel</button>
        <button type="button" data-action="save-permission">Save</button>
      `;
    }
  }));
});
```

## AI Guidance

When generating this UI, preserve these rules:

- Do not convert right panel edits into centered modals.
- Do not open the panel on initial page load unless the product explicitly deep-links into a task.
- Do not treat the panel as one static drawer; it is a mobile-style screen stack.
- Do not keep picker option lists permanently visible in parent forms.
- Do not hide the desktop context unless the viewport is narrow.
- Do not make nested screens carry unrelated parent tabs.
- Do not rely on animation alone to convey state.
- Keep table-like main content horizontally scrollable when columns can exceed the viewport.
- Keep task actions in the panel footer when they apply to the current screen.
