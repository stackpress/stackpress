# 440 Vercel

Prepare a Stackpress or Ingest app for Vercel by matching the app's runtime shape to Vercel's function entrypoint. This lesson uses the Ingest Vercel example as the source, so it teaches the concrete adapter pattern instead of a generic deployment checklist.

**Previously:** The previous course, `Local Production`, covered the confirmed local build and serve path. This page moves forward with the confirmed Vercel example and focuses on the provider boundary that source clearly shows.

## 440.1. The Deployment Problem

Vercel does not need your route handlers to know that they are on Vercel. It needs a function entrypoint that can receive platform requests, pass them into the app, and return a response Vercel can send back to the browser.

That is the main teaching point for this page. Keep the app behavior inside routes and plugins, then keep the provider-specific shape at the deployment boundary.

## 440.2. The Example Project Shape

The Vercel example uses TypeScript compilation as its build step. Its `package.json` defines `build` as `tsc`, along with Vercel commands for preview, development, and production deploy.

```json
{
  "scripts": {
    "build": "tsc",
    "deploy": "vercel --prod",
    "preview": "vercel",
    "develop": "vercel dev"
  }
}
```

This example tells you that the source is not showing a custom Stackpress bundler command. The project is compiled with TypeScript, then Vercel runs the function entrypoint that points back into the app.

The same example includes a `vercel.json` rewrite:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/:path*", "destination": "/api/handle" }
  ]
}
```

This rewrite sends every incoming path to `/api/handle`. That means the app can keep route matching inside Ingest instead of asking Vercel to define every application route one by one.

## 440.3. The Vercel Handler

The `api/handle.ts` file exports one handler for each HTTP method. Each exported method points to the same shared `handle` function from the app's script folder.

```ts
import handle from '../src/scripts/handle';

export const CONNECT = handle;
export const DELETE = handle;
export const GET = handle;
export const HEAD = handle;
export const OPTIONS = handle;
export const PATCH = handle;
export const POST = handle;
export const PUT = handle;
export const TRACE = handle;
```

This example keeps the method list explicit. When Vercel receives a request, the matching method export gives Vercel a function to call, and that function delegates the real app work to the shared handler.

The shared handler uses the WHATWG runtime:

```ts
import { server } from '@stackpress/ingest/whatwg';

export default async function handle(request: Request) {
  const app = server({ cwd: process.cwd() });
  await app.bootstrap();
  return app.handle(request, undefined);
}
```

This example creates a new app, bootstraps it, and passes the native `Request` into `app.handle()`. The important part is the boundary: Vercel calls a function, the function builds the app runtime, and the app returns a native response.

## 440.4. Where App Behavior Still Lives

The provider handler is intentionally small because the app behavior belongs in plugins and routes. In the example, the plugin loads config, uses route modules, registers project data, and listens for requests.

```ts
export default function plugin(server: Server) {
  server.config.set(config);
  server.use(pages).use(tests).use(user).use(hooks);
  server.register('project', { welcome: 'Hello, World!!' });
  server.on('request', ({ req, res }) => {
    console.log('Request:', req.url);
  });
}
```

This example shows the split between provider code and app code. Vercel-specific files get the request into the app, while the plugin remains the place where the app composes config, routes, shared data, and lifecycle listeners.

## 440.5. What To Verify

Before treating this as a finished deployment, verify the same pieces the example depends on. Run the TypeScript build, confirm the Vercel rewrite points to `/api/handle`, and check that each HTTP method you need is exported from the handler file.

After deployment, test more than the home page. Open a normal page route, call an action or API-style route if the app has one, and check logs so you can prove the Vercel function reached the Stackpress or Ingest app.

**Learning checkpoint:** Before moving on, make sure you can explain why the Vercel example uses a rewrite, method exports, and the WHATWG runtime. You should also be able to point to the small boundary where Vercel ends and the app begins.

**Next course:** Continue with `Netlify`. That course teaches a similar provider boundary with Netlify's function and redirect shape.
