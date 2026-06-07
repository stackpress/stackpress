# 152 Server Props

Pass route data into a React view and read `data`, `session`, `request`, `response`, and `styles` from the right place. The following example gives the idea a concrete project shape.

**Previously:** The previous lesson, `151 First React Page`, gave you the setup this page builds on. Here, the focus shifts to `Server Props` so you can place the next Stackpress surface in the course path.

## 152.1. Use Case

A page often needs values from the server before React can render it. Server props are the handoff: the route prepares results and view data, then the component reads them through the view provider.

## 152.2. Minimal Server Props

Set route output:

```ts
export default action(async function HomePage({ res }) {
  res.results({ title: 'Hello Stackpress' });
  res.data.set('page', { eyebrow: 'First page' });
});
```

Read it in the view:

```tsx
import { useConfig, useResponse } from 'stackpress/view/client';

export function Body() {
  const config = useConfig();
  const response = useResponse<{ title: string }>();

  return (
    <main>
      <p>{config.get('page.eyebrow')}</p>
      <h1>{response.results?.title}</h1>
    </main>
  );
}
```

This example ties the concept to an actual Stackpress shape. Notice how the file or helper creates behavior the app can later run, inspect, or generate from.

## 152.3. Load Data

`res.results(...)` became the main response payload. `res.data.set(...)` became view-facing data. The view reads both through provider-backed hooks.

## 152.4. Pass Data To The View

This part of the Server Props workflow is easier to follow when the smaller pieces are compared together. The subsections cover `data`, `session`, `request`, and `response`, so the reader can see how each piece changes the local decision.

### 152.4.1. `data`

Use `data` for config-like page props, shared brand values, language values, and layout state. Keep the idea tied to the concrete project surface in this section.

### 152.4.2. `session`

Use `session` for current visitor or signed-in profile state. That is why this detail appears in the lesson before reference material.

### 152.4.3. `request`

Use `request` when the view needs to know route, query, or request metadata. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 152.4.4. `response`

Use `response` for the main route outcome: results, status, and errors. The same idea shows up through inspectable project surfaces.

### 152.4.5. `styles`

Use `styles` in `Head` when Stackpress passes generated stylesheet URLs for the page. The nearby check shows the project-level consequence.

## 152.5. Mistakes To Avoid

Server prop mistakes usually come from reading response data in the wrong layer. The page body can use hooks, while metadata helpers should use the props they receive.

### 152.5.1. Read Results Outside The Provider

```tsx
const response = useResponse<{ title: string }>();
return <h1>{response.results?.title}</h1>;
```

This shape is valid only inside a component rendered below the response provider. If the component is outside that boundary, pass the value as a prop or move the read into the page body.

### 152.5.2. Use A Hook In `Head`

```tsx
export function Head() {
  const response = useResponse<{ title: string }>();
  return <title>{response.results?.title}</title>;
}
```

`Head` should read metadata from its received props instead of relying on hooks. When metadata depends on the route result, read it from `props.response` inside `Head`.

### 152.5.3. Move Provider Hooks Above The Layout

```tsx
const session = useSession();
```

Hooks such as `useResponse()`, `useConfig()`, `useSession()`, and `useLanguage()` depend on provider context. Keep them inside components rendered below the layout or provider that supplies the value.

## 152.6. Reference Pointers

The useful shift is recognizing Server Props as a pattern in files, commands, and runtime behavior. That is why this detail appears in the lesson before reference material.

**Next step:** Read `153 Layouts` to understand the provider boundary. For exact hook exports, use [View Client API](/reference/view-client). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `153 Layouts`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
