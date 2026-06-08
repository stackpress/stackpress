# 450 Netlify

Prepare a Stackpress or Ingest app for Netlify by matching the app's runtime shape to Netlify Functions. This lesson uses the Ingest Netlify example, so the focus stays on the real files that define the build command, redirect, function folder, and handler adapter.

**Previously:** The previous course, `Vercel`, showed a provider entrypoint that sends every method to one shared WHATWG handler. Netlify solves a similar problem, but its configuration and function return shape are different.

## 450.1. The Deployment Problem

Netlify needs to know where functions live, which command builds the project, and how browser requests should reach the function. The app still wants to think in routes, handlers, and responses, so the deployment layer has to translate between those two worlds.

Think of the Netlify function as a front desk. It receives the platform's event shape, creates a request the app understands, asks the app for a response, and returns a plain object Netlify can send back.

## 450.2. The Example Project Shape

The Netlify example uses `tsc` through a Yarn build command. Its `netlify.toml` also marks `@stackpress/ingest` as an external module, sets the function folder to `src`, and redirects all paths to one handler.

```toml
[functions]
external_node_modules = ["@stackpress/ingest"]

[build]
command = "yarn build"
environment = { NODE_VERSION = "20" }
functions = "src"

[[redirects]]
from = "/*"
to = "/.netlify/functions/handler"
status = 200
```

This example shows the Netlify-specific pieces in one place. The build command compiles the project, `functions = "src"` tells Netlify where to look for functions, and the redirect sends every browser path to the handler function.

## 450.3. The Netlify Handler

The handler imports the WHATWG runtime and route modules. Inside the function, it creates an app, bootstraps it, mounts the routes, converts the Netlify event into a native `Request`, and passes that request to `app.handle()`.

```ts
import { server } from '@stackpress/ingest/whatwg';
import pages from '../routes/pages';
import user from '../routes/user';
import tests from '../routes/tests';
import hooks from '../routes/hooks';

export async function handler(event: any, context: any) {
  const app = server();
  await app.bootstrap();

  app.use(pages).use(user).use(hooks).use(tests);

  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers,
  });

  const response = await app.handle(request, undefined);

  return {
    statusCode: response?.status,
    headers: response?.headers
      ? Object.fromEntries(response.headers.entries())
      : {},
    body: await response?.text(),
    isBase64Encoded: false,
  };
}
```

This example is the full adapter lesson. The top half prepares the app and creates the request, while the bottom half turns the app's response into the object shape Netlify Functions expects.

## 450.4. What Changed From Vercel

Vercel's example exports a method handler for each HTTP method. Netlify's example exports one `handler(event, context)` function and uses `event.rawUrl`, `event.httpMethod`, and `event.headers` to create a native request.

The response side is different too. Vercel can work with the native response returned by the WHATWG handler, while the Netlify example returns `{ statusCode, headers, body, isBase64Encoded }`.

## 450.5. What To Verify

Start by verifying the configuration file because Netlify reads it before your app logic matters. Confirm the build command, function directory, external modules, and redirect target match the files in the project.

Then verify the handler behavior. Test a page route and a route that returns structured data, because the adapter has to preserve status, headers, and body text when it converts the app response into Netlify's function result.

**Learning checkpoint:** Before moving on, make sure you can explain how Netlify's event becomes a native `Request`, and how the app response becomes a Netlify function return value. You should also be able to point to the redirect that sends all paths to the handler.

**Next course:** Continue with `Lambda / Serverless`. That course widens the same adapter idea to AWS Lambda and other serverless targets.
