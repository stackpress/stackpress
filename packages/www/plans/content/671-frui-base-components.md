# 671 frui Base Components

Use base UI components such as buttons, alerts, breadcrumbs, dialogs, dropdowns, tabs, tables, and notifications. Keep that role in mind as the lesson moves into the concrete shape.

**Previously:** The previous lesson, `662 useLanguage`, gave you the setup this page builds on. Here, the focus shifts to `frui Base Components` so you can place the next Stackpress surface in the course path.

## 671.1. Use Case

UI components save time when they match the patterns the app already uses. Base components give you reusable building blocks without rebuilding common controls from scratch.

## 671.2. Minimal Component

Use browser-safe Stackpress view exports for app views:

```tsx
import { LayoutPanel, notify } from 'stackpress/view/client';
```

Use `frui` imports when the component is part of the app's supported client bundle:

```tsx
import Button from 'frui/Button';
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

## 671.3. Props And State

You selected shared UI pieces instead of creating one-off markup for common controls. The nearby example or check shows the project detail affected by this idea.

## 671.4. Common Patterns

This part of the frui Base Components workflow is easier to follow when the smaller pieces are compared together. The subsections cover Base Component, Browser-Safe Import, Generated Admin Usage, so the reader can see how each piece changes the local decision.

### 671.4.1. Base Component

Base components are reusable UI primitives such as buttons, tables, alerts, and tabs. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 671.4.2. Browser-Safe Import

Use `stackpress/view/client` for browser-facing Stackpress hooks and layout helpers. The local example shows why that choice matters in an app.

### 671.4.3. Generated Admin Usage

Generated admin views use `frui` components for forms, tables, notifications, and navigation. Compare the concrete details to see the practical meaning.

## 671.5. Mistakes To Avoid

Base component mistakes usually come from rebuilding shared behavior by hand. Use components when consistency matters, and use plain markup only when the element is truly local and simple.

### 671.5.1. Hand-Build A Common Button

```tsx
<button className="primary rounded px-3 py-2">Save</button>
```

This may look fine once, but it can drift from the rest of the app. Use a component when behavior or styling should match other buttons across the project.

### 671.5.2. Recreate Tables Differently On Every Page

```tsx
<table>{rows.map(row => <tr><td>{row.name}</td></tr>)}</table>
```

Hand-built tables become hard to keep consistent when sorting, empty states, and actions are added. Use table components for repeated records instead of rebuilding unrelated table markup each time.

### 671.5.3. Bypass Notification Helpers

```tsx
<div className="toast">Saved.</div>
```

This creates one local message, but it does not share behavior with the rest of the app. Use notifier helpers for user-facing messages so success and error feedback stay consistent.

## 671.6. Reference Pointers

Use frui Base Components as a guide for choosing which file, command, or generated output to inspect next. The nearby example or check shows the project detail affected by this idea.

**Next step:** Read `672 frui Form Components` and `673 frui View Components` for schema-driven form and display pieces. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `672 frui Form Components`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
