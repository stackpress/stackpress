# 153 Layouts

Choose a Stackpress layout and keep provider-dependent hooks inside the layout boundary. The same idea shows up through inspectable project surfaces.

**Previously:** The previous lesson, `152 Server Props`, gave you the setup this page builds on. Here, the focus shifts to `Layouts` so you can place the next Stackpress surface in the course path.

## 153.1. What Layouts Do

A page shell is more than decoration. In Stackpress, layouts also create the provider boundary that lets child components read response data, config, session, language, theme, and notifications safely.

## 153.2. Where Layouts Live

Use a layout in the page entry:

```tsx
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel } from 'stackpress/view/client';

export function Body() {
  return <main>Page content</main>;
}

export default function Page(props: ServerConfigPageProps) {
  const { data, session, request, response } = props;

  return (
    <LayoutPanel
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutPanel>
  );
}
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

## 153.3. Wrap A Page

`LayoutPanel` receives server props and creates context providers. `Body` is rendered under those providers, so hooks inside `Body` can read the current server, theme, language, notifier, request, response, and session state.

## 153.4. Shared UI Boundaries

This part of the Layouts workflow is easier to follow when the smaller pieces are compared together. The subsections cover Layout Boundary, `LayoutBlank`, `LayoutPanel`, Move Hook Logic Into `Body`, so the reader can see how each piece changes the local decision.

### 153.4.1. Layout Boundary

The layout boundary is the point where provider-backed hooks become safe to use. Keep the idea tied to the concrete project surface in this section.

### 153.4.2. `LayoutBlank`

Use a blank layout when the page should have minimal chrome, such as a simple public page or custom shell. The example gives the decision enough context to evaluate it.

### 153.4.3. `LayoutPanel`

Use a panel layout when the page should use the standard Stackpress shell and provider setup. Use the check to make the idea visible before moving to the next topic.

### 153.4.4. Move Hook Logic Into `Body`

If a hook does not work in `Page`, move it into `Body` or a child component rendered inside the layout. The examples stay practical by tying the idea to something you can run, change, or verify.

### 153.4.5. Pass All Server Props

Pass `data`, `session`, `request`, and `response` through the layout so child hooks see the same server state. That context prepares the reader for the more specific form that follows.

### 153.4.6. Add Shared Page Chrome

Put app-level page chrome in the layout or a child component used by many pages, not in every page body. Keep the idea tied to the concrete project surface in this section.

## 153.5. Next Step

Before moving on, connect Layouts to the files, commands, generated output, or runtime behavior around it. The nearby example or check shows the project detail affected by this idea.

Read `154 Language` and `155 Theme` to use two common layout-provided contexts. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `154 Language`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
