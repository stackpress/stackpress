# 151 First React Page

Render the first React page with a `Page` component, optional `Head`, and a `Body` component below the layout provider. The same idea shows up through inspectable project surfaces.

**Previously:** The previous lesson, `141 Terminal Events`, gave you the setup this page builds on. Here, the focus shifts to `First React Page` so you can place the next Stackpress surface in the course path.

## 151.1. Goal

Plain text proves the server works, but real pages need HTML and components. This lesson moves the first route from a raw response into a React view so the browser can render app UI.

## 151.2. Create The View

Create a view file:

```tsx
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutBlank } from 'stackpress/view/client';

export function Head() {
  return <title>Hello Stackpress</title>;
}

export function Body() {
  return <main>Hello from React</main>;
}

export function Page(props: ServerConfigPageProps) {
  const { data, session, request, response } = props;

  return (
    <LayoutBlank
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </LayoutBlank>
  );
}

export default Page;
```

Register the route and view:

```ts
server.import.get('/', () => import('./pages/home.js'));
server.view.get('/', '@/plugins/app/views/home');
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

## 151.3. Add The Route

The route handler prepares the response. The view file renders the page. Stackpress connects them by matching the route and view registration.

## 151.4. Render Data

This part of the First React Page workflow is easier to follow when the smaller pieces are compared together. The subsections cover `Page`, `Head`, `Body`, so the reader can see how each piece changes the local decision.

### 151.4.1. `Page`

`Page` is the default export and the page entry component Stackpress renders. Keep the idea tied to the concrete project surface in this section.

### 151.4.2. `Head`

`Head` is optional. Use it for page-specific `<title>`, metadata, icons, and stylesheet links.

### 151.4.3. `Body`

`Body` renders the actual page content below the layout provider. Put provider-dependent hooks in `Body` or its children, not in the component creating the provider.

## 151.5. Check In Browser

This part of the First React Page workflow is easier to follow when the smaller pieces are compared together. The subsections cover Add A Title, Keep The Page Entry Thin, Verify The View, so the reader can see how each piece changes the local decision.

### 151.5.1. Add A Title

```tsx
export function Head() {
  return <title>Articles</title>;
}
```

Read the example by finding the helper first, then the value or file it acts on. That habit makes the code easier to scan when the same pattern appears in a larger app.

### 151.5.2. Keep The Page Entry Thin

Use `Page` to choose the layout and pass props. Move content and hooks into `Body`.

### 151.5.3. Verify The View

Open the route in a browser. If the route works but the view does not render, check both `server.import.get(...)` and `server.view.get(...)`.

## 151.6. What The Page Owns

The important checkpoint is knowing where First React Page belongs in the Stackpress workflow. The example gives the decision enough context to evaluate it.

Read `152 Server Props` to pass route data into the page. For view APIs, use [View Client API](/reference/view-client). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `152 Server Props`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
