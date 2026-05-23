# 03. First Project Shape

This tutorial gives the app its first realistic structure without adding schema or SQL yet.

## 1. Overview

In this step you will:

 - create `config.ts`
 - move startup into a bootstrap file
 - refactor the plugin to use `listen` and `route` listeners
 - add an error page
 - add a `develop` script to `package.json` last

The visible goal is the same page working through a cleaner, config-driven startup path.

## 2. Setting Up / Coding

Create `config.ts`:

```ts
import { server as http } from 'stackpress/http';

export const config = {
  server: {
    mode: 'development'
  }
};

export default async function bootstrap() {
  const server = http();
  server.config.set(config);
  await server.bootstrap();
  await server.resolve('listen');
  await server.resolve('route');
  return server;
}
```

This file becomes the single bootstrap entry for the app. It creates the server, loads config, and resolves the lifecycle listeners you are about to define in the plugin.

Update `plugin.ts`:

```ts
import type { HttpServer } from 'stackpress/http';

export default function plugin(server: HttpServer) {
  server.on('listen', async _ => {
    server.on('error', () => import('./pages/error.js'));
  });

  server.on('route', async _ => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/views/home');
  });
}
```

Create `pages/error.ts`:

```ts
import { action } from 'stackpress/server';

export default action(async function ErrorPage({ req, res, ctx }) {
  if (req.method.toUpperCase() !== 'GET' || res.body) {
    return;
  }

  const html = await ctx.view.render('@/views/error', {
    data: res.data(),
    response: {
      ...res.toStatusResponse(),
      error: res.error || 'Some error message'
    }
  });

  if (typeof html === 'string') {
    res.html(html, res.code, res.status);
  }
});
```

Create `views/error.tsx`:

```tsx
type ErrorPageProps = {
  response: {
    error?: string;
  };
};

export default function ErrorPage({ response }: ErrorPageProps) {
  return (
    <main>
      <h1>{response.error || 'Some error message'}</h1>
    </main>
  );
}
```

Now update `package.json` last by adding the develop script:

```json
{
  "scripts": {
    "develop": "stackpress develop --b config -v"
  }
}
```

Command guide:

 - `stackpress develop --b config -v` starts the app through `config.ts`
 - `--b config` tells Stackpress which bootstrap module to load
 - `-v` keeps verbose logging on while you are still learning the lifecycle

## 3. Viewing Results

Run:

```bash
npm run develop
```

Command guide:

 - `npm run develop` now runs the same development server through the script you just added
 - using a script is the first step toward a repeatable app workflow

Open the home route again. Success means the same page still renders, but now the app is booting through `config.ts` and the plugin uses lifecycle listeners.

## 4. What Was Learned

You now have a cleaner Stackpress project shape:

 - startup moved into `config.ts`
 - route registration moved under a `route` listener
 - error handling started under a `listen` listener
 - the project now has a scripted startup path
 - the error view now reads `response.error` from rendered props instead of relying on an inline fallback

The user-facing output barely changed, but the internal structure is much closer to how a real Stackpress app grows.
