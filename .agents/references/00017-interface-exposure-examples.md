# Interface Exposure Examples

Use these recipes to expose an existing Stackpress event through a handwritten
page, configured API endpoint, or MCP tool. The event remains capability
authority; each interface adds its own input, identity, and output contract.

## Handwritten Page And View

Register data and view handlers during `route`:

```ts
import type { HttpServer } from 'stackpress/server';

export default function plugin(server: HttpServer) {
  server.on('route', () => {
    server.import.get('/', () => import('./pages/home.js'));
    server.view.get('/', '@/plugins/app/views/home');
  });
}
```

The page handler invokes the reusable capability and adds browser-safe config:

```ts
import { action } from 'stackpress/server';
import { setViewProps } from 'stackpress/view';

export default action(async ({ req, res, ctx }) => {
  req.data.set('status', 'PUBLISHED');
  await ctx.emit('article-search', req, res);
  setViewProps(req, res, ctx);
});
```

The React page reads the serialized response:

```tsx
import type { ServerConfigPageProps } from 'stackpress/view/client';
import { LayoutPanel, useResponse } from 'stackpress/view/client';

export function Body() {
  const rows = useResponse<Article[]>().results || [];
  return <main>{rows.map(row => (
    <a key={row.id} href={`/articles/${row.slug}`}>{row.title}</a>
  ))}</main>;
}
export function Head({ styles = [] }: ServerConfigPageProps) {
  return <><title>Articles</title>{styles.map(href => (
    <link key={href} rel="stylesheet" href={href} />
  ))}</>;
}
export default function Page(props: ServerConfigPageProps) {
  return <LayoutPanel {...props}><Body /></LayoutPanel>;
}
```

Import handlers establish data/status; view handlers render later by priority.
Keep snapshots serializable and free of secrets/native resources. Sanitize HTML
before using `dangerouslySetInnerHTML`. Verify SSR, hydration, keyboard behavior,
responsive layout, error/empty states, and authorization.

## API Endpoint Over An Event

```ts
api: {
  scopes: { articles: { name: 'Articles', description: 'Read articles' } },
  endpoints: [{
    method: 'GET',
    route: '/api/articles',
    type: 'app',
    scopes: ['articles'],
    event: 'article-search',
    cors: ['https://example.com'],
    data: { status: 'PUBLISHED' }
  }]
}
```

`public` skips app/session identity; `app` resolves application credentials and
scopes; `session` resolves user session and scopes. Non-GET app/session requests
also compare the supplied secret. Endpoint fixed data is merged before event
invocation.

Verify OPTIONS and actual CORS headers, unlisted origins, missing/malformed/
invalid credentials, inactive or expired identity behavior, scope denial,
request-vs-fixed-data precedence, event errors, status mapping, and output shape.
Configured endpoint scope does not authorize direct calls to the event elsewhere.

## MCP Tool Over The Same Event

```ts
mcp: {
  route: '/mcp',
  mode: 'stateful',
  tools: [{
    name: 'article_search',
    title: 'Search Articles',
    description: 'Find published articles.',
    type: 'public',
    method: 'GET',
    event: 'article-search',
    input: {
      type: 'object',
      properties: { q: { type: 'string' } }
    },
    data: { status: 'PUBLISHED' }
  }]
}
```

Load `stackpress-ai` explicitly. It activates only when `mcp` config exists,
normalizes tools, converts JSON Schema to runtime validation, filters listing and
calls by `public`/`app`/`user` identity and scopes, merges fixed/caller/auth data,
then resolves the event. Plugin-mode generated tools attach their resolver events
from the generated client during `listen`.

Verify tool listing and calls for every identity class, invalid JSON Schema
payloads, scope denial, fixed-data precedence, target event authorization,
status/error conversion, stateful session reuse or stateless isolation, and
transport shutdown. MCP edge policy does not make the event safe on other edges.

## Cross-Surface Consistency

When one event is exposed through pages, API, and MCP, compare:

| Concern | Page | API | MCP |
| --- | --- | --- | --- |
| identity | session/request guard | public/app/session token | public/app/user auth context |
| validation | handler/generated action | endpoint + event | JSON Schema + event |
| output | SSR snapshot/HTML | HTTP status/JSON | MCP tool result text/schema |
| errors | error event/view | status envelope | tool error/result conversion |
| policy | route permissions | endpoint scopes | tool visibility/scopes |

Do not assume these policies are synchronized automatically. Reuse the event for
mechanism, then test each adapter's caller and protocol contract independently.

## Source Anchors And Authority

Anchors: maintained blog/store app handlers/views, API plugin endpoint adapters,
AI tool normalization/registration/transports, view rendering contract, session
authorization, and generated model events. Examples demonstrate current paths;
owning source contracts remain authority.
