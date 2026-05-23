# 02. First React Page

This tutorial upgrades the hello-world route into a real React-rendered page.

## 1. Overview

In this step you will:

 - keep the project from tutorial 1
 - add a page handler file
 - add a React view file
 - update the plugin to point the route at the page and view
 - add `stackpress-server` and `stackpress-view` to the plugin list last

The visible goal is that `/` renders a React page instead of plain text.

## 2. Setting Up / Coding

Create folders:

```bash
mkdir -p pages views
```

Command guide:

 - `mkdir -p pages views` creates the folders for the page handler and React view files
 - `-p` makes sure the command succeeds even if part of the path already exists

Replace `plugin.ts` with:

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.import.get('/', () => import('./pages/home.js'));
  server.view.get('/', '@/views/home');
}
```

Create `pages/home.ts`:

```ts
import { action } from 'stackpress/server';

export default action(async function HomePage({ res }) {
  res.data.set('user', 'John');
});
```

Create `views/home.tsx`:

```tsx
type HomePageProps = {
  data: {
    user: string;
  };
};

export default function Home({ data }: HomePageProps) {
  return (
    <main>
      <h1>Hello Stackpress</h1>
      <p>Your first React page is rendering for {data.user}.</p>
    </main>
  );
}
```

Now update `package.json` last so the plugin list becomes:

```json
{
  "plugins": [
    "./plugin",
    "stackpress-server",
    "stackpress-view"
  ]
}
```

Command guide:

 - no new install command is needed here because `stackpress` is already installed
 - adding `stackpress-server` and `stackpress-view` to the plugin list turns on the server and view capabilities for this app

## 3. Viewing Results

Run:

```bash
npx stackpress develop -v
```

Command guide:

 - `npx stackpress develop -v` runs the same development command as tutorial 1
 - this time it also loads the server and view plugins you just registered

Open the home route again. Success means you now see a rendered HTML page with:

 - `Hello Stackpress`
 - `Your first React page is rendering for John.`

## 4. What Was Learned

You moved from a plain text route to a real view layer.

This step introduced:

 - a page handler file
 - a React view file
 - the server and view plugin packages
 - the first props-style handler signature: `({ req, res, ctx })`
 - the first `res.data.set(...)` flow from page handler into view props

The app is still small, but it now has the basic route-plus-view shape of a real Stackpress project.
