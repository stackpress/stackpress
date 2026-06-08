# View Client Hooks

The client hooks from `stackpress/view/client` read server-provided request,
response, config, session, and server props inside React views.

## Import

```ts
import {
  useConfig,
  useRequest,
  useResponse,
  useServer,
  useSession
} from 'stackpress/view/client';
```

## Hooks

| Hook | Returns | Use It For |
| --- | --- | --- |
| `useRequest<I>()` | Request props | Reading request data passed to the view. |
| `useResponse<O>()` | Response props | Reading results, status, errors, or response data. |
| `useConfig<C>()` | Config props | Reading shared config and view props. |
| `useSession()` | Session props | Reading the current signed-in user/session state. |
| `useServer<C, I, O>()` | Full server props | Reading config, request, response, and session together. |

## Example

```tsx
import { useResponse } from 'stackpress/view/client';

type Article = { id: string; title: string };

export function Body() {
  const response = useResponse<Article[]>();
  const rows = response.results || [];
  return rows.map(row => <h2 key={row.id}>{row.title}</h2>);
}
```

This example reads route-prepared response results. The view does not query the
database directly; it renders the response payload provided by the server.

## Related

 - [View Client](../view-client.md)
 - [setViewProps](./setViewProps.md)
