# `setViewProps`

`setViewProps` copies the request, response, session, brand, language, and view
config shape into the response data that Reactus-backed views read.

## Import

```ts
import { setViewProps } from 'stackpress/view';
```

## Usage

Call `setViewProps(req, res, ctx)` at the end of a page handler after request
data and response data have been prepared.

```ts
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async ({ req, res, ctx }) => {
  res.data.set('title', 'Home');
  setViewProps(req, res, ctx);
});
```

This example prepares one response value and then exposes the standard server
props to the view. Without this handoff, hooks such as `useServer()` and
`useResponse()` may not see the expected page data.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `req` | `Request` | Stackpress/Ingest request object. |
| `res` | `Response` | Stackpress/Ingest response object. |
| `ctx` | `Server` | Current server context. |

**Returns** nothing meaningful for callers. The useful effect is mutation of
response data for view rendering.

## Related

 - [View Module](../view.md)
 - [View Client Hooks](./hooks.md)
