# 460 Lambda / Serverless

Package a Stackpress or Ingest handler for a serverless target by understanding the adapter boundary. This lesson uses the Lambda example as a source, but it also calls out where that example is incomplete so students do not mistake a static response for a full app bridge.

**Previously:** The previous course, `Netlify`, showed a complete function adapter that converts a platform event into a native `Request` and converts the app response back into the platform result. Lambda follows the same idea, but the checked example currently demonstrates only part of that path.

## 460.1. The Serverless Problem

Serverless functions change the shape of runtime thinking. Instead of starting one process that listens forever, the platform calls a handler whenever a request reaches the function.

That makes the handler boundary very important. The function receives a platform event, the app needs a request shape it understands, and the function must return the exact response shape the platform expects.

## 460.2. The Example Project Shape

The Lambda example uses TypeScript compilation and a local development mode. Its `package.json` includes a `build` script that runs `tsc`, plus a `dev` script that starts the local server path with `LAMBDA_LOCAL=true`.

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "LAMBDA_LOCAL=true ts-node index.ts"
  }
}
```

This example tells you that the source is still using normal TypeScript output. The local mode is separate from the deployed function path, which is useful when you want to test the route behavior before packaging the Lambda handler.

## 460.3. The App Runtime In The Example

The example creates an Ingest app with the WHATWG runtime and registers a simple route. The local testing branch starts a normal server only when `LAMBDA_LOCAL` is set.

```ts
import { server } from '@stackpress/ingest/whatwg';

const app = server();

app.get('/', ({ req, res }) => {
  res.html('<h1>Hello, World from Lambda!</h1>');
});

if (process.env.LAMBDA_LOCAL === 'true') {
  app.create().listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}
```

This example shows two useful ideas. The route is still written like app code, while the local branch gives developers a way to run the app without deploying to AWS for every small change.

## 460.4. The Handler Boundary

The exported Lambda handler has to return an `APIGatewayProxyResult`. In the checked example, that handler returns a static HTML response instead of calling `app.handle()`.

```ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: '<h1>Hello, World from Lambda!</h1>',
  };
};
```

This example is useful for learning the Lambda return shape, but it is not a complete Stackpress or Ingest adapter. A full adapter would need to convert `APIGatewayProxyEvent` into a request the app can handle, call the app, then convert the app response back into `APIGatewayProxyResult`.

## 460.5. The Complete Adapter Pattern

The deploy guide shows the shape a complete event-driven adapter is aiming for. The platform event is translated into a WHATWG `Request`, the app handles that request, and the returned WHATWG `Response` is translated back into the platform response shape.

```ts
import { server } from '@stackpress/ingest/whatwg';

export async function handler(event: any) {
  const app = server();
  await app.bootstrap();

  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers
  });

  const response = await app.handle(request, undefined);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text()
  };
}
```

This example is not a drop-in AWS Lambda adapter because real Lambda event fields depend on the API Gateway mode and runtime configuration. It is still the important pattern: convert the platform event into the app's request shape, let the app route the request, then convert the app response back to the host's expected object.

The WHATWG adapter source and tests show the route lifecycle that sits inside that pattern. `Adapter.plug(context, request, action)` builds an Ingest request, loads the body, emits the matching route event, and dispatches the response as a WHATWG `Response`.

```ts
const response = await Adapter.plug(server as never, resource, 'GET /users/42');
```

This test example proves that the adapter is not only returning static HTML. It sends a real `Request` through a registered route, loads form data, merges route params, and produces a response from the route handler.

## 460.6. What A Complete Adapter Must Answer

A complete serverless adapter has to answer a few practical questions before it is reliable. Which event fields become the URL, method, headers, cookies, and body, and how should binary responses or streamed responses be handled?

It also has to decide when the app is created and bootstrapped. Creating the app outside the handler can reuse work across warm invocations, while creating it inside the handler can make startup behavior easier to reason about at the cost of repeated setup.

## 460.7. Mistakes To Avoid

Lambda mistakes usually come from proving the function can answer, then
assuming the app runtime also ran. Keep the static host response, app route,
request conversion, and response conversion as separate checks.

### 460.7.1. Treat Static HTML As App Routing

```ts
export const handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: '<h1>Hello, World from Lambda!</h1>',
  };
};
```

This example bypasses the app entirely. It can be useful while learning the host response shape, but it should not be documented as a complete Stackpress deployment path.

### 460.7.2. Copy The Generic Adapter Sketch As AWS Code

```ts
const request = new Request(event.rawUrl, {
  method: event.httpMethod,
  headers: event.headers
});
```

This example is a teaching sketch, not a compatibility promise. Before using it in production, verify the actual event payload and write the conversion from the fields your platform sends.

### 460.7.3. Forget To Let The App Handle The Request

```ts
const app = server();
await app.bootstrap();
return {
  statusCode: 200,
  body: 'OK'
};
```

This creates and bootstraps the app, but it still does not pass a request into
`app.handle(...)`. A complete adapter has to convert the platform event into a
request, let the app route that request, and convert the app response back into
the platform result.

## 460.8. What To Verify

Verify the example in two layers. First, run the local mode and confirm the app route responds, because that proves the route itself is valid before Lambda packaging enters the picture.

Then inspect the exported handler and confirm what it actually returns. Until the handler creates a request, calls the app runtime or WHATWG adapter, and converts the response back, a successful Lambda response only proves the function can return static HTML.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between a static Lambda response and a complete app adapter. You should also know that a complete adapter must translate both request input and response output.

**Next course:** Continue with `Project Structure`. That course returns to the local project layout so you can connect source files, generated files, and runtime entrypoints more confidently.
